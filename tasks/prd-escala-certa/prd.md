# Documento de Requisitos do Produto (PRD)

## Visão Geral

O Escala Certa é um app web de página única que mostra, num calendário mensal, como uma escala de trabalho que se repete cai nos próximos meses. Atende dois perfis: quem trabalha em **plantão** no modelo brasileiro (12x36 diurno e noturno, 24x48, 24x72), comum em saúde, segurança e portaria, e quem trabalha em **escala semanal** (5x2 e 6x1), predominante no comércio e em serviços, com folgas fixas ou com um rodízio de folgas que se repete a cada 1 a 7 semanas. Hoje essas pessoas perguntam a uma IA e recebem listas de datas em texto, lentas de ler e difíceis de cruzar com fins de semana e compromissos.

O valor está em olhar para frente no tempo de forma visual e responder sozinho, em segundos, perguntas como "trabalho no Natal?" ou "consigo marcar algo no dia 15?". A escala é descrita uma única vez e fica guardada no próprio link, que pode ser reaberto ou enviado para família e colegas. O produto parte da premissa de que a escala real se repete sem interrupções a partir da data de referência informada e de que quem tem rodízio consegue reconstruir o padrão completo a partir da escala que recebe da empresa. O app é acessível por teclado, leitor de tela e para pessoas com baixa visão, e não valida regras trabalhistas: exibe o padrão que a pessoa informa.

## Objetivos

As metas de tempo, compreensão e acessibilidade são verificadas em sessões de teste de usabilidade e em auditorias de acessibilidade. As métricas de uso, coletadas de forma agregada e sem identificar ninguém (funcionalidade 9), complementam os testes e orientam decisões de produto; elas não substituem os testes.

- **Resposta rápida:** com a escala já aberta pelo link, ao menos 90% dos participantes respondem corretamente "trabalho no dia X?" para uma data dos próximos 3 meses em até 10 segundos.
- **Configuração de plantão:** ao menos 90% dos participantes com escala de plantão configuram a própria escala sem ajuda em até 1 minuto.
- **Configuração de rodízio semanal:** ao menos 80% dos participantes com escala semanal de rodízio (4 semanas ou mais) reproduzem a escala que recebem da empresa, sem ajuda, em até 5 minutos, conferindo o resultado no preview.
- **Paridade de acesso:** participantes que usam só teclado ou leitor de tela (VoiceOver no iOS, TalkBack no Android, NVDA no Windows) obtêm a mesma resposta do primeiro objetivo e descrevem o padrão do mês a partir do resumo, com taxa de sucesso igual à dos demais participantes.
- **Baixa visão:** com texto ampliado a 200% e com zoom a 400%, nenhum participante perde informação (estado do dia, legenda, resumo) nem precisa rolar horizontalmente, inclusive no celular.
- **Reabertura:** 100% dos participantes reabrem a própria escala a partir de um link salvo sem preencher nenhum campo.
- **Compartilhamento:** ao menos 90% dos participantes enviam a escala em até 3 toques a partir do preview, e 100% de quem recebe o link identifica de quem é a escala.
- **Conformidade:** zero falhas nos critérios WCAG 2.2 nível AA aplicáveis, verificado em auditoria automática e manual antes do lançamento.
- **Reconhecimento do tipo de escala:** ao menos 90% dos participantes com 12x36 fora da saúde e da segurança escolhem o tipo correto ("Plantão") sem ajuda, na primeira tentativa.
- **Vocabulário:** ao menos 90% dos participantes de plantão interpretam corretamente, sem ajuda, os estados "Folga" e "Folga (saída do plantão)" na legenda e no resumo; se a meta não for atingida, os rótulos devem ser revistos antes do lançamento.

Para os testes de usabilidade, a meta é ter ao menos 5 participantes por perfil: plantão em saúde ou segurança, 12x36 fora da saúde e da segurança (ex.: restaurante em shopping), escala semanal com rodízio, leitor de tela ou só teclado, e baixa visão.

**Métricas de uso acompanhadas**

As métricas indicam tendências e proporções, não totais exatos, porque bloqueadores de conteúdo impedem parte dos registros.

