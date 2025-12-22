import { getSections, getPlaylistsBySection } from "@/lib/api"
import Section from "./components/layout/Section"

export default async function HomePage() {
  const [sections, playlistSections] = await Promise.all([
    getSections(),
    getPlaylistsBySection(),
  ])

  return (
    <main>
      {sections.map((section) => {
        const match = playlistSections.find(
          (ps) => ps.id === section.id
        )

        return (
          <Section
            key={section.id}
            section={section}
            playlists={match?.playlists ?? []}
          />
        )
      })}
    </main>
  )
}
