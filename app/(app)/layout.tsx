export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">Monolith OS</div>
        <nav>
          <a href="/projects">Projekty</a>
          <a href="/new-project">Nowy projekt</a>
          <a href="/admin">Admin</a>
        </nav>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
