// App version changelog system
// Bump APP_VERSION on every deploy with user-facing changes

export const APP_VERSION = '2.5.0';

export const CHANGELOG = {
  '2.5.0': {
    date: '26/05/2026',
    emoji: '🎉',
    title: 'Novidades desta versão',
    features: [
      { emoji: '📷', text: 'Leia cartões de vacinação com a câmera — a IA preenche tudo automaticamente' },
      { emoji: '💉', text: 'Nova caderneta de vacinação com design de passaporte físico e micro-animações' },
      { emoji: '📊', text: 'Tela de Relatórios com exportação em PDF dos dados do seu pet' },
      { emoji: '🐾', text: 'Passeios & Atividades com metas semanais e histórico completo' },
      { emoji: '📅', text: 'Diário de comportamento estilo calendário com registros por dia' },
      { emoji: '🔔', text: 'Notificações de novidades a cada atualização do app' },
    ],
  },
};

/** Returns the changelog for the current version if user hasn't seen it yet, or null. */
export function getPendingChangelog() {
  try {
    const seen = localStorage.getItem('mp_app_version');
    if (seen === APP_VERSION) return null;
    return CHANGELOG[APP_VERSION] ?? null;
  } catch {
    return null;
  }
}

/** Call after the user dismisses the What's New sheet. */
export function markVersionSeen() {
  try {
    localStorage.setItem('mp_app_version', APP_VERSION);
  } catch {}
}
