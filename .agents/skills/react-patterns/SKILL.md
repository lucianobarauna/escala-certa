---
name: react-patterns
description: Padrões de React do Escala Certa (React 19 + React Compiler + shadcn/ui aria-nova + Tailwind v4). Use sempre que for criar, alterar ou revisar componentes, hooks, telas (views) ou formulários React em src/, ou quando a dúvida envolver useEffect, useMemo, estado, keys, refs, Context, acessibilidade ou estilização de componentes.
---

# Padrões de React

Como escrever componentes e hooks React neste repositório. As convenções gerais (tamanho de arquivo, comentários, nomes) ficam em `.agents/rules/code-standards.md` e as de testes em `.agents/rules/tests.md`; ambas também valem aqui.

Cada regra abaixo tem um arquivo de exemplos (❌ Evite / ✅ Prefira) em `examples/`. Abra o exemplo da regra quando for aplicá-la ou quando a regra sozinha não deixar claro o formato esperado.

## Prefira componentes funcionais

Escreva componentes como funções. Não use componentes de classe — eles não funcionam com hooks e o React Compiler não os otimiza.

Exemplo: [examples/01-componentes-funcionais.md](examples/01-componentes-funcionais.md)

## Componentes pequenos e reutilizáveis

Nenhum componente deve passar de **30 linhas** (o mesmo limite de funções do `code-standards.md`, aplicado pelo Oxlint). Quando crescer, extraia subcomponentes com uma responsabilidade cada e receba dados por props em vez de buscá-los ou fixá-los dentro do componente — assim ele pode ser reaproveitado em outras telas.

Exemplo: [examples/02-componentes-pequenos.md](examples/02-componentes-pequenos.md)

Cada subcomponente segue a regra de pasta do `code-standards.md`: se for usado só pelo componente pai, pode ficar na mesma pasta; se for reutilizado em outros lugares, ganha a própria pasta em `src/components/<Nome>/`.

## Evite `useEffect` desnecessário

`useEffect` serve para sincronizar o componente com algo **externo** ao React (API do navegador, assinatura de evento, biblioteca de terceiros). Não o use para calcular dados derivados nem para reagir a ações do usuário.

Exemplos: [examples/03-evite-useeffect.md](examples/03-evite-useeffect.md)

- Para reiniciar o estado de um componente quando um dado muda, use a prop `key` (`<ScheduleForm key={schedule.id} />`) em vez de um efeito que zera o estado.

## `useMemo` apenas para cálculos pesados comprovados

O React Compiler já memoiza automaticamente valores e funções entre re-renders, por isso o `.oxlintrc.json` bloqueia o import de `useMemo`, `useCallback` e `memo`. Na grande maioria dos casos, escreva o cálculo direto no render e deixe o compiler cuidar disso.

Use `useMemo` somente quando um cálculo for realmente pesado (ex.: gerar a escala de um mês inteiro com checagem de conflitos para centenas de funcionários) **e** um profiling (React DevTools Profiler) mostrar que ele está sendo refeito sem necessidade. Nesse caso, desative a regra do lint apenas naquela linha, com o motivo.

Exemplo: [examples/04-usememo.md](examples/04-usememo.md)

## Lógica em hooks com prefixo `use`

Lógica de estado, efeitos e regras de interação ficam em hooks customizados, separados do JSX. O nome **sempre** começa com `use` — é assim que o React (e o lint de regras de hooks) reconhece que a função pode chamar outros hooks.

Exemplo: [examples/05-hooks-customizados.md](examples/05-hooks-customizados.md)

- O hook fica na pasta do componente que o usa (`useShiftFilters.ts`). Se for compartilhado por vários componentes, vai para `src/hooks/`.
- Funções que não usam nenhum hook não levam o prefixo `use` — são utilitários comuns (`*.utils.ts`).

## Acessibilidade em todo componente

Todo componente interativo ou que comunica estado precisa ser acessível. Siga esta ordem:

1. **HTML semântico primeiro**: `<button>`, `<nav>`, `<label>`, `<table>` já trazem papel e comportamento de teclado. Não use `<div onClick>`.
2. **Componentes do shadcn/ui** (`react-aria-components`), que já cuidam de foco, teclado e ARIA.
3. **Atributos `aria-*`** para o que o HTML sozinho não expressa: nome de botões só com ícone, estado de expandido/selecionado, regiões que se atualizam, descrição de erros.

Exemplos: [examples/06-acessibilidade.md](examples/06-acessibilidade.md)

- Ícones decorativos levam `aria-hidden="true"`.
- Use `aria-expanded`, `aria-controls`, `aria-current`, `aria-live` etc. conforme o padrão do componente.
- Não adicione ARIA redundante (ex.: `role="button"` em um `<button>`) — ARIA errado é pior que nenhum.
- Os testes devem consultar pelo papel e nome acessível (`getByRole('button', { name: 'Remover turno de Ana' })`); se a query não encontra o elemento, provavelmente falta acessibilidade.

