import { ImageResponse } from "next/og";

export const sizes = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          borderRadius: 112,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 280,
            lineHeight: 1,
          }}
        >
          🍽️
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
