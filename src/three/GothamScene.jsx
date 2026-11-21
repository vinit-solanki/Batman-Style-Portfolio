import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, MeshReflectorMaterial, PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer, SMAA, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import { EMBLEM_OUTLINE, EMBLEM_PIECES, centroid } from '../lib/emblem'
import { pointer, scrollState } from '../lib/scroll'

/* ───────────────────────── helpers ───────────────────────── */

const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const clamp01 = (x) => Math.min(1, Math.max(0, x))
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const easeOut = (x) => 1 - Math.pow(1 - x, 4)
const damp = THREE.MathUtils.damp

const FOG = new THREE.Color('#160709')
const FOG_DENSITY = 0.0125

// Uniform objects shared by every custom shader in the scene.
const uTime = { value: 0 }
const uFlash = { value: 0 }
const uFogColor = { value: FOG }
const uFogDensity = { value: FOG_DENSITY }
const uGlow = { value: 0 }
const uSignal = { value: 0 }
const uBeam = { value: 0 }
const uRainCam = { value: new THREE.Vector3() }

const FLARES = [
  [-5.5, 0.4, -62],
  [6, 0.4, -118],
  [-4.5, 0.4, -168],
  [5, 0.4, -214],
]
const uFlares = { value: FLARES.map((p) => new THREE.Vector3(p[0], p[1] + 1.2, p[2])) }

const SIGNAL_SRC = new THREE.Vector3(15, 66, -352)
const SIGNAL_DST = new THREE.Vector3(0, 128, -440)

const NOISE = /* glsl */ `
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float a = 0.5;
    float s = 0.0;
    for (int i = 0; i < 4; i++) {
      s += a * vnoise(p);
      p = p * 2.03 + 11.7;
      a *= 0.5;
    }
    return s;
  }
`

/* ───────────────────────── sky ───────────────────────── */

