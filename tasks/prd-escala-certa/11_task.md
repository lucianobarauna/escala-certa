# Tarefa 11.0: Lançamento (GA4, LGPD e merge na main)

## Visão geral

Etapa operacional final: criar e configurar o GA4, ligar o ID de medição no build, verificar com uma requisição real que nada do conteúdo do link sai do navegador, concluir a revisão de privacidade/LGPD e fazer o merge `dev` → `main`, que é o lançamento. Não adiciona código de `src/`; a "prova" é uma checklist verificável mais a reexecução dos testes.

<skills>
### Conformidade com skills

- `finalize-implementation`: commit conventional, checklist de qualidade e pull request `dev` → `main`.
- `executar-qa`: validação final contra PRD, TechSpec e tasks.
- `agent-browser` / Playwright MCP: inspeção da requisição `collect` real, se necessário.
- Regras do projeto: `code-standards.md` (`VITE_GA_MEASUREMENT_ID` público por natureza, nunca segredos no código) e `AGENTS.md` ("Documentos de produto").
</skills>

<requirements>
- RF63: GA4 com publicidade e sinais de usuários desativados e menor retenção de dados disponível, verificados antes do lançamento.
- RF58, RF59: nenhuma parte do link no envio; sem cookies antes do consentimento.
- Console do GA4: Enhanced Measurement desligado (em especial "Page changes based on browser history events"); dimensões personalizadas de evento `has_schedule`, `schedule_type`, `variant`, `weeks`, `method`, `level`.
- `VITE_GA_MEASUREMENT_ID` definido como variável do repositório (não segredo) no GitHub Actions e passado ao build em `.github/workflows/deploy.yml`; `.env.example` sem valor.
- LGPD: enquadramento do consentimento (art. 7º, I) e transferência internacional (art. 33) confirmados com especialista (item do `TODO.md`); texto de privacidade conferido com o que foi configurado.
- Regulatório: revisar a permanência da modalidade 6x1 à luz da EC 141/2026 (texto oficial) e registrar a decisão.
- Merge `dev` → `main` publica no GitHub Pages (`base` `/escala-certa/`).
</requirements>

## Subtarefas

- [ ] 11.1 Criar a propriedade e o fluxo de dados web do GA4 e obter o ID de medição.
- [ ] 11.2 Configurar o console: retenção mínima, Google Signals e personalização desligados, Enhanced Measurement desligado, dimensões personalizadas.
- [ ] 11.3 Definir `VITE_GA_MEASUREMENT_ID` como variável do repositório e passá-la ao build em `deploy.yml`; documentar em `.env.example` e `.env.local`.
- [ ] 11.4 Inspecionar uma requisição real `collect` (após aceitar métricas em um build de pré-visualização): `dl` sem query e `dt` fixo, sem nome nem datas.
- [ ] 11.5 Conferir o texto de privacidade com a configuração real do GA4 (retenção, cookies, Google).
- [ ] 11.6 Concluir a revisão jurídica de LGPD (item do `TODO.md`) e registrar o resultado.
- [ ] 11.7 Revisar a modalidade 6x1 conforme a EC 141/2026 e registrar a decisão.
- [ ] 11.8 Rodar `pnpm lint`, `pnpm build`, `pnpm test:coverage` e `pnpm test:e2e` no estado final; abrir o PR `dev` → `main`.
- [ ] 11.9 Após o merge, validar a página publicada (carregamento < 3 s, escala, banner de consentimento, privacidade).

## Detalhes de implementação

Ver `techspec.md`: "Parâmetros fixados no GA4", "Pontos de integração" (revisão no lançamento), "Monitoramento e observabilidade" e "Riscos conhecidos" (vazamento via `page_location`/`page_title`, divergência entre console e texto de privacidade, LGPD). Etapa 11 da "Ordem de construção".

## Critérios de sucesso

- Todos os itens da checklist abaixo marcados e com evidência anexada ao PR.
- `consent-analytics.spec.ts` (E2E 7 da tarefa 10.0) passa contra o build final.
- Nenhuma pendência jurídica aberta no `TODO.md` relacionada ao lançamento.

## Testes da tarefa

### Testes unitários

- [ ] Não se aplica (sem código novo; o contrato de payload do caso 97 da tarefa 4.0 continua passando).

### Testes de integração

- [ ] Não se aplica (integração 23–25 da tarefa 9.0 continuam passando).

### Testes E2E

- [ ] Reexecutar `pnpm test:e2e` completo, incluindo `consent-analytics.spec.ts`, `privacy.spec.ts` e `accessibility.spec.ts`, no commit que será mergeado.

### Checklist de verificação manual

- [ ] Requisição `collect` real inspecionada: `dl` sem query, `dt` fixo, sem nome/datas/folgas.
- [ ] Antes do aceite: nenhuma requisição ao Google e nenhum cookie `_ga*`.
- [ ] Após recusar ou com GPC: nenhuma requisição ao Google.
- [ ] Revogar pelo texto de privacidade interrompe o envio e apaga os cookies.
- [ ] Console do GA4: retenção mínima, Signals e personalização desligados, Enhanced Measurement desligado, dimensões criadas.
- [ ] Texto de privacidade coerente com a configuração real.
- [ ] Revisão de LGPD concluída e registrada.
- [ ] Decisão sobre a modalidade 6x1 (EC 141/2026) registrada.
- [ ] Página publicada em `/escala-certa/` abre a escala por link e carrega em < 3 s em 4G intermediário.

## Arquivos relevantes

- `.github/workflows/deploy.yml`
- `.env.example`
- `TODO.md`
- `tasks/prd-escala-certa/prd.md`, `techspec.md` (ajustes se a revisão exigir)
- `docs/product/brainstorm.md` (perguntar ao usuário se a decisão sobre o 6x1 afeta o brainstorm, conforme `AGENTS.md`)
