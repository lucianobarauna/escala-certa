# Tarefa 2.0: Mês, nome acessível e resumo

## Visão geral

Monta o modelo do mês exibido (`MonthModel`), o nome acessível completo de cada dia e a frase de resumo do mês, tudo em funções puras. É a camada que transforma o estado de cada dia em dados prontos para o preview.

<skills>
### Conformidade com skills

- `find-docs`: `Intl.DateTimeFormat('pt-BR')` por partes e `@internationalized/date`.
- Regras do projeto: `code-standards.md`, `javascript-typescript.md`, `tests.md`.
</skills>

<requirements>
- RF22: semana começando no domingo, nomes de dia e mês em pt-BR.
- RF24: marcação de "hoje" no modelo e no nome acessível.
- RF27: nome acessível completo (data por extenso, dia da semana, hoje, estado).
- RF28: navegação entre meses sem limite (`shiftMonth`).
- RF32: frase do resumo, com contagem de saída do plantão entre parênteses.
- RF03 e RF34: escala incompleta devolve a orientação em vez do resumo.
- `buildMonth` recebe objeto parâmetro (`BuildMonthParams`).
</requirements>

## Subtarefas

- [ ] 2.1 Implementar `month.utils.ts` (`buildMonth`, `shiftMonth`, `leadingBlanks`, `isToday`) + spec.
- [ ] 2.2 Implementar `day-name.utils.ts` + spec.
- [ ] 2.3 Implementar `summary.utils.ts` (`summarizeMonth`, contagens) + spec.
- [ ] 2.4 Rodar `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: "Principais interfaces" (`buildMonth`, `summarizeMonth`), "Nome acessível do dia" (partes do `Intl`, ordem do PRD), modelo `CalendarDay`/`MonthModel` e exemplos de escala incompleta. Exemplos de frases em PRD RF32.

## Critérios de sucesso

- Todos os testes unitários 42–59 passam, com relógio fixo (`vi.useFakeTimers` + `vi.setSystemTime`).
- As contagens do resumo são idênticas às da grade.
- Nenhum nome acessível usa o formato `full` nativo (ordem invertida).

## Testes da tarefa

### Testes unitários

`month.utils.spec.ts`

- [ ] 42. Meses de 28, 29, 30 e 31 dias (fev/2027, fev/2028, nov, dez).
- [ ] 43. `leadingBlanks` correto para meses que começam em cada dia da semana.
- [ ] 44. `isToday` verdadeiro só no dia de hoje e só no mês de hoje.
- [ ] 45. `shiftMonth` avança/volta atravessando dezembro↔janeiro, sem limite (RF28).
- [ ] 46. Mês de uma escala incompleta tem `state: null` em todos os dias.

`day-name.utils.spec.ts`

- [ ] 47. "15 de novembro de 2026, domingo, trabalha".
- [ ] 48. "26 de novembro de 2026, quinta-feira, hoje, folga".
- [ ] 49. "2 de novembro de 2026, segunda-feira, folga, saída do plantão pela manhã".
- [ ] 50. Combinação "hoje" + saída do plantão.
- [ ] 51. Escala incompleta: nome sem estado.
- [ ] 52. Dia 1º usa "1" e não "1º".

`summary.utils.spec.ts`

- [ ] 53. Semanal: "Novembro de 2026: 21 dias trabalhando, 9 dias de folga".
- [ ] 54. 24x48: "Dezembro de 2026: 11 dias de plantão, 20 dias de folga (10 com saída do plantão pela manhã)".
- [ ] 55. 12x36 noturno: "(todos com saída do plantão pela manhã)".
- [ ] 56. 12x36 diurno: sem parênteses.
- [ ] 57. Singular ("1 dia de folga") e zero.
- [ ] 58. Contagens do resumo = contagens da grade.
- [ ] 59. Escala incompleta devolve a orientação do RF03.

### Testes de integração

- [ ] Sem testes próprios: `MonthPreview` e `MonthSummary` consomem estes módulos na tarefa 7.0 (integração 6–8).

### Testes E2E (se aplicável)

- [ ] Não se aplica (cobertos na tarefa 10.0, `month-navigation.spec.ts`).

## Arquivos relevantes

- `src/domain/schedule/month.utils.ts` (+ `.spec.ts`)
- `src/domain/schedule/day-name.utils.ts` (+ `.spec.ts`)
- `src/domain/schedule/summary.utils.ts` (+ `.spec.ts`)
- `src/types/schedule.ts` (`MonthModel`, `CalendarDay`)
