import{r as s,j as e}from"./index-dGhSnQ2m.js";import{b as g,V as f,u as x,N as y,A as M,B as D}from"./Sparkles-BDut9iIx.js";import{b as j}from"./SpaceEnvironment-Dr_QtlUC.js";const l="/wedding-invitation/textures/theme3/",W=`
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vPositionW = worldPosition.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,S=`
  uniform sampler2D dayMap;
  uniform sampler2D nightMap;
  uniform sampler2D specularMap;
  uniform vec3 sunDirection;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vPositionW;

  void main() {
    vec3 normal = normalize(vNormalW);
    vec3 dayColor = texture2D(dayMap, vUv).rgb;
    vec3 nightColor = texture2D(nightMap, vUv).rgb * 1.45;
    float sunDot = dot(normal, normalize(sunDirection));
    float dayMix = smoothstep(-0.22, 0.34, sunDot);
    vec3 color = mix(nightColor, dayColor, dayMix);

    float specMask = texture2D(specularMap, vUv).r;
    vec3 viewDir = normalize(cameraPosition - vPositionW);
    vec3 lightDir = normalize(sunDirection);
    vec3 halfDir = normalize(lightDir + viewDir);
    float specular = pow(max(dot(normal, halfDir), 0.0), 32.0) * specMask * 0.42;
    color += vec3(specular);

    gl_FragColor = vec4(color, 1.0);
  }
`,w=`
  varying vec3 vNormalW;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,z=`
  varying vec3 vNormalW;
  void main() {
    vec3 viewDir = normalize(cameraPosition);
    float rim = 1.0 - max(dot(vNormalW, viewDir), 0.0);
    float intensity = pow(rim, 2.35);
    vec3 atmosphere = vec3(0.42, 0.62, 1.0) * intensity;
    gl_FragColor = vec4(atmosphere, intensity * 0.72);
  }
`;function C({radius:c=1.65,reducedMotion:h=!1,isMobile:r=!1}){const m=s.useRef(null),v=s.useRef(null),a=r?48:72,[o,t,i,n]=j([`${l}earth_day.jpg`,`${l}earth_lights.png`,`${l}earth_specular.jpg`,`${l}earth_clouds.png`]);s.useEffect(()=>{[o,t,i,n].forEach(p=>{p.colorSpace=g,p.anisotropy=r?4:8}),n.anisotropy=r?2:4},[n,o,r,t,i]);const u=s.useMemo(()=>({dayMap:{value:o},nightMap:{value:t},specularMap:{value:i},sunDirection:{value:new f(5,2,3).normalize()}}),[o,t,i]);return x((p,d)=>{h||(m.current&&(m.current.rotation.y+=d*.018),v.current&&(v.current.rotation.y+=d*.024))}),e.jsxs("group",{ref:m,children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[c,a,a]}),e.jsx("shaderMaterial",{uniforms:u,vertexShader:W,fragmentShader:S})]}),e.jsxs("mesh",{ref:v,scale:1.006,children:[e.jsx("sphereGeometry",{args:[c,a,a]}),e.jsx("meshStandardMaterial",{map:n,transparent:!0,opacity:.34,depthWrite:!1,blending:y})]}),e.jsxs("mesh",{scale:1.045,children:[e.jsx("sphereGeometry",{args:[c,r?32:48,r?32:48]}),e.jsx("shaderMaterial",{vertexShader:w,fragmentShader:z,transparent:!0,depthWrite:!1,side:D,blending:M})]})]})}export{C as E};
