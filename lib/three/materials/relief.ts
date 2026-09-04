import { DoubleSide, ShaderMaterial, Texture, Vector2, Vector3 } from "three";

/**
 * Matériau de relief 2,5D.
 *
 * Un plan subdivisé dont chaque sommet avance selon la carte de profondeur
 * de la photo. Vu de face, c'est la photo. Dès que la caméra tourne de
 * quelques degrés, la pièce a un volume, et l'ombrage calculé depuis la pente
 * de la profondeur renforce l'arête.
 *
 * `masque` garde une bande horizontale de l'image, en UV, pour découper la
 * pièce en deux moitiés sans dupliquer la texture.
 */

const vertex = /* glsl */ `
  uniform sampler2D profondeur;
  uniform float amplitude;
  varying vec2 vUv;
  varying float vProfondeur;

  void main() {
    vUv = uv;
    float p = texture2D(profondeur, uv).r;
    vProfondeur = p;
    vec3 deplace = position + normal * p * amplitude;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(deplace, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D carte;
  uniform sampler2D profondeur;
  uniform vec2 masque;
  uniform vec2 texel;
  uniform vec3 lumiere;
  uniform float ombrage;
  uniform float opacite;
  varying vec2 vUv;
  varying float vProfondeur;

  void main() {
    if (vUv.x < masque.x || vUv.x > masque.y) discard;

    vec4 c = texture2D(carte, vUv);
    if (c.a < 0.5) discard;

    // Normale approchée depuis la pente de la profondeur : quatre lectures,
    // assez pour creuser l'arête sans bruiter la surface.
    float g = texture2D(profondeur, vUv + vec2(-texel.x, 0.0)).r;
    float d = texture2D(profondeur, vUv + vec2( texel.x, 0.0)).r;
    float b = texture2D(profondeur, vUv + vec2(0.0, -texel.y)).r;
    float h = texture2D(profondeur, vUv + vec2(0.0,  texel.y)).r;
    vec3 n = normalize(vec3((g - d) * 4.0, (b - h) * 4.0, 1.0));

    float diffus = max(dot(n, normalize(lumiere)), 0.0);
    float eclat = mix(1.0, 0.72 + 0.42 * diffus, ombrage);

    gl_FragColor = vec4(c.rgb * eclat, c.a * opacite);
    #include <colorspace_fragment>
  }
`;

export type OptionsRelief = {
  carte: Texture;
  profondeur: Texture;
  amplitude?: number;
  masque?: [number, number];
  /** Force de l'ombrage tiré de la profondeur, 0 à 1. */
  ombrage?: number;
};

export function creerRelief({
  carte,
  profondeur,
  amplitude = 0.35,
  masque = [0, 1],
  ombrage = 0.6,
}: OptionsRelief) {
  const image = profondeur.image as { width?: number; height?: number } | undefined;
  const largeur = image?.width ?? 1024;
  const hauteur = image?.height ?? 1024;

  return new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      carte: { value: carte },
      profondeur: { value: profondeur },
      amplitude: { value: amplitude },
      masque: { value: new Vector2(masque[0], masque[1]) },
      texel: { value: new Vector2(1 / largeur, 1 / hauteur) },
      // La même clé que Lighting.tsx : haut-gauche, légèrement vers la caméra.
      lumiere: { value: new Vector3(-0.55, 0.75, 0.6) },
      ombrage: { value: ombrage },
      opacite: { value: 1 },
    },
    transparent: true,
    side: DoubleSide,
  });
}
