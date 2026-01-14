import { getPlaylistsLayout } from "@/lib/api";
import Section from "./components/layout/Section";

export default async function HomePage() {
  const sections = await getPlaylistsLayout();

  console.log("SECTIONS:", JSON.stringify(sections, null, 2));

  return (
    <main>
      {sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          playlists={section.playlists}
        />
      ))}
    </main>
  );
}
