import{j as t,r as i}from"./index-CR_Cqfy_.js";import{V as m,e as X,A as T,d as Y,S as _,D as O,u as w,Q as Z,a as C,N as ee,B as te,c as k,M as $,C as re}from"./react-three-fiber.esm-Bm1usxFo.js";import{a as H,u as q,s as oe,E as ne,B as ae,D as se,V as ie,S as ce}from"./Vignette-B6FZpPEY.js";import{B as p,E as J,H as K,I as le,O as ue}from"./astronomy-DumPWoYK.js";function L({count:e,radius:o,spread:r,size:n=.55}){const a=i.useMemo(()=>{const s=new Float32Array(e*3),c=new X,u=new m;for(let l=0;l<e;l+=1){const h=o+Math.random()*r;c.set(h,Math.acos(1-Math.random()*2),Math.random()*Math.PI*2),u.setFromSpherical(c),s[l*3]=u.x,s[l*3+1]=u.y,s[l*3+2]=u.z}return s},[e,o,r]);return t.jsxs("points",{frustumCulled:!1,renderOrder:-20,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[a,3]})}),t.jsx("pointsMaterial",{color:"#dce6f4",size:n,sizeAttenuation:!0,transparent:!0,opacity:.78,depthWrite:!1,depthTest:!0,blending:T})]})}function me(){const e=i.useMemo(()=>{const o=document.createElement("canvas");o.width=1024,o.height=512;const r=o.getContext("2d"),n=r.createLinearGradient(0,0,o.width,o.height);n.addColorStop(0,"rgba(8, 10, 24, 0)"),n.addColorStop(.35,"rgba(40, 48, 92, 0.08)"),n.addColorStop(.52,"rgba(120, 110, 180, 0.16)"),n.addColorStop(.68,"rgba(180, 140, 210, 0.1)"),n.addColorStop(1,"rgba(8, 10, 24, 0)"),r.fillStyle=n,r.fillRect(0,0,o.width,o.height);const a=new Y(o);return a.colorSpace=_,a},[]);return t.jsxs("mesh",{rotation:[1.1,.4,.2],position:[0,0,-28],scale:[48,20,1],renderOrder:-25,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("meshBasicMaterial",{map:e,transparent:!0,opacity:.55,depthWrite:!1,depthTest:!0,side:O})]})}function I({position:e,color:o,size:r}){const n=i.useRef(null);return w(({clock:a})=>{n.current&&(n.current.rotation.y=a.getElapsedTime()*.04)}),t.jsxs("mesh",{ref:n,position:e,renderOrder:-15,children:[t.jsx("sphereGeometry",{args:[r,24,24]}),t.jsx("meshStandardMaterial",{color:o,emissive:o,emissiveIntensity:.08,roughness:.85,metalness:.05})]})}function de({isMobile:e=!1}){const o=e?1600:3800;return t.jsxs(t.Fragment,{children:[t.jsx("color",{attach:"background",args:["#010208"]}),t.jsx("fog",{attach:"fog",args:["#010208",16,42]}),t.jsx(L,{count:o,radius:72,spread:48,size:e?.48:.58}),t.jsx(L,{count:Math.floor(o*.32),radius:110,spread:60,size:e?.32:.4}),t.jsx(me,{}),t.jsx(I,{position:[-14,3.2,-28],color:"#8a7898",size:.35}),t.jsx(I,{position:[16,-2.2,-32],color:"#6a88b0",size:.28}),t.jsx(I,{position:[5,6.5,-36],color:"#b89070",size:.22})]})}const j=Math.PI/180;function d(){return new Date}function he(e){return e.getTime()/864e5+24405875e-1}function fe(e){const r=he(e)-2451545,n=(280.46+.9856474*r)%360*j,a=(357.528+.9856003*r)%360*j,s=n+(1.915*Math.sin(a)+.02*Math.sin(2*a))*j,c=(23.439-4e-7*r)*j;return Math.asin(Math.sin(c)*Math.sin(s))}function Q(e=d(),o=new m){const r=fe(e),a=(12-(e.getUTCHours()+e.getUTCMinutes()/60+e.getUTCSeconds()/3600+e.getUTCMilliseconds()/36e5))*15*j,s=Math.cos(r);return o.set(s*Math.cos(a),Math.sin(r),s*Math.sin(a)).normalize()}function S(e=d(),o=new m){return Q(e,o)}const U=new Z;function pe(e,o,r=new m,n=new m){return Q(e??d(),n),o?(U.copy(o).invert(),r.copy(n).applyQuaternion(U)):r.copy(n),r}const b="/textures/theme3/",ve=Math.PI,ge=.02,ye=`
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
`,xe=`
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
`,Me=`
  varying vec3 vNormalW;
  varying vec3 vNormalGeo;
  void main() {
    vNormalGeo = normalize(normal);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Se=`
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
`,De=`
  varying vec2 vUv;
  varying vec3 vNormalGeo;

  void main() {
    vUv = uv;
    vNormalGeo = normalize(normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,je=`
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
`;function we({radius:e=1.65,reducedMotion:o=!1,isMobile:r=!1,onSunDirectionChange:n}){const a=i.useRef(null),s=i.useRef(null),c=i.useRef(S(d(),new m)),u=i.useRef(new m),l=r?48:72,[h,f,g,v]=H([`${b}earth_day.jpg`,`${b}earth_lights.png`,`${b}earth_specular.jpg`,`${b}earth_clouds.png`]),D=i.useMemo(()=>new C({uniforms:{dayMap:{value:h},nightMap:{value:f},specularMap:{value:g},sunDirection:{value:c.current.clone()}},vertexShader:ye,fragmentShader:xe}),[h,f,g]),y=i.useMemo(()=>new C({uniforms:{cloudMap:{value:v},sunDirection:{value:c.current.clone()}},vertexShader:De,fragmentShader:je,transparent:!0,depthWrite:!1,blending:ee}),[v]),A=i.useMemo(()=>new C({uniforms:{sunDirection:{value:c.current.clone()}},vertexShader:Me,fragmentShader:Se,transparent:!0,depthWrite:!1,side:te,blending:T}),[]),P=()=>{var x;S(d(),u.current),pe(d(),(x=a.current)==null?void 0:x.quaternion,c.current,u.current),D.uniforms.sunDirection.value.copy(c.current),y.uniforms.sunDirection.value.copy(c.current),A.uniforms.sunDirection.value.copy(c.current)};return i.useLayoutEffect(()=>{P()},[A,y,D]),i.useEffect(()=>{[h,f,g,v].forEach(x=>{x.colorSpace=_,x.anisotropy=r?4:8}),v.anisotropy=r?2:4,a.current&&(a.current.rotation.y=ve),s.current&&(s.current.rotation.y=ge)},[v,h,r,f,g]),w((x,z)=>{o||(a.current&&(a.current.rotation.y+=z*.018),s.current&&(s.current.rotation.y+=z*.024)),P(),n&&n(u.current)}),t.jsxs("group",{ref:a,children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e,l,l]}),t.jsx("primitive",{object:D,attach:"material"})]}),t.jsxs("mesh",{ref:s,scale:1.006,children:[t.jsx("sphereGeometry",{args:[e,l,l]}),t.jsx("primitive",{object:y,attach:"material"})]}),t.jsxs("mesh",{scale:1.045,children:[t.jsx("sphereGeometry",{args:[e,r?32:48,r?32:48]}),t.jsx("primitive",{object:A,attach:"material"})]})]})}const be=`
  varying vec2 vUv;
  varying vec3 vNormalWorld;

  void main() {
    vUv = uv;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ce=`
  uniform sampler2D colorMap;
  uniform vec3 sunDirection;
  uniform vec3 surfaceColor;
  uniform vec3 emissiveColor;
  uniform float emissiveIntensity;
  varying vec2 vUv;
  varying vec3 vNormalWorld;

  void main() {
    vec3 normal = normalize(vNormalWorld);
    vec3 lightDir = normalize(sunDirection);
    float sunDot = -dot(normal, lightDir);
    float dayMix = smoothstep(-0.18, 0.82, sunDot);

    vec3 albedo = texture2D(colorMap, vUv).rgb * surfaceColor;
    vec3 ambient = albedo * 0.028;
    vec3 diffuse = albedo * dayMix * 1.35;

    vec3 fillDir = normalize(vec3(-4.0, -1.0, -3.0));
    float fillMix = max(-dot(normal, fillDir), 0.0) * 0.03;
    vec3 fill = albedo * fillMix;

    vec3 emissive = emissiveColor * emissiveIntensity;
    gl_FragColor = vec4(ambient + diffuse + fill + emissive, 1.0);
  }
