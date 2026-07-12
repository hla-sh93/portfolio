import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(3, "1 h"), 
// });

export async function POST(req: Request) {
  try {
    // 1. Rate limiting (skip in dev if not set up)
    // const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    // const { success } = await ratelimit.limit(`contact_${ip}`);
    // if (!success) {
    //   return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    // }

    const body = await req.json();

    // 2. Honeypot check
    if (body.website) {
      // Silent success for bots
      return NextResponse.json({ success: true, message: "Message received" }, { status: 200 });
    }

    // 3. Validate input
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const data = parsed.data;

    // 4. Verify reCAPTCHA
    if (process.env.RECAPTCHA_SECRET_KEY && data.recaptchaToken !== "dummy-token") {
      const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${data.recaptchaToken}`,
      });
      const recaptchaData = await res.json();
      
      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json({ error: "reCAPTCHA validation failed. Are you a bot?" }, { status: 400 });
      }
    }

    // 5. Save to database
    await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });

    // 6. Send email notification (optional, using Resend)
    // ...

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
