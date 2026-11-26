# Tarefa 5.0: Hooks de estado

## Visão geral

Cria os hooks que ligam o domínio e os serviços à interface: rascunho da escala espelhado na URL, navegação de meses, tamanho de texto e consentimento de métricas. Efeitos só para sincronização com sistemas externos; `replaceState` e `track` ficam em handlers.

<skills>
### Conformidade com skills

- `react-patterns` (**carregar antes de implementar**): efeitos, estado, hooks customizados, pureza.
- `find-docs`: React 19 se houver dúvida de API.
- Regras do projeto: `code-standards.md` (sem `useMemo`/`useCallback`/`memo`), `tests.md`.
</skills>

<requirements>
- RF30: o preview se atualiza a cada alteração, sem confirmar (estado derivado do rascunho).
- RF35, RF38: cada alteração faz `history.replaceState` sem criar entrada de histórico.
- RF29: `isCurrentMonth` e ação de voltar ao mês atual; RF28: sem limite de meses.
- RF48–RF51: níveis 100–200% em passos de 25%, aplicados em `document.documentElement`, persistidos, limites com motivo, mensagem "Texto em N%".
- RF56, RF57: `schedule_completed` uma vez por visita e de novo só se tipo/turno/modalidade mudarem; `text_size_changed` só quando o nível muda.
- RF60, RF64: `useMetricsConsent` expõe estado e ações (`accept`, `refuse`, `revoke`) e liga/desliga o analytics.
</requirements>

## Subtarefas

- [x] 5.1 Implementar `src/hooks/useMetricsConsent.ts` + spec.
- [x] 5.2 Implementar `src/components/TextSizeControl/useTextSize.ts` + spec.
- [x] 5.3 Implementar `src/views/HomeView/useMonthNavigation.ts` + spec.
- [x] 5.4 Implementar `src/views/HomeView/useScheduleConfig.ts` (inicialização pela URL, `replaceState`, rastreio de escala completada) + spec.
- [x] 5.5 Rodar `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: tabela "Hooks", fluxo de dados, "Efeitos: `replaceState`, `track` e `navigator.share` ficam em handlers", `StoredPreferences` e `AnalyticsEvent` (`schedule_completed`, `text_size_changed`).

## Critérios de sucesso

- Testes 79–86 passam e os casos 87–92 passam também pelo hook `useMetricsConsent`.
- `history.length` não cresce com alterações no rascunho.
- Nenhum `useEffect` usado para derivar estado ou disparar `track`.

## Testes da tarefa

### Testes unitários

`useTextSize.spec.ts`

- [x] 79. Inicia em 100 sem preferência.
- [x] 80. Restaura valor guardado; ignora valor inválido ("abc", 90, 300).
- [x] 81. Aumentar/diminuir em passos de 25; limites 100 e 200 desabilitam a ação e informam o motivo (RF50).
- [x] 82. "Tamanho padrão" volta a 100.
- [x] 83. Aplica o percentual no `<html>` e limpa ao desmontar.
- [x] 84. Persiste a cada mudança; armazenamento que lança erro não quebra e funciona sem lembrar (RF51).
- [x] 85. Dispara `text_size_changed` com o nível (mesmo valor repetido não dispara).
- [x] 86. Mensagem "Texto em 150%".

`useMetricsConsent.spec.ts` (camada de hook dos casos 87–92)

- [x] 87. Estado inicial `unknown` sem preferência; `granted`/`denied` quando guardado.
- [x] 88. GPC ativo: `denied`, sem banner, nada carregado (RF60).
- [x] 89. `accept` persiste e habilita o analytics; `refuse` persiste e não habilita.
- [x] 90. Revogar após aceitar desabilita, define `ga-disable` e apaga cookies `_ga*`.
- [x] 91. Armazenamento indisponível: vale na visita; `unknown` na próxima.
- [x] 92. Valor inválido no storage é tratado como `unknown`.

`useMonthNavigation.spec.ts` (derivados de RF28, RF29, US8)

- [x] Inicia no mês atual (relógio fixo em 26/11/2026).
- [x] Anterior/próximo atravessam dezembro↔janeiro sem limite.
- [x] `isCurrentMonth` é falso fora do mês atual e "hoje" volta ao mês atual.

`useScheduleConfig.spec.ts` (derivados de RF35, RF36, RF38, RF57)

- [x] Inicializa o rascunho a partir da URL válida e devolve `issues` para link inválido.
- [x] Cada alteração chama `replaceState` com a query serializada e `history.length` não cresce.
- [x] `schedule_completed` dispara uma vez ao completar, não repete ao mudar marcações e repete ao mudar tipo/turno/modalidade.
- [x] Com analytics desabilitado, nada é enviado e nada lança.

### Testes de integração

- [x] A integração real dos hooks com a tela é coberta na tarefa 9.0 (integração 16, 22, 23).

### Testes E2E (se aplicável)

- [x] Não se aplica (cobertos na tarefa 10.0).

## Arquivos relevantes

- `src/hooks/useMetricsConsent.ts` (+ `.spec.ts`)
- `src/components/TextSizeControl/useTextSize.ts` (+ `.spec.ts`)
- `src/views/HomeView/useMonthNavigation.ts` (+ `.spec.ts`)
- `src/views/HomeView/useScheduleConfig.ts` (+ `.spec.ts`)
