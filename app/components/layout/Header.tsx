export default function Header() {
  return (
    <header className="h-16 border-b border-[#2A2A2A] flex items-center justify-between px-5 bg-[#111111]">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[#1DB954] rounded-full" />
        <span className="opacity-80">Good evening</span>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        <span className="opacity-80">Sign Up</span>
        <button className="bg-white text-black px-4 py-2 rounded-full font-semibold">
          Log In
        </button>
      </div>
    </header>
  )
}
