---
name: escala-certa
created: 2026-10-29
updated: 2026-10-29
status: active
revisions: 2
---

# Brainstorm: Escala Certa — preview visual de escalas de ciclo fixo

## Context

Quem trabalha em escala de ciclo fixo no modelo brasileiro (12x36, 24x48, 24x72) tem dificuldade de visualizar como a escala cai no calendário dos próximos meses. Hoje a resposta vem de perguntar a uma IA, que devolve listas de datas em texto — lentas de ler e difíceis de cruzar com feriados, fins de semana e compromissos. O público inicial é exatamente esse perfil: alguém que consulta a própria escala com frequência para responder perguntas como "trabalho no Natal?" ou "consigo marcar algo no dia 15?".

O valor está em olhar para frente no tempo de forma visual; o cálculo do ciclo em si é simples. O projeto é um app web de página única, partindo de um scaffold vazio.

## Constraints

### Hard Constraints

- Sem backend e sem login: todo o cálculo acontece no navegador, compatível com hospedagem estática.
- Acessível: navegação completa por teclado, compatível com leitor de tela, estados que não dependem só de cor e contraste mínimo WCAG AA.
- Acessível para baixa visão: a interface respeita o tamanho de fonte configurado no navegador ou no sistema e continua utilizável com texto ampliado até 200% e zoom até 400%, sem cortar ou sobrepor conteúdo e sem rolagem horizontal. Os indicadores de estado e o foco visível têm contraste mínimo de 3:1 com o fundo.
- Somente escalas de ciclo fixo na primeira versão: 12x36 (diurno e noturno), 24x48 e 24x72.
- Interface em português do Brasil, com semana começando no domingo.

### Soft Constraints

- Pensado primeiro para celular.
- Nada é salvo no dispositivo; a única forma de "lembrar" a escala é o próprio link.
- Marcação por dia, sem horários dos turnos.

## Success Criteria

- A pessoa responde sozinha "trabalho no dia X?" em poucos segundos, sem recorrer a uma IA.
- Quem usa leitor de tela ou só teclado consegue obter a mesma resposta e entender o padrão do mês.
- Quem tem baixa visão consegue ler o calendário e a legenda com a fonte ampliada, inclusive no celular, sem perder informação.
- Reabrir a escala exige só abrir um link salvo, sem preencher nada de novo.

## Alternatives Considered

- **Campo de data + calendário de preview + link que lembra + resumo em texto** — selected (rationale in Decision below)
- **Dois calendários visíveis (um para escolher, um para o preview)** — rejected: no celular obriga a rolar entre as duas grades e dobra a navegação por teclado e leitor de tela.
- **Calendário único (toca no dia de início direto no preview)** — rejected: o mesmo gesto passa a ter dois significados (definir início ou só consultar), o que confunde e é difícil de comunicar de forma acessível.
- **Pergunta direta "Trabalho no dia \___?" como interface principal** — rejected como núcleo: perde a visão geral do mês; adiada como extensão.
- **Exportar a escala para a agenda do celular (.ics)** — rejected por agora: elimina a experiência visual que é o centro do produto; boa extensão futura.

## Decision

**Chosen Direction:** Campo de data + calendário de preview + link que lembra + resumo em texto

**Why this over the others:** Um campo de data digitável (com calendário em popup como atalho) é a entrada mais rápida tanto para quem toca na tela quanto para quem usa teclado ou leitor de tela, e deixa o calendário de preview visível sem rolagem no celular. Guardar data e escala no link elimina o retrabalho de reconfigurar a cada consulta, que é o que mais aproxima o app do critério "responder em segundos". O resumo em texto do mês cobre o ponto fraco da grade para leitores de tela — o fator decisivo contra os dois calendários visíveis, a alternativa mais próxima da ideia original.

**Como a tela funciona:**

- Entrada: data de início do primeiro plantão (campo digitável com popup) e escala (12x36, 24x48, 24x72). Só no 12x36 aparece a escolha do turno: diurno ou noturno.
- Preview: calendário mensal com três estados e legenda visível:
  - **Trabalha** — dia em que o plantão começa.
  - **Saída do plantão** — dia em que o plantão termina, pela manhã. Existe nas escalas de 24h e no 12x36 noturno; não existe no 12x36 diurno.
  - **Em casa** — folga.
- Cada estado tem cor, ícone ou texto, e cada dia tem um nome acessível completo (ex.: "15 de novembro, trabalha").
- Navegação entre meses por botões de mês anterior e próximo mês; sem depender de gesto de deslizar.
- Controle de tamanho do texto visível na própria página (diminuir, restaurar padrão e aumentar), com rótulos acessíveis e o tamanho atual anunciado, para quem não sabe ou não consegue usar o zoom do navegador ou do sistema. Ele soma ao tamanho de fonte configurado pelo usuário, sem substituí-lo.
- Com fonte ampliada, o calendário se reorganiza em vez de encolher o texto: as células crescem junto com a fonte e, quando a grade de 7 colunas não couber na largura da tela, o mês passa a ser exibido como lista de dias, mantendo os mesmos estados, ícones e legenda.
- Abaixo do calendário, um resumo do mês exibido (ex.: "Novembro: 10 dias trabalhando, 10 saídas de plantão, 10 dias em casa"), anunciado a leitores de tela quando o mês ou a escala mudam.
- Data de início, escala e turno ficam refletidos no endereço da página; abrir o link restaura o preview.

**Trade-offs Accepted:**

- O seletor de data deixa de ser um calendário sempre visível e vira um popup — aceitável porque o ganho em celular e acessibilidade é maior.
- Nomes acessíveis por dia, resumo do mês e estado no link são lógica adicional a testar — aceitável porque sustentam diretamente os critérios de sucesso.
- Suportar fonte ampliada exige uma forma alternativa de exibir o mês (lista de dias) quando a grade não cabe — aceitável porque uma grade de 7 colunas com texto a 200% num celular corta ou sobrepõe conteúdo.
- O dia de "saída do plantão" é tratado como um dia inteiro, embora a pessoa chegue em casa pela manhã — aceitável enquanto o produto não modela horários.

**Key Assumption:** A escala real da pessoa segue o ciclo sem interrupções a partir da data de início informada.

## Open Questions

- [ ] A definir: Como lidar com trocas de plantão, férias e mudanças de escala que quebram o ciclo? Por ora, a saída é informar uma nova data de início.
- [ ] A definir: Quando incluir a pergunta direta "Trabalho no dia ___?" para datas distantes.
- [ ] A definir: Quando incluir escalas baseadas na semana (6x1, 5x2), que exigem informar o dia de folga e possivelmente o rodízio de domingos.
- [ ] A definir: Vale exportar a escala para a agenda do celular (.ics) numa versão futura?
- [ ] A definir: Destacar feriados nacionais no preview?
- [ ] A definir: O tamanho de texto escolhido no controle deve ser lembrado entre visitas? Recomendação: sim, como preferência do dispositivo — é ajuste de leitura, não dado da escala, e obrigar quem tem baixa visão a reajustar a cada visita é uma barreira.
