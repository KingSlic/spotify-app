import { Section as SectionType, Playlist } from "@/lib/api"
import PlaylistCard from "../ui/PlaylistCard"

type Props = {
  section: SectionType
  playlists: Playlist[]
}

export default function Section({ section, playlists }: Props) {

  if (playlists.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-bold">{section.title}</h2>
        <p className="text-sm text-neutral-500 mt-2">
          Nothing here yet.
        </p>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{section.title}</h2>

        {section.showAllHref && (
          <a
            href={section.showAllHref}
            className="text-sm text-neutral-400 hover:underline"
          >
            Show all
          </a>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            variant={section.id === "recently_played" ? "compact" : "default"}
          />
        ))}
      </div>
    </section>
  )
}
