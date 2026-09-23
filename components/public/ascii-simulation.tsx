"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
  nx?: number;
  ny?: number;
  nz?: number;
}

interface Triangle3D {
  p1: Point3D;
  p2: Point3D;
  p3: Point3D;
  normal: Point3D;
}

// Procedural 3D Sports Car matching Skiper14
function generateSportsCar(): Triangle3D[] {
  const triangles: Triangle3D[] = [];

  function addQuad(
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number],
    p4: [number, number, number]
  ) {
    const v1: Point3D = { x: p1[0], y: p1[1], z: p1[2] };
    const v2: Point3D = { x: p2[0], y: p2[1], z: p2[2] };
    const v3: Point3D = { x: p3[0], y: p3[1], z: p3[2] };
    const v4: Point3D = { x: p4[0], y: p4[1], z: p4[2] };

    const ax = v2.x - v1.x, ay = v2.y - v1.y, az = v2.z - v1.z;
    const bx = v3.x - v1.x, by = v3.y - v1.y, bz = v3.z - v1.z;
    let nx = ay * bz - az * by;
    let ny = az * bx - ax * bz;
    let nz = ax * by - ay * bx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    const normal = { x: nx, y: ny, z: nz };

    triangles.push({ p1: v1, p2: v2, p3: v3, normal });
    triangles.push({ p1: v1, p2: v3, p3: v4, normal });
  }

  // Aerodynamic Low-slung GT Car Geometry
  // Long Front Nose & Hood
  addQuad([-1.2, -0.3, 3.4], [1.2, -0.3, 3.4], [1.1, -0.6, 3.6], [-1.1, -0.6, 3.6]); // Front lower splitter
  addQuad([-1.2, 0.0, 2.2], [1.2, 0.0, 2.2], [1.2, -0.3, 3.4], [-1.2, -0.3, 3.4]);   // Hood top front
  addQuad([-1.25, 0.15, 1.2], [1.25, 0.15, 1.2], [1.2, 0.0, 2.2], [-1.2, 0.0, 2.2]); // Hood top rear
  addQuad([-1.35, -0.3, 2.2], [-1.2, 0.0, 2.2], [-1.2, -0.3, 3.4], [-1.35, -0.5, 3.4]); // Left front fender
  addQuad([1.2, 0.0, 2.2], [1.35, -0.3, 2.2], [1.35, -0.5, 3.4], [1.2, -0.3, 3.4]);    // Right front fender

  // Sleek Raked Windshield & Cockpit Roof
  addQuad([-1.05, 0.72, -0.1], [1.05, 0.72, -0.1], [1.25, 0.15, 1.2], [-1.25, 0.15, 1.2]); // Windshield
  addQuad([-1.0, 0.72, -1.3], [1.0, 0.72, -1.3], [1.05, 0.72, -0.1], [-1.05, 0.72, -0.1]); // Curved roof
  addQuad([-1.15, 0.22, -2.4], [1.15, 0.22, -2.4], [1.0, 0.72, -1.3], [-1.0, 0.72, -1.3]); // Sloping fastback rear glass

  // Rear Deck, Diffuser & GT Wing
  addQuad([-1.3, 0.15, -3.2], [1.3, 0.15, -3.2], [1.15, 0.22, -2.4], [-1.15, 0.22, -2.4]); // Trunk lid
  addQuad([-1.3, -0.55, -3.4], [1.3, -0.55, -3.4], [1.3, 0.15, -3.2], [-1.3, 0.15, -3.2]);  // Rear bumper
  addQuad([-1.5, 0.6, -3.1], [1.5, 0.6, -3.1], [1.5, 0.52, -2.7], [-1.5, 0.52, -2.7]);      // Rear wing blade
  addQuad([-1.05, 0.15, -2.9], [-0.95, 0.15, -2.9], [-0.95, 0.58, -2.9], [-1.05, 0.58, -2.9]); // Left wing support
  addQuad([0.95, 0.15, -2.9], [1.05, 0.15, -2.9], [1.05, 0.58, -2.9], [0.95, 0.58, -2.9]);    // Right wing support

  // Doors & Side Windows
  // Left Side
  addQuad([-1.35, -0.4, -2.0], [-1.35, 0.18, -2.0], [-1.35, 0.15, 1.2], [-1.35, -0.4, 1.2]); // Left door body
  addQuad([-1.35, 0.18, -0.1], [-1.05, 0.72, -0.1], [-1.0, 0.72, -1.2], [-1.35, 0.18, -1.2]); // Left window
  // Right Side
  addQuad([1.35, 0.18, -2.0], [1.35, -0.4, -2.0], [1.35, -0.4, 1.2], [1.35, 0.15, 1.2]);     // Right door body
  addQuad([1.05, 0.72, -0.1], [1.35, 0.18, -0.1], [1.35, 0.18, -1.2], [1.0, 0.72, -1.2]);     // Right window

  // Wheels (4 Distinct Cylinders)
  const wheels: [number, number, number][] = [
    [-1.3, -0.45, 1.9],  // Front Left
    [1.3, -0.45, 1.9],   // Front Right
    [-1.3, -0.45, -1.8], // Rear Left
    [1.3, -0.45, -1.8],  // Rear Right
  ];

  wheels.forEach(([wx, wy, wz]) => {
    const segments = 12;
    const r = 0.48;
    const width = 0.32;
    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2;
      const a2 = ((i + 1) / segments) * Math.PI * 2;
      const y1 = wy + Math.sin(a1) * r;
      const z1 = wz + Math.cos(a1) * r;
      const y2 = wy + Math.sin(a2) * r;
      const z2 = wz + Math.cos(a2) * r;

      const sign = wx > 0 ? 1 : -1;
      const xOut = wx + sign * (width / 2);
      const xIn = wx - sign * (width / 2);

      // Wheel face
      addQuad([xOut, wy, wz], [xOut, y1, z1], [xOut, y2, z2], [xOut, wy, wz]);
      // Tire tread
      addQuad([xIn, y1, z1], [xOut, y1, z1], [xOut, y2, z2], [xIn, y2, z2]);
    }
  });

  return triangles;
}

