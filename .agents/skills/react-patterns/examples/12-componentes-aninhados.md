# Exemplos: Não declare componentes dentro de componentes

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: ShiftNoteField é recriado a cada render; o campo perde o foco a cada tecla
function ShiftEditor({ shift }: ShiftEditorProps) {
  const [note, setNote] = useState(shift.note);
  function ShiftNoteField() {
    return <TextField label="Observação" value={note} onChange={setNote} />;
  }
  return <ShiftNoteField />;
}

// ✅ Prefira: componente no topo do arquivo, dados por props
function ShiftNoteField({ value, onChange }: ShiftNoteFieldProps) {
  return <TextField label="Observação" value={value} onChange={onChange} />;
}

function ShiftEditor({ shift }: ShiftEditorProps) {
  const [note, setNote] = useState(shift.note);
  return <ShiftNoteField value={note} onChange={setNote} />;
}
```
