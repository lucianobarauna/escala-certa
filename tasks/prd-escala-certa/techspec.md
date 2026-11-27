# Especificação técnica

## Resumo executivo

O Escala Certa é uma SPA de página única, 100% client-side, sem backend e hospedada no GitHub Pages. A solução separa **domínio puro** (ciclos de plantão, padrão semanal, montagem do mês, resumo, nomes acessíveis, codec da URL), **estado da tela** (um hook que mantém o rascunho da escala e o espelha no endereço com `history.replaceState`) e **apresentação** (componentes React sobre `react-aria-components`/shadcn). Todo cálculo de datas usa `@internationalized/date` (`CalendarDate`, sem fuso), o que elimina deslocamentos por horário de verão ou troca de fuso. O estado da escala vive exclusivamente na query string versionada (`?v=1&...`), nunca em `localStorage`.

As métricas usam o **Google Analytics 4 (GA4) somente após consentimento**. Um serviço de consentimento decide se o script do `gtag.js` é carregado; um serviço de analytics expõe `track(evento)` (no-op enquanto desabilitado, inclusive durante o desenvolvimento) e força `page_location` sem query e `page_title` fixo em todos os envios, para que nome e datas da escala nunca cheguem ao Google (RF58). O preview alterna entre grade de 7 colunas e lista por **container query em `rem`**, de modo que o texto ampliado (controle da página, navegador ou sistema) faça o layout cair para lista sem JavaScript de medição.

## Arquitetura do sistema

### Visão dos componentes

Todos os itens abaixo são **novos**. O `App.tsx` e o `HelloWorld` (placeholder descartável) são **modificados/removidos**: `App.tsx` passa a compor `I18nProvider` (pt-BR) + `HomeView`. Cada arquivo respeita o limite de 100 linhas e cada função o de 30.

**Domínio e tipos (puros, sem React)**

| Arquivo                                       | Responsabilidade                                                                                                                    |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `src/types/schedule.ts`                       | Tipos do domínio: `ScheduleDraft`, `DayState`, `CalendarDay`, `MonthModel`, `ConfigIssue`.                                          |
| `src/domain/schedule/schedule.constants.ts`   | Ciclos, modalidades, limites (semanas 1–7, nome 40, texto 100–200%), rótulos pt-BR.                                                 |
| `src/domain/schedule/date.utils.ts`           | `daysBetween`, `positiveModulo`, `startOfWeekSunday`, `isValidIsoDate`, conversão ISO ↔ `CalendarDate`.                             |
| `src/domain/schedule/shift-cycle.utils.ts`    | Estado do dia para plantão (12x36 diurno/noturno, 24x48, 24x72), projeção nos dois sentidos.                                        |
| `src/domain/schedule/weekly-pattern.utils.ts` | Estado do dia para escala semanal (índice da semana, repetição, projeção para trás).                                                |
| `src/domain/schedule/day-state.utils.ts`      | `getDayState(draft, date)`, `isScheduleComplete(draft)`, `getMissingFieldsMessage(draft)`.                                          |
| `src/domain/schedule/config.utils.ts`         | Transições do rascunho: trocar tipo/modalidade (limpa folgas), alterar nº de semanas, alternar folga com limite, semana incompleta. |
| `src/domain/schedule/month.utils.ts`          | `buildMonth`, `shiftMonth`, deslocamento do 1º dia da semana, marcação de "hoje".                                                   |
| `src/domain/schedule/day-name.utils.ts`       | Nome acessível completo do dia (RF27).                                                                                              |
| `src/domain/schedule/summary.utils.ts`        | Frase do resumo do mês (RF32) e contagens.                                                                                          |
| `src/domain/schedule/schedule-url.utils.ts`   | `serializeSchedule`, `parseSchedule` (despacha por versão), saneamento do nome.                                                     |
| `src/domain/schedule/schedule-url.v1.ts`      | Codec da versão 1 (campos, validações e aproveitamento de campos válidos).                                                          |

**Infraestrutura (`lib/`) e serviços**

| Arquivo                             | Responsabilidade                                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/safe-storage.ts`           | `readStorage`/`writeStorage` com `try/catch`; fallback em memória por visita (RF51, RF64).                                                  |
| `src/lib/share-link.ts`             | `shareLink({title, text, url})` → `'native' \| 'clipboard' \| 'manual' \| 'cancelled'` (RF43–RF45).                                         |
| `src/services/consent.service.ts`   | Estado do consentimento (`unknown/granted/denied`), leitura de GPC, persistência, revogação (apaga cookies `_ga*`).                         |
| `src/services/analytics.service.ts` | `track`, `setAnalyticsEnabled`, carga do `gtag.js` sob demanda, configuração restritiva do GA4, saneamento de `page_location`/`page_title`. |
| `src/services/analytics.events.ts`  | Construtores tipados dos eventos (`scheduleCompleted`, `scheduleShared`, `textSizeChanged`, `pageView`).                                    |

**Hooks**

| Arquivo                                         | Responsabilidade                                                                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/hooks/useMetricsConsent.ts`                | Expõe estado e ações (`accept`, `refuse`, `revoke`) e liga/desliga o analytics. Compartilhado por `ConsentBanner`, `PrivacyDialog` e `HomeView`. |
| `src/views/HomeView/useScheduleConfig.ts`       | Rascunho da escala inicializado da URL; cada alteração faz `replaceState` (RF35, RF38) e dispara o rastreio de escala completada (RF57).         |
| `src/views/HomeView/useMonthNavigation.ts`      | Mês exibido, anterior/próximo/hoje, `isCurrentMonth`.                                                                                            |
| `src/components/TextSizeControl/useTextSize.ts` | Nível 100–200%, persistência, aplicação em `document.documentElement` (efeito de sincronização externa).                                         |

**Componentes e tela**

| Arquivo                                                                                               | Responsabilidade                                                                                                                |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `src/views/HomeView/HomeView.tsx`                                                                     | Compõe a página: entrada, preview, resumo, compartilhar, tamanho de texto, privacidade, banner. Renderiza `<title>` com o nome. |
| `src/components/ScheduleTypeSelector/`                                                                | Escolha Plantão/Semanal com descrição no nome acessível (RF01–RF02).                                                            |
| `src/components/ShiftForm/`                                                                           | Data, escala e turno (só 12x36) do plantão (RF04–RF07).                                                                         |
| `src/components/WeeklyForm/` (+ `WeekRow.tsx`, `weekly-form.utils.ts`)                                | Modalidade, nº de semanas, folgas por semana, aviso de semana incompleta, formato lista (RF11–RF20, RF54).                      |
| `src/components/ReferenceDateField/`                                                                  | Wrapper de `DateField` + `DatePicker` (popup) do react-aria, com erro textual (RF04–RF05, RF16).                                |
| `src/components/ScheduleNameField/`                                                                   | Nome opcional ≤ 40 caracteres com aviso de privacidade (RF40–RF41).                                                             |
| `src/components/MonthPreview/` (+ `MonthHeader.tsx`, `DayCell.tsx`, `Legend.tsx`, `MonthSummary.tsx`) | Grade/lista do mês, legenda, hoje, resumo anunciado (RF22–RF34, RF52–RF53).                                                     |
| `src/components/ShareButton/`                                                                         | "Compartilhar escala", confirmação "Link copiado", campo de cópia manual (RF43–RF46).                                           |
| `src/components/TextSizeControl/`                                                                     | Botões diminuir/padrão/aumentar e anúncio do nível (RF48–RF50).                                                                 |
| `src/components/ConfigNotice/`                                                                        | Aviso de link inválido/versão desconhecida (`role="alert"`) (RF37).                                                             |
| `src/components/PrivacyDialog/`                                                                       | Texto de privacidade e alternância das métricas (RF62, RF64).                                                                   |
| `src/components/ConsentBanner/`                                                                       | Aviso inicial com "Aceitar métricas"/"Recusar métricas" (RF64–RF65).                                                            |

