# Exemplos: Evite `useEffect` desnecessário

Regra em [SKILL.md](../SKILL.md).

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
