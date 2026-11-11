# Exemplos: Keys estáveis e únicas em listas

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: índice muda quando a lista é filtrada ou reordenada
{
  shifts.map((shift, index) => <ShiftRow key={index} shift={shift} />);
}

// ❌ Evite: key nova a cada render desmonta todos os itens
{
  shifts.map((shift) => <ShiftRow key={crypto.randomUUID()} shift={shift} />);
}

// ✅ Prefira: id do próprio dado
{
  shifts.map((shift) => <ShiftRow key={shift.id} shift={shift} />);
}
```

Se o dado não tem `id`, gere-o no momento em que o item é criado (ex.: `crypto.randomUUID()` ao adicionar o turno) e guarde junto com ele — nunca durante o render.
