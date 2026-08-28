import * as Astronomy from 'astronomy-engine';
import * as THREE from 'three';

const DEG = Math.PI / 180;

/** Fixed observer: Pune, Maharashtra, India */
export const PUNE_OBSERVER = new Astronomy.Observer(18.5204, 73.8567, 560);

export const CELESTIAL_DISTANCE = 30;

const MIN_ALTITUDE_DEG = 8;
const MIN_SUN_SEPARATION_DEG = 14;
const TWILIGHT_SUN_ALTITUDE_DEG = -6;
const MAX_MAGNITUDE = 4.1;
const MAX_VISIBLE_PLANETS = 4;

export const PLANET_DEFINITIONS = [
  {
    key: 'Mercury',
    body: Astronomy.Body.Mercury,
    label: 'Mercury',
    color: '#b8b2a8',
    emissive: '#5a5548',
    radius: 0.034
  },
  {
    key: 'Venus',
    body: Astronomy.Body.Venus,
    label: 'Venus',
    color: '#e8dcc8',
    emissive: '#b8a078',
    radius: 0.052
  },
  {
    key: 'Mars',
    body: Astronomy.Body.Mars,
    label: 'Mars',
    color: '#c47858',
    emissive: '#7a3828',
    radius: 0.042
  },
  {
    key: 'Jupiter',
    body: Astronomy.Body.Jupiter,
    label: 'Jupiter',
    color: '#c9b59a',
    emissive: '#8a7560',
    radius: 0.078
  },
  {
    key: 'Saturn',
    body: Astronomy.Body.Saturn,
    label: 'Saturn',
    color: '#ddd0b0',
    emissive: '#9a8870',
    radius: 0.068,
    ring: true
  },
  {
    key: 'Uranus',
    body: Astronomy.Body.Uranus,
    label: 'Uranus',
    color: '#9ec4c4',
    emissive: '#5a8080',
    radius: 0.036
  },
  {
    key: 'Neptune',
    body: Astronomy.Body.Neptune,
    label: 'Neptune',
    color: '#6080c0',
    emissive: '#384878',
    radius: 0.036
  }
];

function angularSeparationDeg(alt1, az1, alt2, az2) {
  const a1 = alt1 * DEG;
  const a2 = alt2 * DEG;
  const deltaAz = (az2 - az1) * DEG;
  const cosAngle =
    Math.sin(a1) * Math.sin(a2) + Math.cos(a1) * Math.cos(a2) * Math.cos(deltaAz);
  return Math.acos(Math.min(1, Math.max(-1, cosAngle))) / DEG;
}

function getSunHorizon(date) {
  const sunEq = Astronomy.Equator(Astronomy.Body.Sun, date, PUNE_OBSERVER, true, true);
  return Astronomy.Horizon(date, PUNE_OBSERVER, sunEq.ra, sunEq.dec, 'normal');
}

function minimumAltitude(magnitude) {
  if (magnitude < -2) return 4;
  if (magnitude < 0) return 6;
  return MIN_ALTITUDE_DEG;
}

function isRealisticallyVisible(planetKey, horizon, sunHorizon, magnitude) {
  if (horizon.altitude < minimumAltitude(magnitude)) return false;
  if (magnitude > MAX_MAGNITUDE) return false;

  const sunSeparation = angularSeparationDeg(
    horizon.altitude,
    horizon.azimuth,
    sunHorizon.altitude,
    sunHorizon.azimuth
  );

  if (sunHorizon.altitude > TWILIGHT_SUN_ALTITUDE_DEG) {
    if (sunSeparation < MIN_SUN_SEPARATION_DEG) return false;
    if (sunHorizon.altitude > -1 && magnitude > -0.5) return false;
    if ((planetKey === 'Mercury' || planetKey === 'Venus') && sunSeparation < 22) return false;
  }

  return true;
}

export function getVisiblePlanets(date = new Date()) {
  const sunHorizon = getSunHorizon(date);
  const candidates = [];

  for (const definition of PLANET_DEFINITIONS) {
    const eq = Astronomy.Equator(definition.body, date, PUNE_OBSERVER, true, true);
    const horizon = Astronomy.Horizon(date, PUNE_OBSERVER, eq.ra, eq.dec, 'normal');
    const illumination = Astronomy.Illumination(definition.body, date);

    if (!isRealisticallyVisible(definition.key, horizon, sunHorizon, illumination.mag)) {
      continue;
    }

    candidates.push({
      ...definition,
      altitude: horizon.altitude,
      azimuth: horizon.azimuth,
      magnitude: illumination.mag,
      phase: illumination.phase_fraction
    });
  }

  candidates.sort((a, b) => a.magnitude - b.magnitude);
  return candidates.slice(0, MAX_VISIBLE_PLANETS);
}

/** Map astronomical azimuth/altitude to scene direction (East-North-Up). */
export function horizontalToDirection(azimuthDeg, altitudeDeg, target = new THREE.Vector3()) {
  const az = azimuthDeg * DEG;
  const alt = altitudeDeg * DEG;

  return target
    .set(Math.cos(alt) * Math.sin(az), Math.sin(alt), Math.cos(alt) * Math.cos(az))
    .normalize();
}