`;function Ee({colorMap:e,isMobile:o=!1,sunDirection:r,emissiveIntensity:n=0,emissiveColor:a="#000000"}){return new C({uniforms:{colorMap:{value:e},sunDirection:{value:r.clone()},surfaceColor:{value:new k(o?"#c4c0b8":"#b8b4ae")},emissiveColor:{value:new k(a)},emissiveIntensity:{value:n}},vertexShader:be,fragmentShader:Ce})}const Ae="/textures/theme5/",Ie=1.65,Re=Ie*.24,Ne=4.05,Te=.28;function _e({isMobile:e=!1,reducedMotion:o=!1,sunDirectionRef:r}){const n=i.useRef(null),a=i.useRef(null),s=q(),c=i.useRef(0),u=i.useRef(S(d(),new m)),[l]=H([`${Ae}moon_color.jpg`]);i.useEffect(()=>{l.colorSpace=_,l.anisotropy=e?4:8},[l,e]);const h=e?32:48,f=i.useMemo(()=>Ee({colorMap:l,isMobile:e,sunDirection:u.current}),[l,e]);return w((g,v)=>{if(r!=null&&r.current?f.uniforms.sunDirection.value.copy(r.current):S(d(),f.uniforms.sunDirection.value),!n.current||!a.current||!s)return;const D=s.current,y=g.clock.elapsedTime*.055+D*Math.PI*1.45;c.current=o?y:$.damp(c.current,y,2.4,v),n.current.rotation.y=c.current,n.current.rotation.x=Te,a.current.rotation.y=-c.current}),t.jsx("group",{ref:n,children:t.jsx("group",{position:[Ne,.18,0],children:t.jsx("mesh",{ref:a,material:f,castShadow:!0,receiveShadow:!0,children:t.jsx("sphereGeometry",{args:[Re,h,h]})})})})}const M=Math.PI/180,E=new ue(18.5204,73.8567,560),Pe=30,ze=8,ke=14,Le=-6,Ue=4.1,Ge=4,Fe=[{key:"Mercury",body:p.Mercury,label:"Mercury",color:"#b8b2a8",emissive:"#5a5548",radius:.034},{key:"Venus",body:p.Venus,label:"Venus",color:"#e8dcc8",emissive:"#b8a078",radius:.052},{key:"Mars",body:p.Mars,label:"Mars",color:"#c47858",emissive:"#7a3828",radius:.042},{key:"Jupiter",body:p.Jupiter,label:"Jupiter",color:"#c9b59a",emissive:"#8a7560",radius:.078},{key:"Saturn",body:p.Saturn,label:"Saturn",color:"#ddd0b0",emissive:"#9a8870",radius:.068,ring:!0},{key:"Uranus",body:p.Uranus,label:"Uranus",color:"#9ec4c4",emissive:"#5a8080",radius:.036},{key:"Neptune",body:p.Neptune,label:"Neptune",color:"#6080c0",emissive:"#384878",radius:.036}];function Ve(e,o,r,n){const a=e*M,s=r*M,c=(n-o)*M,u=Math.sin(a)*Math.sin(s)+Math.cos(a)*Math.cos(s)*Math.cos(c);return Math.acos(Math.min(1,Math.max(-1,u)))/M}function Be(e){const o=J(p.Sun,e,E,!0,!0);return K(e,E,o.ra,o.dec,"normal")}function We(e){return e<-2?4:e<0?6:ze}function Oe(e,o,r,n){if(o.altitude<We(n)||n>Ue)return!1;const a=Ve(o.altitude,o.azimuth,r.altitude,r.azimuth);return!(r.altitude>Le&&(a<ke||r.altitude>-1&&n>-.5||(e==="Mercury"||e==="Venus")&&a<22))}function R(e=new Date){const o=Be(e),r=[];for(const n of Fe){const a=J(n.body,e,E,!0,!0),s=K(e,E,a.ra,a.dec,"normal"),c=le(n.body,e);Oe(n.key,s,o,c.mag)&&r.push({...n,altitude:s.altitude,azimuth:s.azimuth,magnitude:c.mag,phase:c.phase_fraction})}return r.sort((n,a)=>n.magnitude-a.magnitude),r.slice(0,Ge)}function $e(e,o,r=new m){const n=e*M,a=o*M;return r.set(Math.cos(a)*Math.sin(n),Math.sin(a),Math.cos(a)*Math.cos(n)).normalize()}const G=new m,He=30;function qe({planet:e,isMobile:o}){const r=i.useMemo(()=>($e(e.azimuth,e.altitude,G),G.clone().multiplyScalar(Pe)),[e.altitude,e.azimuth]),n=e.radius*2.6;return t.jsxs("group",{position:r,children:[t.jsxs("mesh",{scale:n,children:[t.jsx("sphereGeometry",{args:[1,14,14]}),t.jsx("meshBasicMaterial",{color:e.color,transparent:!0,opacity:.07,depthWrite:!1,blending:T})]}),t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e.radius,o?14:18,o?14:18]}),t.jsx("meshStandardMaterial",{color:e.color,emissive:e.emissive,emissiveIntensity:.28+Math.max(0,-e.magnitude)*.04,roughness:.92,metalness:.03})]}),e.ring?t.jsxs("mesh",{rotation:[Math.PI/2.35,.35,0],children:[t.jsx("ringGeometry",{args:[e.radius*1.34,e.radius*2.02,40]}),t.jsx("meshStandardMaterial",{color:"#c8bc98",emissive:"#8a8068",emissiveIntensity:.08,transparent:!0,opacity:.2,side:O,depthWrite:!1})]}):null]})}function Je({isMobile:e=!1}){const[o,r]=i.useState(()=>R(new Date)),n=i.useRef(0);return i.useLayoutEffect(()=>{r(R(new Date))},[]),w((a,s)=>{n.current+=s,!(n.current<He)&&(n.current=0,r(R(new Date)))}),o.length?t.jsx("group",{name:"pune-visible-planets",children:o.map(a=>t.jsx(qe,{planet:a,isMobile:e},a.key))}):null}const F=[{position:[.2,.35,6.4],lookAt:[0,0,0]},{position:[3.8,.75,4.8],lookAt:[0,.05,0]},{position:[1.2,1.15,3.85],lookAt:[0,.08,0]},{position:[-3.6,.85,4.5],lookAt:[0,.02,0]},{position:[.4,1.55,6.1],lookAt:[0,0,0]}];function Ke(e){return e?F.map(({position:o,lookAt:r})=>({position:[o[0]*.76,o[1],o[2]*1.34],lookAt:[...r]})):F}const V=new m,B=new m,W=new m(0,0,0);function Qe({isMobile:e=!1,reducedMotion:o=!1}){const r=q(),n=i.useRef(0),a=i.useRef(Ke(e));return w((s,c)=>{if(!r)return;const u=r.current;n.current=o?u:$.damp(n.current,u,2.8,c);const l=oe(n.current,a.current);V.set(l.position[0],l.position[1],l.position[2]),B.set(l.lookAt[0],l.lookAt[1],l.lookAt[2]),s.camera.position.lerp(V,1-Math.exp(-3.6*c)),W.lerp(B,1-Math.exp(-3.6*c)),s.camera.lookAt(W)}),null}const N=new m;function Xe({isMobile:e=!1}){return t.jsxs(ne,{multisampling:0,children:[t.jsx(ae,{intensity:.38,luminanceThreshold:.12,luminanceSmoothing:.72,mipmapBlur:!0}),e?null:t.jsx(se,{focusDistance:.012,focalLength:.045,bokehScale:1.6,height:540}),t.jsx(ie,{eskil:!0,offset:.14,darkness:.72})]})}function Ye({isMobile:e=!1,reducedMotion:o=!1}){const r=i.useRef(null),n=i.useRef(S(d(),new m));i.useLayoutEffect(()=>{r.current&&(S(d(),N),n.current.copy(N),r.current.position.copy(N).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())},[]);const a=s=>{n.current.copy(s),r.current&&(r.current.position.copy(s).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())};return t.jsxs(t.Fragment,{children:[t.jsx(de,{isMobile:e,reducedMotion:o}),t.jsx("ambientLight",{intensity:.028,color:"#6078a8"}),t.jsx("directionalLight",{ref:r,position:[6,2.5,4],intensity:1.35,color:"#fff8ee",castShadow:!e,"shadow-mapSize":e?[512,512]:[1024,1024],"shadow-camera-near":.5,"shadow-camera-far":24,"shadow-camera-left":-6,"shadow-camera-right":6,"shadow-camera-top":6,"shadow-camera-bottom":-6,"shadow-bias":-2e-4}),t.jsx("directionalLight",{position:[-4,-1,-3],intensity:.03,color:"#506090"}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(we,{isMobile:e,reducedMotion:o,onSunDirectionChange:a})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(_e,{isMobile:e,reducedMotion:o,sunDirectionRef:n})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(Je,{isMobile:e})}),t.jsx(Qe,{isMobile:e,reducedMotion:o}),t.jsx(Xe,{isMobile:e})]})}const Ze={position:[.2,.35,6.4],fov:42,near:.1,far:120},et={position:[.15,.35,8.4],fov:54,near:.1,far:120};function at(){const{isMobile:e,reducedMotion:o}=i.useMemo(()=>typeof window>"u"?{isMobile:!1,reducedMotion:!1}:{isMobile:window.matchMedia("(max-width: 767px)").matches,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches},[]),r=e?et:Ze;return t.jsx("div",{className:"earth-experience","aria-hidden":"true",children:t.jsx(ce,{children:t.jsx(re,{camera:r,dpr:[1,1.5],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},shadows:!e,performance:{min:.55},children:t.jsx(i.Suspense,{fallback:null,children:t.jsx(Ye,{isMobile:e,reducedMotion:o})})})})})}export{at as default};