// ASCII Character density ramp matching skiper14
const ASCII_CHARS = " .:-+*=%@#";

interface AsciiSimulationProps {
  className?: string;
}

export function AsciiSimulation({ className }: AsciiSimulationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Engine state
  // Initial angle closely matches the side/perspective in the screenshot
  const rotationRef = useRef({ yaw: 1.48, pitch: 0.16 });
  const velocityRef = useRef({ vyaw: 0.0035, vpitch: 0 });
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const modelDataRef = useRef<Triangle3D[]>([]);

  // Fixed background terminal cosmos stars (dots matching screenshot)
  const starsRef = useRef<{ x: number; y: number; char: string }[]>([]);

  useEffect(() => {
    modelDataRef.current = generateSportsCar();

    // Generate ~100 scattered stars
    const stars: { x: number; y: number; char: string }[] = [];
    for (let i = 0; i < 110; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        char: Math.random() > 0.35 ? "." : (Math.random() > 0.6 ? ":" : "'"),
      });
    }
    starsRef.current = stars;
  }, []);

  // Pointer drag controls
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { vyaw: 0, vpitch: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    const sens = 0.007;
    rotationRef.current.yaw += dx * sens;
    rotationRef.current.pitch += dy * sens;

    // Limit pitch to prevent upside down flip
    rotationRef.current.pitch = Math.max(-1.1, Math.min(1.1, rotationRef.current.pitch));

    velocityRef.current = {
      vyaw: dx * sens * 0.4,
      vpitch: dy * sens * 0.4,
    };

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    const charW = 7.0;
    const charH = 13.0;

    const render = () => {
      // Auto-rotation & inertia decay
      if (!isDraggingRef.current) {
        rotationRef.current.yaw += velocityRef.current.vyaw;
        rotationRef.current.pitch += velocityRef.current.vpitch;

        velocityRef.current.vyaw *= 0.96;
        velocityRef.current.vpitch *= 0.96;

        if (Math.abs(velocityRef.current.vyaw) < 0.0028) {
          velocityRef.current.vyaw = 0.0028;
        }
      }

      const width = canvas.width;
      const height = canvas.height;

      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      const cols = Math.floor(width / charW);
      const rows = Math.floor(height / charH);

      const bufferSize = cols * rows;
      const charBuffer = new Array<string>(bufferSize).fill(" ");
      const zBuffer = new Float32Array(bufferSize).fill(-Infinity);

      // Populate background stars
      const stars = starsRef.current;
      for (let s = 0; s < stars.length; s++) {
        const sx = Math.floor(stars[s].x * cols);
        const sy = Math.floor(stars[s].y * rows);
        if (sx >= 0 && sx < cols && sy >= 0 && sy < rows) {
          charBuffer[sy * cols + sx] = stars[s].char;
        }
      }

      // Lighting vector
      const light = { x: 0.6, y: 0.9, z: 1.0 };
      const lLen = Math.hypot(light.x, light.y, light.z) || 1;
      light.x /= lLen; light.y /= lLen; light.z /= lLen;

      // Trigonometry for rotation matrix
      const cosYaw = Math.cos(rotationRef.current.yaw);
      const sinYaw = Math.sin(rotationRef.current.yaw);
      const cosPitch = Math.cos(rotationRef.current.pitch);
      const sinPitch = Math.sin(rotationRef.current.pitch);

      const fov = Math.min(width, height) * 0.98;
      const camDist = 5.2;

      const triangles = modelDataRef.current;

      // Rasterize 3D Car triangles
      for (let t = 0; t < triangles.length; t++) {
        const tri = triangles[t];

        // Normal rotation
        const nx1 = tri.normal.x * cosYaw + tri.normal.z * sinYaw;
        const nz1 = -tri.normal.x * sinYaw + tri.normal.z * cosYaw;
        const ny2 = tri.normal.y * cosPitch - nz1 * sinPitch;
        const nz2 = tri.normal.y * sinPitch + nz1 * cosPitch;

        if (nz2 < -0.15) continue; // Backface culling

        // Diffuse illumination
        const diffuse = Math.max(0, nx1 * light.x + ny2 * light.y + nz2 * light.z);
        const ambient = 0.16;
        const specular = Math.pow(Math.max(0, nz2), 3) * 0.45;
        const luminance = Math.min(1, Math.max(0, ambient + diffuse * 0.72 + specular));
        const charIdx = Math.floor(luminance * (ASCII_CHARS.length - 1));
        const asciiChar = ASCII_CHARS[charIdx];

        // High density sampling (steps=8 for crisp car contours)
        const sampleSteps = 8;
        for (let u = 0; u <= sampleSteps; u++) {
          for (let v = 0; u + v <= sampleSteps; v++) {
            const w = sampleSteps - u - v;
            const px = (tri.p1.x * u + tri.p2.x * v + tri.p3.x * w) / sampleSteps;
            const py = (tri.p1.y * u + tri.p2.y * v + tri.p3.y * w) / sampleSteps;
            const pz = (tri.p1.z * u + tri.p2.z * v + tri.p3.z * w) / sampleSteps;

            const rx1 = px * cosYaw + pz * sinYaw;
            const rz1 = -px * sinYaw + pz * cosYaw;
            const ry2 = py * cosPitch - rz1 * sinPitch;
            const rz2 = py * sinPitch + rz1 * cosPitch;

            const depth = rz2 + camDist;
            if (depth <= 0.1) continue;

            const sx = Math.floor(cols / 2 + (rx1 / depth) * (fov / charW));
            const sy = Math.floor(rows / 2 - (ry2 / depth) * (fov / charH));

            if (sx >= 0 && sx < cols && sy >= 0 && sy < rows) {
              const idx = sy * cols + sx;
              const invDepth = 1 / depth;
              if (invDepth > zBuffer[idx]) {
                zBuffer[idx] = invDepth;
                charBuffer[idx] = asciiChar;
              }
            }
          }
        }
      }

      // Draw onto Canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#ffffff";
      ctx.font = `${charH}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = "top";

      for (let r = 0; r < rows; r++) {
        const start = r * cols;
        const rowStr = charBuffer.slice(start, start + cols).join("");
        ctx.fillText(rowStr, 0, r * charH);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Responsive Canvas Resize Observer
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-black select-none ${className || "h-[50vh] sm:h-[58vh] md:h-[65vh]"}`}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing block touch-none"
      />
    </div>
  );
}