- **Acessos:** visitas por semana e proporção das que chegam por um link com escala (indica reabertura e compartilhamento).
- **Tipos de escala:** distribuição entre as escalas de plantão (com turno) e as modalidades semanais; a participação da 6x1 orienta a revisão da modalidade após a EC 141/2026.
- **Padrão semanal:** distribuição da quantidade de semanas do padrão, para validar o limite de 7 semanas e a necessidade de um atalho de rodízio.
- **Compartilhamento:** proporção de escalas completas que usam "Compartilhar escala" e de que forma (menu nativo, link copiado ou cópia manual).
- **Leitura ampliada:** proporção de visitas que usam o controle de tamanho de texto e os níveis escolhidos.
- **Dispositivo:** proporção de acessos por celular e por computador, para validar a prioridade ao celular.

## Histórias de Usuário

**Personas primárias**

- **Plantonista** (ex.: técnica de enfermagem em 12x36 noturno, vigilante em 24x48): consulta a escala várias vezes por mês para combinar compromissos.
- **Comerciário em rodízio** (ex.: atendente de loja em 6x1 com folga que muda a cada semana): recebe a escala da empresa e quer saber quando a folga cai no fim de semana.
- **Trabalhador de comércio em 12x36** (ex.: cozinheiro de restaurante em shopping que trabalha o dia todo e folga no dia seguinte): tem escala de plantão, mas não se vê como plantonista e costuma descrevê-la como "dia sim, dia não".

**Personas secundárias**

- **Quem recebe a escala** (família, colega, chefia imediata): abre o link para combinar folgas ou trocas.
- **Pessoa com leitor de tela ou que usa só teclado.**
- **Pessoa com baixa visão** que amplia o texto no celular, nem sempre sabe usar o zoom do sistema.

**Fluxos principais**

- US1: Como plantonista, eu quero informar a data do meu primeiro plantão e a minha escala para que eu veja em quais dias trabalho nos próximos meses.
- US2: Como plantonista em 12x36, eu quero escolher entre turno diurno e noturno para que o calendário mostre corretamente os dias em que saio do plantão pela manhã.
- US3: Como pessoa em escala de 24h ou 12x36 noturno, eu quero ver o dia de saída do plantão como uma folga diferenciada da folga inteira para que eu saiba que nesse dia só fico livre a partir da manhã.
- US4: Como cozinheiro de restaurante em shopping que trabalha o dia todo e folga no dia seguinte, eu quero reconhecer a minha escala entre as opções mesmo sem me considerar plantonista para que eu a configure sem ajuda e veja minhas folgas nos próximos meses.
- US5: Como comerciário com folgas fixas, eu quero escolher a modalidade (5x2 ou 6x1) e os dias de folga da semana para que o calendário mostre minhas folgas sem eu ter de marcar mês a mês.
- US6: Como comerciário em rodízio, eu quero informar quantas semanas tem o meu padrão, as folgas de cada semana e a data em que a semana 1 começa para que o calendário repita o rodízio da empresa.
- US7: Como comerciário em rodízio, eu quero ver o preview mudar a cada folga que marco para que eu confira, enquanto preencho, se o resultado bate com a escala que recebi.
- US8: Como pessoa que consulta a escala, eu quero navegar para meses seguintes e anteriores e voltar ao mês atual para que eu responda perguntas sobre datas distantes.
- US9: Como pessoa que consulta a escala, eu quero ler um resumo do mês exibido para que eu saiba quantos dias trabalho e quantos dias de folga tenho sem contar no calendário.
- US10: Como plantonista, eu quero salvar o link da página para que, ao abri-lo, minha escala apareça pronta, sem preencher nada.
- US11: Como pessoa que combina folgas com a família, eu quero dar um nome à escala e compartilhá-la em poucos toques para que quem recebe saiba de quem ela é.
- US12: Como quem recebe uma escala, eu quero abrir o link e ver o mesmo preview, podendo ajustar a configuração, para que eu planeje sem alterar a escala de quem me enviou.
- US13: Como pessoa com leitor de tela, eu quero que cada dia seja anunciado com data e estado completos e que o resumo seja anunciado quando o mês muda para que eu entenda o padrão do mês sem ver as cores.
- US14: Como pessoa com baixa visão, eu quero aumentar o texto pela própria página e que o calendário se reorganize em lista quando não couber para que eu leia tudo no celular sem rolar para os lados.
- US15: Como pessoa com baixa visão, eu quero que o tamanho de texto escolhido seja lembrado no meu aparelho para que eu não precise reajustar a cada visita.

