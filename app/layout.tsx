import "./globals.css";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "black", color: "white" }}>
        <div style={{ display: "flex", minHeight: "100vh" }}>

          {/* LEFT SIDEBAR */}
          <Sidebar />

          {/* RIGHT COLUMN */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

            {/* TOP HEADER */}
            <Header />

            {/* MAIN CONTENT */}
            <main style={{ padding: "40px" }}>
              {children}
            </main>

          </div>
        </div>
      </body>
    </html>
  );
}
