import { useState } from 'react';
import { useJobStore } from '../stores/jobStore';
import type { TargetCompany } from '../types';
import styles from './JobRadarPage.module.css';

const statusLabels: Record<string, string> = { watching: '关注中', applied: '已投递', written_test: '笔试中', interviewing: '面试中', offer: '已 Offer', rejected: '已拒', accepted: '已接受' };
const statusColors: Record<string, string> = { watching: 'var(--text-secondary)', applied: 'var(--accent)', written_test: 'var(--warning)', interviewing: 'var(--warning)', offer: 'var(--accent2)', rejected: 'var(--danger)', accepted: 'var(--accent2)' };
const tierColors: Record<string, string> = { T0: '#ef4444', T1: '#f0b90b', 'T1.5': '#3b82f6', T2: '#6b7280' };
const tierLabels: Record<string, string> = { T0: 'T0 · 冲刺', T1: 'T1 · 主攻', 'T1.5': 'T1.5 · 关注', T2: 'T2 · 保底' };

export default function JobRadarPage() {
  const { companies, updateStatus, updateNotes, getStats } = useJobStore();
  const stats = getStats();
  const [filterTier, setFilterTier] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = companies.filter((c) => {
    if (filterTier && c.tier !== filterTier) return false;
    if (filterCat && c.category !== filterCat) return false;
    return true;
  });

  const categories = [...new Set(companies.map((c) => c.category))];

  return (
    <div className={styles.page}>
      <div className={styles.statsRow}>
        <div className={styles.statCard}><div className={styles.statValue}>{stats.total}</div><div className={styles.statLabel}>目标公司</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{stats.applied}</div><div className={styles.statLabel}>已行动</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{stats.interviewing}</div><div className={styles.statLabel}>面试中</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{stats.offer}</div><div className={styles.statLabel}>Offer</div></div>
      </div>

      <div className={styles.grid}>
        <div className={styles.sidebar}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📊 梯队</h3>
            {['', 'T0', 'T1', 'T1.5', 'T2'].map((t) => (
              <button key={t} className={`${styles.filterBtn} ${filterTier === t ? styles.filterActive : ''}`} onClick={() => setFilterTier(t)}>
                {t ? `${tierLabels[t]} (${companies.filter((c) => c.tier === t).length})` : `全部 (${companies.length})`}
              </button>
            ))}
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>📂 类别</h3>
            {['', ...categories].map((cat) => (
              <button key={cat} className={`${styles.filterBtn} ${filterCat === cat ? styles.filterActive : ''}`} onClick={() => setFilterCat(cat)}>
                {cat || `全部 (${companies.length})`}
              </button>
            ))}
          </div>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>💡 提示</h3>
            <p className={styles.tip}>点击状态标签可以切换到下一个状态。点击备注列可以编辑备注。</p>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>公司</th>
                  <th>梯队</th>
                  <th>类别</th>
                  <th>城市</th>
                  <th>薪资</th>
                  <th>WLB</th>
                  <th>状态</th>
                  <th>备注</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td className={styles.companyName}>{c.name}</td>
                    <td><span className={styles.tierBadge} style={{ background: tierColors[c.tier], color: '#fff' }}>{c.tier}</span></td>
                    <td className={styles.cat}>{c.category}</td>
                    <td>{c.city}</td>
                    <td className={styles.salary}>{c.salaryRange}</td>
                    <td>{'★'.repeat(c.wlb)}{c.wlb % 1 ? '☆' : ''}</td>
                    <td>
                      <button
                        className={styles.statusBtn}
                        style={{ color: statusColors[c.status], borderColor: statusColors[c.status] }}
                        onClick={() => {
                          const order = ['watching', 'applied', 'written_test', 'interviewing', 'offer', 'rejected', 'accepted'];
                          const idx = order.indexOf(c.status);
                          updateStatus(c.id, order[(idx + 1) % order.length] as TargetCompany['status']);
                        }}
                      >
                        {statusLabels[c.status]}
                      </button>
                    </td>
                    <td className={styles.notes} onClick={() => setEditingId(c.id === editingId ? null : c.id)}>
                      {editingId === c.id ? (
                        <input
                          autoFocus
                          value={c.notes}
                          onChange={(e) => updateNotes(c.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                          onClick={(e) => e.stopPropagation()}
                          placeholder="输入备注..."
                        />
                      ) : (
                        <span>{c.notes || '点击编辑'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