**Casos de borda**

- US16: Como plantonista, eu quero informar como referência um plantão recente, mesmo no passado ou no meio do mês, para que o calendário fique preenchido também nos dias anteriores a essa data.
- US17: Como pessoa que abre um link antigo, eu quero que a página abra no mês atual com o dia de hoje destacado para que eu responda logo "trabalho hoje ou amanhã?".
- US18: Como pessoa que abre um link quebrado ou editado à mão, eu quero ver um aviso claro e um formulário utilizável para que eu possa reconfigurar a escala em vez de encontrar uma tela de erro.
- US19: Como comerciário, eu quero ser avisado quando uma semana do padrão estiver com menos folgas que a modalidade exige para que eu não salve um padrão incompleto sem perceber.
- US20: Como pessoa que teve férias ou troca de plantão, eu quero informar uma nova data de referência para que o calendário volte a bater com a escala real.

## Principais funcionalidades

### 1. Escolha do tipo de escala

**O que faz:** a pessoa escolhe entre **Plantão** e **Semanal**, e o formulário mostra apenas os campos daquele tipo.
**Por que é importante:** os dois perfis descrevem a escala de formas diferentes; mostrar só o necessário reduz o esforço e os erros.
**Como funciona:** uma escolha única no topo da entrada; o preview permanece visível junto da entrada.

- RF01: A entrada deve oferecer a escolha entre os tipos "Plantão" e "Semanal", com apenas um selecionado por vez. Cada opção deve trazer uma descrição curta, com exemplos que a pessoa reconheça mesmo sem saber o nome técnico da escala (ex.: "Plantão: 12x36, 24x48 ou 24x72, como trabalhar um dia e folgar no outro"; "Semanal: 5x2 ou 6x1, com as mesmas folgas toda semana ou em rodízio"), e a descrição deve fazer parte do nome acessível da opção.
- RF02: Ao trocar o tipo, o formulário deve exibir apenas os campos do tipo selecionado.
- RF03: Enquanto a escala não estiver completa, o preview deve exibir o mês atual sem estados de trabalho, com uma orientação em texto sobre o que falta preencher.

### 2. Configuração de escala de plantão

**O que faz:** a pessoa informa a data de início de um plantão e a escala; o app projeta o ciclo nos dois sentidos do tempo.
**Por que é importante:** é a entrada mais curta do produto e atende o público de saúde, segurança e portaria.
**Como funciona:** um campo de data digitável com calendário em popup como atalho, a escolha da escala e, só no 12x36, a escolha do turno.

- RF04: A pessoa deve informar a data de início de um plantão por um campo digitável no formato dd/mm/aaaa, com um calendário em popup como atalho opcional.
- RF05: Datas inválidas ou incompletas devem gerar uma mensagem de erro em texto, associada ao campo e anunciada a leitores de tela, sem apagar o que foi digitado.
- RF06: A pessoa deve escolher uma das escalas: 12x36, 24x48 ou 24x72.
- RF07: A escolha de turno (diurno ou noturno) deve aparecer somente quando a escala for 12x36 e é obrigatória nesse caso.
- RF08: O ciclo deve produzir os seguintes estados por dia, a partir da data de início, repetindo-se sem interrupção:

  | Escala        | Ciclo (dia 1, dia 2, …)                          |
  | ------------- | ------------------------------------------------ |
  | 12x36 diurno  | Trabalha, Folga                                  |
  | 12x36 noturno | Trabalha, Folga (saída do plantão)               |
  | 24x48         | Trabalha, Folga (saída do plantão), Folga        |
  | 24x72         | Trabalha, Folga (saída do plantão), Folga, Folga |

- RF09: "Folga (saída do plantão)" é um tipo de folga: o dia em que o plantão termina pela manhã e o descanso começa. Ela existe nas escalas de 24h e no 12x36 noturno; no 12x36 noturno, todas as folgas são desse tipo, e não há folga inteira.
- RF10: Os dias anteriores à data de início devem seguir o mesmo ciclo projetado para trás, para que qualquer plantão, passado ou futuro, sirva como referência.

