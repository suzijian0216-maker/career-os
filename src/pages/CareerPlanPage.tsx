import { useMemo } from 'react';
import { useCareerStore } from '../stores/careerStore';
import type { ScenarioPreset } from '../stores/careerStore';
import styles from './CareerPlanPage.module.css';

const dimLabels: Record<string, string> = {
  wlb: '工作生活平衡', salary: '薪资水平', hukou: '户口重要性',
  house: '买房压力', family: '离家距离', growth: '成长空间',
};

export default function CareerPlanPage() {
  const { paths, presets, weights, activePreset, setWeights, applyPreset, getMatchScores } = useCareerStore();
  const matchScores = getMatchScores();
  const sorted = useMemo(() => {
    return [...matchScores].sort((a, b) => b.score - a.score);
  }, [matchScores]);

  const getPath = (id: string) => paths.find((p) => p.id === id)!;

  return (
    <div className={styles.page}>
      {/* 场景预设按钮 */}
      <div className={styles.section}>
        <h3 className={styles.title}>🎬 场景预设</h3>
        <div className={styles.presets}>
          <button
            className={`${styles.presetBtn} ${activePreset === 'custom' ? styles.presetActive : ''}`}
            onClick={() => {}}
          >
            自定义
          </button>
          {presets.map((p) => (
            <button
              key={p.id}
              className={`${styles.presetBtn} ${activePreset === p.id ? styles.presetActive : ''}`}
              onClick={() => applyPreset(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
        <p className={styles.presetDesc}>
          {activePreset === 'custom'
            ? '手动调整下方权重滑块'
            : presets.find((p) => p.id === activePreset)?.description}
        </p>
      </div>

      <div className={styles.grid}>
        {/* 权重面板 */}
        <div className={styles.section}>
          <h3 className={styles.title}>⚖️ 偏好权重</h3>
          <p className={styles.hint}>拖动滑块调整你心中各维度的重视程度</p>
          <div className={styles.sliders}>
            {Object.entries(weights).map(([key, val]) => (
              <div key={key} className={styles.sliderRow}>
                <span className={styles.sliderLabel}>{dimLabels[key]}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={val}
                  onChange={(e) => setWeights({ ...weights, [key]: Number(e.target.value) })}
                  className={styles.slider}
                />
                <span className={styles.sliderVal}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 匹配度排名 */}
        <div className={styles.section}>
          <h3 className={styles.title}>📊 匹配度排名</h3>
          <div className={styles.rankList}>
            {sorted.map(({ pathId, score }, i) => {
              const path = getPath(pathId);
              const isTop = i === 0;
              return (
                <div key={pathId} className={`${styles.rankItem} ${isTop ? styles.rankTop : ''}`}>
                  <div className={styles.rankBadge} style={{ background: path.color }}>{i + 1}</div>
                  <div className={styles.rankInfo}>
                    <div className={styles.rankName}>
                      {path.icon} {path.name} <span className={styles.rankCity}>{path.city}</span>
                    </div>
                    <div className={styles.rankBar}>
                      <div className={styles.rankFill} style={{ width: `${score}%`, background: path.color }} />
                    </div>
                  </div>
                  <span className={styles.rankScore}>{score}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 四向对比卡片 */}
      <div className={styles.section}>
        <h3 className={styles.title}>🃏 平行宇宙 · {activePreset === 'custom' ? '当前权重下的生活画像' : presets.find((p) => p.id === activePreset)?.name}</h3>
        <div className={styles.cardGrid}>
          {paths.map((path) => {
            const score = matchScores.find((s) => s.pathId === path.id)?.score || 0;
            return (
              <div key={path.id} className={styles.pathCard} style={{ borderTop: `3px solid ${path.color}` }}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{path.icon}</span>
                  <span className={styles.cardName}>{path.name}</span>
                  <span className={styles.cardScore} style={{ color: path.color }}>{score}%</span>
                </div>
                <div className={styles.cardStats}>
                  <div className={styles.statRow}><span>应届总包</span><strong>{path.salaryStart}w</strong></div>
                  <div className={styles.statRow}><span>30岁总包</span><strong>{path.salary30}w</strong></div>
                  <div className={styles.statRow}><span>WLB</span><strong>{'★'.repeat(path.wlb)}{'☆'.repeat(5 - path.wlb)}</strong></div>
                  <div className={styles.statRow}><span>买房年限</span><strong>{path.houseYears} 年</strong></div>
                  <div className={styles.statRow}><span>北京户口</span><strong>{path.hukou ? '✅' : '❌'}</strong></div>
                  <div className={styles.statRow}><span>35岁保障</span><strong>{path.stability >= 5 ? '绝对安全' : path.stability >= 3 ? '较稳定' : '不确定'}</strong></div>
                </div>
                <details className={styles.cardDiary}>
                  <summary>📖 2029年的一天...</summary>
                  <p>{path.futureDiary}</p>
                </details>
                <div className={styles.cardRegret}>
                  <strong>后悔风险：</strong>
                  {path.regretFactors.map((r) => (
                    <span key={r.factor} className={styles.regretTag}>
                      {r.factor} {r.probability}%
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 关键指标对比表 */}
      <div className={styles.section}>
        <h3 className={styles.title}>📋 关键指标对比</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>维度</th>
                {paths.map((p) => <th key={p.id}>{p.icon} {p.name}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr><td>应届总包</td>{paths.map((p) => <td key={p.id}>{p.salaryStart}w</td>)}</tr>
              <tr><td>30岁总包</td>{paths.map((p) => <td key={p.id}>{p.salary30}w</td>)}</tr>
              <tr><td>35岁总包</td>{paths.map((p) => <td key={p.id}>{p.salary35}w</td>)}</tr>
              <tr><td>WLB</td>{paths.map((p) => <td key={p.id}>{'★'.repeat(p.wlb)}</td>)}</tr>
              <tr><td>买房年限</td>{paths.map((p) => <td key={p.id}>{p.houseYears} 年</td>)}</tr>
              <tr><td>北京户口</td>{paths.map((p) => <td key={p.id}>{p.hukou ? '✅' : '—'}</td>)}</tr>
              <tr><td>35岁保障</td>{paths.map((p) => <td key={p.id}>{p.stability >= 5 ? '绝对安全' : p.stability >= 3 ? '较稳定' : '不确定'}</td>)}</tr>
              <tr><td>离家距离</td>{paths.map((p) => <td key={p.id}>{p.parentDistance}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
