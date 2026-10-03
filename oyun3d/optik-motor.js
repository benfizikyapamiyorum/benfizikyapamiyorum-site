// BFY · Mercek Keskin Nişancı — ışın izleme motoru (2B, piksel koordinatları)
// Düzlem ayna: yansıma kanunu · İnce mercek: tanθ' = tanθ − h/f · Cam: Snell (n₁sinθ₁ = n₂sinθ₂) ve tam yansıma
(function (root) {
  const D = Math.PI / 180, EPS = 1e-4, N_GLASS = 1.5, F_LENS = 120, HALF = { mirror: 40, lens: 50, dlens: 50 };
  const BOUNDS = [0, 80, 880, 600];
  const cross = (ax, ay, bx, by) => ax * by - ay * bx;
  // p + t·d  ile  a–b doğru parçasının kesişimi
  function segHit(px, py, dx, dy, ax, ay, bx, by) {
    const ex = bx - ax, ey = by - ay, den = cross(dx, dy, ex, ey); if (Math.abs(den) < 1e-9) return null;
    const wx = ax - px, wy = ay - py, t = cross(wx, wy, ex, ey) / den, u = cross(wx, wy, dx, dy) / den;
    return (u >= 0 && u <= 1 && t > EPS) ? { t, u } : null;
  }
  function circHit(px, py, dx, dy, cx, cy, r) {
    const fx = px - cx, fy = py - cy, b = fx * dx + fy * dy, c = fx * fx + fy * fy - r * r, h = b * b - c; if (h < 0) return null;
    const s = Math.sqrt(h), t1 = -b - s, t2 = -b + s; return t1 > EPS ? t1 : (t2 > EPS ? t2 : null);
  }
  const rectPoly = r => [[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]];
  // dik ikizkenar prizma (dik kenarlar 80 px), merkez etrafında a derece döndürülmüş
  function prismPoly(x, y, a) { const c = Math.cos(a * D), s = Math.sin(a * D);
    return [[-40, -40], [-40, 40], [40, 40]].map(([u, v]) => [x + u * c - v * s, y + u * s + v * c]); }
  // çokgen kenarları + dışa bakan normaller
  function edges(poly) { let area = 0; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; area += cross(a[0], a[1], b[0], b[1]); }
    const sg = area > 0 ? 1 : -1; const E = [];
    for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], ex = b[0] - a[0], ey = b[1] - a[1], L = Math.hypot(ex, ey);
      E.push({ a, b, nx: sg * ey / L, ny: -sg * ex / L }); } return E; }
  function inPoly(x, y, poly) { let s = 0; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], c = cross(b[0] - a[0], b[1] - a[1], x - a[0], y - a[1]); if (c !== 0) { if (s && Math.sign(c) !== s) return false; s = Math.sign(c); } } return true; }
  function pieceSeg(pc) { const h = HALF[pc.type], c = Math.cos(pc.a * D), s = Math.sin(pc.a * D); return [pc.x - c * h, pc.y - s * h, pc.x + c * h, pc.y + s * h]; }
  function segDist(px, py, ax, ay, bx, by) { const ex = bx - ax, ey = by - ay, L2 = ex * ex + ey * ey; let t = L2 ? ((px - ax) * ex + (py - ay) * ey) / L2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(ax + ex * t - px, ay + ey * t - py); }

  // seviyenin sabit kenarları önbellekte (trace her karede çağrılır; her seferinde yeniden kurulmasın)
  const LC = new WeakMap();
  function levelEdges(L) { let c = LC.get(L); if (!c) { c = { glass: (L.glass || []).map(r => ({ E: edges(r.length === 4 && typeof r[0] === 'number' ? rectPoly(r) : r) })), walls: (L.walls || []).map(r => edges(rectPoly(r))) }; LC.set(L, c); } return c; }
  // L: seviye, pieces: tüm optik elemanlar ({type:'mirror'|'lens'|'dlens'|'prism', x, y, a})
  function trace(L, pieces) {
    const la = L.laser, segs = [], ev = [], gems = new Set();
    let px = la.x + Math.cos(la.a * D) * 24, py = la.y + Math.sin(la.a * D) * 24, dx = Math.cos(la.a * D), dy = Math.sin(la.a * D);
    const LE = levelEdges(L), glass = LE.glass.slice();
    const optics = [];
    for (const pc of pieces) { if (pc.type === 'prism') glass.push({ E: edges(prismPoly(pc.x, pc.y, pc.a)), pc }); else optics.push(pc); }
    const walls = LE.walls;
    let inside = -1, end = 'bound', n = 0;
    for (let k = 0; k < 80; k++) {
      let best = { t: Infinity };
      if (inside < 0) {
        for (const pc of optics) { const s = pieceSeg(pc), h = segHit(px, py, dx, dy, s[0], s[1], s[2], s[3]); if (h && h.t < best.t) best = { t: h.t, kind: pc.type, pc }; }
        for (const E of walls) for (const e of E) { const h = segHit(px, py, dx, dy, e.a[0], e.a[1], e.b[0], e.b[1]); if (h && h.t < best.t) best = { t: h.t, kind: 'wall' }; }
        const tt = circHit(px, py, dx, dy, L.target.x, L.target.y, 20); if (tt !== null && tt < best.t) best = { t: tt, kind: 'target' };
      }
      glass.forEach((g, gi) => { if (inside >= 0 && gi !== inside) return; for (const e of g.E) { const h = segHit(px, py, dx, dy, e.a[0], e.a[1], e.b[0], e.b[1]); if (h && h.t < best.t) best = { t: h.t, kind: 'glass', gi, e }; } });
      // sınır
      { const [x0, y0, x1, y1] = BOUNDS; let t = Infinity; if (dx > 0) t = Math.min(t, (x1 - px) / dx); if (dx < 0) t = Math.min(t, (x0 - px) / dx); if (dy > 0) t = Math.min(t, (y1 - py) / dy); if (dy < 0) t = Math.min(t, (y0 - py) / dy); if (t < best.t) best = { t: Math.max(t, 0), kind: 'bound' }; }
      const qx = px + dx * best.t, qy = py + dy * best.t;
      segs.push([px, py, qx, qy, inside >= 0]);
      (L.gems || []).forEach((g, i) => { if (segDist(g[0], g[1], px, py, qx, qy) <= 15) gems.add(i); });
      px = qx; py = qy;
      if (best.kind === 'mirror') {
        const c = Math.cos(best.pc.a * D), s = Math.sin(best.pc.a * D); let nx = -s, ny = c; if (dx * nx + dy * ny > 0) { nx = -nx; ny = -ny; } const dn = dx * nx + dy * ny;
        const inc = Math.acos(Math.min(1, Math.abs(dn))) / D; dx -= 2 * dn * nx; dy -= 2 * dn * ny;   // yansıma: d' = d − 2(d·n)n
        ev.push({ type: 'mirror', x: qx, y: qy, nx, ny, inc, pc: best.pc });
      } else if (best.kind === 'lens' || best.kind === 'dlens') {
        const pc = best.pc, f = best.kind === 'lens' ? F_LENS : -F_LENS, tx = Math.cos(pc.a * D), ty = Math.sin(pc.a * D); let nx = -ty, ny = tx;
        let dn = dx * nx + dy * ny; if (dn < 0) { nx = -nx; ny = -ny; dn = -dn; }
        const h = (qx - pc.x) * tx + (qy - pc.y) * ty, sl = (dx * tx + dy * ty) / dn - h / f;
        let ox = nx + sl * tx, oy = ny + sl * ty; const L2 = Math.hypot(ox, oy); dx = ox / L2; dy = oy / L2;
        ev.push({ type: best.kind, x: qx, y: qy, pc, h });
        px += dx * .01; py += dy * .01;
      } else if (best.kind === 'glass') {
        const e = best.e, entering = inside < 0; let nx = e.nx, ny = e.ny; if (!entering) { nx = -nx; ny = -ny; }
        const nfx = nx, nfy = ny;   // gelen ışına karşı bakan normal (girerken dış, çıkarken iç normal)
        const cosi = -(dx * nfx + dy * nfy), eta = entering ? 1 / N_GLASS : N_GLASS, k2 = 1 - eta * eta * (1 - cosi * cosi), ang = Math.acos(Math.min(1, Math.abs(cosi))) / D;
        if (k2 < 0) { dx += 2 * cosi * nfx; dy += 2 * cosi * nfy; ev.push({ type: 'tir', x: qx, y: qy, nx: nfx, ny: nfy, inc: ang }); }
        else { const c2 = Math.sqrt(k2); dx = eta * dx + (eta * cosi - c2) * nfx; dy = eta * dy + (eta * cosi - c2) * nfy; const Ln = Math.hypot(dx, dy); dx /= Ln; dy /= Ln;
          ev.push({ type: 'refr', x: qx, y: qy, nx: nfx, ny: nfy, inc: ang, ref: Math.acos(Math.min(1, c2)) / D, entering }); inside = entering ? best.gi : -1; }
      } else { end = best.kind; break; }
      if (++n > 60) break;
    }
    return { segs, ev, gems, hit: end === 'target', end };
  }
  root.BFY_OPTIK = { trace, D, F_LENS, N_GLASS, HALF, BOUNDS, prismPoly, rectPoly, inPoly, pieceSeg, segDist };
})(typeof window !== 'undefined' ? window : globalThis);
