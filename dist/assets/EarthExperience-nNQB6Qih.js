import{j as t,r as i}from"./index-CR_Cqfy_.js";import{V as u,e as ve,A as W,d as ge,S as V,D as ie,u as I,Q as ye,a as N,N as xe,B as Me,M as P,c as $,C as Se}from"./react-three-fiber.esm-Bm1usxFo.js";import{u as B,a as ce,s as we,E as De,B as be,D as je,V as Ce,S as Re}from"./Vignette-B6FZpPEY.js";import{B as x,E as le,H as ue,I as Ee,O as Ae}from"./astronomy-DumPWoYK.js";function H({count:e,radius:o,spread:r,size:n=.55}){const a=i.useMemo(()=>{const s=new Float32Array(e*3),c=new ve,m=new u;for(let l=0;l<e;l+=1){const d=o+Math.random()*r;c.set(d,Math.acos(1-Math.random()*2),Math.random()*Math.PI*2),m.setFromSpherical(c),s[l*3]=m.x,s[l*3+1]=m.y,s[l*3+2]=m.z}return s},[e,o,r]);return t.jsxs("points",{frustumCulled:!1,renderOrder:-20,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[a,3]})}),t.jsx("pointsMaterial",{color:"#dce6f4",size:n,sizeAttenuation:!0,transparent:!0,opacity:.78,depthWrite:!1,depthTest:!0,blending:W})]})}function Ie(){const e=i.useMemo(()=>{const o=document.createElement("canvas");o.width=1024,o.height=512;const r=o.getContext("2d"),n=r.createLinearGradient(0,0,o.width,o.height);n.addColorStop(0,"rgba(8, 10, 24, 0)"),n.addColorStop(.35,"rgba(40, 48, 92, 0.08)"),n.addColorStop(.52,"rgba(120, 110, 180, 0.16)"),n.addColorStop(.68,"rgba(180, 140, 210, 0.1)"),n.addColorStop(1,"rgba(8, 10, 24, 0)"),r.fillStyle=n,r.fillRect(0,0,o.width,o.height);const a=new ge(o);return a.colorSpace=V,a},[]);return t.jsxs("mesh",{rotation:[1.1,.4,.2],position:[0,0,-28],scale:[48,20,1],renderOrder:-25,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("meshBasicMaterial",{map:e,transparent:!0,opacity:.55,depthWrite:!1,depthTest:!0,side:ie})]})}function U({position:e,color:o,size:r}){const n=i.useRef(null);return I(({clock:a})=>{n.current&&(n.current.rotation.y=a.getElapsedTime()*.04)}),t.jsxs("mesh",{ref:n,position:e,renderOrder:-15,children:[t.jsx("sphereGeometry",{args:[r,24,24]}),t.jsx("meshStandardMaterial",{color:o,emissive:o,emissiveIntensity:.08,roughness:.85,metalness:.05})]})}function Te({isMobile:e=!1}){const o=e?1600:3800;return t.jsxs(t.Fragment,{children:[t.jsx("color",{attach:"background",args:["#010208"]}),t.jsx("fog",{attach:"fog",args:["#010208",16,42]}),t.jsx(H,{count:o,radius:72,spread:48,size:e?.48:.58}),t.jsx(H,{count:Math.floor(o*.32),radius:110,spread:60,size:e?.32:.4}),t.jsx(Ie,{}),t.jsx(U,{position:[-14,3.2,-28],color:"#8a7898",size:.35}),t.jsx(U,{position:[16,-2.2,-32],color:"#6a88b0",size:.28}),t.jsx(U,{position:[5,6.5,-36],color:"#b89070",size:.22})]})}const A=Math.PI/180;function v(){return new Date}function ke(e){return e.getTime()/864e5+24405875e-1}function Ne(e){const r=ke(e)-2451545,n=(280.46+.9856474*r)%360*A,a=(357.528+.9856003*r)%360*A,s=n+(1.915*Math.sin(a)+.02*Math.sin(2*a))*A,c=(23.439-4e-7*r)*A;return Math.asin(Math.sin(c)*Math.sin(s))}function me(e=v(),o=new u){const r=Ne(e),a=(12-(e.getUTCHours()+e.getUTCMinutes()/60+e.getUTCSeconds()/3600+e.getUTCMilliseconds()/36e5))*15*A,s=Math.cos(r);return o.set(s*Math.cos(a),Math.sin(r),s*Math.sin(a)).normalize()}function C(e=v(),o=new u){return me(e,o)}const q=new ye;function Pe(e,o,r=new u,n=new u){return me(e??v(),n),o?(q.copy(o).invert(),r.copy(n).applyQuaternion(q)):r.copy(n),r}const k="/textures/theme3/",Y=Math.PI,J=.02,Le=`
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
`,_e=`
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
`,ze=`
  varying vec3 vNormalW;
  varying vec3 vNormalGeo;
  void main() {
    vNormalGeo = normalize(normal);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ue=`
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
`,Ge=`
  varying vec2 vUv;
  varying vec3 vNormalGeo;

  void main() {
    vUv = uv;
    vNormalGeo = normalize(normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Fe=`
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
`;function We({radius:e=1.65,reducedMotion:o=!1,isMobile:r=!1,onSunDirectionChange:n}){const a=i.useRef(null),s=i.useRef(null),c=B(),m=i.useRef(0),l=i.useRef(C(v(),new u)),d=i.useRef(new u),M=r?48:72,[S,h,g,p]=ce([`${k}earth_day.jpg`,`${k}earth_lights.png`,`${k}earth_specular.jpg`,`${k}earth_clouds.png`]),R=i.useMemo(()=>new N({uniforms:{dayMap:{value:S},nightMap:{value:h},specularMap:{value:g},sunDirection:{value:l.current.clone()}},vertexShader:Le,fragmentShader:_e}),[S,h,g]),w=i.useMemo(()=>new N({uniforms:{cloudMap:{value:p},sunDirection:{value:l.current.clone()}},vertexShader:Ge,fragmentShader:Fe,transparent:!0,depthWrite:!1,blending:xe}),[p]),D=i.useMemo(()=>new N({uniforms:{sunDirection:{value:l.current.clone()}},vertexShader:ze,fragmentShader:Ue,transparent:!0,depthWrite:!1,side:Me,blending:W}),[]),E=()=>{var f;C(v(),d.current),Pe(v(),(f=a.current)==null?void 0:f.quaternion,l.current,d.current),R.uniforms.sunDirection.value.copy(l.current),w.uniforms.sunDirection.value.copy(l.current),D.uniforms.sunDirection.value.copy(l.current)};return i.useLayoutEffect(()=>{E()},[D,w,R]),i.useEffect(()=>{[S,h,g,p].forEach(f=>{f.colorSpace=V,f.anisotropy=r?4:8}),p.anisotropy=r?2:4,a.current&&(a.current.rotation.y=Y),s.current&&(s.current.rotation.y=J)},[p,S,r,h,g]),I((f,y)=>{if(r&&a.current&&c){const b=c.current,T=Math.sin(b*Math.PI)*.36;if(m.current=o?T:P.damp(m.current,T,2.6,y),a.current.rotation.y=Y+m.current,a.current.rotation.x=Math.sin(b*Math.PI*2)*.045,s.current){const _=o?0:f.clock.elapsedTime*.004;s.current.rotation.y=J+m.current*.08+_}}else o||(a.current&&(a.current.rotation.y+=y*.018),s.current&&(s.current.rotation.y+=y*.024));E(),n&&n(d.current)}),t.jsxs("group",{ref:a,children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e,M,M]}),t.jsx("primitive",{object:R,attach:"material"})]}),t.jsxs("mesh",{ref:s,scale:1.006,children:[t.jsx("sphereGeometry",{args:[e,M,M]}),t.jsx("primitive",{object:w,attach:"material"})]}),t.jsxs("mesh",{scale:1.045,children:[t.jsx("sphereGeometry",{args:[e,r?32:48,r?32:48]}),t.jsx("primitive",{object:D,attach:"material"})]})]})}const Ve=`
  varying vec2 vUv;
  varying vec3 vNormalWorld;

  void main() {
    vUv = uv;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Be=`
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
`;function Oe({colorMap:e,isMobile:o=!1,sunDirection:r,emissiveIntensity:n=0,emissiveColor:a="#000000"}){return new N({uniforms:{colorMap:{value:e},sunDirection:{value:r.clone()},surfaceColor:{value:new $(o?"#c4c0b8":"#b8b4ae")},emissiveColor:{value:new $(a)},emissiveIntensity:{value:n}},vertexShader:Ve,fragmentShader:Be})}const $e="/textures/theme5/",de=1.65,K=.2,Q={desktop:{radius:de*.24,orbitRadius:4.05,orbitY:.18,orbitZ:0,incline:.28},mobile:{scrollDrift:.05,depthOffset:.65}},X=new u(0,0,0),He=new u,Z=new u,ee=new u,te=new u,re=new u;function qe({isMobile:e=!1,reducedMotion:o=!1,sunDirectionRef:r}){const n=Q.desktop,a=Q.mobile,s=i.useRef(null),c=i.useRef(null),m=i.useRef(null),l=B(),d=i.useRef(0),M=i.useRef(de*.5),S=i.useRef(C(v(),new u)),[h]=ce([`${$e}moon_color.jpg`]);i.useEffect(()=>{h.colorSpace=V,h.anisotropy=e?4:8},[h,e]);const g=e?32:48,p=i.useMemo(()=>Oe({colorMap:h,isMobile:e,sunDirection:S.current,emissiveIntensity:e?.16:0,emissiveColor:e?"#3f3c38":"#000000"}),[h,e]);I((w,D)=>{if(r!=null&&r.current?p.uniforms.sunDirection.value.copy(r.current):C(v(),p.uniforms.sunDirection.value),!c.current||!l)return;const E=l.current;if(e&&m.current){const{camera:y}=w,b=Math.sin(E*Math.PI*2)*a.scrollDrift;y.updateMatrixWorld(),y.matrixWorld.extractBasis(He,Z,ee);const T=y.position.distanceTo(X),_=P.degToRad(y.fov),O=2*Math.tan(_/2)*T,he=O*y.aspect,pe=2*Math.sqrt(K*(2-K)),z=he/pe;M.current=z;const fe=-O*.3+b*.04-z;te.copy(X).add(Z.clone().multiplyScalar(fe)).add(ee.clone().multiplyScalar(a.depthOffset)),m.current.position.copy(te),re.setScalar(z),c.current.scale.copy(re),c.current.rotation.y+=D*(o?.012:.035),c.current.rotation.x=.08+b*.04,c.current.rotation.z=b*.02;return}if(!s.current)return;const f=w.clock.elapsedTime*.055+E*Math.PI*1.45;d.current=o?f:P.damp(d.current,f,2.4,D),s.current.rotation.y=d.current,s.current.rotation.x=n.incline,c.current.rotation.y=-d.current,c.current.scale.setScalar(1)});const R=t.jsx("mesh",{ref:c,material:p,castShadow:!e,receiveShadow:!0,renderOrder:e?1:0,children:t.jsx("sphereGeometry",{args:[1,g,g]})});return e?t.jsx("group",{ref:m,children:R}):t.jsx("group",{ref:s,children:t.jsx("group",{position:[n.orbitRadius,n.orbitY,n.orbitZ],children:t.jsx("mesh",{ref:c,material:p,castShadow:!0,receiveShadow:!0,children:t.jsx("sphereGeometry",{args:[n.radius,g,g]})})})})}const j=Math.PI/180,L=new Ae(18.5204,73.8567,560),Ye=30,Je=8,Ke=14,Qe=-6,Xe=4.1,Ze=4,et=[{key:"Mercury",body:x.Mercury,label:"Mercury",color:"#b8b2a8",emissive:"#5a5548",radius:.034},{key:"Venus",body:x.Venus,label:"Venus",color:"#e8dcc8",emissive:"#b8a078",radius:.052},{key:"Mars",body:x.Mars,label:"Mars",color:"#c47858",emissive:"#7a3828",radius:.042},{key:"Jupiter",body:x.Jupiter,label:"Jupiter",color:"#c9b59a",emissive:"#8a7560",radius:.078},{key:"Saturn",body:x.Saturn,label:"Saturn",color:"#ddd0b0",emissive:"#9a8870",radius:.068,ring:!0},{key:"Uranus",body:x.Uranus,label:"Uranus",color:"#9ec4c4",emissive:"#5a8080",radius:.036},{key:"Neptune",body:x.Neptune,label:"Neptune",color:"#6080c0",emissive:"#384878",radius:.036}];function tt(e,o,r,n){const a=e*j,s=r*j,c=(n-o)*j,m=Math.sin(a)*Math.sin(s)+Math.cos(a)*Math.cos(s)*Math.cos(c);return Math.acos(Math.min(1,Math.max(-1,m)))/j}function rt(e){const o=le(x.Sun,e,L,!0,!0);return ue(e,L,o.ra,o.dec,"normal")}function ot(e){return e<-2?4:e<0?6:Je}function nt(e,o,r,n){if(o.altitude<ot(n)||n>Xe)return!1;const a=tt(o.altitude,o.azimuth,r.altitude,r.azimuth);return!(r.altitude>Qe&&(a<Ke||r.altitude>-1&&n>-.5||(e==="Mercury"||e==="Venus")&&a<22))}function G(e=new Date){const o=rt(e),r=[];for(const n of et){const a=le(n.body,e,L,!0,!0),s=ue(e,L,a.ra,a.dec,"normal"),c=Ee(n.body,e);nt(n.key,s,o,c.mag)&&r.push({...n,altitude:s.altitude,azimuth:s.azimuth,magnitude:c.mag,phase:c.phase_fraction})}return r.sort((n,a)=>n.magnitude-a.magnitude),r.slice(0,Ze)}function at(e,o,r=new u){const n=e*j,a=o*j;return r.set(Math.cos(a)*Math.sin(n),Math.sin(a),Math.cos(a)*Math.cos(n)).normalize()}const oe=new u,st=30;function it({planet:e,isMobile:o}){const r=i.useMemo(()=>(at(e.azimuth,e.altitude,oe),oe.clone().multiplyScalar(Ye)),[e.altitude,e.azimuth]),n=e.radius*2.6;return t.jsxs("group",{position:r,children:[t.jsxs("mesh",{scale:n,children:[t.jsx("sphereGeometry",{args:[1,14,14]}),t.jsx("meshBasicMaterial",{color:e.color,transparent:!0,opacity:.07,depthWrite:!1,blending:W})]}),t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e.radius,o?14:18,o?14:18]}),t.jsx("meshStandardMaterial",{color:e.color,emissive:e.emissive,emissiveIntensity:.28+Math.max(0,-e.magnitude)*.04,roughness:.92,metalness:.03})]}),e.ring?t.jsxs("mesh",{rotation:[Math.PI/2.35,.35,0],children:[t.jsx("ringGeometry",{args:[e.radius*1.34,e.radius*2.02,40]}),t.jsx("meshStandardMaterial",{color:"#c8bc98",emissive:"#8a8068",emissiveIntensity:.08,transparent:!0,opacity:.2,side:ie,depthWrite:!1})]}):null]})}function ct({isMobile:e=!1}){const[o,r]=i.useState(()=>G(new Date)),n=i.useRef(0);return i.useLayoutEffect(()=>{r(G(new Date))},[]),I((a,s)=>{n.current+=s,!(n.current<st)&&(n.current=0,r(G(new Date)))}),o.length?t.jsx("group",{name:"pune-visible-planets",children:o.map(a=>t.jsx(it,{planet:a,isMobile:e},a.key))}):null}const lt=[{position:[.2,.35,6.4],lookAt:[0,0,0]},{position:[3.8,.75,4.8],lookAt:[0,.05,0]},{position:[1.2,1.15,3.85],lookAt:[0,.08,0]},{position:[-3.6,.85,4.5],lookAt:[0,.02,0]},{position:[.4,1.55,6.1],lookAt:[0,0,0]}],ut=[{position:[.15,.35,8.4],lookAt:[0,0,0]},{position:[.22,.42,7.55],lookAt:[0,.015,0]},{position:[.1,.52,6.85],lookAt:[0,.03,0]},{position:[-.08,.44,7.25],lookAt:[0,.02,0]},{position:[.14,.4,8.15],lookAt:[0,0,0]}];function mt(e){return e?ut:lt}const ne=new u,ae=new u,se=new u(0,0,0);function dt({isMobile:e=!1,reducedMotion:o=!1}){const r=B(),n=i.useRef(0),a=i.useRef(mt(e));return I((s,c)=>{if(!r)return;const m=r.current;n.current=o?m:P.damp(n.current,m,2.8,c);const l=we(n.current,a.current);ne.set(l.position[0],l.position[1],l.position[2]),ae.set(l.lookAt[0],l.lookAt[1],l.lookAt[2]),s.camera.position.lerp(ne,1-Math.exp(-3.6*c)),se.lerp(ae,1-Math.exp(-3.6*c)),s.camera.lookAt(se)}),null}const F=new u;function ht({isMobile:e=!1}){return t.jsxs(De,{multisampling:0,children:[t.jsx(be,{intensity:.38,luminanceThreshold:.12,luminanceSmoothing:.72,mipmapBlur:!0}),e?null:t.jsx(je,{focusDistance:.012,focalLength:.045,bokehScale:1.6,height:540}),t.jsx(Ce,{eskil:!0,offset:.14,darkness:.72})]})}function pt({isMobile:e=!1,reducedMotion:o=!1}){const r=i.useRef(null),n=i.useRef(C(v(),new u));i.useLayoutEffect(()=>{r.current&&(C(v(),F),n.current.copy(F),r.current.position.copy(F).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())},[]);const a=s=>{n.current.copy(s),r.current&&(r.current.position.copy(s).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())};return t.jsxs(t.Fragment,{children:[t.jsx(Te,{isMobile:e,reducedMotion:o}),t.jsx("ambientLight",{intensity:.028,color:"#6078a8"}),t.jsx("directionalLight",{ref:r,position:[6,2.5,4],intensity:1.35,color:"#fff8ee",castShadow:!e,"shadow-mapSize":e?[512,512]:[1024,1024],"shadow-camera-near":.5,"shadow-camera-far":24,"shadow-camera-left":-6,"shadow-camera-right":6,"shadow-camera-top":6,"shadow-camera-bottom":-6,"shadow-bias":-2e-4}),t.jsx("directionalLight",{position:[-4,-1,-3],intensity:.03,color:"#506090"}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(We,{isMobile:e,reducedMotion:o,onSunDirectionChange:a})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(qe,{isMobile:e,reducedMotion:o,sunDirectionRef:n})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(ct,{isMobile:e})}),t.jsx(dt,{isMobile:e,reducedMotion:o}),t.jsx(ht,{isMobile:e})]})}const ft={position:[.2,.35,6.4],fov:42,near:.1,far:120},vt={position:[.15,.35,8.4],fov:54,near:.1,far:120};function wt(){const{isMobile:e,reducedMotion:o}=i.useMemo(()=>typeof window>"u"?{isMobile:!1,reducedMotion:!1}:{isMobile:window.matchMedia("(max-width: 767px)").matches,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches},[]),r=e?vt:ft;return t.jsx("div",{className:"earth-experience","aria-hidden":"true",children:t.jsx(Re,{children:t.jsx(Se,{camera:r,dpr:[1,1.5],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},shadows:!e,performance:{min:.55},children:t.jsx(i.Suspense,{fallback:null,children:t.jsx(pt,{isMobile:e,reducedMotion:o})})})})})}export{wt as default};
