// Copia o ONNX Runtime Web (o motor que roda a NADIA no navegador) para public/nadia/ort.
// Roda sozinho antes de "npm run dev" e "npm run build"; a pasta fica fora do git.
import { copyFileSync, mkdirSync } from "node:fs";

const origem = "node_modules/onnxruntime-web/dist/";
const destino = "public/nadia/ort/";
mkdirSync(destino, { recursive: true });
for (const arquivo of ["ort.wasm.min.mjs", "ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.wasm"]) copyFileSync(origem + arquivo, destino + arquivo);
