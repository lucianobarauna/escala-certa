# TODO

Melhorias futuras anotadas para depois. Agentes: não implemente nenhum item sem pedido explícito.

## Pendentes

- [ ] **Checagem automática da sincronia entre `code-standards.md` e `.oxlintrc.json`**: hoje a sincronia depende de o agente perceber a mudança. Uma opção é um hook em `.husky/pre-commit` que falhe quando só um dos dois arquivos estiver no commit. É uma checagem grosseira (não valida o conteúdo), mas pega esquecimentos.
- [ ] **Antes do lançamento — base legal das métricas (LGPD)**: reescrever a restrição de LGPD do PRD (`tasks/prd-escala-certa/prd.md`) adotando o legítimo interesse (art. 7º, IX) com minimização, transparência e direito de recusa; fazer a avaliação formal de legítimo interesse e confirmar o enquadramento com um especialista em LGPD.
- [ ] **Antes do lançamento — banner de cookies**: confirmar se o banner de consentimento fica fora do escopo (o app não usa cookies) e, se sim, registrar isso no "Fora do escopo" do PRD.
- [ ] **Aplicar o `pnpm format` no projeto inteiro**: o código atual não segue o `.oxfmtrc.json` (aspas e ordem dos imports). Fazer em um commit separado, só de formatação, para não misturar com mudanças de comportamento.
