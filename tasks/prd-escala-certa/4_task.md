# Tarefa 4.0: Infra e serviços (storage, compartilhamento, analytics, consentimento)

## Visão geral

Cria os utilitários de navegador (`safe-storage`, `share-link`) e os serviços de métricas (`analytics.events`, `analytics.service`, `consent.service`). O analytics nasce como no-op (sem ID ou sem consentimento) e o GA4 real só é ligado na tarefa 11.0. Criticidade alta para privacidade (RF58–RF59).

<skills>
### Conformidade com skills

- `find-docs`: documentação do `gtag.js`, Web Share API e Clipboard API.
- Regras do projeto: `code-standards.md` (sem dados sensíveis no código; `VITE_GA_MEASUREMENT_ID` público), `javascript-typescript.md`, `tests.md` (stubs de rede/relógio, restaurar mocks em `afterEach`).
</skills>

<requirements>
- RF43, RF44, RF45: `shareLink` com menu nativo, cópia e cópia manual; cancelamento não cai para a cópia.
- RF51 e RF64 (persistência): `safe-storage` com `try/catch` e fallback em memória.
- RF55, RF56: eventos `page_view`, `schedule_completed`, `schedule_shared`, `text_size_changed` tipados.
- RF58: `page_location` sem query e `page_title` fixo em todo envio; nenhum dado do rascunho no payload.
- RF59: nada carregado nem enviado antes do consentimento; sem publicidade, `user_id` ou gravação de sessão.
- RF60: GPC tratado como recusa.
- RF61: falhas do serviço engolidas; `track` nunca lança nem é aguardado.
- RF63: configuração restritiva do `gtag` (Signals e personalização desligados, `send_page_view: false`).
- RF64: estado `unknown/granted/denied`, persistência e revogação (`ga-disable-<ID>` + apagar cookies `_ga*`).
- Constantes: chaves `escala-certa:text-size` e `escala-certa:metrics-consent`; criar `.env.example` com `VITE_GA_MEASUREMENT_ID=` vazio.
</requirements>

## Subtarefas

- [ ] 4.1 Implementar `src/lib/safe-storage.ts` + spec.
- [ ] 4.2 Implementar `src/lib/share-link.ts` + spec.
- [ ] 4.3 Implementar `src/services/analytics.events.ts` + spec.
- [ ] 4.4 Implementar `src/services/analytics.service.ts` (no-op por padrão, carga sob demanda, saneamento) + spec.
- [ ] 4.5 Implementar `src/services/consent.service.ts` (estado, GPC, persistência, revogação) + spec.
- [ ] 4.6 Criar `.env.example` e declarar o tipo da variável em `vite-env.d.ts`.
- [ ] 4.7 Rodar `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: tabela de infraestrutura e serviços, "Principais interfaces" (`ShareOutcome`, `Consent`, `track`, `setAnalyticsEnabled`), "`AnalyticsEvent`", "`StoredPreferences`", "Parâmetros fixados no GA4" e "Pontos de integração" (GA4, Web Share/Clipboard).

## Critérios de sucesso

- Todos os testes unitários 87–110 passam (os casos 87–92 cobrem aqui a camada de serviço de consentimento).
- Com analytics desabilitado, nenhum script, `dataLayer` ou cookie é criado.
- O teste de contrato (caso 97) falha se qualquer dado do rascunho aparecer no payload.

## Testes da tarefa

### Testes unitários

`consent.service.spec.ts` (camada de serviço dos casos 87–92)

- [ ] 87. Estado inicial `unknown` sem preferência; `granted`/`denied` quando guardado.
- [ ] 88. GPC ativo: `denied`, sem banner, nada carregado (RF60).
- [ ] 89. `accept` persiste e habilita o analytics; `refuse` persiste e não habilita.
- [ ] 90. Revogar após aceitar desabilita, define `ga-disable` e apaga cookies `_ga*`.
- [ ] 91. Armazenamento indisponível: vale na visita; `unknown` na próxima.
- [ ] 92. Valor inválido no storage é tratado como `unknown`.

`analytics.service.spec.ts` (criticidade alta)

- [ ] 93. Desabilitado: `track` não injeta script, não cria `dataLayer`, não lança.
- [ ] 94. Habilitado: injeta `gtag.js` uma única vez e configura com os parâmetros fixados.
- [ ] 95. `page_view` enviado uma vez por visita com `has_schedule` correto.
- [ ] 96. Todo payload usa `page_location` sem query e `page_title` fixo, mesmo com nome e query presentes.
- [ ] 97. Teste de contrato: nenhuma chave/valor contém nome, datas, folgas ou a URL do rascunho.
- [ ] 98. `onerror` do script e exceção em `gtag` são engolidos (RF61).
- [ ] 99. Sem `VITE_GA_MEASUREMENT_ID`: no-op.
- [ ] 100. Revogação após carga bloqueia eventos seguintes.

`analytics.events.spec.ts`

- [ ] 101. `schedule_completed` para plantão (variant `12x36-night`, `weeks: 0`) e semanal (`6x1`, `weeks: 7`).
- [ ] 102. `schedule_shared` com cada método; `text_size_changed` com cada nível.

`share-link.spec.ts`

- [ ] 103. Share nativo: chama `navigator.share` com título, texto (com nome) e URL → `'native'`.
- [ ] 104. Sem nome: texto sem o nome.
- [ ] 105. `AbortError` → `'cancelled'`, sem cair para a cópia.
- [ ] 106. Outro erro do share → tenta a cópia.
- [ ] 107. Sem `navigator.share` → `clipboard.writeText` → `'clipboard'`.
- [ ] 108. `canShare` falso → cópia.
- [ ] 109. Clipboard ausente ou rejeitado → `'manual'`.

`safe-storage.spec.ts`

- [ ] 110. Lê/escreve normalmente; `getItem` e `setItem` que lançam caem para memória; memória não vaza entre testes.

### Testes de integração

- [ ] Sem testes próprios: serviços integram com a tela nas tarefas 8.0 (integração 9, 11, 12) e 9.0 (integração 23, 24, 25).

### Testes E2E (se aplicável)

- [ ] Não se aplica (cobertos na tarefa 10.0, `consent-analytics.spec.ts` e `schedule-share.spec.ts`).

## Arquivos relevantes

- `src/lib/safe-storage.ts`, `src/lib/share-link.ts` (+ specs)
- `src/services/analytics.events.ts`, `analytics.service.ts`, `consent.service.ts` (+ specs)
- `src/vite-env.d.ts`
- `.env.example`
