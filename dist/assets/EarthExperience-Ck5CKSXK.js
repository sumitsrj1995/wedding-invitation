import{j as t,r as c}from"./index-C-uicgD2.js";import{V as m,e as K,A as T,d as X,S as N,D as W,u as x,a as E,N as Y,B as Z,b as ee,c as te,M as O,Q as re,C as oe}from"./react-three-fiber.esm-zD_8Je7H.js";import{a as $,u as H,s as ae,E as ne,B as se,D as ie,V as ce,S as le}from"./Vignette-CIbUZzCm.js";import{B as p,E as q,H as Q,I as ue,O as me}from"./astronomy-DumPWoYK.js";function k({count:e,radius:o,spread:r,size:a=.55}){const n=c.useMemo(()=>{const s=new Float32Array(e*3),i=new K,u=new m;for(let l=0;l<e;l+=1){const h=o+Math.random()*r;i.set(h,Math.acos(1-Math.random()*2),Math.random()*Math.PI*2),u.setFromSpherical(i),s[l*3]=u.x,s[l*3+1]=u.y,s[l*3+2]=u.z}return s},[e,o,r]);return t.jsxs("points",{frustumCulled:!1,renderOrder:-20,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[n,3]})}),t.jsx("pointsMaterial",{color:"#dce6f4",size:a,sizeAttenuation:!0,transparent:!0,opacity:.78,depthWrite:!1,depthTest:!0,blending:T})]})}function he(){const e=c.useMemo(()=>{const o=document.createElement("canvas");o.width=1024,o.height=512;const r=o.getContext("2d"),a=r.createLinearGradient(0,0,o.width,o.height);a.addColorStop(0,"rgba(8, 10, 24, 0)"),a.addColorStop(.35,"rgba(40, 48, 92, 0.08)"),a.addColorStop(.52,"rgba(120, 110, 180, 0.16)"),a.addColorStop(.68,"rgba(180, 140, 210, 0.1)"),a.addColorStop(1,"rgba(8, 10, 24, 0)"),r.fillStyle=a,r.fillRect(0,0,o.width,o.height);const n=new X(o);return n.colorSpace=N,n},[]);return t.jsxs("mesh",{rotation:[1.1,.4,.2],position:[0,0,-28],scale:[48,20,1],renderOrder:-25,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("meshBasicMaterial",{map:e,transparent:!0,opacity:.55,depthWrite:!1,depthTest:!0,side:W})]})}function A({position:e,color:o,size:r}){const a=c.useRef(null);return x(({clock:n})=>{a.current&&(a.current.rotation.y=n.getElapsedTime()*.04)}),t.jsxs("mesh",{ref:a,position:e,renderOrder:-15,children:[t.jsx("sphereGeometry",{args:[r,24,24]}),t.jsx("meshStandardMaterial",{color:o,emissive:o,emissiveIntensity:.08,roughness:.85,metalness:.05})]})}function de({isMobile:e=!1}){const o=e?1600:3800;return t.jsxs(t.Fragment,{children:[t.jsx("color",{attach:"background",args:["#010208"]}),t.jsx("fog",{attach:"fog",args:["#010208",16,42]}),t.jsx(k,{count:o,radius:72,spread:48,size:e?.48:.58}),t.jsx(k,{count:Math.floor(o*.32),radius:110,spread:60,size:e?.32:.4}),t.jsx(he,{}),t.jsx(A,{position:[-14,3.2,-28],color:"#8a7898",size:.35}),t.jsx(A,{position:[16,-2.2,-32],color:"#6a88b0",size:.28}),t.jsx(A,{position:[5,6.5,-36],color:"#b89070",size:.22})]})}const y=Math.PI/180;function S(){return new Date}function pe(e){return e.getTime()/864e5+24405875e-1}function fe(e){const r=pe(e)-2451545,a=(280.46+.9856474*r)%360*y,n=(357.528+.9856003*r)%360*y,s=a+(1.915*Math.sin(n)+.02*Math.sin(2*n))*y,i=(23.439-4e-7*r)*y;return Math.asin(Math.sin(i)*Math.sin(s))}function I(e=S(),o=new m){const r=fe(e),n=(12-(e.getUTCHours()+e.getUTCMinutes()/60+e.getUTCSeconds()/3600+e.getUTCMilliseconds()/36e5))*15*y,s=Math.cos(r);return o.set(s*Math.cos(n),Math.sin(r),s*Math.sin(n)).normalize()}const M="/textures/theme3/",J=Math.PI,ge=.02,ve=`
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
`,ye=`
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
`,xe=`
  varying vec3 vNormalW;
  varying vec3 vNormalGeo;
  void main() {
    vNormalGeo = normalize(normal);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Me=`
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
`,Se=`
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
`;function De({radius:e=1.65,reducedMotion:o=!1,isMobile:r=!1,onSunDirectionChange:a}){const n=c.useRef(null),s=c.useRef(null),i=c.useRef(I(S(),new m)),u=c.useRef(new m),l=r?48:72,[h,f,g,d]=$([`${M}earth_day.jpg`,`${M}earth_lights.png`,`${M}earth_specular.jpg`,`${M}earth_clouds.png`]),D=c.useMemo(()=>new E({uniforms:{dayMap:{value:h},nightMap:{value:f},specularMap:{value:g},sunDirection:{value:i.current.clone()}},vertexShader:ve,fragmentShader:ye}),[h,f,g]),w=c.useMemo(()=>new E({uniforms:{cloudMap:{value:d},sunDirection:{value:i.current.clone()}},vertexShader:Se,fragmentShader:je,transparent:!0,depthWrite:!1,blending:Y}),[d]),b=c.useMemo(()=>new E({uniforms:{sunDirection:{value:i.current.clone()}},vertexShader:xe,fragmentShader:Me,transparent:!0,depthWrite:!1,side:Z,blending:T}),[]),P=()=>{I(S(),i.current),D.uniforms.sunDirection.value.copy(i.current),w.uniforms.sunDirection.value.copy(i.current),b.uniforms.sunDirection.value.copy(i.current)};return c.useLayoutEffect(()=>{P()},[b,w,D]),c.useEffect(()=>{[h,f,g,d].forEach(C=>{C.colorSpace=N,C.anisotropy=r?4:8}),d.anisotropy=r?2:4,n.current&&(n.current.rotation.y=J),s.current&&(s.current.rotation.y=ge)},[d,h,r,f,g]),x((C,_)=>{o||(n.current&&(n.current.rotation.y+=_*.018),s.current&&(s.current.rotation.y+=_*.024)),P(),n.current&&a&&(u.current.copy(i.current),u.current.applyQuaternion(n.current.quaternion),a(u.current))}),t.jsxs("group",{ref:n,children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e,l,l]}),t.jsx("primitive",{object:D,attach:"material"})]}),t.jsxs("mesh",{ref:s,scale:1.006,children:[t.jsx("sphereGeometry",{args:[e,l,l]}),t.jsx("primitive",{object:w,attach:"material"})]}),t.jsxs("mesh",{scale:1.045,children:[t.jsx("sphereGeometry",{args:[e,r?32:48,r?32:48]}),t.jsx("primitive",{object:b,attach:"material"})]})]})}const we="/textures/theme5/",be=1.65,Ce=be*.24,Ee=4.05,Ae=.28;function Re({isMobile:e=!1,reducedMotion:o=!1}){const r=c.useRef(null),a=c.useRef(null),n=H(),s=c.useRef(0),[i]=$([`${we}moon_color.jpg`]);c.useEffect(()=>{i.colorSpace=N,i.anisotropy=e?4:8},[i,e]);const u=e?32:48,l=c.useMemo(()=>new ee({map:i,bumpMap:i,bumpScale:e?.008:.012,roughness:.94,metalness:.015,color:new te("#b8b4ae")}),[i,e]);return x((h,f)=>{if(!r.current||!a.current||!n)return;const g=n.current,d=h.clock.elapsedTime*.055+g*Math.PI*1.45;s.current=o?d:O.damp(s.current,d,2.4,f),r.current.rotation.y=s.current,r.current.rotation.x=Ae,a.current.rotation.y=-s.current}),t.jsx("group",{ref:r,children:t.jsx("group",{position:[Ee,.18,0],children:t.jsx("mesh",{ref:a,material:l,castShadow:!0,receiveShadow:!0,children:t.jsx("sphereGeometry",{args:[Ce,u,u]})})})})}const v=Math.PI/180,j=new me(18.5204,73.8567,560),Ie=30,Te=8,Ne=14,Pe=-6,_e=4.1,ke=4,Le=[{key:"Mercury",body:p.Mercury,label:"Mercury",color:"#b8b2a8",emissive:"#5a5548",radius:.034},{key:"Venus",body:p.Venus,label:"Venus",color:"#e8dcc8",emissive:"#b8a078",radius:.052},{key:"Mars",body:p.Mars,label:"Mars",color:"#c47858",emissive:"#7a3828",radius:.042},{key:"Jupiter",body:p.Jupiter,label:"Jupiter",color:"#c9b59a",emissive:"#8a7560",radius:.078},{key:"Saturn",body:p.Saturn,label:"Saturn",color:"#ddd0b0",emissive:"#9a8870",radius:.068,ring:!0},{key:"Uranus",body:p.Uranus,label:"Uranus",color:"#9ec4c4",emissive:"#5a8080",radius:.036},{key:"Neptune",body:p.Neptune,label:"Neptune",color:"#6080c0",emissive:"#384878",radius:.036}];function ze(e,o,r,a){const n=e*v,s=r*v,i=(a-o)*v,u=Math.sin(n)*Math.sin(s)+Math.cos(n)*Math.cos(s)*Math.cos(i);return Math.acos(Math.min(1,Math.max(-1,u)))/v}function Ge(e){const o=q(p.Sun,e,j,!0,!0);return Q(e,j,o.ra,o.dec,"normal")}function Ue(e){return e<-2?4:e<0?6:Te}function Be(e,o,r,a){if(o.altitude<Ue(a)||a>_e)return!1;const n=ze(o.altitude,o.azimuth,r.altitude,r.azimuth);return!(r.altitude>Pe&&(n<Ne||r.altitude>-1&&a>-.5||(e==="Mercury"||e==="Venus")&&n<22))}function R(e=new Date){const o=Ge(e),r=[];for(const a of Le){const n=q(a.body,e,j,!0,!0),s=Q(e,j,n.ra,n.dec,"normal"),i=ue(a.body,e);Be(a.key,s,o,i.mag)&&r.push({...a,altitude:s.altitude,azimuth:s.azimuth,magnitude:i.mag,phase:i.phase_fraction})}return r.sort((a,n)=>a.magnitude-n.magnitude),r.slice(0,ke)}function Fe(e,o,r=new m){const a=e*v,n=o*v;return r.set(Math.cos(n)*Math.sin(a),Math.sin(n),Math.cos(n)*Math.cos(a)).normalize()}const L=new m,Ve=30;function We({planet:e,isMobile:o}){const r=c.useMemo(()=>(Fe(e.azimuth,e.altitude,L),L.clone().multiplyScalar(Ie)),[e.altitude,e.azimuth]),a=e.radius*2.6;return t.jsxs("group",{position:r,children:[t.jsxs("mesh",{scale:a,children:[t.jsx("sphereGeometry",{args:[1,14,14]}),t.jsx("meshBasicMaterial",{color:e.color,transparent:!0,opacity:.07,depthWrite:!1,blending:T})]}),t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e.radius,o?14:18,o?14:18]}),t.jsx("meshStandardMaterial",{color:e.color,emissive:e.emissive,emissiveIntensity:.28+Math.max(0,-e.magnitude)*.04,roughness:.92,metalness:.03})]}),e.ring?t.jsxs("mesh",{rotation:[Math.PI/2.35,.35,0],children:[t.jsx("ringGeometry",{args:[e.radius*1.34,e.radius*2.02,40]}),t.jsx("meshStandardMaterial",{color:"#c8bc98",emissive:"#8a8068",emissiveIntensity:.08,transparent:!0,opacity:.2,side:W,depthWrite:!1})]}):null]})}function Oe({isMobile:e=!1}){const[o,r]=c.useState(()=>R(new Date)),a=c.useRef(0);return c.useLayoutEffect(()=>{r(R(new Date))},[]),x((n,s)=>{a.current+=s,!(a.current<Ve)&&(a.current=0,r(R(new Date)))}),o.length?t.jsx("group",{name:"pune-visible-planets",children:o.map(n=>t.jsx(We,{planet:n,isMobile:e},n.key))}):null}const z=[{position:[.2,.35,6.4],lookAt:[0,0,0]},{position:[3.8,.75,4.8],lookAt:[0,.05,0]},{position:[1.2,1.15,3.85],lookAt:[0,.08,0]},{position:[-3.6,.85,4.5],lookAt:[0,.02,0]},{position:[.4,1.55,6.1],lookAt:[0,0,0]}];function $e(e){return e?z.map(({position:o,lookAt:r})=>({position:[o[0]*.76,o[1],o[2]*1.34],lookAt:[...r]})):z}const G=new m,U=new m,B=new m(0,0,0);function He({isMobile:e=!1,reducedMotion:o=!1}){const r=H(),a=c.useRef(0),n=c.useRef($e(e));return x((s,i)=>{if(!r)return;const u=r.current;a.current=o?u:O.damp(a.current,u,2.8,i);const l=ae(a.current,n.current);G.set(l.position[0],l.position[1],l.position[2]),U.set(l.lookAt[0],l.lookAt[1],l.lookAt[2]),s.camera.position.lerp(G,1-Math.exp(-3.6*i)),B.lerp(U,1-Math.exp(-3.6*i)),s.camera.lookAt(B)}),null}const F=new m,V=new m,qe=new re().setFromAxisAngle(new m(0,1,0),J);function Qe({isMobile:e=!1}){return t.jsxs(ne,{multisampling:0,children:[t.jsx(se,{intensity:.38,luminanceThreshold:.12,luminanceSmoothing:.72,mipmapBlur:!0}),e?null:t.jsx(ie,{focusDistance:.012,focalLength:.045,bokehScale:1.6,height:540}),t.jsx(ce,{eskil:!0,offset:.14,darkness:.72})]})}function Je({isMobile:e=!1,reducedMotion:o=!1}){const r=c.useRef(null);c.useLayoutEffect(()=>{r.current&&(I(S(),F),V.copy(F).applyQuaternion(qe),r.current.position.copy(V).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())},[]);const a=n=>{r.current&&(r.current.position.copy(n).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())};return t.jsxs(t.Fragment,{children:[t.jsx(de,{isMobile:e,reducedMotion:o}),t.jsx("ambientLight",{intensity:.028,color:"#6078a8"}),t.jsx("directionalLight",{ref:r,position:[6,2.5,4],intensity:1.35,color:"#fff8ee",castShadow:!e,"shadow-mapSize":e?[512,512]:[1024,1024],"shadow-camera-near":.5,"shadow-camera-far":24,"shadow-camera-left":-6,"shadow-camera-right":6,"shadow-camera-top":6,"shadow-camera-bottom":-6,"shadow-bias":-2e-4}),t.jsx("directionalLight",{position:[-4,-1,-3],intensity:.03,color:"#506090"}),t.jsx(c.Suspense,{fallback:null,children:t.jsx(De,{isMobile:e,reducedMotion:o,onSunDirectionChange:a})}),t.jsx(c.Suspense,{fallback:null,children:t.jsx(Re,{isMobile:e,reducedMotion:o})}),t.jsx(c.Suspense,{fallback:null,children:t.jsx(Oe,{isMobile:e})}),t.jsx(He,{isMobile:e,reducedMotion:o}),t.jsx(Qe,{isMobile:e})]})}const Ke={position:[.2,.35,6.4],fov:42,near:.1,far:120},Xe={position:[.15,.35,8.4],fov:54,near:.1,far:120};function rt(){const{isMobile:e,reducedMotion:o}=c.useMemo(()=>typeof window>"u"?{isMobile:!1,reducedMotion:!1}:{isMobile:window.matchMedia("(max-width: 767px)").matches,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches},[]),r=e?Xe:Ke;return t.jsx("div",{className:"earth-experience","aria-hidden":"true",children:t.jsx(le,{children:t.jsx(oe,{camera:r,dpr:[1,1.5],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},shadows:!e,performance:{min:.55},children:t.jsx(c.Suspense,{fallback:null,children:t.jsx(Je,{isMobile:e,reducedMotion:o})})})})})}export{rt as default};