function Sky() {
  const ref = useRef()
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTime,
          uFlash,
          uHorizon: { value: new THREE.Color('#8a1611') },
          uEmber: { value: new THREE.Color('#c9521c') },
          uMid: { value: new THREE.Color('#12060a') },
          uZenith: { value: new THREE.Color('#020203') },
          uCloud: { value: new THREE.Color('#3d0e13') },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader:
          NOISE +
          /* glsl */ `
          uniform float uTime;
          uniform float uFlash;
          uniform vec3 uHorizon;
          uniform vec3 uEmber;
          uniform vec3 uMid;
          uniform vec3 uZenith;
          uniform vec3 uCloud;
          varying vec3 vDir;
          void main() {
            vec3 d = normalize(vDir);
            float h = d.y;
            // the glow is strongest toward -Z: the far end of the avenue
            float ahead = smoothstep(-0.25, 1.0, -d.z);
            vec3 col = mix(uMid, uZenith, smoothstep(0.0, 0.55, h));
            col += uHorizon * exp(-abs(h) * 6.0) * (0.3 + 1.1 * ahead);
            col += uEmber * exp(-abs(h) * 16.0) * pow(ahead, 5.0) * 0.55;
            vec2 cuv = d.xz / (abs(h) + 0.22);
            float c = fbm(cuv * 1.3 + vec2(uTime * 0.012, 0.0));
            float cm = smoothstep(0.4, 0.85, c) * smoothstep(0.03, 0.4, h);
            col += uCloud * cm * 0.6;
            col += vec3(0.4, 0.46, 0.62) * uFlash * (0.2 + c) * smoothstep(-0.05, 0.35, h);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  )
  useFrame(({ camera }) => ref.current.position.copy(camera.position))
  return (
    <mesh ref={ref} material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[900, 40, 20]} />
    </mesh>
  )
}

/* ───────────────────────── city ───────────────────────── */

function buildCity() {
  const r = rng(11)
  const list = []
  const base = [15, 26, 42, 60]
  for (const side of [-1, 1]) {
    for (let row = 0; row < 4; row++) {
      let z = 96
      while (z > -468) {
        const w = 9 + r() * 9
        const d = 9 + r() * 12
        let h = base[row] * (0.7 + r() * 1.05)
        if (r() > 0.93) h += 24 + r() * 18
        const x = side * (11 + row * 18 + w / 2 + r() * 3)
        list.push([x, z - d / 2, w, h, d, r()])
        z -= d + 1.2 + r() * 3.5
      }
    }
  }
  // distant skyline wall that closes the avenue
  for (let x = -360; x < 360; ) {
    const w = 14 + r() * 22
    list.push([x + w / 2, -500 - r() * 70, w, 50 + r() * 125, 18 + r() * 14, r()])
    x += w + r() * 6
  }
  // the tower the signal is mounted on
  list.push([SIGNAL_SRC.x, SIGNAL_SRC.z, 10, SIGNAL_SRC.y, 10, 0.42])
  return list
}

function City() {
  const ref = useRef()
  const { geometry, material, list } = useMemo(() => {
    const list = buildCity()
    const scales = new Float32Array(list.length * 3)
    const seeds = new Float32Array(list.length)
    list.forEach(([, , w, h, d, s], i) => {
      scales.set([w, h, d], i * 3)
      seeds[i] = s
    })
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    geometry.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 3))
    geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime,
        uFlash,
        uFogColor,
        uFogDensity,
        uFlares,
        uWarm: { value: new THREE.Color('#ffa24a') },
        uCold: { value: new THREE.Color('#b9cfe6') },
        uRed: { value: new THREE.Color('#ff2a1e') },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aScale;
        attribute float aSeed;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vScale;
        varying vec3 vWorld;
        varying float vSeed;
        varying float vDepth;
        void main() {
          vUv = uv;
          vNormal = normal;
          vScale = aScale;
          vSeed = aSeed;
          vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vWorld = world.xyz;
          vec4 mv = viewMatrix * world;
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uFlash;
        uniform vec3 uFogColor;
        uniform float uFogDensity;
        uniform vec3 uFlares[4];
        uniform vec3 uWarm;
        uniform vec3 uCold;
        uniform vec3 uRed;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vScale;
        varying vec3 vWorld;
        varying float vSeed;
        varying float vDepth;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        void main() {
          float side = step(abs(vNormal.y), 0.5);
          float faceW = abs(vNormal.x) > 0.5 ? vScale.z : vScale.x;
          float faceId = vNormal.x * 2.0 + vNormal.z * 5.0;

          vec3 col = mix(vec3(0.008, 0.008, 0.011), vec3(0.022, 0.016, 0.017), vSeed);

          // windows
          vec2 grid = max(vec2(1.0), floor(vec2(faceW / 1.2, vScale.y / 1.6)));
          vec2 guv = vUv * grid;
          vec2 cell = floor(guv);
          vec2 f = fract(guv);
          float r1 = hash(cell + vSeed * 91.7 + faceId * 13.1);
          float r2 = hash(cell * 1.7 + vSeed * 17.3 + faceId);
          float density = 0.84 + 0.12 * hash(vec2(vSeed, 3.3));
          // a few floors per tower are fully occupied
          float office = step(0.91, hash(vec2(cell.y, vSeed * 7.0 + faceId)));
          float lit = step(density - office * 0.5, r1);
          float wx = smoothstep(0.2, 0.28, f.x) * smoothstep(0.8, 0.72, f.x);
          float wy = smoothstep(0.24, 0.33, f.y) * smoothstep(0.78, 0.69, f.y);
          float win = wx * wy * side;
          vec3 wcol = mix(uWarm, uCold, step(0.84, r2));
          wcol = mix(wcol, uRed, step(0.94, r2));
          float flick = 1.0;
          if (r2 < 0.035) {
            flick = 0.35 + 0.65 * step(0.4, fract(sin(floor(uTime * 9.0) + r1 * 90.0) * 43.7));
          }
          col += wcol * win * lit * (0.22 + 1.7 * r2 * r2) * flick;
          col += vec3(0.012, 0.014, 0.02) * win * (1.0 - lit);

          // sodium streetlight wash near the pavement
          float lampPhase = 0.6 + 0.4 * cos((vWorld.z - 60.0) * 0.1496 + (vWorld.x > 0.0 ? 3.1416 : 0.0));
          col += uWarm * 0.07 * exp(-vWorld.y * 0.2) * lampPhase * side;

          // red flare light spilling onto the canyon walls
          float red = 0.0;
          for (int i = 0; i < 4; i++) {
            vec3 dv = uFlares[i] - vWorld;
            float d2 = dot(dv, dv);
            red += max(dot(normalize(dv), vNormal), 0.0) / (1.0 + d2 * 0.011);
          }
          col += vec3(0.95, 0.05, 0.035) * red * 0.6;

          // lightning
          col += vec3(0.05, 0.058, 0.08) * uFlash * (0.4 + 0.6 * vNormal.y);

          float fog = 1.0 - exp(-uFogDensity * uFogDensity * vDepth * vDepth);
          gl_FragColor = vec4(mix(col, uFogColor, fog), 1.0);
        }
      `,
    })
    return { geometry, material, list }
  }, [])

  useEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    list.forEach(([x, z, w, h, d], i) => {
      p.set(x, h / 2, z)
      s.set(w, h, d)
      m.compose(p, q, s)
      ref.current.setMatrixAt(i, m)
    })
    ref.current.instanceMatrix.needsUpdate = true
  }, [list])

  return <instancedMesh ref={ref} args={[geometry, material, list.length]} frustumCulled={false} />
}

