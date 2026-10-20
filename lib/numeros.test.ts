import { test } from "node:test";
import assert from "node:assert/strict";
import { porSemana, somarLinguagens } from "./numeros.ts";

test("porSemana coloca cada data na semana certa e ignora o que está fora da janela", () => {
  const agora = Date.parse("2026-10-20T12:00:00Z");
  const datas = ["2026-10-20T10:00:00Z", "2026-10-19T10:00:00Z", "2026-10-10T10:00:00Z", "2026-01-01T00:00:00Z", "2026-10-21T00:00:00Z"];
  assert.deepEqual(porSemana(datas, agora, 3), [0, 1, 2]);
});

test("somarLinguagens soma entre repositórios e agrupa o resto em Outras", () => {
  const resultado = somarLinguagens([{ Python: 60, PHP: 10 }, { Python: 20, GDScript: 5, CSS: 5 }], 2);
  assert.deepEqual(
    resultado.map(({ nome, parte }) => [nome, Math.round(parte * 100)]),
    [["Python", 80], ["PHP", 10], ["Outras", 10]],
  );
  assert.deepEqual(somarLinguagens([], 3), []);
  // abaixo de 1% não aparece sozinha nem cria "Outras" vazia
  assert.deepEqual(
    somarLinguagens([{ TypeScript: 995, JavaScript: 5 }], 5).map(({ nome }) => nome),
    ["TypeScript"],
  );
});
