import * as THREE from 'three'

// Both shaders work in view space: N·V is 1 facing the camera and 0 at the silhouette.
// The mock's glow wraps the left and bottom of the orb, so the lit side is down-left.
// Colors are sampled from the mock: the glow is lighter than the page (near white),
// while the orb's face is a cool grey a little darker than the page.

const LIT_SIDE = /* glsl */ `
  float litSide(vec3 n) {
    return smoothstep(-0.35, 0.85, dot(n.xy, normalize(vec2(-0.75, -0.65))));
  }
`

// 3D simplex noise (Ashima Arts / Stefan Gustavson, MIT)
const SIMPLEX_NOISE = /* glsl */ `
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPos;
  void main() {
    vPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

/** Cool grey face with a bright cream rim that wraps the lower-left edge; the upper-right
 * side dissolves into ragged holes (the dust that breaks off comes in a later layer). */
export function orbSurfaceMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uFace: { value: new THREE.Color(0xd8d5d2) },
      uFaceLight: { value: new THREE.Color(0xe3dfda) },
      uGlow: { value: new THREE.Color(0xfef8ee) },
      uWarm: { value: new THREE.Color(0xf2c4ac) },
    },
    vertexShader,
    fragmentShader: /* glsl */ `
      uniform vec3 uFace, uFaceLight, uGlow, uWarm;
      varying vec3 vNormal;
      varying vec3 vView;
      varying vec3 vPos;
      ${LIT_SIDE}
      ${SIMPLEX_NOISE}
      void main() {
        vec3 n = normalize(vNormal);

        // dissolve: 0 on the calm side, rising toward the screen's upper right;
        // noise on the surface (object space, so the holes stick to the orb) breaks it up
        float erode = smoothstep(-0.2, 0.75, dot(n, normalize(vec3(0.75, 0.6, 0.3))));
        float grain = snoise(vPos * 2.5) * 0.6 + snoise(vPos * 7.0) * 0.4;
        if (grain * 0.5 + 0.5 < erode * 1.15 - 0.05) discard;
        float lit = litSide(n);
        float edge = 1.0 - max(dot(n, normalize(vView)), 0.0);

        // nearly flat face, slightly lighter toward the lit side
        vec3 color = mix(uFace, uFaceLight, lit * 0.6);
        // warm haze creeping in from the edge, then a bright cream band at the silhouette
        color = mix(color, uWarm, pow(edge, 3.0) * lit * 0.8);
        color = mix(color, uGlow, clamp(pow(edge, 3.5) * (0.4 + 1.4 * lit), 0.0, 1.0));

        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
  })
}

/** Soft cream glow spilling outside the silhouette on the lit side. */
export function orbHaloMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0xfbe2d2) } },
    vertexShader,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying vec3 vNormal;
      varying vec3 vView;
      ${LIT_SIDE}
      void main() {
        vec3 n = normalize(vNormal);
        // back faces: N·V is 0 at the shell's outer edge and grows negative toward the orb
        float glow = pow(clamp(-dot(n, normalize(vView)) * 1.6, 0.0, 1.0), 2.0);
        // no glow where the surface has dissolved
        float intact = 1.0 - smoothstep(-0.1, 0.6, dot(n.xy, normalize(vec2(0.75, 0.6))));
        gl_FragColor = vec4(uColor, glow * (0.25 + 0.95 * litSide(n)) * intact);
        #include <colorspace_fragment>
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  })
}
