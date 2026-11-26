# Tarefa 8.0: Compartilhar, tamanho de texto, aviso, privacidade e consentimento

## Visão geral

Entrega os componentes de apoio da tela: botão de compartilhar, controle de tamanho de texto, aviso de link inválido, diálogo de privacidade e banner de consentimento de métricas.

<skills>
### Conformidade com skills

- `react-patterns` (**carregar antes de implementar**): efeitos, foco, diálogos, acessibilidade.
- `find-docs`: `react-aria-components` (`Dialog`, `Modal`/`Popover`, `ToggleButton`).
- `impeccable`: peso visual igual dos dois botões do banner, rodapé discreto.
- Regras do projeto: `code-standards.md`, `tests.md`.
</skills>

<requirements>
- RF37: `ConfigNotice` com `role="alert"` por `issues`, some sem problemas.
- RF43–RF46: "Compartilhar escala" (menu nativo, "Link copiado" em `role="status"`, campo selecionável para cópia manual), desabilitado com escala incompleta; cancelamento não mostra nada nem rastreia.
- RF48–RF50: botões "Diminuir texto", "Tamanho padrão" e "Aumentar texto", nível exibido e anunciado, limites com motivo.
- RF62: texto de Privacidade (o que é medido, Google, cookies, o que nunca é coletado, escala só no link); abrir não apaga a escala; Esc devolve o foco ao link.
- RF64: banner com "Aceitar métricas"/"Recusar métricas" de mesmo peso e sem pré-seleção; alternância das métricas no texto de privacidade com estado visível e anunciado.
- RF65: banner acessível, anunciado, sem prender o foco, sem cobrir o preview nem a entrada, utilizável a 200%/400%, devolve o foco a um ponto lógico.
- RF60: com GPC o banner não aparece.
</requirements>

## Subtarefas

- [ ] 8.1 `ConfigNotice` + spec.
- [ ] 8.2 `TextSizeControl` (usa `useTextSize`) + spec.
- [ ] 8.3 `ShareButton` (usa `shareLink` e `track`) + spec.
- [ ] 8.4 `PrivacyDialog` (usa `useMetricsConsent`) + spec.
- [ ] 8.5 `ConsentBanner` + spec.
- [ ] 8.6 Rodar `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: tabela de componentes, "Anúncios", "Pontos de integração" (Web Share/Clipboard, GA4) e PRD funcionalidades 7, 8 e 9. A cópia manual e o evento `schedule_shared` seguem `ShareOutcome`.

## Critérios de sucesso

- Testes de integração 9–13 passam, substituindo só o que é externo (`navigator.share`, clipboard, injeção do GA4, `localStorage` quebrado).
- Foco nunca fica preso; Esc fecha diálogos devolvendo o foco.

## Testes da tarefa

### Testes unitários

- [ ] Funções puras locais (ex.: texto do compartilhamento com/sem nome) com spec ao lado.

### Testes de integração

- [ ] 9. `ShareButton`: desabilitado com escala incompleta (RF46); com `navigator.share` chama o menu; sem ele copia e mostra "Link copiado" em `role="status"`; falha ao copiar mostra campo selecionável com o link; cancelamento não mostra nada nem rastreia.
- [ ] 10. `TextSizeControl`: rótulos acessíveis, nível exibido e anunciado, limites com motivo.
- [ ] 11. `ConsentBanner`: aparece sem escolha; botões "Aceitar métricas"/"Recusar métricas" com mesmo peso; some após escolher; não aparece com escolha guardada nem com GPC; não prende o foco; escolher devolve o foco a ponto lógico (RF64–RF65).
- [ ] 12. `PrivacyDialog`: abre sem perder a escala, fecha com Esc devolvendo foco ao link; alternância das métricas com estado visível e anunciado; texto cita Google, cookies, o que nunca é coletado e que a escala fica só no link (RF62).
- [ ] 13. `ConfigNotice`: mostra a mensagem por `issues`, com `role="alert"`; some quando não há problemas.

### Testes E2E (se aplicável)

- [ ] Não se aplica (cobertos na tarefa 10.0: `schedule-share`, `text-size`, `consent-analytics`, `privacy`).

## Arquivos relevantes

- `src/components/ShareButton/`
- `src/components/TextSizeControl/`
- `src/components/ConfigNotice/`
- `src/components/PrivacyDialog/`
- `src/components/ConsentBanner/`
- `src/hooks/useMetricsConsent.ts`, `src/lib/share-link.ts`, `src/services/analytics.events.ts` (consumidos)
