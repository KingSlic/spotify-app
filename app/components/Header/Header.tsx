export default function Header() {
  return (
    <header
      style={{
        height: "64px",
        backgroundColor: "#111111",
        borderBottom: "1px solid #2A2A2A",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* LEFT SECTION */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#1DB954",
            opacity: 0.8,
          }}
        />
        <span style={{ fontSize: "14px", opacity: 0.9 }}>Good evening</span>
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
