# Exemplos: `useId` para ids de acessibilidade

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: com dois ShiftStartField na tela, os dois inputs têm id="shift-start"
function ShiftStartField({ error }: ShiftStartFieldProps) {
  return (
    <>
      <label htmlFor="shift-start">Início do turno</label>
      <input id="shift-start" aria-describedby="shift-start-error" />
      {error && (
        <p id="shift-start-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

// ✅ Prefira: um id único por instância
function ShiftStartField({ error }: ShiftStartFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  return (
    <>
      <label htmlFor={inputId}>Início do turno</label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </>
  );
}
```

Os componentes de formulário do shadcn/ui (`react-aria-components`) já associam rótulo, campo e erro sozinhos; `useId` é para quando você monta essa associação à mão.
