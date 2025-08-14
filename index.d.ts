declare module 'radar-graph' {
  export interface RadarMatrixData {
  labels: string[];
  datasets: Array<{ label: string; data: number[]; borderColor?: string; backgroundColor?: string; borderWidth?: number; pointBackgroundColor?: string; pointBorderColor?: string; fill?: boolean; order?: number; }>;
}

export interface RadarMatrixProps {
  data: RadarMatrixData;
  theme?: 'dark' | 'light';
  showLegend?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

declare const RadarMatrix: React.FC<RadarMatrixProps>;

export default RadarMatrix;
}