import { getPlaylistsLayout } from "@/lib/api";
import Section from "./components/layout/Section";

export default async function HomePage() {
  const data = await getPlaylistsLayout();

  console.log("PLAYLIST LAYOUT:", data);

  return (
    <main>
      {data.map((section) => (
        <Section
          key={section.id}
          section={section}
          playlists={section.playlists}
        />
      ))}
    </main>
  );
}