/* ───────────────────────── street ───────────────────────── */

function Ground({ reflective }) {
  // The mirror pass renders the city a second time, so it is the first thing dropped under load.
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -200]}>
      <planeGeometry args={[900, 1100]} />
      {reflective ? (
        <MeshReflectorMaterial
          resolution={512}
          blur={[300, 90]}
          mixBlur={1}
          mixStrength={16}
          mixContrast={1}
          depthScale={0.9}
          minDepthThreshold={0.5}
          maxDepthThreshold={1.3}
          mirror={0.72}
          roughness={0.78}
          metalness={0.5}
          color="#09090b"
          envMapIntensity={0.12}
        />
      ) : (
        <meshStandardMaterial color="#070709" roughness={0.5} metalness={0.65} envMapIntensity={0.35} />
      )}
    </mesh>
  )
}

const coneShader = {
  vertexShader: /* glsl */ `
    varying vec3 vN;
    varying vec3 vV;
    varying float vH;
    varying float vDepth;
    void main() {
      vec4 lp = vec4(position, 1.0);
      vec3 n = normal;
      #ifdef USE_INSTANCING
        lp = instanceMatrix * lp;
        n = mat3(instanceMatrix) * n;
      #endif
      vec4 mv = modelViewMatrix * lp;
      vN = normalize(normalMatrix * n);
      vV = normalize(-mv.xyz);
      vH = uv.y;
      vDepth = -mv.z;
      gl_Position = projectionMatrix * mv;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uColor;
    uniform float uStrength;
    uniform float uPower;
    uniform float uLow;
    uniform float uHigh;
    uniform float uFog;
    varying vec3 vN;
    varying vec3 vV;
    varying float vH;
    varying float vDepth;
    void main() {
      float facing = pow(abs(dot(normalize(vN), normalize(vV))), uPower);
      float along = mix(uLow, uHigh, vH);
      float fog = exp(-uFog * uFog * vDepth * vDepth);
      gl_FragColor = vec4(uColor * facing * along * uStrength * fog, 1.0);
    }
  `,
}

const makeCone = (uniforms) =>
  new THREE.ShaderMaterial({
    ...coneShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    fog: false,
  })

const LAMP_COUNT = 26
const LAMP_COLOR = new THREE.Color(7, 3.3, 1.05)

function Lamps() {
  const posts = useRef()
  const heads = useRef()
  const cones = useRef()
  const coneMaterial = useMemo(
    () =>
      makeCone({
        uColor: { value: new THREE.Color('#ff9a48') },
        uStrength: { value: 0.2 },
        uPower: { value: 1.6 },
        uLow: { value: 0.12 },
        uHigh: { value: 1 },
        uFog: { value: FOG_DENSITY },
      }),
    [],
  )
  useEffect(() => {
    const m = new THREE.Matrix4()
    for (let i = 0; i < LAMP_COUNT; i++) {
      const side = i % 2 ? 1 : -1
      const z = 60 - i * 21
      posts.current.setMatrixAt(i, m.makeTranslation(side * 9.7, 3.6, z))
      heads.current.setMatrixAt(i, m.makeTranslation(side * 8.9, 7.25, z))
      cones.current.setMatrixAt(i, m.makeTranslation(side * 8.6, 3.6, z))
    }
    for (const r of [posts, heads, cones]) r.current.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <>
      <instancedMesh ref={posts} args={[undefined, undefined, LAMP_COUNT]} frustumCulled={false}>
        <cylinderGeometry args={[0.07, 0.11, 7.2, 6]} />
        <meshBasicMaterial color="#030303" />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, undefined, LAMP_COUNT]} frustumCulled={false}>
        <boxGeometry args={[1.6, 0.12, 0.34]} />
        <meshBasicMaterial color={LAMP_COLOR} />
      </instancedMesh>
      <instancedMesh ref={cones} args={[undefined, coneMaterial, LAMP_COUNT]} frustumCulled={false}>
        <coneGeometry args={[4.4, 7.2, 28, 1, true]} />
      </instancedMesh>
    </>
  )
}

