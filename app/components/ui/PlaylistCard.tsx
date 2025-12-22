"use client";

import { Playlist } from "@/lib/api";
import { useRouter } from "next/navigation";

interface PlaylistCardProps {
  playlist: Playlist;
  variant?: "default" | "compact"
  onClick?: () => boolean | void;
}

export default function PlaylistCard({
  playlist,
  variant = "default",
  onClick,
}: PlaylistCardProps) {
  const router = useRouter();

  const { image, title, subtitle, type, href } = playlist;

  const isCompact = variant === "compact"

  const handleClick = () => {
    if (onClick) {
      const result = onClick();
      if (result === false) return;
    }

    if (href) {
      router.push(href);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group
        flex flex-col
        cursor-pointer
        rounded-md
        transition
        hover:bg-[#1a1a1a]
        ${isCompact ? "w-32 p-2 gap-2" : "w-40 p-3 gap-3"}
      `}
    >
      {/* IMAGE */}
      <div
        className={`
          aspect-square overflow-hidden
          transition-all duration-200
          ${type === "artist" ? "rounded-full" : "rounded-md"}
        `}
      >
        <img
          src={image}
          alt={title}
          onError={(e) => {
            e.currentTarget.src = "https://picsum.photos/600?grayscale";
          }}
          className="
            w-full h-full object-cover
            transition-transform duration-200
            group-hover:scale-105
          "
        />
      </div>

      {/* TEXT */}
      <div className="flex flex-col gap-1 min-w-0">
        <p className={`
            text-white text-sm font-semibold truncate
            ${isCompact ? "text-xs" : "text-sm"}
          `}
        >
          {title}
        </p>

        {!isCompact && subtitle && (
          <p className="text-zinc-400 text-xs truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
