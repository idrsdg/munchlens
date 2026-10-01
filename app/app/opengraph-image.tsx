import { ImageResponse } from "next/og";

export const alt = "MunchLens — Fotoğrafla Kalori Takibi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 80% 20%, rgba(249,115,22,0.15) 0%, transparent 60%)",
          }}
        />
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
            }}
          >
            🍽️
          </div>
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#1c1917",
              letterSpacing: -2,
            }}
          >
            MunchLens
          </span>
        </div>
        {/* Tagline */}
        <p
          style={{
            fontSize: 36,
            color: "#78350f",
            fontWeight: 600,
            margin: 0,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Fotoğrafla Kalori Takibi
        </p>
        <p
          style={{
            fontSize: 24,
            color: "#92400e",
            fontWeight: 400,
            margin: "16px 0 0",
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Yapay zeka ile anlık beslenme analizi
        </p>
        {/* Food emojis */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 48,
            fontSize: 48,
          }}
        >
          {["🥗", "🍎", "🥑", "🫐", "🍇", "🥦"].map((e, i) => (
            <span key={i}>{e}</span>
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
