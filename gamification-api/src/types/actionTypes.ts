// Tipos de ações e seus pontos sugeridos
export const ACTION_POINTS = {
  VISIT: 1,           // Visitar o site
  COMMENT: 5,         // Fazer um comentário
  LIKE: 2,            // Curtir conteúdo
  SHARE: 10,          // Compartilhar conteúdo
  PURCHASE: 50,       // Realizar uma compra
  REFERRAL: 25,       // Indicar um amigo
  REVIEW: 15,         // Escrever uma avaliação
  COMPLETE_PROFILE: 20, // Completar perfil
  DAILY_LOGIN: 3,     // Login diário
  NEWSLETTER: 5       // Assinar newsletter
} as const;

export type ActionType = keyof typeof ACTION_POINTS;
