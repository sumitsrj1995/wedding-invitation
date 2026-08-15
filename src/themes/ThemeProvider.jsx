import { Suspense, lazy, useLayoutEffect } from 'react';
import { resolveTheme } from './index';
import theme1Styles from './theme1.css?inline';
import theme2Styles from './theme2.css?inline';

const GalaxyBackground = lazy(() => import('./theme2/GalaxyBackground'));

const themeStyles = {
  theme1: theme1Styles,
  theme2: `${theme1Styles}\n${theme2Styles}`
};

export default function ThemeProvider({ theme, children }) {
  const resolvedTheme = resolveTheme(theme);
  const isGalaxyTheme = resolvedTheme === 'theme2';

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;

    const styleElementId = 'wedding-theme-styles';
    let styleElement = document.getElementById(styleElementId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleElementId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = themeStyles[resolvedTheme] ?? themeStyles.theme1;
  }, [resolvedTheme]);

  return (
    <>
      {isGalaxyTheme ? (
        <Suspense fallback={null}>
          <GalaxyBackground />
        </Suspense>
      ) : null}
      <div className="theme-stage">{children}</div>
    </>
  );
}
