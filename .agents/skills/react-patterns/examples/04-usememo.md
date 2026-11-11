# Exemplos: `useMemo` apenas para cálculos pesados comprovados

Regra em [SKILL.md](../SKILL.md).

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