**Fluxo de dados**

```
URL (?v=1&...) ──parseSchedule──▶ ScheduleDraft (useScheduleConfig)
                                      │ ▲
        formulários (handlers) ───────┘ │ replaceState(serializeSchedule)
                                      ▼
   getDayState / buildMonth / summary ──▶ MonthPreview (grade ou lista por container query)
                                      │
   handlers ──track(evento)──▶ analytics.service ──(só se consent=granted)──▶ gtag.js → GA4
```

## Design de implementação

### Principais interfaces

```typescript
export type DayState = 'work' | 'off' | 'off-exit';

export function getDayState(draft: ScheduleDraft, date: CalendarDate): DayState | null;
export function buildMonth(params: BuildMonthParams): MonthModel;
export function summarizeMonth(month: MonthModel): string;
export function serializeSchedule(draft: ScheduleDraft): string;
export function parseSchedule(search: string): ParseResult;

export type ShareOutcome = 'native' | 'clipboard' | 'manual' | 'cancelled';
export function shareLink(params: ShareParams): Promise<ShareOutcome>;

export type Consent = 'unknown' | 'granted' | 'denied';
export function track(event: AnalyticsEvent): void;
export function setAnalyticsEnabled(enabled: boolean): void;
```

Regras de implementação que não são óbvias:

- **Contagem de dias sem fuso:** `daysBetween(a, b)` converte cada `CalendarDate` para dias desde a época via `Date.UTC(y, m - 1, d) / MS_PER_DAY`; nunca subtrai `Date` locais. `positiveModulo` garante índice válido para datas anteriores à referência.
- **Plantão:** `cycleIndex = positiveModulo(daysBetween(start, date), cycle.length)`; o ciclo é uma lista de `DayState` por escala/turno (tabela do RF08).
- **Semanal:** `week1Start = startOfWeekSunday(anchor)`; `weekIndex = positiveModulo(floor(daysBetween(week1Start, date) / 7), weeks)`; dia da semana de 0 (domingo) a 6; folga se estiver em `days[weekIndex]`.
- **Efeitos:** `replaceState`, `track` e `navigator.share` ficam em **handlers**, nunca em `useEffect`. Os únicos efeitos são sincronização com sistemas externos: fonte do `<html>` (`useTextSize`) e carga do script do GA4 (`useMetricsConsent`).
- **Layout grade/lista:** lista de dias (`<ul>`) em uma coluna e, a partir de um `@container` de largura mínima em `rem` (calibrado na tarefa 7.0 em `40rem`, definido como `--container-month-grid` no `src/index.css`; o ponto de partida `35rem` deixava as células apertadas), vira `grid-cols-7`; o deslocamento do 1º dia usa classes `col-start-N` aplicadas só na variante de container. Como `rem` cresce com a fonte, o texto ampliado cai para lista sozinho (RF52–RF53). O mesmo princípio vale para `WeekRow` (RF54).
- **Nome acessível do dia:** montado a partir de `Intl.DateTimeFormat('pt-BR')` por partes (dia, mês, ano, dia da semana) na ordem do PRD ("26 de novembro de 2026, quinta-feira, hoje, folga"), pois o formato `full` nativo inverte a ordem.
- **Título:** `<title>` renderizado pelo `HomeView` (React 19 o eleva ao `<head>`), com o nome quando houver (RF42).
- **Anúncios:** regiões `role="status"` (educadas) para resumo, nível de texto, "Link copiado" e estado das métricas; `role="alert"` apenas para erros e aviso de link inválido.
- **Segurança:** valores da URL passam por saneamento (remove caracteres de controle, `trim`, corta em 40) e só são renderizados como texto pelo React; nunca `dangerouslySetInnerHTML`, nunca usados em `href`/`src`.

### Modelos de dados

Contratos TypeScript do cliente — o rascunho é serializável (datas como string ISO `AAAA-MM-DD`) e campos ausentes são normalizados para `null`.

#### `ScheduleDraft` — rascunho completo da escala (estado da tela e fonte da URL)

| Campo    | Tipo                          | Obrigatório | Descrição                                                      |
| -------- | ----------------------------- | ----------- | -------------------------------------------------------------- |
| `type`   | `'shift' \| 'weekly' \| null` | sim         | Tipo escolhido; `null` até a pessoa escolher.                  |
| `name`   | `string`                      | sim         | Nome opcional, saneado, até 40 caracteres (`''` quando vazio). |
| `shift`  | `ShiftDraft`                  | sim         | Campos do plantão (mantidos ao alternar o tipo).               |
| `weekly` | `WeeklyDraft`                 | sim         | Campos da escala semanal (mantidos ao alternar o tipo).        |

#### `ShiftDraft` e `WeeklyDraft`

| Campo               | Tipo                                    | Obrigatório | Descrição                                                            |
| ------------------- | --------------------------------------- | ----------- | -------------------------------------------------------------------- |
| `shift.startDate`   | `string \| null`                        | não         | Data de um plantão (ISO).                                            |
| `shift.cycle`       | `'12x36' \| '24x48' \| '24x72' \| null` | não         | Escala escolhida.                                                    |
| `shift.turn`        | `'day' \| 'night' \| null`              | não         | Obrigatório somente quando `cycle = '12x36'`.                        |
| `weekly.modality`   | `'5x2' \| '6x1' \| null`                | não         | Define o máximo de folgas por semana (2 ou 1).                       |
| `weekly.weeks`      | `number`                                | sim         | 1 a 7; inicial 1.                                                    |
| `weekly.offDays`    | `number[][]`                            | sim         | Por semana, dias de folga (0 = domingo … 6 = sábado), sem repetição. |
| `weekly.anchorDate` | `string \| null`                        | não         | Qualquer data da semana 1 (ISO).                                     |

```json
{
  "type": "weekly",
  "name": "Escala da Ana",
  "shift": { "startDate": null, "cycle": null, "turn": null },
  "weekly": {
    "modality": "6x1",
    "weeks": 3,
    "offDays": [[0], [1], []],
    "anchorDate": "2026-11-22"
  }
}
```

