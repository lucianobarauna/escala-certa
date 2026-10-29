# Padrões de JavaScript e TypeScript

Como escrever JavaScript e TypeScript neste repositório. As regras gerais de código limpo (tamanho de funções, comentários, constantes) estão em `.agents/rules/code-standards.md` e as de React em `.agents/rules/react.md`.

## Variáveis: `const` por padrão, nunca `var`

Use `const` sempre. Use `let` apenas quando a variável realmente precisa ser reatribuída. Nunca use `var` — ele ignora o escopo de bloco e sofre _hoisting_.

```ts
// ❌ Evite
var total = 0;
let employeeName = 'Ana';

// ✅ Prefira
const employeeName = 'Ana';
let attempts = 0;
attempts += 1;
```

Na maioria dos casos em que parece necessário um `let`, um `map`/`reduce` ou uma função auxiliar resolve com `const`.

## Comparações estritas: `===` e `!==`

Nunca use `==` ou `!=`: eles convertem tipos implicitamente e geram resultados inesperados (`0 == ''` é `true`).

```ts
// ❌ Evite
if (shift.employeeId == selectedId) {
}

// ✅ Prefira
if (shift.employeeId === selectedId) {
}
```

## Nunca use `any`

`any` desliga a checagem de tipos e espalha o problema para todo código que toca o valor. Quando o tipo é realmente desconhecido (resposta de API, `catch`, `JSON.parse`), use `unknown` e faça o _narrowing_ antes de usar.

```ts
// ❌ Evite
function parseShift(data: any) {
  return data.start;
}

// ✅ Prefira
function isShift(data: unknown): data is Shift {
  return typeof data === 'object' && data !== null && 'start' in data;
}

function parseShift(data: unknown): Shift {
  if (!isShift(data)) throw new Error('Formato de turno inválido');
  return data;
}
```

O `strict` do TypeScript está ativado, então parâmetros sem tipo (que viram `any` implícito) também quebram o build.

## Prefira `type` a `interface`

Declare formatos com `type`. Ele cobre objetos, uniões e interseções com uma sintaxe só, e evita a fusão implícita de declarações (_declaration merging_) das `interface`.

```ts
// ❌ Evite
interface Employee {
  id: string;
  name: string;
}

// ✅ Prefira
type Employee = {
  id: string;
  name: string;
};

type ShiftStatus = 'draft' | 'published' | 'cancelled';
```

## Tipe parâmetros e retornos que envolvem objetos

Parâmetros sempre têm tipo. Quando a função recebe ou devolve um objeto (ou array de objetos), declare o tipo do retorno explicitamente — assim um erro na implementação aparece na própria função, e não em quem a chama. Para retornos primitivos simples, a inferência é suficiente.

```ts
// ❌ Evite: retorno inferido de um objeto montado à mão
function toShiftSummary(shift: Shift) {
  return { label: `${shift.start}–${shift.end}`, hours: getShiftHours(shift) };
}

// ✅ Prefira
type ShiftSummary = {
  label: string;
  hours: number;
};

function toShiftSummary(shift: Shift): ShiftSummary {
  return { label: `${shift.start}–${shift.end}`, hours: getShiftHours(shift) };
}

function getShiftHours(shift: Shift) {
  return shift.durationInMinutes / MINUTES_PER_HOUR;
}
```

## `function` nas funções principais, arrow function nos callbacks

As funções principais do arquivo (exportadas, componentes, hooks, utilitários de topo) são declaradas com `function`. Arrow functions ficam para callbacks: `map`, `filter`, `reduce`, `sort`, handlers inline, `then` etc.

```ts
// ❌ Evite
export const sumWeeklyHours = (shifts: Shift[]) =>
  shifts.reduce(function (total, shift) {
    return total + getShiftHours(shift);
  }, 0);

// ✅ Prefira
export function sumWeeklyHours(shifts: Shift[]) {
  return shifts.reduce((total, shift) => total + getShiftHours(shift), 0);
}
```

## Ternários sem aninhamento

