# Exemplos: Composição com `children` antes de Context

Regra em [SKILL.md](../SKILL.md).

```tsx
// ❌ Evite: ScheduleView e ScheduleLayout só repassam `user` para baixo
function ScheduleView({ user }: ScheduleViewProps) {
  return <ScheduleLayout user={user} />;
}

function ScheduleLayout({ user }: ScheduleLayoutProps) {
  return (
    <aside>
      <UserMenu user={user} />
    </aside>
  );
}

// ✅ Prefira: o layout recebe o pedaço pronto por children
function ScheduleView({ user }: ScheduleViewProps) {
  return (
    <ScheduleLayout>
      <UserMenu user={user} />
    </ScheduleLayout>
  );
}

function ScheduleLayout({ children }: ScheduleLayoutProps) {
  return <aside>{children}</aside>;
}
```

```tsx
// ✅ Context para dado global da árvore, com o Context como provider (React 19)
export const FontScaleContext = createContext<FontScale>('normal');

function App() {
  const [fontScale, setFontScale] = useState<FontScale>('normal');
  return (
    <FontScaleContext value={fontScale}>
      <AppRoutes onFontScaleChange={setFontScale} />
    </FontScaleContext>
  );
}

// ❌ Evite em código novo
<FontScaleContext.Provider value={fontScale}>
```