> **Rascunho de plantão:** `type: "shift"` com `shift = { startDate: "2026-11-26", cycle: "12x36", turn: "night" }`; o bloco `weekly` permanece com os valores padrão (`weeks: 1`, `offDays: [[]]`) e não vai na URL.

#### `CalendarDay` e `MonthModel` — mês pronto para exibição

| Campo                   | Tipo                     | Obrigatório | Descrição                                 |
| ----------------------- | ------------------------ | ----------- | ----------------------------------------- |
| `year` / `month`        | `number`                 | sim         | Ano e mês (1–12).                         |
| `leadingBlanks`         | `number`                 | sim         | Dias vazios antes do dia 1 (0 = domingo). |
| `days`                  | `CalendarDay[]`          | sim         | Um item por dia do mês.                   |
| `counts`                | `{ work, off, offExit }` | sim         | Contagens para o resumo.                  |
| `days[].day`            | `number`                 | sim         | Dia do mês.                               |
| `days[].state`          | `DayState \| null`       | sim         | `null` quando a escala está incompleta.   |
| `days[].isToday`        | `boolean`                | sim         | Destaque de hoje.                         |
| `days[].accessibleName` | `string`                 | sim         | Nome completo (RF27).                     |

```json
{
  "year": 2026,
  "month": 11,
  "leadingBlanks": 0,
  "counts": { "work": 15, "off": 0, "offExit": 15 },
  "days": [
    {
      "day": 26,
      "state": "off-exit",
      "isToday": true,
      "accessibleName": "26 de novembro de 2026, quinta-feira, hoje, folga, saída do plantão pela manhã"
    }
  ]
}
```

> **Escala incompleta:** `state` é `null` em todos os dias, `counts` zerados e a tela exibe a orientação do RF03/RF34 no lugar do resumo.

```json
{
  "year": 2026,
  "month": 11,
  "leadingBlanks": 0,
  "counts": { "work": 0, "off": 0, "offExit": 0 },
  "days": [
    {
      "day": 1,
      "state": null,
      "isToday": false,
      "accessibleName": "1 de novembro de 2026, domingo"
    }
  ]
}
```

#### `ConfigIssue` — problemas ao ler a URL (RF37)

| Código                 | HTTP | Significado                                                                                                 |
| ---------------------- | ---- | ----------------------------------------------------------------------------------------------------------- |
| `unknown_version`      | —    | `v` ausente ou sem codec; nada é aproveitado.                                                               |
| `invalid_field`        | —    | Campo presente com valor inválido; só aquele campo é descartado.                                            |
| `inconsistent_pattern` | —    | `p` com quantidade de semanas diferente de `w`, dígito fora de 0–6 ou folgas acima do limite da modalidade. |
| `name_truncated`       | —    | Nome acima de 40 caracteres cortado.                                                                        |

```json
{
  "issues": [
    {
      "code": "invalid_field",
      "field": "d",
      "message": "A data de referência do link é inválida e foi ignorada."
    }
  ]
}
```

#### `ParseResult` — resultado de `parseSchedule`

| Campo    | Tipo            | Obrigatório | Descrição                                     |
| -------- | --------------- | ----------- | --------------------------------------------- |
| `draft`  | `ScheduleDraft` | sim         | Rascunho com os campos válidos aproveitados.  |
| `issues` | `ConfigIssue[]` | sim         | Vazio quando o link é válido ou não há query. |

#### `AnalyticsEvent` — eventos enviados ao GA4 (RF55–RF57)

| Evento               | Parâmetros                                      | Quando                                                            |
| -------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `page_view`          | `has_schedule`: `'yes' \| 'no'`                 | Uma vez por visita, após o consentimento.                         |
| `schedule_completed` | `schedule_type`, `variant`, `weeks`             | Escala fica completa; repete só se tipo/turno/modalidade mudarem. |
| `schedule_shared`    | `method`: `'native' \| 'clipboard' \| 'manual'` | Compartilhamento concluído (cancelamento não conta).              |
| `text_size_changed`  | `level`: `100 \| 125 \| 150 \| 175 \| 200`      | Nível escolhido.                                                  |

```json
{
  "name": "schedule_completed",
  "params": { "schedule_type": "shift", "variant": "12x36-night", "weeks": 0 }
}
```

```json
{
  "name": "schedule_completed",
  "params": { "schedule_type": "weekly", "variant": "6x1", "weeks": 7 }
}
```

> **Nunca enviados:** nome, datas, folgas marcadas e qualquer parte do endereço (RF58). Um teste de contrato percorre todas as chaves/valores do payload em busca de dados do rascunho.

#### `StoredPreferences` — únicas chaves guardadas no aparelho

| Chave                          | Valores                 | Descrição                                            |
| ------------------------------ | ----------------------- | ---------------------------------------------------- |
| `escala-certa:text-size`       | `"100"…"200"`           | Nível de texto (RF51).                               |
| `escala-certa:metrics-consent` | `"granted" \| "denied"` | Escolha sobre métricas (RF64); ausência = `unknown`. |

```json
{ "escala-certa:text-size": "150", "escala-certa:metrics-consent": "denied" }
```

> **Armazenamento indisponível:** `safe-storage` guarda em memória; vale só para a visita e o banner reaparece na próxima (RF64).

#### Mapeamento URL → contrato

| Origem (query string v1)        | Destino (`ScheduleDraft`)                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| `v=1`                           | seleciona o codec                                                                    |
| `t=shift\|weekly`               | `type`                                                                               |
| `c=12x36\|24x48\|24x72`         | `shift.cycle`                                                                        |
| `s=day\|night`                  | `shift.turn`                                                                         |
| `d=AAAA-MM-DD` (com `t=shift`)  | `shift.startDate`                                                                    |
| `m=5x2\|6x1`                    | `weekly.modality`                                                                    |
| `w=1..7`                        | `weekly.weeks`                                                                       |
| `p=06.13.-`                     | `weekly.offDays` (semanas separadas por `.`, dias sem separador, `-` = semana vazia) |
| `d=AAAA-MM-DD` (com `t=weekly`) | `weekly.anchorDate`                                                                  |
| `n=texto`                       | `name`                                                                               |

#### Parâmetros fixados no GA4

| API                         | Parâmetros principais                                                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`gtag('config', ID, …)`** | `send_page_view: false`, `allow_google_signals: false`, `allow_ad_personalization_signals: false`, `page_location: <origin+base path>`, `page_title: 'Escala Certa'`                                                                 |
| **Console do GA4 (manual)** | Retenção de dados no mínimo; Enhanced Measurement desligado (em especial "Page changes based on browser history events"); dimensões personalizadas de evento: `has_schedule`, `schedule_type`, `variant`, `weeks`, `method`, `level` |
| **Desabilitar após recusa** | `window['ga-disable-<ID>'] = true` + remoção dos cookies `_ga*`                                                                                                                                                                      |

