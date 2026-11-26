# Tarefa 7.0: Preview do mês

## Visão geral

Entrega o calendário de consulta: cabeçalho com navegação, grade de 7 colunas que vira lista por container query em `rem`, célula do dia com nome acessível, legenda e resumo anunciado. É o centro do produto.

<skills>
### Conformidade com skills

- `react-patterns` (**carregar antes de implementar**): componentes puros, `key`, acessibilidade, Tailwind.
- `impeccable`: estados (trabalha/folga/saída), hoje, legenda, tema claro/escuro e contraste.
- `find-docs`: Tailwind v4 container queries (`@container`, `@min-*`).
- Regras do projeto: `code-standards.md` (tokens do tema, `cn()`), `tests.md`.
</skills>

<requirements>
- RF03: escala incompleta mostra o mês atual sem estados, com orientação em texto.
- RF22–RF25: um mês por vez, semana no domingo, hoje com destaque não só por cor, estado por cor + ícone/texto, folgas reconhecíveis e distinguíveis.
- RF26: legenda só com os estados existentes; "Folga (saída do plantão)" explica a saída pela manhã.
- RF27: nome acessível completo em cada dia.
- RF28, RF29: botões "Mês anterior"/"Próximo mês" e "Voltar ao mês atual" só fora do mês atual.
- RF31: tocar em um dia não altera a escala.
- RF32–RF34: resumo em `role="status"`, anunciado ao mudar mês/escala; substituído pela orientação quando incompleta.
- RF52, RF53: células crescem com o texto; abaixo do ponto de corte (constante única, ponto de partida `35rem`) vira lista com os mesmos estados, ícones, hoje, nomes e legenda.
- Contraste ≥ 4,5:1 (texto) e ≥ 3:1 (indicadores) nos dois temas.
</requirements>

## Subtarefas

- [ ] 7.1 `DayCell` e `MonthHeader` + specs.
- [ ] 7.2 `Legend` e `MonthSummary` + specs.
- [ ] 7.3 `MonthPreview` com grade/lista por container query e deslocamento do 1º dia (`col-start-N` só na variante de container).
- [ ] 7.4 Calibrar o ponto de corte com verificação visual em 320–1280 px e texto 100–200%.
- [ ] 7.5 Rodar `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: "Layout grade/lista", "Nome acessível do dia", "Anúncios", modelo `MonthModel` e risco "Ponto de corte grade→lista inadequado".

## Critérios de sucesso

- Testes de integração 6–8 passam.
- Grade e lista expõem os mesmos nomes acessíveis, ícones e legenda.
- Sem rolagem horizontal em 320 px.

## Testes da tarefa

### Testes unitários

- [ ] Funções puras locais (se criadas, ex.: mapeamento estado → rótulo/ícone) com spec ao lado, um conceito por teste.

### Testes de integração

- [ ] 6. `MonthPreview`: cabeçalho com mês/ano pt-BR; botões "Mês anterior"/"Próximo mês"; "Voltar ao mês atual" só fora do mês atual (RF29); hoje destacado com marcador não só de cor; cada estado com ícone/texto; legenda lista só os estados existentes e explica a saída do plantão (RF26); `DayCell` com nome acessível completo; tocar em um dia não altera a escala (RF31); sem escala completa mostra orientação (RF03).
- [ ] 7. `MonthSummary`: frase correta, `role="status"`, anunciada ao mudar de mês ou escala; substituída pela orientação quando incompleta.
- [ ] 8. Layout: container estreito ou fonte ampliada → lista; largo → grade de 7 colunas; mesmos nomes, ícones e legenda nas duas formas (RF52–RF53).

### Testes E2E (se aplicável)

- [ ] Não se aplica (cobertos na tarefa 10.0, `month-navigation.spec.ts`, `text-size.spec.ts` e `accessibility.spec.ts`).

## Arquivos relevantes

- `src/components/MonthPreview/` (`MonthPreview.tsx`, `MonthHeader.tsx`, `DayCell.tsx`, `Legend.tsx`, `MonthSummary.tsx`)
- `src/index.css` (tokens dos estados)
- `src/domain/schedule/month.utils.ts`, `day-name.utils.ts`, `summary.utils.ts` (consumidos)
