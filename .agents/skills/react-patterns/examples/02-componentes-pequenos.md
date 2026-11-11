# Exemplos: Componentes pequenos e reutilizáveis

Regra em [SKILL.md](../SKILL.md).

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