### Endpoints da API

Não há backend. O "contrato de entrada" do produto é o **endereço da página**, documentado abaixo no formato de endpoint; a única chamada de rede por iniciativa do app é o envio ao GA4 (ver Pontos de integração).

#### Visão geral

| Método         | Rota                   | Descrição                                                             |
| -------------- | ---------------------- | --------------------------------------------------------------------- |
| `GET`          | `/escala-certa/?v=1&…` | Abre a página restaurando a escala descrita na query string.          |
| `replaceState` | `/escala-certa/?v=1&…` | Atualiza o endereço a cada alteração, sem criar entrada no histórico. |

---

#### `GET /escala-certa/`

Restaura entrada e preview a partir da query string; o `base` do Vite (`/escala-certa/`) é preservado.

**Query params**

| Param              | Tipo              | Default | Regras                                                                    |
| ------------------ | ----------------- | ------- | ------------------------------------------------------------------------- |
| `v`                | inteiro           | —       | Obrigatório quando houver qualquer outro parâmetro; só `1` é reconhecido. |
| `t`                | `shift \| weekly` | —       | Tipo da escala.                                                           |
| `c`, `s`, `d`      | string            | —       | Plantão: escala, turno (só com `12x36`) e data ISO válida.                |
| `m`, `w`, `p`, `d` | string            | `w=1`   | Semanal: modalidade, nº de semanas 1–7, padrão e data ISO válida.         |
| `n`                | string            | `''`    | Nome; máximo de 40 caracteres após saneamento.                            |

**Respostas**

| Status       | Corpo                               | Quando                                                                           |
| ------------ | ----------------------------------- | -------------------------------------------------------------------------------- |
| `restaurada` | `ParseResult` sem `issues`          | Link válido: formulário e preview idênticos aos do envio.                        |
| `parcial`    | `ParseResult` com `issues`          | Campos inválidos descartados, os válidos aproveitados; `ConfigNotice` anunciado. |
| `ignorada`   | `ParseResult` com `unknown_version` | Sem `v` ou versão não reconhecida; formulário vazio e utilizável.                |
| `vazia`      | `ParseResult` sem `issues`          | Sem query: formulário vazio, sem aviso.                                          |

**Exemplo — sucesso (plantão)**

```http
GET /escala-certa/?v=1&t=shift&c=12x36&s=night&d=2026-11-26&n=Escala%20da%20Ana
```

```json
{
  "draft": {
    "type": "shift",
    "name": "Escala da Ana",
    "shift": { "startDate": "2026-11-26", "cycle": "12x36", "turn": "night" },
    "weekly": { "modality": null, "weeks": 1, "offDays": [[]], "anchorDate": null }
  },
  "issues": []
}
```

**Exemplo — sucesso (semanal em rodízio)**

```http
GET /escala-certa/?v=1&t=weekly&m=6x1&w=3&p=0.1.-&d=2026-11-22
```

> `p=0.1.-` = semana 1 folga no domingo, semana 2 folga na segunda, semana 3 sem folgas marcadas (incompleta; aparece como aviso no formulário, sem invalidar o link).

**Exemplo — campo inválido**

```http
GET /escala-certa/?v=1&t=shift&c=12x36&s=night&d=2026-02-30
```

```json
{
  "draft": {
    "type": "shift",
    "name": "",
    "shift": { "startDate": null, "cycle": "12x36", "turn": "night" },
    "weekly": { "modality": null, "weeks": 1, "offDays": [[]], "anchorDate": null }
  },
  "issues": [
    {
      "code": "invalid_field",
      "field": "d",
      "message": "A data de referência do link é inválida e foi ignorada."
    }
  ]
}
```

> O formulário abre com os campos válidos preenchidos e a data vazia, com o aviso no topo. Nunca há tela de erro.

**Exemplo — versão desconhecida**

```http
GET /escala-certa/?v=9&t=shift
```

```json
{
  "draft": {
    "type": null,
    "name": "",
    "shift": { "startDate": null, "cycle": null, "turn": null },
    "weekly": { "modality": null, "weeks": 1, "offDays": [[]], "anchorDate": null }
  },
  "issues": [
    {
      "code": "unknown_version",
      "message": "Este link foi criado por uma versão que não reconhecemos. Configure a escala novamente."
    }
  ]
}
```

---

## Pontos de integração

**Google Analytics 4 (`https://www.googletagmanager.com/gtag/js?id=<ID>` e `https://www.google-analytics.com/g/collect`)**

- **Autenticação:** nenhuma; o ID de medição (`VITE_GA_MEASUREMENT_ID`) é público por natureza (vai no bundle). Definido como variável do repositório no GitHub Actions e em `.env.example` (sem valor). Sem o ID, o analytics permanece no-op (desenvolvimento e testes).
- **Consentimento:** o script só é injetado (`<script async>`) após `consent = granted` e sem GPC. Recusar/revogar define `ga-disable-<ID>`, apaga cookies `_ga*` e impede novos envios.
- **Privacidade (RF58–RF59):** `page_location` fixo em origem + caminho base, `page_title` fixo, `page_view` manual (`send_page_view: false`), Google Signals e personalização de anúncios desligados, sem `user_id`. Enhanced Measurement desligado no console (o `replaceState` poderia gerar `page_view` com a query).
- **Falhas (RF61):** `onerror` do script, bloqueio por extensão ou rede lenta são engolidos; `track` nunca lança e nunca é aguardado pela interface. O script é `async` e só carrega depois do consentimento, sem impacto no tempo de carregamento inicial.
- **Revisão no lançamento:** confirmar no console que as configurações da tabela "Parâmetros fixados" estão ativas e inspecionar uma requisição real `collect` (campos `dl` e `dt`).

**Web Share API / Clipboard API:** `navigator.share` (exige HTTPS e gesto do usuário; suporte irregular no desktop, por isso `canShare` + alternativa), depois `navigator.clipboard.writeText`, depois campo selecionável para cópia manual.

## Abordagem de testes

Meta: ≥ 80% de cobertura em linhas, funções, branches e statements (`pnpm test:coverage`), com alvo prático de ~90% no domínio e nos serviços. Segue `.agents/rules/tests.md`: AAA, um conceito por teste, FIRST, queries por papel/texto, relógio fixo (`vi.useFakeTimers` + `vi.setSystemTime`), restauração de mocks em `afterEach`. Os testes são criados de baixo para cima (domínio → hooks/serviços → componentes → integração → E2E). Criticidade **alta**: ciclos, projeção, resumo, codec da URL, privacidade das métricas.

### Testes unitários

**`date.utils.spec.ts`**

