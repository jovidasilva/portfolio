export type Certificado = {
  titulo: string;
  emissor: string;
  data: string; // AAAA-MM-DD
  arquivo?: string; // PDF ou imagem em public/certificados, ex.: "/certificados/alura-react.pdf"
  link?: string; // página de verificação, se houver
};

// Adicione um objeto por certificado; a página ordena do mais recente ao mais antigo.
export const certificados: Certificado[] = [];
