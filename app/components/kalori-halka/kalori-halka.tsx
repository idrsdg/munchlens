"use client";

interface Props {
  consumed: number;
  goal: number;
  size?: number;
}

export default function KaloriHalka({ consumed, goal, size = 120 }: Props) {
  const percent = Math.min(100, (consumed / goal) * 100);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const isOver = consumed > goal;
  const strokeColor = isOver ? "#ef4444" : percent > 80 ? "#f97316" : "#22c55e";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Arka plan çemberi */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={10}
        />
        {/* İlerleme çemberi */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      {/* Merkezdeki metin */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{Math.round(percent)}%</span>
        <span className="text-xs text-gray-400">dolu</span>
      </div>
    </div>
  );
}
