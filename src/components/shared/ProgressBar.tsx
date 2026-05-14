import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;       // 0-100
  label?: string;
  showPercent?: boolean;
  color?: string;
  height?: number;
  animated?: boolean;
}

export default function ProgressBar({
  value,
  label,
  showPercent = true,
  color,
  height = 8,
  animated = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={styles.wrapper}>
      {(label || showPercent) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showPercent && <span className={styles.percent}>{clamped}%</span>}
        </div>
      )}
      <div className={styles.track} style={{ height }}>
        <div
          className={`${styles.fill} ${animated ? styles.animated : ''}`}
          style={{
            width: `${clamped}%`,
            height,
            ...(color ? { background: color } : {}),
          }}
        />
      </div>
    </div>
  );
}
