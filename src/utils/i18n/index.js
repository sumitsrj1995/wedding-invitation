import { invitationCopy } from './invitationCopy';
import { uiStrings } from './uiStrings';

export const DEFAULT_LANGUAGE = 'en';

export function resolveLanguage(language) {
  if (language && Object.prototype.hasOwnProperty.call(uiStrings, language)) {
    return language;
  }
  return DEFAULT_LANGUAGE;
}

export function getUiStrings(language = DEFAULT_LANGUAGE) {
  const resolved = resolveLanguage(language);
  return uiStrings[resolved];
}

export function getInvitationCopy(language = DEFAULT_LANGUAGE, overrides = {}) {
  const resolved = resolveLanguage(language);
  const defaults = invitationCopy[resolved];

  return {
    ...defaults,
    ...overrides,
    calendarEventTitle:
      overrides.calendarEventTitle ??
      ((names) => defaults.calendarEventTitle(names))
  };
}

export { invitationCopy, uiStrings };
