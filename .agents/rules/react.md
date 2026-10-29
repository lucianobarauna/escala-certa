# Padrões de React

Como escrever componentes e hooks React neste repositório. As convenções gerais (tamanho de arquivo, comentários, nomes) ficam em `.agents/rules/code-standards.md` e as de testes em `.agents/rules/tests.md`; ambas também valem aqui.

## Prefira componentes funcionais

Escreva componentes como funções. Não use componentes de classe — eles não funcionam com hooks e o React Compiler não os otimiza.

```tsx
// ❌ Evite
class ShiftBadge extends React.Component<ShiftBadgeProps> {
  render() {
    return <span>{this.props.label}</span>;
  }
}

// ✅ Prefira
function ShiftBadge({ label }: ShiftBadgeProps) {
  return <span>{label}</span>;
}
```

## Componentes pequenos e reutilizáveis

Nenhum componente deve passar de **30 linhas** (o mesmo limite de funções do `code-standards.md`, aplicado pelo Oxlint). Quando crescer, extraia subcomponentes com uma responsabilidade cada e receba dados por props em vez de buscá-los ou fixá-los dentro do componente — assim ele pode ser reaproveitado em outras telas.

```tsx
// ❌ Evite: cabeçalho, lista e rodapé no mesmo componente
function ScheduleCard({ schedule }: ScheduleCardProps) {
  return (
    <article>
      <header>{/* ...10 linhas */}</header>
      <ul>{/* ...15 linhas de map com markup do turno */}</ul>
      <footer>{/* ...10 linhas */}</footer>
    </article>
  );
}

// ✅ Prefira: composição de componentes pequenos
function ScheduleCard({ schedule }: ScheduleCardProps) {
  return (
    <article aria-labelledby={`schedule-${schedule.id}`}>
      <ScheduleHeader id={`schedule-${schedule.id}`} name={schedule.name} />
      <ShiftList shifts={schedule.shifts} />
      <ScheduleFooter totalHours={schedule.totalHours} />
    </article>
  );
}
```

Cada subcomponente segue a regra de pasta do `code-standards.md`: se for usado só pelo componente pai, pode ficar na mesma pasta; se for reutilizado em outros lugares, ganha a própria pasta em `src/components/<Nome>/`.

## Evite `useEffect` desnecessário

`useEffect` serve para sincronizar o componente com algo **externo** ao React (API do navegador, assinatura de evento, biblioteca de terceiros). Não o use para calcular dados derivados nem para reagir a ações do usuário.

```tsx
// ❌ Evite: estado derivado sincronizado por efeito (render extra e risco de dessincronizar)
function ShiftSummary({ shifts }: ShiftSummaryProps) {
  const [totalHours, setTotalHours] = useState(0);
  useEffect(() => {
    setTotalHours(sumHours(shifts));
  }, [shifts]);
  return <p>{totalHours}h</p>;
}

// ✅ Prefira: calcule durante o render
function ShiftSummary({ shifts }: ShiftSummaryProps) {
  const totalHours = sumHours(shifts);
  return <p>{totalHours}h</p>;
}
```

```tsx
// ❌ Evite: efeito disparado por mudança de estado que nasceu de um clique
useEffect(() => {
  if (isSubmitted) saveSchedule(schedule);
}, [isSubmitted, schedule]);

// ✅ Prefira: a lógica fica no próprio handler do evento
function handleSubmit() {
  saveSchedule(schedule);
}
```

- Para reiniciar o estado de um componente quando um dado muda, use a prop `key` (`<ScheduleForm key={schedule.id} />`) em vez de um efeito que zera o estado.

## `useMemo` apenas para cálculos pesados comprovados

O React Compiler já memoiza automaticamente valores e funções entre re-renders, por isso o `.oxlintrc.json` bloqueia o import de `useMemo`, `useCallback` e `memo`. Na grande maioria dos casos, escreva o cálculo direto no render e deixe o compiler cuidar disso.

Use `useMemo` somente quando um cálculo for realmente pesado (ex.: gerar a escala de um mês inteiro com checagem de conflitos para centenas de funcionários) **e** um profiling (React DevTools Profiler) mostrar que ele está sendo refeito sem necessidade. Nesse caso, desative a regra do lint apenas naquela linha, com o motivo:

