import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic params
    const title = searchParams.get("title") || "Portfolio";
    const type = searchParams.get("type") || "page";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#030014", // Our bg-base
            backgroundImage: "radial-gradient(circle at 50% 50%, #1e1b4b 0%, #030014 100%)", // bg-accent subtle
            padding: "80px",
          }}
        >
          {/* Decorative Top Left */}
          <div
            style={{
              position: "absolute",
              top: -100,
              left: -100,
              width: 400,
              height: 400,
              background: "rgba(124, 58, 237, 0.4)", // bg-accent
              filter: "blur(100px)",
              borderRadius: "50%",
            }}
          />

          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 24px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "100px",
              color: "#a78bfa", // text-accent-light
              fontSize: 24,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: 40,
            }}
          >
            {type === "project" ? "Featured Project" : type === "article" ? "Blog Article" : "Portfolio"}
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 80,
              fontFamily: "Inter, sans-serif",
              color: "white",
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1.1,
              maxWidth: "1000px",
              textShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </div>

          {/* Bottom Branding */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "0 80px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", color: "white", fontSize: 32, fontWeight: "bold" }}>
              Hla Shindeah<span style={{ color: "#a78bfa" }}>.</span>
            </div>
            <div style={{ display: "flex", color: "#9ca3af", fontSize: 24 }}>
              UI/UX · Front-End · Design · Motion
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
