# Tarefa 9.0: HomeView e App

## Visão geral

Compõe a página: entrada, preview, resumo, compartilhar, tamanho de texto, privacidade e banner. Liga os handlers ao rastreio, define o `<title>` com o nome da escala e substitui o placeholder (`HelloWorld`) por `I18nProvider` pt-BR + `HomeView`. Aqui a integração entre módulos reais valida as histórias de usuário.

<skills>
### Conformidade com skills

- `react-patterns` (**carregar antes de implementar**): composição, estado elevado, `<title>` do React 19, efeitos.
- `impeccable`: layout mobile-first (preview visível sem rolagem após configurar o plantão), temas claro e escuro.
- `find-docs`: `I18nProvider` do `react-aria-components`.
- Regras do projeto: `code-standards.md` (≤ 100 linhas por arquivo), `tests.md`.
</skills>

<requirements>
- RF23: abre no mês atual com ou sem link; US17.
- RF30, RF35–RF38, RF47: preview e URL atualizam a cada alteração; link recebido pode ser ajustado sem afetar o original.
- RF42: nome no topo do preview e no `document.title`; sem nome, título padrão.
- RF56–RF58, RF61: eventos disparados nos handlers, sem dados da escala no payload, sem erro quando o GA4 é bloqueado.
- RF52, RF53: texto a 200% leva o preview à lista sem rolagem horizontal.
- US1–US20 atendidas no fluxo integrado; remoção do `HelloWorld` e de `App.spec.tsx` do placeholder; tema claro/escuro pela preferência do sistema.
</requirements>

## Subtarefas

- [x] 9.1 Implementar `HomeView.tsx` (e subcomponentes locais se necessário para o limite de 100 linhas).
- [x] 9.2 Atualizar `App.tsx` (`I18nProvider` pt-BR + `HomeView`) e remover `src/components/HelloWorld/` e o spec do placeholder.
- [x] 9.3 Escrever os testes de integração do `HomeView` (um arquivo por grupo, cada um montando a própria URL em `beforeEach`).
- [x] 9.4 Rodar `pnpm lint`, `pnpm build` e `pnpm test:coverage`.

## Detalhes de implementação

Ver `techspec.md`: "Fluxo de dados", "Principais decisões" (estado na query string; efeitos só para sistemas externos) e "Testes de integração" do `HomeView`. Cada teste cria a própria URL com `history.replaceState` e fixa o relógio em 26/11/2026.

## Critérios de sucesso

- Testes de integração 14–27 passam.
- `pnpm test:coverage` ≥ 80% em linhas, funções, branches e statements.
- Nenhum erro no console com o GA4 bloqueado.

## Testes da tarefa

### Testes unitários

- [x] Funções puras locais do `HomeView` (se criadas) com spec ao lado.

### Testes de integração

- [x] 14. Fluxo plantão: escolher tipo → data → 12x36 → turno → preview preenchido, legenda e resumo corretos para o mês atual (relógio fixo em 26/11/2026).
- [x] 15. Fluxo semanal em rodízio: modalidade → semanas → folgas → âncora; o preview muda a cada folga marcada (US7, RF30).
- [x] 16. A URL é atualizada a cada alteração com `replaceState` e `history.length` não cresce (RF38); o botão "voltar" não percorre marcações.
- [x] 17. Abrir com URL válida restaura formulário e preview idênticos (RF36), sem nenhum preenchimento adicional.
- [x] 18. Abrir com URL inválida/versão desconhecida mostra aviso, formulário utilizável e aproveita campos válidos (RF37, US18).
- [x] 19. Reancoragem: alterar a data de referência recalcula o preview e a URL (US20).
- [x] 20. Receber link: ajustar a configuração não altera o link original (RF47).
- [x] 21. Nome aparece no topo do preview e no `document.title`; sem nome, título padrão (RF42).
- [x] 22. Navegação de meses sem limite, voltar ao mês atual (US8).
- [x] 23. Métricas: com consentimento, completar a escala dispara um único `schedule_completed`; mudar marcações não repete; mudar modalidade repete (RF57); aceitar o consentimento depois de completar envia o evento pendente; recusar nada envia.
- [x] 24. Nenhum payload de analytics contém nome, datas ou query (RF58).
- [x] 25. Com o GA4 bloqueado (script falha), a tela funciona sem erro no console (RF61).
- [x] 26. Texto a 200% muda o preview para lista e não há rolagem horizontal.
- [x] 27. Tema escuro e claro renderizam (`prefers-color-scheme` emulado) sem perder estados.

### Testes E2E (se aplicável)

- [x] Cobertos na tarefa 10.0.

## Arquivos relevantes

- `src/views/HomeView/HomeView.tsx` (+ `HomeView.spec.tsx`)
- `src/App.tsx`, `src/App.spec.tsx` (ajustado ou removido), `src/main.tsx`
- `src/components/HelloWorld/` (removido)
- `src/index.css`
