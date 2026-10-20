export default function Tecnologias({ lista, rotulo, className = "" }: { lista: string[]; rotulo: string; className?: string }) {
  return (
    <ul aria-label={rotulo} className={`flex flex-wrap gap-2 ${className}`}>
      {lista.map((item) => (
        <li key={item} className="rounded-full border border-dashed border-borda px-3 py-1 text-xs text-suave">
          {item}
        </li>
      ))}
    </ul>
  );
}
