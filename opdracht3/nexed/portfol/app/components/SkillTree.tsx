"use client";
import React, { useMemo, useState } from "react";

export interface SkillItem {
  language: string;
  projects: number;
  percentage: number; // 0..100
}

interface SkillTreeProps {
  items: SkillItem[];
}

export default function SkillTree({ items }: SkillTreeProps) {
  // Compact settings
  const size = 260;
  const center = size / 2;
  const innerR = 58;
  const outerR = 108;
  const maxSlices = 6; // show top 6, group rest as "Other"

  const palette = [
    "#F355A7", // accent
    "#6366F1",
    "#06B6D4",
    "#22C55E",
    "#F59E0B",
    "#A855F7",
    "#EF4444",
    "#0EA5E9",
  ];

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Prepare data: top languages + "Other" bucket
  const data = useMemo(() => {
    const sorted = [...items]
      .filter((i) => i.percentage > 0)
      .sort((a, b) => b.percentage - a.percentage);

    const top = sorted.slice(0, maxSlices);
    const remainder = sorted.slice(maxSlices);
    const restPct = Math.max(
      0,
      Math.round(
        remainder.reduce((acc, it) => acc + (it.percentage || 0), 0)
      )
    );

    const out = [...top];
    if (restPct > 0) {
      out.push({
        language: "Other",
        projects: remainder.reduce((acc, it) => acc + (it.projects || 0), 0),
        percentage: restPct,
      });
    }

    // Normalize in case of rounding gaps
    const totalPct = out.reduce((acc, it) => acc + it.percentage, 0) || 1;
    return out.map((it) => ({
      ...it,
      weight: it.percentage / totalPct,
    }));
  }, [items]);

  // Helpers
  const toXY = (angle: number, r: number) => [
    center + r * Math.cos(angle),
    center + r * Math.sin(angle),
  ];

  const arcPath = (
    start: number,
    end: number,
    rOuter: number,
    rInner: number
  ) => {
    const [x0, y0] = toXY(start, rOuter);
    const [x1, y1] = toXY(end, rOuter);
    const [x2, y2] = toXY(end, rInner);
    const [x3, y3] = toXY(start, rInner);

    const largeArc = end - start > Math.PI ? 1 : 0;

    return [
      `M ${x0} ${y0}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x3} ${y3}`,
      "Z",
    ].join(" ");
  };

  // Build slices
  let current = -Math.PI / 2; // start at top
  const slices = data.map((d, i) => {
    const sweep = d.weight * Math.PI * 2;
    const start = current;
    const end = current + sweep;
    current = end;
    const mid = (start + end) / 2;

    const isHover = hoverIndex === i;
    const bump = isHover ? 6 : 0;
    const [dx, dy] = [Math.cos(mid) * bump, Math.sin(mid) * bump];
    const color = palette[i % palette.length];

    // Label leader line
    const labelR = outerR + 10;
    const [lx, ly] = toXY(mid, labelR);
    const isLeft = Math.cos(mid) < 0;
    const labelX = lx + (isLeft ? -8 : 8);
    const textAnchor = isLeft ? "end" : "start";

    return {
      i,
      start,
      end,
      mid,
      path: arcPath(start, end, outerR + (isHover ? 4 : 0), innerR),
      transform: `translate(${dx}, ${dy})`,
      color,
      label: {
        x1: lx,
        y1: ly,
        x2: labelX + (isLeft ? -8 : 8),
        y2: ly,
        textX: labelX,
        textY: ly + 4,
        textAnchor,
      },
      datum: d,
    };
  });

  if (!data.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-large p-5 shadow-elevated">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-black">Skills</h3>
        <span className="text-xs text-gray-500">
          Based on primary language per project
        </span>
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <div className="relative" style={{ width: size, maxWidth: "100%" }}>
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="w-full h-auto"
            role="img"
            aria-label="Languages distribution"
          >
            {/* Center label */}
            <circle cx={center} cy={center} r={innerR - 10} fill="#f8fafc" />
            <text
              x={center}
              y={center - 2}
              textAnchor="middle"
              className="fill-gray-800"
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              Languages
            </text>

            {/* Slices */}
            {slices.map((s) => (
              <g
                key={s.i}
                transform={s.transform}
                onMouseEnter={() => setHoverIndex(s.i)}
                onMouseLeave={() => setHoverIndex(null)}
                style={{ cursor: "pointer" }}
              >
                <path
                  d={s.path}
                  fill={s.color}
                  opacity={hoverIndex === null || hoverIndex === s.i ? 0.95 : 0.45}
                />
                {/* Separator stroke for crisp edges */}
                <path
                  d={arcPath(s.start, s.end, outerR + (hoverIndex === s.i ? 4 : 0), outerR + (hoverIndex === s.i ? 4 : 0) - 1)}
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.8"
                  strokeWidth={1}
                />
              </g>
            ))}

            {/* Leader lines + labels */}
            {slices.map((s) => (
              <g key={`lbl-${s.i}`}>
                <line
                  x1={s.label.x1}
                  y1={s.label.y1}
                  x2={s.label.x2}
                  y2={s.label.y2}
                  stroke="#e5e7eb"
                  strokeWidth={1}
                />
                <text
                  x={s.label.textX}
                  y={s.label.textY}
                  textAnchor={s.label.textAnchor as any}
                  className="fill-gray-800"
                  style={{ fontSize: 11, fontWeight: 600 }}
                >
                  {s.datum.language} {s.datum.percentage}%
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Legend (compact) */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-sm">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ backgroundColor: palette[i % palette.length] }}
              />
              <span className="text-sm text-gray-800 font-medium">
                {d.language}
              </span>
              <span className="ml-auto text-xs text-gray-500">
                {d.projects} proj.
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}