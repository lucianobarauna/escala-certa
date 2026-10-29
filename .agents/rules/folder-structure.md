# Estrutura de Pastas

Onde cada tipo de arquivo fica neste repositório. Como escrever o código dentro dessas pastas está em `.agents/rules/code-standards.md`, `.agents/rules/react.md` e `.agents/rules/tests.md`.

## Visão geral

```
escala-certa/
├── .agents/rules/          regras para agentes de IA (padrões de código, React, testes, pastas)
├── .github/workflows/      CI e deploy no GitHub Pages
├── .husky/                 hooks do Git (pre-push)
├── e2e/                    testes E2E com Playwright
├── public/                 arquivos estáticos servidos sem processamento (favicon, robots.txt)
└── src/                    código do frontend
    ├── assets/             imagens, ícones e SVGs importados pelo código
    ├── components/         componentes reutilizáveis
    │   └── ui/             primitivos gerados pelo shadcn/ui
    ├── hooks/              hooks compartilhados entre componentes ou telas
    ├── lib/                utilitários genéricos e de infraestrutura (ex.: `cn()`)
    ├── services/           acesso ao backend
    ├── types/              tipos compartilhados do domínio
    ├── views/              telas da aplicação
    ├── App.tsx             componente raiz
    ├── index.css           Tailwind e tokens do tema
    └── main.tsx            ponto de entrada
```

Sempre importe com o alias `@/` (ex.: `@/components/ShiftBadge/ShiftBadge`), nunca com `../`.

## Pastas do frontend

| Pasta            | O que vai nela                                                             | Padrão de nome                               |
| ---------------- | -------------------------------------------------------------------------- | -------------------------------------------- |
| `components/`    | Componentes reutilizáveis, sem conhecer a tela em que são usados           | `components/<Nome>/<Nome>.tsx`               |
| `components/ui/` | Primitivos do shadcn/ui, gerados pela CLI — prefira compor a editar        | `components/ui/<nome>.tsx` (arquivos soltos) |
| `views/`         | Telas: montam componentes e hooks para formar uma página                   | `views/<Nome>View/<Nome>View.tsx`            |
| `services/`      | Funções de acesso à API (`fetch`, URLs, tratamento de resposta), sem React | `services/<recurso>.service.ts`              |
| `hooks/`         | Hooks usados por mais de um componente ou tela                             | `hooks/use<Nome>.ts`                         |
| `types/`         | Tipos do domínio usados em mais de uma pasta (ex.: `Shift`, `Employee`)    | `types/<dominio>.ts`                         |
| `assets/`        | Arquivos importados pelo código e processados pelo Vite                    | `assets/<nome>.<ext>`                        |
| `lib/`           | Utilitários genéricos, sem regra de negócio                                | `lib/<nome>.ts`                              |

## Onde colocar cada coisa

- **Usado só por um componente ou tela?** Fica na pasta dele. Hooks, tipos, constantes e funções puras locais ficam ao lado do componente (`useShiftFilters.ts`, `shift-table.types.ts`, `shift-table.utils.ts`).
- **Usado em mais de um lugar?** Sobe para a pasta compartilhada: `hooks/`, `types/` ou `lib/`.
- **Fala com o backend?** Vai para `services/`.
- **É uma página inteira?** Vai para `views/`. Se um pedaço da tela puder ser reaproveitado, extraia para `components/`.

```
src/
├── components/
│   └── ShiftTable/
│       ├── ShiftTable.tsx
│       ├── ShiftTable.spec.tsx
│       ├── ShiftRow.tsx
│       ├── useShiftFilters.ts
│       ├── useShiftFilters.spec.ts
│       └── shift-table.utils.ts
├── hooks/
│   ├── useEmployees.ts
│   └── useEmployees.spec.ts
├── services/
│   ├── employees.service.ts
│   └── employees.service.spec.ts
├── types/
│   └── employee.ts
└── views/
    └── ScheduleView/
        ├── ScheduleView.tsx
        └── ScheduleView.spec.tsx
```

## Testes

| Tipo                 | Onde fica                                  | Exemplo                              |
| -------------------- | ------------------------------------------ | ------------------------------------ |
| Unidade e integração | Ao lado do arquivo testado, com `.spec`    | `services/employees.service.spec.ts` |
| E2E                  | Pasta `e2e/` na raiz, um arquivo por fluxo | `e2e/schedule-publish.spec.ts`       |

Não crie pastas `__tests__/` nem uma pasta `tests/` separada para testes de unidade. Pastas geradas pelos testes (`coverage/`, `test-results/`, `playwright-report/`) e pelo build (`dist/`) não são versionadas.
