export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          <div>Monolith OS</div>
          <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.7, marginTop: 4 }}>beta</div>
        </div>

        <nav className="nav">
          <a href="/new-project">Generator</a>
          <a href="/projects">Projekty</a>
        </nav>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
