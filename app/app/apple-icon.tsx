import { ImageResponse } from "next/og";

export const sizes = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 100,
            lineHeight: 1,
          }}
        >
          🍽️
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