const NEON_COUNT = 36

function Neons() {
  const ref = useRef()
  useEffect(() => {
    const r = rng(23)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    const c = new THREE.Color()
    for (let i = 0; i < NEON_COUNT; i++) {
      const side = r() > 0.5 ? 1 : -1
      p.set(side * (10.5 + r() * 0.35), 5 + r() * 15, 40 - r() * 470)
      s.set(1, 2.5 + r() * 6.5, 1)
      ref.current.setMatrixAt(i, m.compose(p, q, s))
      if (r() > 0.28) c.setRGB(5.2, 0.16, 0.2)
      else c.setRGB(4.6, 1.9, 0.45)
      ref.current.setColorAt(i, c)
    }
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.instanceColor.needsUpdate = true
  }, [])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, NEON_COUNT]} frustumCulled={false}>
      <boxGeometry args={[0.16, 1, 0.9]} />
      <meshBasicMaterial />
    </instancedMesh>
  )
}

const FLARE_COLOR = new THREE.Color(9, 0.5, 0.35)

function Flares() {
  const lights = useRef([])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    lights.current.forEach((l, i) => {
      if (l) l.intensity = 300 * (0.84 + 0.16 * Math.sin(t * 13 + i * 4.1) * Math.sin(t * 7.3 + i))
    })
  })
  return FLARES.map((p, i) => (
    <group key={i} position={p}>
      <pointLight
        ref={(el) => {
          lights.current[i] = el
        }}
        color="#ff1d14"
        intensity={300}
        distance={70}
        decay={1.7}
        position={[0, 1.2, 0]}
      />
      <mesh>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshBasicMaterial color={FLARE_COLOR} />
      </mesh>
    </group>
  ))
}

/* ───────────────────────── rain ───────────────────────── */

