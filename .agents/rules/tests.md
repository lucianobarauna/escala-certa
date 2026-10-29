# Padrões de Testes

Como escrever e organizar testes neste repositório. As convenções gerais de código estão em `.agents/rules/code-standards.md` e também valem para os arquivos de teste (com as exceções listadas lá).

## Regra crítica: todo código deve ser coberto por testes

> ⚠️ **Esta regra é crítica e não deve ser ignorada.** Nenhum código novo ou alterado — frontend ou backend — é considerado pronto sem testes automatizados que cubram seu comportamento.

- Ao criar ou alterar uma função, hook, componente, endpoint ou serviço, crie ou atualize os testes na mesma entrega.
- Ao corrigir um bug, escreva primeiro um teste que reproduz o bug e falha; depois corrija.
- Tanto o frontend quanto o backend devem ter testes abrangentes.

## Cobertura mínima de 80%

- A cobertura de código deve ser de **no mínimo 80%** (linhas, funções, branches e statements).
- Cobertura é o piso, não o objetivo: um teste sem `expect` aumenta a cobertura e não protege nada (veja [Self-validating](#self-validating--o-teste-valida-sozinho)).

- O limite está configurado em `coverage.thresholds` no `vitest.config.ts`. Rode `pnpm test:coverage`: ele executa todos os testes e falha se algum teste quebrar ou se a cobertura ficar abaixo de 80%.
- Ficam fora da cobertura apenas `src/main.tsx` e os primitivos gerados pelo shadcn em `src/components/ui/`. Não adicione exclusões para escapar do limite — escreva os testes.
- O React Compiler fica desligado durante o Vitest (`process.env.VITEST` no `vite.config.ts`), porque as checagens de cache que ele gera contariam como branches falsos. Os testes E2E rodam sobre o build de produção, com o compiler.

## Onde os testes são executados

Nenhum código com teste quebrado deve chegar ao repositório remoto:

- **pre-push** (Husky): `pnpm lint`, `pnpm test:coverage` e `pnpm test:e2e`. Se qualquer um falhar, o push é bloqueado.
- **CI** (`.github/workflows/deploy.yml`): os mesmos comandos rodam antes do build; se falharem, o deploy não acontece.
- Não use `git push --no-verify` para pular o hook.

## Priorize o que é mais crítico

Concentre esforço (mais casos, mais bordas, mais níveis da pirâmide) no que causa mais prejuízo se quebrar. Um checkout é mais crítico que um cadastro de categoria de produto; neste projeto, por exemplo, o cálculo de horas e conflitos de uma escala é mais crítico que a troca de tema.

| Criticidade | Exemplos                                            | O que testar                                         |
| ----------- | --------------------------------------------------- | ---------------------------------------------------- |
| Alta        | regras de negócio, cálculos, permissões, pagamentos | caminho feliz, bordas, erros, integração e fluxo E2E |
| Média       | formulários, listagens com filtro                   | caminho feliz, validações principais, integração     |
| Baixa       | componentes puramente visuais, textos estáticos     | renderização básica                                  |

## Ordem de criação dos testes

Crie os testes de baixo para cima na pirâmide. Isso dá feedback mais rápido e isola falhas: quando um teste de integração quebra, as unidades já estão validadas e o problema está na ligação entre elas.

1. Funções puras e utilitários (`*.utils.ts`) — sem dependências, mais rápidos de escrever e rodar.
2. Hooks e serviços, com dependências substituídas por stubs/mocks.
3. Componentes e endpoints isolados.
4. Integração entre módulos (componente + hook + serviço; rota + serviço + banco de teste).
5. E2E dos fluxos críticos.

## Pirâmide de testes

```
        /\        E2E (poucos)          — fluxos críticos de ponta a ponta
       /  \
      /----\      Integração (alguns)   — módulos reais conversando entre si
     /      \
    /--------\    Unidade (muitos)      — funções, hooks e componentes isolados
```

- **Unidade**: a base larga. Rápidos, isolados, um comportamento por teste.
- **Integração**: validam que as partes funcionam juntas, substituindo apenas o que é externo (API de terceiros, relógio).
- **E2E**: poucos e focados nos fluxos críticos; são os mais lentos e caros de manter.

## Ferramentas e localização

| Tipo                 | Ferramenta                                                  | Onde fica                                               |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| Unidade e integração | Vitest (no frontend, browser mode + `vitest-browser-react`) | ao lado do código: `<Nome>.spec.tsx` / `<nome>.spec.ts` |
| E2E                  | Playwright (`playwright.config.ts`)                         | pasta `e2e/` na raiz, fora do frontend e do backend     |

```
escala-certa/
├── e2e/
│   ├── schedule-publish.spec.ts
│   └── login.spec.ts
├── src/                 (frontend)
└── server/              (backend, quando existir)
```

## Princípios FIRST

### Fast — testes rápidos

Prefira testes que rodam rápido. Substitua dependências lentas (rede, banco, serviços externos) por **stubs** que devolvem respostas fixas.

```ts
// ❌ Evite: chamada real à API deixa o teste lento e frágil
test('lists employees', async () => {
  const employees = await fetchEmployees();
  expect(employees.length).toBeGreaterThan(0);
});

// ✅ Prefira: stub com resposta fixa
test('lists employees returned by the API', async () => {
  const employeesStub = [{ id: '1', name: 'Ana' }];
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(employeesStub)));
  const employees = await fetchEmployees();
  expect(employees).toEqual(employeesStub);
});
```

### Independent — testes independentes

Um teste não pode depender de outro (nem da ordem de execução, nem de estado deixado por outro). Se um teste que serve de base quebrar, todos os que dependem dele quebram junto e escondem a causa real.

```ts
// ❌ Evite: o segundo teste depende do estado criado pelo primeiro
const schedule = createSchedule();

test('adds a shift', () => {
  addShift(schedule, shiftStub);
  expect(schedule.shifts).toHaveLength(1);
});

test('removes a shift', () => {
  removeShift(schedule, shiftStub.id);
  expect(schedule.shifts).toHaveLength(0);
});

// ✅ Prefira: cada teste monta o próprio cenário
test('removes a shift', () => {
  const schedule = createSchedule({ shifts: [shiftStub] });
  removeShift(schedule, shiftStub.id);
  expect(schedule.shifts).toHaveLength(0);
});
```

- Restaure mocks e globais após cada teste (`afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.useRealTimers(); })`).

### Repeatable — mesmo resultado sempre

Rodar o teste várias vezes, em qualquer máquina ou horário, deve dar o mesmo resultado. Use **mocks** para tudo que varia: data/hora, valores aleatórios, APIs externas que respondem diferente a cada chamada.

```ts
// ❌ Evite: depende do dia em que o teste roda
test('marks schedule as overdue', () => {
  const schedule = createSchedule({ deadline: '2026-10-15' });
  expect(isOverdue(schedule)).toBe(true);
});

// ✅ Prefira: relógio fixo
test('marks schedule as overdue when the deadline has passed', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-20T09:00:00'));
  const schedule = createSchedule({ deadline: '2026-10-15' });
  expect(isOverdue(schedule)).toBe(true);
});
```

### Self-validating — o teste valida sozinho

O próprio teste deve falhar quando o comportamento estiver errado, sem ninguém precisar olhar logs. Não basta executar o código para ganhar cobertura: valide retornos, efeitos e estados com `expect`.

```ts
// ❌ Evite: cobre o código, mas nunca falha
test('calculates weekly hours', () => {
  const total = sumWeeklyHours(shiftsStub);
  console.log(total);
});

// ✅ Prefira: assertion sobre o valor esperado
test('sums the hours of all shifts in the week', () => {
  const total = sumWeeklyHours(shiftsStub);
  expect(total).toBe(40);
});
```

## Estrutura: Given/When/Then ou AAA

Todo teste segue três etapas, nesta ordem: **Arrange/Given** (montar o cenário), **Act/When** (executar a ação) e **Assert/Then** (verificar o resultado). Como `code-standards.md` proíbe comentários e linhas em branco dentro de funções, a estrutura aparece pela ordem das linhas e pelos nomes de `describe`/`test`.

```tsx
describe('given a schedule with more than the weekly hour limit', () => {
  test('when it is rendered, then it shows the overtime warning', async () => {
    const schedule = createSchedule({ shifts: overtimeShiftsStub });
    const { getByRole } = await render(<ScheduleSummary schedule={schedule} />);
    await expect.element(getByRole('alert')).toHaveTextContent('Limite semanal de horas excedido');
  });
});
```

## Um conceito por teste

Cada teste verifica um único comportamento/requisito. Misturar comportamentos deixa o nome vago e, quando falha, não diz o que quebrou.

```ts
// ❌ Evite: três requisitos num teste só
test('shift form works', async () => {
  // valida campo obrigatório, salva o turno e limpa o formulário
});

// ✅ Prefira: um requisito por teste
test('shows an error when the start time is empty', async () => {});
test('saves the shift with the filled data', async () => {});
test('clears the form after saving', async () => {});
```

- Vários `expect` no mesmo teste são aceitáveis quando validam o **mesmo** comportamento (ex.: o retorno e o estado resultante de uma única ação).
- O nome do teste descreve o requisito, não a implementação.

## Testes de frontend

- Renderize com o `render` do `vitest-browser-react` e use `expect.element(...)` para assertions sobre o DOM.
- Faça queries por papel acessível ou texto (`getByRole`, `getByText`, `getByLabelText`) em vez de test IDs ou seletores CSS.
- Teste o que o usuário vê e faz, não detalhes internos (estado, nomes de funções).

## Testes E2E

- Ficam em `e2e/`, na raiz, fora do frontend e do backend, e rodam com Playwright.
- Cubra apenas os fluxos críticos, do ponto de vista do usuário.
- Cada teste prepara os próprios dados e não depende de outro teste.

```ts
// e2e/schedule-publish.spec.ts
import { expect, test } from '@playwright/test';

test('manager publishes a complete schedule', async ({ page }) => {
  await page.goto('/escala-certa/schedules/new');
  await page.getByLabel('Nome da escala').fill('Plantão de novembro');
  await page.getByRole('button', { name: 'Publicar' }).click();
  await expect(page.getByRole('status')).toHaveText('Escala Plantão de novembro publicada');
});
```
