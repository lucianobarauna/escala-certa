type PrivacySection = {
  title: string;
  body: string;
};

export const PRIVACY_TITLE = 'Privacidade';
export const CLOSE_LABEL = 'Fechar';
export const METRICS_SWITCH_LABEL = 'Métricas de uso';
export const METRICS_ON_MESSAGE = 'Métricas ativadas';
export const METRICS_OFF_MESSAGE = 'Métricas desativadas';
export const GPC_MESSAGE =
  'Seu navegador envia o sinal de não rastreamento (Global Privacy Control), então as métricas ficam desativadas.';

export const PRIVACY_SECTIONS: readonly PrivacySection[] = [
  {
    title: 'Sua escala fica só no link',
    body: 'A configuração da escala e o nome ficam apenas no endereço da página. O app não envia nem guarda sua escala em nenhum servidor.',
  },
  {
    title: 'O que medimos, se você aceitar',
    body: 'Contamos os acessos à página (só se ela foi aberta com uma escala no link: sim ou não), quando uma escala é completada (tipo, turno ou modalidade e quantidade de semanas), o uso de "Compartilhar escala" (a forma usada) e o uso do tamanho de texto (o nível escolhido).',
  },
  {
    title: 'Quem trata os dados',
    body: 'As métricas são processadas pelo Google, por meio do Google Analytics 4, com os recursos de publicidade e de sinais de usuários desativados.',
  },
  {
    title: 'Cookies',
    body: 'Somente depois que você aceitar, o Google Analytics cria os cookies _ga e _ga_<ID> para contar visitas. Ao desativar as métricas, esses cookies são apagados.',
  },
  {
    title: 'O que nunca é coletado',
    body: 'Nunca enviamos o nome da escala, as datas, as folgas marcadas nem qualquer parte do link.',
  },
  {
    title: 'O que fica no seu aparelho',
    body: 'O app guarda no aparelho apenas a sua escolha sobre as métricas e o tamanho do texto.',
  },
];
