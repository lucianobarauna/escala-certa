# TODO

Melhorias futuras anotadas para depois. Agentes: não implemente nenhum item sem pedido explícito.

## Pendentes

- [ ] **Checagem automática da sincronia entre `code-standards.md` e `.oxlintrc.json`**: hoje a sincronia depende de o agente perceber a mudança. Uma opção é um hook em `.husky/pre-commit` que falhe quando só um dos dois arquivos estiver no commit. É uma checagem grosseira (não valida o conteúdo), mas pega esquecimentos.
- [ ] **Antes do lançamento — LGPD das métricas (GA4)**: confirmar com um especialista em LGPD o fluxo de consentimento (art. 7º, I) e a transferência internacional de dados para o Google (art. 33), e revisar o texto de privacidade do PRD (`tasks/prd-escala-certa/prd.md`).
- [ ] **Aplicar o `pnpm format` no projeto inteiro**: o código atual não segue o `.oxfmtrc.json` (aspas e ordem dos imports). Fazer em um commit separado, só de formatação, para não misturar com mudanças de comportamento.
