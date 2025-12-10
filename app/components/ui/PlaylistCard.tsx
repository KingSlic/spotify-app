"use client"
import { useRouter } from "next/navigation";

interface PlaylistCardProps {
  image: string;
  title: string;
  subtitle?: string;
  type: "playlist" | "album" | "artist";
  href?: string;
  onClick?: () => void;
}

export default function PlaylistCard({ image, title, subtitle, type, href, onClick }: PlaylistCardProps)
{

  const router = useRouter();

  const handleClick = () => {

    if (onClick) {
      const result = onClick();
      if (result === false) return;

    }

    if (href) {
      router.push(href);
    }

  }


  return (

    //wrapper element
    <div
      onClick={handleClick}
      className="
        flex flex-col
        gap-2
        w-40
        cursor-pointer
        rounded-md
        hover:scale-105 hover:brightness-110
        transition-all duration-200
        "
    >

      <div
        className={`
          aspect-square
          overflow-hidden
          transition-all duration-200
          ${type === "artist" ? "rounded-full" : "rounded-md"}`}
      >
        <img
          src={image}
          className="object-cover h-full w-full transition-all duration-200" alt={title}
        />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <p className="text-white text-base font-semibold truncate">{title}</p>

        {subtitle && (
          <p className="text-zinc-400 text-sm truncate">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