### 3. Configuração de escala semanal

**O que faz:** a pessoa descreve um padrão de folgas de 1 a 7 semanas que se repete a partir de uma data.
**Por que é importante:** um único modelo cobre folga fixa, rodízio de 5x2 e rodízio de 6x1, incluindo o rodízio em que a folga avança um dia por semana e volta ao domingo a cada sete semanas, sem embutir regras trabalhistas que variam por categoria e região.
**Como funciona:** a pessoa escolhe a modalidade, a quantidade de semanas, marca as folgas de cada semana (domingo a sábado) e informa quando a semana 1 começa.

- RF11: A pessoa deve escolher a modalidade: 5x2 (2 folgas por semana) ou 6x1 (1 folga por semana).
- RF12: A pessoa deve escolher a quantidade de semanas do padrão, de 1 a 7, sendo 1 o valor inicial.
- RF13: Para cada semana do padrão, a pessoa deve marcar os dias de folga entre domingo e sábado, com a semana começando no domingo.
- RF14: Cada semana deve aceitar no máximo a quantidade de folgas da modalidade; ao atingir o limite, os demais dias da semana não podem ser marcados até que uma folga seja desmarcada, e o motivo deve ser informado em texto.
- RF15: Semanas com menos folgas que a modalidade exige devem ser indicadas como incompletas, de forma visível e anunciada a leitores de tela, sem depender só de cor.
- RF16: A pessoa deve informar a data de início da semana 1 por um campo digitável no formato dd/mm/aaaa, com calendário em popup como atalho; a semana 1 corresponde à semana de domingo a sábado que contém essa data.
- RF17: O padrão deve se repetir sem interrupção a partir da semana 1, em ciclos do tamanho informado, e ser projetado também para as semanas anteriores à data de início.
- RF18: Os dias de folga marcados devem aparecer como "Folga" e os demais como "Trabalha"; a escala semanal não tem o estado "Folga (saída do plantão)".
- RF19: Ao reduzir a quantidade de semanas, as semanas excedentes devem ser descartadas; ao aumentar, as novas semanas devem começar sem folgas marcadas.
- RF20: Ao trocar a modalidade, as folgas marcadas devem ser limpas, e a pessoa deve ser avisada disso de forma visível e anunciada.
- RF21: O app não deve validar nem alertar sobre regras trabalhistas (ex.: domingos de folga obrigatórios); exibe o padrão como informado.

### 4. Calendário de preview

**O que faz:** mostra o mês com o estado de cada dia, legenda visível e o dia de hoje destacado.
**Por que é importante:** é o centro do produto; a visão do mês inteiro é o que a lista de datas em texto não oferece.
**Como funciona:** uma grade mensal de domingo a sábado, com navegação entre meses por botões, atualizada a cada alteração na entrada.

- RF22: O preview deve exibir um mês por vez, com a semana começando no domingo e os nomes dos dias e do mês em português do Brasil.
- RF23: Ao abrir a página, com ou sem link, o preview deve exibir o mês atual.
- RF24: O dia de hoje deve ter destaque próprio, perceptível sem depender só de cor e informado no nome acessível do dia.
- RF25: Cada estado aplicável ("Trabalha", "Folga", "Folga (saída do plantão)") deve ser representado por cor e também por ícone ou texto; os dois tipos de folga devem ser reconhecíveis como folga e, ao mesmo tempo, distinguíveis entre si.
- RF26: A legenda deve ficar visível junto do calendário e listar apenas os estados que existem na escala configurada; a entrada "Folga (saída do plantão)" deve explicar que a pessoa sai do plantão pela manhã.
- RF27: Cada dia deve ter um nome acessível completo com data por extenso e estado (ex.: "15 de novembro de 2026, domingo, trabalha"; "26 de novembro de 2026, quinta-feira, hoje, folga"; "2 de novembro de 2026, segunda-feira, folga, saída do plantão pela manhã").
- RF28: A navegação entre meses deve ser feita por botões "Mês anterior" e "Próximo mês", sem depender de gesto de deslizar, e não deve ter limite de meses em nenhum dos sentidos.
- RF29: Deve existir uma ação para voltar ao mês atual, disponível quando outro mês estiver sendo exibido.
- RF30: O preview deve se atualizar a cada alteração na entrada, sem ação de confirmar.
- RF31: O calendário de preview é apenas de consulta: tocar ou selecionar um dia não altera a configuração da escala.