1. `daysBetween` retorna 0 para a mesma data.
2. `daysBetween` retorna positivo para datas futuras e negativo para passadas.
3. `daysBetween` conta corretamente através de 29/02 em ano bissexto (2028) e não bissexto (2027).
4. `daysBetween` atravessando virada de ano (31/12 → 01/01).
5. `daysBetween` é igual com o fuso do processo em `America/Sao_Paulo`, `UTC` e `Pacific/Auckland` (dias de mudança de horário de verão).
6. `positiveModulo` devolve valor em `[0, n)` para dividendo negativo, zero e positivo.
7. `startOfWeekSunday` devolve a própria data quando domingo e o domingo anterior nos demais dias, inclusive virando mês e ano.
8. `isValidIsoDate` aceita `2028-02-29`; rejeita `2027-02-29`, `2026-02-30`, `2026-13-01`, `abc`, `''`, `2026-1-1`.
9. Datas fora do intervalo aceito (ano < 1900 ou > 2199) são inválidas.

**`shift-cycle.utils.spec.ts`** 10. 12x36 diurno: dia 0 `work`, dia 1 `off`, dia 2 `work` (repete). 11. 12x36 noturno: dia 0 `work`, dia 1 `off-exit`; nunca produz `off`. 12. 24x48: `work`, `off-exit`, `off`, repetindo. 13. 24x72: `work`, `off-exit`, `off`, `off`, repetindo. 14. Projeção para trás (RF10): dia −1 de cada escala cai no último estado do ciclo; dia −len repete o dia 0. 15. Referência no meio do mês e no passado: dias anteriores do mês ficam preenchidos (US16). 16. Datas muito distantes (±10 anos) mantêm o ciclo correto. 17. Atravessar virada de ano, 29/02 e mudanças de horário não desloca estados. 18. Tabela parametrizada: cada escala × cada offset 0…2·len confere com a tabela do RF08.

**`weekly-pattern.utils.spec.ts`** 19. Folga fixa (1 semana, 5x2 sáb/dom): marca sábado e domingo em qualquer mês. 20. Folga fixa 6x1 (domingo): só domingos são folga. 21. Rodízio de 2 semanas alterna a cada domingo. 22. Rodízio de 7 semanas (folga avança um dia por semana e volta ao domingo) confere nas 14 semanas seguintes. 23. Âncora no meio da semana: a semana 1 é a de domingo a sábado que a contém. 24. Âncora no domingo e no sábado (limites da semana). 25. Projeção para semanas anteriores à âncora (índice negativo) mantém o padrão. 26. Semana sem folgas marcadas produz só `work`. 27. Nunca produz `off-exit`. 28. Âncora e datas atravessando virada de ano/29/02.

**`day-state.utils.spec.ts`** 29. `getDayState` retorna `null` quando o rascunho está incompleto (cada campo faltante, por tipo). 30. `isScheduleComplete`: plantão completo; 12x36 sem turno incompleto; 24x48 sem turno é completo; semanal sem âncora incompleto; semanal sem modalidade incompleto; tipo `null` incompleto. 31. Semanal com semana incompleta: ainda completa para exibição (aviso é do formulário), alinhado ao PRD (RF15 só indica). 32. `getMissingFieldsMessage` descreve o que falta para cada combinação.

**`config.utils.spec.ts`** 33. Trocar de tipo preserva os campos do outro tipo. 34. Trocar a modalidade limpa as folgas e sinaliza o aviso (RF20). 35. Mesma modalidade selecionada de novo não limpa. 36. Reduzir semanas descarta as excedentes (RF19); aumentar adiciona semanas vazias. 37. Limites 1 e 7 de semanas; valores fora (0, 8) são rejeitados/clamped. 38. Alternar folga marca e desmarca. 39. Em 5x2, a 3ª folga na semana é recusada; em 6x1, a 2ª (RF14). 40. `isWeekIncomplete` verdadeiro abaixo do exigido, falso no limite. 41. Nome: corta em 40, remove controles, preserva acentos e emojis.

**`month.utils.spec.ts`** 42. Meses de 28, 29, 30 e 31 dias (fev/2027, fev/2028, nov, dez). 43. `leadingBlanks` correto para meses que começam em cada dia da semana. 44. `isToday` verdadeiro só no dia de hoje e só no mês de hoje. 45. `shiftMonth` avança/volta atravessando dezembro↔janeiro, sem limite (RF28). 46. Mês de uma escala incompleta tem `state: null` em todos os dias.

**`day-name.utils.spec.ts`** 47. "15 de novembro de 2026, domingo, trabalha". 48. "26 de novembro de 2026, quinta-feira, hoje, folga". 49. "2 de novembro de 2026, segunda-feira, folga, saída do plantão pela manhã". 50. Combinação "hoje" + saída do plantão. 51. Escala incompleta: nome sem estado. 52. Dia 1º usa "1" e não "1º".

**`summary.utils.spec.ts`** 53. Semanal: "Novembro de 2026: 21 dias trabalhando, 9 dias de folga". 54. 24x48: "Dezembro de 2026: 11 dias de plantão, 20 dias de folga (10 com saída do plantão pela manhã)". 55. 12x36 noturno: "(todos com saída do plantão pela manhã)". 56. 12x36 diurno: sem parênteses. 57. Singular ("1 dia de folga") e zero. 58. Contagens do resumo = contagens da grade. 59. Escala incompleta devolve a orientação do RF03.

**`schedule-url.v1.spec.ts` / `schedule-url.utils.spec.ts` (criticidade alta)** 60. Round-trip (`parse(serialize(x)) == x`) para cada escala e turno de plantão. 61. Round-trip semanal: 1, 3 e 7 semanas; semana vazia (`-`); modalidades 5x2 e 6x1. 62. Serialização só inclui campos do tipo ativo e sempre `v=1`. 63. Rascunho parcial é serializado e restaurado (RF35). 64. Nome com acentos, emoji, espaço, `&`, `=`, `#`, `%`, `+`, aspas e `<script>` faz round-trip e continua texto. 65. Nome com 41+ caracteres é cortado e gera `name_truncated`. 66. Nome com caracteres de controle é limpo. 67. Sem query: rascunho vazio, sem `issues`. 68. Sem `v`, `v=0`, `v=2`, `v=abc`: `unknown_version`, rascunho vazio. 69. Data `2026-02-30`, `2026-13-01`, `abc`, vazia: `invalid_field`, demais campos aproveitados. 70. `c` inválido; `s` inválido; `s` presente com `c=24x48` ignorado. 71. `w=0`, `w=8`, `w=abc`. 72. `p` com dígito 7, letras, quantidade de semanas diferente de `w`, dias repetidos: `inconsistent_pattern`. 73. `p` com folgas acima do limite da modalidade é rejeitado (RF14). 74. Parâmetros duplicados: vale o primeiro (comportamento definido). 75. Parâmetros desconhecidos são ignorados e removidos na próxima serialização. 76. Query muito longa é limitada e não quebra. 77. `serializeSchedule` preserva `pathname` e hash existentes (usado pelo hook). 78. Compatibilidade (RF39): link v1 fixo em fixture continua gerando o mesmo rascunho (teste de regressão congelado).

