# Exemplos: Atualize o estado a partir do anterior com função

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: as duas chamadas leem o mesmo valor do render atual; soma só 1
function addTwoExtraHours() {
  setExtraHours(extraHours + 1);
  setExtraHours(extraHours + 1);
}

// ✅ Prefira: cada atualização recebe o valor mais recente
function addTwoExtraHours() {
  setExtraHours((hours) => hours + 1);
  setExtraHours((hours) => hours + 1);
}
```

```tsx
// ❌ Evite: depois do await, `shifts` é o valor antigo do render em que o clique aconteceu
async function handleDuplicate(shift: Shift) {
  const copy = await duplicateShift(shift.id);
  setShifts([...shifts, copy]);
}

// ✅ Prefira
async function handleDuplicate(shift: Shift) {
  const copy = await duplicateShift(shift.id);
  setShifts((current) => [...current, copy]);
}
```

Quando o próximo valor não depende do anterior (`setStatus('success')`), passe o valor direto.
