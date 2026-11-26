# Tarefa 1.0: Fundação e domínio de ciclos

## Visão geral

Cria a base do domínio puro (sem React): dependência `@internationalized/date`, tipos, constantes, utilitários de data sem fuso e as regras de ciclo de plantão, padrão semanal, estado do dia e transições do rascunho. É a parte de maior criticidade e maior risco (fuso e horário de verão), e tudo depende dela.

<skills>
### Conformidade com skills

- `find-docs`: consultar a documentação de `@internationalized/date` (`CalendarDate`).
- Regras do projeto: `.agents/rules/code-standards.md`, `javascript-typescript.md`, `tests.md`, `folder-structure.md`.
</skills>

<requirements>
- RF06, RF07 (regra), RF08 (tabela de ciclos), RF09, RF10: ciclos de plantão com projeção para trás.
- RF11, RF12, RF13, RF14, RF15 (cálculo de semana incompleta), RF17, RF18, RF19, RF20, RF21: padrão semanal e transições do rascunho.
- RF03 e RF34 (texto de orientação via `getMissingFieldsMessage`).
- RF40 (nome até 40 caracteres, saneado).
- Datas calculadas em dias de calendário, sem fuso (restrição "Datas" do PRD).
- Arquivos ≤ 100 linhas, funções ≤ 30 linhas, ≤ 3 parâmetros, sem comentários, sem `any`.
</requirements>

## Subtarefas

