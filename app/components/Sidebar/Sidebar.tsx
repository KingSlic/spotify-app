
export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "#111111",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>Spotify</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <span style={{ opacity: 0.8 }}>Home</span>
        <span style={{ opacity: 0.8 }}>Search</span>
        <span style={{ opacity: 0.8 }}>Your Library</span>
      </nav>
    </aside>
  );
}