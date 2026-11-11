# Exemplos: Acessibilidade em todo componente

Regra em [SKILL.md](../SKILL.md).

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
// ✅ Campo com erro associado e mensagens anunciadas (ids gerados com useId, veja 14-useid.md)
const startId = useId();
const startErrorId = `${startId}-error`;

<label htmlFor={startId}>Início do turno</label>
<input
  id={startId}
  aria-invalid={Boolean(startError)}
  aria-describedby={startError ? startErrorId : undefined}
/>
{startError && <p id={startErrorId} role="alert">{startError}</p>}
```
