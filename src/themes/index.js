export const defaultTheme = 'theme1';

export const availableThemes = ['theme1', 'theme2', 'theme3', 'theme4'];

export function resolveTheme(theme) {
  return availableThemes.includes(theme) ? theme : defaultTheme;
}