// Each drop is a thin camera-facing ribbon with feathered edges, so the streaks stay
// soft and continuous instead of strobing like one-pixel lines.
function Rain({ count }) {
  const { geometry, material } = useMemo(() => {
    const r = rng(42)
    const seed = new Float32Array(count * 3)
    const speed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      seed.set([r(), r(), r()], i * 3)
      speed[i] = 15 + r() * 10
    }
    const quad = new THREE.PlaneGeometry(1, 1)
    const geometry = new THREE.InstancedBufferGeometry()
    geometry.index = quad.index
    geometry.setAttribute('position', quad.attributes.position)
    geometry.setAttribute('uv', quad.attributes.uv)
    geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 3))
    geometry.setAttribute('aSpeed', new THREE.InstancedBufferAttribute(speed, 1))
    geometry.instanceCount = count

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      fog: false,
      uniforms: {
        uTime,
        uFlash,
        uCam: uRainCam,
        uBox: { value: new THREE.Vector3(54, 44, 54) },
        uColor: { value: new THREE.Color('#aab6cc') },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uCam;
        uniform vec3 uBox;
        attribute vec3 aSeed;
        attribute float aSpeed;
        varying vec2 vUv;
        varying float vAlpha;
        const float WIND = 0.08;
        void main() {
          vec3 p = aSeed * uBox;
          p.y -= uTime * aSpeed;
          p.x += uTime * aSpeed * WIND;
          // keep the volume wrapped around the camera so it rains wherever we fly
          p = mod(p - uCam + uBox * 0.5, uBox) - uBox * 0.5 + uCam;

          vec3 dir = normalize(vec3(-WIND, 1.0, 0.0));
          vec3 side = normalize(cross(dir, normalize(cameraPosition - p)));
          float len = 0.55 + aSpeed * 0.035;
          float width = 0.018 + aSeed.z * 0.02;
          vec3 world = p + dir * (uv.y * len) + side * ((uv.x - 0.5) * width);

          vec4 mv = viewMatrix * vec4(world, 1.0);
          gl_Position = projectionMatrix * mv;
          float d = -mv.z;
          vUv = uv;
          vAlpha = smoothstep(uBox.z * 0.5, uBox.z * 0.2, d) * smoothstep(0.8, 4.0, d) * step(0.0, p.y);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uFlash;
        varying vec2 vUv;
        varying float vAlpha;
        void main() {
          float across = 1.0 - abs(vUv.x * 2.0 - 1.0);
          float along = smoothstep(0.0, 0.12, vUv.y) * (1.0 - vUv.y);
          gl_FragColor = vec4(uColor * (1.0 + uFlash * 2.0), across * along * vAlpha * 0.5);
        }
      `,
    })
    return { geometry, material }
  }, [count])

  useFrame(({ camera }) => uRainCam.value.copy(camera.position))
  return <mesh geometry={geometry} material={material} frustumCulled={false} />
}

/* ───────────────────────── bats ───────────────────────── */

function Bats({ count = 34 }) {
  const { geometry, material } = useMemo(() => {
    const r = rng(77)
    const geometry = new THREE.InstancedBufferGeometry()
    // body + two wings; the wing tips (aWing = 1) flap in the vertex shader
    const pos = new Float32Array([
      0.3, 0, 0, -0.06, 0, 0.95, -0.24, 0, 0,
      0.3, 0, 0, -0.24, 0, 0, -0.06, 0, -0.95,
    ])
    const wing = new Float32Array([0, 1, 0, 0, 0, 1])
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geometry.setAttribute('aWing', new THREE.BufferAttribute(wing, 1))
    const data = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      data.set([r() * 6.283, 16 + r() * 46, (r() - 0.5) * 26, (0.16 + r() * 0.22) * (r() > 0.5 ? 1 : -1)], i * 4)
    }
    geometry.setAttribute('aData', new THREE.InstancedBufferAttribute(data, 4))
    geometry.instanceCount = count

    const material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      fog: false,
      uniforms: { uTime, uFogColor, uFogDensity },
      vertexShader: /* glsl */ `
        uniform float uTime;
        attribute float aWing;
        attribute vec4 aData; // phase, radius, height, speed
        varying float vDepth;
        void main() {
          float ang = uTime * aData.w + aData.x;
          vec3 c = vec3(cos(ang) * aData.y, aData.z + sin(ang * 2.0 + aData.x) * 4.0, sin(ang) * aData.y * 0.55);
          vec2 tg = normalize(vec2(-sin(ang), cos(ang) * 0.55)) * sign(aData.w);
          vec3 p = position * 1.9;
          p.y += aWing * sin(uTime * 15.0 + aData.x * 7.0) * 1.1;
          vec3 w = vec3(p.x * tg.x - p.z * tg.y, p.y, p.x * tg.y + p.z * tg.x);
          vec4 mv = modelViewMatrix * vec4(c + w, 1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uFogColor;
        uniform float uFogDensity;
        varying float vDepth;
        void main() {
          float fog = 1.0 - exp(-uFogDensity * uFogDensity * vDepth * vDepth);
          gl_FragColor = vec4(mix(vec3(0.0), uFogColor, fog * 0.85), 1.0);
        }
      `,
    })
    return { geometry, material }
  }, [count])

  return <mesh geometry={geometry} material={material} position={[0, 50, -30]} frustumCulled={false} />
}

/* ───────────────────────── emblem ───────────────────────── */

const EMBLEM_Y = 48
const EMBLEM_Z = 30
// distance from the opening camera to the emblem, and the height of the view centre at that depth
const EMBLEM_DISTANCE = 36
const EMBLEM_CENTER_Y = 42.64

function Emblem({ booted }) {
  const group = useRef()
  const meshes = useRef([])
  const glow = useRef()
  const light = useRef()
  const startAt = useRef(null)
  const height = useRef(EMBLEM_Y)

  const parts = useMemo(() => {
    const r = rng(5)
    return EMBLEM_PIECES.map((pts, i) => {
      const [cx, cy] = centroid(pts)
      const shape = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x - cx, y - cy)))
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.07,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.013,
        bevelSegments: 2,
      })
      geometry.translate(0, 0, -0.035)
      const out = new THREE.Vector3(cx, cy * 0.6, 0)
      if (out.lengthSq() < 0.001) out.set(0, 0.25, 0)
      out.normalize()
      return {
        geometry,
        cx,
        cy,
        out,
        from: new THREE.Vector3(cx * 2.3 + (r() - 0.5) * 1.2, cy + (r() - 0.5) * 1.6, 0.8 + r() * 1.7),
        spin: new THREE.Vector3((r() - 0.5) * 5, (r() - 0.5) * 5, (r() - 0.5) * 3),
        depth: r() - 0.3,
        delay: i === 0 ? 0 : 0.14 + ((i - 1) % 3) * 0.15,
        // wings sweep back from the spine, so every plate reflects a different slice of the sky
        yaw: cx * 0.3,
        rest: -Math.abs(cx) * 0.13,
      }
    })
  }, [])

  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        fog: false,
        uniforms: { uOpacity: uGlow, uColor: { value: new THREE.Color('#ff1a14') } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - 0.5) * vec2(2.0, 2.6);
            float g = exp(-dot(p, p) * 3.2);
            gl_FragColor = vec4(uColor * g * uOpacity, 1.0);
          }
        `,
      }),
    [],
  )

  useFrame((state, dt) => {
    const g = group.current
    const t = state.clock.elapsedTime
    if (booted && startAt.current === null) startAt.current = t
    const elapsed = startAt.current === null ? 0 : t - startAt.current
    const burst = smooth(0.012, 0.14, scrollState.t)

    g.visible = scrollState.t < 0.2
    if (!g.visible) return

    // Fit the emblem into the open sky above the hero copy, whatever the screen shape.
    const aspect = state.size.width / state.size.height
    const span = 2 * EMBLEM_DISTANCE * Math.tan((state.camera.fov * Math.PI) / 360) // world units per screen height
    const scale = Math.min(7.6, (scrollState.heroFree * 0.9 * span) / 0.64, (0.86 * aspect * span) / 2.1)
    const baseY = EMBLEM_CENTER_Y + (0.5 - scrollState.heroMid) * span
    g.scale.setScalar(scale)

    let assembled = 0
    parts.forEach((p, i) => {
      const m = meshes.current[i]
      if (!m) return
      const a = startAt.current === null ? 0 : easeOut(clamp01((elapsed - p.delay) / 1.7))
      if (i === 0) assembled = a
      const k = 1 - a
      m.position.set(
        p.cx + (p.from.x - p.cx) * k + p.out.x * burst * 2.1,
        p.cy + (p.from.y - p.cy) * k + p.out.y * burst * 1.4,
        p.rest + (p.from.z - p.rest) * k + p.depth * burst * 2.4,
      )
      const twist = k + burst * 0.55
      m.rotation.set(p.spin.x * twist, p.yaw + p.spin.y * twist, p.spin.z * (k + burst * 0.3))
    })

    g.rotation.y = damp(g.rotation.y, pointer.x * 0.34 + Math.sin(t * 0.35) * 0.07, 3, dt)
    g.rotation.x = damp(g.rotation.x, -pointer.y * 0.2 + Math.sin(t * 0.27) * 0.03, 3, dt)
    height.current = damp(height.current, baseY, 6, dt)
    g.position.y = height.current + Math.sin(t * 0.6) * 0.22

    const pulse = 0.85 + Math.sin(t * 1.3) * 0.08 + Math.sin(t * 9.1) * 0.02
    uGlow.value = 0.62 * assembled * (1 - burst) * pulse
    light.current.intensity = 1500 * assembled * (1 - burst * 0.8) * pulse
  })

  return (
    <>
      <group ref={group} position={[0, EMBLEM_Y, EMBLEM_Z]}>
        {parts.map((p, i) => (
          <mesh
            key={i}
            ref={(el) => {
              meshes.current[i] = el
            }}
            geometry={p.geometry}
          >
            <meshStandardMaterial color="#17171b" metalness={0.9} roughness={0.36} envMapIntensity={1.35} />
          </mesh>
        ))}
        <mesh ref={glow} material={glowMaterial} position={[0, -0.05, -1.3]} renderOrder={-1}>
          <planeGeometry args={[7.2, 3.8]} />
        </mesh>
      </group>
      <pointLight ref={light} color="#ff2016" position={[0, EMBLEM_Y - 9, EMBLEM_Z + 7]} distance={60} decay={1.8} />
    </>
  )
}

