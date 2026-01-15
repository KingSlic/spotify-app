"use client";

import { Playlist, deletePlaylist } from "@/lib/api";
import { useRouter } from "next/navigation";

interface PlaylistCardProps {
  playlist: Playlist;
  variant?: "default" | "compact";
  onClick?: () => boolean | void;
}

export default function PlaylistCard({
  playlist,
  variant = "default",
  onClick,
}: PlaylistCardProps) {
  const router = useRouter();
  const isCompact = variant === "compact";

  const { id, title, subtitle, image, href } = playlist;


  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();

    try {
      await deletePlaylist(id);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete playlist", err);
    }
  }


  const handleClick = () => {
    if (onClick) {
      const result = onClick();
      if (result === false) return;
    }

    if (href) router.push(href);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group relative
        flex flex-col
        cursor-pointer
        rounded-md
        bg-transparent
        transition-all duration-200 ease-out
        hover:-translate-y-1
        hover:bg-[#1a1a1a]
        hover:shadow-xl hover:shadow-black/40
        ${isCompact ? "w-32 p-2 gap-2" : "w-40 p-3 gap-3"}
      `}
    >
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden rounded-md">
        <img
          src={image}
          alt={title}
          className="
            w-full h-full object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
          onError={(e) => {
            e.currentTarget.src = "https://picsum.photos/600?grayscale";
          }}
        />

        {/* PLAY BUTTON */}
        <div
          className="
            absolute bottom-2 right-2
            opacity-0 translate-y-1
            group-hover:opacity-100 group-hover:translate-y-0
            transition-all duration-200
          "
        >
          <button
            aria-label="Play"
            onClick={(e) => e.stopPropagation()}
            className="
              w-10 h-10
              rounded-full
              bg-[#1DB954]
              flex items-center justify-center
              text-black font-bold
              shadow-lg shadow-black/50
              hover:scale-105
            "
          >
            ▶
          </button>
        </div>
      </div>

      {/* TEXT */}
      <div className="flex flex-col gap-1 min-w-0">
        <p
          className={`
            text-white font-semibold truncate
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

      {/* DELETE BUTTON */}
      {!isCompact && (
        <button
          onClick={handleDelete}
          className="
            mt-1 self-start
            text-xs text-red-400
            opacity-0 group-hover:opacity-100
            transition
            hover:text-red-300
          "
        >
          Delete
        </button>
      )}
    </div>
  );
}
