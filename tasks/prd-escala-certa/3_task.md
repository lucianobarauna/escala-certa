# Tarefa 3.0: Codec da URL versionada

## Visão geral

Implementa `serializeSchedule` e `parseSchedule` com codec por versão (`v=1`), validação campo a campo, aproveitamento dos campos válidos, saneamento do nome e fixture congelada de compatibilidade. Criticidade alta: o formato do link não pode mudar depois do lançamento (RF39).

<skills>
### Conformidade com skills

- Regras do projeto: `code-standards.md`, `javascript-typescript.md`, `tests.md`.
- `find-docs`: `URLSearchParams` se houver dúvida de comportamento.
</skills>

<requirements>
- RF35: toda a configuração (tipo, escala/modalidade, turno, datas, padrão, nome) refletida no endereço.
- RF36: link válido restaura a escala exatamente.
- RF37: link inválido, incompleto ou de versão desconhecida gera `ParseResult` com `issues` e aproveita campos válidos.
- RF39: compatibilidade futura via `v` obrigatória, codec por versão e fixture congelada.
- RF40: nome até 40 caracteres, `name_truncated` ao cortar.
- Segurança: valores da URL são texto não confiável, saneados e limitados em tamanho; query muito longa não quebra.
- Só o tipo ativo vai na URL; `serializeSchedule` preserva `pathname` e hash.
</requirements>

## Subtarefas

- [ ] 3.1 Implementar `schedule-url.v1.ts` (campos `t`, `c`, `s`, `d`, `m`, `w`, `p`, `n`; validações; `ConfigIssue`) + spec.
- [ ] 3.2 Implementar `schedule-url.utils.ts` (`serializeSchedule`, `parseSchedule` despachando por versão, saneamento do nome) + spec.
- [ ] 3.3 Criar a fixture congelada de link v1 e o teste de regressão (caso 78).
- [ ] 3.4 Rodar `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: "Mapeamento URL → contrato", "`ConfigIssue`", "`ParseResult`", seção "Endpoints da API" (`GET /escala-certa/`, respostas `restaurada`/`parcial`/`ignorada`/`vazia`, exemplos de campo inválido e versão desconhecida) e "Segurança" em "Regras de implementação".

## Critérios de sucesso

- Todos os testes unitários 60–78 passam.
- `parse(serialize(x))` é igual a `x` para todas as combinações cobertas.
- Nenhuma entrada manipulada lança exceção nem gera HTML interpretado.

## Testes da tarefa

### Testes unitários

`schedule-url.v1.spec.ts` / `schedule-url.utils.spec.ts`

- [ ] 60. Round-trip (`parse(serialize(x)) == x`) para cada escala e turno de plantão.
- [ ] 61. Round-trip semanal: 1, 3 e 7 semanas; semana vazia (`-`); modalidades 5x2 e 6x1.
- [ ] 62. Serialização só inclui campos do tipo ativo e sempre `v=1`.
- [ ] 63. Rascunho parcial é serializado e restaurado (RF35).
- [ ] 64. Nome com acentos, emoji, espaço, `&`, `=`, `#`, `%`, `+`, aspas e `<script>` faz round-trip e continua texto.
- [ ] 65. Nome com 41+ caracteres é cortado e gera `name_truncated`.
- [ ] 66. Nome com caracteres de controle é limpo.
- [ ] 67. Sem query: rascunho vazio, sem `issues`.
- [ ] 68. Sem `v`, `v=0`, `v=2`, `v=abc`: `unknown_version`, rascunho vazio.
- [ ] 69. Data `2026-02-30`, `2026-13-01`, `abc`, vazia: `invalid_field`, demais campos aproveitados.
- [ ] 70. `c` inválido; `s` inválido; `s` presente com `c=24x48` ignorado.
- [ ] 71. `w=0`, `w=8`, `w=abc`.
- [ ] 72. `p` com dígito 7, letras, quantidade de semanas diferente de `w`, dias repetidos: `inconsistent_pattern`.
- [ ] 73. `p` com folgas acima do limite da modalidade é rejeitado (RF14).
- [ ] 74. Parâmetros duplicados: vale o primeiro (comportamento definido).
- [ ] 75. Parâmetros desconhecidos são ignorados e removidos na próxima serialização.
- [ ] 76. Query muito longa é limitada e não quebra.
- [ ] 77. `serializeSchedule` preserva `pathname` e hash existentes (usado pelo hook).
- [ ] 78. Compatibilidade (RF39): link v1 fixo em fixture continua gerando o mesmo rascunho (teste de regressão congelado).

### Testes de integração

- [ ] Sem testes próprios: o ciclo URL ↔ formulário ↔ preview é coberto na tarefa 9.0 (integração 16, 17, 18, 20).

### Testes E2E (se aplicável)

- [ ] Não se aplica (cobertos na tarefa 10.0, `schedule-reopen.spec.ts`).

## Arquivos relevantes

- `src/domain/schedule/schedule-url.v1.ts` (+ `.spec.ts`)
- `src/domain/schedule/schedule-url.utils.ts` (+ `.spec.ts`)
- `src/domain/schedule/fixtures/` (link v1 congelado)
- `src/types/schedule.ts` (`ConfigIssue`, `ParseResult`)
