import{j as t,r as i}from"./index-D9FeRegZ.js";import{V as u,e as fe,A as V,d as ve,S as B,D as ie,u as R,a as k,N as ge,B as ye,M as I,c as H,Q as xe,C as Me}from"./react-three-fiber.esm-BaQviMpk.js";import{u as O,a as ce,s as Se,E as we,B as be,D as De,V as je,S as Ce}from"./Vignette-Drr-Ykql.js";import{B as g,E as le,H as ue,I as Ae,O as Re}from"./astronomy-DumPWoYK.js";function q({count:e,radius:o,spread:r,size:n=.55}){const a=i.useMemo(()=>{const s=new Float32Array(e*3),c=new fe,m=new u;for(let l=0;l<e;l+=1){const d=o+Math.random()*r;c.set(d,Math.acos(1-Math.random()*2),Math.random()*Math.PI*2),m.setFromSpherical(c),s[l*3]=m.x,s[l*3+1]=m.y,s[l*3+2]=m.z}return s},[e,o,r]);return t.jsxs("points",{frustumCulled:!1,renderOrder:-20,children:[t.jsx("bufferGeometry",{children:t.jsx("bufferAttribute",{attach:"attributes-position",args:[a,3]})}),t.jsx("pointsMaterial",{color:"#dce6f4",size:n,sizeAttenuation:!0,transparent:!0,opacity:.78,depthWrite:!1,depthTest:!0,blending:V})]})}function Ee(){const e=i.useMemo(()=>{const o=document.createElement("canvas");o.width=1024,o.height=512;const r=o.getContext("2d"),n=r.createLinearGradient(0,0,o.width,o.height);n.addColorStop(0,"rgba(8, 10, 24, 0)"),n.addColorStop(.35,"rgba(40, 48, 92, 0.08)"),n.addColorStop(.52,"rgba(120, 110, 180, 0.16)"),n.addColorStop(.68,"rgba(180, 140, 210, 0.1)"),n.addColorStop(1,"rgba(8, 10, 24, 0)"),r.fillStyle=n,r.fillRect(0,0,o.width,o.height);const a=new ve(o);return a.colorSpace=B,a},[]);return t.jsxs("mesh",{rotation:[1.1,.4,.2],position:[0,0,-28],scale:[48,20,1],renderOrder:-25,children:[t.jsx("planeGeometry",{args:[1,1]}),t.jsx("meshBasicMaterial",{map:e,transparent:!0,opacity:.55,depthWrite:!1,depthTest:!0,side:ie})]})}function z({position:e,color:o,size:r}){const n=i.useRef(null);return R(({clock:a})=>{n.current&&(n.current.rotation.y=a.getElapsedTime()*.04)}),t.jsxs("mesh",{ref:n,position:e,renderOrder:-15,children:[t.jsx("sphereGeometry",{args:[r,24,24]}),t.jsx("meshStandardMaterial",{color:o,emissive:o,emissiveIntensity:.08,roughness:.85,metalness:.05})]})}function Te({isMobile:e=!1}){const o=e?1600:3800;return t.jsxs(t.Fragment,{children:[t.jsx("color",{attach:"background",args:["#010208"]}),t.jsx("fog",{attach:"fog",args:["#010208",16,42]}),t.jsx(q,{count:o,radius:72,spread:48,size:e?.48:.58}),t.jsx(q,{count:Math.floor(o*.32),radius:110,spread:60,size:e?.32:.4}),t.jsx(Ee,{}),t.jsx(z,{position:[-14,3.2,-28],color:"#8a7898",size:.35}),t.jsx(z,{position:[16,-2.2,-32],color:"#6a88b0",size:.28}),t.jsx(z,{position:[5,6.5,-36],color:"#b89070",size:.22})]})}const A=Math.PI/180;function N(){return new Date}function ke(e){return e.getTime()/864e5+24405875e-1}function Ie(e){const r=ke(e)-2451545,n=(280.46+.9856474*r)%360*A,a=(357.528+.9856003*r)%360*A,s=n+(1.915*Math.sin(a)+.02*Math.sin(2*a))*A,c=(23.439-4e-7*r)*A;return Math.asin(Math.sin(c)*Math.sin(s))}function F(e=N(),o=new u){const r=Ie(e),a=(12-(e.getUTCHours()+e.getUTCMinutes()/60+e.getUTCSeconds()/3600+e.getUTCMilliseconds()/36e5))*15*A,s=Math.cos(r);return o.set(s*Math.cos(a),Math.sin(r),s*Math.sin(a)).normalize()}const T="/textures/theme3/",W=Math.PI,Y=.02,Ne=`
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
`,_e=`
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
`,ze=`
  varying vec2 vUv;
  varying vec3 vNormalGeo;

  void main() {
    vUv = uv;
    vNormalGeo = normalize(normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Ue=`
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
`;function Ge({radius:e=1.65,reducedMotion:o=!1,isMobile:r=!1,onSunDirectionChange:n}){const a=i.useRef(null),s=i.useRef(null),c=O(),m=i.useRef(0),l=i.useRef(F(N(),new u)),d=i.useRef(new u),x=r?48:72,[M,h,p,f]=ce([`${T}earth_day.jpg`,`${T}earth_lights.png`,`${T}earth_specular.jpg`,`${T}earth_clouds.png`]),j=i.useMemo(()=>new k({uniforms:{dayMap:{value:M},nightMap:{value:h},specularMap:{value:p},sunDirection:{value:l.current.clone()}},vertexShader:Ne,fragmentShader:Pe}),[M,h,p]),S=i.useMemo(()=>new k({uniforms:{cloudMap:{value:f},sunDirection:{value:l.current.clone()}},vertexShader:ze,fragmentShader:Ue,transparent:!0,depthWrite:!1,blending:ge}),[f]),w=i.useMemo(()=>new k({uniforms:{sunDirection:{value:l.current.clone()}},vertexShader:Le,fragmentShader:_e,transparent:!0,depthWrite:!1,side:ye,blending:V}),[]),C=()=>{F(N(),l.current),j.uniforms.sunDirection.value.copy(l.current),S.uniforms.sunDirection.value.copy(l.current),w.uniforms.sunDirection.value.copy(l.current)};return i.useLayoutEffect(()=>{C()},[w,S,j]),i.useEffect(()=>{[M,h,p,f].forEach(y=>{y.colorSpace=B,y.anisotropy=r?4:8}),f.anisotropy=r?2:4,a.current&&(a.current.rotation.y=W),s.current&&(s.current.rotation.y=Y)},[f,M,r,h,p]),R((y,v)=>{if(r&&a.current&&c){const b=c.current,E=Math.sin(b*Math.PI)*.36;if(m.current=o?E:I.damp(m.current,E,2.6,v),a.current.rotation.y=W+m.current,a.current.rotation.x=Math.sin(b*Math.PI*2)*.045,s.current){const L=o?0:y.clock.elapsedTime*.004;s.current.rotation.y=Y+m.current*.08+L}}else o||(a.current&&(a.current.rotation.y+=v*.018),s.current&&(s.current.rotation.y+=v*.024));C(),a.current&&n&&(d.current.copy(l.current),d.current.applyQuaternion(a.current.quaternion),n(d.current))}),t.jsxs("group",{ref:a,children:[t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e,x,x]}),t.jsx("primitive",{object:j,attach:"material"})]}),t.jsxs("mesh",{ref:s,scale:1.006,children:[t.jsx("sphereGeometry",{args:[e,x,x]}),t.jsx("primitive",{object:S,attach:"material"})]}),t.jsxs("mesh",{scale:1.045,children:[t.jsx("sphereGeometry",{args:[e,r?32:48,r?32:48]}),t.jsx("primitive",{object:w,attach:"material"})]})]})}const Fe=`
  varying vec2 vUv;
  varying vec3 vNormalWorld;

  void main() {
    vUv = uv;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,We=`
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
`;function Ve({colorMap:e,isMobile:o=!1,sunDirection:r,emissiveIntensity:n=0,emissiveColor:a="#000000"}){return new k({uniforms:{colorMap:{value:e},sunDirection:{value:r.clone()},surfaceColor:{value:new H(o?"#c4c0b8":"#b8b4ae")},emissiveColor:{value:new H(a)},emissiveIntensity:{value:n}},vertexShader:Fe,fragmentShader:We})}const Be="/textures/theme5/",me=1.65,Q=.2,J={desktop:{radius:me*.24,orbitRadius:4.05,orbitY:.18,orbitZ:0,incline:.28},mobile:{scrollDrift:.05,depthOffset:.65}},K=new u(0,0,0),Oe=new u,X=new u,Z=new u,ee=new u,te=new u;function $e({isMobile:e=!1,reducedMotion:o=!1,sunDirectionRef:r}){const n=J.desktop,a=J.mobile,s=i.useRef(null),c=i.useRef(null),m=i.useRef(null),l=O(),d=i.useRef(0),x=i.useRef(me*.5),M=i.useRef(new u(1,0,0)),[h]=ce([`${Be}moon_color.jpg`]);i.useEffect(()=>{h.colorSpace=B,h.anisotropy=e?4:8},[h,e]);const p=e?32:48,f=i.useMemo(()=>Ve({colorMap:h,isMobile:e,sunDirection:M.current,emissiveIntensity:e?.16:0,emissiveColor:e?"#3f3c38":"#000000"}),[h,e]);R((S,w)=>{if(r!=null&&r.current&&f.uniforms.sunDirection.value.copy(r.current),!c.current||!l)return;const C=l.current;if(e&&m.current){const{camera:v}=S,b=Math.sin(C*Math.PI*2)*a.scrollDrift;v.updateMatrixWorld(),v.matrixWorld.extractBasis(Oe,X,Z);const E=v.position.distanceTo(K),L=I.degToRad(v.fov),$=2*Math.tan(L/2)*E,de=$*v.aspect,he=2*Math.sqrt(Q*(2-Q)),_=de/he;x.current=_;const pe=-$*.3+b*.04-_;ee.copy(K).add(X.clone().multiplyScalar(pe)).add(Z.clone().multiplyScalar(a.depthOffset)),m.current.position.copy(ee),te.setScalar(_),c.current.scale.copy(te),c.current.rotation.y+=w*(o?.012:.035),c.current.rotation.x=.08+b*.04,c.current.rotation.z=b*.02;return}if(!s.current)return;const y=S.clock.elapsedTime*.055+C*Math.PI*1.45;d.current=o?y:I.damp(d.current,y,2.4,w),s.current.rotation.y=d.current,s.current.rotation.x=n.incline,c.current.rotation.y=-d.current,c.current.scale.setScalar(1)});const j=t.jsx("mesh",{ref:c,material:f,castShadow:!e,receiveShadow:!0,renderOrder:e?1:0,children:t.jsx("sphereGeometry",{args:[1,p,p]})});return e?t.jsx("group",{ref:m,children:j}):t.jsx("group",{ref:s,children:t.jsx("group",{position:[n.orbitRadius,n.orbitY,n.orbitZ],children:t.jsx("mesh",{ref:c,material:f,castShadow:!0,receiveShadow:!0,children:t.jsx("sphereGeometry",{args:[n.radius,p,p]})})})})}const D=Math.PI/180,P=new Re(18.5204,73.8567,560),He=30,qe=8,Ye=14,Qe=-6,Je=4.1,Ke=4,Xe=[{key:"Mercury",body:g.Mercury,label:"Mercury",color:"#b8b2a8",emissive:"#5a5548",radius:.034},{key:"Venus",body:g.Venus,label:"Venus",color:"#e8dcc8",emissive:"#b8a078",radius:.052},{key:"Mars",body:g.Mars,label:"Mars",color:"#c47858",emissive:"#7a3828",radius:.042},{key:"Jupiter",body:g.Jupiter,label:"Jupiter",color:"#c9b59a",emissive:"#8a7560",radius:.078},{key:"Saturn",body:g.Saturn,label:"Saturn",color:"#ddd0b0",emissive:"#9a8870",radius:.068,ring:!0},{key:"Uranus",body:g.Uranus,label:"Uranus",color:"#9ec4c4",emissive:"#5a8080",radius:.036},{key:"Neptune",body:g.Neptune,label:"Neptune",color:"#6080c0",emissive:"#384878",radius:.036}];function Ze(e,o,r,n){const a=e*D,s=r*D,c=(n-o)*D,m=Math.sin(a)*Math.sin(s)+Math.cos(a)*Math.cos(s)*Math.cos(c);return Math.acos(Math.min(1,Math.max(-1,m)))/D}function et(e){const o=le(g.Sun,e,P,!0,!0);return ue(e,P,o.ra,o.dec,"normal")}function tt(e){return e<-2?4:e<0?6:qe}function rt(e,o,r,n){if(o.altitude<tt(n)||n>Je)return!1;const a=Ze(o.altitude,o.azimuth,r.altitude,r.azimuth);return!(r.altitude>Qe&&(a<Ye||r.altitude>-1&&n>-.5||(e==="Mercury"||e==="Venus")&&a<22))}function U(e=new Date){const o=et(e),r=[];for(const n of Xe){const a=le(n.body,e,P,!0,!0),s=ue(e,P,a.ra,a.dec,"normal"),c=Ae(n.body,e);rt(n.key,s,o,c.mag)&&r.push({...n,altitude:s.altitude,azimuth:s.azimuth,magnitude:c.mag,phase:c.phase_fraction})}return r.sort((n,a)=>n.magnitude-a.magnitude),r.slice(0,Ke)}function ot(e,o,r=new u){const n=e*D,a=o*D;return r.set(Math.cos(a)*Math.sin(n),Math.sin(a),Math.cos(a)*Math.cos(n)).normalize()}const re=new u,nt=30;function at({planet:e,isMobile:o}){const r=i.useMemo(()=>(ot(e.azimuth,e.altitude,re),re.clone().multiplyScalar(He)),[e.altitude,e.azimuth]),n=e.radius*2.6;return t.jsxs("group",{position:r,children:[t.jsxs("mesh",{scale:n,children:[t.jsx("sphereGeometry",{args:[1,14,14]}),t.jsx("meshBasicMaterial",{color:e.color,transparent:!0,opacity:.07,depthWrite:!1,blending:V})]}),t.jsxs("mesh",{children:[t.jsx("sphereGeometry",{args:[e.radius,o?14:18,o?14:18]}),t.jsx("meshStandardMaterial",{color:e.color,emissive:e.emissive,emissiveIntensity:.28+Math.max(0,-e.magnitude)*.04,roughness:.92,metalness:.03})]}),e.ring?t.jsxs("mesh",{rotation:[Math.PI/2.35,.35,0],children:[t.jsx("ringGeometry",{args:[e.radius*1.34,e.radius*2.02,40]}),t.jsx("meshStandardMaterial",{color:"#c8bc98",emissive:"#8a8068",emissiveIntensity:.08,transparent:!0,opacity:.2,side:ie,depthWrite:!1})]}):null]})}function st({isMobile:e=!1}){const[o,r]=i.useState(()=>U(new Date)),n=i.useRef(0);return i.useLayoutEffect(()=>{r(U(new Date))},[]),R((a,s)=>{n.current+=s,!(n.current<nt)&&(n.current=0,r(U(new Date)))}),o.length?t.jsx("group",{name:"pune-visible-planets",children:o.map(a=>t.jsx(at,{planet:a,isMobile:e},a.key))}):null}const it=[{position:[.2,.35,6.4],lookAt:[0,0,0]},{position:[3.8,.75,4.8],lookAt:[0,.05,0]},{position:[1.2,1.15,3.85],lookAt:[0,.08,0]},{position:[-3.6,.85,4.5],lookAt:[0,.02,0]},{position:[.4,1.55,6.1],lookAt:[0,0,0]}],ct=[{position:[.15,.35,8.4],lookAt:[0,0,0]},{position:[.22,.42,7.55],lookAt:[0,.015,0]},{position:[.1,.52,6.85],lookAt:[0,.03,0]},{position:[-.08,.44,7.25],lookAt:[0,.02,0]},{position:[.14,.4,8.15],lookAt:[0,0,0]}];function lt(e){return e?ct:it}const oe=new u,ne=new u,ae=new u(0,0,0);function ut({isMobile:e=!1,reducedMotion:o=!1}){const r=O(),n=i.useRef(0),a=i.useRef(lt(e));return R((s,c)=>{if(!r)return;const m=r.current;n.current=o?m:I.damp(n.current,m,2.8,c);const l=Se(n.current,a.current);oe.set(l.position[0],l.position[1],l.position[2]),ne.set(l.lookAt[0],l.lookAt[1],l.lookAt[2]),s.camera.position.lerp(oe,1-Math.exp(-3.6*c)),ae.lerp(ne,1-Math.exp(-3.6*c)),s.camera.lookAt(ae)}),null}const se=new u,G=new u,mt=new xe().setFromAxisAngle(new u(0,1,0),W);function dt({isMobile:e=!1}){return t.jsxs(we,{multisampling:0,children:[t.jsx(be,{intensity:.38,luminanceThreshold:.12,luminanceSmoothing:.72,mipmapBlur:!0}),e?null:t.jsx(De,{focusDistance:.012,focalLength:.045,bokehScale:1.6,height:540}),t.jsx(je,{eskil:!0,offset:.14,darkness:.72})]})}function ht({isMobile:e=!1,reducedMotion:o=!1}){const r=i.useRef(null),n=i.useRef(new u);i.useLayoutEffect(()=>{r.current&&(F(N(),se),G.copy(se).applyQuaternion(mt),n.current.copy(G),r.current.position.copy(G).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())},[]);const a=s=>{n.current.copy(s),r.current&&(r.current.position.copy(s).multiplyScalar(14),r.current.target.position.set(0,0,0),r.current.target.updateMatrixWorld())};return t.jsxs(t.Fragment,{children:[t.jsx(Te,{isMobile:e,reducedMotion:o}),t.jsx("ambientLight",{intensity:.028,color:"#6078a8"}),t.jsx("directionalLight",{ref:r,position:[6,2.5,4],intensity:1.35,color:"#fff8ee",castShadow:!e,"shadow-mapSize":e?[512,512]:[1024,1024],"shadow-camera-near":.5,"shadow-camera-far":24,"shadow-camera-left":-6,"shadow-camera-right":6,"shadow-camera-top":6,"shadow-camera-bottom":-6,"shadow-bias":-2e-4}),t.jsx("directionalLight",{position:[-4,-1,-3],intensity:.03,color:"#506090"}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(Ge,{isMobile:e,reducedMotion:o,onSunDirectionChange:a})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx($e,{isMobile:e,reducedMotion:o,sunDirectionRef:n})}),t.jsx(i.Suspense,{fallback:null,children:t.jsx(st,{isMobile:e})}),t.jsx(ut,{isMobile:e,reducedMotion:o}),t.jsx(dt,{isMobile:e})]})}const pt={position:[.2,.35,6.4],fov:42,near:.1,far:120},ft={position:[.15,.35,8.4],fov:54,near:.1,far:120};function St(){const{isMobile:e,reducedMotion:o}=i.useMemo(()=>typeof window>"u"?{isMobile:!1,reducedMotion:!1}:{isMobile:window.matchMedia("(max-width: 767px)").matches,reducedMotion:window.matchMedia("(prefers-reduced-motion: reduce)").matches},[]),r=e?ft:pt;return t.jsx("div",{className:"earth-experience","aria-hidden":"true",children:t.jsx(Ce,{children:t.jsx(Me,{camera:r,dpr:[1,1.5],gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},shadows:!e,performance:{min:.55},children:t.jsx(i.Suspense,{fallback:null,children:t.jsx(ht,{isMobile:e,reducedMotion:o})})})})})}export{St as default};
