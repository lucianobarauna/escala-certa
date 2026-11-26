---
name: escala-certa
created: 2026-10-29
updated: 2026-11-26
status: active
revisions: 4
---

# Brainstorm: Escala Certa — preview visual de escalas de trabalho que se repetem

## Context

Quem trabalha em escala que se repete tem dificuldade de visualizar como ela cai no calendário dos próximos meses. Isso vale para dois perfis:

- **Plantão** no modelo brasileiro (12x36, 24x48, 24x72), comum em saúde, segurança e portaria.
- **Escala semanal** (5x2 e 6x1), predominante no comércio, em serviços e em parte da saúde. Pode ter folgas fixas (ex.: segunda a sexta, ou terça a sábado) ou um rodízio de folgas que se repete a cada algumas semanas, montado pela empresa para que a folga caia no domingo periodicamente.

Hoje a resposta vem de perguntar a uma IA, que devolve listas de datas em texto — lentas de ler e difíceis de cruzar com feriados, fins de semana e compromissos. O público é quem consulta a própria escala com frequência para responder perguntas como "trabalho no Natal?" ou "consigo marcar algo no dia 15?".

Na escala semanal, um ciclo de 5x2 ou 6x1 sempre cai nos mesmos dias da semana; o que varia entre empresas é o rodízio de folgas ao longo de algumas semanas. As regras legais do domingo (Lei 10.101/2000, art. 6º: ao menos um domingo a cada três semanas no comércio; art. 386 da CLT: domingo quinzenal para mulheres, conforme jurisprudência; além de convenções coletivas e normas municipais) variam e não determinam onde caem as demais folgas — o padrão real é definido por cada empregador.

O valor está em olhar para frente no tempo de forma visual; o cálculo em si é simples. O projeto é um app web de página única, partindo de um scaffold vazio.

## Constraints

### Hard Constraints

- Sem backend e sem login: todo o cálculo acontece no navegador, compatível com hospedagem estática.
- Acessível: navegação completa por teclado, compatível com leitor de tela, estados que não dependem só de cor e contraste mínimo WCAG AA.
- Acessível para baixa visão: a interface respeita o tamanho de fonte configurado no navegador ou no sistema e continua utilizável com texto ampliado até 200% e zoom até 400%, sem cortar ou sobrepor conteúdo e sem rolagem horizontal. Os indicadores de estado e o foco visível têm contraste mínimo de 3:1 com o fundo.
- Somente escalas que se repetem na primeira versão: plantão (12x36 diurno e noturno, 24x48, 24x72) e escala semanal (5x2 e 6x1) com padrão de folgas de 1 a 7 semanas.
- O app não valida regras trabalhistas: exibe o padrão informado pela pessoa.
- Interface em português do Brasil, com semana começando no domingo.

### Soft Constraints

- Pensado primeiro para celular.
- Nada é salvo no dispositivo; a única forma de "lembrar" a escala é o próprio link.
- Marcação por dia, sem horários dos turnos.

## Success Criteria

- A pessoa responde sozinha "trabalho no dia X?" em poucos segundos, sem recorrer a uma IA.
- Quem tem escala semanal com rodízio de folgas consegue descrevê-la uma única vez, a partir da escala que recebe da empresa, e conferir o resultado no próprio preview.
- Quem usa leitor de tela ou só teclado consegue obter a mesma resposta e entender o padrão do mês.
- Quem tem baixa visão consegue ler o calendário e a legenda com a fonte ampliada, inclusive no celular, sem perder informação.
- Reabrir a escala exige só abrir um link salvo, sem preencher nada de novo.
- A pessoa envia a própria escala para outra pessoa (família, colega) em poucos toques, e quem recebe o link identifica de quem é a escala e vê o mesmo preview.

## Alternatives Considered

