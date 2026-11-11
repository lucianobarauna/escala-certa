# Exemplos: Formulários com Actions

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: carregamento e erro controlados à mão
function ShiftForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    // ...try/catch, setError, setIsSaving(false)
  }
  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

```tsx
// ✅ Prefira: shift-form.actions.ts — função pura de envio, testável sem React
type SaveShiftState = { error: string | null };

export const INITIAL_SAVE_SHIFT_STATE: SaveShiftState = { error: null };

export async function saveShiftAction(
  _previous: SaveShiftState,
  formData: FormData,
): Promise<SaveShiftState> {
  const result = await saveShift(toShiftPayload(formData));
  return { error: result.ok ? null : SAVE_SHIFT_ERROR };
}

// ✅ ShiftForm.tsx
function ShiftForm() {
  const [state, formAction] = useActionState(saveShiftAction, INITIAL_SAVE_SHIFT_STATE);
  return (
    <form action={formAction}>
      <ShiftFields />
      {state.error && <p role="alert">{state.error}</p>}
      <SaveShiftButton />
    </form>
  );
}

// ✅ SaveShiftButton.tsx — lê o envio do <form> pai, sem receber props
function SaveShiftButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" isDisabled={pending}>
      {pending ? 'Salvando…' : 'Salvar turno'}
    </Button>
  );
}
```

- `useActionState` vem de `react`; `useFormStatus` vem de `react-dom` e só funciona em um componente renderizado **dentro** do `<form>`.
- Quando a action termina sem lançar exceção (inclusive quando devolve um erro no estado), o React limpa os campos não controlados do formulário. Se o usuário precisa ver os valores após um erro, devolva-os no estado da action ou use campos controlados.
