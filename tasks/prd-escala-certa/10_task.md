# Tarefa 10.0: E2E, acessibilidade e desempenho

## Visão geral

Cobre os fluxos críticos de ponta a ponta com Playwright sobre o build de produção (com React Compiler), inclui a varredura de acessibilidade WCAG 2.2 AA e as metas de desempenho. Substitui o `e2e/home.spec.ts` do placeholder.

<skills>
### Conformidade com skills

- `executar-qa`: referência para a validação de acessibilidade e responsividade.
- `agent-browser` / Playwright MCP: apoio na verificação visual dos estados.
- `find-docs`: Playwright (`page.clock`, `page.route`) e `@axe-core/playwright`.
- Regras do projeto: `tests.md` (E2E em `e2e/`, cada teste prepara os próprios dados via URL, sem depender de outro).
</skills>

<requirements>
- Cada teste prepara os próprios dados pela URL, intercepta `**/googletagmanager.com/**` e `**/google-analytics.com/**` com `page.route` (nunca chama o Google de verdade) e fixa o relógio com `page.clock`.
- `baseURL` `http://localhost:4173/escala-certa/`, projeto Chromium.
- WCAG 2.2 AA: varredura axe com tags `wcag2a`, `wcag2aa`, `wcag22aa` nos estados e temas definidos.
- Desempenho: preview < 100 ms por alteração; página utilizável em < 3 s com throttling de 4G intermediário.
- Privacidade: zero requisições ao Google antes do aceite, `dl` sem query e `dt` fixo depois.
</requirements>

## Subtarefas

- [x] 10.1 Adicionar `@axe-core/playwright` como dependência de desenvolvimento.
- [x] 10.2 Remover `e2e/home.spec.ts` e criar os 10 arquivos de E2E listados abaixo.
- [x] 10.3 Criar helpers de E2E (URL de escala, mock do Google, relógio) sem comentários e com ≤ 100 linhas por arquivo.
- [x] 10.4 Rodar `pnpm test:e2e`, `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: seção "Testes E2E", "Pontos de integração" (GA4) e PRD "Requisitos de acessibilidade". Fluxos de usuário em PRD "Fluxos principais".

## Critérios de sucesso

- Os 10 arquivos E2E passam em `pnpm test:e2e` (também no hook `pre-push` e na CI).
- Zero violações axe nos estados e temas cobertos.
- Nenhuma requisição real ao Google durante os testes.

## Testes da tarefa

### Testes unitários

- [x] Não se aplica (testes unitários e de integração vêm das tarefas 1.0–9.0).

### Testes de integração

- [x] Não se aplica (cobertos nas tarefas 6.0–9.0).

### Testes E2E

- [x] 1. `schedule-shift.spec.ts`: plantonista configura 12x36 noturno em < 1 min e vê hoje, legenda e resumo (US1–US3); a URL reflete a escala; recarregar a página restaura (US10).
- [x] 2. `schedule-weekly.spec.ts`: comerciário em rodízio de 4 semanas marca folgas conferindo o preview e informa a âncora; aviso de semana incompleta (US6, US7, US19).
- [x] 3. `schedule-reopen.spec.ts`: abrir link salvo antigo abre no mês atual com hoje destacado (US17); abrir link editado à mão mostra aviso com formulário utilizável (US18).
- [x] 4. `schedule-share.spec.ts`: com `navigator.share` simulado, o menu recebe link e texto com o nome; sem ele, copia e anuncia "Link copiado"; destinatário abre o link, vê o nome, ajusta e a URL muda (US11, US12).
- [x] 5. `month-navigation.spec.ts`: navegar para meses distantes, voltar ao atual, verificar resumo e estados (US8, US9).
- [x] 6. `text-size.spec.ts`: aumentar até 200% (lembrado após recarregar), preview em lista, sem rolagem horizontal em 320 px e com zoom equivalente a 400% (US14, US15).
- [x] 7. `consent-analytics.spec.ts`: antes do aceite, nenhuma requisição ao Google e nenhum cookie `_ga`; após "Aceitar métricas", `page_view` e eventos saem com `dl` (page_location) sem query e `dt` fixo, e nada contém nome ou datas; "Recusar" e GPC (`extraHTTPHeaders`/propriedade `globalPrivacyControl`) mantêm zero requisições; revogar pelo texto de privacidade interrompe o envio e apaga cookies; GA bloqueado não gera erro visível.
- [x] 8. `privacy.spec.ts`: abrir "Privacidade" sem perder a escala, fechar com Esc, alternar métricas.
- [x] 9. `accessibility.spec.ts`: varredura `@axe-core/playwright` (tags `wcag2a`, `wcag2aa`, `wcag22aa`) em estados vazio, plantão, semanal, lista, banner aberto, diálogo de privacidade, nos temas claro e escuro; navegação completa por teclado (ordem de foco, sem armadilha, Esc nos popups); `prefers-reduced-motion`; áreas de toque ≥ 24×24 px.
- [x] 10. `performance.spec.ts`: o preview reflete uma alteração em < 100 ms (medição com `performance.now` em torno do evento) e a página fica utilizável com throttling de CPU/rede equivalente a 4G intermediário em < 3 s.

## Arquivos relevantes

- `e2e/` (os 10 arquivos acima e helpers); `e2e/home.spec.ts` removido
- `playwright.config.ts`
- `package.json`, `pnpm-lock.yaml`
- `.husky/pre-push`, `.github/workflows/deploy.yml` (já rodam `pnpm test:e2e`)