## Estilização com Tailwind

Estilize componentes apenas com classes utilitárias do Tailwind, usando os tokens do tema e `cn()` para classes condicionais (detalhes na seção "Estilização" do `code-standards.md`). Não crie arquivos CSS por componente nem use `style={{}}` inline, exceto para valores realmente dinâmicos calculados em tempo de execução.

Exemplo: [examples/07-tailwind.md](examples/07-tailwind.md)

## Componentes e hooks puros

O render deve ser um cálculo: mesmas props e estado, mesmo JSX. Não altere props, estado ou variáveis de fora do componente durante o render, e não leia valores que mudam a cada chamada (`Date.now()`, `Math.random()`). Para atualizar estado, crie um objeto ou array novo em vez de mutar o atual. O React Compiler parte do princípio de que o código é puro; uma mutação quebra a memoização e gera telas desatualizadas.

Exemplo: [examples/08-componentes-puros.md](examples/08-componentes-puros.md)

## Estado mínimo e sem contradições

Guarde no estado só o que não pode ser calculado. Não duplique dados que já vêm por props ou de outro estado, e substitua vários booleanos que não podem ser verdadeiros juntos (`isLoading`, `isError`, `isSuccess`) por uma única união de status. Para item selecionado, guarde o `id`, não uma cópia do objeto.

Exemplo: [examples/09-estado-minimo.md](examples/09-estado-minimo.md)

## Atualize o estado a partir do anterior com função

Quando o próximo valor depende do valor atual, passe uma função ao `setState` (`setCount((count) => count + 1)`). O valor lido no render é o da renderização atual; várias atualizações seguidas, ou uma atualização dentro de um callback assíncrono, perdem mudanças se usarem esse valor.

Exemplo: [examples/10-funcao-de-atualizacao.md](examples/10-funcao-de-atualizacao.md)

## Keys estáveis e únicas em listas

Todo item renderizado em `map` precisa de uma `key` que identifique o dado, não a posição: use o `id` do registro. Índice do array ou valor aleatório como `key` faz o React reaproveitar o estado do item errado quando a lista é reordenada, filtrada ou recebe itens no início.

Exemplo: [examples/11-keys.md](examples/11-keys.md)

## Não declare componentes dentro de componentes

Declare cada componente no topo do arquivo (ou no próprio arquivo). Um componente definido dentro de outro é uma função nova a cada render, então o React o desmonta e monta de novo: o estado interno e o foco são perdidos a cada digitação. Passe os dados de que ele precisa por props.

Exemplo: [examples/12-componentes-aninhados.md](examples/12-componentes-aninhados.md)

## Efeitos com limpeza

Todo efeito que assina, agenda ou busca algo devolve uma função de limpeza que desfaz o que ele fez: remover o listener, cancelar o timer, ignorar ou abortar a requisição. Sem isso, uma resposta lenta de uma busca antiga sobrescreve a mais nova (condição de corrida) e listeners se acumulam. Em desenvolvimento o React monta os efeitos duas vezes justamente para revelar a falta de limpeza.

Exemplos: [examples/13-limpeza-de-efeitos.md](examples/13-limpeza-de-efeitos.md)

## `useId` para ids de acessibilidade

Gere com `useId` os ids usados em `htmlFor`, `aria-describedby`, `aria-labelledby` e `aria-controls`. Um id fixo no código se repete quando o componente aparece duas vezes na tela e quebra a associação entre rótulo, campo e mensagem de erro. Não use `useId` para gerar `key` de lista.

Exemplo: [examples/14-useid.md](examples/14-useid.md)

## Composição com `children` antes de Context

Antes de repassar uma prop por vários níveis que não a usam, tente compor: receba `children` (ou outro slot como prop) e deixe o componente de cima montar a parte que precisa do dado. Use Context apenas para dados realmente globais da árvore, como tema, usuário logado ou idioma. No React 19, use o próprio Context como provider (`<ThemeContext value={...}>`), sem `.Provider`.

Exemplos: [examples/15-composicao-e-context.md](examples/15-composicao-e-context.md)

## `ref` como prop, sem `forwardRef`

No React 19, componentes de função recebem `ref` como uma prop comum. Não use `forwardRef` em código novo; ele será descontinuado. Desestruture `ref` das props e repasse para o elemento.

Exemplo: [examples/16-ref-como-prop.md](examples/16-ref-como-prop.md)

## Formulários com Actions

Para envio de formulários, use a prop `action` do `<form>` com `useActionState` (resultado, erro e `isPending` do envio) e `useFormStatus` (estado de envio dentro de um componente filho, como o botão). Isso substitui `useState` manual de carregamento e erro e `onSubmit` com `preventDefault`. Mensagens de erro do envio continuam com `role="alert"`.

Exemplo: [examples/17-formularios-com-actions.md](examples/17-formularios-com-actions.md)
