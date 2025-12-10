import SectionTitle from "./components/ui/SectionTitle";
import PlaylistCard from "./components/ui/PlaylistCard";
import { playlists } from "./data/playlists";

export default function Home() {

  return (
    <main className="p-3">


      <SectionTitle title="Good evening"/>
      <div className="
        grid grid-col2-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-4 mb-6"
      >
        {playlists.map((playlist, index) => (
          <PlaylistCard
            key={index}
            image={playlist.image}
            title={playlist.title}
            subtitle={playlist.subtitle}
            type={playlist.type}
            href={`/playlist/${playlist.id}`}
          />
        ))}
        </div>


      <SectionTitle title="Made for You" href="/made-for-you" alignRightText/>
      <SectionTitle title="Recently Played" alignRightText/>
      <SectionTitle title="Your playlists" href="/playlists" alignRightText/>

    </main>
  );
}

{/* <div>
  <Card>
    <Card.Section>
      <Image />
    </Card.Section>
    <Text>Title</Text>
    <Text>Subtitle</Text>
  </Card>
</div> */}
