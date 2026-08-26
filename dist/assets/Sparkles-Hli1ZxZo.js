import{r}from"./index-DAH4dUCP.js";import{M as E,a as S,U as j,R as I,c as M,u as w,A as R,V as z,e as V,f as k,g as T,h as U,i as $}from"./react-three-fiber.esm-BsJKcRKc.js";function x(){return x=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var o in a)({}).hasOwnProperty.call(a,o)&&(e[o]=a[o])}return e},x.apply(null,arguments)}function D(e,t,a,o){const s=class extends S{constructor(l={}){const c=Object.entries(e);super({uniforms:c.reduce((i,[f,n])=>{const g=j.clone({[f]:{value:n}});return{...i,...g}},{}),vertexShader:t,fragmentShader:a}),this.key="",c.forEach(([i])=>Object.defineProperty(this,i,{get:()=>this.uniforms[i].value,set:f=>this.uniforms[i].value=f})),Object.assign(this,l)}};return s.key=E.generateUUID(),s}const G=()=>parseInt(I.replace(/\D+/g,"")),C=G();class H extends S{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${C>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}const N=e=>new z().setFromSpherical(new V(e,Math.acos(1-Math.random()*2),Math.random()*2*Math.PI)),K=r.forwardRef(({radius:e=100,depth:t=50,count:a=5e3,saturation:o=0,factor:s=4,fade:v=!1,speed:l=1},c)=>{const i=r.useRef(),[f,n,g]=r.useMemo(()=>{const u=[],b=[],A=Array.from({length:a},()=>(.5+.5*Math.random())*s),d=new M;let h=e+t;const P=t/a;for(let m=0;m<a;m++)h-=P*Math.random(),u.push(...N(h).toArray()),d.setHSL(m/a,o,.9),b.push(d.r,d.g,d.b);return[new Float32Array(u),new Float32Array(b),new Float32Array(A)]},[a,t,s,e,o]);w(u=>i.current&&(i.current.uniforms.time.value=u.clock.getElapsedTime()*l));const[y]=r.useState(()=>new H);return r.createElement("points",{ref:c},r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[f,3]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[n,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[g,1]})),r.createElement("primitive",{ref:i,object:y,attach:"material",blending:R,"uniforms-fade-value":v,depthWrite:!1,transparent:!0,vertexColors:!0}))}),W=D({time:0,pixelRatio:1},` uniform float pixelRatio;
    uniform float time;
    attribute float size;  
    attribute float speed;  
    attribute float opacity;
    attribute vec3 noise;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vOpacity;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
      modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
      modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPostion = projectionMatrix * viewPosition;
      gl_Position = projectionPostion;
      gl_PointSize = size * 25. * pixelRatio;
      gl_PointSize *= (1.0 / - viewPosition.z);
      vColor = color;
      vOpacity = opacity;
    }`,` varying vec3 vColor;
    varying float vOpacity;
    void main() {
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float strength = 0.05 / distanceToCenter - 0.1;
      gl_FragColor = vec4(vColor, strength * vOpacity);
      #include <tonemapping_fragment>
      #include <${C>=154?"colorspace_fragment":"encodings_fragment"}>
    }`),_=e=>e&&e.constructor===Float32Array,B=e=>[e.r,e.g,e.b],F=e=>e instanceof U||e instanceof z||e instanceof $,O=e=>Array.isArray(e)?e:F(e)?e.toArray():[e,e,e];function p(e,t,a){return r.useMemo(()=>{if(t!==void 0){if(_(t))return t;if(t instanceof M){const o=Array.from({length:e*3},()=>B(t)).flat();return Float32Array.from(o)}else if(F(t)||Array.isArray(t)){const o=Array.from({length:e*3},()=>O(t)).flat();return Float32Array.from(o)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},a)},[t])}const Q=r.forwardRef(({noise:e=1,count:t=100,speed:a=1,opacity:o=1,scale:s=1,size:v,color:l,children:c,...i},f)=>{r.useMemo(()=>k({SparklesImplMaterial:W}),[]);const n=r.useRef(null),g=T(m=>m.viewport.dpr),y=O(s),u=r.useMemo(()=>Float32Array.from(Array.from({length:t},()=>y.map(E.randFloatSpread)).flat()),[t,...y]),b=p(t,v,Math.random),A=p(t,o),d=p(t,a),h=p(t*3,e),P=p(l===void 0?t*3:t,_(l)?l:new M(l),()=>1);return w(m=>{n.current&&n.current.material&&(n.current.material.time=m.clock.elapsedTime)}),r.useImperativeHandle(f,()=>n.current,[]),r.createElement("points",x({key:`particle-${t}-${JSON.stringify(s)}`},i,{ref:n}),r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[u,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[b,1]}),r.createElement("bufferAttribute",{attach:"attributes-opacity",args:[A,1]}),r.createElement("bufferAttribute",{attach:"attributes-speed",args:[d,1]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[P,3]}),r.createElement("bufferAttribute",{attach:"attributes-noise",args:[h,3]})),c||r.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:g,depthWrite:!1}))});export{Q as S,K as a};
