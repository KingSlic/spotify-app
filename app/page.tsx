import SectionTitle from "./components/ui/SectionTitle";
import PlaylistCard from "./components/ui/PlaylistCard";
import { playlists } from "@/lib/fakeDb";


export default function Home() {
  return (
    <main className="px-8 py-6 space-y-12">


      <section>
        <SectionTitle title="Good evening" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {playlists.map((p) => (
            <PlaylistCard
              key={p.id}
              image={p.image}
              title={p.title}
              subtitle={p.subtitle}
              type={p.type}
              href={p.href}
            />
          ))}
        </div>
      </section>


      <section>
        <SectionTitle
          title="Made For You"
          href="/made-for-you"
          alignRightText
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists.map((p) => (
            <PlaylistCard
              key={p.id}
              image={p.image}
              title={p.title}
              subtitle={p.subtitle}
              type={p.type}
              href={p.href}
            />
          ))}
        </div>
      </section>


      <section>
        <SectionTitle
          title="Your Playlists"
          href="/playlists"
          alignRightText
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {playlists.map((p) => (
            <PlaylistCard
              key={p.id}
              image={p.image}
              title={p.title}
              subtitle={p.subtitle}
              type={p.type}
              href={p.href}
            />
          ))}
        </div>
      </section>

    </main>
  );
}