### 5. Resumo do mês

**O que faz:** apresenta em texto a contagem de dias por estado no mês exibido.
**Por que é importante:** dá a visão geral do mês para quem usa leitor de tela e responde rapidamente "quantas folgas tenho em dezembro?".
**Como funciona:** uma frase abaixo do calendário, anunciada quando o mês ou a escala mudam.

- RF32: Abaixo do calendário deve aparecer um resumo do mês exibido com o total de dias de trabalho e o total de dias de folga; o total de folgas inclui as folgas de saída do plantão, cuja quantidade aparece entre parênteses quando houver (ex.: escala semanal: "Novembro de 2026: 21 dias trabalhando, 9 dias de folga"; 24x48: "Dezembro de 2026: 11 dias de plantão, 20 dias de folga (10 com saída do plantão pela manhã)"; 12x36 noturno: "Novembro de 2026: 15 dias de plantão, 15 dias de folga (todos com saída do plantão pela manhã)").
- RF33: O resumo deve ser anunciado a leitores de tela quando o mês exibido ou a configuração da escala mudarem, de forma não intrusiva e sem interromper o que a pessoa está fazendo.
- RF34: Enquanto a escala estiver incompleta, o resumo deve ser substituído pela orientação do RF03.

### 6. Link que lembra a escala

**O que faz:** reflete toda a configuração no endereço da página; abrir o endereço restaura a escala.
**Por que é importante:** elimina o retrabalho de reconfigurar a cada consulta, sem login e sem guardar a escala no aparelho.
**Como funciona:** cada alteração atualiza o endereço; abrir um endereço com configuração preenche a entrada e o preview.

- RF35: Toda a configuração da escala (tipo, escala ou modalidade, turno, datas de referência, padrão de folgas e nome) deve ficar refletida no endereço da página a cada alteração.
- RF36: Abrir um endereço com configuração válida deve restaurar a entrada e o preview exatamente como estavam, sem nenhum preenchimento adicional.
- RF37: Um endereço com configuração inválida, incompleta ou de versão não reconhecida deve abrir a página com um aviso claro, em texto e anunciado, e com o formulário utilizável, aproveitando os campos válidos quando possível.
- RF38: As alterações na configuração não devem criar uma entrada nova no histórico do navegador a cada toque, para que o botão "voltar" não percorra cada marcação.
- RF39: O link de uma escala deve continuar abrindo a mesma escala em versões futuras do produto.

### 7. Nome da escala e compartilhamento

**O que faz:** permite dar um nome opcional à escala e enviá-la por link em poucos toques.
**Por que é importante:** combinar folgas com família e colegas é um uso real, e quem recebe precisa saber de quem é a escala.
**Como funciona:** um campo de nome opcional com aviso de privacidade e uma ação "Compartilhar escala".

- RF40: Deve existir um campo opcional "Nome da escala" (ex.: "Escala da Ana"), com até 40 caracteres.
- RF41: Junto ao campo deve haver um aviso visível de que o nome vai no link e pode ser visto por quem recebê-lo.
- RF42: Quando preenchido, o nome deve aparecer no topo do preview e fazer parte do título da página.
- RF43: A ação "Compartilhar escala" deve abrir o menu de compartilhamento nativo do sistema onde ele existir, com o link e um texto que inclua o nome da escala quando preenchido.
- RF44: Onde o menu nativo não existir, a ação deve copiar o link e exibir a confirmação "Link copiado", também anunciada a leitores de tela.
- RF45: Se não for possível copiar automaticamente, o app deve exibir o link em um campo selecionável para cópia manual.
- RF46: A ação de compartilhar deve estar disponível somente quando a escala estiver completa.
- RF47: Quem recebe o link deve ver a mesma tela e o mesmo preview, e pode alterar a configuração livremente; as alterações geram um novo endereço e não afetam o link original.

### 8. Tamanho de texto e leitura ampliada

**O que faz:** oferece um controle de tamanho de texto na própria página e reorganiza o calendário quando o texto ampliado não cabe na grade.
**Por que é importante:** pessoas com baixa visão nem sempre sabem ou conseguem usar o zoom do navegador ou do sistema.
**Como funciona:** botões de diminuir, restaurar e aumentar, que somam ao tamanho de fonte já configurado pela pessoa; com texto grande, o mês passa a ser exibido como lista de dias.