/* ───────────────────────── bat-signal ───────────────────────── */

function makeSignalMask() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)
  ctx.fillStyle = '#fff'
  const s = 122
  ctx.beginPath()
  EMBLEM_OUTLINE.forEach(([x, y], i) => {
    const px = size / 2 + x * s
    const py = size / 2 - y * s
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  })
  ctx.closePath()
  ctx.fill()
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.NoColorSpace
  return texture
}

function Signal() {
  const disc = useRef()
  const lit = useRef(0)

  const { discMaterial, beamMaterial, beam } = useMemo(() => {
    const discMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      uniforms: {
        uTime,
        uOn: uSignal,
        uMask: { value: makeSignalMask() },
        uColor: { value: new THREE.Color('#ffe2a8') },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader:
        NOISE +
        /* glsl */ `
        uniform float uTime;
        uniform float uOn;
        uniform sampler2D uMask;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          float disc = smoothstep(0.6, 0.5, r);
          float halo = exp(-r * r * 3.4);
          float bat = texture2D(uMask, vUv).r;
          float cloud = 0.55 + 0.75 * fbm(p * 2.6 + vec2(uTime * 0.03, 0.0));
          float light = disc * (1.0 - bat) * cloud * 1.5 + halo * 0.28;
          gl_FragColor = vec4(uColor * light * uOn, 1.0);
        }
      `,
    })

    const beamMaterial = makeCone({
      uColor: { value: new THREE.Color('#ffdca0') },
      uStrength: uBeam,
      uPower: { value: 1.4 },
      uLow: { value: 1 },
      uHigh: { value: 0.3 },
      uFog: { value: 0 },
    })

    const dir = new THREE.Vector3().subVectors(SIGNAL_DST, SIGNAL_SRC)
    const length = dir.length()
    const beam = {
      length,
      position: new THREE.Vector3().addVectors(SIGNAL_SRC, SIGNAL_DST).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()),
    }
    return { discMaterial, beamMaterial, beam }
  }, [])

  useEffect(() => {
    disc.current.lookAt(SIGNAL_SRC)
  }, [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const target = smooth(0.85, 0.92, scrollState.t)
    lit.current = damp(lit.current, target, 2.2, dt)
    // the lamp stutters while it warms up, then holds steady
    const warming = lit.current > 0.03 && lit.current < 0.75
    const stutter = warming ? 0.35 + 0.65 * Math.round(0.5 + 0.5 * Math.sin(t * 31) * Math.sin(t * 17.3)) : 1
    const on = lit.current * stutter * (0.94 + 0.06 * Math.sin(t * 2.1))
    uSignal.value = on * 2.1
    uBeam.value = on * 0.26
  })

  return (
    <>
      <mesh ref={disc} position={SIGNAL_DST} material={discMaterial} frustumCulled={false}>
        <planeGeometry args={[108, 108]} />
      </mesh>
      <mesh position={beam.position} quaternion={beam.quaternion} material={beamMaterial} frustumCulled={false}>
        <cylinderGeometry args={[31, 1.3, beam.length, 40, 1, true]} />
      </mesh>
    </>
  )
}

