export type Publicacao = {
  titulo: string; // no idioma original do artigo
  autores: string;
  veiculo: string; // revista ou anais do evento
  ano: number;
  link: string;
  resumo: { pt: string; en: string };
  projeto?: string; // slug do projeto relacionado em content/<idioma>/projetos
};

// Mais recentes primeiro
export const publicacoes: Publicacao[] = [
  {
    titulo:
      "Desenvolvimento de um sistema web para gerenciamento de internatos médicos: digitalização de processos e otimização da gestão acadêmica",
    autores:
      "João Victor da Silva Alves, Jackson Garcês Damasceno, Pedro Gabriel Guimarães Costa Carioca, Edilson Carlos Silva Lima, Yonara Costa Magalhães",
    veiculo: "Revista Ibero-Americana de Humanidades, Ciências e Educação (REASE), v. 12, n. 1",
    ano: 2026,
    link: "https://doi.org/10.51891/rease.v12i1.23332",
    resumo: {
      pt: "Apresenta o INTERMED, sistema web que digitaliza a gestão do internato de Medicina, feita em muitas faculdades com papel e planilhas. Nos testes com o protótipo, tarefas como gerar os rodízios passaram a levar até 97% menos tempo.",
      en: "Presents INTERMED, a web system that digitizes medical internship management, which many schools still run on paper and spreadsheets. In prototype tests, tasks like generating rotations took up to 97% less time.",
    },
    projeto: "intermed",
  },
  {
    titulo:
      "Dispositivo eletrônico reconfigurável baseado em inteligência artificial para suporte à saúde de indivíduos com transtorno do espectro autista",
    autores: "João Victor da Silva Alves, Marcos Rafael Nogueira Moreira, Jonathan Araujo Queiroz, Yonara Costa Magalhães",
    veiculo: "Anais do III Seminário Internacional de Educação, Empreendedorismo e Gestão de Projetos",
    ano: 2025,
    link: "https://www.even3.com.br/anais/iii-seminario-internacional-educacao-empreendedorismo-gestao-projetos/1423208/",
    resumo: {
      pt: "Propõe um vestível de baixo custo com IA que acompanha sinais como batimentos, condutância da pele e movimento para identificar estresse e sinais de crise em pessoas com TEA, para que cuidadores possam agir antes.",
      en: "Proposes a low-cost AI wearable that tracks signals such as heart rate, skin conductance and movement to spot stress and early signs of crises in autistic people, so caregivers can act sooner.",
    },
    projeto: "monitoramento-tea",
  },
  {
    titulo: "Sistema computacional para auxiliar a análise de eletrocardiograma via segmentação das ondas",
    autores: "Marcos Rafael Nogueira Moreira, João Victor da Silva Alves, Yonara Costa Magalhães, Jonathan Araujo Queiroz",
    veiculo: "Anais do III Seminário Internacional de Educação, Empreendedorismo e Gestão de Projetos",
    ano: 2025,
    link: "https://www.even3.com.br/anais/iii-seminario-internacional-educacao-empreendedorismo-gestao-projetos/1421588/",
    resumo: {
      pt: "Propõe um sistema de baixo custo que trata o sinal do eletrocardiograma e separa cada batimento, como base para detectar arritmias em regiões com poucos cardiologistas.",
      en: "Proposes a low-cost system that cleans the electrocardiogram signal and splits it into heartbeats, as a base for detecting arrhythmias in regions with few cardiologists.",
    },
    projeto: "analise-ecg",
  },
];
