# Exemplos: Efeitos com limpeza

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: se scheduleId mudar antes da resposta, a resposta antiga pode chegar por último e vencer
useEffect(() => {
  async function loadShifts() {
    setShifts(await fetchShifts(scheduleId));
  }
  loadShifts();
}, [scheduleId]);

// ✅ Prefira: a limpeza marca a busca antiga como descartada
useEffect(() => {
  let ignore = false;
  async function loadShifts() {
    const result = await fetchShifts(scheduleId);
    if (!ignore) setShifts(result);
  }
  loadShifts();
  return () => {
    ignore = true;
  };
}, [scheduleId]);
```

```tsx
// ❌ Evite: um listener novo a cada montagem, nenhum removido
useEffect(() => {
  window.addEventListener('keydown', handleShortcut);
}, []);

// ✅ Prefira
useEffect(() => {
  window.addEventListener('keydown', handleShortcut);
  return () => window.removeEventListener('keydown', handleShortcut);
}, []);
```

Se o serviço aceitar um `AbortSignal`, use `AbortController` e chame `controller.abort()` na limpeza: além de ignorar a resposta, cancela a requisição.
