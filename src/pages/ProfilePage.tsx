import { useProfileStore } from '../stores/profileStore';
import styles from './ProfilePage.module.css';

const viewLabels: Record<string, { title: string; desc: string; sort: string[] }> = {
  hr: { title: 'HR 视角', desc: '稳重专业 · 突出教育背景和综合素质', sort: ['教育', '金融', '综合'] },
  interviewer: { title: '面试官视角', desc: '技术导向 · 突出项目经验和动手能力', sort: ['技术', '项目', '工程'] },
  alumni: { title: '校友视角', desc: '亲切共鸣 · 突出成长故事和人格特质', sort: ['成长', '转折', '人文'] },
};

export default function ProfilePage() {
  const { name, title, tagline, turningPoints, skillCards, personalityTags, viewMode, setViewMode, endorseTag } = useProfileStore();
  const view = viewLabels[viewMode];

  const sortedPoints = [...turningPoints].sort((a, b) => {
    const aIdx = view.sort.findIndex((s) => a.tags.some((t) => t.includes(s)));
    const bIdx = view.sort.findIndex((s) => b.tags.some((t) => t.includes(s)));
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.name}>{name || '你的名字'}</h1>
        <p className={styles.title}>{title}</p>
        <p className={styles.tagline}>「{tagline}」</p>
      </div>

      {/* 视角切换 */}
      <div className={styles.viewSwitch}>
        {Object.entries(viewLabels).map(([key, v]) => (
          <button key={key} className={`${styles.viewBtn} ${viewMode === key ? styles.viewActive : ''}`} onClick={() => setViewMode(key as 'hr' | 'interviewer' | 'alumni')}>
            {v.title}
          </button>
        ))}
      </div>
      <p className={styles.viewDesc}>{view.desc}</p>

      <div className={styles.grid}>
        {/* 转折点时间线 */}
        <div className={styles.section}>
          <h3>📅 成长时间线</h3>
          <div className={styles.timeline}>
            {sortedPoints.map((tp, i) => (
              <div key={tp.id} className={`${styles.tlItem} ${i === 0 ? styles.tlFirst : ''}`}>
                <div className={styles.tlDate}>{tp.date}</div>
                <div className={styles.tlContent}>
                  <h4>{tp.title}</h4>
                  <p>{tp.narrative}</p>
                  <div className={styles.tlTags}>{tp.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 能力举证 + 标签云 */}
        <div className={styles.sideCol}>
          {/* 能力举证卡片 */}
          <div className={styles.section}>
            <h3>💪 能力举证</h3>
            {skillCards.map((sc) => (
              <div key={sc.id} className={styles.skillCard}>
                <strong>{sc.skill}</strong>
                <p>{sc.proof}</p>
              </div>
            ))}
          </div>

          {/* 人格标签云 */}
          <div className={styles.section}>
            <h3>🏷️ 人格标签</h3>
            <div className={styles.tagCloud}>
              {personalityTags.map((pt) => (
                <button key={pt.tag} className={styles.personaTag} onClick={() => endorseTag(pt.tag)} title={pt.explanation}>
                  {pt.tag}
                  {pt.endorsements > 0 && <span className={styles.endorse}> {pt.endorsements}</span>}
                </button>
              ))}
            </div>
            <p className={styles.endoHint}>点击标签可点赞表态</p>
          </div>
        </div>
      </div>
    </div>
  );
}
