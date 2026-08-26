import{r as o,j as r}from"./index-DAH4dUCP.js";import{V as m,a as S,N as z,A as I,B,S as T,u as C,b as W,c as V,M as U,Q as $,C as O}from"./react-three-fiber.esm-BsJKcRKc.js";import{a as _,u as G,s as H,E as Q,B as K,D as q,V as Y,S as J}from"./Vignette-CUMQVnsS.js";import{S as X}from"./SpaceEnvironment-DMF9LVVW.js";import"./Sparkles-Hli1ZxZo.js";const f=Math.PI/180;function x(){return new Date}function Z(e){return e.getTime()/864e5+24405875e-1}function ee(e){const t=Z(e)-2451545,c=(280.46+.9856474*t)%360*f,n=(357.528+.9856003*t)%360*f,s=c+(1.915*Math.sin(n)+.02*Math.sin(2*n))*f,a=(23.439-4e-7*t)*f;return Math.asin(Math.sin(a)*Math.sin(s))}function j(e=x(),i=new m){const t=ee(e),n=(12-(e.getUTCHours()+e.getUTCMinutes()/60+e.getUTCSeconds()/3600+e.getUTCMilliseconds()/36e5))*15*f,s=Math.cos(t);return i.set(s*Math.cos(n),Math.sin(t),s*Math.sin(n)).normalize()}const g="/wedding-invitation/textures/theme3/",F=Math.PI,te=.02,re=`
  varying vec2 vUv;
  varying vec3 vNormalGeo;
  varying vec3 vPositionW;

  void main() {
    vUv = uv;
    vNormalGeo = normalize(normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPositionW = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,oe=`
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specularMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormalGeo;
  varying vec3 vPositionW;

  void main() {
    vec3 normal = normalize(vNormalGeo);
    vec3 dayColor = texture2D(dayMap, vUv).rgb;
    vec3 lightDir = normalize(sunDirection);

    float sunDot = -dot(normal, lightDir);
    float dayMix = smoothstep(-0.28, 0.28, sunDot);
    float twilight = smoothstep(-0.2, 0.04, sunDot) * (1.0 - smoothstep(0.0, 0.28, sunDot));
    float nightMix = 1.0 - dayMix;

    vec3 lightsRaw = texture2D(nightMap, vUv).rgb;
    float lightLuma = dot(lightsRaw, vec3(0.299, 0.587, 0.114));

    // Preserve geographic distribution; suppress noise and faint scatter.
    float density = smoothstep(0.04, 0.17, lightLuma);

    // Irregular intensity: dim haze in rural areas, slightly stronger urban cores.
    float softSpread = pow(clamp(lightLuma, 0.0, 1.0), 1.72);
    float urbanCore = smoothstep(0.24, 0.68, lightLuma);
    float lightStrength = density * mix(softSpread * 0.34, softSpread * 0.88, urbanCore);

    // Warm amber/yellow with subtle variation from the source texture.
    float warmth = clamp(lightsRaw.r * 0.92 + lightsRaw.g * 0.34, 0.0, 1.0);
    vec3 amberSoft = vec3(0.76, 0.56, 0.33);
    vec3 amberMid = vec3(0.88, 0.69, 0.41);
    vec3 amberCore = vec3(0.94, 0.76, 0.48);
    vec3 amberTone = mix(amberSoft, amberMid, smoothstep(0.1, 0.42, warmth));
    amberTone = mix(amberTone, amberCore, urbanCore * 0.45);

    vec3 cityLights = amberTone * lightStrength;

    // Deep night only; fade toward the terminator and hide on the day side.
    float cityVisibility =
      smoothstep(-0.03, -0.3, sunDot) *
      (1.0 - smoothstep(-0.2, 0.05, sunDot)) *
      (1.0 - dayMix);

    vec3 cityContribution = cityLights * cityVisibility * 0.18;

    // Faint earthshine: preserve terrain/ocean hues at very low luminance (warm-neutral, not blue).
    float nightDepth = smoothstep(-0.02, -0.34, sunDot);
    float ambientLevel = mix(0.024, 0.056, nightDepth);
    float earthLuma = dot(dayColor, vec3(0.299, 0.587, 0.114));
    vec3 mutedEarth = mix(dayColor, vec3(earthLuma * 0.9), 0.14);
    vec3 nightBase = mutedEarth * ambientLevel * vec3(1.0, 0.98, 0.93);
    vec3 nightColor = mix(nightBase, nightBase + cityContribution, density * cityVisibility);

    vec3 color = mix(nightColor, dayColor, dayMix);
    vec3 sunset = dayColor * vec3(1.18, 0.78, 0.48);
    color = mix(color, sunset, twilight * 0.58);

    float specMask = texture2D(specularMap, vUv).r;
    vec3 viewDir = normalize(cameraPosition - vPositionW);
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 36.0) * specMask * 0.48 * dayMix;
    color += vec3(specular);

    color = mix(color, nightColor, nightMix * (1.0 - smoothstep(-0.18, 0.02, sunDot)) * 0.24);

    gl_FragColor = vec4(color, 1.0);
  }