/* ───────────────────────── camera + weather ───────────────────────── */

// Eight keyframes, evenly spaced along the scroll timeline.
const CAM_POS = [
  [0, 44, 66],
  [0, 42, 24],
  [-2, 21, -12],
  [-3, 4.2, -52],
  [3, 3.2, -98],
  [-2.5, 3.6, -142],
  [0, 5, -182],
  [4, 7, -200],
]
const CAM_LOOK = [
  [0, 41.5, 0],
  [0, 32, -60],
  [0, 10, -92],
  [1, 6, -132],
  [-1, 7, -178],
  [2, 10, -218],
  [6, 34, -280],
  [0, 104, -440],
]

function Rig() {
  const state = useRef({ t: 0, px: 0, py: 0 })
  const { pos, look, vp, vl } = useMemo(
    () => ({
      pos: new THREE.CatmullRomCurve3(CAM_POS.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.5),
      look: new THREE.CatmullRomCurve3(CAM_LOOK.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.5),
      vp: new THREE.Vector3(),
      vl: new THREE.Vector3(),
    }),
    [],
  )

  useFrame(({ camera, clock, size }, dt) => {
    const s = state.current
    uTime.value = clock.elapsedTime

    const aspect = size.width / size.height
    const fov = aspect < 0.8 ? 62 : aspect < 1.25 ? 52 : 45
    if (camera.fov !== fov) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }

    s.t = damp(s.t, scrollState.t, 5, dt)
    s.px = damp(s.px, pointer.x, 2.5, dt)
    s.py = damp(s.py, pointer.y, 2.5, dt)
    pos.getPoint(clamp01(s.t), vp)
    look.getPoint(clamp01(s.t), vl)
    // frame the signal where the contact layout leaves room: top-right on wide screens, top-centre on tall ones
    if (aspect > 1.25) {
      const settle = smooth(0.9, 1, s.t)
      vl.set(vl.x - 67 * settle, vl.y - 37 * settle, vl.z + 8 * settle)
    } else if (aspect > 0.8) {
      const settle = smooth(0.88, 0.97, s.t)
      vl.set(vl.x - 30 * settle, vl.y - 40 * settle, vl.z)
    } else {
      const settle = smooth(0.85, 0.9, s.t)
      vl.set(vl.x, vl.y - 57 * settle, vl.z)
    }

    const time = clock.elapsedTime
    const calm = 1 - smooth(0.05, 0.3, s.t) * 0.55
    camera.position.set(
      vp.x + s.px * 1.9 * calm + Math.sin(time * 0.31) * 0.2,
      vp.y + s.py * 1.1 * calm + Math.sin(time * 0.43) * 0.12,
      vp.z,
    )
    camera.lookAt(vl.x + s.px * 0.7, vl.y + s.py * 0.5, vl.z)
    camera.rotation.z += s.px * -0.012 + Math.sin(time * 0.2) * 0.003
  })
  return null
}

