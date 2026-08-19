import { Suspense, lazy, useLayoutEffect } from 'react';
import { resolveTheme } from './index';
import theme1Styles from './theme1.css?inline';
import theme2Styles from './theme2.css?inline';
import theme3Styles from './theme3.css?inline';
import theme4Styles from './theme4.css?inline';
import theme5Styles from './theme5.css?inline';
import theme6Styles from './theme6.css?inline';

const GalaxyBackground = lazy(() => import('./theme2/GalaxyBackground'));
const Theme3EarthExperience = lazy(() => import('./theme3/EarthExperience'));
const Theme4EarthExperience = lazy(() => import('./theme4/EarthExperience'));
const Theme4PhotoDepthEnhancer = lazy(() => import('./theme4/PhotoDepthEnhancer'));
const Theme5EarthExperience = lazy(() => import('./theme5/EarthExperience'));
const Theme5PhotoDepthEnhancer = lazy(() => import('./theme5/PhotoDepthEnhancer'));
const Theme6EarthExperience = lazy(() => import('./theme6/EarthExperience'));
const Theme6PhotoDepthEnhancer = lazy(() => import('./theme6/PhotoDepthEnhancer'));

const themeStyles = {
  theme1: theme1Styles,
  theme2: `${theme1Styles}\n${theme2Styles}`,
  theme3: `${theme1Styles}\n${theme3Styles}`,
  theme4: `${theme1Styles}\n${theme4Styles}`,
  theme5: `${theme1Styles}\n${theme5Styles}`,
  theme6: `${theme1Styles}\n${theme6Styles}`
};

export default function ThemeProvider({ theme, children }) {
  const resolvedTheme = resolveTheme(theme);
  const isGalaxyTheme = resolvedTheme === 'theme2';
  const isTheme3Earth = resolvedTheme === 'theme3';
  const isTheme4Earth = resolvedTheme === 'theme4';
  const isTheme5Earth = resolvedTheme === 'theme5';
  const isTheme6Earth = resolvedTheme === 'theme6';

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
      {isTheme3Earth ? (
        <Suspense fallback={null}>
          <Theme3EarthExperience />
        </Suspense>
      ) : null}
      {isTheme4Earth ? (
        <Suspense fallback={null}>
          <Theme4EarthExperience />
          <Theme4PhotoDepthEnhancer />
        </Suspense>
      ) : null}
      {isTheme5Earth ? (
        <Suspense fallback={null}>
          <Theme5EarthExperience />
          <Theme5PhotoDepthEnhancer />
        </Suspense>
      ) : null}
      {isTheme6Earth ? (
        <Suspense fallback={null}>
          <Theme6EarthExperience />
          <Theme6PhotoDepthEnhancer />
        </Suspense>
      ) : null}
      <div className="theme-stage">{children}</div>
    </>
  );
}
