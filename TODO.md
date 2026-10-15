# TODO

Melhorias futuras anotadas para depois. Agentes: não implemente nenhum item sem pedido explícito.

## Pendentes

- [ ] **Checagem automática da sincronia entre `code-standards.md` e `.oxlintrc.json`**: hoje a sincronia depende de o agente perceber a mudança. Uma opção é um hook em `.husky/pre-commit` que falhe quando só um dos dois arquivos estiver no commit. É uma checagem grosseira (não valida o conteúdo), mas pega esquecimentos.
- [ ] **Aplicar o `pnpm format` no projeto inteiro**: o código atual não segue o `.oxfmtrc.json` (aspas e ordem dos imports). Fazer em um commit separado, só de formatação, para não misturar com mudanças de comportamento.
