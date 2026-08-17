import * as THREE from 'three';

const DEG = Math.PI / 180;

/** Current universal instant — solar geometry matches real time in India. */
export function getCurrentISTDate() {
  return new Date();
}

function julianDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

function getSolarDeclination(date) {
  const jd = julianDate(date);
  const n = jd - 2451545.0;
  const meanLong = ((280.46 + 0.9856474 * n) % 360) * DEG;
  const meanAnomaly = ((357.528 + 0.9856003 * n) % 360) * DEG;
  const eclipticLong =
    meanLong +
    (1.915 * Math.sin(meanAnomaly) + 0.02 * Math.sin(2 * meanAnomaly)) * DEG;
  const obliquity = (23.439 - 0.0000004 * n) * DEG;
  return Math.asin(Math.sin(obliquity) * Math.sin(eclipticLong));
}

/**
 * Real-time sun direction in Earth geographic space (Y = north pole, +X = 0° longitude).
 * Vector points from Earth center toward the Sun.
 */
export function getSunDirectionECEF(date = getCurrentISTDate(), target = new THREE.Vector3()) {
  const decl = getSolarDeclination(date);

  const utcHours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600 +
    date.getUTCMilliseconds() / 3600000;

  const subsolarLon = (12 - utcHours) * 15 * DEG;
  const cosDecl = Math.cos(decl);

  return target
    .set(cosDecl * Math.cos(subsolarLon), Math.sin(decl), cosDecl * Math.sin(subsolarLon))
    .normalize();
}

/** Sample whether India (~20°N, 78°E) should be in daylight at `date`. */
export function isIndiaDaytime(date = getCurrentISTDate()) {
  const sun = getSunDirectionECEF(date);
  const india = new THREE.Vector3(
    Math.cos(20 * DEG) * Math.cos(78 * DEG),
    Math.sin(20 * DEG),
    Math.cos(20 * DEG) * Math.sin(78 * DEG)
  );
  return india.dot(sun) > 0;
}

/** World-space sun direction for scene lights (accounts for Earth display rotation). */
export function getSunDirectionWorld(date, earthQuaternion, target = new THREE.Vector3()) {
  getSunDirectionECEF(date, target);
  if (earthQuaternion) {
    target.applyQuaternion(earthQuaternion);
  }
  return target;
}
