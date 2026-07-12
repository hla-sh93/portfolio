import { db } from "@/lib/db";
import crypto from "crypto";
import { NextResponse } from "next/server";
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// const ratelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(5, "1 m"), 
// });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const action = body.action; // "like" or "unlike"

    if (action !== "like" && action !== "unlike") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // 1. Rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    // const { success } = await ratelimit.limit(`like_${ip}_${projectId}`);
    // if (!success) {
    //   return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    // }

    // 2. Hash IP for privacy
    const ipHash = crypto.createHash("sha256").update(ip + process.env.LIKE_SECRET_SALT).digest("hex");

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { id: true, likeCount: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 3. Handle Like / Unlike
    if (action === "like") {
      // Create like record
      await db.$transaction(async (tx) => {
        const existingLike = await tx.like.findUnique({
          where: { ipHash_projectId: { ipHash, projectId } },
        });

        if (!existingLike) {
          await tx.like.create({
            data: { projectId, ipHash },
          });
          await tx.project.update({
            where: { id: projectId },
            data: { likeCount: { increment: 1 } },
          });
        }
      });
    } else {
      // Remove like record
      await db.$transaction(async (tx) => {
        const existingLike = await tx.like.findUnique({
          where: { ipHash_projectId: { ipHash, projectId } },
        });

        if (existingLike) {
          await tx.like.delete({
            where: { ipHash_projectId: { ipHash, projectId } },
          });
          await tx.project.update({
            where: { id: projectId },
            data: { likeCount: { decrement: 1 } },
          });
        }
      });
    }

    // Return new count
    const updated = await db.project.findUnique({
      where: { id: projectId },
      select: { likeCount: true },
    });

    return NextResponse.json({ success: true, likeCount: updated?.likeCount ?? 0 });
  } catch (error) {
    console.error("Like API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
