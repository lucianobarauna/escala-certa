# Exemplos: Estado mínimo e sem contradições

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: booleanos que podem ficar contraditórios (isLoading e isError ao mesmo tempo)
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);

// ✅ Prefira: uma união de status, um estado possível por vez
type LoadStatus = 'idle' | 'loading' | 'error' | 'success';

const [status, setStatus] = useState<LoadStatus>('idle');
```

```tsx
// ❌ Evite: cópia do objeto selecionado (fica desatualizada quando a lista muda)
const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

// ✅ Prefira: guarde o id e derive o objeto durante o render
const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
const selectedShift = shifts.find((shift) => shift.id === selectedShiftId);
```
