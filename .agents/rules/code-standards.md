# Padrões de Código

Como escrever código neste repositório. Para arquitetura e ferramentas (o que está instalado e onde é configurado), veja `AGENTS.md`.

## TypeScript

- Use `import type { X }` para imports apenas de tipo (exigido pelo `verbatimModuleSyntax`).
- Remova variáveis e parâmetros não utilizados em vez de silenciá-los — as checagens estritas de não uso quebram o build.
- Importe de fora da pasta atual com o alias `@/` em vez de caminhos relativos longos (`../../`).

## React

- Não adicione `useMemo`, `useCallback` ou `memo` por performance — o React Compiler memoiza automaticamente. Use-os apenas quando um profiling mostrar necessidade real.
- Uma pasta por componente em `src/components/<Nome>/`, contendo `<Nome>.tsx` e `<Nome>.spec.tsx`.
- Os primitivos do shadcn/ui em `src/components/ui/` são arquivos soltos, não pastas. Prefira compô-los a editar os arquivos gerados.

## Estilização

- Use classes utilitárias do Tailwind; evite arquivos CSS separados para estilos de componentes.
- Use tokens do tema (ex.: `bg-primary`, `bg-(--accent-bg)`) em vez de cores fixas.
- Combine classes condicionais com `cn()` de `@/lib/utils`.

## Código limpo

### Sem comentários

Não escreva comentários. Nomes de variáveis, funções e tipos devem explicar o código. A única exceção é quando algo é realmente difícil de entender só pela leitura, como uma expressão regular complexa.

```ts
// ❌ Evite
// verifica se o usuário pode editar a escala
if (user.role === 'admin' || user.id === schedule.ownerId) {
}

// ✅ Prefira
const canEditSchedule = user.role === 'admin' || user.id === schedule.ownerId;
if (canEditSchedule) {
}

// ✅ Exceção aceitável
// HH:MM no formato 24h (00:00 até 23:59)
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
```

### Arquivos com no máximo 100 linhas

Nenhum arquivo `.ts`/`.tsx` (nem classe) deve passar de 100 linhas. Quando crescer, separe por responsabilidade: tipos, constantes, funções utilitárias, hooks e subcomponentes.

```
❌ src/components/ScheduleTable/ScheduleTable.tsx   (240 linhas)

✅ src/components/ScheduleTable/
   ├── ScheduleTable.tsx        (componente principal)
   ├── ScheduleRow.tsx          (subcomponente)
   ├── useScheduleFilters.ts    (lógica de estado)
   ├── schedule-table.utils.ts  (funções puras)
   └── ScheduleTable.spec.tsx
```

Os arquivos gerados pelo shadcn em `src/components/ui/` ficam fora dessa regra.

### Funções e métodos com no máximo 30 linhas

Se uma função passar de 30 linhas, divida-a em funções menores, cada uma com um nome que descreva sua etapa.

```ts
// ❌ Evite: uma função que valida, calcula e formata tudo junto
function buildShiftSummary(shifts: Shift[]) {
  // ...45 linhas
}

// ✅ Prefira: funções pequenas compostas
function buildShiftSummary(shifts: Shift[]) {
  const validShifts = shifts.filter(isValidShift);
  const totalHours = sumHours(validShifts);
  return formatSummary(validShifts.length, totalHours);
}
```

### No máximo 3 níveis de if/else — prefira cláusulas guarda

Não aninhe mais de 3 `if/else`. Trate os casos de saída primeiro com _early return_ e deixe o caminho principal sem indentação.

```ts
// ❌ Evite
function getShiftLabel(shift?: Shift) {
  if (shift) {
    if (shift.isActive) {
      if (shift.employee) {
        return `${shift.employee.name} — ${shift.start}`;
      } else {
        return 'Sem responsável';
      }
    } else {
      return 'Inativo';
    }
  }
  return '';
}

// ✅ Prefira
function getShiftLabel(shift?: Shift) {
  if (!shift) return '';
  if (!shift.isActive) return 'Inativo';
  if (!shift.employee) return 'Sem responsável';
  return `${shift.employee.name} — ${shift.start}`;
}
```

### No máximo 3 parâmetros — use objeto parâmetro

Funções e métodos devem receber até 3 parâmetros. Acima disso, agrupe-os em um objeto tipado.

```ts
// ❌ Evite
function createShift(employeeId: string, date: string, start: string, end: string, role: string) {}

createShift('42', '2026-10-15', '08:00', '16:00', 'nurse');

// ✅ Prefira
type CreateShiftParams = {
  employeeId: string;
  date: string;
  start: string;
  end: string;
  role: string;
};

function createShift({ employeeId, date, start, end, role }: CreateShiftParams) {}

createShift({ employeeId: '42', date: '2026-10-15', start: '08:00', end: '16:00', role: 'nurse' });
```

