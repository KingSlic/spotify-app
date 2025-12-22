export default function Sidebar() {
  return (
    <aside className="w-60 bg-[#111111] p-5 flex flex-col gap-5 h-screen">
      <h2 className="text-lg font-bold">Spotify</h2>

      <nav className="flex flex-col gap-3">
        <span className="opacity-80">Home</span>
        <span className="opacity-80">Search</span>
        <span className="opacity-80">Your Library</span>
      </nav>
    </aside>
  )
}