function Storm() {
  const state = useRef({ next: 7, echo: 0 })
  const ambient = useRef()
  useFrame(({ clock }, dt) => {
    const s = state.current
    const t = clock.elapsedTime
    if (t > s.next) {
      uFlash.value = 0.9
      s.echo = t + 0.14
      s.next = t + 10 + ((t * 7.13) % 13)
    }
    if (s.echo && t > s.echo) {
      uFlash.value = Math.max(uFlash.value, 0.6)
      s.echo = 0
    }
    uFlash.value *= Math.exp(-dt * 6)
    ambient.current.intensity = 0.22 + uFlash.value * 0.9
  })
  return (
    <>
      <ambientLight ref={ambient} color="#8590b0" intensity={0.22} />
      <directionalLight color="#7f93c4" intensity={0.5} position={[-30, 80, 40]} />
    </>
  )
}

function Ready({ onReady }) {
  const frames = useRef(0)
  useFrame(() => {
    if (frames.current < 0) return
    frames.current += 1
    if (frames.current > 4) {
      frames.current = -1
      onReady?.()
    }
  })
  return null
}

/* ───────────────────────── scene ───────────────────────── */

const CAPTURE = typeof window !== 'undefined' && window.location.search.includes('capture')

export default function GothamScene({ booted, onReady, tier = 'high' }) {
  const high = tier === 'high'
  const maxDpr = Math.min(window.devicePixelRatio || 1, high ? 1.25 : 1)
  // 0 = everything on, 1 = no street reflections, 2 = reduced resolution as well
  const [load, setLoad] = useState(high ? 0 : 1)
  const dpr = load >= 2 ? Math.min(maxDpr, 0.85) : maxDpr

  return (
    <Canvas
      flat
      dpr={dpr}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false, preserveDrawingBuffer: CAPTURE }}
      camera={{ fov: 45, near: 0.3, far: 2400, position: CAM_POS[0] }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => gl.setClearColor('#050506')}
    >
      <PerformanceMonitor flipflops={2} onDecline={() => setLoad((l) => Math.min(2, l + 1))} />
      <fogExp2 attach="fog" args={[FOG, FOG_DENSITY]} />

      <Environment resolution={128} frames={1}>
        <color attach="background" args={['#030203']} />
        {/* cold moonlight from the left, flare light from the right and below */}
        <Lightformer form="rect" intensity={0.55} color="#5a0a0d" position={[0, 0, 10]} scale={[10, 10, 1]} />
        <Lightformer form="rect" intensity={3.2} color="#cfdcff" position={[-9, 1, 7]} scale={[3, 9, 1]} />
        <Lightformer form="rect" intensity={5} color="#bcd0ff" position={[-12, 0, 2]} scale={[3, 10, 1]} />
        <Lightformer form="rect" intensity={4.5} color="#ff3a1c" position={[9, 1, 7]} scale={[3, 9, 1]} />
        <Lightformer form="rect" intensity={8} color="#ff1c14" position={[12, 0, 2]} scale={[3, 10, 1]} />
        <Lightformer form="rect" intensity={6} color="#ff1c14" position={[0, -6, 4]} scale={[16, 4, 1]} />
        <Lightformer form="rect" intensity={3} color="#dfe8ff" position={[0, 7, 3]} scale={[12, 2, 1]} />
      </Environment>

      <Rig />
      <Storm />
      <Sky />
      <City />
      <Ground reflective={load === 0} />
      <Lamps />
      <Neons />
      <Flares />
      <Rain count={high ? 3000 : 1400} />
      <Bats />
      <Emblem booted={booted} />
      <Signal />

      <EffectComposer multisampling={0}>
        {high && <SMAA />}
        <Bloom mipmapBlur levels={6} intensity={1.05} luminanceThreshold={0.4} luminanceSmoothing={0.25} radius={0.72} />
        <Vignette eskil={false} offset={0.22} darkness={0.8} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>

      <Ready onReady={onReady} />
    </Canvas>
  )
}