`,ae=`
  varying vec3 vNormalW;
  varying vec3 vNormalGeo;
  void main() {
    vNormalGeo = normalize(normal);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ne=`
  uniform vec3 sunDirection;
  varying vec3 vNormalW;
  varying vec3 vNormalGeo;

  void main() {
    vec3 viewDir = normalize(cameraPosition);
    float rim = 1.0 - max(dot(vNormalW, viewDir), 0.0);
    float intensity = pow(rim, 2.15);
    float sunFacing = max(-dot(normalize(vNormalGeo), normalize(sunDirection)), 0.0);
    vec3 dayAtmosphere = vec3(0.48, 0.68, 1.0);
    vec3 nightAtmosphere = vec3(0.08, 0.12, 0.24);
    vec3 atmosphere = mix(nightAtmosphere, dayAtmosphere, smoothstep(0.0, 0.55, sunFacing));
    float alpha = intensity * mix(0.28, 0.78, smoothstep(0.0, 0.45, sunFacing));
    gl_FragColor = vec4(atmosphere * intensity, alpha);
  }
`,ie=`
  varying vec2 vUv;
  varying vec3 vNormalGeo;

  void main() {
    vUv = uv;
    vNormalGeo = normalize(normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,se=`
  uniform sampler2D cloudMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormalGeo;

  void main() {
    vec4 sample = texture2D(cloudMap, vUv);
    float sunDot = -dot(normalize(vNormalGeo), normalize(sunDirection));
    float dayMix = smoothstep(-0.2, 0.28, sunDot);
    float alpha = sample.a * mix(0.062, 0.32, dayMix);
    vec3 cloudColor = mix(vec3(0.19, 0.18, 0.16), vec3(1.0), dayMix);
    gl_FragColor = vec4(cloudColor, alpha);
  }
`;function ce({radius:e=1.65,reducedMotion:i=!1,isMobile:t=!1,onSunDirectionChange:c}){const n=o.useRef(null),s=o.useRef(null),a=o.useRef(j(x(),new m)),u=o.useRef(new m),l=t?48:72,[p,d,v,h]=_([`${g}earth_day.jpg`,`${g}earth_lights.png`,`${g}earth_specular.jpg`,`${g}earth_clouds.png`]),y=o.useMemo(()=>new S({uniforms:{dayMap:{value:p},nightMap:{value:d},specularMap:{value:v},sunDirection:{value:a.current.clone()}},vertexShader:re,fragmentShader:oe}),[p,d,v]),M=o.useMemo(()=>new S({uniforms:{cloudMap:{value:h},sunDirection:{value:a.current.clone()}},vertexShader:ie,fragmentShader:se,transparent:!0,depthWrite:!1,blending:z}),[h]),w=o.useMemo(()=>new S({uniforms:{sunDirection:{value:a.current.clone()}},vertexShader:ae,fragmentShader:ne,transparent:!0,depthWrite:!1,side:B,blending:I}),[]),b=()=>{j(x(),a.current),y.uniforms.sunDirection.value.copy(a.current),M.uniforms.sunDirection.value.copy(a.current),w.uniforms.sunDirection.value.copy(a.current)};return o.useLayoutEffect(()=>{b()},[w,M,y]),o.useEffect(()=>{[p,d,v,h].forEach(D=>{D.colorSpace=T,D.anisotropy=t?4:8}),h.anisotropy=t?2:4,n.current&&(n.current.rotation.y=F),s.current&&(s.current.rotation.y=te)},[h,p,t,d,v]),C((D,R)=>{i||(n.current&&(n.current.rotation.y+=R*.018),s.current&&(s.current.rotation.y+=R*.024)),b(),n.current&&c&&(u.current.copy(a.current),u.current.applyQuaternion(n.current.quaternion),c(u.current))}),r.jsxs("group",{ref:n,children:[r.jsxs("mesh",{children:[r.jsx("sphereGeometry",{args:[e,l,l]}),r.jsx("primitive",{object:y,attach:"material"})]}),r.jsxs("mesh",{ref:s,scale:1.006,children:[r.jsx("sphereGeometry",{args:[e,l,l]}),r.jsx("primitive",{object:M,attach:"material"})]}),r.jsxs("mesh",{scale:1.045,children:[r.jsx("sphereGeometry",{args:[e,t?32:48,t?32:48]}),r.jsx("primitive",{object:w,attach:"material"})]})]})}const le="/wedding-invitation/textures/theme5/",ue=1.65,me=ue*.24,he=4.05,pe=.28;function de({isMobile:e=!1,reducedMotion:i=!1}){const t=o.useRef(null),c=o.useRef(null),n=G(),s=o.useRef(0),[a]=_([`${le}moon_color.jpg`]);o.useEffect(()=>{a.colorSpace=T,a.anisotropy=e?4:8},[a,e]);const u=e?32:48,l=o.useMemo(()=>new W({map:a,bumpMap:a,bumpScale:e?.008:.012,roughness:.94,metalness:.015,color:new V("#b8b4ae")}),[a,e]);return C((p,d)=>{if(!t.current||!c.current||!n)return;const v=n.current,h=p.clock.elapsedTime*.055+v*Math.PI*1.45;s.current=i?h:U.damp(s.current,h,2.4,d),t.current.rotation.y=s.current,t.current.rotation.x=pe,c.current.rotation.y=-s.current}),r.jsx("group",{ref:t,children:r.jsx("group",{position:[he,.18,0],children:r.jsx("mesh",{ref:c,material:l,castShadow:!0,receiveShadow:!0,children:r.jsx("sphereGeometry",{args:[me,u,u]})})})})}const A=[{position:[.2,.35,6.4],lookAt:[0,0,0]},{position:[3.8,.75,4.8],lookAt:[0,.05,0]},{position:[1.2,1.15,3.85],lookAt:[0,.08,0]},{position:[-3.6,.85,4.5],lookAt:[0,.02,0]},{position:[.4,1.55,6.1],lookAt:[0,0,0]}];function ve(e){return e?A.map(({position:i,lookAt:t})=>({position:[i[0]*.76,i[1],i[2]*1.34],lookAt:[...t]})):A}const L=new m,P=new m,k=new m(0,0,0);function fe({isMobile:e=!1,reducedMotion:i=!1}){const t=G(),c=o.useRef(0),n=o.useRef(ve(e));return C((s,a)=>{if(!t)return;const u=t.current;c.current=i?u:U.damp(c.current,u,2.8,a);const l=H(c.current,n.current);L.set(l.position[0],l.position[1],l.position[2]),P.set(l.lookAt[0],l.lookAt[1],l.lookAt[2]),s.camera.position.lerp(L,1-Math.exp(-3.6*a)),k.lerp(P,1-Math.exp(-3.6*a)),s.camera.lookAt(k)}),null}const E=new m,N=new m,ge=new $().setFromAxisAngle(new m(0,1,0),F);function xe({isMobile:e=!1}){return r.jsxs(Q,{multisampling:0,children:[r.jsx(K,{intensity:.38,luminanceThreshold:.12,luminanceSmoothing:.72,mipmapBlur:!0}),e?null:r.jsx(q,{focusDistance:.012,focalLength:.045,bokehScale:1.6,height:540}),r.jsx(Y,{eskil:!0,offset:.14,darkness:.72})]})}function ye({isMobile:e=!1,reducedMotion:i=!1}){const t=o.useRef(null);o.useLayoutEffect(()=>{t.current&&(j(x(),E),N.copy(E).applyQuaternion(ge),t.current.position.copy(N).multiplyScalar(14),t.current.target.position.set(0,0,0),t.current.target.updateMatrixWorld())},[]);const c=n=>{t.current&&(t.current.position.copy(n).multiplyScalar(14),t.current.target.position.set(0,0,0),t.current.target.updateMatrixWorld())};return r.jsxs(r.Fragment,{children:[r.jsx(X,{isMobile:e,reducedMotion:i}),r.jsx("ambientLight",{intensity:.028,color:"#6078a8"}),r.jsx("directionalLight",{ref:t,position:[6,2.5,4],intensity:1.35,color:"#fff8ee",castShadow:!e,"shadow-mapSize":e?[512,512]:[1024,1024],"shadow-camera-near":.5,"shadow-camera-far":24,"shadow-camera-left":-6,"shadow-camera-right":6,"shadow-camera-top":6,"shadow-camera-bottom":-6,"shadow-bias":-2e-4}),r.jsx("directionalLight",{position:[-4,-1,-3],intensity:.03,color:"#506090"}),r.jsx(o.Suspense,{fallback:null,children:r.jsx(ce,{isMobile:e,reducedMotion:i,onSunDirectionChange:c})}),r.jsx(o.Suspense,{fallback:null,children:r.jsx(de,{isMobile:e,reducedMotion:i})}),r.jsx(fe,{isMobile:e,reducedMotion:i}),r.jsx(xe,{isMobile:e})]})}const Me={position:[.2,.35,6.4],fov:42,near:.1,far:120},we={position:[.15,.35,8.4],fov:54,near:.1,far:120};function Re(){const{isMobile:e,reducedMotion:i}=o.useMemo(()=>typeof window>"u"?{isMobile:!1,reducedMotion:!1}:{isMobile:window.matchMedia("(max-width: 767px)").matches,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches},[]),t=e?we:Me;return r.jsx("div",{className:"earth-experience","aria-hidden":"true",children:r.jsx(J,{children:r.jsx(O,{camera:t,dpr:[1,1.5],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},shadows:!e,performance:{min:.55},children:r.jsx(o.Suspense,{fallback:null,children:r.jsx(ye,{isMobile:e,reducedMotion:i})})})})})}export{Re as default};