**`useTextSize.spec.ts`** 79. Inicia em 100 sem preferência. 80. Restaura valor guardado; ignora valor inválido ("abc", 90, 300). 81. Aumentar/diminuir em passos de 25; limites 100 e 200 desabilitam a ação e informam o motivo (RF50). 82. "Tamanho padrão" volta a 100. 83. Aplica o percentual no `<html>` e limpa ao desmontar. 84. Persiste a cada mudança; armazenamento que lança erro não quebra e funciona sem lembrar (RF51). 85. Dispara `text_size_changed` com o nível (mesmo valor repetido não dispara). 86. Mensagem "Texto em 150%".

**`useMetricsConsent.spec.ts` e `consent.service.spec.ts`** 87. Estado inicial `unknown` sem preferência; `granted`/`denied` quando guardado. 88. GPC ativo: `denied`, sem banner, nada carregado (RF60). 89. `accept` persiste e habilita o analytics; `refuse` persiste e não habilita. 90. Revogar após aceitar desabilita, define `ga-disable` e apaga cookies `_ga*`. 91. Armazenamento indisponível: vale na visita; `unknown` na próxima. 92. Valor inválido no storage é tratado como `unknown`.

**`analytics.service.spec.ts` (criticidade alta)** 93. Desabilitado: `track` não injeta script, não cria `dataLayer`, não lança. 94. Habilitado: injeta `gtag.js` uma única vez e configura com os parâmetros fixados. 95. `page_view` enviado uma vez por visita com `has_schedule` correto. 96. Todo payload usa `page_location` sem query e `page_title` fixo, mesmo com nome e query presentes. 97. Teste de contrato: nenhuma chave/valor contém nome, datas, folgas ou a URL do rascunho. 98. `onerror` do script e exceção em `gtag` são engolidos (RF61). 99. Sem `VITE_GA_MEASUREMENT_ID`: no-op. 100. Revogação após carga bloqueia eventos seguintes.

**`analytics.events.spec.ts`** 101. `schedule_completed` para plantão (variant `12x36-night`, `weeks: 0`) e semanal (`6x1`, `weeks: 7`). 102. `schedule_shared` com cada método; `text_size_changed` com cada nível.

**`share-link.spec.ts`** 103. Share nativo: chama `navigator.share` com título, texto (com nome) e URL → `'native'`. 104. Sem nome: texto sem o nome. 105. `AbortError` → `'cancelled'`, sem cair para a cópia. 106. Outro erro do share → tenta a cópia. 107. Sem `navigator.share` → `clipboard.writeText` → `'clipboard'`. 108. `canShare` falso → cópia. 109. Clipboard ausente ou rejeitado → `'manual'`.

**`safe-storage.spec.ts`** 110. Lê/escreve normalmente; `getItem` e `setItem` que lançam caem para memória; memória não vaza entre testes.

### Testes de integração

Renderizados com `vitest-browser-react` (Chromium real); só o que é externo é substituído (relógio, `navigator.share`/clipboard, injeção do GA4 e `localStorage` quebrado). Cada teste monta o próprio cenário e a própria URL (`history.replaceState` em `beforeEach`).

**Componentes isolados**

1. `ScheduleTypeSelector`: duas opções, uma selecionada por vez; descrição faz parte do nome acessível (RF01); trocar tipo exibe só os campos do tipo (RF02); navegação por setas.
2. `ReferenceDateField`: digitar `26/11/2026` seleciona; incompleta/inválida mostra erro em texto com `role="alert"` associado ao campo sem apagar o digitado (RF05); popup abre/fecha com Esc e devolve o foco ao campo; locale pt-BR.
3. `ShiftForm`: turno só aparece em 12x36 e é obrigatório; trocar para 24x48 esconde o turno; preenche o rascunho.
4. `WeeklyForm`: modalidade; quantidade 1–7 (padrão 1); marcar folgas; limite atingido desabilita os demais com motivo em texto; semana incompleta indicada por texto/ícone e anunciada (RF15); aviso ao trocar a modalidade (RF20); reduzir/aumentar semanas.
5. `ScheduleNameField`: limite de 40; aviso de privacidade visível e associado (`aria-describedby`).
6. `MonthPreview`: cabeçalho com mês/ano pt-BR; botões "Mês anterior"/"Próximo mês"; "Voltar ao mês atual" só fora do mês atual (RF29); hoje destacado com marcador não só de cor; cada estado com ícone/texto; legenda lista só os estados existentes e explica a saída do plantão (RF26); `DayCell` com nome acessível completo; tocar em um dia não altera a escala (RF31); sem escala completa mostra orientação (RF03).
7. `MonthSummary`: frase correta, `role="status"`, anunciada ao mudar de mês ou escala; substituída pela orientação quando incompleta.
8. Layout: container estreito ou fonte ampliada → lista; largo → grade de 7 colunas; mesmos nomes, ícones e legenda nas duas formas (RF52–RF53).
9. `ShareButton`: desabilitado com escala incompleta (RF46); com `navigator.share` chama o menu; sem ele copia e mostra "Link copiado" em `role="status"`; falha ao copiar mostra campo selecionável com o link; cancelamento não mostra nada nem rastreia.
10. `TextSizeControl`: rótulos acessíveis, nível exibido e anunciado, limites com motivo.
11. `ConsentBanner`: aparece sem escolha; botões "Aceitar métricas"/"Recusar métricas" com mesmo peso; some após escolher; não aparece com escolha guardada nem com GPC; não prende o foco; escolher devolve o foco a ponto lógico (RF64–RF65).
12. `PrivacyDialog`: abre sem perder a escala, fecha com Esc devolvendo foco ao link; alternância das métricas com estado visível e anunciado; texto cita Google, cookies, o que nunca é coletado e que a escala fica só no link (RF62).
13. `ConfigNotice`: mostra a mensagem por `issues`, com `role="alert"`; some quando não há problemas.

**`HomeView` (integração entre módulos reais)** 14. Fluxo plantão: escolher tipo → data → 12x36 → turno → preview preenchido, legenda e resumo corretos para o mês atual (relógio fixo em 26/11/2026). 15. Fluxo semanal em rodízio: modalidade → semanas → folgas → âncora; o preview muda a cada folga marcada (US7, RF30). 16. A URL é atualizada a cada alteração com `replaceState` e `history.length` não cresce (RF38); o botão "voltar" não percorre marcações. 17. Abrir com URL válida restaura formulário e preview idênticos (RF36), sem nenhum preenchimento adicional. 18. Abrir com URL inválida/versão desconhecida mostra aviso, formulário utilizável e aproveita campos válidos (RF37, US18). 19. Reancoragem: alterar a data de referência recalcula o preview e a URL (US20). 20. Receber link: ajustar a configuração não altera o link original (RF47). 21. Nome aparece no topo do preview e no `document.title`; sem nome, título padrão (RF42). 22. Navegação de meses sem limite, voltar ao mês atual (US8). 23. Métricas: com consentimento, completar a escala dispara um único `schedule_completed`; mudar marcações não repete; mudar modalidade repete (RF57); aceitar o consentimento depois de completar envia o evento pendente; recusar nada envia. 24. Nenhum payload de analytics contém nome, datas ou query (RF58). 25. Com o GA4 bloqueado (script falha), a tela funciona sem erro no console (RF61). 26. Texto a 200% muda o preview para lista e não há rolagem horizontal. 27. Tema escuro e claro renderizam (`prefers-color-scheme` emulado) sem perder estados.

