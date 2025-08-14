import React, { useEffect, useMemo, useRef } from 'react';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, RadarController } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/**
 * RadarMatrix component
 * Props:
 *  - data: {
 *      labels: string[],
 *      datasets: Array<{ label: string; data: number[]; borderColor?: string; backgroundColor?: string; borderWidth?: number; pointBackgroundColor?: string; pointBorderColor?: string; fill?: boolean; order?: number; }>,
 *    }
 *  - theme?: 'dark' | 'light' (default 'dark')
 *  - showLegend?: boolean (default false)
 *  - className?: string
 *  - style?: React.CSSProperties
 */
function RadarMatrix({ data, theme = 'dark', showLegend = false, className, style }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const palette = useMemo(() => theme === 'dark' ? ({
    text: '#e2e8f0',
    muted: '#94a3b8',
    grid: 'rgba(148,163,184,0.25)',
    angle: 'rgba(148,163,184,0.25)',
    accent: '#9ef01a',
    accentFill: 'rgba(158, 240, 26, 0.18)'
  }) : ({
    text: '#0f172a',
    muted: '#475569',
    grid: 'rgba(15,23,42,0.15)',
    angle: 'rgba(15,23,42,0.2)',
    accent: '#16a34a',
    accentFill: 'rgba(22, 163, 74, 0.12)'
  }), [theme]);

  const datasets = useMemo(() => {
    return data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || palette.accentFill,
      borderColor: dataset.borderColor || palette.accent,
      borderWidth: dataset.borderWidth || 2,
      pointBackgroundColor: dataset.pointBackgroundColor || palette.accent,
      pointBorderColor: dataset.pointBorderColor || '#fff',
      pointRadius: dataset.pointRadius || 3,
      pointHoverRadius: dataset.pointHoverRadius || 4,
      fill: dataset.fill !== undefined ? dataset.fill : true,
      order: dataset.order !== undefined ? dataset.order : (data.datasets.length - index) // Reverse order for stacking effect
    }));
  }, [data, palette]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: data.labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: showLegend, labels: { color: palette.text } } },
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            suggestedMax: 10,
            ticks: { stepSize: 1, showLabelBackdrop: false, color: palette.muted, backdropColor: 'transparent' },
            grid: { color: palette.grid },
            angleLines: { color: palette.angle },
            pointLabels: { color: palette.text, font: { size: 12, weight: 600 } }
          }
        }
      }
    });

    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [datasets, palette, showLegend]);

  return React.createElement(
    'div',
    { className, style: { position: 'relative', width: '100%', height: '100%', ...(style || {}) } },
    React.createElement('canvas', { ref: canvasRef })
  );
}

export default RadarMatrix;