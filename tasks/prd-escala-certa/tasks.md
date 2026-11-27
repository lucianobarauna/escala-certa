# Resumo das tarefas de implementação de Escala Certa

Ordem de construção de baixo para cima na pirâmide de testes (domínio → serviços → hooks → componentes → tela → E2E → lançamento). Referências: `prd.md` e `techspec.md` desta pasta.

## Tarefas

- [x] 1.0 Fundação e domínio de ciclos
- [x] 2.0 Mês, nome acessível e resumo
- [x] 3.0 Codec da URL versionada
- [x] 4.0 Infra e serviços (storage, compartilhamento, analytics, consentimento)
- [x] 5.0 Hooks de estado
- [x] 6.0 Formulários de entrada
- [x] 7.0 Preview do mês
- [x] 8.0 Compartilhar, tamanho de texto, aviso, privacidade e consentimento
- [x] 9.0 HomeView e App
- [ ] 10.0 E2E, acessibilidade e desempenho
- [ ] 11.0 Lançamento (GA4, LGPD e merge na main)

## Dependências

| Tarefa | Depende de         |
| ------ | ------------------ |
| 1.0    | —                  |
| 2.0    | 1.0                |
| 3.0    | 1.0                |
| 4.0    | —                  |
| 5.0    | 1.0, 2.0, 3.0, 4.0 |
| 6.0    | 1.0, 5.0           |
| 7.0    | 2.0, 5.0           |
| 8.0    | 4.0, 5.0           |
| 9.0    | 3.0, 6.0, 7.0, 8.0 |
| 10.0   | 9.0                |
| 11.0   | 10.0               |

## Observações

- A skill `react-patterns` deve ser carregada antes de qualquer implementação em `src/` (tarefas 5.0 a 9.0, e a 4.0 no que tocar `src/`).
- Ao fim de cada tarefa que altere código: `pnpm lint`, `pnpm build` e `pnpm test:coverage` (cobertura ≥ 80%).
- Este plano tem 11 tarefas (acima do limite padrão de 10) por decisão do produto: o lançamento ficou separado das E2E.
- A numeração dos testes (ex.: "unitário 12", "integração 6") é a da seção "Abordagem de testes" da `techspec.md`.