### Sem linhas em branco dentro de funções

Não use linhas em branco dentro de funções e métodos. Se você sente vontade de separar "blocos", provavelmente cada bloco deveria ser uma função própria. Linhas em branco entre funções, membros de classe e declarações de topo do arquivo são permitidas.

```ts
// ❌ Evite
function saveSchedule(schedule: Schedule) {
  const payload = toPayload(schedule);

  validate(payload);

  return api.post('/schedules', payload);
}

// ✅ Prefira
function saveSchedule(schedule: Schedule) {
  const payload = toPayload(schedule);
  validate(payload);
  return api.post('/schedules', payload);
}

function deleteSchedule(id: string) {
  return api.delete(`/schedules/${id}`);
}
```

### Extraia números e strings mágicos para constantes

Valores literais com significado de negócio devem virar constantes nomeadas. Assim o conceito fica explícito e é alterado em um único lugar.

```ts
// ❌ Evite
if (totalHours > 44) {
  showWarning('Limite excedido');
}

// ✅ Prefira
const MAX_WEEKLY_HOURS = 44;
const WEEKLY_LIMIT_WARNING = 'Limite semanal de horas excedido';

if (totalHours > MAX_WEEKLY_HOURS) {
  showWarning(WEEKLY_LIMIT_WARNING);
}
```

### Declare variáveis perto de onde são usadas

Declare cada variável imediatamente antes do primeiro uso, e não no topo da função.

```ts
// ❌ Evite
function publishSchedule(schedule: Schedule) {
  const message = `Escala ${schedule.name} publicada`;
  const recipients = getEmployeeEmails(schedule);
  if (!schedule.isComplete) return;
  if (hasConflicts(schedule)) return;
  notify(recipients, message);
}

// ✅ Prefira
function publishSchedule(schedule: Schedule) {
  if (!schedule.isComplete) return;
  if (hasConflicts(schedule)) return;
  const recipients = getEmployeeEmails(schedule);
  const message = `Escala ${schedule.name} publicada`;
  notify(recipients, message);
}
```

### Nunca coloque dados sensíveis no código

Chaves de API, tokens, senhas e URLs privadas nunca vão para o código-fonte. Guarde-os em `.env.local` (já ignorado pelo Git via `*.local`) e versione apenas um `.env.example` com os nomes das variáveis, sem valores reais.

```ts
// ❌ Evite
const API_KEY = 'sk_live_9f8a7b6c5d4e';

// ✅ Prefira
const API_KEY = import.meta.env.VITE_API_KEY;
```

```bash
# .env.example (versionado)
VITE_API_KEY=

# .env.local (não versionado)
VITE_API_KEY=sk_live_9f8a7b6c5d4e
```

> Atenção: no Vite, toda variável com prefixo `VITE_` é embutida no bundle e fica visível para qualquer pessoa no navegador. O `.env` evita que o segredo vá para o repositório, mas não o torna secreto no front-end. Segredos de verdade (chaves com permissão de escrita, cobrança etc.) devem ficar em um backend ou proxy, nunca no cliente.

## Testes

- Mantenha o arquivo de spec ao lado do componente que ele testa (ex.: `src/components/HelloWorld/HelloWorld.spec.tsx`).
- Renderize com o `render` do `vitest-browser-react`.
- Faça queries por papel acessível ou texto (`getByRole`, `getByText`) em vez de test IDs ou seletores CSS.

## Formatação e Lint

- Não formate manualmente — rode `pnpm format` (o oxfmt cuida de aspas, ponto e vírgula, ordem dos imports e ordem das classes do Tailwind).
- O código precisa passar em `pnpm lint` e `pnpm build` antes de cada commit.
- O `.oxlintrc.json` aplica automaticamente os limites de linhas por arquivo e por função, profundidade de blocos, número de parâmetros, `else` após `return`, números mágicos, imports relativos de pastas acima (`../`), imports de `useMemo`/`useCallback`/`memo`, regras de hooks (prefixo `use`, sem hook dentro de condição ou loop), proibição de componentes de classe e checagens de acessibilidade do plugin `jsx-a11y` (ex.: `<div onClick>`, `<img>` sem `alt`, ARIA inválido). As regras de React estão descritas em `.agents/rules/react.md`. As demais regras deste documento dependem de revisão.
- Exceções configuradas no lint: arquivos `.spec.ts`/`.spec.tsx` não têm limite de linhas por função nem checagem de números mágicos (o limite de 100 linhas por arquivo continua valendo), e a pasta `.claude/` não é verificada.
