/**
 * Central animation config. Import ease/dur everywhere instead of
 * scattering magic numbers across components.
 */
export const ease = {
  expo: [0.16, 1, 0.3, 1] as const,
  quad: [0.33, 1, 0.68, 1] as const,
}

export const dur = {
  fast: 0.18,
  base: 0.28,
  reveal: 0.72,
  hero: 1.0,
}
