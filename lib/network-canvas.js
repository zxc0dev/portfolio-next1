// Bio-structure network canvas background
// Migrated from portfolio-example
/* eslint-disable */
// @ts-nocheck

export function initNetworkCanvas(canvas, heroSelector, basePath = '') {
  const ctx = canvas.getContext('2d');
  const heroTextBlock = document.querySelector(heroSelector || '#hero');

  const fxPalette = {
    spotlightPrimary: 'rgba(242, 242, 242, 0.12)',
    spotlightSecondary: 'rgba(242, 242, 242, 0.052)',
    auroraBlueStrong: 'rgba(242, 242, 242, 0.020)',
    auroraBlueSoft: 'rgba(242, 242, 242, 0.008)',
    auroraPurpleStrong: 'rgba(242, 242, 242, 0.018)',
    auroraPinkSoft: 'rgba(242, 242, 242, 0.006)',
    auroraBlueCenter: 'rgba(242, 242, 242, 0.011)',
    dataSweepStrong: 'rgba(242, 242, 242, 0.032)',
    dataSweepSoft: 'rgba(242, 242, 242, 0.010)',
    analyticContour: 'rgba(242, 242, 242, 0.016)',
    analyticTick: 'rgba(242, 242, 242, 0.028)',
    temporalLightStrong: 'rgba(242, 242, 242, 0.040)',
    lineBase: 'rgb(242, 242, 242)',
    lineMesh: 'rgb(242, 242, 242)',
    lineCursorRgb: '242, 242, 242',
    dotHaloRgb: '242, 242, 242',
    dotStarGlowRgb: '242, 242, 242',
    dotRgb: '242, 242, 242',
    dotStarRgb: '242, 242, 242',
    cursorCore: 'rgba(242, 242, 242, 0.72)',
    cursorMid: 'rgba(242, 242, 242, 0.075)',
    cursorRingPurpleRgb: '242, 242, 242',
    cursorRingBlueRgb: '242, 242, 242'
  };
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const smoothstep = (edge0, edge1, value) => {
    const denom = edge1 - edge0 || 1;
    const t = clamp((value - edge0) / denom, 0, 1);
    return t * t * (3 - 2 * t);
  };

  let w, h;
  const mouse = { x: -9999, y: -9999 };
  const CONNECT_DIST = 100;
  const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
  const MAX_CONNECTION_DIST_MULT = 1.24;
  const MAX_CONNECTION_DIST = CONNECT_DIST * MAX_CONNECTION_DIST_MULT;
  const MAX_CONNECTION_DIST_SQ = MAX_CONNECTION_DIST * MAX_CONNECTION_DIST;
  const MIN_BASE_CONNECTIONS = 2;
  const HERO_ZONE_THRESHOLD = 0.60;
  const HERO_MIN_CONNECTIONS = 2;
  const HERO_SEED_RADIUS_MULT = 0.88;
  const HERO_SEED_BUDGET_RATIO = 0.23;
  const HERO_REINFORCE_EDGE_CAP_RATIO = 0.06;
  const HERO_NEAR_TARGET_SCALE = 0.45;
  const HERO_BASE_CONNECTIONS = 1;
  const HERO_BRIDGE_CAP = 0;
  const HERO_PAIR_NEAR_DIST_MULT = 0.64;
  const HERO_NONLOCAL_DIST_MULT = 1.06;
  const HERO_CLUSTER_TARGET_MIN_SCORE = 0.52;
  const HERO_CLUSTER_TARGET_MAX_SCORE = 0.68;
  const HERO_CLUSTER_TARGET_MIN_DEGREE = 2;
  const NON_HERO_CONNECTION_REDUCTION = 0.30;
  const NON_HERO_UPPER_CLUSTER_EXTRA_REDUCTION = 0.92;
  const NON_HERO_UPPER_BOTH_EXTRA_REDUCTION = 0.52;
  const NON_HERO_FAR_EXTRA_REDUCTION = 0.22;
  const NON_HERO_BRIDGE_EXTRA_REDUCTION = 0.14;
  const INTER_CLUSTER_NEAR_SKIP_BASE = 0.66;
  const INTER_CLUSTER_BRIDGE_SKIP_BASE = 0.38;
  const LONG_BRIDGE_BUDGET_RATIO = 0.02;
  const CLUSTER_BRIDGE_BUDGET_MAX = 4;
  const UPPER_CLUSTER_TOP_Y_RATIO = 0.24;
  const UPPER_CLUSTER_BOTTOM_Y_RATIO = 0.58;
  const HERO_FADE_PORTION = 0.58;
  const HERO_FADE_NEAR_ALPHA_SCALE = 0.58;
  const HERO_FADE_BRIDGE_ALPHA_SCALE = 0.44;
  const HERO_FADE_FAR_ALPHA_SCALE = 0.31;
  const HERO_FADE_NEAR_CRISP_SCALE = 0.54;
  const HERO_FADE_BRIDGE_CRISP_SCALE = 0.40;
  const HERO_FADE_FAR_CRISP_SCALE = 0.24;
  const SCROLL_LINE_FADE_NEAR = 0.18;
  const SCROLL_LINE_FADE_FAR = 0.24;
  const SCROLL_LINE_FADE_BACKBONE_EXTRA = 0.06;
  const SCROLL_CRISP_FADE = 0.18;
  const SCROLL_DOT_FADE = 0.16;
  const LAYER_DEFS = [
    { density: 0.14, alphaScale: 0.62, radiusMin: 0.42, radiusMax: 0.96, driftAmpMin: 1.8, driftAmpMax: 3.4, driftSpeedMin: 0.00006, driftSpeedMax: 0.00012, parallax: 0.28 },
    { density: 0.19, alphaScale: 0.72, radiusMin: 0.48, radiusMax: 1.08, driftAmpMin: 2.2, driftAmpMax: 3.9, driftSpeedMin: 0.00007, driftSpeedMax: 0.00013, parallax: 0.44 },
    { density: 0.24, alphaScale: 0.86, radiusMin: 0.56, radiusMax: 1.22, driftAmpMin: 2.6, driftAmpMax: 4.5, driftSpeedMin: 0.00009, driftSpeedMax: 0.00015, parallax: 0.64 },
    { density: 0.24, alphaScale: 1.02, radiusMin: 0.68, radiusMax: 1.34, driftAmpMin: 3.0, driftAmpMax: 5.2, driftSpeedMin: 0.0001, driftSpeedMax: 0.00017, parallax: 0.84 },
    { density: 0.19, alphaScale: 1.16, radiusMin: 0.82, radiusMax: 1.54, driftAmpMin: 3.4, driftAmpMax: 5.8, driftSpeedMin: 0.00011, driftSpeedMax: 0.00019, parallax: 1.02 }
  ];
  const LAYER_CONNECTIVITY = [
    [0.58, 0.36, 0.15, 0.07, 0.03],
    [0.36, 0.62, 0.4, 0.16, 0.07],
    [0.15, 0.4, 0.68, 0.42, 0.16],
    [0.07, 0.16, 0.42, 0.66, 0.34],
    [0.03, 0.07, 0.16, 0.34, 0.6]
  ];
  const MOUSE_RADIUS = 190;
  const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
  const MAGNET_RADIUS = 85;
  const MAGNET_RADIUS_SQ = MAGNET_RADIUS * MAGNET_RADIUS;
  const MAGNET_PULL = 5;
  const SPRING_K = 0.075;
  const SPRING_DAMP = 0.70;
  const STRUCTURE_START = 0.48;
  const STRUCTURE_FULL = 0.86;
  const MAX_FRAME_DELTA = 50;
  const REDUCED_MOTION_FPS_DIVISOR = 2;
  const FPS_ACTIVE = 45;
  const FPS_IDLE = 20;
  const FPS_STRESSED = 18;
  const INTERACTION_ACTIVE_WINDOW_MS = 220;
  const CANVAS_START_IDLE_TIMEOUT_MS = 640;
  const QUALITY_MIN = 0.42;
  const QUALITY_MAX = 1;
  const PULSE_TTL_START = 3;
  const PULSE_CHILD_ENERGY_MULT = 0.56;
  const PULSE_BASE_MAX = 18;
  const PULSE_LOW_QUALITY_MAX = 8;
  const PULSE_DISABLE_QUALITY = 0.56;
  const PULSE_SPEED_SCALE = 0.65;
  const PULSE_AMBIENT_MIN_MS = 1800;
  const PULSE_AMBIENT_MAX_MS = 3300;
  const PULSE_SCROLL_THRESHOLD = 0.9;
  const PULSE_SCROLL_BURST_COOLDOWN_MS = 2600;
  const PULSE_SCROLL_BURST_COUNT = 1;
  const PULSE_SCROLL_BURST_ENERGY = 0.36;
  const PULSE_SCROLL_SPEED_BOOST = 0.24;
  const IDLE_IMPULSE_SCROLL_SUPPRESS_MS = 900;
  const PULSE_LINE_DECAY = 0.935;
  const PULSE_DOT_DECAY = 0.90;
  const DETAIL_QUALITY_MED = 0.72;
  const DETAIL_QUALITY_LOW = 0.56;
  const INTRO_NODE_PHASE_MS = 1800;
  const INTRO_LINE_PHASE_MS = 1500;
  const INTRO_SETTLE_MS = 600;
  const INTRO_LINE_REVEAL_PULSE_GATE = 0.34;
  const INTRO_LINE_ACCEL_START = 0.16;
  const INTRO_LINE_ACCEL_EXPONENT = 0.62;
  const IDLE_IMPULSE_MIN_MS = 2200;
  const IDLE_IMPULSE_MAX_MS = 3800;
  const IDLE_IMPULSE_SCROLL_CUTOFF = 0.14;
  const IDLE_IMPULSE_NODE_COOLDOWN_MS = 2200;
  const IDLE_IMPULSE_MIN_LINE_ENERGY = 0.062;
  const IDLE_IMPULSE_ALPHA_BOOST = 1.1;
  const HUB_WAVE_MIN_MS = 4600;
  const HUB_WAVE_MAX_MS = 8200;
  const HUB_WAVE_COOLDOWN_MS = 4200;
  const NETWORK_INTRO_EVENT = 'network-intro:start';

  let dots = [];
  let staticLines = [];
  let nodeAdjacency = [];
  let lineAdjacency = [];
  let nodeDegrees = [];
  let nodeCentralityScores = [];
  let noiseSpecks = [];
  let pulsePackets = [];
  let curvedBridgeArcs = [];
  let hubNodeIndices = [];
  let relayNodeIndices = [];
  let auroraCanvas = null;
  let mouseActive = false;
  let lastMouseMove = 0;
  let frameCount = 0;
  let scrollY = window.scrollY || 0;
  let scrollEnergy = 0;
  let qualityLevel = 1;
  let frameDeltaSmoothed = 16.7;
  let lastFrameTime = performance.now();
  let lastRenderedFrameAt = 0;
  let farConnectDist = MAX_CONNECTION_DIST;
  let farConnectDistSq = MAX_CONNECTION_DIST_SQ;
  let zoneUpdateRaf = 0;
  let animationRaf = 0;
  let animationStarted = false;
  let resizeTimer;
  let canvasActive = true;
  let prefersReducedMotion = false;
  let nextAmbientPulseAt = 0;
  let idleImpulseNextAt = 0;
  let nextHubWaveAt = 0;
  let lastScrollBurstAt = -Infinity;
  let introRequested = false;
  let introState = 'idle';
  let introStartAt = 0;
  let introSettleStartAt = 0;
  let introSettleEndAt = 0;
  let introRunDuration = INTRO_NODE_PHASE_MS + INTRO_LINE_PHASE_MS;
  let introAutoStartAt = performance.now() + 2200;
  let renderBudgets = {
    complexity: 0,
    secondaryStrideBoost: 0,
    crispStrideBoost: 0,
    dotStrideBoost: 0,
    arcQualityPenalty: 0,
    heavyCullLevel: 0
  };
  const impulseSourceCooldownUntil = new Map();
  const introShouldRun = (() => {
    try {
      return sessionStorage.getItem('networkIntroDone') !== '1';
    } catch {
      return true;
    }
  })();
  const reducedMotionMedia = typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  const lowSpecDevice = (
    (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) ||
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory > 0 && navigator.deviceMemory <= 4)
  );
  if (lowSpecDevice) {
    qualityLevel = 0.84;
  }

  const clarityZone = {
    x: 0,
    y: 0,
    radius: 280,
    targetX: 0,
    targetY: 0,
    targetRadius: 280
  };

  function computeZoneWeightAt(x, y) {
    const dx = x - clarityZone.x;
    const dy = y - clarityZone.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const normalized = dist / Math.max(clarityZone.radius, 1);
    if (normalized >= 1.28) return 0;
    return 1 - smoothstep(0.18, 1.08, normalized);
  }

  function clarityMaskAt(x, y, inner = 0.30, outer = 1.08) {
    const dx = x - clarityZone.x;
    const dy = y - clarityZone.y;
    const normalized = Math.sqrt(dx * dx + dy * dy) / Math.max(clarityZone.radius, 1);
    return smoothstep(inner, outer, normalized);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function easeOutCubic(t) {
    const p = clamp(t, 0, 1);
    return 1 - Math.pow(1 - p, 3);
  }

  function easeInOutCubic(t) {
    const p = clamp(t, 0, 1);
    return p < 0.5
      ? 4 * p * p * p
      : 1 - Math.pow(-2 * p + 2, 3) / 2;
  }

  function quadraticBezier(a, b, c, t) {
    const mt = 1 - t;
    return mt * mt * a + 2 * mt * t * b + t * t * c;
  }

  function seedFromViewport(width, height, salt = 0) {
    const wSeed = Math.max(1, Math.floor(width));
    const hSeed = Math.max(1, Math.floor(height));
    return (
      (Math.imul(wSeed, 73856093) ^
        Math.imul(hSeed, 19349663) ^
        Math.imul((salt + 1) | 0, 83492791)) >>>
      0
    );
  }

  function hash01(seed, a = 0, b = 0, c = 0) {
    let x =
      (seed ^
        Math.imul((a + 1) | 0, 1597334677) ^
        Math.imul((b + 1) | 0, -483350495) ^
        Math.imul((c + 1) | 0, 958282311)) >>>
      0;
    x ^= x >>> 16;
    x = Math.imul(x, 2246822519);
    x ^= x >>> 13;
    x = Math.imul(x, 3266489917);
    x ^= x >>> 16;
    return (x >>> 0) / 4294967295;
  }

  function hashSigned(seed, a = 0, b = 0, c = 0) {
    return hash01(seed, a, b, c) * 2 - 1;
  }

  function saveIntroDoneFlag() {
    try {
      sessionStorage.setItem('networkIntroDone', '1');
    } catch {
      // Ignore storage failures in private contexts.
    }
  }

  function pointForDot(dot) {
    return {
      x: Number.isFinite(dot.renderX) ? dot.renderX : dot.x + dot.offsetX,
      y: Number.isFinite(dot.renderY) ? dot.renderY : dot.y + dot.offsetY
    };
  }

  function lineEndpoints(line) {
    const a = pointForDot(line.a);
    const b = pointForDot(line.b);
    return { ax: a.x, ay: a.y, bx: b.x, by: b.y };
  }

  function isIntroActive() {
    return introState === 'running' || introState === 'settling';
  }

  function getLineRevealProgress(line, now) {
    if (!line || !line.intro) return 1;
    if (!isIntroActive()) return introState === 'complete' ? 1 : 0;
    const elapsed = Math.max(0, now - introStartAt);
    const raw = clamp((elapsed - line.intro.delay) / Math.max(1, line.intro.duration), 0, 1);
    if (raw <= 0 || raw >= 1) return raw;
    const early = raw < INTRO_LINE_ACCEL_START;
    const earlyScale = 0.92;
    if (early) return raw * earlyScale;
    const normalized = (raw - INTRO_LINE_ACCEL_START) / Math.max(0.0001, (1 - INTRO_LINE_ACCEL_START));
    const acceleratedNormalized = Math.pow(clamp(normalized, 0, 1), INTRO_LINE_ACCEL_EXPONENT);
    return clamp(
      INTRO_LINE_ACCEL_START * earlyScale +
      acceleratedNormalized * (1 - INTRO_LINE_ACCEL_START * earlyScale),
      0,
      1
    );
  }

  function getLineRenderSegment(line, now) {
    const { ax, ay, bx, by } = lineEndpoints(line);
    if (introState === 'complete') {
      return { sx: ax, sy: ay, ex: bx, ey: by, progress: 1 };
    }
    if (introState === 'idle' || introState === 'armed') return null;
    if (!isIntroActive()) return { sx: ax, sy: ay, ex: bx, ey: by, progress: 1 };

    const progress = getLineRevealProgress(line, now);
    if (progress <= 0.001) return null;
    if (progress >= 0.999 || !line.intro) {
      return { sx: ax, sy: ay, ex: bx, ey: by, progress: 1 };
    }

    const origin = line.intro.origin;
    const startT = origin * (1 - progress);
    const endT = origin + (1 - origin) * progress;
    return {
      sx: lerp(ax, bx, startT),
      sy: lerp(ay, by, startT),
      ex: lerp(ax, bx, endT),
      ey: lerp(ay, by, endT),
      progress
    };
  }

  function canRunIntro() {
    return introShouldRun && !prefersReducedMotion && canvasActive;
  }

  function completeIntro() {
    introState = 'complete';
    introRequested = false;
    saveIntroDoneFlag();
  }

  function pickOffscreenSpawn(dot) {
    const margin = clamp(Math.min(w, h) * 0.24, 120, 260);
    const side = (Math.random() * 4) | 0;
    if (side === 0) return { x: -margin, y: dot.y + (Math.random() - 0.5) * h * 0.24 };
    if (side === 1) return { x: w + margin, y: dot.y + (Math.random() - 0.5) * h * 0.24 };
    if (side === 2) return { x: dot.x + (Math.random() - 0.5) * w * 0.24, y: -margin };
    return { x: dot.x + (Math.random() - 0.5) * w * 0.24, y: h + margin };
  }

  function buildIntroMetadata() {
    if (!dots.length || !staticLines.length) return;

    const nodeDepth = new Array(dots.length).fill(Infinity);
    const lineDepth = new Array(staticLines.length).fill(Infinity);
    const connected = [];
    for (let i = 0; i < nodeAdjacency.length; i++) {
      const edges = nodeAdjacency[i];
      if (edges && edges.length > 0) connected.push(i);
    }

    if (connected.length > 0) {
      const shuffled = connected.slice().sort(() => Math.random() - 0.5);
      const seedCount = Math.min(5, Math.max(2, Math.floor(connected.length * 0.06)));
      const queue = [];
      for (let i = 0; i < seedCount; i++) {
        const idx = shuffled[i];
        nodeDepth[idx] = 0;
        queue.push(idx);
      }
      let q = 0;
      while (q < queue.length) {
        const idx = queue[q++];
        const depth = nodeDepth[idx];
        const edges = nodeAdjacency[idx] || [];
        for (let i = 0; i < edges.length; i++) {
          const edge = edges[i];
          lineDepth[edge.lineIdx] = Math.min(lineDepth[edge.lineIdx], depth + 1 + Math.random() * 0.25);
          if (!Number.isFinite(nodeDepth[edge.nodeIdx])) {
            nodeDepth[edge.nodeIdx] = depth + 1;
            queue.push(edge.nodeIdx);
          }
        }
      }
    }

    const fallbackNodeDepth = Math.max(1, Math.ceil(Math.sqrt(dots.length) * 0.65));
    let maxNodeDepth = 1;
    for (let i = 0; i < nodeDepth.length; i++) {
      if (!Number.isFinite(nodeDepth[i])) nodeDepth[i] = fallbackNodeDepth + Math.random() * 2.2;
      maxNodeDepth = Math.max(maxNodeDepth, nodeDepth[i]);
    }

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const graphDepthNorm = nodeDepth[i] / maxNodeDepth;
      const depthNorm = Number.isFinite(dot.depthNorm) ? dot.depthNorm : 0.5;
      const roleDelay = dot.role === 'hub' ? 160 : dot.role === 'relay' ? 84 : 0;
      const spawn = pickOffscreenSpawn(dot);
      const dx = dot.x - spawn.x;
      const dy = dot.y - spawn.y;
      const len = Math.max(1, Math.hypot(dx, dy));
      const nx = -dy / len;
      const ny = dx / len;
      const curveSide = Math.random() < 0.5 ? -1 : 1;
      const curveAmp = (46 + Math.random() * 104) * (0.66 + depthNorm * 0.72);
      const midX = (spawn.x + dot.x) * 0.5;
      const midY = (spawn.y + dot.y) * 0.5;

      dot.intro = {
        spawnX: spawn.x,
        spawnY: spawn.y,
        ctrlX: midX + nx * curveAmp * curveSide,
        ctrlY: midY + ny * curveAmp * curveSide,
        delay: depthNorm * (INTRO_NODE_PHASE_MS * 0.58) + graphDepthNorm * 180 + roleDelay + Math.random() * 180,
        duration: 860 + (1 - depthNorm) * 240 + Math.random() * 360 + (dot.role === 'hub' ? 80 : 0)
      };
    }

    const fallbackLineDepth = fallbackNodeDepth + 1;
    let maxLineDepth = 1;
    for (let i = 0; i < lineDepth.length; i++) {
      if (!Number.isFinite(lineDepth[i])) lineDepth[i] = fallbackLineDepth + Math.random() * 1.6;
      maxLineDepth = Math.max(maxLineDepth, lineDepth[i]);
    }

    introRunDuration = INTRO_NODE_PHASE_MS + INTRO_LINE_PHASE_MS;
    for (let i = 0; i < staticLines.length; i++) {
      const line = staticLines[i];
      const graphDepthNorm = lineDepth[i] / maxLineDepth;
      const depthNorm = Number.isFinite(line.depthWeight) ? line.depthWeight : 0.5;
      const kindDelay = line.kind === 'near' ? 0 : line.kind === 'bridge' ? 72 : 140;
      const linkDelay = line.linkType === 'backbone' ? 110 : line.linkType === 'bridge' ? 56 : 0;
      const baseDuration = line.kind === 'near' ? 500 : line.kind === 'bridge' ? 640 : 820;
      line.intro = {
        delay: INTRO_NODE_PHASE_MS + depthNorm * (INTRO_LINE_PHASE_MS * 0.44) + graphDepthNorm * 120 + kindDelay + linkDelay + Math.random() * 130,
        duration: baseDuration + (1 - depthNorm) * 120 + Math.random() * 200,
        origin: 0.15 + Math.random() * 0.7
      };
      introRunDuration = Math.max(introRunDuration, line.intro.delay + line.intro.duration);
    }
  }

  function startIntro(now) {
    if (!canRunIntro()) {
      completeIntro();
      return;
    }
    scrollEnergy = 0;
    resetPulseTransport(now);
    buildIntroMetadata();
    introStartAt = now;
    introSettleStartAt = 0;
    introSettleEndAt = 0;
    introState = 'running';
    introRequested = false;
  }

  function updateIntroLifecycle(now) {
    if (introState === 'complete') return;

    if (!introShouldRun) {
      completeIntro();
      return;
    }
    if (!canRunIntro()) {
      completeIntro();
      return;
    }
    if (introState === 'idle') introState = 'armed';
    if (introState === 'armed' && !introRequested && now >= introAutoStartAt) {
      introRequested = true;
    }
    if (introState === 'armed' && introRequested) {
      startIntro(now);
    }
    if (introState === 'running') {
      const elapsed = now - introStartAt;
      if (elapsed >= introRunDuration || qualityLevel <= QUALITY_MIN + 0.012) {
        introState = 'settling';
        introSettleStartAt = now;
        introSettleEndAt = now + INTRO_SETTLE_MS;
      }
    }
    if (introState === 'settling' && now >= introSettleEndAt) {
      completeIntro();
    }
  }

  function updateDotRenderPositions(now) {
    const settling = introState === 'settling';
    const introRunning = introState === 'running';
    const settleMix = settling
      ? easeInOutCubic(clamp((now - introSettleStartAt) / Math.max(1, INTRO_SETTLE_MS), 0, 1))
      : 0;

    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const targetX = dot.x + dot.offsetX;
      const targetY = dot.y + dot.offsetY;
      if (!introRunning && !settling) {
        dot.renderX = targetX;
        dot.renderY = targetY;
        dot.introProgress = 1;
        continue;
      }

      const meta = dot.intro;
      if (!meta) {
        dot.renderX = targetX;
        dot.renderY = targetY;
        dot.introProgress = 1;
        continue;
      }

      const raw = clamp((now - introStartAt - meta.delay) / Math.max(1, meta.duration), 0, 1);
      const eased = easeOutCubic(raw);
      const sx = meta.spawnX + dot.offsetX * 0.22;
      const sy = meta.spawnY + dot.offsetY * 0.22;
      const cx = meta.ctrlX + dot.offsetX * 0.35;
      const cy = meta.ctrlY + dot.offsetY * 0.35;
      const introX = quadraticBezier(sx, cx, targetX, eased);
      const introY = quadraticBezier(sy, cy, targetY, eased);

      dot.renderX = settling ? lerp(introX, targetX, settleMix) : introX;
      dot.renderY = settling ? lerp(introY, targetY, settleMix) : introY;
      dot.introProgress = raw;
    }
  }

  function drawIntroNodeTrails(quality = 1) {
    if (introState !== 'running' || quality < 0.52) return;
    const stride = quality < DETAIL_QUALITY_LOW ? 3 : quality < DETAIL_QUALITY_MED ? 2 : 1;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < dots.length; i += stride) {
      const dot = dots[i];
      const meta = dot.intro;
      const progress = dot.introProgress;
      if (!meta || progress <= 0.02 || progress >= 0.98) continue;

      const targetX = dot.x + dot.offsetX;
      const targetY = dot.y + dot.offsetY;
      const sx = meta.spawnX + dot.offsetX * 0.22;
      const sy = meta.spawnY + dot.offsetY * 0.22;
      const cx = meta.ctrlX + dot.offsetX * 0.35;
      const cy = meta.ctrlY + dot.offsetY * 0.35;
      const p = easeOutCubic(progress);
      const vx = 2 * (1 - p) * (cx - sx) + 2 * p * (targetX - cx);
      const vy = 2 * (1 - p) * (cy - sy) + 2 * p * (targetY - cy);
      const speed = Math.hypot(vx, vy);
      if (speed < 0.001) continue;

      const ux = vx / speed;
      const uy = vy / speed;
      const rx = dot.renderX;
      const ry = dot.renderY;
      const tailLen = (1 - progress) * (18 + dot.r * 16);
      const tx = rx - ux * tailLen;
      const ty = ry - uy * tailLen;
      const grad = ctx.createLinearGradient(tx, ty, rx, ry);
      const alpha = (0.02 + (1 - progress) * 0.09) * (0.72 + quality * 0.28);
      grad.addColorStop(0, 'rgba(242, 242, 242, 0)');
      grad.addColorStop(1, `rgba(242, 242, 242, ${alpha.toFixed(4)})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.42 + dot.r * 0.72;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(rx, ry);
      ctx.stroke();
    }
    ctx.restore();
  }

  function updateReducedMotionPreference(nextValue) {
    prefersReducedMotion = !!nextValue;
    qualityLevel = prefersReducedMotion ? 0.62 : (lowSpecDevice ? 0.84 : 1);
    frameDeltaSmoothed = 16.7;
    scheduleAmbientPulse(performance.now(), prefersReducedMotion);
    scheduleIdleImpulse(performance.now(), prefersReducedMotion, prefersReducedMotion);
    scheduleHubWave(performance.now(), prefersReducedMotion, prefersReducedMotion);
  }

  function updateClarityZoneTarget() {
    const fallbackX = w * 0.34;
    const fallbackY = h * 0.36;
    const fallbackRadius = clamp(Math.min(w, h) * 0.34, 220, 430);
    if (!heroTextBlock) {
      clarityZone.targetX = fallbackX;
      clarityZone.targetY = fallbackY;
      clarityZone.targetRadius = fallbackRadius;
      return;
    }

    const rect = heroTextBlock.getBoundingClientRect();
    const safeWidth = Math.max(rect.width, 220);
    const safeHeight = Math.max(rect.height, 70);
    const anchorX = rect.left + safeWidth * 0.32;
    const anchorY = rect.top + safeHeight * 0.62;
    clarityZone.targetX = clamp(anchorX, 80, Math.max(80, w - 80));
    clarityZone.targetY = clamp(anchorY, 70, Math.max(70, h - 70));
    clarityZone.targetRadius = clamp(
      Math.max(safeWidth * 1.16, safeHeight * 2.34),
      220,
      Math.min(470, w * 0.50)
    );
  }

  function syncClarityZone(alpha = 1) {
    clarityZone.x += (clarityZone.targetX - clarityZone.x) * alpha;
    clarityZone.y += (clarityZone.targetY - clarityZone.y) * alpha;
    clarityZone.radius += (clarityZone.targetRadius - clarityZone.radius) * alpha;
  }

  function refreshRenderBudgets() {
    const dotLoad = clamp((dots.length - 170) / 210, 0, 1);
    const lineLoad = clamp((staticLines.length - 760) / 1250, 0, 1);
    const complexity = clamp(dotLoad * 0.42 + lineLoad * 0.78, 0, 1);
    renderBudgets = {
      complexity,
      secondaryStrideBoost: complexity > 0.84 ? 2 : complexity > 0.62 ? 1 : 0,
      crispStrideBoost: complexity > 0.72 ? 1 : 0,
      dotStrideBoost: complexity > 0.84 ? 1 : 0,
      arcQualityPenalty: complexity > 0.82 ? 0.2 : complexity > 0.64 ? 0.1 : 0,
      heavyCullLevel: complexity > 0.86 ? 2 : complexity > 0.62 ? 1 : 0
    };
  }

  function scheduleZoneTargetUpdate() {
    if (zoneUpdateRaf) return;
    zoneUpdateRaf = requestAnimationFrame(() => {
      zoneUpdateRaf = 0;
      updateClarityZoneTarget();
    });
  }

  function _onScroll() {
    const nextScrollY = window.scrollY || 0;
    const delta = nextScrollY - scrollY;
    const deltaAbs = Math.abs(delta);
    scrollY = nextScrollY;
    if (deltaAbs > 0) {
      scrollEnergy = clamp(scrollEnergy + deltaAbs * 0.0017, 0, 1.0);
    }
    scheduleZoneTargetUpdate();
  }
  window.addEventListener('scroll', _onScroll, { passive: true });

  updateReducedMotionPreference(reducedMotionMedia ? reducedMotionMedia.matches : false);
  if (reducedMotionMedia) {
    const reducedMotionHandler = (event) => {
      updateReducedMotionPreference(event.matches);
    };
    if (typeof reducedMotionMedia.addEventListener === 'function') {
      reducedMotionMedia.addEventListener('change', reducedMotionHandler);
    } else if (typeof reducedMotionMedia.addListener === 'function') {
      reducedMotionMedia.addListener(reducedMotionHandler);
    }
  }

  function randomAmbientIntervalMs(calmMode) {
    if (calmMode) return 1200 + Math.random() * 2200;
    return PULSE_AMBIENT_MIN_MS + Math.random() * (PULSE_AMBIENT_MAX_MS - PULSE_AMBIENT_MIN_MS);
  }

  function randomIdleIntervalMs(calmMode, lowDetailMode = false) {
    if (calmMode) return 1800 + Math.random() * 3000;
    if (lowDetailMode) return 1700 + Math.random() * 2600;
    return IDLE_IMPULSE_MIN_MS + Math.random() * (IDLE_IMPULSE_MAX_MS - IDLE_IMPULSE_MIN_MS);
  }

  function randomHubWaveIntervalMs(calmMode, lowDetailMode = false) {
    if (calmMode) return HUB_WAVE_MIN_MS + 1200 + Math.random() * 2200;
    if (lowDetailMode) return HUB_WAVE_MIN_MS + 800 + Math.random() * 1800;
    return HUB_WAVE_MIN_MS + Math.random() * (HUB_WAVE_MAX_MS - HUB_WAVE_MIN_MS);
  }

  function getPulsePacketLimit() {
    return qualityLevel < 0.6 ? PULSE_LOW_QUALITY_MAX : PULSE_BASE_MAX;
  }

  function pulseKindWeight(kind) {
    if (kind === 'near') return 1;
    if (kind === 'bridge') return 0.66;
    return 0.4;
  }

  function pulseLinkWeight(linkType) {
    if (linkType === 'backbone') return 1.32;
    if (linkType === 'bridge') return 1.1;
    return 1;
  }

  function pulseSpeedForLine(line, calmMode) {
    const base =
      line.kind === 'near'
        ? 0.014 + Math.random() * 0.010
        : line.kind === 'bridge'
          ? 0.011 + Math.random() * 0.008
          : 0.0085 + Math.random() * 0.0065;
    const depthBoost = 0.82 + (line.depthWeight || 0.5) * 0.36;
    const linkBoost =
      line.linkType === 'backbone'
        ? 1.15
        : line.linkType === 'bridge'
          ? 1.06
          : 1;
    const calmScale = calmMode ? 0.68 : 1;
    const qualityScale = qualityLevel < 0.62 ? 1.05 : 1;
    return base * calmScale * qualityScale * PULSE_SPEED_SCALE * depthBoost * linkBoost;
  }

  function pickRandomConnectedSourceNode() {
    if (dots.length === 0) return -1;
    if (nodeCentralityScores.length === dots.length && Math.random() < 0.55) {
      let total = 0;
      const weighted = [];
      for (let i = 0; i < nodeAdjacency.length; i++) {
        const edges = nodeAdjacency[i];
        const dot = dots[i];
        if (!edges || edges.length === 0 || !dot) continue;
        let weight = 0.16 + (nodeCentralityScores[i] || 0) * 1.36;
        weight += (dot.zoneWeight || 0) * 0.2;
        if (dot.role === 'hub') weight *= 1.08;
        else if (dot.role === 'relay') weight *= 1.04;
        total += weight;
        weighted.push({ idx: i, total });
      }
      if (total > 0) {
        const roll = Math.random() * total;
        for (let i = 0; i < weighted.length; i++) {
          if (roll <= weighted[i].total) return weighted[i].idx;
        }
        return weighted[weighted.length - 1].idx;
      }
    }
    if (Math.random() < 0.22) {
      const heroConnected = [];
      for (let i = 0; i < nodeAdjacency.length; i++) {
        const edges = nodeAdjacency[i];
        const dot = dots[i];
        if (!edges || edges.length === 0 || !dot) continue;
        if (dot.zoneWeight >= HERO_ZONE_THRESHOLD) {
          heroConnected.push(i);
        }
      }
      if (heroConnected.length > 0) {
        return heroConnected[(Math.random() * heroConnected.length) | 0];
      }
    }
    const strategicPool = hubNodeIndices.length > 0 || relayNodeIndices.length > 0
      ? hubNodeIndices.concat(relayNodeIndices)
      : [];
    if (strategicPool.length > 0 && Math.random() < 0.28) {
      const strategicPick = strategicPool[(Math.random() * strategicPool.length) | 0];
      const strategicEdges = nodeAdjacency[strategicPick];
      if (strategicEdges && strategicEdges.length > 0) return strategicPick;
    }
    const attempts = Math.min(40, Math.max(12, dots.length));
    for (let i = 0; i < attempts; i++) {
      const idx = Math.floor(Math.random() * dots.length);
      const edges = nodeAdjacency[idx];
      if (edges && edges.length > 0) return idx;
    }

    const connectedNodes = [];
    for (let i = 0; i < nodeAdjacency.length; i++) {
      const edges = nodeAdjacency[i];
      if (edges && edges.length > 0) connectedNodes.push(i);
    }
    if (connectedNodes.length === 0) return -1;
    return connectedNodes[Math.floor(Math.random() * connectedNodes.length)];
  }

  function pickRandomCooledSourceNode(now) {
    const cooldown = impulseSourceCooldownUntil;
    for (let i = 0; i < 24; i++) {
      const idx = pickRandomConnectedSourceNode();
      if (idx === -1) return -1;
      if ((cooldown.get(idx) || 0) <= now) return idx;
    }
    for (let i = 0; i < nodeAdjacency.length; i++) {
      const edges = nodeAdjacency[i];
      if (!edges || edges.length === 0) continue;
      if ((cooldown.get(i) || 0) <= now) return i;
    }
    return -1;
  }

  function pickWeightedEdge(edges, excludeLineIdx = -1) {
    if (!edges || edges.length === 0) return null;
    let total = 0;
    const weighted = [];
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      if (!edge) continue;
      if (edge.lineIdx === excludeLineIdx) continue;
      let weight = pulseKindWeight(edge.kind) * pulseLinkWeight(edge.linkType);
      const targetNode = dots[edge.nodeIdx];
      if (targetNode) {
        if (targetNode.role === 'hub') weight *= 1.16;
        else if (targetNode.role === 'relay') weight *= 1.08;
        weight *= 1 + targetNode.zoneWeight * 0.12;
        const targetDegree = nodeDegrees[edge.nodeIdx] || 0;
        const targetDeficitNorm = clamp(
          (HERO_MIN_CONNECTIONS - targetDegree) / Math.max(1, HERO_MIN_CONNECTIONS),
          0,
          1
        );
        weight *= 1 + targetDeficitNorm * 0.08;
      }
      const line = staticLines[edge.lineIdx];
      if (line) {
        const underusedLineBonus = clamp(0.7 - line.energy, 0, 0.7) * 0.10;
        weight *= 1 + underusedLineBonus;
        weight *= 1 + clamp(line.lineImportance || 0, 0, 1) * 0.22;
      }
      const neighbors = lineAdjacency[edge.lineIdx];
      if (neighbors && neighbors.length > 0) {
        weight *= 1 + Math.min(0.46, neighbors.length * 0.018);
      }
      total += weight;
      weighted.push({ edge, total });
    }

    if (total <= 0 || weighted.length === 0) {
      if (excludeLineIdx !== -1) return pickWeightedEdge(edges, -1);
      return null;
    }

    const roll = Math.random() * total;
    for (let i = 0; i < weighted.length; i++) {
      if (roll <= weighted[i].total) return weighted[i].edge;
    }
    return weighted[weighted.length - 1].edge;
  }

  function pushPulsePacket(lineIdx, fromNodeIdx, toNodeIdx, ttl, energy, width, calmMode) {
    if (qualityLevel < PULSE_DISABLE_QUALITY) return false;
    if (pulsePackets.length >= getPulsePacketLimit()) return false;
    if (isIntroActive()) {
      const lineForGate = staticLines[lineIdx];
      if (!lineForGate) return false;
      const revealProgress = getLineRevealProgress(lineForGate, performance.now());
      if (revealProgress < INTRO_LINE_REVEAL_PULSE_GATE) return false;
    }

    const line = staticLines[lineIdx];
    if (!line) return false;
    const energyGain = line.energyGain || 1;
    const packetEnergy = clamp(energy * energyGain, 0.02, 1.45);

    pulsePackets.push({
      lineIdx,
      fromNodeIdx,
      toNodeIdx,
      progress: 0,
      speed: pulseSpeedForLine(line, calmMode),
      ttl,
      energy: packetEnergy,
      width,
      linkType: line.linkType,
      depthWeight: line.depthWeight || 0.5
    });

    line.energy = clamp(line.energy + packetEnergy * 0.5, 0, 2.8);
    const fromDot = dots[fromNodeIdx];
    if (fromDot) {
      fromDot.energy = clamp(fromDot.energy + packetEnergy * 0.24, 0, 2.4);
    }
    return true;
  }

  function spawnPulseBurstFromNode(sourceNodeIdx, count, ttl, energy, calmMode) {
    if (sourceNodeIdx < 0) return 0;
    const edges = nodeAdjacency[sourceNodeIdx];
    if (!edges || edges.length === 0) return 0;
    let spawned = 0;
    const used = new Set();
    for (let i = 0; i < count; i++) {
      let edge = pickWeightedEdge(edges);
      if (!edge) break;
      if (used.has(edge.lineIdx) && used.size < edges.length) {
        let guard = 0;
        while (edge && used.has(edge.lineIdx) && guard++ < 8) {
          edge = pickWeightedEdge(edges);
        }
      }
      if (!edge) continue;
      used.add(edge.lineIdx);
      if (pushPulsePacket(edge.lineIdx, sourceNodeIdx, edge.nodeIdx, ttl, energy, 0.7 + Math.random() * 0.7, calmMode)) {
        spawned++;
      }
      if (pulsePackets.length >= getPulsePacketLimit()) break;
    }
    return spawned;
  }

  function scheduleAmbientPulse(now, calmMode) {
    nextAmbientPulseAt = now + randomAmbientIntervalMs(calmMode);
  }

  function scheduleIdleImpulse(now, calmMode, lowDetailMode = false) {
    idleImpulseNextAt = now + randomIdleIntervalMs(calmMode, lowDetailMode);
  }

  function scheduleHubWave(now, calmMode, lowDetailMode = false) {
    nextHubWaveAt = now + randomHubWaveIntervalMs(calmMode, lowDetailMode);
  }

  function spawnHubPulseWave(sourceNodeIdx, calmMode, lowDetailMode = false) {
    if (sourceNodeIdx < 0) return 0;
    const edges = nodeAdjacency[sourceNodeIdx];
    if (!edges || edges.length === 0) return 0;

    const ranked = edges
      .slice()
      .map((edge) => {
        const line = staticLines[edge.lineIdx];
        const targetDot = dots[edge.nodeIdx];
        let score = pulseKindWeight(edge.kind) * 0.72 + pulseLinkWeight(edge.linkType) * 0.98;
        if (targetDot) {
          if (targetDot.role === 'hub') score += 0.48;
          else if (targetDot.role === 'relay') score += 0.32;
          score += (targetDot.depthNorm || 0.5) * 0.22;
        }
        if (line) {
          score += (line.layerGap || 0) * 0.18;
          score += (line.depthWeight || 0.5) * 0.16;
        }
        score += Math.random() * 0.14;
        return { edge, score };
      })
      .sort((a, b) => b.score - a.score);

    if (ranked.length === 0) return 0;
    const fanCount = calmMode ? 1 : lowDetailMode ? 1 : 2;
    const ttl = calmMode ? PULSE_TTL_START : PULSE_TTL_START + 1;
    const baseEnergy = calmMode ? 0.3 : lowDetailMode ? 0.42 : 0.56;
    let spawned = 0;
    const relayTargets = [];

    for (let i = 0; i < fanCount && i < ranked.length; i++) {
      const edge = ranked[i].edge;
      const line = staticLines[edge.lineIdx];
      if (!line) continue;
      const energyBoost = line.linkType === 'backbone' ? 1.24 : line.linkType === 'bridge' ? 1.08 : 1;
      const width = 0.92 + Math.random() * 0.9 + (line.linkType === 'backbone' ? 0.16 : 0);
      if (pushPulsePacket(edge.lineIdx, sourceNodeIdx, edge.nodeIdx, ttl, baseEnergy * energyBoost, width, calmMode)) {
        spawned++;
        const targetDot = dots[edge.nodeIdx];
        if (targetDot && targetDot.role === 'relay') {
          relayTargets.push(edge.nodeIdx);
        }
      }
    }

    if (!calmMode && !lowDetailMode && relayTargets.length > 0 && Math.random() < 0.20) {
      const relayFan = 1;
      for (let i = 0; i < relayFan; i++) {
        const relayIdx = relayTargets[i];
        spawned += spawnPulseBurstFromNode(relayIdx, 1, 2, baseEnergy * 0.5, calmMode);
      }
    }
    return spawned;
  }

  function tryAmbientPulse(now, calmMode) {
    if (now < nextAmbientPulseAt) return;
    const sourceIdx = pickRandomConnectedSourceNode();
    if (sourceIdx !== -1) {
      spawnPulseBurstFromNode(sourceIdx, 1, PULSE_TTL_START, calmMode ? 0.26 : 0.42, calmMode);
    }
    scheduleAmbientPulse(now, calmMode);
  }

  function tryIdleImpulse(now, calmMode, lowDetailMode = false) {
    if (now < idleImpulseNextAt) return;
    if (isIntroActive()) {
      scheduleIdleImpulse(now, calmMode, lowDetailMode);
      return;
    }

    const scrollHeavy = scrollEnergy > PULSE_SCROLL_THRESHOLD;
    if (scrollHeavy && now - lastScrollBurstAt < IDLE_IMPULSE_SCROLL_SUPPRESS_MS) {
      scheduleIdleImpulse(now, calmMode, lowDetailMode);
      return;
    }

    const sourceIdx = pickRandomCooledSourceNode(now);
    if (sourceIdx !== -1) {
      const count = 1;
      const energy = calmMode ? 0.28 : lowDetailMode ? 0.38 : 0.5;
      const spawned = spawnPulseBurstFromNode(sourceIdx, count, PULSE_TTL_START, energy, calmMode);
      if (spawned > 0) {
        impulseSourceCooldownUntil.set(
          sourceIdx,
          now + IDLE_IMPULSE_NODE_COOLDOWN_MS + Math.random() * 700
        );
      }
    }
    scheduleIdleImpulse(now, calmMode, lowDetailMode);
  }

  function tryHubPulseWave(now, calmMode, lowDetailMode = false) {
    if (now < nextHubWaveAt) return;
    if (isIntroActive() || qualityLevel < 0.62) {
      scheduleHubWave(now, calmMode, lowDetailMode);
      return;
    }
    if (hubNodeIndices.length === 0) {
      scheduleHubWave(now, calmMode, lowDetailMode);
      return;
    }
    if (Math.random() < 0.35) {
      scheduleHubWave(now, calmMode, lowDetailMode);
      return;
    }

    let sourceIdx = -1;
    const cooldown = impulseSourceCooldownUntil;
    for (let i = 0; i < 16; i++) {
      const candidate = hubNodeIndices[(Math.random() * hubNodeIndices.length) | 0];
      if ((cooldown.get(candidate) || 0) <= now) {
        sourceIdx = candidate;
        break;
      }
    }
    if (sourceIdx === -1) {
      sourceIdx = hubNodeIndices[(Math.random() * hubNodeIndices.length) | 0];
    }

    const spawned = spawnHubPulseWave(sourceIdx, calmMode, lowDetailMode);
    if (spawned > 0) {
      cooldown.set(sourceIdx, now + HUB_WAVE_COOLDOWN_MS + Math.random() * 1200);
    }
    scheduleHubWave(now, calmMode, lowDetailMode);
  }

  function tryScrollBurst(now, calmMode) {
    if (calmMode) return;
    if (scrollEnergy <= PULSE_SCROLL_THRESHOLD) return;
    if (now - lastScrollBurstAt < PULSE_SCROLL_BURST_COOLDOWN_MS) return;
    const sourceIdx = pickRandomConnectedSourceNode();
    if (sourceIdx === -1) return;
    const ttl = Math.max(1, PULSE_TTL_START - 1);
    spawnPulseBurstFromNode(sourceIdx, PULSE_SCROLL_BURST_COUNT, ttl, PULSE_SCROLL_BURST_ENERGY, calmMode);
    lastScrollBurstAt = now;
  }

  function propagatePulse(packet, arrivalNodeIdx, calmMode) {
    const edges = nodeAdjacency[arrivalNodeIdx];
    if (!edges || edges.length === 0) return;

    const nonBacktrack = edges.filter(edge => edge.lineIdx !== packet.lineIdx);
    const candidateEdges = nonBacktrack.length > 0 ? nonBacktrack : edges;
    const arrivalDot = dots[arrivalNodeIdx];
    const role = arrivalDot ? arrivalDot.role : 'base';
    const branchCount =
      !calmMode && qualityLevel > 0.78 && ((role === 'hub' && Math.random() < 0.34) || (role === 'relay' && Math.random() < 0.22))
        ? 2
        : 1;
    const used = new Set();
    for (let branch = 0; branch < branchCount; branch++) {
      if (pulsePackets.length >= getPulsePacketLimit()) break;
      let edge = pickWeightedEdge(candidateEdges, -1);
      if (!edge) break;
      if (used.has(edge.lineIdx) && used.size < candidateEdges.length) {
        let guard = 0;
        while (edge && used.has(edge.lineIdx) && guard++ < 8) {
          edge = pickWeightedEdge(candidateEdges, -1);
        }
      }
      if (!edge) continue;
      used.add(edge.lineIdx);
      const line = staticLines[edge.lineIdx];
      const linkBoost = line && line.linkType === 'backbone' ? 1.08 : line && line.linkType === 'bridge' ? 1.02 : 1;
      const nextEnergy = packet.energy * PULSE_CHILD_ENERGY_MULT * linkBoost;
      if (nextEnergy < 0.05) continue;
      pushPulsePacket(
        edge.lineIdx,
        arrivalNodeIdx,
        edge.nodeIdx,
        packet.ttl - 1,
        nextEnergy,
        Math.max(0.45, packet.width * (0.9 + Math.random() * 0.22)),
        calmMode
      );
    }
  }

  function stepPulseTransport(now, calmMode, lowDetailMode = false) {
    if (staticLines.length === 0 || dots.length === 0) return;
    if (introState === 'idle' || introState === 'armed') {
      pulsePackets.length = 0;
      return;
    }

    if (qualityLevel < PULSE_DISABLE_QUALITY) {
      pulsePackets.length = 0;
      return;
    }

    tryAmbientPulse(now, calmMode);
    tryIdleImpulse(now, calmMode, lowDetailMode);
    tryHubPulseWave(now, calmMode, lowDetailMode);
    tryScrollBurst(now, calmMode);

    for (let i = pulsePackets.length - 1; i >= 0; i--) {
      const packet = pulsePackets[i];
      const line = staticLines[packet.lineIdx];
      const fromDot = dots[packet.fromNodeIdx];
      const toDot = dots[packet.toNodeIdx];

      if (!line || !fromDot || !toDot) {
        pulsePackets.splice(i, 1);
        continue;
      }

      packet.progress += packet.speed * (1 + scrollEnergy * PULSE_SCROLL_SPEED_BOOST);
      line.energy = clamp(line.energy + packet.energy * 0.1, 0, 2.5);

      if (packet.progress < 1) continue;

      const arrivalDot = dots[packet.toNodeIdx];
      if (arrivalDot) {
        arrivalDot.energy = clamp(arrivalDot.energy + packet.energy * 0.92, 0, 2.4);
      }

      const remainingTtl = packet.ttl - 1;
      pulsePackets.splice(i, 1);
      if (remainingTtl < 0 || calmMode && remainingTtl < 1) continue;

      propagatePulse(
        {
          lineIdx: packet.lineIdx,
          ttl: packet.ttl,
          energy: packet.energy,
          width: packet.width
        },
        packet.toNodeIdx,
        calmMode
      );
    }
  }

  function decayPulseEnergy(calmMode) {
    const lineDecay = calmMode ? 0.89 : PULSE_LINE_DECAY;
    const dotDecay = calmMode ? 0.84 : PULSE_DOT_DECAY;
    for (let i = 0; i < staticLines.length; i++) {
      const line = staticLines[i];
      line.energy *= lineDecay;
    }
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      dot.energy *= dotDecay;
    }
  }

  function resetPulseTransport(now = performance.now()) {
    pulsePackets.length = 0;
    lastScrollBurstAt = -Infinity;
    scheduleAmbientPulse(now, prefersReducedMotion);
    scheduleIdleImpulse(now, prefersReducedMotion, prefersReducedMotion);
    scheduleHubWave(now, prefersReducedMotion, prefersReducedMotion);
    impulseSourceCooldownUntil.clear();
    for (let i = 0; i < staticLines.length; i++) {
      staticLines[i].energy = 0;
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].energy = 0;
    }
  }

  function drawDepthFog(t, quality = 1, calmMode = false) {
    if (quality < 0.52) return;
    const alphaBase = (calmMode ? 0.008 : 0.014) * (0.75 + quality * 0.35);
    const driftA = Math.sin(t * 0.00008 + scrollY * 0.00025);
    const driftB = Math.cos(t * 0.00006 + scrollY * 0.00018);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const fogBand = ctx.createLinearGradient(
      -w * 0.3 + driftA * w * 0.08,
      h * (0.08 + driftB * 0.03),
      w * 1.1,
      h * (0.92 - driftA * 0.03)
    );
    fogBand.addColorStop(0, 'rgba(242, 242, 242, 0)');
    fogBand.addColorStop(0.25, `rgba(242, 242, 242, ${(alphaBase * 0.82).toFixed(4)})`);
    fogBand.addColorStop(0.62, `rgba(242, 242, 242, ${(alphaBase * 0.48).toFixed(4)})`);
    fogBand.addColorStop(1, 'rgba(242, 242, 242, 0)');
    ctx.fillStyle = fogBand;
    ctx.fillRect(0, 0, w, h);

    const zoneFog = ctx.createRadialGradient(
      clarityZone.x,
      clarityZone.y,
      clarityZone.radius * 0.28,
      clarityZone.x,
      clarityZone.y,
      clarityZone.radius * 1.55
    );
    zoneFog.addColorStop(0, 'rgba(242, 242, 242, 0)');
    zoneFog.addColorStop(0.4, `rgba(242, 242, 242, ${(alphaBase * 0.16).toFixed(4)})`);
    zoneFog.addColorStop(0.78, `rgba(242, 242, 242, ${(alphaBase * 0.62).toFixed(4)})`);
    zoneFog.addColorStop(1, `rgba(242, 242, 242, ${(alphaBase * 0.84).toFixed(4)})`);
    ctx.fillStyle = zoneFog;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawLayerDepthVeils(t, quality = 1, calmMode = false) {
    if (quality < 0.56) return;
    const farLift = (calmMode ? 0.008 : 0.012) * (0.78 + quality * 0.24);
    const midLift = (calmMode ? 0.006 : 0.011) * (0.75 + quality * 0.3);
    const nearLift = (calmMode ? 0.004 : 0.0082) * (0.68 + quality * 0.24);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const farVeil = ctx.createLinearGradient(0, -h * 0.08, 0, h * 0.72);
    farVeil.addColorStop(0, `rgba(242, 242, 242, ${(farLift * 0.92).toFixed(4)})`);
    farVeil.addColorStop(0.42, `rgba(242, 242, 242, ${(farLift * 0.36).toFixed(4)})`);
    farVeil.addColorStop(1, 'rgba(242, 242, 242, 0)');
    ctx.fillStyle = farVeil;
    ctx.fillRect(0, 0, w, h);

    const midBandY = h * (0.42 + Math.sin(t * 0.00009 + scrollY * 0.00014) * 0.04);
    const midVeil = ctx.createLinearGradient(0, midBandY - h * 0.32, 0, midBandY + h * 0.32);
    midVeil.addColorStop(0, 'rgba(242, 242, 242, 0)');
    midVeil.addColorStop(0.48, `rgba(242, 242, 242, ${(midLift * 0.72).toFixed(4)})`);
    midVeil.addColorStop(1, 'rgba(242, 242, 242, 0)');
    ctx.fillStyle = midVeil;
    ctx.fillRect(0, 0, w, h);

    const nearVeil = ctx.createRadialGradient(
      clarityZone.x,
      clarityZone.y + h * 0.06,
      clarityZone.radius * 0.24,
      clarityZone.x,
      clarityZone.y + h * 0.06,
      clarityZone.radius * 1.92
    );
    nearVeil.addColorStop(0, 'rgba(242, 242, 242, 0)');
    nearVeil.addColorStop(0.45, `rgba(242, 242, 242, ${(nearLift * 0.2).toFixed(4)})`);
    nearVeil.addColorStop(1, `rgba(242, 242, 242, ${(nearLift * 0.52).toFixed(4)})`);
    ctx.fillStyle = nearVeil;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function createCurvedBridgeArcs() {
    curvedBridgeArcs = [];
    if (!staticLines.length) return;

    const candidates = [];
    for (let i = 0; i < staticLines.length; i++) {
      const line = staticLines[i];
      if (!line) continue;
      const qualifies = line.linkType !== 'intra' || (line.layerGap || 0) >= 2 || line.kind === 'far';
      if (!qualifies) continue;
      if (line.linkType !== 'backbone' && (line.lineImportance || 0) < 0.22) continue;
      const score =
        (line.linkType === 'backbone' ? 1.3 : line.linkType === 'bridge' ? 0.98 : 0.64) +
        (line.layerGap || 0) * 0.26 +
        (line.depthWeight || 0.5) * 0.18 +
        (line.lineImportance || 0) * 1.08 +
        Math.random() * 0.35;
      candidates.push({ lineIdx: i, score });
    }
    if (!candidates.length) return;

    candidates.sort((a, b) => b.score - a.score);
    const cap = clamp(Math.floor(candidates.length * 0.24), 8, 24);
    for (let i = 0; i < cap; i++) {
      const item = candidates[i];
      if (!item) break;
      const line = staticLines[item.lineIdx];
      if (!line) continue;
      curvedBridgeArcs.push({
        lineIdx: item.lineIdx,
        curveAmp: (line.linkType === 'backbone' ? 22 : 14) + Math.random() * (line.linkType === 'backbone' ? 34 : 20),
        alpha: (line.linkType === 'backbone' ? 0.022 : 0.013) + Math.random() * 0.013,
        phase: Math.random() * Math.PI * 2,
        drift: 0.00012 + Math.random() * 0.00018,
        width: 0.3 + Math.random() * 0.44
      });
    }
  }

  function drawCurvedBridgeArcs(t, quality = 1, calmMode = false) {
    if (curvedBridgeArcs.length === 0 || quality < 0.62) return;
    const stride = quality < 0.8 ? 2 : 1;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < curvedBridgeArcs.length; i += stride) {
      const arc = curvedBridgeArcs[i];
      const line = staticLines[arc.lineIdx];
      if (!line) continue;
      const segment = getLineRenderSegment(line, t);
      if (!segment || segment.progress < 0.08) continue;
      if (line.kind === 'far' && quality < 0.66) continue;

      const sx = segment.sx;
      const sy = segment.sy;
      const ex = segment.ex;
      const ey = segment.ey;
      const dx = ex - sx;
      const dy = ey - sy;
      const len = Math.max(1, Math.hypot(dx, dy));
      const nx = -dy / len;
      const ny = dx / len;
      const midX = (sx + ex) * 0.5;
      const midY = (sy + ey) * 0.5;
      const drift = Math.sin(t * arc.drift + arc.phase + scrollY * 0.0014) * arc.curveAmp;
      const cx = midX + nx * drift;
      const cy = midY + ny * drift;
      const alphaBase = arc.alpha * (0.76 + (line.depthWeight || 0.5) * 0.5) * (line.linkType === 'backbone' ? 1.32 : 1);
      const alpha = alphaBase * (calmMode ? 0.62 : 1) * (0.72 + quality * 0.34) * (0.45 + segment.progress * 0.55);
      if (alpha < 0.003) continue;

      const grad = ctx.createLinearGradient(sx, sy, ex, ey);
      grad.addColorStop(0, `rgba(242, 242, 242, ${(alpha * 0.22).toFixed(4)})`);
      grad.addColorStop(0.5, `rgba(242, 242, 242, ${Math.min(0.18, alpha).toFixed(4)})`);
      grad.addColorStop(1, `rgba(242, 242, 242, ${(alpha * 0.22).toFixed(4)})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = arc.width + (line.linkType === 'backbone' ? 0.36 : 0) + (line.layerGap || 0) * 0.06;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cx, cy, ex, ey);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawEnergyLines(quality = 1, calmMode = false, now = performance.now()) {
    if (quality < 0.5) return;
    const stride = quality < 0.64 ? 2 : 1;
    const idleBoost = !calmMode && scrollEnergy < IDLE_IMPULSE_SCROLL_CUTOFF
      ? IDLE_IMPULSE_ALPHA_BOOST
      : 1;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = 'rgba(242, 242, 242, 1)';
    for (let i = 0; i < staticLines.length; i += stride) {
      const line = staticLines[i];
      if (!line || line.energy < 0.015) continue;

      const segment = getLineRenderSegment(line, now);
      if (!segment) continue;
      const mx = (segment.sx + segment.ex) * 0.5;
      const my = (segment.sy + segment.ey) * 0.5;
      const mask = clarityMaskAt(mx, my, 0.14, 1.08);
      const effectiveEnergy = idleBoost > 1
        ? Math.max(line.energy, IDLE_IMPULSE_MIN_LINE_ENERGY)
        : line.energy;
      const linkAlphaBoost =
        line.linkType === 'backbone'
          ? 1.25
          : line.linkType === 'bridge'
            ? 1.1
            : 1;
      const depthAlphaBoost = 0.72 + (line.depthWeight || 0.5) * 0.56;
      const alpha =
        effectiveEnergy *
        (0.012 + mask * 0.032) *
        (line.kind === 'far' ? 0.6 : line.kind === 'bridge' ? 0.82 : 1) *
        linkAlphaBoost *
        depthAlphaBoost *
        (calmMode ? 0.62 : 1) *
        idleBoost *
        (0.55 + segment.progress * 0.45);
      if (alpha < 0.003) continue;

      ctx.globalAlpha = Math.min(0.24, alpha);
      const widthBoost =
        line.linkType === 'backbone'
          ? 0.24
          : line.linkType === 'bridge'
            ? 0.12
            : 0;
      ctx.lineWidth = (line.kind === 'far' ? 0.5 : line.kind === 'bridge' ? 0.7 : 0.92) + effectiveEnergy * 0.36 + widthBoost;
      ctx.beginPath();
      ctx.moveTo(segment.sx, segment.sy);
      ctx.lineTo(segment.ex, segment.ey);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawPulsePackets(calmMode = false, quality = 1) {
    if (pulsePackets.length === 0 || quality < 0.48) return;
    const stride = quality < DETAIL_QUALITY_LOW ? 2 : 1;
    const drawCore = quality >= DETAIL_QUALITY_MED;
    const idleBoost = !calmMode && scrollEnergy < IDLE_IMPULSE_SCROLL_CUTOFF
      ? IDLE_IMPULSE_ALPHA_BOOST
      : 1;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < pulsePackets.length; i += stride) {
      const packet = pulsePackets[i];
      const line = staticLines[packet.lineIdx];
      const fromDot = dots[packet.fromNodeIdx];
      const toDot = dots[packet.toNodeIdx];
      if (!line || !fromDot || !toDot) continue;

      const fromPt = pointForDot(fromDot);
      const toPt = pointForDot(toDot);
      const ax = fromPt.x;
      const ay = fromPt.y;
      const bx = toPt.x;
      const by = toPt.y;
      const px = ax + (bx - ax) * packet.progress;
      const py = ay + (by - ay) * packet.progress;
      const angle = Math.atan2(by - ay, bx - ax);
      const linkType = packet.linkType || line.linkType || 'intra';
      const depthWeight = Number.isFinite(packet.depthWeight) ? packet.depthWeight : (line.depthWeight || 0.5);
      const tailLength = packet.width * (line.kind === 'far' ? 7.8 : 10.8) * (linkType === 'backbone' ? 1.24 : 1);
      const tailX = Math.cos(angle) * tailLength;
      const tailY = Math.sin(angle) * tailLength;
      const linkAlphaBoost = linkType === 'backbone' ? 1.26 : linkType === 'bridge' ? 1.1 : 1;
      const alpha =
        packet.energy *
        (line.kind === 'far' ? 0.045 : 0.06) *
        linkAlphaBoost *
        (0.76 + depthWeight * 0.45) *
        (0.8 + scrollEnergy * 0.36) *
        (calmMode ? 0.55 : 1) *
        idleBoost;
      if (alpha < 0.004) continue;

      const trail = ctx.createLinearGradient(px - tailX, py - tailY, px, py);
      trail.addColorStop(0, 'rgba(242, 242, 242, 0)');
      trail.addColorStop(1, `rgba(242, 242, 242, ${Math.min(0.26, alpha).toFixed(4)})`);
      ctx.strokeStyle = trail;
      ctx.lineWidth = packet.width * (line.kind === 'far' ? 0.52 : 0.7) * (linkType === 'backbone' ? 1.15 : 1);
      ctx.beginPath();
      ctx.moveTo(px - tailX, py - tailY);
      ctx.lineTo(px, py);
      ctx.stroke();

      if (drawCore) {
        const core = ctx.createRadialGradient(px, py, 0, px, py, packet.width * 3.9 * (linkType === 'backbone' ? 1.2 : 1));
        core.addColorStop(0, `rgba(242, 242, 242, ${Math.min(0.22, alpha * 1.6).toFixed(4)})`);
        core.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, packet.width * 3.9 * (linkType === 'backbone' ? 1.2 : 1), 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawNodeAuras(quality = 1, calmMode = false) {
    if (quality < 0.5) return;
    const stride = calmMode ? 3 : quality < 0.8 ? 2 : 1;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < dots.length; i += stride) {
      const dot = dots[i];
      if (!dot || dot.energy < 0.02) continue;

      const pt = pointForDot(dot);
      const rx = pt.x;
      const ry = pt.y;
      const mask = clarityMaskAt(rx, ry, 0.16, 1.1);
      const roleBoost = dot.role === 'hub' ? 1.4 : dot.role === 'relay' ? 1.16 : 1;
      const alpha = dot.energy * (0.014 + mask * 0.038) * roleBoost * (calmMode ? 0.54 : 1);
      if (alpha < 0.0035) continue;

      const auraR = dot.r * (5.2 + dot.energy * 7.5 + dot.layer * 1.15) * (dot.role === 'hub' ? 1.24 : dot.role === 'relay' ? 1.1 : 1);
      const aura = ctx.createRadialGradient(rx, ry, 0, rx, ry, auraR);
      aura.addColorStop(0, `rgba(242, 242, 242, ${Math.min(0.16, alpha * 1.45).toFixed(4)})`);
      aura.addColorStop(0.42, `rgba(242, 242, 242, ${Math.min(0.09, alpha * 0.8).toFixed(4)})`);
      aura.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(rx, ry, auraR, 0, Math.PI * 2);
      ctx.fillStyle = aura;
      ctx.fill();
    }
    ctx.restore();
  }

  let grainTile = null;
  let grainPattern = null;
  let grainOffset = { x: 0, y: 0 };
  function createGrainTile() {
    const size = 256;
    grainTile = document.createElement('canvas');
    grainTile.width = size;
    grainTile.height = size;
    const gctx = grainTile.getContext('2d');
    for (let i = 0; i < 3200; i++) {
      const alpha = 0.03 + Math.random() * 0.09;
      gctx.fillStyle = `rgba(242, 242, 242, ${alpha})`;
      gctx.fillRect(
        (Math.random() * size) | 0,
        (Math.random() * size) | 0,
        Math.max(1, (Math.random() * 1.5) | 0),
        Math.max(1, (Math.random() * 1.5) | 0)
      );
    }
    grainPattern = ctx.createPattern(grainTile, 'repeat');
  }

  function drawClarityLight(t, quality = 1, calmMode = false) {
    const pulse = 0.96 + Math.sin(t * (calmMode ? 0.00018 : 0.00035)) * (calmMode ? 0.02 : 0.04);
    const outerRadius = clarityZone.radius * 1.36 * pulse;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const softGlow = ctx.createRadialGradient(
      clarityZone.x,
      clarityZone.y,
      clarityZone.radius * 0.12,
      clarityZone.x,
      clarityZone.y,
      outerRadius
    );
    const glowScale = calmMode ? 0.42 : 0.56;
    softGlow.addColorStop(0, `rgba(242, 242, 242, ${(0.024 * glowScale * (0.84 + quality * 0.16)).toFixed(4)})`);
    softGlow.addColorStop(0.28, `rgba(242, 242, 242, ${(0.009 * glowScale).toFixed(4)})`);
    softGlow.addColorStop(0.62, `rgba(242, 242, 242, ${(0.003 * glowScale).toFixed(4)})`);
    softGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = softGlow;
    ctx.fillRect(0, 0, w, h);

    const centerBloom = ctx.createRadialGradient(
      clarityZone.x,
      clarityZone.y,
      0,
      clarityZone.x,
      clarityZone.y,
      clarityZone.radius * 0.62
    );
    centerBloom.addColorStop(0, `rgba(242, 242, 242, ${(0.01 * glowScale * (0.86 + quality * 0.14)).toFixed(4)})`);
    centerBloom.addColorStop(0.45, `rgba(242, 242, 242, ${(0.0024 * glowScale).toFixed(4)})`);
    centerBloom.addColorStop(1, 'transparent');
    ctx.fillStyle = centerBloom;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function drawTextZoneFalloff(quality = 1, calmMode = false) {
    const falloffStrength = (calmMode ? 0.18 : 0.26) * (0.72 + quality * 0.28);
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const falloff = ctx.createRadialGradient(
      clarityZone.x,
      clarityZone.y,
      clarityZone.radius * 0.06,
      clarityZone.x,
      clarityZone.y,
      clarityZone.radius * 1.42
    );
    falloff.addColorStop(0, `rgba(0, 0, 0, ${(falloffStrength * 1.28).toFixed(4)})`);
    falloff.addColorStop(0.36, `rgba(0, 0, 0, ${(falloffStrength * 0.78).toFixed(4)})`);
    falloff.addColorStop(0.72, `rgba(0, 0, 0, ${(falloffStrength * 0.34).toFixed(4)})`);
    falloff.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = falloff;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function createNoiseSpecks() {
    noiseSpecks = [];
    const count = Math.min(280, Math.floor((w * h) / 2800));
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const zoneWeight = computeZoneWeightAt(x, y);
      noiseSpecks.push({
        x,
        y,
        size: 0.55 + Math.random() * 1.1,
        alpha: 0.015 + Math.random() * 0.055,
        driftAmp: (1 - zoneWeight) * (1.6 + Math.random() * 4.2),
        speed: 0.00008 + Math.random() * 0.00022,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2
      });
    }
  }

  function drawTemporalLightPass(t, quality = 1, calmMode = false) {
    const swing = (Math.sin(t * (calmMode ? 0.00005 : 0.00009)) + 1) * 0.5;
    const sweepStartX = -w * 0.35 + swing * w * 1.5;
    const sweepEndX = sweepStartX + w * 0.7;
    const shimmer = ctx.createLinearGradient(sweepStartX, 0, sweepEndX, h);
    const alphaPeak = (calmMode ? 0.015 : 0.024) * (0.8 + quality * 0.32);
    shimmer.addColorStop(0, 'rgba(242, 242, 242, 0)');
    shimmer.addColorStop(0.32, fxPalette.temporalLightStrong);
    shimmer.addColorStop(0.4, `rgba(242, 242, 242, ${alphaPeak.toFixed(4)})`);
    shimmer.addColorStop(0.62, `rgba(242, 242, 242, ${(alphaPeak * 0.66).toFixed(4)})`);
    shimmer.addColorStop(1, 'rgba(242, 242, 242, 0)');

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 0, w, h);

    const topDrift = ctx.createRadialGradient(
      w * (0.32 + Math.sin(t * 0.00004) * 0.02),
      h * 0.17,
      0,
      w * 0.35,
      h * 0.2,
      w * 0.58
    );
    topDrift.addColorStop(0, `rgba(242, 242, 242, ${(alphaPeak * 0.56).toFixed(4)})`);
    topDrift.addColorStop(0.52, `rgba(242, 242, 242, ${(alphaPeak * 0.22).toFixed(4)})`);
    topDrift.addColorStop(1, 'transparent');
    ctx.fillStyle = topDrift;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    auroraCanvas = null;
    updateClarityZoneTarget();
  }
  resize();
  if (clarityZone.x === 0 && clarityZone.y === 0) {
    syncClarityZone(1);
  }

  function placeDots() {
    dots = [];
    staticLines = [];
    nodeAdjacency = [];
    lineAdjacency = [];
    nodeDegrees = [];
    nodeCentralityScores = [];
    pulsePackets = [];
    curvedBridgeArcs = [];
    hubNodeIndices = [];
    relayNodeIndices = [];
    auroraCanvas = null;

    const layerCount = LAYER_DEFS.length;
    const viewportSeed = seedFromViewport(w, h, 41);
    const layerPattern = ['molecular_lattice', 'mycelial_network', 'leaf_venation', 'capillary_tree', 'neural_arbor'];
    const targetDots = Math.floor(clamp((w * h) / 10800, 210, 360));
    const budgets = [0.17, 0.20, 0.27, 0.20, 0.16].map((r) => Math.max(20, Math.floor(targetDots * r)));
    const missing = targetDots - budgets.reduce((s, v) => s + v, 0);
    if (missing > 0) budgets[budgets.length - 1] += missing;

    const layerCounts = new Array(layerCount).fill(0);
    const layerNodes = Array.from({ length: layerCount }, () => []);
    const edges = [];
    const edgeSet = new Set();

    const baseDist = clamp(Math.min(w, h) * 0.055, 34, 68);
    const cell = Math.max(18, baseDist * 0.9);
    const cols = Math.ceil(w / cell) + 1;
    const rows = Math.ceil(h / cell) + 1;
    const buckets = new Array(cols * rows);

    function rWeight(role) {
      if (role === 'soma' || role === 'midrib_origin' || role === 'arteriole_root' || role === 'lattice_junction') return 0.92;
      if (role === 'macro_root' || role === 'macro_trunk') return 0.94;
      if (role === 'macro_loop') return 0.8;
      if (role === 'macro_branch') return 0.72;
      if (role === 'macro_capillary') return 0.54;
      if (role.indexOf('junction') >= 0 || role.indexOf('branch') >= 0) return 0.68;
      if (role.indexOf('root') >= 0 || role.indexOf('midrib') >= 0) return 0.58;
      if (role.indexOf('tip') >= 0 || role.indexOf('tertiary') >= 0) return 0.34;
      return 0.48;
    }

    function fract(v) {
      return v - Math.floor(v);
    }

    function bucketKey(x, y) {
      const cx = clamp(Math.floor(x / cell), 0, cols - 1);
      const cy = clamp(Math.floor(y / cell), 0, rows - 1);
      return cx * rows + cy;
    }

    function insertBucket(idx) {
      const d = dots[idx];
      if (!d) return;
      const key = bucketKey(d.x, d.y);
      if (!buckets[key]) buckets[key] = [];
      buckets[key].push(idx);
    }

    function d2(ax, ay, bx, by) {
      const dx = ax - bx;
      const dy = ay - by;
      return dx * dx + dy * dy;
    }

    function inBounds(x, y, m = 0) {
      return x >= m && x <= w - m && y >= m && y <= h - m;
    }

    function canPlace(x, y, need, layer) {
      if (!inBounds(x, y, 4)) return false;
      const cx = clamp(Math.floor(x / cell), 0, cols - 1);
      const cy = clamp(Math.floor(y / cell), 0, rows - 1);
      const range = Math.max(1, Math.ceil((need * 1.2) / cell));
      for (let nx = Math.max(0, cx - range); nx <= Math.min(cols - 1, cx + range); nx++) {
        for (let ny = Math.max(0, cy - range); ny <= Math.min(rows - 1, cy + range); ny++) {
          const bucket = buckets[nx * rows + ny];
          if (!bucket || bucket.length === 0) continue;
          for (let bi = 0; bi < bucket.length; bi++) {
            const o = dots[bucket[bi]];
            if (!o) continue;
            const layerF = o.layer === layer ? 1 : 0.72;
            const req = Math.max(need, o.localMinDist * layerF);
            if (d2(x, y, o.x, o.y) < req * req) return false;
          }
        }
      }
      return true;
    }

    function addDot(x, y, layer, role, order = 0, force = false, patternTypeOverride = null) {
      if (layer < 0 || layer >= layerCount) return -1;
      if (!force && layerCounts[layer] >= budgets[layer]) return -1;
      const px = clamp(x, 2, w - 2);
      const py = clamp(y, 2, h - 2);
      const depthNorm = layer / Math.max(1, layerCount - 1);
      const need = clamp(baseDist * (1.08 - depthNorm * 0.24 + Math.min(5, order) * 0.04), 16, baseDist * 1.7);
      if (!canPlace(px, py, need, layer)) return -1;

      const idx = dots.length;
      const def = LAYER_DEFS[layer];
      const zone = computeZoneWeightAt(px, py);
      const rw = rWeight(role);
      const imp = clamp(rw * 0.62 + zone * 0.18 + (1 - Math.min(1, order / 5)) * 0.2, 0, 1);
      const seedA = hash01(viewportSeed + layer * 313, idx, order, 11);
      const seedB = hash01(viewportSeed + layer * 617, idx, order, 19);
      const seedC = hash01(viewportSeed + layer * 827, idx, order, 31);
      const patternType = patternTypeOverride || layerPattern[layer];

      dots.push({
        x: px,
        y: py,
        layer,
        depthIndex: layer,
        depthNorm,
        zoneWeight: zone,
        importance: imp,
        filamentProximity: clamp(0.72 - Math.min(4, order) * 0.13 + rw * 0.24, 0, 1),
        coreProximity: clamp(rw * 0.86 + (role.indexOf('root') >= 0 ? 0.18 : 0), 0, 1),
        junctionProximity: clamp((role.indexOf('junction') >= 0 ? 0.74 : 0.26) + rw * 0.22, 0, 1),
        clusterId: layer,
        clusterStrength: clamp(0.38 + imp * 0.6, 0, 1),
        clusterGapWeight: clamp(1 - imp * 0.75, 0, 1),
        localMinDist: need,
        stability: clamp(0.22 + zone * 0.46 + depthNorm * 0.28 + rw * 0.18, 0, 1.2),
        role: 'base',
        layerParallax: def.parallax,
        r: (def.radiusMin + (def.radiusMax - def.radiusMin) * seedA) * (0.78 + imp * 0.62),
        baseAlpha: (0.0125 + seedB * 0.0275) * def.alphaScale * (0.72 + imp * 0.66),
        twinkleSpeed: 0.00022 + seedC * 0.0011,
        twinkleOffset: hash01(viewportSeed + layer * 1237, idx, order, 53) * Math.PI * 2,
        baseDriftAmp: def.driftAmpMin + hash01(viewportSeed + layer * 991, idx, order, 43) * (def.driftAmpMax - def.driftAmpMin),
        driftSpeed: def.driftSpeedMin + hash01(viewportSeed + layer * 1423, idx, order, 67) * (def.driftSpeedMax - def.driftSpeedMin),
        driftPhaseX: hash01(viewportSeed + layer * 1619, idx, order, 71) * Math.PI * 2,
        driftPhaseY: hash01(viewportSeed + layer * 1879, idx, order, 73) * Math.PI * 2,
        offsetX: 0,
        offsetY: 0,
        renderX: px,
        renderY: py,
        velX: 0,
        velY: 0,
        energy: 0,
        centrality: 0,
        isStar: false,
        intro: null,
        introProgress: 1,
        patternType,
        patternRole: role,
        patternNodeId: `${patternType}:${layerCounts[layer]}`,
        branchOrder: order
      });

      layerNodes[layer].push(idx);
      layerCounts[layer]++;
      insertBucket(idx);
      return idx;
    }

    function addEdge(aIdx, bIdx, rel = 'intra', hint = 'intra', pType = 'hybrid', order = 0, backbone = false) {
      if (aIdx < 0 || bIdx < 0 || aIdx === bIdx) return false;
      const a = dots[aIdx];
      const b = dots[bIdx];
      if (!a || !b) return false;
      const key = aIdx < bIdx ? `${aIdx}:${bIdx}` : `${bIdx}:${aIdx}`;
      if (edgeSet.has(key)) return false;
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const maxDist = backbone ? Math.max(w, h) : clamp(Math.min(w, h) * 0.24, 120, 220);
      if (dist > maxDist) return false;
      edgeSet.add(key);
      edges.push({ aIdx, bIdx, relationType: rel, linkTypeHint: hint, patternType: pType, branchOrder: order, dist });
      return true;
    }

    function connectNear(from, to, maxDist, salt, skip) {
      if (!from.length || !to.length) return;
      const nearestTargetBySource = new Array(from.length).fill(-1);
      const nearestTargetScore = new Array(from.length).fill(Infinity);
      const nearestSourceByTarget = new Array(to.length).fill(-1);
      const nearestSourceScore = new Array(to.length).fill(Infinity);

      for (let i = 0; i < from.length; i++) {
        const sourceIdx = from[i];
        const source = dots[sourceIdx];
        if (!source) continue;
        for (let j = 0; j < to.length; j++) {
          const targetIdx = to[j];
          const target = dots[targetIdx];
          if (!target) continue;
          const dist = Math.hypot(source.x - target.x, source.y - target.y);
          if (dist > maxDist) continue;
          const score = dist + Math.abs((source.branchOrder || 0) - (target.branchOrder || 0)) * 6;
          if (score < nearestTargetScore[i]) {
            nearestTargetScore[i] = score;
            nearestTargetBySource[i] = j;
          }
          if (score < nearestSourceScore[j]) {
            nearestSourceScore[j] = score;
            nearestSourceByTarget[j] = i;
          }
        }
      }

      const strictMax = maxDist * clamp(0.66 + (1 - skip) * 0.36, 0.62, 0.96);
      for (let i = 0; i < from.length; i++) {
        const j = nearestTargetBySource[i];
        if (j < 0) continue;
        if (nearestSourceByTarget[j] !== i) continue;
        const sourceIdx = from[i];
        const targetIdx = to[j];
        const source = dots[sourceIdx];
        const target = dots[targetIdx];
        if (!source || !target) continue;
        const dist = Math.hypot(source.x - target.x, source.y - target.y);
        if (dist > strictMax) continue;
        const major =
          (source.patternRole === 'soma' || source.patternRole === 'midrib_origin' || source.patternRole === 'arteriole_root') &&
          (target.patternRole === 'soma' || target.patternRole === 'midrib_origin' || target.patternRole === 'arteriole_root');
        addEdge(sourceIdx, targetIdx, 'crossLayer', major ? 'backbone' : 'bridge', `${source.patternType}->${target.patternType}`, Math.max(source.branchOrder || 0, target.branchOrder || 0), major);
      }
    }

    function buildBorderScaffold(layer, patternType, role, salt) {
      const inset = clamp(Math.min(w, h) * (layer === 0 ? 0.022 : 0.03), 10, 28);
      const xSteps = clamp(Math.floor(w / (layer === 0 ? 340 : 380)), layer === 0 ? 5 : 4, layer === 0 ? 10 : 8);
      const ySteps = clamp(Math.floor(h / (layer === 0 ? 300 : 330)), layer === 0 ? 3 : 2, layer === 0 ? 7 : 5);
      const sides = { top: [], right: [], bottom: [], left: [] };
      const borderNodes = [];

      function addBorderNode(side, x, y, order = 0) {
        const idx = addDot(x, y, layer, role, order, true);
        if (idx === -1) return;
        sides[side].push(idx);
        borderNodes.push(idx);
      }

      for (let i = 0; i <= xSteps; i++) {
        const t = i / Math.max(1, xSteps);
        const x = lerp(inset, w - inset, t) + hashSigned(viewportSeed + salt, i, 0, 0) * inset * 0.46;
        const topY = inset + hashSigned(viewportSeed + salt + 11, i, 0, 1) * inset * 0.34;
        const bottomY = h - inset + hashSigned(viewportSeed + salt + 17, i, 0, 2) * inset * 0.34;
        addBorderNode('top', x, topY, 0);
        addBorderNode('bottom', x, bottomY, 0);
      }

      for (let j = 1; j < ySteps; j++) {
        const t = j / Math.max(1, ySteps);
        const y = lerp(inset, h - inset, t) + hashSigned(viewportSeed + salt + 23, j, 0, 0) * inset * 0.42;
        const leftX = inset + hashSigned(viewportSeed + salt + 29, j, 0, 1) * inset * 0.3;
        const rightX = w - inset + hashSigned(viewportSeed + salt + 31, j, 0, 2) * inset * 0.3;
        addBorderNode('left', leftX, y, 0);
        addBorderNode('right', rightX, y, 0);
      }

      function stitchChain(nodes, chainSalt) {
        for (let i = 1; i < nodes.length; i++) {
          addEdge(nodes[i - 1], nodes[i], 'intra', 'intra', patternType, 0, false);
          if (i > 1 && hash01(viewportSeed + chainSalt, i, layer, 0) > 0.72) {
            addEdge(nodes[i - 2], nodes[i], 'intra', 'bridge', patternType, 1, false);
          }
        }
      }

      stitchChain(sides.top, salt + 41);
      stitchChain(sides.right, salt + 43);
      stitchChain(sides.bottom, salt + 47);
      stitchChain(sides.left, salt + 53);

      if (sides.top.length && sides.left.length) addEdge(sides.top[0], sides.left[0], 'intra', 'intra', patternType, 0, false);
      if (sides.top.length && sides.right.length) addEdge(sides.top[sides.top.length - 1], sides.right[0], 'intra', 'intra', patternType, 0, false);
      if (sides.bottom.length && sides.left.length) addEdge(sides.bottom[0], sides.left[sides.left.length - 1], 'intra', 'intra', patternType, 0, false);
      if (sides.bottom.length && sides.right.length) addEdge(sides.bottom[sides.bottom.length - 1], sides.right[sides.right.length - 1], 'intra', 'intra', patternType, 0, false);

      const borderSet = new Set(borderNodes);
      const inwardCap = clamp(Math.min(w, h) * (layer === 0 ? 0.18 : 0.16), 64, 124);
      const stride = layer === 0 ? 2 : 3;
      for (let i = 0; i < borderNodes.length; i += stride) {
        const sourceIdx = borderNodes[i];
        const source = dots[sourceIdx];
        if (!source) continue;
        let best = -1;
        let bestScore = Infinity;
        const sameLayer = layerNodes[layer];
        for (let j = 0; j < sameLayer.length; j++) {
          const targetIdx = sameLayer[j];
          if (targetIdx === sourceIdx || borderSet.has(targetIdx)) continue;
          const target = dots[targetIdx];
          if (!target) continue;
          const dist = Math.hypot(source.x - target.x, source.y - target.y);
          if (dist > inwardCap) continue;
          const score = dist + Math.abs((source.branchOrder || 0) - (target.branchOrder || 0)) * 5;
          if (score < bestScore) {
            bestScore = score;
            best = targetIdx;
          }
        }
        if (best >= 0) {
          addEdge(sourceIdx, best, 'intra', 'bridge', patternType, 1, false);
        }
      }
    }

    function buildLattice() {
      const sx = clamp(Math.min(w, h) * 0.148, 120, 170);
      const sy = sx * 0.84;
      const rMax = Math.ceil(h / sy) + 1;
      const cMax = Math.ceil(w / sx) + 1;
      const grid = new Map();
      for (let r = 0; r <= rMax; r++) {
        for (let c = 0; c <= cMax; c++) {
          const bx = c * sx + (r % 2 === 0 ? 0 : sx * 0.5);
          const by = r * sy;
          const x = bx + hashSigned(viewportSeed + 2003, r, c, 0) * sx * 0.16;
          const y = by + hashSigned(viewportSeed + 2017, r, c, 1) * sy * 0.14;
          if (!inBounds(x, y, -20)) continue;
          const role = (r + c) % 4 === 0 ? 'lattice_junction' : 'lattice_node';
          const idx = addDot(x, y, 0, role, 0, false);
          if (idx !== -1) grid.set(`${r}:${c}`, idx);
        }
      }
      grid.forEach((idx, key) => {
        const [r, c] = key.split(':').map(Number);
        const right = grid.get(`${r}:${c + 1}`);
        const down = grid.get(`${r + 1}:${c}`);
        const diag = grid.get(`${r + 1}:${c + (r % 2 === 0 ? -1 : 1)}`);
        if (right !== undefined) addEdge(idx, right, 'intra', 'intra', 'molecular_lattice', 0, false);
        if (down !== undefined) addEdge(idx, down, 'intra', 'intra', 'molecular_lattice', 0, false);
        if (diag !== undefined) addEdge(idx, diag, 'intra', 'intra', 'molecular_lattice', 0, false);
        if (hash01(viewportSeed + 2053, r, c, 3) > 0.72) {
          const chord = grid.get(`${r}:${c + 2}`);
          if (chord !== undefined) addEdge(idx, chord, 'intra', 'bridge', 'molecular_lattice', 1, false);
        }
      });
    }

    function growBranches(opts) {
      const queue = [];
      const roots = [];
      for (let r = 0; r < opts.rootCount; r++) {
        const rx = w * (opts.xStart + fract(r * opts.xStep + opts.xShift) * opts.xSpan);
        const ry = h * (opts.yStart + fract(r * opts.yStep + opts.yShift) * opts.ySpan);
        const rootIdx = addDot(rx, ry, opts.layer, opts.rootRole, 0, true);
        if (rootIdx === -1) continue;
        roots.push(rootIdx);
        for (let b = 0; b < opts.rootBranches; b++) {
          queue.push({
            idx: rootIdx,
            x: rx,
            y: ry,
            angle: opts.baseAngle + (Math.PI * 2 * b) / opts.rootBranches + hashSigned(viewportSeed + opts.sA, r, b, 0) * opts.rootJitter,
            len: opts.lMin + hash01(viewportSeed + opts.sB, r, b, 0) * (opts.lMax - opts.lMin),
            depth: 0,
            seed: r * 31 + b + 1
          });
        }
      }

      let guard = 0;
      while (queue.length > 0 && guard++ < opts.guard && layerCounts[opts.layer] < budgets[opts.layer]) {
        const branch = queue.shift();
        if (!branch) continue;
        const split = branch.depth < opts.splitDepth && hash01(viewportSeed + opts.sC, branch.seed, branch.depth, guard) > opts.splitThreshold ? 2 : 1;
        for (let c = 0; c < split; c++) {
          const turn = hashSigned(viewportSeed + opts.sD, branch.seed, branch.depth, c) * (branch.depth < opts.turnDepth ? opts.turnMax : opts.turnMax * 0.64);
          const angle = branch.angle + turn;
          const len = branch.len * (opts.decayMin + hash01(viewportSeed + opts.sE, branch.seed, branch.depth, c) * (opts.decayMax - opts.decayMin));
          const nx = branch.x + Math.cos(angle) * len;
          const ny = branch.y + Math.sin(angle) * len;
          if (!inBounds(nx, ny, opts.boundMargin)) continue;
          const role = branch.depth < opts.roleCut ? opts.branchRole : opts.tipRole;
          const idx = addDot(nx, ny, opts.layer, role, branch.depth + 1, false);
          if (idx === -1) continue;
          addEdge(branch.idx, idx, 'intra', branch.depth < 1 && opts.bridgePrimary ? 'bridge' : 'intra', opts.patternType, branch.depth + 1, false);
          if (branch.depth < opts.depthMax && len > opts.minSeg) {
            queue.push({ idx, x: nx, y: ny, angle, len, depth: branch.depth + 1, seed: branch.seed * 37 + c + 1 });
          }
        }
      }

      return roots;
    }

    function buildLeaf() {
      const leafCount = clamp(Math.floor(w / 500), 3, 4);
      for (let l = 0; l < leafCount; l++) {
        const xNorm = 0.12 + ((l + 0.5) / leafCount) * 0.76;
        const bx = w * xNorm + hashSigned(viewportSeed + 2609, l, 0, 0) * w * 0.04;
        const by = h * (0.8 + hashSigned(viewportSeed + 2617, l, 0, 1) * 0.06);
        const tx = bx + hashSigned(viewportSeed + 2633, l, 0, 2) * w * 0.08;
        const ty = h * (0.16 + hash01(viewportSeed + 2647, l, 0, 3) * 0.12);
        const steps = 8 + Math.floor(hash01(viewportSeed + 2659, l, 0, 4) * 3);
        let prev = addDot(bx, by, 2, 'midrib_origin', 0, true);
        if (prev === -1) continue;
        const mid = [prev];
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const x = lerp(bx, tx, t) + Math.sin(t * Math.PI) * hashSigned(viewportSeed + 2671, l, s, 0) * w * 0.03;
          const y = lerp(by, ty, t);
          const idx = addDot(x, y, 2, 'midrib', 0, false);
          if (idx === -1) continue;
          addEdge(prev, idx, 'intra', 'intra', 'leaf_venation', 0, false);
          mid.push(idx);
          prev = idx;
        }
        for (let m = 1; m < mid.length - 1; m++) {
          if (hash01(viewportSeed + 2693, l, m, 0) < 0.22) continue;
          const src = dots[mid[m]];
          const p = dots[mid[m - 1]];
          const n = dots[mid[m + 1]];
          if (!src || !p || !n) continue;
          const dir = Math.atan2(n.y - p.y, n.x - p.x);
          const t = m / Math.max(1, mid.length - 1);
          const baseLen = clamp(Math.min(w, h) * (0.09 * (1 - t) + 0.03), 22, 92);
          for (let side = -1; side <= 1; side += 2) {
            const secA = dir + side * (1.05 + hashSigned(viewportSeed + 2711, l, m, side) * 0.32);
            const secL = baseLen * (0.84 + hash01(viewportSeed + 2729, l, m, side) * 0.2);
            const sx = src.x + Math.cos(secA) * secL;
            const sy = src.y + Math.sin(secA) * secL;
            const sec = addDot(sx, sy, 2, 'secondary_vein', 1, false);
            if (sec === -1) continue;
            addEdge(mid[m], sec, 'intra', 'intra', 'leaf_venation', 1, false);
            if (hash01(viewportSeed + 2749, l, m, side) > 0.34) {
              const ta = secA + side * (0.34 + hashSigned(viewportSeed + 2767, l, m, side) * 0.2);
              const tl = secL * (0.46 + hash01(viewportSeed + 2789, l, m, side) * 0.2);
              const tt = addDot(sx + Math.cos(ta) * tl, sy + Math.sin(ta) * tl, 2, 'tertiary_vein', 2, false);
              if (tt !== -1) addEdge(sec, tt, 'intra', 'intra', 'leaf_venation', 2, false);
            }
          }
        }
      }
    }

    function buildMacroAsymmetricVascular() {
      const patternType = 'macro_vascular_fan';
      const layer = 2;
      const bounds = {
        minX: w * 0.58,
        maxX: w * 0.95,
        minY: h * 0.42,
        maxY: h * 0.90
      };
      const structureCenter = {
        x: clamp(w * 0.79 + hashSigned(viewportSeed + 4079, 1, 0, 0) * w * 0.018, bounds.minX, bounds.maxX),
        y: clamp(h * 0.67 + hashSigned(viewportSeed + 4091, 1, 0, 1) * h * 0.018, bounds.minY, bounds.maxY)
      };
      const nucleus = {
        x: clamp(w * 0.72 + hashSigned(viewportSeed + 4103, 2, 0, 0) * w * 0.016, bounds.minX, bounds.maxX),
        y: clamp(h * 0.66 + hashSigned(viewportSeed + 4127, 2, 0, 1) * h * 0.016, bounds.minY, bounds.maxY)
      };
      const macroNodeTarget = clamp(Math.floor(targetDots * 0.16), 34, 58);
      const macroNodes = [];
      const macroNodeSet = new Set();
      const macroAngles = new Map();

      function inMacroBounds(x, y) {
        return x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY;
      }

      function angleDelta(a, b) {
        let d = (b - a) % (Math.PI * 2);
        if (d > Math.PI) d -= Math.PI * 2;
        if (d < -Math.PI) d += Math.PI * 2;
        return d;
      }

      function addMacroNode(x, y, role, order, angleHint = 0, force = true) {
        if (!inMacroBounds(x, y)) return -1;
        const idx = addDot(x, y, layer, role, order, force, patternType);
        if (idx === -1) return -1;
        macroNodes.push(idx);
        macroNodeSet.add(idx);
        macroAngles.set(idx, angleHint);
        return idx;
      }

      const trunkStart = {
        x: clamp(w * 0.93 + hashSigned(viewportSeed + 4159, 3, 0, 0) * w * 0.013, bounds.minX, bounds.maxX),
        y: clamp(h * 0.88 + hashSigned(viewportSeed + 4177, 3, 0, 1) * h * 0.012, bounds.minY, bounds.maxY)
      };
      const trunkCtrl = {
        x: clamp(w * 0.89 + hashSigned(viewportSeed + 4201, 4, 0, 0) * w * 0.018, bounds.minX, bounds.maxX),
        y: clamp(h * 0.77 + hashSigned(viewportSeed + 4211, 4, 0, 1) * h * 0.02, bounds.minY, bounds.maxY)
      };

      const trunkSteps = clamp(Math.floor(macroNodeTarget * 0.22), 8, 14);
      const trunk = [];
      let prev = addMacroNode(
        trunkStart.x,
        trunkStart.y,
        'macro_root',
        0,
        Math.atan2(nucleus.y - trunkStart.y, nucleus.x - trunkStart.x)
      );
      if (prev === -1) {
        prev = addMacroNode(nucleus.x, nucleus.y, 'macro_root', 0, 0, true);
      }
      if (prev === -1) return { nodes: [], layer, rootIdx: -1, nucleusIdx: -1, center: structureCenter, nucleus };
      trunk.push(prev);

      for (let s = 1; s <= trunkSteps && macroNodes.length < macroNodeTarget; s++) {
        const t = s / trunkSteps;
        const x =
          quadraticBezier(trunkStart.x, trunkCtrl.x, nucleus.x, t) +
          hashSigned(viewportSeed + 4231, s, 0, 0) * w * 0.0045;
        const y =
          quadraticBezier(trunkStart.y, trunkCtrl.y, nucleus.y, t) +
          hashSigned(viewportSeed + 4243, s, 0, 1) * h * 0.004;
        const ang = Math.atan2(y - dots[prev].y, x - dots[prev].x);
        const role = s < 2 ? 'macro_trunk' : s < trunkSteps ? 'macro_trunk' : 'macro_branch';
        const idx = addMacroNode(x, y, role, 0, ang, true);
        if (idx === -1) continue;
        addEdge(prev, idx, 'intra', s < 3 ? 'backbone' : 'intra', patternType, 0, false);
        trunk.push(idx);
        prev = idx;
      }

      if (trunk.length === 0) return { nodes: [], layer, rootIdx: -1, nucleusIdx: -1, center: structureCenter, nucleus };
      const rootIdx = trunk[0];
      const nucleusIdx = trunk[trunk.length - 1];

      const branchQueue = [];
      const primaryCount = clamp(Math.floor(macroNodeTarget / 9), 4, 7);
      for (let p = 0; p < primaryCount; p++) {
        const anchorT = 0.32 + (primaryCount === 1 ? 0 : (p / (primaryCount - 1)) * 0.52);
        const anchorIdx = trunk[Math.max(0, Math.min(trunk.length - 1, Math.round(anchorT * (trunk.length - 1))))];
        const anchor = dots[anchorIdx];
        if (!anchor) continue;
        const leftDominant = hash01(viewportSeed + 4271, p, 0, 0) > 0.18;
        const baseSide = leftDominant ? Math.PI : 0;
        const asymOffset = (p / Math.max(1, primaryCount - 1) - 0.5) * 0.72;
        const angle = baseSide + asymOffset + hashSigned(viewportSeed + 4283, p, 0, 1) * 0.44;
        const len = clamp(Math.min(w, h) * (0.075 + hash01(viewportSeed + 4297, p, 0, 2) * 0.03), 28, 88);
        branchQueue.push({
          parentIdx: anchorIdx,
          x: anchor.x,
          y: anchor.y,
          angle,
          len,
          depth: 1,
          seed: p + 1
        });
      }

      let guard = 0;
      while (branchQueue.length && macroNodes.length < macroNodeTarget && guard++ < macroNodeTarget * 28) {
        const branch = branchQueue.shift();
        if (!branch) continue;
        const distToNucleus = Math.hypot(branch.x - nucleus.x, branch.y - nucleus.y);
        const nucleusInfluence = clamp(1 - distToNucleus / clamp(Math.min(w, h) * 0.22, 90, 176), 0, 1);
        const splitThreshold = 0.64 - nucleusInfluence * 0.26 + branch.depth * 0.06;
        const split = branch.depth < 3 && hash01(viewportSeed + 4327, branch.seed, branch.depth, guard) > splitThreshold ? 2 : 1;

        for (let c = 0; c < split && macroNodes.length < macroNodeTarget; c++) {
          const turnMax = branch.depth <= 1 ? 0.52 : 0.34;
          const turn = hashSigned(viewportSeed + 4339, branch.seed, branch.depth, c) * turnMax;
          let angle = branch.angle + turn;
          const towardNucleus = Math.atan2(nucleus.y - branch.y, nucleus.x - branch.x);
          angle += angleDelta(angle, towardNucleus) * (0.18 + nucleusInfluence * 0.2);
          const decay = clamp(0.62 + hash01(viewportSeed + 4349, branch.seed, branch.depth, c) * 0.2 - branch.depth * 0.04, 0.56, 0.86);
          const len = branch.len * decay;
          const nx = branch.x + Math.cos(angle) * len;
          const ny = branch.y + Math.sin(angle) * len;
          if (!inMacroBounds(nx, ny)) continue;
          const role = branch.depth <= 2 ? 'macro_branch' : 'macro_capillary';
          const order = clamp(branch.depth, 1, 4);
          const idx = addMacroNode(nx, ny, role, order, angle, true);
          if (idx === -1) continue;
          addEdge(branch.parentIdx, idx, 'intra', branch.depth <= 1 ? 'bridge' : 'intra', patternType, order, false);

          if (branch.depth < 4 && len > 11) {
            branchQueue.push({
              parentIdx: idx,
              x: nx,
              y: ny,
              angle,
              len,
              depth: branch.depth + 1,
              seed: branch.seed * 37 + c + 1
            });

            if (
              branch.depth < 3 &&
              nucleusInfluence > 0.2 &&
              hash01(viewportSeed + 4361, branch.seed, c, guard) > (0.58 - nucleusInfluence * 0.2)
            ) {
              const sideTurn = (hash01(viewportSeed + 4373, branch.seed, c, guard) > 0.5 ? 1 : -1) * (0.44 + hash01(viewportSeed + 4391, branch.seed, c, 0) * 0.28);
              branchQueue.push({
                parentIdx: idx,
                x: nx,
                y: ny,
                angle: angle + sideTurn,
                len: len * 0.84,
                depth: branch.depth + 1,
                seed: branch.seed * 41 + c + 3
              });
            }
          }
        }
      }

      const loopRadius = clamp(Math.min(w, h) * 0.21, 88, 172);
      const loopDistMin = clamp(Math.min(w, h) * 0.045, 18, 34);
      const loopDistMax = clamp(Math.min(w, h) * 0.11, 38, 82);
      const maxLoops = clamp(Math.floor(macroNodeTarget * 0.1), 3, 6);
      let loopsAdded = 0;
      for (let i = 0; i < macroNodes.length && loopsAdded < maxLoops; i++) {
        const aIdx = macroNodes[i];
        const a = dots[aIdx];
        if (!a) continue;
        if (Math.hypot(a.x - nucleus.x, a.y - nucleus.y) > loopRadius) continue;
        let best = -1;
        let bestScore = Infinity;
        for (let j = i + 1; j < macroNodes.length; j++) {
          const bIdx = macroNodes[j];
          const b = dots[bIdx];
          if (!b) continue;
          if (Math.hypot(b.x - nucleus.x, b.y - nucleus.y) > loopRadius) continue;
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < loopDistMin || dist > loopDistMax) continue;
          const orderGap = Math.abs((a.branchOrder || 0) - (b.branchOrder || 0));
          if (orderGap > 2) continue;
          const angA = macroAngles.get(aIdx) ?? Math.atan2(a.y - nucleus.y, a.x - nucleus.x);
          const angB = macroAngles.get(bIdx) ?? Math.atan2(b.y - nucleus.y, b.x - nucleus.x);
          const orientGap = Math.abs(angleDelta(angA, angB));
          if (orientGap < 0.38 || orientGap > 1.95) continue;
          const radialGap = Math.abs(
            angleDelta(
              Math.atan2(a.y - nucleus.y, a.x - nucleus.x),
              Math.atan2(b.y - nucleus.y, b.x - nucleus.x)
            )
          );
          if (radialGap > 1.8) continue;
          const score = dist + orderGap * 8 + Math.abs(orientGap - 1.1) * 12;
          if (score < bestScore) {
            bestScore = score;
            best = bIdx;
          }
        }
        if (best >= 0 && addEdge(aIdx, best, 'intra', 'bridge', patternType, 2, false)) {
          if (dots[aIdx]) dots[aIdx].patternRole = 'macro_loop';
          if (dots[best]) dots[best].patternRole = 'macro_loop';
          loopsAdded++;
        }
      }

      return { nodes: macroNodes, nodeSet: macroNodeSet, layer, rootIdx, nucleusIdx, center: structureCenter, nucleus };
    }

    buildLattice();
    buildBorderScaffold(0, 'molecular_lattice', 'lattice_border_junction', 2381);

    growBranches({
      layer: 1,
      patternType: 'mycelial_network',
      rootCount: clamp(Math.floor((w + h) / 560), 5, 9),
      rootRole: 'mycelium_root',
      branchRole: 'hypha_branch',
      tipRole: 'hypha_tip',
      xStart: 0.08, xStep: 0.61803398875, xShift: 0, xSpan: 0.84,
      yStart: 0.10, yStep: 0.41421356237, yShift: 0.27, ySpan: 0.8,
      rootBranches: 2,
      baseAngle: 0,
      rootJitter: Math.PI,
      lMin: clamp(Math.min(w, h) * 0.08, 34, 68),
      lMax: clamp(Math.min(w, h) * 0.11, 50, 90),
      splitDepth: 1,
      splitThreshold: 0.72,
      turnDepth: 2,
      turnMax: 0.9,
      decayMin: 0.68,
      decayMax: 0.84,
      depthMax: 4,
      roleCut: 2,
      bridgePrimary: true,
      minSeg: 18,
      boundMargin: 8,
      guard: 920,
      sA: 2309, sB: 2321, sC: 2333, sD: 2347, sE: 2371
    });
    buildBorderScaffold(1, 'mycelial_network', 'hypha_border_branch', 2861);

    buildLeaf();

    growBranches({
      layer: 3,
      patternType: 'capillary_tree',
      rootCount: clamp(Math.floor(w / 420), 4, 6),
      rootRole: 'arteriole_root',
      branchRole: 'capillary_branch',
      tipRole: 'capillary_tip',
      xStart: 0.06, xStep: 0.346, xShift: 0.11, xSpan: 0.88,
      yStart: 0.08, yStep: 0.521, yShift: 0.21, ySpan: 0.84,
      rootBranches: 2,
      baseAngle: 0.2,
      rootJitter: 1.2,
      lMin: clamp(Math.min(w, h) * 0.065, 30, 58),
      lMax: clamp(Math.min(w, h) * 0.1, 46, 86),
      splitDepth: 1,
      splitThreshold: 0.62,
      turnDepth: 2,
      turnMax: 0.55,
      decayMin: 0.66,
      decayMax: 0.83,
      depthMax: 4,
      roleCut: 2,
      bridgePrimary: true,
      minSeg: 14,
      boundMargin: 12,
      guard: 920,
      sA: 2903, sB: 2917, sC: 3011, sD: 3023, sE: 3041
    });

    const soma = growBranches({
      layer: 4,
      patternType: 'neural_arbor',
      rootCount: clamp(Math.floor(w / 560) + 3, 4, 6),
      rootRole: 'soma',
      branchRole: 'dendrite_branch',
      tipRole: 'synapse_tip',
      xStart: 0.14, xStep: 0.7548776662, xShift: 0, xSpan: 0.72,
      yStart: 0.20, yStep: 0.5698402909, yShift: 0.31, ySpan: 0.62,
      rootBranches: 5,
      baseAngle: 0,
      rootJitter: 0.22,
      lMin: clamp(Math.min(w, h) * 0.07, 30, 62),
      lMax: clamp(Math.min(w, h) * 0.09, 42, 92),
      splitDepth: 2,
      splitThreshold: 0.48,
      turnDepth: 1,
      turnMax: 0.62,
      decayMin: 0.64,
      decayMax: 0.84,
      depthMax: 4,
      roleCut: 1,
      bridgePrimary: true,
      minSeg: 12,
      boundMargin: 10,
      guard: 960,
      sA: 3203, sB: 3217, sC: 3229, sD: 3251, sE: 3271
    });

    for (let i = 0; i < soma.length; i++) {
      const a = soma[i];
      const ad = dots[a];
      if (!ad) continue;
      let best = -1;
      let bestDist = Infinity;
      for (let j = 0; j < soma.length; j++) {
        if (i === j) continue;
        const b = soma[j];
        const bd = dots[b];
        if (!bd) continue;
        const dist = Math.hypot(ad.x - bd.x, ad.y - bd.y);
        if (dist < bestDist) {
          bestDist = dist;
          best = b;
        }
      }
      if (best >= 0 && bestDist < clamp(Math.min(w, h) * 0.34, 140, 280)) {
        addEdge(a, best, 'intra', 'backbone', 'neural_arbor', 0, true);
      }
    }

    const macro = buildMacroAsymmetricVascular();
    if (macro.nodes.length > 0) {
      const macroLayer = macro.layer;
      const macroSet = macro.nodeSet;
      const sameLayerConnectDist = clamp(Math.min(w, h) * 0.22, 92, 164);
      const sourceCandidates = [];
      if (macro.nucleusIdx >= 0) sourceCandidates.push(macro.nucleusIdx);
      if (macro.rootIdx >= 0 && macro.rootIdx !== macro.nucleusIdx) sourceCandidates.push(macro.rootIdx);

      for (let s = 0; s < sourceCandidates.length && s < 2; s++) {
        const sourceIdx = sourceCandidates[s];
        const source = dots[sourceIdx];
        if (!source) continue;
        let best = -1;
        let bestScore = Infinity;
        const sameLayer = layerNodes[macroLayer] || [];
        for (let i = 0; i < sameLayer.length; i++) {
          const targetIdx = sameLayer[i];
          if (macroSet.has(targetIdx) || targetIdx === sourceIdx) continue;
          const target = dots[targetIdx];
          if (!target) continue;
          const dist = Math.hypot(source.x - target.x, source.y - target.y);
          if (dist > sameLayerConnectDist) continue;
          const score = dist + Math.abs((source.branchOrder || 0) - (target.branchOrder || 0)) * 5;
          if (score < bestScore) {
            bestScore = score;
            best = targetIdx;
          }
        }
        if (best >= 0) {
          addEdge(sourceIdx, best, 'intra', 'bridge', 'macro_vascular_fan', 1, false);
        }
      }

      const adjacentLayer = macroLayer + 1 < layerCount ? macroLayer + 1 : macroLayer - 1;
      if (adjacentLayer >= 0 && macro.nucleusIdx >= 0) {
        const source = dots[macro.nucleusIdx];
        if (source) {
          let best = -1;
          let bestDist = Infinity;
          const bridgeDistCap = clamp(Math.min(w, h) * 0.2, 84, 154);
          const candidates = layerNodes[adjacentLayer] || [];
          for (let i = 0; i < candidates.length; i++) {
            const targetIdx = candidates[i];
            const target = dots[targetIdx];
            if (!target) continue;
            const dist = Math.hypot(source.x - target.x, source.y - target.y);
            if (dist < bestDist) {
              bestDist = dist;
              best = targetIdx;
            }
          }
          if (best >= 0 && bestDist <= bridgeDistCap) {
            addEdge(macro.nucleusIdx, best, 'crossLayer', 'bridge', 'macro_vascular_fan', 1, false);
          }
        }
      }
    }

    connectNear(layerNodes[0], layerNodes[1], clamp(Math.min(w, h) * 0.16, 56, 116), 3407, 0.34);
    connectNear(layerNodes[1], layerNodes[2], clamp(Math.min(w, h) * 0.17, 60, 122), 3433, 0.3);
    connectNear(layerNodes[2], layerNodes[3], clamp(Math.min(w, h) * 0.17, 60, 124), 3457, 0.28);
    connectNear(layerNodes[3], layerNodes[4], clamp(Math.min(w, h) * 0.18, 64, 132), 3491, 0.3);

    function pickKey(layer) {
      const nodes = layerNodes[layer];
      let best = -1;
      let score = -Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const idx = nodes[i];
        const d = dots[idx];
        if (!d) continue;
        const s = rWeight(d.patternRole) * 1.4 + d.importance * 0.9 + d.depthNorm * 0.3;
        if (s > score) {
          score = s;
          best = idx;
        }
      }
      return best;
    }

    const k0 = pickKey(0);
    const k1 = pickKey(1);
    const k2 = pickKey(2);
    const k3 = pickKey(3);
    const k4 = pickKey(4);
    const backboneChainCap = clamp(Math.min(w, h) * 0.2, 92, 172);
    if (k0 >= 0 && k1 >= 0 && Math.hypot(dots[k0].x - dots[k1].x, dots[k0].y - dots[k1].y) <= backboneChainCap) addEdge(k0, k1, 'backbone', 'backbone', 'hybrid_backbone', 0, true);
    if (k1 >= 0 && k2 >= 0 && Math.hypot(dots[k1].x - dots[k2].x, dots[k1].y - dots[k2].y) <= backboneChainCap) addEdge(k1, k2, 'backbone', 'backbone', 'hybrid_backbone', 0, true);
    if (k2 >= 0 && k3 >= 0 && Math.hypot(dots[k2].x - dots[k3].x, dots[k2].y - dots[k3].y) <= backboneChainCap) addEdge(k2, k3, 'backbone', 'backbone', 'hybrid_backbone', 0, true);
    if (k3 >= 0 && k4 >= 0 && Math.hypot(dots[k3].x - dots[k4].x, dots[k3].y - dots[k4].y) <= backboneChainCap) addEdge(k3, k4, 'backbone', 'backbone', 'hybrid_backbone', 0, true);

    const degree0 = new Array(dots.length).fill(0);
    for (let i = 0; i < edges.length; i++) {
      degree0[edges[i].aIdx]++;
      degree0[edges[i].bIdx]++;
    }

    const MAX_ISOLATED_CROSSLAYER_FALLBACK = 6;
    let isolatedCrossLayerFallbackCount = 0;
    const isolatedCrossLayerFallbackDist = clamp(Math.min(w, h) * 0.16, 68, 124);

    for (let i = 0; i < dots.length; i++) {
      if (degree0[i] > 0) continue;
      const a = dots[i];
      if (!a) continue;
      let bestSame = -1;
      let bestSameDist = Infinity;
      let bestCross = -1;
      let bestCrossDist = Infinity;
      for (let j = 0; j < dots.length; j++) {
        if (i === j) continue;
        const b = dots[j];
        if (!b) continue;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (a.layer === b.layer) {
          if (dist < bestSameDist) {
            bestSameDist = dist;
            bestSame = j;
          }
        } else if (dist < bestCrossDist) {
          bestCrossDist = dist;
          bestCross = j;
        }
      }
      if (bestSame >= 0) {
        addEdge(i, bestSame, 'intra', 'intra', a.patternType, Math.max(a.branchOrder || 0, dots[bestSame].branchOrder || 0), false);
        continue;
      }
      if (
        bestCross >= 0 &&
        isolatedCrossLayerFallbackCount < MAX_ISOLATED_CROSSLAYER_FALLBACK &&
        bestCrossDist <= isolatedCrossLayerFallbackDist
      ) {
        const added = addEdge(i, bestCross, 'crossLayer', 'bridge', a.patternType, Math.max(a.branchOrder || 0, dots[bestCross].branchOrder || 0), false);
        if (added) isolatedCrossLayerFallbackCount++;
      }
    }

    farConnectDist = clamp(Math.hypot(w, h) * 0.62, CONNECT_DIST * 1.15, Math.max(MAX_CONNECTION_DIST, CONNECT_DIST * 2.2));
    farConnectDistSq = farConnectDist * farConnectDist;

    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const a = dots[e.aIdx];
      const b = dots[e.bIdx];
      if (!a || !b) continue;
      const dist = e.dist;
      const layerGap = Math.abs(a.layer - b.layer);
      let kind = 'near';
      if (e.relationType === 'backbone' || layerGap >= 2 || dist > CONNECT_DIST * 1.06) kind = 'bridge';
      if (dist > CONNECT_DIST * 1.45 && e.relationType !== 'backbone') kind = 'far';
      const linkType = e.linkTypeHint === 'backbone' || e.relationType === 'backbone' ? 'backbone' : (layerGap >= 1 || e.relationType === 'crossLayer') ? 'bridge' : 'intra';
      const depthWeight = (a.depthNorm + b.depthNorm) * 0.5;
      const avgZone = (a.zoneWeight + b.zoneWeight) * 0.5;
      const distNorm = dist / Math.max(1, CONNECT_DIST);
      const relBoost = e.relationType === 'backbone' ? 1.46 : e.relationType === 'crossLayer' ? 1.24 : 1.09;

      let baseAlpha = 0;
      let minAlpha = 0.00045;
      let maxAlpha = 0.016;
      if (kind === 'near') {
        baseAlpha = (0.0195 + (1 - avgZone) * 0.039) * clamp(1.14 - distNorm * 0.58, 0.24, 1.22);
        minAlpha = 0.0022;
        maxAlpha = 0.068;
      } else if (kind === 'bridge') {
        baseAlpha = (0.0113 + (1 - avgZone) * 0.0282) * clamp(1.3 - distNorm * 0.42, 0.18, 1.08);
        minAlpha = 0.0011;
        maxAlpha = 0.032;
      } else {
        baseAlpha = (0.0055 + (1 - avgZone) * 0.0170) * clamp(1.22 - distNorm * 0.3, 0.08, 0.86);
      }
      baseAlpha *= relBoost * (0.68 + depthWeight * 0.62);
      minAlpha *= relBoost * 1.16;
      maxAlpha *= relBoost * 1.16;

      const lineIdx = staticLines.length;
      staticLines.push({
        a,
        b,
        aIdx: e.aIdx,
        bIdx: e.bIdx,
        lineIdx,
        dist,
        layerMix: (a.layer + b.layer) * 0.5,
        layerGap,
        depthWeight,
        baseAlpha,
        distanceFade: kind === 'near' ? 1 : Math.max(0.08, 1 - dist / Math.max(farConnectDist, 1)),
        phase: hash01(viewportSeed + 3607, e.aIdx, e.bIdx, lineIdx) * Math.PI * 2,
        kind,
        linkType,
        scaffoldBias: e.relationType === 'backbone' ? 1 : e.relationType === 'crossLayer' ? 0.68 : 0.34,
        scaffoldBackbone: e.relationType === 'backbone',
        sameCluster: a.layer === b.layer,
        interCluster: a.layer !== b.layer,
        heroLineTier: 'normal',
        heroAlphaScale: 1,
        heroCrispScale: 1,
        heroFaded: false,
        heroFadeScale: 1,
        heroFadeCrispScale: 1,
        lineImportance: 0,
        crossingScore: 0,
        lineWidthSeed: hash01(viewportSeed + 3631, e.aIdx, e.bIdx, 19),
        widthBias: 0.2,
        energyGain: linkType === 'backbone' ? 1.22 : linkType === 'bridge' ? 1.08 : 1,
        energy: 0,
        minAlpha,
        maxAlpha,
        segmentIdx: -1,
        intro: null,
        patternType: e.patternType,
        relationType: e.relationType,
        branchOrder: e.branchOrder || 0
      });
    }

    nodeDegrees = new Array(dots.length).fill(0);
    nodeAdjacency = new Array(dots.length);
    for (let i = 0; i < dots.length; i++) nodeAdjacency[i] = [];
    lineAdjacency = new Array(staticLines.length);
    for (let i = 0; i < staticLines.length; i++) lineAdjacency[i] = [];

    for (let i = 0; i < staticLines.length; i++) {
      const line = staticLines[i];
      nodeDegrees[line.aIdx]++;
      nodeDegrees[line.bIdx]++;
      nodeAdjacency[line.aIdx].push({ lineIdx: i, nodeIdx: line.bIdx, kind: line.kind, linkType: line.linkType });
      nodeAdjacency[line.bIdx].push({ lineIdx: i, nodeIdx: line.aIdx, kind: line.kind, linkType: line.linkType });
    }

    for (let i = 0; i < staticLines.length; i++) {
      const line = staticLines[i];
      const neighbors = new Set();
      const aEdges = nodeAdjacency[line.aIdx] || [];
      const bEdges = nodeAdjacency[line.bIdx] || [];
      for (let j = 0; j < aEdges.length; j++) if (aEdges[j].lineIdx !== i) neighbors.add(aEdges[j].lineIdx);
      for (let j = 0; j < bEdges.length; j++) if (bEdges[j].lineIdx !== i) neighbors.add(bEdges[j].lineIdx);
      lineAdjacency[i] = Array.from(neighbors);
    }

    const maxDegree = Math.max(1, ...nodeDegrees);
    const bridgeCounts = new Array(dots.length).fill(0);
    for (let i = 0; i < staticLines.length; i++) {
      const line = staticLines[i];
      if (line.linkType === 'backbone' || line.linkType === 'bridge') {
        bridgeCounts[line.aIdx]++;
        bridgeCounts[line.bIdx]++;
      }
    }
    const maxBridge = Math.max(1, ...bridgeCounts);

    nodeCentralityScores = new Array(dots.length).fill(0);
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      if (!d) continue;
      const c = clamp((nodeDegrees[i] / maxDegree) * 0.52 + (bridgeCounts[i] / maxBridge) * 0.3 + rWeight(d.patternRole) * 0.18, 0, 1);
      nodeCentralityScores[i] = c;
      d.centrality = c;
    }

    for (let i = 0; i < staticLines.length; i++) {
      const line = staticLines[i];
      const rel = line.relationType === 'backbone' ? 0.34 : line.relationType === 'crossLayer' ? 0.18 : 0.06;
      line.lineImportance = clamp((nodeCentralityScores[line.aIdx] + nodeCentralityScores[line.bIdx]) * 0.42 + clamp(line.layerGap / Math.max(1, layerCount - 1), 0, 1) * 0.22 + rel, 0, 1);
      line.widthBias = clamp(line.lineImportance * 0.8 + (line.linkType === 'backbone' ? 0.24 : line.linkType === 'bridge' ? 0.1 : 0) + Math.min(4, line.branchOrder || 0) * 0.04, 0.08, 1.45);
    }

    for (let i = 0; i < dots.length; i++) {
      dots[i].role = 'base';
      dots[i].isStar = false;
    }

    const ranked = dots
      .map((d, idx) => ({ idx, score: (nodeDegrees[idx] || 0) * 1.32 + (nodeCentralityScores[idx] || 0) * 1.8 + rWeight(d.patternRole) * 1.1 + d.depthNorm * 0.46 }))
      .sort((a, b) => b.score - a.score || a.idx - b.idx);

    const hubTarget = clamp(Math.floor(dots.length * 0.082), 7, 24);
    const relayTarget = clamp(Math.floor(dots.length * 0.27), 18, Math.floor(dots.length * 0.42));

    for (let i = 0; i < ranked.length && hubNodeIndices.length < hubTarget; i++) {
      const idx = ranked[i].idx;
      const d = dots[idx];
      if (!d) continue;
      const qualifies = rWeight(d.patternRole) > 0.72 || (nodeDegrees[idx] || 0) >= 4 || d.patternRole === 'soma' || d.patternRole === 'midrib_origin' || d.patternRole === 'arteriole_root';
      if (!qualifies) continue;
      d.role = 'hub';
      d.r *= 1.46;
      d.baseAlpha *= 1.54;
      d.twinkleSpeed *= 1.2;
      hubNodeIndices.push(idx);
    }

    const hubSet = new Set(hubNodeIndices);
    for (let i = 0; i < ranked.length && relayNodeIndices.length < relayTarget; i++) {
      const idx = ranked[i].idx;
      if (hubSet.has(idx)) continue;
      const d = dots[idx];
      if (!d) continue;
      const qualifies = (nodeDegrees[idx] || 0) >= 3 || rWeight(d.patternRole) > 0.54 || d.patternRole.indexOf('branch') >= 0 || d.patternRole.indexOf('junction') >= 0;
      if (!qualifies) continue;
      d.role = 'relay';
      d.r *= 1.22;
      d.baseAlpha *= 1.26;
      relayNodeIndices.push(idx);
    }

    const starCount = clamp(Math.floor(dots.length * 0.14), 12, Math.floor(dots.length * 0.2));
    const heroStarCap = Math.max(2, Math.floor(starCount * 0.22));
    const starRanked = dots
      .map((d, idx) => ({ idx, score: (nodeCentralityScores[idx] || 0) * 1.84 + d.depthNorm * 0.62 + d.importance * 0.44 + (d.role === 'hub' ? 0.9 : d.role === 'relay' ? 0.52 : 0) + (1 - d.zoneWeight) * 0.28 }))
      .sort((a, b) => b.score - a.score || a.idx - b.idx);

    let starsAssigned = 0;
    let heroStarsAssigned = 0;
    for (let i = 0; i < starRanked.length && starsAssigned < starCount; i++) {
      const d = dots[starRanked[i].idx];
      if (!d) continue;
      const inHero = d.zoneWeight >= HERO_ZONE_THRESHOLD;
      if (inHero && heroStarsAssigned >= heroStarCap) continue;
      d.isStar = true;
      starsAssigned++;
      if (inHero) heroStarsAssigned++;
      if (d.role === 'hub') {
        d.r = Math.max(d.r, 1.62);
        d.baseAlpha = Math.max(d.baseAlpha, 0.038);
      } else if (d.role === 'relay') {
        d.r = Math.max(d.r, 1.3);
        d.baseAlpha = Math.max(d.baseAlpha, 0.028);
      } else {
        d.r = Math.max(d.r, 0.92);
        d.baseAlpha = Math.max(d.baseAlpha, 0.018);
      }
    }

    refreshRenderBudgets();
    buildIntroMetadata();
    createCurvedBridgeArcs();
    createNoiseSpecks();
  }
  placeDots();
  resetPulseTransport();
  createGrainTile();

  canvasActive = w > 768;
  introState = canRunIntro() ? 'armed' : 'complete';
  introAutoStartAt = performance.now() + 2200;
  if (introState === 'complete') {
    saveIntroDoneFlag();
  }
  function _onNetworkIntro() {
    introRequested = true;
    if (introState === 'armed') {
      startIntro(performance.now());
    }
  }
  window.addEventListener(NETWORK_INTRO_EVENT, _onNetworkIntro);

  function _onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      syncClarityZone(1);
      placeDots();
      resetPulseTransport();
      createGrainTile();
      canvasActive = w > 768;
      if (canvasActive) {
        startAnimationWhenReady();
      } else {
        animationStarted = false;
      }
      if (introState !== 'complete') {
        introState = canRunIntro() ? 'armed' : 'complete';
        introAutoStartAt = performance.now() + 900;
      }
    }, 150);
  }
  window.addEventListener('resize', _onResize);

  function _onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouseActive = true;
    lastMouseMove = performance.now();
  }
  document.addEventListener('mousemove', _onMouseMove);

  function _onMouseLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
    mouseActive = false;
  }
  document.addEventListener('mouseleave', _onMouseLeave);

  function drawImageCover(targetCtx, image, destW, destH, scale = 1) {
    const iw = image.naturalWidth || image.width;
    const ih = image.naturalHeight || image.height;
    if (!iw || !ih) return;
    const ratio = Math.max(destW / iw, destH / ih) * scale;
    const drawW = iw * ratio;
    const drawH = ih * ratio;
    const dx = (destW - drawW) * 0.5;
    const dy = (destH - drawH) * 0.5;
    targetCtx.drawImage(image, dx, dy, drawW, drawH);
  }

  function getAuroraCanvas() {
    if (auroraCanvas) return auroraCanvas;
    auroraCanvas = document.createElement('canvas');
    auroraCanvas.width = w;
    auroraCanvas.height = h;
    const actx = auroraCanvas.getContext('2d');
    const bgImg = new Image();
    bgImg.onload = function() {
      actx.clearRect(0, 0, w, h);
      actx.imageSmoothingEnabled = true;
      actx.imageSmoothingQuality = 'high';
      actx.save();
      actx.globalAlpha = 0.17;
      actx.filter = 'blur(24px) saturate(1.1)';
      drawImageCover(actx, bgImg, w, h, 1.08);
      actx.restore();

      actx.save();
      actx.globalAlpha = 0.35;
      actx.filter = 'blur(7px) brightness(0.58) contrast(1.11) saturate(1.04)';
      drawImageCover(actx, bgImg, w, h, 1.02);
      actx.restore();

      actx.save();
      actx.globalCompositeOperation = 'multiply';
      const depth = actx.createLinearGradient(0, 0, 0, h);
      depth.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      depth.addColorStop(0.38, 'rgba(0, 0, 0, 0.66)');
      depth.addColorStop(0.72, 'rgba(0, 0, 0, 0.74)');
      depth.addColorStop(1, 'rgba(0, 0, 0, 0.86)');
      actx.fillStyle = depth;
      actx.fillRect(0, 0, w, h);
      actx.restore();

      actx.save();
      const vignette = actx.createRadialGradient(w * 0.5, h * 0.45, h * 0.10, w * 0.5, h * 0.5, Math.max(w, h) * 0.78);
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.56, 'rgba(0, 0, 0, 0.28)');
      vignette.addColorStop(0.82, 'rgba(0, 0, 0, 0.5)');
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.66)');
      actx.fillStyle = vignette;
      actx.fillRect(0, 0, w, h);
      actx.restore();

      actx.save();
      actx.globalCompositeOperation = 'screen';
      const heroBloom = actx.createRadialGradient(w * 0.5, h * 0.38, 0, w * 0.5, h * 0.38, w * 0.48);
      heroBloom.addColorStop(0, 'rgba(242, 242, 242, 0.028)');
      heroBloom.addColorStop(0.33, 'rgba(242, 242, 242, 0.012)');
      heroBloom.addColorStop(0.7, 'rgba(242, 242, 242, 0.004)');
      heroBloom.addColorStop(1, 'transparent');
      actx.fillStyle = heroBloom;
      actx.fillRect(0, 0, w, h);
      actx.restore();

      actx.save();
      actx.globalCompositeOperation = 'screen';
      const topGlow = actx.createRadialGradient(w * 0.48, h * 0.16, 0, w * 0.48, h * 0.16, w * 0.72);
      topGlow.addColorStop(0, 'rgba(242, 242, 242, 0.045)');
      topGlow.addColorStop(0.52, 'rgba(242, 242, 242, 0.015)');
      topGlow.addColorStop(1, 'transparent');
      actx.fillStyle = topGlow;
      actx.fillRect(0, 0, w, h);
      actx.restore();

      actx.save();
      actx.globalCompositeOperation = 'screen';
      const lowerSoftLift = actx.createLinearGradient(0, h * 0.42, 0, h);
      lowerSoftLift.addColorStop(0, 'rgba(242, 242, 242, 0)');
      lowerSoftLift.addColorStop(0.62, 'rgba(242, 242, 242, 0.01)');
      lowerSoftLift.addColorStop(1, 'rgba(242, 242, 242, 0.02)');
      actx.fillStyle = lowerSoftLift;
      actx.fillRect(0, 0, w, h);
      actx.restore();

      actx.save();
      actx.globalCompositeOperation = 'multiply';
      const edgeContrast = actx.createRadialGradient(w * 0.5, h * 0.44, Math.min(w, h) * 0.16, w * 0.5, h * 0.5, Math.max(w, h) * 0.82);
      edgeContrast.addColorStop(0, 'rgba(0, 0, 0, 0)');
      edgeContrast.addColorStop(0.6, 'rgba(0, 0, 0, 0.055)');
      edgeContrast.addColorStop(1, 'rgba(0, 0, 0, 0.14)');
      actx.fillStyle = edgeContrast;
      actx.fillRect(0, 0, w, h);
      actx.restore();

      drawAuroraGradients();
    };

    (function() {
      const candidateSources = [];
      try {
        const testCanvas = document.createElement('canvas');
        if (testCanvas.getContext && testCanvas.getContext('2d')) {
          const avifSupported = testCanvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
          const webpSupported = testCanvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
          if (avifSupported) candidateSources.push(basePath + '/images/cw-meta.avif');
          if (webpSupported) candidateSources.push(basePath + '/images/cw-meta.webp');
        }
      } catch (_) {
        // Ignore codec detection issues and rely on fallback list below.
      }
      candidateSources.push(basePath + '/images/cw-meta.webp', basePath + '/images/cw-meta.jpg');

      let sourceIndex = 0;
      const tryNextSource = () => {
        if (sourceIndex >= candidateSources.length) {
          drawAuroraGradients();
          return;
        }
        bgImg.src = candidateSources[sourceIndex++];
      };

      bgImg.onerror = tryNextSource;
      tryNextSource();
    })();

    function drawAuroraGradients() {
      const x1 = w * 0.25;
      const y1 = h * 0.2;
      const x2 = w * 0.75;
      const y2 = h * 0.75;
      const x3 = w * 0.5;
      const y3 = h * 0.5;

      const g1 = actx.createRadialGradient(x1, y1, 0, x1, y1, w * 0.5);
      g1.addColorStop(0, fxPalette.auroraBlueStrong);
      g1.addColorStop(0.45, fxPalette.auroraBlueSoft);
      g1.addColorStop(1, 'transparent');
      actx.fillStyle = g1;
      actx.fillRect(0, 0, w, h);

      const g2 = actx.createRadialGradient(x2, y2, 0, x2, y2, w * 0.45);
      g2.addColorStop(0, fxPalette.auroraPurpleStrong);
      g2.addColorStop(0.45, fxPalette.auroraPinkSoft);
      g2.addColorStop(1, 'transparent');
      actx.fillStyle = g2;
      actx.fillRect(0, 0, w, h);

      const g3 = actx.createRadialGradient(x3, y3, 0, x3, y3, w * 0.35);
      g3.addColorStop(0, fxPalette.auroraBlueCenter);
      g3.addColorStop(0.54, 'rgba(242, 242, 242, 0.004)');
      g3.addColorStop(1, 'transparent');
      actx.fillStyle = g3;
      actx.fillRect(0, 0, w, h);
    }

    return auroraCanvas;
  }

  function drawNoiseSpecks(t, quality = 1, calmMode = false) {
    ctx.fillStyle = 'rgb(242, 242, 242)';
    const stride = quality < 0.55 ? 3 : quality < 0.75 ? 2 : 1;
    for (let i = 0; i < noiseSpecks.length; i += stride) {
      const speck = noiseSpecks[i];
      const zoneWeight = computeZoneWeightAt(speck.x, speck.y);
      const driftScale = 1 - zoneWeight * 0.84;
      const sx = speck.x + Math.sin(t * speck.speed + speck.phaseX + scrollY * 0.00008) * speck.driftAmp * driftScale;
      const sy = speck.y + Math.cos(t * (speck.speed * 0.88) + speck.phaseY + scrollY * 0.00006) * speck.driftAmp * driftScale;
      const alpha = speck.alpha * (0.55 + driftScale * 0.85) * (calmMode ? 0.62 : 1) * (0.74 + quality * 0.34);
      if (alpha < 0.005) continue;
      ctx.globalAlpha = alpha;
      ctx.fillRect(sx, sy, speck.size, speck.size);
    }
    ctx.globalAlpha = 1;
  }

  function animate() {
    animationRaf = 0;
    if (!canvasActive || document.hidden) {
      animationStarted = false;
      return;
    }
    animationStarted = true;
    frameCount++;
    const t = performance.now();
    const frameDelta = Math.min(MAX_FRAME_DELTA, Math.max(8, t - lastFrameTime || 16.7));
    lastFrameTime = t;
    frameDeltaSmoothed = frameDeltaSmoothed * 0.9 + frameDelta * 0.1;

    if (prefersReducedMotion) {
      qualityLevel = Math.max(0.6, qualityLevel - 0.006);
    } else if (frameDeltaSmoothed > 27) {
      qualityLevel = Math.max(QUALITY_MIN, qualityLevel - 0.06);
    } else if (frameDeltaSmoothed > 23) {
      qualityLevel = Math.max(QUALITY_MIN, qualityLevel - 0.03);
    } else if (frameDeltaSmoothed < 17.8) {
      qualityLevel = Math.min(QUALITY_MAX, qualityLevel + 0.02);
    }
    updateIntroLifecycle(t);

    const introAnimating = isIntroActive() || (introState === 'armed' && introRequested);
    const interactionHot =
      introAnimating ||
      mouseActive ||
      scrollEnergy > 0.1 ||
      t - lastMouseMove < INTERACTION_ACTIVE_WINDOW_MS;
    const stressedFrame = frameDeltaSmoothed > 24 || qualityLevel < 0.68;
    const targetFps = prefersReducedMotion
      ? FPS_STRESSED
      : interactionHot
        ? FPS_ACTIVE
        : stressedFrame
          ? FPS_STRESSED
          : FPS_IDLE;
    const minFrameInterval = 1000 / targetFps;
    if (lastRenderedFrameAt && t - lastRenderedFrameAt < minFrameInterval) {
      animationRaf = requestAnimationFrame(animate);
      return;
    }
    lastRenderedFrameAt = t;

    const calmMode = prefersReducedMotion;
    const motionScale = calmMode ? 0.38 : 0.78 + qualityLevel * 0.22;
    const lowDetailMode = calmMode || qualityLevel < DETAIL_QUALITY_LOW;
    const mediumDetailMode = !lowDetailMode && qualityLevel < DETAIL_QUALITY_MED;
    scrollEnergy = Math.max(0, scrollEnergy - (calmMode ? 0.026 : 0.012));
    syncClarityZone(calmMode ? 0.055 : 0.08);
    const passiveScene =
      !introAnimating &&
      !mouseActive &&
      scrollEnergy < (calmMode ? 0.06 : 0.12) &&
      t - lastMouseMove > (calmMode ? 140 : 220);
    const heavyCullLevel = passiveScene ? renderBudgets.heavyCullLevel : 0;
    const renderTemporalLight = heavyCullLevel < 2 || qualityLevel > 0.86;
    const renderDepthLayers = heavyCullLevel === 0 || qualityLevel > 0.84;
    const renderBridgeArcs = heavyCullLevel === 0 || qualityLevel > 0.86;
    const renderEnergyPass = heavyCullLevel < 2 || qualityLevel > 0.82;
    const renderNodeAuraPass = heavyCullLevel < 2 || qualityLevel > 0.84;

    const shouldThrottle = !introAnimating && !mouseActive && scrollEnergy < (calmMode ? 0.03 : 0.08) && t - lastMouseMove > (calmMode ? 180 : 300);
    const throttleDivisor = calmMode
      ? REDUCED_MOTION_FPS_DIVISOR + 2
      : qualityLevel < DETAIL_QUALITY_LOW
        ? 4
        : qualityLevel < DETAIL_QUALITY_MED
          ? 3
          : 2;
    if (shouldThrottle && frameCount % throttleDivisor !== 0) {
      animationRaf = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(getAuroraCanvas(), 0, 0);
    if (renderTemporalLight) drawTemporalLightPass(t, qualityLevel, calmMode);
    drawClarityLight(t, qualityLevel, calmMode);

    if (grainTile && grainPattern) {
      grainOffset.x = (grainOffset.x + (calmMode ? 0.04 : 0.12) * (0.7 + qualityLevel * 0.3)) % grainTile.width;
      grainOffset.y = (grainOffset.y + (calmMode ? 0.02 : 0.06) * (0.7 + qualityLevel * 0.3)) % grainTile.height;
      const grainCull = heavyCullLevel === 2 ? 0.65 : heavyCullLevel === 1 ? 0.82 : 1;
      ctx.save();
      ctx.globalAlpha = (calmMode ? 0.018 : 0.03) * (0.78 + qualityLevel * 0.3) * grainCull;
      ctx.setTransform(1, 0, 0, 1, grainOffset.x, grainOffset.y);
      ctx.fillStyle = grainPattern;
      ctx.fillRect(-grainOffset.x, -grainOffset.y, w, h);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.restore();
    }

    drawNoiseSpecks(t, qualityLevel, calmMode);

    for (let di = 0; di < dots.length; di++) {
      const dot = dots[di];
      const zoneWeight = computeZoneWeightAt(dot.x, dot.y);
      dot.zoneWeight = zoneWeight;
      dot.stability = 0.24 + zoneWeight * 0.76;

      const mdx = mouse.x - dot.x;
      const mdy = mouse.y - dot.y;
      const distSq = mdx * mdx + mdy * mdy;

      const calmFactor = 1 - zoneWeight * 0.8;
      const layerDef = LAYER_DEFS[dot.layer] || LAYER_DEFS[(LAYER_DEFS.length / 2) | 0];
      const driftAmp = dot.baseDriftAmp * calmFactor * motionScale;
      const layerDepth = (dot.depthNorm || 0.5) * 2 - 1;
      const depthInfluence = 0.72 + (dot.depthNorm || 0.5) * 0.66;

      let targetX =
        Math.sin(t * dot.driftSpeed * motionScale + dot.driftPhaseX + scrollY * 0.00007 * calmFactor * motionScale) * driftAmp +
        Math.sin(t * (0.00011 + dot.layer * 0.000021 + layerDef.parallax * 0.000013) * motionScale + dot.driftPhaseY) * layerDepth * 1.25 * depthInfluence * motionScale;
      let targetY =
        Math.cos(t * dot.driftSpeed * 0.9 * motionScale + dot.driftPhaseY + scrollY * 0.00005 * calmFactor * motionScale) * driftAmp * 0.82 +
        Math.cos(t * (0.000095 + layerDef.parallax * 0.00001) * motionScale + dot.driftPhaseX + scrollY * 0.0016 * motionScale) * layerDepth * 0.72 * depthInfluence * motionScale;

      if (mouseActive && distSq < MAGNET_RADIUS_SQ) {
        const dist = Math.sqrt(distSq);
        if (dist > 0.001) {
          const strength = 1 - dist / MAGNET_RADIUS;
          const pullScale = calmMode ? 0.28 : 1;
          const pull = strength * strength * MAGNET_PULL * pullScale * (0.38 + (1 - zoneWeight) * 0.9);
          targetX += (mdx / dist) * pull;
          targetY += (mdy / dist) * pull;
        }
      }

      const springK = (SPRING_K + dot.stability * 0.045) * (calmMode ? 0.8 : 1);
      const springDamp = Math.min(0.92, SPRING_DAMP + dot.stability * 0.07 + (calmMode ? 0.05 : 0));
      const fX = (targetX - dot.offsetX) * springK;
      const fY = (targetY - dot.offsetY) * springK;
      dot.velX = (dot.velX + fX) * springDamp;
      dot.velY = (dot.velY + fY) * springDamp;
      dot.offsetX += dot.velX;
      dot.offsetY += dot.velY;
    }

    updateDotRenderPositions(t);
    drawIntroNodeTrails(qualityLevel);
    decayPulseEnergy(calmMode);
    stepPulseTransport(t, calmMode, lowDetailMode);
    if (renderDepthLayers) {
      drawDepthFog(t, qualityLevel, calmMode);
      drawLayerDepthVeils(t, qualityLevel, calmMode);
    }
    drawTextZoneFalloff(qualityLevel, calmMode);

    ctx.strokeStyle = fxPalette.lineBase;
    const secondaryLineStride =
      (lowDetailMode ? 4 : mediumDetailMode ? 3 : qualityLevel < 0.88 ? 2 : 1) +
      renderBudgets.secondaryStrideBoost +
      (heavyCullLevel > 0 ? 1 : 0);
    for (let i = 0; i < staticLines.length; i++) {
      const line = staticLines[i];
      if (secondaryLineStride > 1 && line.kind !== 'near' && i % secondaryLineStride !== 0) continue;
      const segment = getLineRenderSegment(line, t);
      if (!segment) continue;
      const avgZone = (line.a.zoneWeight + line.b.zoneWeight) * 0.5;
      const driftPulse = 0.72 + Math.sin(t * 0.00042 + line.phase) * 0.28;
      const scrollWave = 0.86 + Math.sin(scrollY * 0.0032 + t * 0.00022 + line.phase) * 0.14;
      const isFar = line.kind === 'far';
      const depthWeight = line.depthWeight || 0.5;
      const depthBand = depthWeight < 0.34 ? 'far' : depthWeight < 0.68 ? 'mid' : 'near';
      if (depthBand === 'far' && (calmMode || qualityLevel < 0.54 || (qualityLevel < 0.72 && i % 2 === 1))) continue;
      if (isFar && qualityLevel < 0.6 && i % 2 === 1) continue;
      const zoneFactor = isFar ? (0.72 + (1 - avgZone) * 0.38) : (0.3 + (1 - avgZone) * 1.06);
      const depthBoost = depthBand === 'far' ? 0.74 : depthBand === 'mid' ? 1 : 1.25;
      const linkBoost = line.linkType === 'backbone' ? 1.3 : line.linkType === 'bridge' ? 1.12 : 1;
      const widthBias = line.widthBias || 0.2;
      const hierarchyAlphaBoost = 0.82 + widthBias * 0.42;
      const textDepthFade = clamp(1 - smoothstep(0.38, 0.94, avgZone) * 0.48, 0.44, 1);
      const motionBoost = clamp(
        1 -
          scrollEnergy * (isFar ? SCROLL_LINE_FADE_FAR : SCROLL_LINE_FADE_NEAR) -
          (line.linkType === 'backbone' ? scrollEnergy * SCROLL_LINE_FADE_BACKBONE_EXTRA : 0),
        0.58,
        1
      );
      const alpha = clamp(
        line.baseAlpha *
          line.distanceFade *
          driftPulse *
          scrollWave *
          zoneFactor *
          motionBoost *
          depthBoost *
          linkBoost *
          hierarchyAlphaBoost *
          textDepthFade *
          (0.72 + qualityLevel * 0.34) *
          (calmMode ? 0.72 : 1) *
          (0.45 + segment.progress * 0.55) *
          1.15,
        0,
        line.maxAlpha
      );
      if (alpha < line.minAlpha) continue;
      ctx.globalAlpha = alpha;
      const depthWidth = depthBand === 'far' ? -0.04 : depthBand === 'near' ? 0.1 : 0;
      const linkWidth = line.linkType === 'backbone' ? 0.18 : line.linkType === 'bridge' ? 0.08 : 0;
      const hierarchyWidth = widthBias * (isFar ? 0.12 : 0.24);
      ctx.lineWidth = (isFar ? 0.19 : line.kind === 'bridge' ? 0.3 : 0.38) + line.layerMix * 0.07 + depthWidth + linkWidth + hierarchyWidth;
      ctx.beginPath();
      ctx.moveTo(segment.sx, segment.sy);
      ctx.lineTo(segment.ex, segment.ey);
      ctx.stroke();
    }

    if (renderBridgeArcs) {
      const arcQuality = clamp(
        qualityLevel - renderBudgets.arcQualityPenalty - heavyCullLevel * 0.08,
        QUALITY_MIN,
        QUALITY_MAX
      );
      drawCurvedBridgeArcs(t, arcQuality, calmMode);
    }

    ctx.strokeStyle = 'rgba(242, 242, 242, 1)';
    const crispStride = (lowDetailMode ? 2 : 1) + renderBudgets.crispStrideBoost + (heavyCullLevel === 2 ? 1 : 0);
    for (let i = 0; i < staticLines.length; i += crispStride) {
      const line = staticLines[i];
      if (line.kind === 'far' && line.linkType !== 'backbone') continue;
      const segment = getLineRenderSegment(line, t);
      if (!segment) continue;
      const avgZone = (line.a.zoneWeight + line.b.zoneWeight) * 0.5;
      if (avgZone < STRUCTURE_START) continue;
      const depthWeight = line.depthWeight || 0.5;
      if (depthWeight < 0.28 && line.linkType !== 'backbone') continue;
      const structureT = smoothstep(STRUCTURE_START, STRUCTURE_FULL, avgZone);
      const distanceT = 1 - line.dist / CONNECT_DIST;
      const linkBoost = line.linkType === 'backbone' ? 1.34 : line.linkType === 'bridge' ? 1.1 : 1;
      const crispTextFade = clamp(1 - smoothstep(0.4, 0.94, avgZone) * 0.52, 0.42, 1);
      const widthBias = line.widthBias || 0.2;
      const crispAlpha =
        (0.009 + structureT * 0.075) *
        (0.62 + distanceT * 0.4) *
        (0.72 + qualityLevel * 0.34) *
        (0.78 + depthWeight * 0.4) *
        linkBoost *
        (0.8 + widthBias * 0.38) *
        crispTextFade *
        (line.heroCrispScale || 1) *
        (line.heroFadeCrispScale || 1) *
        (calmMode ? 0.72 : 1) *
        (0.5 + segment.progress * 0.5) *
        clamp(1 - scrollEnergy * SCROLL_CRISP_FADE, 0.62, 1) *
        1.11;
      ctx.globalAlpha = crispAlpha;
      ctx.lineWidth = 0.62 + structureT * 0.44 + line.layerMix * 0.08 + widthBias * 0.22 + (line.linkType === 'backbone' ? 0.24 : 0);
      ctx.beginPath();
      ctx.moveTo(segment.sx, segment.sy);
      ctx.lineTo(segment.ex, segment.ey);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    if (renderEnergyPass) drawEnergyLines(qualityLevel, calmMode, t);
    if (renderEnergyPass || qualityLevel > 0.78) drawPulsePackets(calmMode, qualityLevel);

    const dotStride =
      (lowDetailMode ? 3 : mediumDetailMode ? 2 : 1) +
      renderBudgets.dotStrideBoost +
      (heavyCullLevel === 2 ? 1 : 0);
    const drawStarSpikes = !lowDetailMode && heavyCullLevel < 2 && qualityLevel > 0.84;
    const drawStarHalo = (!lowDetailMode || qualityLevel > 0.48) && !(heavyCullLevel > 0 && qualityLevel < 0.82);
    const drawDotGlow = !lowDetailMode && !(heavyCullLevel === 2 && qualityLevel < 0.88);
    for (let i = 0; i < dots.length; i++) {
      const dot = dots[i];
      if (dotStride > 1 && !dot.isStar && i % dotStride !== 0) continue;
      const pt = pointForDot(dot);
      const rx = pt.x;
      const ry = pt.y;
      const dx = dot.x - mouse.x;
      const dy = dot.y - mouse.y;
      const distSq = dx * dx + dy * dy;
      const prox = distSq < MOUSE_RADIUS_SQ ? Math.max(0, 1 - Math.sqrt(distSq) / MOUSE_RADIUS) : 0;
      const twinkle = (Math.sin(t * dot.twinkleSpeed + dot.twinkleOffset) + 1) * 0.5;
      const twinkleInfluence = 0.32 + (1 - dot.zoneWeight) * 0.68;
      const introVisibility = introState === 'complete'
        ? 1
        : introState === 'running' || introState === 'settling'
          ? clamp(dot.introProgress * 1.15, 0.05, 1)
          : 0;
      if (introVisibility <= 0.001) continue;
      const roleAlphaBoost = dot.role === 'hub' ? 1.4 : dot.role === 'relay' ? 1.16 : 1;
      const roleRadiusBoost = dot.role === 'hub' ? 1.24 : dot.role === 'relay' ? 1.1 : 1;
      const zoneDepthFade = clamp(1 - smoothstep(0.42, 0.96, dot.zoneWeight) * 0.52, 0.38, 1);
      const alpha =
        (dot.baseAlpha * (0.5 + twinkle * 0.5 * twinkleInfluence) + prox * 0.08) *
        roleAlphaBoost *
        zoneDepthFade *
        (calmMode ? 0.78 : 1) *
        (0.72 + qualityLevel * 0.32) *
        introVisibility *
        clamp(1 - scrollEnergy * SCROLL_DOT_FADE, 0.72, 1) *
        1.08;
      const radius =
        dot.r * roleRadiusBoost * (0.88 + twinkle * 0.13 * twinkleInfluence) * (0.86 + zoneDepthFade * 0.14) +
        prox * (calmMode ? 0.35 : 0.65);

      if (dot.isStar) {
        if (drawStarHalo) {
          const haloR = dot.r * 10.8 + prox * 3.2;
          const haloGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, haloR);
          haloGrad.addColorStop(0, `rgba(255,255,255,${(0.0095 + twinkle * 0.0075) * (1 + prox * 0.26)})`);
          haloGrad.addColorStop(0.3, `rgba(255,255,255,${0.003 + twinkle * 0.0022})`);
          haloGrad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(rx, ry, haloR, 0, Math.PI * 2);
          ctx.fillStyle = haloGrad;
          ctx.fill();

          const midR = dot.r * 3.8 + prox * 1.45;
          const midGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, midR);
          midGrad.addColorStop(0, `rgba(255,255,255,${0.041 + twinkle * 0.028})`);
          midGrad.addColorStop(0.45, `rgba(255,255,255,${0.011 + twinkle * 0.005})`);
          midGrad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(rx, ry, midR, 0, Math.PI * 2);
          ctx.fillStyle = midGrad;
          ctx.fill();
        }

        if (drawStarSpikes) {
          const spikeLen = dot.r * (5.5 + twinkle * 3.6) + prox * 2.1;
          ctx.save();
          for (let si = 0; si < 4; si++) {
            const angle = si * Math.PI / 2;
            const sx = Math.cos(angle);
            const sy = Math.sin(angle);
            const spGrad = ctx.createLinearGradient(rx, ry, rx + sx * spikeLen, ry + sy * spikeLen);
            const spikeAlpha = (0.021 + twinkle * 0.015) * (1 + prox * 0.34);
            spGrad.addColorStop(0, `rgba(255,255,255,${spikeAlpha})`);
            spGrad.addColorStop(0.5, `rgba(255,255,255,${spikeAlpha * 0.3})`);
            spGrad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.moveTo(rx - sx * dot.r * 0.5, ry - sy * dot.r * 0.5);
            ctx.lineTo(rx + sx * spikeLen, ry + sy * spikeLen);
            ctx.strokeStyle = spGrad;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
          ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(rx, ry, radius * 1.08, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.28, alpha * 1.15)})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rx, ry, radius * 0.42, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.min(0.46, alpha * 1.68)})`;
        ctx.fill();
      } else {
        if (dot.role === 'hub') {
          const hubR = dot.r * 5.8 + prox * 3.2;
          const hubGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, hubR);
          hubGrad.addColorStop(0, `rgba(255,255,255,${0.042 + twinkle * 0.028})`);
          hubGrad.addColorStop(0.5, `rgba(255,255,255,${0.016 + twinkle * 0.01})`);
          hubGrad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(rx, ry, hubR, 0, Math.PI * 2);
          ctx.fillStyle = hubGrad;
          ctx.fill();
        } else if (dot.zoneWeight > 0.62) {
          const focusR = dot.r * (3.1 + dot.zoneWeight * 2.2);
          const focusGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, focusR);
          focusGrad.addColorStop(0, `rgba(255,255,255,${0.015 + dot.zoneWeight * 0.012})`);
          focusGrad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(rx, ry, focusR, 0, Math.PI * 2);
          ctx.fillStyle = focusGrad;
          ctx.fill();
        } else if (drawDotGlow && prox > 0.3) {
          const glowR = dot.r * 3.4;
          const glowGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, glowR);
          glowGrad.addColorStop(0, `rgba(255,255,255,${alpha * 0.23})`);
          glowGrad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(rx, ry, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(rx, ry, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }
    }
    if (renderNodeAuraPass) drawNodeAuras(qualityLevel, calmMode);

    animationRaf = requestAnimationFrame(animate);
  }

  function queueAnimationFrame() {
    if (animationRaf) return;
    animationRaf = requestAnimationFrame(animate);
  }

  function startAnimationWhenReady() {
    if (animationStarted || !canvasActive) return;
    const begin = () => {
      if (document.hidden || animationStarted || !canvasActive) return;
      lastFrameTime = performance.now();
      lastRenderedFrameAt = 0;
      queueAnimationFrame();
    };

    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(begin, { timeout: CANVAS_START_IDLE_TIMEOUT_MS });
    } else {
      setTimeout(begin, 120);
    }
  }

  function _onVisibilityChange() {
    if (!document.hidden && canvasActive) {
      startAnimationWhenReady();
    }
  }
  document.addEventListener('visibilitychange', _onVisibilityChange);

  startAnimationWhenReady();
  // Return cleanup function
  return function cleanup() {
    canvasActive = false;
    if (animationRaf) {
      cancelAnimationFrame(animationRaf);
      animationRaf = 0;
    }
    window.removeEventListener('scroll', _onScroll);
    window.removeEventListener(NETWORK_INTRO_EVENT, _onNetworkIntro);
    window.removeEventListener('resize', _onResize);
    document.removeEventListener('mousemove', _onMouseMove);
    document.removeEventListener('mouseleave', _onMouseLeave);
    document.removeEventListener('visibilitychange', _onVisibilityChange);
  };
}
