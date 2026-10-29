# AGENTS.md

Este arquivo orienta agentes de IA para código (Claude Code, Codex, Cursor etc.) ao trabalhar com o código deste repositório.

## Status do projeto

Scaffold em estágio inicial (React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui). O `src/App.tsx` é um placeholder mínimo que conecta o `HelloWorld` e um `Button` do shadcn, ainda descartável. A estrutura de pastas a seguir está definida em `.agents/rules/folder-structure.md`, mesmo que algumas pastas ainda não existam.

## Regras

Este arquivo cobre arquitetura e ferramentas. As convenções de código (como escrever código aqui) ficam em `.agents/rules/code-standards.md`, importado abaixo — agentes que não resolvem imports com `@` devem ler esse arquivo diretamente.

@.agents/rules/code-standards.md

O `.agents/rules/code-standards.md` e o `.oxlintrc.json` devem ficar sincronizados nos dois sentidos:

- Quando o `code-standards.md` mudar, verifique se a regra nova ou alterada pode ser aplicada automaticamente pelo Oxlint e, se fizer sentido, atualize o `.oxlintrc.json`. Regras que o Oxlint não cobre ficam apenas no documento.
- Quando o `.oxlintrc.json` mudar (regra adicionada, removida, com limite alterado ou com nova exceção em `overrides`/`ignorePatterns`) e isso não estiver refletido no `code-standards.md`, atualize o documento para descrever a regra em português, com exemplo, e ajuste a lista de regras automáticas na seção "Formatação e Lint".

As regras de testes (cobertura obrigatória, princípios FIRST, pirâmide de testes, estrutura AAA e testes E2E) ficam em `.agents/rules/tests.md`, importado abaixo — agentes que não resolvem imports com `@` devem ler esse arquivo diretamente. **Todo código deve ser coberto por testes automatizados; essa regra é crítica e não deve ser ignorada.**

@.agents/rules/tests.md

As regras de React (componentes pequenos e funcionais, uso de `useEffect`/`useMemo`, hooks customizados, acessibilidade e estilização com Tailwind) ficam em `.agents/rules/react.md`, importado abaixo — agentes que não resolvem imports com `@` devem ler esse arquivo diretamente.

@.agents/rules/react.md

A estrutura de pastas (onde ficam componentes, telas, serviços, hooks, tipos, assets e testes) fica em `.agents/rules/folder-structure.md`, importado abaixo — agentes que não resolvem imports com `@` devem ler esse arquivo diretamente. Crie arquivos e pastas novos seguindo esse documento.

@.agents/rules/folder-structure.md

## Comandos

- `pnpm dev` — inicia o servidor de desenvolvimento do Vite
- `pnpm build` — faz a checagem de tipos (`tsc -b`) e depois o build de produção
- `pnpm lint` — roda o Oxlint
- `pnpm format` / `pnpm format:check` — formata (ou verifica a formatação) com oxfmt, configurado em `.oxfmtrc.json` (também ordena imports e classes do Tailwind)
- `pnpm test` — roda a suíte de testes (Vitest, em modo watch por padrão)
- `pnpm test:coverage` — roda os testes uma vez com cobertura e falha se algum teste quebrar ou se a cobertura ficar abaixo de 80%
- `pnpm test:e2e` — faz o build, sobe o `vite preview` e roda os testes E2E de `e2e/` com Playwright
- O hook `pre-push` do Husky roda `pnpm lint`, `pnpm test:coverage` e `pnpm test:e2e`; a CI roda os mesmos comandos antes do deploy
- `pnpm preview` — pré-visualiza o build de produção

O gerenciador de pacotes é o **pnpm** (veja `pnpm-lock.yaml`). A versão do Node está fixada em `.nvmrc` (também usada pelo workflow de deploy na CI).

### Rodando um único teste

Os testes rodam em um navegador real via Playwright (chromium), não em jsdom. Para rodar um arquivo:

```
pnpm vitest run src/components/HelloWorld/HelloWorld.spec.tsx
```

Para rodar um único teste E2E:

```
pnpm playwright test e2e/home.spec.ts
```

## Arquitetura

- **Ferramenta de build**: Vite, com o React Compiler habilitado via Babel (`@rolldown/plugin-babel` + `babel-plugin-react-compiler` em `vite.config.ts`). Ele cuida da memoização automaticamente.
- **Estilização**: Tailwind CSS v4 via `@tailwindcss/vite` (sem `tailwind.config.js` — a v4 usa configuração baseada em CSS em `src/index.css`). Os componentes se apoiam em classes utilitárias do Tailwind, incluindo utilitários com valores arbitrários (ex.: `bg-(--accent-bg)`) que referenciam CSS custom properties definidas em `index.css`.
- **Componentes de UI**: o shadcn/ui está instalado (`components.json`), configurado com o estilo `aria-nova` (construído sobre `react-aria-components`, não Radix), cor base `mist` e `lucide-react` para ícones. O helper de merge de classes `cn()` usa `clsx` + `tailwind-merge`. Os tokens de tema (cores, radius, variáveis de sidebar/chart) são definidos como CSS custom properties em `src/index.css` sob `:root` / `.dark` e expostos ao Tailwind via `@theme inline`. As fontes são self-hosted via `@fontsource-variable/geist` e `@fontsource-variable/inter` (Inter é a `--font-sans` ativa).
- **Path aliases**: `@/*` aponta para `src/*` (alias de resolve em `vite.config.ts`, espelhado nos `paths` de `tsconfig.json`/`tsconfig.app.json` e usado pelos `aliases` do shadcn em `components.json`).
- **Testes**: o Vitest está configurado em **browser mode** (`vitest.config.ts`), rodando as specs em uma instância real do Chromium via `@vitest/browser-playwright`, com o `vitest-browser-react` fornecendo `render` e queries baseadas em locators — não jsdom + Testing Library.
- **Lint/formatação**: Oxlint (`.oxlintrc.json`) para lint, não ESLint. O lint com informação de tipos não está habilitado no momento (exigiria `oxlint-tsgolint`). O oxfmt (`.oxfmtrc.json`) cuida da formatação, ordenação de imports e ordenação de classes do Tailwind — não Prettier.
- **TypeScript**: setup com project references (`tsconfig.json` → `tsconfig.app.json` para `src/`, `tsconfig.node.json` para a config do Vite). Checagens estritas de locals/params não usados e `verbatimModuleSyntax` estão ativadas.
- **Deploy**: `.github/workflows/deploy.yml` faz o build e publica `dist/` no GitHub Pages a cada push na `main` (ou disparo manual). O `base` do Vite em `vite.config.ts` está definido como `/escala-certa/` para bater com o subcaminho do Pages — mantenha os dois sincronizados se o repositório for renomeado.

## Melhorias futuras

As melhorias anotadas para depois ficam em `TODO.md`. Não implemente nenhum item de lá sem pedido explícito. Quando o usuário pedir para anotar algo como melhoria futura, adicione em `TODO.md`.