- **Campo de data + calendário de preview + link que lembra + resumo em texto, com escala semanal como padrão de N semanas** — selected (rationale in Decision below)
- **Somente escalas de plantão, escala semanal adiada** — rejected: deixa de fora o comércio, que concentra boa parte de quem trabalha em escala.
- **Escala semanal só com folgas fixas (padrão de uma semana)** — rejected: exclui justamente quem tem rodízio de folgas, o caso mais comum no comércio.
- **Folga fixa + folga que avança um dia por semana, gerada automaticamente** — rejected como modelo principal: só atende um formato de rodízio, sem evidência de que seja o predominante; mantida como possível atalho de preenchimento.
- **Entrada pela regra do domingo ("folgo no domingo a cada X semanas")** — rejected: a regra não determina onde caem as demais folgas, então o app teria de inventar o rodízio.
- **Marcar as folgas direto no calendário de preview** — rejected: o mesmo gesto passa a ter dois significados (marcar ou consultar), difícil de comunicar de forma acessível.
- **Escala livre marcada dia a dia no mês** — rejected: exige remarcar a cada mês, contrariando o critério de reabrir só pelo link.
- **Dois calendários visíveis (um para escolher, um para o preview)** — rejected: no celular obriga a rolar entre as duas grades e dobra a navegação por teclado e leitor de tela.
- **Calendário único (toca no dia de início direto no preview)** — rejected: o mesmo gesto passa a ter dois significados (definir início ou só consultar), o que confunde e é difícil de comunicar de forma acessível.
- **Pergunta direta "Trabalho no dia \___?" como interface principal** — rejected como núcleo: perde a visão geral do mês; adiada como extensão.
- **Compartilhar apenas copiando o endereço da barra do navegador** — rejected: depende de a pessoa saber que o link guarda a escala e é pouco prático no celular; quem recebe não sabe de quem é a escala.
- **Exportar a escala para a agenda do celular (.ics)** — rejected por agora: elimina a experiência visual que é o centro do produto; boa extensão futura.

## Decision

**Chosen Direction:** Campo de data + calendário de preview + link que lembra + resumo em texto, com escala semanal como padrão de N semanas

**Why this over the others:** Um campo de data digitável (com calendário em popup como atalho) é a entrada mais rápida tanto para quem toca na tela quanto para quem usa teclado ou leitor de tela, e deixa o calendário de preview visível sem rolagem no celular. Guardar a escala no link elimina o retrabalho de reconfigurar a cada consulta. Tratar a escala semanal como um padrão de folgas de 1 a 7 semanas que se repete a partir de uma data cobre folga fixa, rodízio de 5x2 e rodízio de 6x1 com um único modelo, sem embutir regras trabalhistas que variam por categoria e região — o fator decisivo contra a alternativa só de folgas fixas, que deixaria de fora o comércio com rodízio.

**Como a tela funciona:**

- Entrada: tipo de escala — **plantão** ou **semanal**.
  - Plantão: data de início do primeiro plantão (campo digitável com popup) e escala (12x36, 24x48, 24x72). Só no 12x36 aparece a escolha do turno: diurno ou noturno.
  - Semanal: modalidade (5x2 ou 6x1), quantidade de semanas do padrão (1 a 7), os dias de folga de cada semana do padrão e a data em que a semana 1 do padrão começa. Com uma semana, o caso de folgas fixas se resume a escolher os dias de folga. O limite de 7 semanas cobre o rodízio de 6x1 em que a folga avança um dia por semana e volta ao domingo a cada sete semanas.
- O preview fica visível junto da entrada e se atualiza a cada marcação, para a pessoa conferir o resultado com a escala que recebe da empresa.
- Preview: calendário mensal com legenda visível e os estados aplicáveis à escala:
  - **Trabalha** — dia de trabalho; no plantão, dia em que o plantão começa.
  - **Saída do plantão** — dia em que o plantão termina, pela manhã. Existe nas escalas de 24h e no 12x36 noturno; não existe no 12x36 diurno nem na escala semanal.
  - **Em casa** — folga.
- Cada estado tem cor, ícone ou texto, e cada dia tem um nome acessível completo (ex.: "15 de novembro, trabalha").
- Navegação entre meses por botões de mês anterior e próximo mês; sem depender de gesto de deslizar.
- Controle de tamanho do texto visível na própria página (diminuir, restaurar padrão e aumentar), com rótulos acessíveis e o tamanho atual anunciado, para quem não sabe ou não consegue usar o zoom do navegador ou do sistema. Ele soma ao tamanho de fonte configurado pelo usuário, sem substituí-lo.
- Com fonte ampliada, o calendário se reorganiza em vez de encolher o texto: as células crescem junto com a fonte e, quando a grade de 7 colunas não couber na largura da tela, o mês passa a ser exibido como lista de dias, mantendo os mesmos estados, ícones e legenda. A marcação das folgas do padrão semanal segue o mesmo princípio.
- Abaixo do calendário, um resumo do mês exibido (ex.: "Novembro: 22 dias trabalhando, 8 dias em casa"), anunciado a leitores de tela quando o mês ou a escala mudam.
- Toda a configuração da escala fica refletida no endereço da página; abrir o link restaura o preview.
- Nome opcional da escala (ex.: "Escala da Ana"), exibido no topo do preview e incluído no link, para identificar de quem é a escala ao reabrir ou ao receber de outra pessoa. Junto ao campo, um aviso visível informa que o nome vai no link.
- Ação **Compartilhar escala**: no celular, abre o menu de compartilhamento nativo do sistema; onde ele não existe, copia o link. A confirmação ("Link copiado") é exibida e anunciada a leitores de tela. Quem recebe o link vê a mesma tela, com o mesmo preview, e pode ajustar a configuração sem afetar o link original.