- RF48: Deve existir um controle visível de tamanho de texto com as ações "Diminuir texto", "Tamanho padrão" e "Aumentar texto", cada uma com rótulo acessível.
- RF49: O controle deve oferecer níveis de 100% a 200% em passos de 25%, aplicados sobre o tamanho de fonte configurado no navegador ou no sistema, sem substituí-lo.
- RF50: O tamanho atual deve ser exibido e anunciado a leitores de tela a cada mudança (ex.: "Texto em 150%"); nos limites, a ação indisponível deve informar o motivo.
- RF51: O tamanho escolhido deve ser lembrado no aparelho entre visitas, como preferência local; junto com a recusa de métricas (RF64), é a única informação guardada no dispositivo e não vai no link. Se o aparelho não permitir guardar, o controle deve funcionar normalmente sem lembrar.
- RF52: Com o texto ampliado (pelo controle, pelo navegador ou pelo sistema), as células do calendário devem crescer junto com o texto, sem cortar, sobrepor ou reduzir o conteúdo.
- RF53: Quando a grade de 7 colunas não couber na largura disponível, o mês deve ser exibido como lista de dias, com os mesmos estados, ícones, destaque de hoje, nomes acessíveis e legenda.
- RF54: A marcação das folgas do padrão semanal deve seguir o mesmo princípio, passando para um formato em lista quando os 7 dias não couberem lado a lado.

### 9. Métricas de uso agregadas

**O que faz:** registra, de forma agregada e anônima, os acessos à página e alguns eventos de uso.
**Por que é importante:** os testes de usabilidade mostram se a interface funciona; só as métricas mostram se o produto é usado, como chega às pessoas e quais escalas importam, o que embasa decisões como manter a modalidade 6x1.
**Como funciona:** um serviço externo de métricas sem cookies recebe apenas contagens de acessos e eventos, nunca o conteúdo do link.

- RF55: O app deve registrar os acessos à página, indicando apenas se a visita chegou com uma escala no link (sim ou não).
- RF56: O app deve registrar os eventos: escala completada (com tipo de escala, turno ou modalidade e quantidade de semanas do padrão), uso de "Compartilhar escala" (com a forma usada: menu nativo, link copiado ou cópia manual) e uso do controle de tamanho de texto (com o nível escolhido).
- RF57: O evento de escala completada deve ser registrado uma vez por visita, quando a escala fica completa, e de novo apenas se o tipo de escala, o turno ou a modalidade mudarem, para que as contagens não cresçam a cada marcação.
- RF58: Nenhum registro pode conter o nome da escala, as datas de referência, as folgas marcadas, o endereço com a configuração ou qualquer outra parte do link.
- RF59: As métricas não podem usar cookies, guardar dados no aparelho (exceto a recusa do RF64), criar identificador de pessoa ou de aparelho, gravar a sessão nem rastrear a pessoa entre sites.
- RF60: Quando o navegador enviar um sinal de recusa de rastreamento (ex.: Global Privacy Control), nada deve ser registrado.
- RF61: Se o serviço de métricas estiver bloqueado, indisponível ou lento, o app deve funcionar normalmente, sem erros visíveis e sem atrasar a página ou o preview.
- RF62: A página deve oferecer um texto curto sobre privacidade, alcançável a partir de um link "Privacidade", que explique o que é medido, o que nunca é coletado e que a escala fica apenas no link; abrir esse texto não pode apagar a escala configurada.
- RF63: O serviço de métricas não pode guardar o endereço IP nem dados derivados dele que permitam identificar a pessoa; esse é um critério obrigatório na escolha do serviço.
- RF64: O texto de privacidade deve oferecer a opção "Não registrar minhas visitas neste aparelho", que pode ser ativada e desativada a qualquer momento, com o estado atual visível e anunciado a leitores de tela. Com a opção ativa, nada é registrado. A escolha fica guardada no aparelho como preferência local, não vai no link e, se o aparelho não permitir guardar, vale apenas para a visita atual.

## Experiência do usuário

**Personas e necessidades**

