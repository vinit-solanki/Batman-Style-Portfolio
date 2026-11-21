// The bat mark: a long, flat wingspan with a scooped top edge, two small ears and a
// squared-off tail. Coordinates are y-up with x in [-1, 1]; the same points feed the
// SVG logo, the bat-signal mask and the plated 3D emblem.

// Right half of the silhouette, from the notch between the ears round to the tail.
const HALF = [
  [0.0252, -0.0252], // notch between the ears
  [0.0252, 0.0588], // ear tip
  [0.0861, -0.0441],
  [0.168, -0.0147],
  [0.1996, 0.0063],
  [0.2563, 0.0231],
  [0.3298, 0.1113],
  [0.3676, 0.1996],
  [0.3824, 0.3151], // inner wing peak
  [1, 0.067], // wing tip
  [0.895, 0.071],
  [0.809, 0.05],
  [0.636, 0.002],
  [0.603, -0.046],
  [0.575, -0.115],
  [0.32, -0.151],
  [0.089, -0.311], // tail corner
]

const mirror = (pts) => pts.map(([x, y]) => [-x, y]).reverse()
const shift = (pts, dx) => pts.map(([x, y]) => [x + dx, y])

/** The whole silhouette as one closed polygon. */
export const EMBLEM_OUTLINE = [...HALF, ...mirror(HALF)]

// The 3D emblem is the same silhouette cut into seven armour plates.
const GAP = 0.013
const CUT = [0.62, 0.2196] // where the wing's top edge is split between mid and tip plates

const CENTER = [
  [-0.0861, -0.0441], [-0.0252, 0.0588], [-0.0252, -0.0252], [0.0252, -0.0252],
  [0.0252, 0.0588], [0.0861, -0.0441], [0.089, -0.311], [-0.089, -0.311],
]
const INNER = [
  [0.0861, -0.0441], [0.168, -0.0147], [0.1996, 0.0063], [0.2563, 0.0231],
  [0.3298, 0.1113], [0.32, -0.151], [0.089, -0.311],
]
const MID = [
  [0.3298, 0.1113], [0.3676, 0.1996], [0.3824, 0.3151], CUT,
  [0.636, 0.002], [0.603, -0.046], [0.575, -0.115], [0.32, -0.151],
]
const TIP = [CUT, [1, 0.067], [0.895, 0.071], [0.809, 0.05], [0.636, 0.002]]

const right = [shift(INNER, GAP), shift(MID, GAP * 2), shift(TIP, GAP * 3)]

/** center, right inner → tip, left inner → tip */
export const EMBLEM_PIECES = [CENTER, ...right, ...right.map(mirror)]

export const EMBLEM_VIEWBOX = '-102 -34 204 67'

export const toPath = (pts, s = 100) =>
  'M' + pts.map(([x, y]) => `${(x * s).toFixed(1)} ${(-y * s).toFixed(1)}`).join('L') + 'Z'

export const centroid = (pts) => {
  let x = 0
  let y = 0
  for (const p of pts) {
    x += p[0]
    y += p[1]
  }
  return [x / pts.length, y / pts.length]
}
