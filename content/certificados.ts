type Texto = { titulo: string; descricao: string };

export type Certificado = {
  data: string; // AAAA-MM-DD
  arquivo: string; // PDF ou imagem em public/certificados
  pt: Texto;
  en: Texto;
};

// A página ordena do mais recente ao mais antigo
export const certificados: Certificado[] = [
  {
    data: "2026-10-20",
    arquivo: "/certificados/excel-santander.pdf",
    pt: { titulo: "Excel", descricao: "Curso da Santander Open Academy sobre o uso do Excel para organizar e analisar dados." },
    en: { titulo: "Excel", descricao: "Santander Open Academy course on using Excel to organize and analyze data." },
  },
  {
    data: "2026-10-20",
    arquivo: "/certificados/power-bi-santander.pdf",
    pt: { titulo: "Power BI", descricao: "Curso da Santander Open Academy sobre relatórios e dashboards no Power BI." },
    en: { titulo: "Power BI", descricao: "Santander Open Academy course on building reports and dashboards in Power BI." },
  },
  {
    data: "2026-10-20",
    arquivo: "/certificados/prompting-ia-santander.pdf",
    pt: {
      titulo: "Prompting responsável",
      descricao: "Curso da Santander Open Academy, com conteúdo da Microsoft e da Founderz, sobre usar IA generativa no trabalho com responsabilidade.",
    },
    en: {
      titulo: "Responsible prompting",
      descricao: "Santander Open Academy course, with content by Microsoft and Founderz, on using generative AI responsibly at work.",
    },
  },
  {
    data: "2026-05-22",
    arquivo: "/certificados/tea-semicti-2026.pdf",
    pt: {
      titulo: "Resumo expandido sobre IA para TEA",
      descricao: "Apresentação da minha pesquisa de iniciação científica no IV SEMICTI, o seminário de iniciação científica da Universidade Ceuma.",
    },
    en: {
      titulo: "Extended abstract on AI for autism",
      descricao: "Presentation of my undergraduate research at the IV SEMICTI, Universidade Ceuma's undergraduate research seminar.",
    },
  },
  {
    data: "2025-12-06",
    arquivo: "/certificados/tea-sieeg-2025.pdf",
    pt: {
      titulo: "Artigo sobre IA para TEA",
      descricao: "Apresentação do artigo sobre o dispositivo com IA para apoiar pessoas com TEA no III Seminário Internacional de Educação, Empreendedorismo e Gestão de Projetos.",
    },
    en: {
      titulo: "Paper on AI for autism",
      descricao: "Presentation of the paper on the AI-powered device to support autistic people at the III International Seminar on Education, Entrepreneurship and Project Management.",
    },
  },
  {
    data: "2025-12-06",
    arquivo: "/certificados/ecg-sieeg-2025.pdf",
    pt: {
      titulo: "Artigo sobre análise de ECG",
      descricao: "Artigo em coautoria sobre um sistema que ajuda a analisar eletrocardiogramas, submetido ao III Seminário Internacional de Educação, Empreendedorismo e Gestão de Projetos.",
    },
    en: {
      titulo: "Paper on ECG analysis",
      descricao: "Co-authored paper on a system that helps analyze electrocardiograms, submitted to the III International Seminar on Education, Entrepreneurship and Project Management.",
    },
  },
  {
    data: "2025-05-16",
    arquivo: "/certificados/robo-idosos-semicti-2025.pdf",
    pt: {
      titulo: "Robôs como apoio para idosos",
      descricao: "Resumo expandido apresentado no III SEMICTI, da Universidade Ceuma, sobre como idosos percebem e aceitam robôs como ajudantes.",
    },
    en: {
      titulo: "Robots as support for older adults",
      descricao: "Extended abstract presented at Universidade Ceuma's III SEMICTI on how older adults perceive and accept robots as helpers.",
    },
  },
  {
    data: "2024-06-22",
    arquivo: "/certificados/api-rest-spring-boot.pdf",
    pt: { titulo: "API REST com Spring Boot", descricao: "Curso de curta duração da Universidade Ceuma sobre desenvolvimento de APIs REST com Spring Boot." },
    en: { titulo: "REST APIs with Spring Boot", descricao: "Short course at Universidade Ceuma on building REST APIs with Spring Boot." },
  },
  {
    data: "2023-08-31",
    arquivo: "/certificados/redes-ftth.pdf",
    pt: { titulo: "Redes FTTH e cabeamento estruturado", descricao: "Oficina da Universidade Ceuma sobre projeto de redes de fibra óptica e cabeamento estruturado." },
    en: { titulo: "FTTH networks and structured cabling", descricao: "Workshop at Universidade Ceuma on designing fiber-optic networks and structured cabling." },
  },
];
