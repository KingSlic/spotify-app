"use client";

import { useRouter } from "next/navigation";

interface PlaylistCardProps {
  image: string;
  title: string;
  subtitle?: string;
  type: "playlist" | "album" | "artist" | "mix" | "radio";
  href?: string;
  onClick?: () => boolean | void;
}

export default function PlaylistCard({
  image,
  title,
  subtitle,
  type,
  href,
  onClick,
}: PlaylistCardProps) {
  const router = useRouter();

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
      className="
        flex flex-col gap-2 w-40
        cursor-pointer
        transition-transform duration-200
        hover:scale-105
      "
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
          className="w-full h-full object-cover"
        />
      </div>

      {/* TEXT */}
      <div className="flex flex-col gap-1">
        <p className="text-white text-sm font-semibold truncate">
          {title}
        </p>

        {subtitle && (
          <p className="text-zinc-400 text-xs truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