```tsx
// ❌ Evite: useMemo em cálculo trivial (o compiler já resolve)
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);

// ✅ Prefira: cálculo direto
const fullName = `${firstName} ${lastName}`;

// ✅ Exceção aceitável: cálculo pesado confirmado por profiling
// oxlint-disable-next-line no-restricted-imports -- geração da escala mensal medida em 120ms no Profiler
import { useMemo } from 'react';

const monthlyGrid = useMemo(() => buildMonthlyGrid(employees, month), [employees, month]);
```

## Lógica em hooks com prefixo `use`

Lógica de estado, efeitos e regras de interação ficam em hooks customizados, separados do JSX. O nome **sempre** começa com `use` — é assim que o React (e o lint de regras de hooks) reconhece que a função pode chamar outros hooks.

```tsx
// ❌ Evite: lógica de filtro misturada com o markup
function ShiftTable({ shifts }: ShiftTableProps) {
  const [role, setRole] = useState<Role | 'all'>('all');
  const visibleShifts = role === 'all' ? shifts : shifts.filter((shift) => shift.role === role);
  return (/* ...select de filtro e tabela */);
}

// ✅ Prefira: src/components/ShiftTable/useShiftFilters.ts
export function useShiftFilters(shifts: Shift[]) {
  const [role, setRole] = useState<Role | 'all'>('all');
  const visibleShifts = role === 'all' ? shifts : shifts.filter((shift) => shift.role === role);
  return { role, setRole, visibleShifts };
}

// ✅ E o componente só consome o hook
function ShiftTable({ shifts }: ShiftTableProps) {
  const { role, setRole, visibleShifts } = useShiftFilters(shifts);
  return (/* ...select de filtro e tabela */);
}
```

- O hook fica na pasta do componente que o usa (`useShiftFilters.ts`). Se for compartilhado por vários componentes, vai para `src/hooks/`.
- Funções que não usam nenhum hook não levam o prefixo `use` — são utilitários comuns (`*.utils.ts`).

## Acessibilidade em todo componente

Todo componente interativo ou que comunica estado precisa ser acessível. Siga esta ordem:

1. **HTML semântico primeiro**: `<button>`, `<nav>`, `<label>`, `<table>` já trazem papel e comportamento de teclado. Não use `<div onClick>`.
2. **Componentes do shadcn/ui** (`react-aria-components`), que já cuidam de foco, teclado e ARIA.
3. **Atributos `aria-*`** para o que o HTML sozinho não expressa: nome de botões só com ícone, estado de expandido/selecionado, regiões que se atualizam, descrição de erros.

```tsx
// ❌ Evite
<div onClick={removeShift}>
  <TrashIcon />
</div>

// ✅ Prefira
<Button aria-label={`Remover turno de ${employeeName}`} onPress={removeShift}>
  <TrashIcon aria-hidden="true" />
</Button>
```

```tsx
// ✅ Campo com erro associado e mensagens anunciadas
<label htmlFor="shift-start">Início do turno</label>
<input
  id="shift-start"
  aria-invalid={Boolean(startError)}
  aria-describedby={startError ? 'shift-start-error' : undefined}
/>
{startError && <p id="shift-start-error" role="alert">{startError}</p>}
```

- Ícones decorativos levam `aria-hidden="true"`.
- Use `aria-expanded`, `aria-controls`, `aria-current`, `aria-live` etc. conforme o padrão do componente.
- Não adicione ARIA redundante (ex.: `role="button"` em um `<button>`) — ARIA errado é pior que nenhum.
- Os testes devem consultar pelo papel e nome acessível (`getByRole('button', { name: 'Remover turno de Ana' })`); se a query não encontra o elemento, provavelmente falta acessibilidade.

## Estilização com Tailwind

Estilize componentes apenas com classes utilitárias do Tailwind, usando os tokens do tema e `cn()` para classes condicionais (detalhes na seção "Estilização" do `code-standards.md`). Não crie arquivos CSS por componente nem use `style={{}}` inline, exceto para valores realmente dinâmicos calculados em tempo de execução.

```tsx
// ❌ Evite
import './ShiftBadge.css';

<span className="shift-badge" style={{ backgroundColor: '#e11d48' }}>{label}</span>

// ✅ Prefira
<span className={cn('rounded-md px-2 py-1 text-sm', isOvertime ? 'bg-destructive text-white' : 'bg-muted')}>
  {label}
</span>
```
