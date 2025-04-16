
/**
 * Common utilities for advanced game functionality
 */

// Create particle effect
export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

// Create particles at a specific position
export const createParticles = (
  count: number, 
  x: number, 
  y: number, 
  color: string, 
  options?: {
    spreadX?: number;
    spreadY?: number;
    sizeMin?: number;
    sizeMax?: number;
    speedMin?: number;
    speedMax?: number;
    lifeMin?: number;
    lifeMax?: number;
  }
): Particle[] => {
  const particles: Particle[] = [];
  const now = Date.now();
  
  const {
    spreadX = 2,
    spreadY = 2,
    sizeMin = 1,
    sizeMax = 4,
    speedMin = 0.5,
    speedMax = 2.5,
    lifeMin = 20,
    lifeMax = 50
  } = options || {};
  
  for (let i = 0; i < count; i++) {
    particles.push({
      id: now + i,
      x,
      y,
      vx: (Math.random() - 0.5) * spreadX,
      vy: (Math.random() - 0.5) * spreadY,
      size: Math.random() * (sizeMax - sizeMin) + sizeMin,
      color,
      life: Math.random() * (lifeMax - lifeMin) + lifeMin,
      maxLife: lifeMax,
    });
  }
  
  return particles;
};

// Update particle positions and lifetimes
export const updateParticles = (particles: Particle[]): Particle[] => {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      life: p.life - 1,
      size: p.life > p.maxLife * 0.2 ? p.size : p.size * 0.9,
    }))
    .filter(p => p.life > 0);
};

// Calculate distance between two points
export const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Check collision between two rectangles
export const checkRectCollision = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};

// Check collision between two circles
export const checkCircleCollision = (
  circle1: { x: number; y: number; radius: number },
  circle2: { x: number; y: number; radius: number }
): boolean => {
  const distance = calculateDistance(circle1.x, circle1.y, circle2.x, circle2.y);
  return distance < (circle1.radius + circle2.radius);
};

// Ease in out function for smooth animations
export const easeInOut = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Linear interpolation
export const lerp = (start: number, end: number, t: number): number => {
  return start * (1 - t) + end * t;
};

// Clamp a value between min and max
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Generate a random integer between min (inclusive) and max (inclusive)
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Create optimized game loop using requestAnimationFrame
export const createGameLoop = (
  callback: (deltaTime: number) => void,
  fps: number = 60
): { start: () => void; stop: () => void } => {
  let frameId: number | null = null;
  let lastTime = 0;
  const interval = 1000 / fps;
  
  const loop = (timestamp: number) => {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    
    if (deltaTime >= interval) {
      lastTime = timestamp - (deltaTime % interval);
      callback(deltaTime);
    }
    
    frameId = requestAnimationFrame(loop);
  };
  
  return {
    start: () => {
      if (!frameId) {
        lastTime = 0;
        frameId = requestAnimationFrame(loop);
      }
    },
    stop: () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }
  };
};

// Create a debounced function
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};
