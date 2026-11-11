# Exemplos: Componentes e hooks puros

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: muta a prop recebida e lê um valor que muda a cada render
function ShiftList({ shifts }: ShiftListProps) {
  shifts.sort((a, b) => a.start.localeCompare(b.start));
  const renderedAt = new Date().toLocaleTimeString();
  return <ShiftItems shifts={shifts} caption={`Atualizado às ${renderedAt}`} />;
}

// ✅ Prefira: cria um array novo e recebe o horário de fora
function ShiftList({ shifts, updatedAt }: ShiftListProps) {
  const sortedShifts = shifts.toSorted((a, b) => a.start.localeCompare(b.start));
  return <ShiftItems shifts={sortedShifts} caption={`Atualizado às ${updatedAt}`} />;
}
```

```tsx
// ❌ Evite: muta o estado atual (o React não vê a mudança e a tela não atualiza)
function addShift(shift: Shift) {
  schedule.shifts.push(shift);
  setSchedule(schedule);
}

// ✅ Prefira: novo objeto e novo array
function addShift(shift: Shift) {
  setSchedule((current) => ({ ...current, shifts: [...current.shifts, shift] }));
}
```
