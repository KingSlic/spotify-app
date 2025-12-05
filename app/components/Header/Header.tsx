export default function Header() {
  return (
    <header
      style={{
        height: "64px",
        borderBottom: "1px solid #2A2A2A",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        backgroundColor: "#111111",
      }}
    >
      {/* LEFT SECTION */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "#1DB954",
            borderRadius: "50%",
          }}
        />
        <span style={{ opacity: 0.8 }}>Good evening</span>
      </div>

      {/* RIGHT SECTION */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <span style={{ opacity: 0.8 }}>Sign Up</span>
        <button
          style={{
            backgroundColor: "white",
            color: "black",
            padding: "8px 16px",
            borderRadius: "20px",
            fontWeight: 600,
          }}
        >
          Log In
        </button>
      </div>
    </header>
  );
}
