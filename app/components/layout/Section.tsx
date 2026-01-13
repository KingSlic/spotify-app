import { Section as SectionType, Playlist } from "@/lib/api";
import PlaylistCard from "../ui/PlaylistCard";

type Props = {
  section: SectionType;
  playlists: Playlist[];
};

export default function Section({ section, playlists }: Props) {
  return (
    <section className="mb-8">
      {/* HEADER — always present */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold">{section.title}</h2>

        {section.showAllHref && playlists.length > 0 && (
          <a
            href={section.showAllHref}
            className="text-sm text-zinc-400 hover:underline"
          >
            Show all
          </a>
        )}
      </div>

      {/* CONTENT */}
      {playlists.length === 0 ? (
        <p className="text-sm text-neutral-500 italic px-1 py-6">
          Nothing here yet — your listening will shape this space.
        </p>
      ) : (
        <div className="relative">
          {/* LEFT FADE */}
          <div
            className="
              pointer-events-none
              absolute left-0 top-0 h-full w-8
              bg-gradient-to-r from-black to-transparent
              z-10
            "
          />

          {/* RIGHT FADE */}
          <div
            className="
              pointer-events-none
              absolute right-0 top-0 h-full w-8
              bg-gradient-to-l from-black to-transparent
              z-10
            "
          />

          {/* SCROLL CONTAINER */}
          <div className="grid grid-flow-col auto-cols-[180px] gap-4 overflow-x-auto px-1">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                variant={
                  section.id === "recently_played" ? "compact" : "default"
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
