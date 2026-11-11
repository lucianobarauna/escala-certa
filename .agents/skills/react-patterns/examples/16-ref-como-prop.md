# Exemplos: `ref` como prop, sem `forwardRef`

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: forwardRef é desnecessário no React 19 e será descontinuado
const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => (
  <input ref={ref} type="time" {...props} />
));

// ✅ Prefira: ref chega junto com as outras props
type TimeInputProps = ComponentProps<'input'>;

function TimeInput({ ref, ...props }: TimeInputProps) {
  return <input ref={ref} type="time" {...props} />;
}
```
