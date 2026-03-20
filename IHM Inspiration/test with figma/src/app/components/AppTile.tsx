import { useState } from "react";
import { Play } from "lucide-react";

interface AppTileProps {
  name: string;
  icon?: string;
  gradient?: string;
  color?: string;
  textColor?: string;
  category?: string;
  size?: "small" | "medium" | "large";
}

export function AppTile({ 
  name, 
  icon, 
  gradient, 
  color = "bg-zinc-800", 
  textColor = "text-white",
  category,
  size = "medium" 
}: AppTileProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "h-32",
    medium: "h-40",
    large: "h-48"
  };

  return (
    <div
      className={`group relative ${sizeClasses[size]} rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isHovered ? "scale-110 z-10 shadow-2xl shadow-black/50" : "scale-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`w-full h-full flex flex-col items-center justify-center p-6 ${gradient || color} ${textColor}`}>
        {icon ? (
          <img src={icon} alt={name} className="w-full h-full object-contain" />
        ) : (
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-1">{name}</h3>
            {category && <p className="text-xs opacity-70">{category}</p>}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
          <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition-colors flex items-center gap-2">
            <Play className="w-5 h-5" fill="currentColor" />
            Open
          </button>
        </div>
      )}
    </div>
  );
}
