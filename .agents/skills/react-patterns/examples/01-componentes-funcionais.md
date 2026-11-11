# Exemplos: Prefira componentes funcionais

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite
class ShiftBadge extends React.Component<ShiftBadgeProps> {
  render() {
    return <span>{this.props.label}</span>;
  }
}

// ✅ Prefira
function ShiftBadge({ label }: ShiftBadgeProps) {
  return <span>{label}</span>;
}
```
