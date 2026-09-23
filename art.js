/* Drawn artwork for each system: fine gold lines that draw themselves. viewBox 0 0 200 200. */
window.ART = (() => {
  const L = (d) => `<path pathLength="1" d="${d}"/>`;
  const C = (cx, cy, r) => `<circle pathLength="1" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const dot = (cx, cy, r = 2.6) => `<circle class="dot" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const polar = (r, deg, c = 100) => [c + r * Math.cos((deg - 90) * Math.PI / 180), c + r * Math.sin((deg - 90) * Math.PI / 180)];
  const lines = [];
  const P = {
    natal() {
      let s = C(100, 100, 80) + C(100, 100, 58) + C(100, 100, 18);
      for (let i = 0; i < 12; i++) { const [x1, y1] = polar(58, i * 30), [x2, y2] = polar(80, i * 30); s += L(`M${x1} ${y1}L${x2} ${y2}`); }
      [[40, 10], [115, 22], [200, 14], [290, 30]].forEach(([a, r]) => { const [x, y] = polar(69, a); s += dot(x, y, 3.2); const [x2, y2] = polar(r, a + 160); s += L(`M${x} ${y}L${x2} ${y2}`); });
      return s;
    },
    name() {
      return L('M30 140 C 40 60, 80 60, 78 108 S 110 160, 126 104 S 150 40, 172 70') + L('M40 160 L160 160') + dot(172, 70, 3.4) + L('M150 44 L154 34 L158 44 L168 48 L158 52 L154 62 L150 52 L140 48 Z');
    },
    numerology() {
      return C(100, 100, 74) + L('M76 70 L128 70 L94 142') + L('M84 108 L118 108') + dot(100, 26, 3) + dot(174, 100, 3) + dot(100, 174, 3) + dot(26, 100, 3);
    },
    square() {
      let s = L('M40 40 L160 40 L160 160 L40 160 Z') + L('M80 40 L80 160') + L('M120 40 L120 160') + L('M40 80 L160 80') + L('M40 120 L160 120');
      [[60, 60], [100, 60], [140, 100], [60, 140], [100, 140], [140, 140], [60, 100]].forEach(([x, y], i) => { s += dot(x - 6 + (i % 2) * 12, y, 3); });
      return s;
    },
    bazi() {
      let s = L('M24 170 L176 170');
      [40, 80, 120, 160].forEach((x) => { s += L(`M${x - 14} 40 L${x + 14} 40 L${x + 14} 170 L${x - 14} 170 Z`) + L(`M${x - 14} 104 L${x + 14} 104`) + L(`M${x - 7} 64 L${x + 7} 64`) + L(`M${x} 57 L${x} 72`) + C(x, 134, 7); });
      return s;
    },
    fengshui() {
      let s = '', oct = '';
      for (let i = 0; i < 8; i++) { const [x, y] = polar(78, i * 45 + 22.5); oct += `${i ? 'L' : 'M'}${x} ${y} `; }
      s += L(oct + 'Z') + C(100, 100, 22) + L('M100 78 C 88 90, 112 110, 100 122');
      const bars = [[1, 1, 1], [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 0]];
      for (let i = 0; i < 8; i++) {
        bars[i].forEach((solid, k) => {
          const r = 48 + k * 7, a = i * 45;
          const [x1, y1] = polar(r, a - 10), [x2, y2] = polar(r, a + 10);
          if (solid) s += L(`M${x1} ${y1}L${x2} ${y2}`);
          else { const [m1x, m1y] = polar(r, a - 2.5), [m2x, m2y] = polar(r, a + 2.5); s += L(`M${x1} ${y1}L${m1x} ${m1y}`) + L(`M${m2x} ${m2y}L${x2} ${y2}`); }
        });
      }
      return s;
    },
    chinese() {
      return C(100, 100, 70) + L('M100 30 A35 35 0 0 1 100 100 A35 35 0 0 0 100 170') + dot(100, 65, 7) + C(100, 135, 7);
    },
    matrix() {
      const sq = (rot) => { let d = ''; for (let i = 0; i < 4; i++) { const [x, y] = polar(76, i * 90 + rot); d += `${i ? 'L' : 'M'}${x} ${y} `; } return L(d + 'Z'); };
      let s = sq(0) + sq(45) + C(100, 100, 16);
      for (let i = 0; i < 8; i++) { const [x, y] = polar(76, i * 45); s += dot(x, y, 3.4); }
      return s + dot(100, 100, 3.6);
    },
    tarot() {
      return L('M62 30 L138 30 Q146 30 146 38 L146 162 Q146 170 138 170 L62 170 Q54 170 54 162 L54 38 Q54 30 62 30 Z') + L('M100 70 L106 92 L128 92 L110 106 L117 128 L100 115 L83 128 L90 106 L72 92 L94 92 Z') + L('M70 148 L130 148');
    },
    cycles() {
      let d = 'M100 100 ';
      for (let t = 0; t <= 5.2 * Math.PI; t += 0.12) { const r = 4 + t * 5.2; d += `L${100 + r * Math.cos(t)} ${100 + r * Math.sin(t)} `; }
      return L(d) + dot(100 + 89 * Math.cos(5.2 * Math.PI), 100 + 89 * Math.sin(5.2 * Math.PI), 3.6);
    },
    angels() {
      return L('M30 96 C 50 50, 90 40, 100 70 C 110 40, 150 50, 170 96') + L('M40 104 C 60 70, 88 66, 100 84 C 112 66, 140 70, 160 104') + L('M70 120 L70 160') + L('M100 120 L100 160') + L('M130 120 L130 160') + L('M64 126 L70 120') + L('M94 126 L100 120') + L('M124 126 L130 120');
    },
    today() {
      return L('M122 40 A64 64 0 1 0 122 160 A48 48 0 1 1 122 40 Z') + L('M150 64 L153 72 L161 75 L153 78 L150 86 L147 78 L139 75 L147 72 Z') + dot(158, 120, 2.6) + dot(136, 100, 2);
    },
    money() {
      return C(100, 100, 68) + C(100, 100, 56) + L('M100 64 L100 136') + L('M116 78 C 104 68, 82 72, 84 86 C 86 100, 118 98, 118 114 C 118 128, 96 132, 82 120');
    },
    ascendant() {
      return L('M20 130 L180 130') + L('M52 130 A48 48 0 0 1 148 130') + L('M100 70 L100 58') + L('M62 86 L54 78') + L('M138 86 L146 78') + L('M44 112 L32 108') + L('M156 112 L168 108') + L('M100 130 L100 170');
    },
  };
  return (key) => `<svg class="art" viewBox="0 0 200 200" aria-hidden="true">${(P[key] || P.natal)()}</svg>`;
})();
