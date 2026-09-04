import{j as t,r as i}from"./index-D9FeRegZ.js";import{V as m,e as X,A as T,d as Y,S as _,D as O,u as S,a as j,N as Z,B as ee,c as k,M as $,Q as te,C as re}from"./react-three-fiber.esm-BaQviMpk.js";import{a as H,u as q,s as oe,E as ae,B as ne,D as se,V as ie,S as ce}from"./Vignette-Drr-Ykql.js";import{B as h,E as Q,H as J,I as le,O as ue}from"./astronomy-DumPWoYK.js";function L({count:e,radius:o,spread:r,size:a=.55}){const n=i.useMemo(()=>{const s=new Float32Array(e*3),c=new X,u=new m;for(let l=0;l<e;l+=1){const d=o+Math.random()*r;c.set(d,Math.acos(1-Math.random()*2),Math.random()*Math.PI*2),u.setFromSpherical(c),s[l*3]=u.x,s[l*3+1]=u.y,s[l*3+2]=u.z}return s},[e,o,r]);return t.jsxs("points",{frustumCulled:!1,renderOrder:-20,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[n,3]})}),t.jsx("pointsMaterial",{color:"#dce6f4",size:a,sizeAttenuation:!0,transparent:!0,opacity:.78,depthWrite:!1,depthTest:!0,blending:T})]})}function me(){const e=i.useMemo(()=>{const o=document.createElement("canvas");o.width=1024,o.height=512;const r=o.getContext("2d"),a=r.createLinearGradient(0,0,o.width,o.height);a.addColorStop(0,"rgba(8, 10, 24, 0)"),a.addColorStop(.35,"rgba(40, 48, 92, 0.08)"),a.addColorStop(.52,"rgba(120, 110, 180, 0.16)"),a.addColorStop(.68,"rgba(180, 140, 210, 0.1)"),a.addColorStop(1,"rgba(8, 10, 24, 0)"),r.fillStyle=a,r.fillRect(0,0,o.width,o.height);const n=new Y(o);return n.colorSpace=_,n},[]);return t.jsxs("mesh",{rotation:[1.1,.4,.2],position:[0,0,-28],scale:[48,20,1],renderOrder:-25,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("meshBasicMaterial",{map:e,transparent:!0,opacity:.55,depthWrite:!1,depthTest:!0,side:O})]})}function A({position:e,color:o,size:r}){const a=i.useRef(null);return S(({clock:n})=>{a.current&&(a.current.rotation.y=n.getElapsedTime()*.04)}),t.jsxs("mesh",{ref:a,position:e,renderOrder:-15,children:[t.jsx("sphereGeometry",{args:[r,24,24]}),t.jsx("meshStandardMaterial",{color:o,emissive:o,emissiveIntensity:.08,roughness:.85,metalness:.05})]})}function de({isMobile:e=!1}){const o=e?1600:3800;return t.jsxs(t.Fragment,{children:[t.jsx("color",{attach:"background",args:["#010208"]}),t.jsx("fog",{attach:"fog",args:["#010208",16,42]}),t.jsx(L,{count:o,radius:72,spread:48,size:e?.48:.58}),t.jsx(L,{count:Math.floor(o*.32),radius:110,spread:60,size:e?.32:.4}),t.jsx(me,{}),t.jsx(A,{position:[-14,3.2,-28],color:"#8a7898",size:.35}),t.jsx(A,{position:[16,-2.2,-32],color:"#6a88b0",size:.28}),t.jsx(A,{position:[5,6.5,-36],color:"#b89070",size:.22})]})}const M=Math.PI/180;function w(){return new Date}function he(e){return e.getTime()/864e5+24405875e-1}function fe(e){const r=he(e)-2451545,a=(280.46+.9856474*r)%360*M,n=(357.528+.9856003*r)%360*M,s=a+(1.915*Math.sin(n)+.02*Math.sin(2*n))*M,c=(23.439-4e-7*r)*M;return Math.asin(Math.sin(c)*Math.sin(s))}function N(e=w(),o=new m){const r=fe(e),n=(12-(e.getUTCHours()+e.getUTCMinutes()/60+e.getUTCSeconds()/3600+e.getUTCMilliseconds()/36e5))*15*M,s=Math.cos(r);return o.set(s*Math.cos(n),Math.sin(r),s*Math.sin(n)).normalize()}const D="/textures/theme3/",K=Math.PI,pe=.02,ve=`
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
`,ge=`
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
`,ye=`
  varying vec3 vNormalW;
  varying vec3 vNormalGeo;
  void main() {
    vNormalGeo = normalize(normal);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,xe=`
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
`,Me=`
  varying vec2 vUv;
  varying vec3 vNormalGeo;

  void main() {
    vUv = uv;
    vNormalGeo = normalize(normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Se=`
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
`;function De({radius:e=1.65,reducedMotion:o=!1,isMobile:r=!1,onSunDirectionChange:a}){const n=i.useRef(null),s=i.useRef(null),c=i.useRef(N(w(),new m)),u=i.useRef(new m),l=r?48:72,[d,f,v,p]=H([`${D}earth_day.jpg`,`${D}earth_lights.png`,`${D}earth_specular.jpg`,`${D}earth_clouds.png`]),x=i.useMemo(()=>new j({uniforms:{dayMap:{value:d},nightMap:{value:f},specularMap:{value:v},sunDirection:{value:c.current.clone()}},vertexShader:ve,fragmentShader:ge}),[d,f,v]),g=i.useMemo(()=>new j({uniforms:{cloudMap:{value:p},sunDirection:{value:c.current.clone()}},vertexShader:Me,fragmentShader:Se,transparent:!0,depthWrite:!1,blending:Z}),[p]),C=i.useMemo(()=>new j({uniforms:{sunDirection:{value:c.current.clone()}},vertexShader:ye,fragmentShader:xe,transparent:!0,depthWrite:!1,side:ee,blending:T}),[]),P=()=>{N(w(),c.current),x.uniforms.sunDirection.value.copy(c.current),g.uniforms.sunDirection.value.copy(c.current),C.uniforms.sunDirection.value.copy(c.current)};return i.useLayoutEffect(()=>{P()},[C,g,x]),i.useEffect(()=>{[d,f,v,p].forEach(E=>{E.colorSpace=_,E.anisotropy=r?4:8}),p.anisotropy=r?2:4,n.current&&(n.current.rotation.y=K),s.current&&(s.current.rotation.y=pe)},[p,d,r,f,v]),S((E,z)=>{o||(n.current&&(n.current.rotation.y+=z*.018),s.current&&(s.current.rotation.y+=z*.024)),P(),n.current&&a&&(u.current.copy(c.current),u.current.applyQuaternion(n.current.quaternion),a(u.current))}),t.jsxs("group",{ref:n,children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e,l,l]}),t.jsx("primitive",{object:x,attach:"material"})]}),t.jsxs("mesh",{ref:s,scale:1.006,children:[t.jsx("sphereGeometry",{args:[e,l,l]}),t.jsx("primitive",{object:g,attach:"material"})]}),t.jsxs("mesh",{scale:1.045,children:[t.jsx("sphereGeometry",{args:[e,r?32:48,r?32:48]}),t.jsx("primitive",{object:C,attach:"material"})]})]})}const je=`
  varying vec2 vUv;
  varying vec3 vNormalWorld;

  void main() {
    vUv = uv;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,we=`
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
`;function be({colorMap:e,isMobile:o=!1,sunDirection:r,emissiveIntensity:a=0,emissiveColor:n="#000000"}){return new j({uniforms:{colorMap:{value:e},sunDirection:{value:r.clone()},surfaceColor:{value:new k(o?"#c4c0b8":"#b8b4ae")},emissiveColor:{value:new k(n)},emissiveIntensity:{value:a}},vertexShader:je,fragmentShader:we})}const Ce="/textures/theme5/",Ee=1.65,Ae=Ee*.24,Re=4.05,Ie=.28;function Ne({isMobile:e=!1,reducedMotion:o=!1,sunDirectionRef:r}){const a=i.useRef(null),n=i.useRef(null),s=q(),c=i.useRef(0),u=i.useRef(new m(1,0,0)),[l]=H([`${Ce}moon_color.jpg`]);i.useEffect(()=>{l.colorSpace=_,l.anisotropy=e?4:8},[l,e]);const d=e?32:48,f=i.useMemo(()=>be({colorMap:l,isMobile:e,sunDirection:u.current}),[l,e]);return S((v,p)=>{if(r!=null&&r.current&&f.uniforms.sunDirection.value.copy(r.current),!a.current||!n.current||!s)return;const x=s.current,g=v.clock.elapsedTime*.055+x*Math.PI*1.45;c.current=o?g:$.damp(c.current,g,2.4,p),a.current.rotation.y=c.current,a.current.rotation.x=Ie,n.current.rotation.y=-c.current}),t.jsx("group",{ref:a,children:t.jsx("group",{position:[Re,.18,0],children:t.jsx("mesh",{ref:n,material:f,castShadow:!0,receiveShadow:!0,children:t.jsx("sphereGeometry",{args:[Ae,d,d]})})})})}const y=Math.PI/180,b=new ue(18.5204,73.8567,560),Te=30,_e=8,Pe=14,ze=-6,ke=4.1,Le=4,Ue=[{key:"Mercury",body:h.Mercury,label:"Mercury",color:"#b8b2a8",emissive:"#5a5548",radius:.034},{key:"Venus",body:h.Venus,label:"Venus",color:"#e8dcc8",emissive:"#b8a078",radius:.052},{key:"Mars",body:h.Mars,label:"Mars",color:"#c47858",emissive:"#7a3828",radius:.042},{key:"Jupiter",body:h.Jupiter,label:"Jupiter",color:"#c9b59a",emissive:"#8a7560",radius:.078},{key:"Saturn",body:h.Saturn,label:"Saturn",color:"#ddd0b0",emissive:"#9a8870",radius:.068,ring:!0},{key:"Uranus",body:h.Uranus,label:"Uranus",color:"#9ec4c4",emissive:"#5a8080",radius:.036},{key:"Neptune",body:h.Neptune,label:"Neptune",color:"#6080c0",emissive:"#384878",radius:.036}];function Ge(e,o,r,a){const n=e*y,s=r*y,c=(a-o)*y,u=Math.sin(n)*Math.sin(s)+Math.cos(n)*Math.cos(s)*Math.cos(c);return Math.acos(Math.min(1,Math.max(-1,u)))/y}function Fe(e){const o=Q(h.Sun,e,b,!0,!0);return J(e,b,o.ra,o.dec,"normal")}function We(e){return e<-2?4:e<0?6:_e}function Ve(e,o,r,a){if(o.altitude<We(a)||a>ke)return!1;const n=Ge(o.altitude,o.azimuth,r.altitude,r.azimuth);return!(r.altitude>ze&&(n<Pe||r.altitude>-1&&a>-.5||(e==="Mercury"||e==="Venus")&&n<22))}function R(e=new Date){const o=Fe(e),r=[];for(const a of Ue){const n=Q(a.body,e,b,!0,!0),s=J(e,b,n.ra,n.dec,"normal"),c=le(a.body,e);Ve(a.key,s,o,c.mag)&&r.push({...a,altitude:s.altitude,azimuth:s.azimuth,magnitude:c.mag,phase:c.phase_fraction})}return r.sort((a,n)=>a.magnitude-n.magnitude),r.slice(0,Le)}function Be(e,o,r=new m){const a=e*y,n=o*y;return r.set(Math.cos(n)*Math.sin(a),Math.sin(n),Math.cos(n)*Math.cos(a)).normalize()}const U=new m,Oe=30;function $e({planet:e,isMobile:o}){const r=i.useMemo(()=>(Be(e.azimuth,e.altitude,U),U.clone().multiplyScalar(Te)),[e.altitude,e.azimuth]),a=e.radius*2.6;return t.jsxs("group",{position:r,children:[t.jsxs("mesh",{scale:a,children:[t.jsx("sphereGeometry",{args:[1,14,14]}),t.jsx("meshBasicMaterial",{color:e.color,transparent:!0,opacity:.07,depthWrite:!1,blending:T})]}),t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e.radius,o?14:18,o?14:18]}),t.jsx("meshStandardMaterial",{color:e.color,emissive:e.emissive,emissiveIntensity:.28+Math.max(0,-e.magnitude)*.04,roughness:.92,metalness:.03})]}),e.ring?t.jsxs("mesh",{rotation:[Math.PI/2.35,.35,0],children:[t.jsx("ringGeometry",{args:[e.radius*1.34,e.radius*2.02,40]}),t.jsx("meshStandardMaterial",{color:"#c8bc98",emissive:"#8a8068",emissiveIntensity:.08,transparent:!0,opacity:.2,side:O,depthWrite:!1})]}):null]})}function He({isMobile:e=!1}){const[o,r]=i.useState(()=>R(new Date)),a=i.useRef(0);return i.useLayoutEffect(()=>{r(R(new Date))},[]),S((n,s)=>{a.current+=s,!(a.current<Oe)&&(a.current=0,r(R(new Date)))}),o.length?t.jsx("group",{name:"pune-visible-planets",children:o.map(n=>t.jsx($e,{planet:n,isMobile:e},n.key))}):null}const G=[{position:[.2,.35,6.4],lookAt:[0,0,0]},{position:[3.8,.75,4.8],lookAt:[0,.05,0]},{position:[1.2,1.15,3.85],lookAt:[0,.08,0]},{position:[-3.6,.85,4.5],lookAt:[0,.02,0]},{position:[.4,1.55,6.1],lookAt:[0,0,0]}];function qe(e){return e?G.map(({position:o,lookAt:r})=>({position:[o[0]*.76,o[1],o[2]*1.34],lookAt:[...r]})):G}const F=new m,W=new m,V=new m(0,0,0);function Qe({isMobile:e=!1,reducedMotion:o=!1}){const r=q(),a=i.useRef(0),n=i.useRef(qe(e));return S((s,c)=>{if(!r)return;const u=r.current;a.current=o?u:$.damp(a.current,u,2.8,c);const l=oe(a.current,n.current);F.set(l.position[0],l.position[1],l.position[2]),W.set(l.lookAt[0],l.lookAt[1],l.lookAt[2]),s.camera.position.lerp(F,1-Math.exp(-3.6*c)),V.lerp(W,1-Math.exp(-3.6*c)),s.camera.lookAt(V)}),null}const B=new m,I=new m,Je=new te().setFromAxisAngle(new m(0,1,0),K);function Ke({isMobile:e=!1}){return t.jsxs(ae,{multisampling:0,children:[t.jsx(ne,{intensity:.38,luminanceThreshold:.12,luminanceSmoothing:.72,mipmapBlur:!0}),e?null:t.jsx(se,{focusDistance:.012,focalLength:.045,bokehScale:1.6,height:540}),t.jsx(ie,{eskil:!0,offset:.14,darkness:.72})]})}function Xe({isMobile:e=!1,reducedMotion:o=!1}){const r=i.useRef(null),a=i.useRef(new m);i.useLayoutEffect(()=>{r.current&&(N(w(),B),I.copy(B).applyQuaternion(Je),a.current.copy(I),r.current.position.copy(I).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())},[]);const n=s=>{a.current.copy(s),r.current&&(r.current.position.copy(s).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())};return t.jsxs(t.Fragment,{children:[t.jsx(de,{isMobile:e,reducedMotion:o}),t.jsx("ambientLight",{intensity:.028,color:"#6078a8"}),t.jsx("directionalLight",{ref:r,position:[6,2.5,4],intensity:1.35,color:"#fff8ee",castShadow:!e,"shadow-mapSize":e?[512,512]:[1024,1024],"shadow-camera-near":.5,"shadow-camera-far":24,"shadow-camera-left":-6,"shadow-camera-right":6,"shadow-camera-top":6,"shadow-camera-bottom":-6,"shadow-bias":-2e-4}),t.jsx("directionalLight",{position:[-4,-1,-3],intensity:.03,color:"#506090"}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(De,{isMobile:e,reducedMotion:o,onSunDirectionChange:n})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(Ne,{isMobile:e,reducedMotion:o,sunDirectionRef:a})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(He,{isMobile:e})}),t.jsx(Qe,{isMobile:e,reducedMotion:o}),t.jsx(Ke,{isMobile:e})]})}const Ye={position:[.2,.35,6.4],fov:42,near:.1,far:120},Ze={position:[.15,.35,8.4],fov:54,near:.1,far:120};function at(){const{isMobile:e,reducedMotion:o}=i.useMemo(()=>typeof window>"u"?{isMobile:!1,reducedMotion:!1}:{isMobile:window.matchMedia("(max-width: 767px)").matches,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches},[]),r=e?Ze:Ye;return t.jsx("div",{className:"earth-experience","aria-hidden":"true",children:t.jsx(ce,{children:t.jsx(re,{camera:r,dpr:[1,1.5],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},shadows:!e,performance:{min:.55},children:t.jsx(i.Suspense,{fallback:null,children:t.jsx(Xe,{isMobile:e,reducedMotion:o})})})})})}export{at as default};
