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

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

/** Cool grey face with a bright cream rim that wraps the lower-left edge. */
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
      ${LIT_SIDE}
      void main() {
        vec3 n = normalize(vNormal);
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
        gl_FragColor = vec4(uColor, glow * (0.25 + 0.95 * litSide(n)));
        #include <colorspace_fragment>
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  })
}
