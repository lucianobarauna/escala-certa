# Tarefa 6.0: Formulários de entrada

## Visão geral

Entrega os componentes de entrada da escala: escolha do tipo, campo de data digitável com popup, formulário de plantão, formulário semanal em rodízio e nome da escala. Instala os primitivos shadcn necessários sem editá-los depois.

<skills>
### Conformidade com skills

- `react-patterns` (**carregar antes de implementar**): componentes pequenos, `useId`, formulários, acessibilidade, Tailwind.
- `find-docs`: `react-aria-components` (`DateField`, `DatePicker`, `RadioGroup`, `Select`) e `@internationalized/date`.
- `impeccable`: hierarquia e estados visuais do formulário.
- Regras do projeto: `code-standards.md`, `tests.md`, `folder-structure.md`.
</skills>

<requirements>
- RF01, RF02: Plantão/Semanal com descrição no nome acessível; só os campos do tipo.
- RF04, RF05: data dd/mm/aaaa digitável com popup opcional; erro em texto, anunciado, sem apagar o digitado.
- RF06, RF07: escala 12x36/24x48/24x72; turno só e obrigatório no 12x36.
- RF11–RF16: modalidade, 1 a 7 semanas, folgas por semana, limite com motivo, semana incompleta indicada por texto/ícone e anunciada, âncora da semana 1.
- RF19, RF20: reduzir/aumentar semanas e aviso ao trocar de modalidade.
- RF40, RF41: nome ≤ 40 caracteres com aviso de privacidade associado (`aria-describedby`).
- RF54: folgas semanais em lista quando os 7 dias não couberem.
- Áreas de toque ≥ 24×24 px; foco visível; nenhum estado só por cor.
</requirements>

## Subtarefas

- [x] 6.1 Adicionar os primitivos shadcn (campos de texto/data, radio, seleção, toggle) via CLI, estilo `aria-nova`, sem editar os gerados.
- [x] 6.2 `ScheduleTypeSelector` + spec.
- [x] 6.3 `ReferenceDateField` + spec.
- [x] 6.4 `ShiftForm` + spec.
- [x] 6.5 `WeeklyForm` (+ `WeekRow.tsx`, `weekly-form.utils.ts`) + spec.
- [x] 6.6 `ScheduleNameField` + spec.
- [x] 6.7 Rodar `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: tabela de componentes e tela, "Grade própria + `DateField`/`DatePicker`", riscos ("`DateField` segmentado não ser entendido como campo digitável" e o fallback), "Layout grade/lista" (aplicado ao `WeekRow`) e "Anúncios" (`role="status"`/`role="alert"`).

## Critérios de sucesso

- Testes de integração 1–5 passam (browser mode com `vitest-browser-react`).
- Queries por papel/texto (`getByRole`, `getByLabelText`); sem test IDs.
- Navegação completa por teclado nos formulários; popup fecha com Esc devolvendo o foco ao campo.

## Testes da tarefa

### Testes unitários

- [x] `weekly-form.utils.spec.ts`: funções puras locais (rótulos de semana, motivo do limite, texto de semana incompleta), um conceito por teste.

### Testes de integração

- [x] 1. `ScheduleTypeSelector`: duas opções, uma selecionada por vez; descrição faz parte do nome acessível (RF01); trocar tipo exibe só os campos do tipo (RF02); navegação por setas.
- [x] 2. `ReferenceDateField`: digitar `26/11/2026` seleciona; incompleta/inválida mostra erro em texto com `role="alert"` associado ao campo sem apagar o digitado (RF05); popup abre/fecha com Esc e devolve o foco ao campo; locale pt-BR.
- [x] 3. `ShiftForm`: turno só aparece em 12x36 e é obrigatório; trocar para 24x48 esconde o turno; preenche o rascunho.
- [x] 4. `WeeklyForm`: modalidade; quantidade 1–7 (padrão 1); marcar folgas; limite atingido desabilita os demais com motivo em texto; semana incompleta indicada por texto/ícone e anunciada (RF15); aviso ao trocar a modalidade (RF20); reduzir/aumentar semanas.
- [x] 5. `ScheduleNameField`: limite de 40; aviso de privacidade visível e associado (`aria-describedby`).

### Testes E2E (se aplicável)

- [x] Não se aplica (cobertos na tarefa 10.0, `schedule-shift.spec.ts` e `schedule-weekly.spec.ts`).

## Arquivos relevantes

- `src/components/ui/` (primitivos shadcn adicionados)
- `src/components/ScheduleTypeSelector/`
- `src/components/ReferenceDateField/`
- `src/components/ShiftForm/`
- `src/components/WeeklyForm/` (`WeeklyForm.tsx`, `WeekRow.tsx`, `weekly-form.utils.ts`)
- `src/components/ScheduleNameField/`
- `components.json`, `src/index.css`