### Testes E2E

Playwright (`e2e/`, projeto Chromium, sobre o build de produção com React Compiler, `baseURL` `http://localhost:4173/escala-certa/`). Cada teste prepara os próprios dados via URL, intercepta `googletagmanager.com` e `google-analytics.com` com `page.route` filtrando pelo hostname (o glob `**/googletagmanager.com/**` não casa com o subdomínio `www.` e deixaria a requisição passar), sem nunca chamar o Google de verdade; o build dos E2E usa um `VITE_GA_MEASUREMENT_ID` fictício e verifica `page_location`/`page_title` no `dataLayer`, já que o `gtag.js` real não é carregado e fixa o relógio com `page.clock`. Substitui o `home.spec.ts` do placeholder.

1. `schedule-shift.spec.ts`: plantonista configura 12x36 noturno em < 1 min e vê hoje, legenda e resumo (US1–US3); a URL reflete a escala; recarregar a página restaura (US10).
2. `schedule-weekly.spec.ts`: comerciário em rodízio de 4 semanas marca folgas conferindo o preview e informa a âncora; aviso de semana incompleta (US6, US7, US19).
3. `schedule-reopen.spec.ts`: abrir link salvo antigo abre no mês atual com hoje destacado (US17); abrir link editado à mão mostra aviso com formulário utilizável (US18).
4. `schedule-share.spec.ts`: com `navigator.share` simulado, o menu recebe link e texto com o nome; sem ele, copia e anuncia "Link copiado"; destinatário abre o link, vê o nome, ajusta e a URL muda (US11, US12).
5. `month-navigation.spec.ts`: navegar para meses distantes, voltar ao atual, verificar resumo e estados (US8, US9).
6. `text-size.spec.ts`: aumentar até 200% (lembrado após recarregar), preview em lista, sem rolagem horizontal em 320 px e com zoom equivalente a 400% (US14, US15).
7. `consent-analytics.spec.ts`: antes do aceite, nenhuma requisição ao Google e nenhum cookie `_ga`; após "Aceitar métricas", `page_view` e eventos saem com `dl` (page_location) sem query e `dt` fixo, e nada contém nome ou datas; "Recusar" e GPC (`extraHTTPHeaders`/propriedade `globalPrivacyControl`) mantêm zero requisições; revogar pelo texto de privacidade interrompe o envio e apaga cookies; GA bloqueado não gera erro visível.
8. `privacy.spec.ts`: abrir "Privacidade" sem perder a escala, fechar com Esc, alternar métricas.
9. `accessibility.spec.ts`: varredura `@axe-core/playwright` (tags `wcag2a`, `wcag2aa`, `wcag22aa`) em estados vazio, plantão, semanal, lista, banner aberto, diálogo de privacidade, nos temas claro e escuro; navegação completa por teclado (ordem de foco, sem armadilha, Esc nos popups); `prefers-reduced-motion`; áreas de toque ≥ 24×24 px.
10. `performance.spec.ts`: o preview reflete uma alteração em < 100 ms (medição com `performance.now` em torno do evento) e a página fica utilizável com throttling de CPU/rede equivalente a 4G intermediário em < 3 s.

## Sequenciamento do desenvolvimento

### Ordem de construção

1. **Fundação:** `@internationalized/date` como dependência direta; `types/schedule.ts`, `schedule.constants.ts`, `date.utils.ts` + testes (tudo depende deles; é a parte de maior risco de fuso).
2. **Domínio de ciclos:** `shift-cycle`, `weekly-pattern`, `day-state`, `config` + testes (regras de maior criticidade, sem UI).
3. **Mês e textos:** `month`, `day-name`, `summary` + testes.
4. **Codec da URL:** `schedule-url.v1` e `schedule-url.utils` + fixture congelada de compatibilidade (RF39 não pode mudar depois).
5. **Infra e serviços:** `safe-storage`, `share-link`, `analytics.events`, `analytics.service` (no-op por padrão), `consent.service` + testes. Alinhado à decisão de manter o ponto único de eventos desde o início; o GA4 só é ligado na etapa final.
6. **Hooks:** `useScheduleConfig`, `useMonthNavigation`, `useTextSize`, `useMetricsConsent` + testes.
7. **Componentes shadcn necessários** (via CLI, estilo `aria-nova`): botão (existe), campos de texto/data, radio, seleção, toggle, diálogo; sem editar os gerados.
8. **Componentes de apresentação** (de baixo para cima): `ReferenceDateField` → `ShiftForm`/`WeeklyForm` → `MonthPreview` → `ShareButton`, `TextSizeControl`, `ConfigNotice` → `PrivacyDialog`, `ConsentBanner`.
9. **`HomeView` e `App.tsx`:** composição, remoção do `HelloWorld`, testes de integração, I18nProvider pt-BR.
10. **E2E e acessibilidade:** substituir `e2e/home.spec.ts`, adicionar `@axe-core/playwright`.
11. **Etapa final de lançamento:** criar a propriedade e o fluxo de dados do GA4, configurar o console (retenção, Enhanced Measurement, dimensões), definir `VITE_GA_MEASUREMENT_ID` no GitHub, inspecionar uma requisição real, revisão de privacidade/LGPD (item do `TODO.md`) e merge `dev` → `main`.

### Dependências técnicas

- **Pacotes:** `@internationalized/date` (hoje só transitivo) e `@axe-core/playwright` (dev).
- **Infraestrutura:** propriedade e fluxo de dados web do GA4 e o ID de medição (só na etapa final); variável `VITE_GA_MEASUREMENT_ID` em `.env.example`, `.env.local` e no workflow `deploy.yml` (variável do repositório, não segredo).
- **Pastas novas:** `src/domain/` (ver Principais decisões), `src/lib/`, `src/services/`, `src/hooks/`, `src/types/`, `src/views/`.
- **Regra do projeto:** atualizar `.agents/rules/folder-structure.md` com `src/domain/` e usar `pnpm lint`, `pnpm build` e `pnpm test:coverage` ao fim de cada task.

## Monitoramento e observabilidade

Não há backend nem Prometheus/Grafana. A observabilidade do produto é feita pelo **GA4** (eventos da tabela `AnalyticsEvent`), consultados no próprio console, e cobre as métricas do PRD: acessos e proporção com escala (`page_view.has_schedule`), tipos de escala e padrão semanal (`schedule_completed`), compartilhamento por forma (`schedule_shared.method`), leitura ampliada (`text_size_changed.level`) e dispositivo (relatório padrão de categoria de dispositivo). As contagens são tendências, não totais, porque quem recusa e os bloqueadores reduzem os registros.