- [x] 1.1 Adicionar `@internationalized/date` como dependência direta (`pnpm add`).
- [x] 1.2 Conferir que `.agents/rules/folder-structure.md` já descreve `src/domain/` (aprovado) e criar `src/domain/schedule/`.
- [x] 1.3 Criar `src/types/schedule.ts` e `src/domain/schedule/schedule.constants.ts`.
- [x] 1.4 Implementar `date.utils.ts` + `date.utils.spec.ts`.
- [x] 1.5 Implementar `shift-cycle.utils.ts` + `shift-cycle.utils.spec.ts`.
- [x] 1.6 Implementar `weekly-pattern.utils.ts` + `weekly-pattern.utils.spec.ts`.
- [x] 1.7 Implementar `day-state.utils.ts` + `day-state.utils.spec.ts`.
- [x] 1.8 Implementar `config.utils.ts` + `config.utils.spec.ts`.
- [x] 1.9 Rodar `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: "Visão dos componentes" (tabelas de domínio e tipos), "Principais interfaces", "Regras de implementação que não são óbvias" (contagem de dias sem fuso, plantão, semanal), "Modelos de dados" (`ScheduleDraft`, `ShiftDraft`, `WeeklyDraft`) e PRD RF08 (tabela de ciclos).

## Critérios de sucesso

- Todos os testes unitários 1–41 passam, inclusive com o fuso do processo em `America/Sao_Paulo`, `UTC` e `Pacific/Auckland`.
- Nenhuma função de domínio importa React nem acessa `window`.
- Cobertura do domínio perto de 90%; `pnpm lint`, `pnpm build` e `pnpm test:coverage` verdes.

## Testes da tarefa

### Testes unitários

`date.utils.spec.ts`

- [x] 1. `daysBetween` retorna 0 para a mesma data.
- [x] 2. `daysBetween` retorna positivo para datas futuras e negativo para passadas.
- [x] 3. `daysBetween` conta corretamente através de 29/02 em ano bissexto (2028) e não bissexto (2027).
- [x] 4. `daysBetween` atravessando virada de ano (31/12 → 01/01).
- [x] 5. `daysBetween` é igual com o fuso do processo em `America/Sao_Paulo`, `UTC` e `Pacific/Auckland` (dias de mudança de horário de verão).
- [x] 6. `positiveModulo` devolve valor em `[0, n)` para dividendo negativo, zero e positivo.
- [x] 7. `startOfWeekSunday` devolve a própria data quando domingo e o domingo anterior nos demais dias, inclusive virando mês e ano.
- [x] 8. `isValidIsoDate` aceita `2028-02-29`; rejeita `2027-02-29`, `2026-02-30`, `2026-13-01`, `abc`, `''`, `2026-1-1`.
- [x] 9. Datas fora do intervalo aceito (ano < 1900 ou > 2199) são inválidas.

`shift-cycle.utils.spec.ts`

- [x] 10. 12x36 diurno: dia 0 `work`, dia 1 `off`, dia 2 `work` (repete).
- [x] 11. 12x36 noturno: dia 0 `work`, dia 1 `off-exit`; nunca produz `off`.
- [x] 12. 24x48: `work`, `off-exit`, `off`, repetindo.
- [x] 13. 24x72: `work`, `off-exit`, `off`, `off`, repetindo.
- [x] 14. Projeção para trás (RF10): dia −1 de cada escala cai no último estado do ciclo; dia −len repete o dia 0.
- [x] 15. Referência no meio do mês e no passado: dias anteriores do mês ficam preenchidos (US16).
- [x] 16. Datas muito distantes (±10 anos) mantêm o ciclo correto.
- [x] 17. Atravessar virada de ano, 29/02 e mudanças de horário não desloca estados.
- [x] 18. Tabela parametrizada: cada escala × cada offset 0…2·len confere com a tabela do RF08.

`weekly-pattern.utils.spec.ts`

- [x] 19. Folga fixa (1 semana, 5x2 sáb/dom): marca sábado e domingo em qualquer mês.
- [x] 20. Folga fixa 6x1 (domingo): só domingos são folga.
- [x] 21. Rodízio de 2 semanas alterna a cada domingo.
- [x] 22. Rodízio de 7 semanas (folga avança um dia por semana e volta ao domingo) confere nas 14 semanas seguintes.
- [x] 23. Âncora no meio da semana: a semana 1 é a de domingo a sábado que a contém.
- [x] 24. Âncora no domingo e no sábado (limites da semana).
- [x] 25. Projeção para semanas anteriores à âncora (índice negativo) mantém o padrão.
- [x] 26. Semana sem folgas marcadas produz só `work`.
- [x] 27. Nunca produz `off-exit`.
- [x] 28. Âncora e datas atravessando virada de ano/29/02.

`day-state.utils.spec.ts`

- [x] 29. `getDayState` retorna `null` quando o rascunho está incompleto (cada campo faltante, por tipo).
- [x] 30. `isScheduleComplete`: plantão completo; 12x36 sem turno incompleto; 24x48 sem turno é completo; semanal sem âncora incompleto; semanal sem modalidade incompleto; tipo `null` incompleto.
- [x] 31. Semanal com semana incompleta: ainda completa para exibição (aviso é do formulário), alinhado ao RF15.
- [x] 32. `getMissingFieldsMessage` descreve o que falta para cada combinação.

`config.utils.spec.ts`

- [x] 33. Trocar de tipo preserva os campos do outro tipo.
- [x] 34. Trocar a modalidade limpa as folgas e sinaliza o aviso (RF20).
- [x] 35. Mesma modalidade selecionada de novo não limpa.
- [x] 36. Reduzir semanas descarta as excedentes (RF19); aumentar adiciona semanas vazias.
- [x] 37. Limites 1 e 7 de semanas; valores fora (0, 8) são rejeitados/clamped.
- [x] 38. Alternar folga marca e desmarca.
- [x] 39. Em 5x2, a 3ª folga na semana é recusada; em 6x1, a 2ª (RF14).
- [x] 40. `isWeekIncomplete` verdadeiro abaixo do exigido, falso no limite.
- [x] 41. Nome: corta em 40, remove controles, preserva acentos e emojis.

### Testes de integração

- [x] Sem testes de integração próprios: a integração dos módulos de domínio com a tela é coberta na tarefa 9.0 (integração 14–27). Aqui, o teste parametrizado do caso 18 cruza `schedule.constants` com `shift-cycle`.

### Testes E2E (se aplicável)

- [x] Não se aplica (cobertos na tarefa 10.0).

## Arquivos relevantes

- `package.json`, `pnpm-lock.yaml`
- `src/types/schedule.ts`
- `src/domain/schedule/schedule.constants.ts`
- `src/domain/schedule/date.utils.ts` (+ `.spec.ts`)
- `src/domain/schedule/shift-cycle.utils.ts` (+ `.spec.ts`)
- `src/domain/schedule/weekly-pattern.utils.ts` (+ `.spec.ts`)
- `src/domain/schedule/day-state.utils.ts` (+ `.spec.ts`)
- `src/domain/schedule/config.utils.ts`, `off-days.utils.ts`, `name.utils.ts` (+ `.spec.ts`)
- `.agents/rules/folder-structure.md`
