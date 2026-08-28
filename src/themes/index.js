export const defaultTheme = 'theme1';

export const availableThemes = ['theme1', 'theme2', 'theme3', 'theme4', 'theme5', 'theme6', 'theme7', 'theme8'];

export function resolveTheme(theme) {
  return availableThemes.includes(theme) ? theme : defaultTheme;
}
