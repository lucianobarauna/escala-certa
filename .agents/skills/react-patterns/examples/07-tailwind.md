# Exemplos: Estilização com Tailwind

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite
import './ShiftBadge.css';

<span className="shift-badge" style={{ backgroundColor: '#e11d48' }}>{label}</span>

// ✅ Prefira
<span className={cn('rounded-md px-2 py-1 text-sm', isOvertime ? 'bg-destructive text-white' : 'bg-muted')}>
  {label}
</span>
```
