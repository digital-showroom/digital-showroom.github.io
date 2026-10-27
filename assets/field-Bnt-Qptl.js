import{t as e}from"./main-Dvr-pVVl.js";import{Z as t,at as n,ot as r,v as i}from"./three.module-xdFANKNJ.js";import{dyno as a}from"./spark.module-d_JCslet.js";var o={rx:150,rz:98,soft:.32},s=`
  float rt_hash(vec3 p){ p = fract(p*0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
  // 0 before the front has reached p, 1 once a full width behind it
  float lockK(vec3 p, float h, vec4 lock){
    float r = length(p.xz - lock.xy);
    return clamp((lock.z - r - h * lock.w * 0.6) / max(lock.w, 0.01), 0.0, 1.0);
  }
  float islandK(vec2 xz, vec3 isl){
    return 1.0 - smoothstep(1.0 - isl.z, 1.0, length((xz - vec2(${e[0].toFixed(1)}, ${e[1].toFixed(1)})) / isl.xy));
  }
`;function c(e,t,n){return a.dynoBlock({gsplat:a.Gsplat},{gsplat:a.Gsplat},({gsplat:r})=>({gsplat:new a.Dyno({inTypes:{gsplat:a.Gsplat,...e},outTypes:{gsplat:a.Gsplat},globals:()=>[a.unindent(s)],statements:({inputs:e,outputs:t})=>a.unindentLines(`${t.gsplat} = ${e.gsplat};\n${n(t.gsplat,e)}`)}).apply({gsplat:r,...t}).gsplat}))}function l(){let t={cam:a.dynoVec4(new r(0,100,0,.001)),lock:a.dynoVec4(new r(e[0],e[1],-1,60)),island:a.dynoVec3(new n(o.rx,o.rz,o.soft)),hole:a.dynoVec4(new r(0,0,-1,-1))};return{modifier:c({cam:`vec4`,lock:`vec4`,island:`vec3`,hole:`vec4`},t,(e,t)=>`
    vec3 c0 = ${e}.center;
    float h = rt_hash(c0 * 3.17);
    float k = lockK(c0, h, ${t.lock});
    float isl = islandK(c0.xz, ${t.island});
    float dist = length(c0 - ${t.cam}.xyz);
    float dotS = dist * ${t.cam}.w * (0.55 + 0.4 * h) * (1.0 + 0.8 * smoothstep(0.0, 0.3, k));
    float ks = pow(smoothstep(0.25, 1.0, k), 1.6);
    float ka = smoothstep(0.0, 0.2, k);
    ${e}.scales = mix(vec3(dotS), ${e}.scales, ks);
    vec4 hb = ${t.hole};
    float inHole = step(hb.x, c0.x) * step(c0.x, hb.z) * step(hb.y, c0.z) * step(c0.z, hb.w);
    ${e}.rgba.a = ka * mix(0.92, ${e}.rgba.a, ks) * isl * step(h * 0.6, 0.15 + k) * (1.0 - inHole);
  `),u:t}}function u(a,{uvBox:c=[0,0,1,1]}={}){let l={map:{value:a},uvBox:{value:new r(...c)},lock:{value:new r(e[0],e[1],-1,60)},island:{value:new n(o.rx,o.rz,o.soft)},paper:{value:new n(.925,.914,.89)},hole:{value:new r(0,0,-1,-1)}};return new t({glslVersion:i,side:2,depthWrite:!1,transparent:!0,uniforms:l,vertexShader:`out vec2 vUv; out vec3 vW; uniform vec4 uvBox;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vUv = mix(uvBox.xy, uvBox.zw, uv); gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`precision highp float; in vec2 vUv; in vec3 vW; out vec4 o;
      uniform sampler2D map; uniform vec4 lock, hole; uniform vec3 island, paper;
      ${s}
      float hash2(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
      void main(){
        vec3 c = texture(map, vUv).rgb;
        float h = hash2(floor(vW.xz / 0.35) + 5.0);
        float k = smoothstep(0.0, 0.6, lockK(vW, h, lock));
        // only the quarter's own ground: beyond it the bake is a white paper maquette
        vec2 bx = abs(vW.xz - vec2(10.0, -7.5)) - vec2(80.0, 40.0);
        float edge = smoothstep(2.0, 14.0, length(max(bx, 0.0)) + h * 6.0);
        float inHole = step(hole.x, vW.x) * step(vW.x, hole.z) * step(hole.y, vW.z) * step(vW.z, hole.w);
        float a = k * (1.0 - edge) * islandK(vW.xz, island) * (1.0 - inHole);
        if (a < 0.01) discard;
        o = vec4(c, a);
      }`})}export{o as ISLAND,l as createField,u as lockGround};