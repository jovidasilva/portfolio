export default function Footer() {
  return (
    <footer className="border-t border-foreground/10 py-6 text-center text-sm">
      <a href="https://github.com/jovidasilva" className="hover:underline">GitHub</a>
      {" · "}
      <a href="https://www.linkedin.com/in/seu-usuario" className="hover:underline">LinkedIn</a>
      {" · "}
      <a href="mailto:seu-email@exemplo.com" className="hover:underline">E-mail</a>
    </footer>
  );
}