Logs: nenhum log em produção; `console.warn` apenas em desenvolvimento para falhas de carga do GA4. Erros de serviço externo nunca aparecem para a pessoa (RF61). Verificação operacional no lançamento: inspecionar uma requisição `collect` real (sem query em `dl`, `dt` fixo) e conferir as configurações do console descritas em "Parâmetros fixados".

## Considerações técnicas

### Principais decisões

- **Estado na query string versionada (`?v=1&…`)**: legível, validável campo a campo (RF37) e estável (RF39). Descartados: hash (previews e apps de mensagem podem descartá-lo) e codificação binária/base64 (ilegível e difícil de manter compatível). Trade-off: o link passa por logs do servidor de hospedagem; o PRD já informa que o nome é visível a quem recebe.
- **GA4 com consentimento, em vez de serviço sem cookies**: decisão do produto nesta rodada (PRD atualizado: RF55–RF65, LGPD por consentimento). Mitigações técnicas: script só após aceite, `page_location`/`page_title` sobrescritos, `page_view` manual, sinais de publicidade desligados, GPC como recusa, revogação com limpeza de cookies. Alternativa descartada: GoatCounter/Plausible (sem banner), por escolha do produto.
- **`@internationalized/date` + `Date.UTC` para diferenças de dias**: elimina horário de verão/fuso (restrição "Datas" do PRD). Descartado: `Date` local com subtração de milissegundos.
- **Grade própria + `DateField`/`DatePicker` do react-aria**: o preview é somente leitura com nomes e estados customizados (o `Calendar` do react-aria é interativo). `DateField` é segmentado (dd/mm/aaaa); confirmar com usuários que atende "campo digitável".
- **Grade/lista por container query em `rem`**: reage ao texto ampliado de qualquer origem sem JavaScript. Risco de calibração do ponto de corte (ver riscos).
- **Efeitos só para sistemas externos; `replaceState`/`track`/`share` em handlers**: segue a skill `react-patterns` e evita laços e eventos duplicados.
- **Plantão e semanal mantidos no mesmo rascunho**: alternar o tipo não perde o que a pessoa digitou; só o tipo ativo vai na URL.
- **Desvio de padrão — nova pasta `src/domain/schedule/`:** `folder-structure.md` não prevê onde fica a regra de negócio compartilhada; `lib/` é "sem regra de negócio" e `services/` é "acesso ao backend". Alternativa conforme: dividir o domínio entre `types/` e `lib/`, o que mistura regra e utilitário genérico. Proposta: criar `src/domain/` e atualizar o `folder-structure.md` na primeira task. **Requer sua aprovação.**
- **Classificação de `share-link` e `safe-storage` em `lib/` e de `analytics`/`consent` em `services/`:** os dois primeiros são utilitários genéricos de navegador; os dois últimos falam com serviço externo (GA4).
- **Aderência aos limites do lint:** funções ≤ 30 linhas, arquivos ≤ 100, ≤ 3 parâmetros (objetos como `BuildMonthParams`, `ShareParams`), constantes nomeadas, sem comentários, sem `useMemo`/`useCallback`/`memo`.

### Riscos conhecidos

| Risco                                                                                                | Mitigação                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `page_location`/`page_title` ou `page_view` automático vazarem nome/datas para o Google              | Sobrescrever em todo envio, `send_page_view: false`, Enhanced Measurement desligado, teste E2E que lê a requisição `collect` e teste de contrato do payload. |
| Configurações do GA4 no console (retenção, Signals) divergirem do que o texto de privacidade promete | Checklist na etapa final e revisão do texto de privacidade com o que foi configurado.                                                                        |
| LGPD: validade do consentimento e transferência internacional para o Google                          | Item no `TODO.md`; revisão jurídica antes do lançamento; banner com botões de igual peso e revogação simples.                                                |
| Ponto de corte grade→lista inadequado (7 colunas apertadas ou lista cedo demais)                     | Calibrar com testes visuais em 320–1280 px e texto 100–200%; constante única ajustável.                                                                      |
| `DateField` segmentado não ser entendido como "campo digitável"                                      | Testes de usabilidade; fallback para campo de texto com máscara mantendo `DatePicker`.                                                                       |
| `navigator.share` com suporte irregular e exigência de gesto                                         | `canShare` + alternativas obrigatórias (RF44–RF45) cobertas por testes.                                                                                      |
| `replaceState` e navegação "voltar" em navegadores móveis                                            | Teste de integração e E2E sobre o histórico.                                                                                                                 |
| Evolução do formato da URL quebrar links antigos                                                     | Versão `v` obrigatória, codec por versão e fixture congelada de compatibilidade.                                                                             |
| Datas extremas (ano 1900/2199) e meses muito distantes degradarem a UI                               | Intervalo aceito para a data de referência; navegação ilimitada só depende de aritmética, coberta por testes.                                                |
| Cobertura cair por ramos de erro de armazenamento/GA4                                                | Testes específicos com `localStorage` e script falhando (casos 84, 91, 98).                                                                                  |

### Conformidade com skills

- **`react-patterns`** (`.agents/skills/react-patterns/SKILL.md`): obrigatória antes de qualquer implementação em `src/` — componentes pequenos e funcionais, efeitos só para sistemas externos, `key`, `useId`, acessibilidade, Tailwind, formulários, `<title>` do React 19.
- **`executar-task`**, **`criar-tasks`**, **`executar-qa`**, **`executar-review`**, **`executar-bugfix`**: fluxo de implementação a partir desta TechSpec.
- **`find-docs`** (Context7): consultar a documentação de `react-aria-components`/`@internationalized/date` e do `gtag.js` na implementação.
- **`impeccable`**: direção visual da interface (hierarquia, tipografia, estados) nos componentes de apresentação.
- Regras do projeto verificadas: `.agents/rules/code-standards.md`, `tests.md`, `folder-structure.md`, `javascript-typescript.md` (não há `.claude/rules` neste repositório).

### Arquivos relevantes e dependentes

- `tasks/prd-escala-certa/prd.md` (atualizado nesta rodada: funcionalidade 9, RF51, restrições e fora do escopo)
- `TODO.md` (item de LGPD atualizado)
- `src/App.tsx`, `src/App.spec.tsx`, `src/main.tsx`, `src/index.css`
- `src/components/HelloWorld/` (removido), `src/components/ui/button.tsx`, `src/lib/utils.ts`
- `vite.config.ts` (`base: '/escala-certa/'`, React Compiler, `optimizeLocales` só pt-BR), `vitest.config.ts` (browser mode, limiares de 80%), `playwright.config.ts`, `.oxlintrc.json`, `tsconfig.app.json`
- `e2e/home.spec.ts` (substituído), `.github/workflows/deploy.yml` (variável `VITE_GA_MEASUREMENT_ID`), `.husky/pre-push`
- `.agents/rules/folder-structure.md` (acrescentar `src/domain/`), `.env.example` (novo), `package.json`
