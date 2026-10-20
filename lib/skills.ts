export type Grupo = "linguagens" | "web" | "dados" | "design" | "ferramentas";

// [arquivo em public/skills, nome exibido], por grupo; as descrições ficam em lib/textos.ts
export const grupos: [Grupo, [string, string][]][] = [
  ["linguagens", [["typescript", "TypeScript"], ["javascript", "JavaScript"], ["python", "Python"], ["php", "PHP"], ["c", "C"], ["cpp", "C++"]]],
  ["web", [["react", "React"], ["nextjs", "Next.js"], ["nodejs", "Node.js"], ["tailwindcss", "Tailwind CSS"], ["laravel", "Laravel"], ["vite", "Vite"], ["bootstrap", "Bootstrap"], ["html", "HTML"], ["css", "CSS"]]],
  ["dados", [["pytorch", "PyTorch"], ["tensorflow", "TensorFlow"], ["flask", "Flask"], ["mysql", "MySQL"], ["powerbi", "Power BI"]]],
  ["design", [["figma", "Figma"], ["canva", "Canva"], ["office365", "Microsoft 365"]]],
  ["ferramentas", [["git", "Git"], ["github", "GitHub"], ["githubactions", "GitHub Actions"], ["docker", "Docker"], ["vscode", "VS Code"], ["godot", "Godot"]]],
];
