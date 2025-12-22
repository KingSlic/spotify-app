import { getPlaylistsLayout } from "@/lib/api"
import Section from "./components/layout/Section"

export default async function HomePage() {
  // const [sections, playlistSections] = await Promise.all([
  //   getSections(),
  //   getPlaylistsBySection(),
  // ])

  const data = await getPlaylistsLayout()

  console.log("PLAYLIST LAYOUT:", data)

  return (
    <main>
      {data.sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          playlists={section.playlists}
        />
      ))}
    </main>
  )
}
