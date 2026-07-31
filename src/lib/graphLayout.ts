import { DiscernmentConnection, DiscernmentNode } from '../types/models';

export interface LaidOutNode extends DiscernmentNode {
  x: number;
  y: number;
}

/**
 * A small deterministic force simulation: nodes repel each other, connected
 * nodes are pulled together, and everything is pulled gently toward the
 * center. Runs synchronously for a fixed number of iterations — the graphs
 * in this app are small (tens, not thousands, of nodes) so this stays fast
 * and avoids pulling in a physics/animation dependency.
 */
export function layoutGraph(
  nodes: DiscernmentNode[],
  connections: DiscernmentConnection[],
  width: number,
  height: number,
): LaidOutNode[] {
  if (nodes.length === 0) return [];

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2.6;

  const positions = new Map<string, { x: number; y: number }>();
  nodes.forEach((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    positions.set(n.id, {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  });

  const edges = connections.map((c) => [c.sourceNodeId, c.targetNodeId] as const).filter(([a, b]) => positions.has(a) && positions.has(b));

  const iterations = 120;
  const repulsionStrength = 1400;
  const attractionStrength = 0.02;
  const centeringStrength = 0.01;

  for (let iter = 0; iter < iterations; iter++) {
    const forces = new Map<string, { fx: number; fy: number }>();
    nodes.forEach((n) => forces.set(n.id, { fx: 0, fy: 0 }));

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = positions.get(nodes[i].id)!;
        const b = positions.get(nodes[j].id)!;
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let distSq = dx * dx + dy * dy;
        if (distSq < 1) distSq = 1;
        const dist = Math.sqrt(distSq);
        const force = repulsionStrength / distSq;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        forces.get(nodes[i].id)!.fx += fx;
        forces.get(nodes[i].id)!.fy += fy;
        forces.get(nodes[j].id)!.fx -= fx;
        forces.get(nodes[j].id)!.fy -= fy;
      }
    }

    edges.forEach(([a, b]) => {
      const pa = positions.get(a)!;
      const pb = positions.get(b)!;
      const dx = pb.x - pa.x;
      const dy = pb.y - pa.y;
      forces.get(a)!.fx += dx * attractionStrength;
      forces.get(a)!.fy += dy * attractionStrength;
      forces.get(b)!.fx -= dx * attractionStrength;
      forces.get(b)!.fy -= dy * attractionStrength;
    });

    nodes.forEach((n) => {
      const p = positions.get(n.id)!;
      const f = forces.get(n.id)!;
      f.fx += (centerX - p.x) * centeringStrength;
      f.fy += (centerY - p.y) * centeringStrength;
      p.x += f.fx;
      p.y += f.fy;
      const margin = 40;
      p.x = Math.max(margin, Math.min(width - margin, p.x));
      p.y = Math.max(margin, Math.min(height - margin, p.y));
    });
  }

  return nodes.map((n) => ({ ...n, ...positions.get(n.id)! }));
}
