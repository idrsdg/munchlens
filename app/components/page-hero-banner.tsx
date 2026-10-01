"use client";

interface Props {
  src: string;
  alt: string;
  title: string;
  subtitle?: string;
  badge?: string;
  height?: "sm" | "md" | "lg";
  gradient?: "dark" | "orange" | "green" | "purple" | "blue";
}

const GRADIENTS = {
  dark:   "from-black/70 via-black/40 to-transparent",
  orange: "from-orange-900/80 via-orange-700/40 to-transparent",
  green:  "from-emerald-900/80 via-emerald-700/40 to-transparent",
  purple: "from-purple-900/80 via-purple-700/40 to-transparent",
  blue:   "from-blue-900/80 via-blue-700/40 to-transparent",
};

const HEIGHTS = {
  sm: "h-40",
  md: "h-52",
  lg: "h-64",
};

export default function PageHeroBanner({
  src, alt, title, subtitle, badge,
  height = "md", gradient = "dark",
}: Props) {
  return (
    <div className={`relative w-full ${HEIGHTS[height]} rounded-2xl overflow-hidden mb-6 shrink-0`}>
      {/* Photo */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${GRADIENTS[gradient]}`} />
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        {badge && (
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-2 border border-white/20">
            {badge}
          </span>
        )}
        <h1 className="text-white text-2xl font-black drop-shadow-md">{title}</h1>
        {subtitle && (
          <p className="text-white/80 text-sm mt-0.5 drop-shadow">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