- **Plantonista:** quer configurar em menos de um minuto e consultar em segundos, quase sempre pelo celular, muitas vezes no intervalo do trabalho.
- **Comerciário em rodízio:** precisa transcrever a escala da empresa uma vez, com confiança de que o resultado bate; o preview ao lado da entrada é a forma de conferência.
- **Quem recebe:** não configurou nada e precisa entender de imediato de quem é a escala e o que cada cor significa.
- **Leitor de tela e teclado:** precisa da mesma resposta e da mesma visão geral do mês por texto.
- **Baixa visão:** precisa ler com texto grande sem perder informação nem rolar para os lados.

**Fluxos principais**

1. **Primeira configuração (plantão):** escolhe "Plantão" → digita a data de um plantão → escolhe a escala → (se 12x36) escolhe o turno → o preview do mês atual aparece preenchido, com legenda e resumo → salva o link nos favoritos ou compartilha.
2. **Primeira configuração (semanal):** escolhe "Semanal" → escolhe a modalidade → escolhe a quantidade de semanas → marca as folgas de cada semana conferindo o preview → informa a data de início da semana 1 → salva ou compartilha.
3. **Consulta recorrente:** abre o link salvo → vê o mês atual com hoje destacado → navega até o mês desejado → lê o estado do dia ou o resumo → volta ao mês atual.
4. **Compartilhamento:** preenche o nome (opcional) → toca em "Compartilhar escala" → escolhe o aplicativo no menu do sistema ou recebe "Link copiado".
5. **Recebimento:** abre o link recebido → vê o nome no topo e o preview → pode ajustar a configuração sem afetar o link de quem enviou.
6. **Reancoragem:** após férias ou troca, informa uma nova data de referência e salva o novo link.

**Considerações de UI/UX**

- Pensado primeiro para celular: no celular, o preview do mês deve ficar visível sem rolagem depois da configuração do plantão.
- Um único calendário de consulta; a escolha de datas é feita pelo campo digitável com popup, nunca tocando no preview.
- Interface em português do Brasil, com datas por extenso no padrão brasileiro e semana começando no domingo.
- Marcação por dia inteiro, sem horários dos turnos; o dia de saída do plantão é tratado como um dia inteiro de folga, diferenciado da folga inteira.
- O tema segue a preferência clara ou escura do sistema, sem alternador na página; os dois temas cumprem os mesmos requisitos de contraste.
- Mensagens de erro, avisos e confirmações sempre em texto, perto do elemento a que se referem.
- O texto da interface deixa claro que o app mostra o padrão informado e não verifica regras trabalhistas.
- O link "Privacidade" é discreto, mas alcançável por teclado e leitor de tela, e abre o texto sobre privacidade sem sair da página e sem perder a escala.

**Requisitos de acessibilidade**

- Conformidade com WCAG 2.2 nível AA.
- Navegação completa por teclado, com ordem de foco lógica, sem armadilhas de foco e com o popup de data fechando pela tecla Esc e devolvendo o foco ao campo.
- Foco sempre visível, com contraste mínimo de 3:1 em relação ao fundo.
- Compatível com leitores de tela (VoiceOver no iOS, TalkBack no Android, NVDA no Windows): todos os controles com nome, função e estado; cada dia com nome acessível completo; resumo, erros, avisos e confirmações anunciados.
- Nenhum estado depende só de cor: cada estado tem ícone ou texto, e os indicadores de estado têm contraste mínimo de 3:1 com o fundo.
- Contraste mínimo de 4,5:1 para texto normal e 3:1 para texto grande.
- A interface respeita o tamanho de fonte configurado no navegador ou no sistema e continua utilizável com texto ampliado a 200% e zoom a 400%, sem cortar ou sobrepor conteúdo e sem rolagem horizontal.
- Áreas de toque com no mínimo 24 por 24 pixels CSS, conforme o WCAG 2.2.
- Movimento e animações respeitam a preferência de movimento reduzido do sistema.

## Restrições técnicas de alto nível