**Trade-offs Accepted:**

- O seletor de data deixa de ser um calendário sempre visível e vira um popup — aceitável porque o ganho em celular e acessibilidade é maior.
- A entrada da escala semanal com rodízio é mais trabalhosa que a do plantão (até 7 semanas de folgas a marcar) — aceitável porque é feita uma vez e o link a preserva; é a parte da interface que mais exige cuidado de acessibilidade e de uso com fonte ampliada.
- O app não alerta quando o padrão informado contraria regras do domingo — aceitável porque essas regras variam por categoria, gênero, convenção coletiva e município, e validar errado seria pior que não validar.
- Nomes acessíveis por dia, resumo do mês e estado no link são lógica adicional a testar — aceitável porque sustentam diretamente os critérios de sucesso.
- Suportar fonte ampliada exige uma forma alternativa de exibir o mês (lista de dias) quando a grade não cabe — aceitável porque uma grade de 7 colunas com texto a 200% num celular corta ou sobrepõe conteúdo.
- O dia de "saída do plantão" é tratado como um dia inteiro, embora a pessoa chegue em casa pela manhã — aceitável enquanto o produto não modela horários.
- O nome da escala, quando preenchido, viaja no link e pode ficar no histórico de conversas e em pré-visualizações de link — aceitável porque o campo é opcional, não exige nome real e a interface avisa disso; o link não carrega nenhum outro dado pessoal.
- Quem recebe escala mensal sem padrão, ou só conhece as folgas da semana atual, não é atendido — aceitável porque nenhum modelo de repetição cobre esse caso sem remarcação mensal.

**Key Assumption:** A escala real da pessoa se repete sem interrupções a partir da referência informada — data de início do plantão ou início do padrão semanal — e quem tem rodízio de folgas consegue reconstruir o padrão completo a partir da escala que recebe da empresa.

## Open Questions

- [ ] A definir: Como lidar com trocas de plantão, férias e mudanças de escala que quebram o ciclo? Por ora, a saída é informar uma nova referência.
- [ ] A definir: A âncora do padrão semanal é mais natural como "a semana 1 começa em [data]" ou como "esta semana é a semana \_\_ do padrão"?
- [ ] A definir: Oferecer um atalho de preenchimento para o rodízio em que a folga avança um dia por semana, se esse formato se mostrar comum?
- [ ] A definir: Atender escalas mensais sem padrão, montadas à mão pela empresa?
- [ ] A definir: Quando incluir a pergunta direta "Trabalho no dia ___?" para datas distantes.
- [ ] A definir: Vale exportar a escala para a agenda do celular (.ics) numa versão futura?
- [ ] A definir: Destacar feriados nacionais no preview?
- [ ] A definir: O tamanho de texto escolhido no controle deve ser lembrado entre visitas? Recomendação: sim, como preferência do dispositivo — é ajuste de leitura, não dado da escala, e obrigar quem tem baixa visão a reajustar a cada visita é uma barreira.

## Revision History

### 2026-11-26 — Pivot

**From:** Campo de data + calendário de preview + link que lembra + resumo em texto, restrito a escalas de plantão (12x36, 24x48, 24x72).
**To:** A mesma direção, ampliada com escala semanal (5x2 e 6x1) modelada como padrão de folgas de 1 a 7 semanas que se repete a partir de uma data.
**Trigger:** Pedido para incluir a 5x2, dada a quantidade de pessoas no comércio. Pesquisa mostrou que 5x2 e 6x1 não são ciclos dependentes de data de início, e sim padrões semanais, com rodízio de folgas que se repete e é definido por cada empregador.
**Trade-offs reassessed:** A entrada fica mais pesada para quem tem rodízio, o que desloca o maior risco de acessibilidade para a marcação das folgas. O app deixa explícito que não valida regras trabalhistas. Escala mensal sem padrão fica fora. Desafio sobre a premissa de que a pessoa conhece o padrão completo: a direção se mantém porque o padrão está na escala que a pessoa já recebe, desde que o preview se atualize junto da entrada para servir de conferência.

### 2026-11-26 — Pivot

**From:** Direção com link que lembra a escala apenas para a própria pessoa.
**To:** A mesma direção, com ação explícita de compartilhar a escala e nome opcional que identifica de quem ela é.
**Trigger:** O link já carregava a escala inteira, mas compartilhá-lo dependia de copiar o endereço manualmente e quem recebia não sabia de quem era a escala; combinar folgas com família e colegas é um uso real de quem trabalha em escala.
**Trade-offs reassessed:** Entra um dado pessoal opcional no link, mitigado por ser opcional e avisado na interface. Quem recebe pode alterar a configuração livremente, o que não afeta o link original porque nada é salvo.
