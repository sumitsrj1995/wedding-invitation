import{j as t,r as i}from"./index-C9aMRQIh.js";import{V as u,e as de,A as B,d as pe,S as V,D as se,u as A,a as _,N as fe,B as ge,M as k,b as ve,c as z,Q as ye,C as xe}from"./react-three-fiber.esm-9Y0j8yYK.js";import{u as O,a as ie,s as Me,E as Se,B as we,D as je,V as be,S as De}from"./Vignette-CQR4bDdv.js";import{B as v,E as ce,H as le,I as Ce,O as Re}from"./astronomy-DumPWoYK.js";function $({count:e,radius:o,spread:r,size:a=.55}){const n=i.useMemo(()=>{const s=new Float32Array(e*3),l=new de,m=new u;for(let c=0;c<e;c+=1){const y=o+Math.random()*r;l.set(y,Math.acos(1-Math.random()*2),Math.random()*Math.PI*2),m.setFromSpherical(l),s[c*3]=m.x,s[c*3+1]=m.y,s[c*3+2]=m.z}return s},[e,o,r]);return t.jsxs("points",{frustumCulled:!1,renderOrder:-20,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[n,3]})}),t.jsx("pointsMaterial",{color:"#dce6f4",size:a,sizeAttenuation:!0,transparent:!0,opacity:.78,depthWrite:!1,depthTest:!0,blending:B})]})}function Ae(){const e=i.useMemo(()=>{const o=document.createElement("canvas");o.width=1024,o.height=512;const r=o.getContext("2d"),a=r.createLinearGradient(0,0,o.width,o.height);a.addColorStop(0,"rgba(8, 10, 24, 0)"),a.addColorStop(.35,"rgba(40, 48, 92, 0.08)"),a.addColorStop(.52,"rgba(120, 110, 180, 0.16)"),a.addColorStop(.68,"rgba(180, 140, 210, 0.1)"),a.addColorStop(1,"rgba(8, 10, 24, 0)"),r.fillStyle=a,r.fillRect(0,0,o.width,o.height);const n=new pe(o);return n.colorSpace=V,n},[]);return t.jsxs("mesh",{rotation:[1.1,.4,.2],position:[0,0,-28],scale:[48,20,1],renderOrder:-25,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("meshBasicMaterial",{map:e,transparent:!0,opacity:.55,depthWrite:!1,depthTest:!0,side:se})]})}function G({position:e,color:o,size:r}){const a=i.useRef(null);return A(({clock:n})=>{a.current&&(a.current.rotation.y=n.getElapsedTime()*.04)}),t.jsxs("mesh",{ref:a,position:e,renderOrder:-15,children:[t.jsx("sphereGeometry",{args:[r,24,24]}),t.jsx("meshStandardMaterial",{color:o,emissive:o,emissiveIntensity:.08,roughness:.85,metalness:.05})]})}function Ee({isMobile:e=!1}){const o=e?1600:3800;return t.jsxs(t.Fragment,{children:[t.jsx("color",{attach:"background",args:["#010208"]}),t.jsx("fog",{attach:"fog",args:["#010208",16,42]}),t.jsx($,{count:o,radius:72,spread:48,size:e?.48:.58}),t.jsx($,{count:Math.floor(o*.32),radius:110,spread:60,size:e?.32:.4}),t.jsx(Ae,{}),t.jsx(G,{position:[-14,3.2,-28],color:"#8a7898",size:.35}),t.jsx(G,{position:[16,-2.2,-32],color:"#6a88b0",size:.28}),t.jsx(G,{position:[5,6.5,-36],color:"#b89070",size:.22})]})}const R=Math.PI/180;function I(){return new Date}function Te(e){return e.getTime()/864e5+24405875e-1}function ke(e){const r=Te(e)-2451545,a=(280.46+.9856474*r)%360*R,n=(357.528+.9856003*r)%360*R,s=a+(1.915*Math.sin(n)+.02*Math.sin(2*n))*R,l=(23.439-4e-7*r)*R;return Math.asin(Math.sin(l)*Math.sin(s))}function F(e=I(),o=new u){const r=ke(e),n=(12-(e.getUTCHours()+e.getUTCMinutes()/60+e.getUTCSeconds()/3600+e.getUTCMilliseconds()/36e5))*15*R,s=Math.cos(r);return o.set(s*Math.cos(n),Math.sin(r),s*Math.sin(n)).normalize()}const T="/textures/theme3/",W=Math.PI,H=.02,Ie=`
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
`,Pe=`
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
`,Le=`
  varying vec3 vNormalW;
  varying vec3 vNormalGeo;
  void main() {
    vNormalGeo = normalize(normal);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ne=`
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
`,_e=`
  varying vec2 vUv;
  varying vec3 vNormalGeo;

  void main() {
    vUv = uv;
    vNormalGeo = normalize(normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,ze=`
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
`;function Ge({radius:e=1.65,reducedMotion:o=!1,isMobile:r=!1,onSunDirectionChange:a}){const n=i.useRef(null),s=i.useRef(null),l=O(),m=i.useRef(0),c=i.useRef(F(I(),new u)),y=i.useRef(new u),h=r?48:72,[d,x,M,p]=ie([`${T}earth_day.jpg`,`${T}earth_lights.png`,`${T}earth_specular.jpg`,`${T}earth_clouds.png`]),S=i.useMemo(()=>new _({uniforms:{dayMap:{value:d},nightMap:{value:x},specularMap:{value:M},sunDirection:{value:c.current.clone()}},vertexShader:Ie,fragmentShader:Pe}),[d,x,M]),w=i.useMemo(()=>new _({uniforms:{cloudMap:{value:p},sunDirection:{value:c.current.clone()}},vertexShader:_e,fragmentShader:ze,transparent:!0,depthWrite:!1,blending:fe}),[p]),j=i.useMemo(()=>new _({uniforms:{sunDirection:{value:c.current.clone()}},vertexShader:Le,fragmentShader:Ne,transparent:!0,depthWrite:!1,side:ge,blending:B}),[]),f=()=>{F(I(),c.current),S.uniforms.sunDirection.value.copy(c.current),w.uniforms.sunDirection.value.copy(c.current),j.uniforms.sunDirection.value.copy(c.current)};return i.useLayoutEffect(()=>{f()},[j,w,S]),i.useEffect(()=>{[d,x,M,p].forEach(g=>{g.colorSpace=V,g.anisotropy=r?4:8}),p.anisotropy=r?2:4,n.current&&(n.current.rotation.y=W),s.current&&(s.current.rotation.y=H)},[p,d,r,x,M]),A((g,D)=>{if(r&&n.current&&l){const E=l.current,C=Math.sin(E*Math.PI)*.36;if(m.current=o?C:k.damp(m.current,C,2.6,D),n.current.rotation.y=W+m.current,n.current.rotation.x=Math.sin(E*Math.PI*2)*.045,s.current){const L=o?0:g.clock.elapsedTime*.004;s.current.rotation.y=H+m.current*.08+L}}else o||(n.current&&(n.current.rotation.y+=D*.018),s.current&&(s.current.rotation.y+=D*.024));f(),n.current&&a&&(y.current.copy(c.current),y.current.applyQuaternion(n.current.quaternion),a(y.current))}),t.jsxs("group",{ref:n,children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e,h,h]}),t.jsx("primitive",{object:S,attach:"material"})]}),t.jsxs("mesh",{ref:s,scale:1.006,children:[t.jsx("sphereGeometry",{args:[e,h,h]}),t.jsx("primitive",{object:w,attach:"material"})]}),t.jsxs("mesh",{scale:1.045,children:[t.jsx("sphereGeometry",{args:[e,r?32:48,r?32:48]}),t.jsx("primitive",{object:j,attach:"material"})]})]})}const Ue="/textures/theme5/",ue=1.65,q=.2,Y={desktop:{radius:ue*.24,orbitRadius:4.05,orbitY:.18,orbitZ:0,incline:.28},mobile:{scrollDrift:.05,depthOffset:.65}},Q=new u(0,0,0),Fe=new u,J=new u,K=new u,X=new u,Z=new u;function We({isMobile:e=!1,reducedMotion:o=!1}){const r=Y.desktop,a=Y.mobile,n=i.useRef(null),s=i.useRef(null),l=i.useRef(null),m=O(),c=i.useRef(0),y=i.useRef(ue*.5),[h]=ie([`${Ue}moon_color.jpg`]);i.useEffect(()=>{h.colorSpace=V,h.anisotropy=e?4:8},[h,e]);const d=e?32:48,x=i.useMemo(()=>new ve({map:h,bumpMap:h,bumpScale:.012,roughness:.92,metalness:.015,color:new z(e?"#c4c0b8":"#b8b4ae"),emissive:e?new z("#3f3c38"):new z("#000000"),emissiveIntensity:e?.16:0}),[h,e]);A((p,S)=>{if(!s.current||!m)return;const w=m.current;if(e&&l.current){const{camera:f}=p,g=Math.sin(w*Math.PI*2)*a.scrollDrift;f.updateMatrixWorld(),f.matrixWorld.extractBasis(Fe,J,K);const D=f.position.distanceTo(Q),E=k.degToRad(f.fov),C=2*Math.tan(E/2)*D,L=C*f.aspect,me=2*Math.sqrt(q*(2-q)),N=L/me;y.current=N;const he=-C*.3+g*.04-N;X.copy(Q).add(J.clone().multiplyScalar(he)).add(K.clone().multiplyScalar(a.depthOffset)),l.current.position.copy(X),Z.setScalar(N),s.current.scale.copy(Z),s.current.rotation.y+=S*(o?.012:.035),s.current.rotation.x=.08+g*.04,s.current.rotation.z=g*.02;return}if(!n.current)return;const j=p.clock.elapsedTime*.055+w*Math.PI*1.45;c.current=o?j:k.damp(c.current,j,2.4,S),n.current.rotation.y=c.current,n.current.rotation.x=r.incline,s.current.rotation.y=-c.current,s.current.scale.setScalar(1)});const M=t.jsx("mesh",{ref:s,material:x,castShadow:!e,receiveShadow:!0,renderOrder:e?1:0,children:t.jsx("sphereGeometry",{args:[1,d,d]})});return e?t.jsx("group",{ref:l,children:M}):t.jsx("group",{ref:n,children:t.jsx("group",{position:[r.orbitRadius,r.orbitY,r.orbitZ],children:t.jsx("mesh",{ref:s,material:x,castShadow:!0,receiveShadow:!0,children:t.jsx("sphereGeometry",{args:[r.radius,d,d]})})})})}const b=Math.PI/180,P=new Re(18.5204,73.8567,560),Be=30,Ve=8,Oe=14,$e=-6,He=4.1,qe=4,Ye=[{key:"Mercury",body:v.Mercury,label:"Mercury",color:"#b8b2a8",emissive:"#5a5548",radius:.034},{key:"Venus",body:v.Venus,label:"Venus",color:"#e8dcc8",emissive:"#b8a078",radius:.052},{key:"Mars",body:v.Mars,label:"Mars",color:"#c47858",emissive:"#7a3828",radius:.042},{key:"Jupiter",body:v.Jupiter,label:"Jupiter",color:"#c9b59a",emissive:"#8a7560",radius:.078},{key:"Saturn",body:v.Saturn,label:"Saturn",color:"#ddd0b0",emissive:"#9a8870",radius:.068,ring:!0},{key:"Uranus",body:v.Uranus,label:"Uranus",color:"#9ec4c4",emissive:"#5a8080",radius:.036},{key:"Neptune",body:v.Neptune,label:"Neptune",color:"#6080c0",emissive:"#384878",radius:.036}];function Qe(e,o,r,a){const n=e*b,s=r*b,l=(a-o)*b,m=Math.sin(n)*Math.sin(s)+Math.cos(n)*Math.cos(s)*Math.cos(l);return Math.acos(Math.min(1,Math.max(-1,m)))/b}function Je(e){const o=ce(v.Sun,e,P,!0,!0);return le(e,P,o.ra,o.dec,"normal")}function Ke(e){return e<-2?4:e<0?6:Ve}function Xe(e,o,r,a){if(o.altitude<Ke(a)||a>He)return!1;const n=Qe(o.altitude,o.azimuth,r.altitude,r.azimuth);return!(r.altitude>$e&&(n<Oe||r.altitude>-1&&a>-.5||(e==="Mercury"||e==="Venus")&&n<22))}function U(e=new Date){const o=Je(e),r=[];for(const a of Ye){const n=ce(a.body,e,P,!0,!0),s=le(e,P,n.ra,n.dec,"normal"),l=Ce(a.body,e);Xe(a.key,s,o,l.mag)&&r.push({...a,altitude:s.altitude,azimuth:s.azimuth,magnitude:l.mag,phase:l.phase_fraction})}return r.sort((a,n)=>a.magnitude-n.magnitude),r.slice(0,qe)}function Ze(e,o,r=new u){const a=e*b,n=o*b;return r.set(Math.cos(n)*Math.sin(a),Math.sin(n),Math.cos(n)*Math.cos(a)).normalize()}const ee=new u,et=30;function tt({planet:e,isMobile:o}){const r=i.useMemo(()=>(Ze(e.azimuth,e.altitude,ee),ee.clone().multiplyScalar(Be)),[e.altitude,e.azimuth]),a=e.radius*2.6;return t.jsxs("group",{position:r,children:[t.jsxs("mesh",{scale:a,children:[t.jsx("sphereGeometry",{args:[1,14,14]}),t.jsx("meshBasicMaterial",{color:e.color,transparent:!0,opacity:.07,depthWrite:!1,blending:B})]}),t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e.radius,o?14:18,o?14:18]}),t.jsx("meshStandardMaterial",{color:e.color,emissive:e.emissive,emissiveIntensity:.28+Math.max(0,-e.magnitude)*.04,roughness:.92,metalness:.03})]}),e.ring?t.jsxs("mesh",{rotation:[Math.PI/2.35,.35,0],children:[t.jsx("ringGeometry",{args:[e.radius*1.34,e.radius*2.02,40]}),t.jsx("meshStandardMaterial",{color:"#c8bc98",emissive:"#8a8068",emissiveIntensity:.08,transparent:!0,opacity:.2,side:se,depthWrite:!1})]}):null]})}function rt({isMobile:e=!1}){const[o,r]=i.useState(()=>U(new Date)),a=i.useRef(0);return i.useLayoutEffect(()=>{r(U(new Date))},[]),A((n,s)=>{a.current+=s,!(a.current<et)&&(a.current=0,r(U(new Date)))}),o.length?t.jsx("group",{name:"pune-visible-planets",children:o.map(n=>t.jsx(tt,{planet:n,isMobile:e},n.key))}):null}const ot=[{position:[.2,.35,6.4],lookAt:[0,0,0]},{position:[3.8,.75,4.8],lookAt:[0,.05,0]},{position:[1.2,1.15,3.85],lookAt:[0,.08,0]},{position:[-3.6,.85,4.5],lookAt:[0,.02,0]},{position:[.4,1.55,6.1],lookAt:[0,0,0]}],nt=[{position:[.15,.35,8.4],lookAt:[0,0,0]},{position:[.22,.42,7.55],lookAt:[0,.015,0]},{position:[.1,.52,6.85],lookAt:[0,.03,0]},{position:[-.08,.44,7.25],lookAt:[0,.02,0]},{position:[.14,.4,8.15],lookAt:[0,0,0]}];function at(e){return e?nt:ot}const te=new u,re=new u,oe=new u(0,0,0);function st({isMobile:e=!1,reducedMotion:o=!1}){const r=O(),a=i.useRef(0),n=i.useRef(at(e));return A((s,l)=>{if(!r)return;const m=r.current;a.current=o?m:k.damp(a.current,m,2.8,l);const c=Me(a.current,n.current);te.set(c.position[0],c.position[1],c.position[2]),re.set(c.lookAt[0],c.lookAt[1],c.lookAt[2]),s.camera.position.lerp(te,1-Math.exp(-3.6*l)),oe.lerp(re,1-Math.exp(-3.6*l)),s.camera.lookAt(oe)}),null}const ne=new u,ae=new u,it=new ye().setFromAxisAngle(new u(0,1,0),W);function ct({isMobile:e=!1}){return t.jsxs(Se,{multisampling:0,children:[t.jsx(we,{intensity:.38,luminanceThreshold:.12,luminanceSmoothing:.72,mipmapBlur:!0}),e?null:t.jsx(je,{focusDistance:.012,focalLength:.045,bokehScale:1.6,height:540}),t.jsx(be,{eskil:!0,offset:.14,darkness:.72})]})}function lt({isMobile:e=!1,reducedMotion:o=!1}){const r=i.useRef(null);i.useLayoutEffect(()=>{r.current&&(F(I(),ne),ae.copy(ne).applyQuaternion(it),r.current.position.copy(ae).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())},[]);const a=n=>{r.current&&(r.current.position.copy(n).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())};return t.jsxs(t.Fragment,{children:[t.jsx(Ee,{isMobile:e,reducedMotion:o}),t.jsx("ambientLight",{intensity:.028,color:"#6078a8"}),t.jsx("directionalLight",{ref:r,position:[6,2.5,4],intensity:1.35,color:"#fff8ee",castShadow:!e,"shadow-mapSize":e?[512,512]:[1024,1024],"shadow-camera-near":.5,"shadow-camera-far":24,"shadow-camera-left":-6,"shadow-camera-right":6,"shadow-camera-top":6,"shadow-camera-bottom":-6,"shadow-bias":-2e-4}),t.jsx("directionalLight",{position:[-4,-1,-3],intensity:.03,color:"#506090"}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(Ge,{isMobile:e,reducedMotion:o,onSunDirectionChange:a})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(We,{isMobile:e,reducedMotion:o})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(rt,{isMobile:e})}),t.jsx(st,{isMobile:e,reducedMotion:o}),t.jsx(ct,{isMobile:e})]})}const ut={position:[.2,.35,6.4],fov:42,near:.1,far:120},mt={position:[.15,.35,8.4],fov:54,near:.1,far:120};function vt(){const{isMobile:e,reducedMotion:o}=i.useMemo(()=>typeof window>"u"?{isMobile:!1,reducedMotion:!1}:{isMobile:window.matchMedia("(max-width: 767px)").matches,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches},[]),r=e?mt:ut;return t.jsx("div",{className:"earth-experience","aria-hidden":"true",children:t.jsx(De,{children:t.jsx(xe,{camera:r,dpr:[1,1.5],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},shadows:!e,performance:{min:.55},children:t.jsx(i.Suspense,{fallback:null,children:t.jsx(lt,{isMobile:e,reducedMotion:o})})})})})}export{vt as default};
