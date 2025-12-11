"use client";
import React, { useMemo, useState } from "react";
import { getLanguageColor } from "@/app/lib/languageColors";

export interface SkillItem {
  language: string;
  projects: number;
  percentage: number; // 0..100
}

interface SkillTreeProps {
  items: SkillItem[];
  onHoverLanguage?: (language: string | null) => void;
  activeLanguage?: string | null;
}

export default function SkillTree({ items, onHoverLanguage, activeLanguage }: SkillTreeProps) {
  // Compact settings
  const size = 260;
  const center = size / 2;
  const innerR = 58;
  const outerR = 108;
  const maxSlices = 6; // show top 6, group rest as "Other"

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

    const totalPct = out.reduce((acc, it) => acc + it.percentage, 0) || 1;
    return out.map((it) => ({
      ...it,
      weight: it.percentage / totalPct,
    }));
  }, [items]);

  const toXY = (angle: number, r: number) => [
    center * 1.5 + r * Math.cos(angle),
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

  let current = -Math.PI / 2; // start at top
  const slices = data.map((d, i) => {
    const sweep = d.weight * Math.PI * 2;
    const start = current;
    const end = current + sweep;
    current = end;
    const mid = (start + end) / 2;

    const isActiveByIndex = hoverIndex === i;
    const isActiveByLanguage = activeLanguage && d.language === activeLanguage;
    const isHover = isActiveByIndex || isActiveByLanguage;

    const bump = isHover ? 6 : 0;
    const [dx, dy] = [Math.cos(mid) * bump, Math.sin(mid) * bump];
    const color = getLanguageColor(d.language);

    return {
      i,
      start,
      end,
      mid,
      path: arcPath(start, end, outerR + (isHover ? 4 : 0), innerR),
      transform: `translate(${dx}, ${dy})`,
      color,
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
          Based on average code size per contributor (bytes) in your GitHub repos
        </span>
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <div className="relative" style={{ width: size * 1.5, maxWidth: "100%" }}>
          <svg
            viewBox={`0 0 ${size * 1.5} ${size}`}
            className="w-full h-auto"
            role="img"
            aria-label="Languages distribution"
          >
            {/* Slices */}
            {slices.map((s) => (
              <g
                key={s.i}
                transform={s.transform}
                onMouseEnter={() => {
                  setHoverIndex(s.i);
                  onHoverLanguage?.(s.datum.language);
                }}
                onMouseLeave={() => {
                  setHoverIndex(null);
                  onHoverLanguage?.(null);
                }}
              >
                <path
                  d={s.path}
                  fill={s.color}
                  className="transition-transform duration-200"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}