Use ternário apenas para uma escolha simples entre dois valores. Nunca aninhe ternários; para três ou mais casos, use cláusulas guarda em uma função ou um objeto de mapeamento.

```ts
// ❌ Evite
const statusLabel =
  status === 'draft' ? 'Rascunho' : status === 'published' ? 'Publicada' : 'Cancelada';

// ✅ Prefira: ternário simples
const shiftLabel = isOvertime ? 'Hora extra' : 'Turno regular';

// ✅ Prefira: mapeamento para vários casos
const STATUS_LABELS: Record<ShiftStatus, string> = {
  draft: 'Rascunho',
  published: 'Publicada',
  cancelled: 'Cancelada',
};

const statusLabel = STATUS_LABELS[status];
```

Também não use ternário para devolver `true`/`false` (`isActive ? true : false` → `isActive`).

## Outras boas práticas

### `??` e `?.` para valores ausentes

Use `??` para valor padrão (o `||` troca também `0` e `''`) e `?.` para acessar propriedades que podem não existir.

```ts
// ❌ Evite
const breakMinutes = shift.breakMinutes || DEFAULT_BREAK_MINUTES;
const managerName = schedule.manager && schedule.manager.name;

// ✅ Prefira
const breakMinutes = shift.breakMinutes ?? DEFAULT_BREAK_MINUTES;
const managerName = schedule.manager?.name;
```

### Sem `!` (non-null assertion) e o mínimo de `as`

`valor!` e `valor as Tipo` mandam o TypeScript confiar sem verificar. Trate o caso nulo explicitamente.

```ts
// ❌ Evite
const root = document.getElementById('root')!;

// ✅ Prefira
const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado');
```

### Uniões de literais em vez de `enum`

O `erasableSyntaxOnly` do TypeScript proíbe `enum`. Use uniões de literais ou objetos `as const`.

```ts
// ❌ Evite
enum Role {
  Nurse,
  Doctor,
}

// ✅ Prefira
const ROLES = ['nurse', 'doctor'] as const;
type Role = (typeof ROLES)[number];
```

### Template literals em vez de concatenação

```ts
// ❌ Evite
const message = 'Escala ' + schedule.name + ' publicada';

// ✅ Prefira
const message = `Escala ${schedule.name} publicada`;
```

### Não altere parâmetros nem arrays recebidos

Crie novos valores em vez de mutar os recebidos. Prefira `toSorted`, `toReversed`, `with` e spread a `sort`, `reverse` e atribuição direta.

```ts
// ❌ Evite
function sortByStart(shifts: Shift[]): Shift[] {
  return shifts.sort((a, b) => a.start.localeCompare(b.start));
}

// ✅ Prefira
function sortByStart(shifts: Shift[]): Shift[] {
  return shifts.toSorted((a, b) => a.start.localeCompare(b.start));
}
```

### `async`/`await` em vez de cadeias de `then`

```ts
// ❌ Evite
function loadSchedule(id: string) {
  return fetchSchedule(id).then((schedule) => fetchShifts(schedule.id));
}

// ✅ Prefira
async function loadSchedule(id: string): Promise<Shift[]> {
  const schedule = await fetchSchedule(id);
  return fetchShifts(schedule.id);
}
```

## Rode o linter ao terminar cada tarefa

Ao concluir qualquer tarefa que altere código, rode `pnpm lint` e corrija tudo o que ele apontar antes de considerar a tarefa pronta. Rode também `pnpm build`, que faz a checagem de tipos — o lint sozinho não detecta erros de tipo.

## Regras aplicadas pelo lint

O `.oxlintrc.json` aplica automaticamente: `no-var`, `prefer-const`, `eqeqeq`, `typescript/no-explicit-any`, `typescript/consistent-type-definitions` (`type`), `func-style` (declaração), `prefer-arrow-callback`, `no-nested-ternary`, `no-unneeded-ternary`, `typescript/no-non-null-assertion` e `prefer-template`. Tipagem explícita de retornos com objetos, `??`/`?.`, imutabilidade e `async`/`await` dependem de revisão.