- **Sem backend e sem login:** todo o cálculo acontece no navegador, e o app deve funcionar em hospedagem estática (hoje, GitHub Pages, no subcaminho já publicado).
- **Persistência:** a configuração da escala existe apenas no endereço da página; as únicas informações guardadas no aparelho são a preferência de tamanho de texto (RF51) e a recusa de métricas (RF64).
- **Privacidade:** o único dado que sai do navegador por iniciativa do app são as métricas agregadas da funcionalidade 9, enviadas a um serviço externo sem cookies, sem identificação da pessoa, sem guardar o IP (RF63) e sem nenhuma parte do conteúdo do link, com opção de recusa (RF64); não há outros serviços de terceiros. O link carrega apenas a configuração da escala e, se preenchido, o nome; ele pode ficar no histórico de conversas e em pré-visualizações de link, o que a interface informa.
- **LGPD:** a coleta se limita a dados agregados e não identificáveis, de modo a dispensar banner de consentimento; esse enquadramento deve ser confirmado antes do lançamento. A escolha do serviço de métricas fica para a Especificação Técnica e deve atender a esses critérios.
- **Segurança:** o nome e os demais valores lidos do link são tratados como texto não confiável, exibidos sem interpretação e limitados em tamanho; um link manipulado não pode executar conteúdo nem quebrar a página.
- **Compatibilidade:** versões atuais do Chrome no Android, do Safari no iOS e de Chrome, Edge, Firefox e Safari no computador. O compartilhamento nativo depende do suporte do navegador, com alternativa obrigatória (RF44 e RF45).
- **Desempenho:** a página deve ficar utilizável em até 3 segundos num celular intermediário com conexão 4G, e o preview deve refletir cada alteração na entrada sem atraso perceptível (menos de 100 ms). O carregamento das métricas não pode atrasar nenhum desses tempos.
- **Datas:** os cálculos usam dias de calendário no fuso horário do aparelho, e a mudança de horário ou de fuso não pode deslocar os estados dos dias.
- **Regulatório:** o produto não valida regras trabalhistas (Lei 10.101/2000, art. 6º; art. 386 da CLT; convenções coletivas e normas municipais), porque elas variam por categoria, gênero, convenção coletiva e município. A Emenda Constitucional 141/2026 (originada da PEC 221/2019), promulgada em 16/10/2026, acaba com a escala 6x1 como regra geral, com a primeira etapa (42 horas semanais e dois dias de repouso) prevista para meados de dezembro de 2026 e exceções por setor; as datas exatas e as exceções devem ser confirmadas no texto oficial. A modalidade 6x1 permanece na primeira versão para a transição e para os casos de exceção, e sua permanência deve ser revista à luz da emenda.

## Fora do escopo

**Funcionalidades excluídas da primeira versão**

- Escalas que não se repetem, como escalas mensais montadas à mão pela empresa, ou quem conhece só as folgas da semana atual.
- Escalas diferentes das listadas (ex.: 12x60, 5x1, 4x2, turnos com revezamento de horário).
- Horários de entrada e saída dos turnos e cálculo de horas trabalhadas, horas extras ou adicional noturno.
- Exceções ao ciclo, como trocas de plantão, férias, licenças e faltas; a saída é informar uma nova data de referência.
- Validação ou alerta sobre regras trabalhistas, incluindo domingos de folga obrigatórios.
- Destaque de feriados nacionais, estaduais ou municipais.
- Pergunta direta "Trabalho no dia ___?" como entrada alternativa.
- Exportação para a agenda do celular (.ics) e lembretes ou notificações.
- Marcação de folgas diretamente no calendário de preview.
- Mais de uma escala por pessoa na mesma tela, comparação de escalas ou escala de equipe.
- Contas, login, sincronização entre aparelhos e salvamento da escala no aparelho.
- Alternador de tema na página e idiomas além do português do Brasil.
- Métricas com cookies, identificação de pessoa ou aparelho, gravação de sessão, mapas de calor ou coleta de qualquer parte da configuração da escala.
- Painel de métricas dentro do app; as métricas são consultadas no próprio serviço de métricas.

**Considerações futuras**

- Atalho de preenchimento para o rodízio em que a folga avança um dia por semana, se esse formato se mostrar comum nos testes.
- Destaque de feriados nacionais no preview.
- Pergunta direta para datas distantes.
- Exportação para agenda (.ics).
- Suporte a escalas mensais sem padrão.
- Revisão da modalidade 6x1 conforme a entrada em vigor da EC 141/2026 e suas exceções.
