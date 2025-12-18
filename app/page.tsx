import SectionTitle from "./components/ui/SectionTitle";
import PlaylistCard from "./components/ui/PlaylistCard";
//import { playlists } from "@/lib/fakeDb"; --> page control, not data control so we remove it

import { getHomeSections } from "@/lib/homeSections";
import { Section } from "lucide-react";


export default function Home() {

  const sections = getHomeSections();

  return (
    <main className="px-8 py-6 space-y-12">
      {sections.map((section) => (
        <section key={section.id}>
          <SectionTitle
            title={section.title}
            href={section.href}
            alignRightText={!!section.href}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {section.playlists.map((p) => (
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
      ))}


    </main>
  );
}
