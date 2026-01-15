"use client";

import useSWR from "swr";
import Section from "./components/layout/Section";
import type { SectionWithPlaylists } from "@/lib/api";

const API_BASE = "http://127.0.0.1:5000/api";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch playlists");
  const data = await res.json();
  return data.sections ?? [];
};

export default function HomePage() {
  const { data: sections, error, isLoading } = useSWR<SectionWithPlaylists[]>(
    `${API_BASE}/playlists`,
    fetcher
  );

  console.log("SECTIONS:", JSON.stringify(sections, null, 2));

  if (error) {
    return (
      <main className="p-8">
        <div className="text-red-500">Failed to load playlists</div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="p-8">
        <div className="text-gray-500">Loading...</div>
      </main>
    );
  }

  return (
    <main>
      {sections?.map((section) => (
        <Section
          key={section.id}
          section={section}
          // playlists={section.playlists}
        />
      ))}
    </main>
  );
}
