# Exemplos: Lógica em hooks com prefixo `use`

Regra em [SKILL.md](../SKILL.md).

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
