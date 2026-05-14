import { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { useNetworkStore, type Contact } from '../stores/networkStore';
import styles from './NetworkPage.module.css';

const relLabels: Record<string, string> = { alumni: '校友', colleague: '同事', mentor: '导师', friend: '朋友', referrer: '推荐人', other: '其他' };
const relColors: Record<string, string> = { alumni: '#3b82f6', colleague: '#f59e0b', mentor: '#8b5cf6', friend: '#10b981', referrer: '#ef4444', other: '#6b7280' };

export default function NetworkPage() {
  const { contacts, addContact, updateContact, deleteContact, addInteraction, getStaleContacts, getForceGraphData } = useNetworkStore();
  const [selected, setSelected] = useState<Contact | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [filterStale, setFilterStale] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', affiliation: '', role: '', schools: '', relationship: 'alumni' as Contact['relationship'] });
  const [interactionInput, setInteractionInput] = useState('');

  const staleContacts = useMemo(() => getStaleContacts(90), [contacts]);
  const graphData = useMemo(() => getForceGraphData(), [contacts]);

  const displayContacts = filterStale ? staleContacts : contacts;

  // 力导向图配置
  const graphOption = useMemo(() => ({
    tooltip: { formatter: (p: any) => p.name },
    series: [{
      type: 'graph', layout: 'force', roam: true, draggable: true,
      force: { repulsion: 300, edgeLength: [100, 200] },
      data: graphData.nodes.map((n) => ({
        id: n.id, name: n.name,
        symbolSize: n.id === 'me' ? 36 : 20,
        itemStyle: { color: n.id === 'me' ? '#ef4444' : relColors[contacts.find((c) => c.id === n.id)?.relationship || 'other'] },
        label: { show: true, fontSize: 11, color: 'var(--text-primary)' },
      })),
      links: graphData.links.map((l) => ({
        source: l.source, target: l.target,
        label: { show: true, formatter: l.label, fontSize: 9 },
      })),
      lineStyle: { color: 'var(--border)', curveness: 0.2, opacity: 0.6 },
    }],
  }), [graphData, contacts]);

  const handleAdd = () => {
    if (!newContact.name) return;
    addContact({
      name: newContact.name, affiliation: newContact.affiliation, role: newContact.role,
      schools: newContact.schools ? newContact.schools.split(',').map((s) => s.trim()) : [],
      relationship: newContact.relationship, closeness: 1, lastInteraction: new Date().toISOString().slice(0, 10),
      interactionLog: [], referrals: [], notes: '',
    });
    setNewContact({ name: '', affiliation: '', role: '', schools: '', relationship: 'alumni' });
    setShowAdd(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>🌟 关系星图</h2>
        <div className={styles.headerBtns}>
          <button className={`${styles.filterBtn} ${filterStale ? styles.filterActive : ''}`} onClick={() => setFilterStale(!filterStale)}>
            {filterStale ? `弱连接 (${staleContacts.length})` : '显示弱连接'}
          </button>
          <button className={styles.addBtn} onClick={() => setShowAdd(!showAdd)}>+ 添加联系人</button>
        </div>
      </div>

      {showAdd && (
        <div className={styles.addForm}>
          <input placeholder="姓名" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
          <input placeholder="公司/单位" value={newContact.affiliation} onChange={(e) => setNewContact({ ...newContact, affiliation: e.target.value })} />
          <input placeholder="职位" value={newContact.role} onChange={(e) => setNewContact({ ...newContact, role: e.target.value })} />
          <input placeholder="学校 (逗号分隔)" value={newContact.schools} onChange={(e) => setNewContact({ ...newContact, schools: e.target.value })} />
          <select value={newContact.relationship} onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value as Contact['relationship'] })}>
            {Object.entries(relLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleAdd}>保存</button>
            <button className={styles.cancelBtn} onClick={() => setShowAdd(false)}>取消</button>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {/* 左侧：联系人列表 */}
        <div className={styles.listCol}>
          {displayContacts.map((c) => {
            const isStale = staleContacts.some((s) => s.id === c.id);
            return (
              <div key={c.id} className={`${styles.contactCard} ${selected?.id === c.id ? styles.selected : ''} ${isStale ? styles.stale : ''}`} onClick={() => setSelected(c)}>
                <div className={styles.contactHeader}>
                  <span className={styles.relDot} style={{ background: relColors[c.relationship] }} />
                  <strong>{c.name}</strong>
                  <span className={styles.relLabel}>{relLabels[c.relationship]}</span>
                  {isStale && <span className={styles.staleBadge}>!</span>}
                </div>
                <div className={styles.contactInfo}>
                  {c.affiliation} · {c.role}
                </div>
              </div>
            );
          })}
        </div>

        {/* 右侧：详情 + 图谱 */}
        <div className={styles.detailCol}>
          {selected ? (
            <div className={styles.detail}>
              <h3>{selected.name}</h3>
              <div className={styles.detailMeta}>
                <span>{selected.affiliation} · {selected.role}</span>
                <span>关系：{relLabels[selected.relationship]}</span>
                <span>亲密度：{'★'.repeat(selected.closeness)}</span>
                <span>最近联系：{selected.lastInteraction}</span>
              </div>
              {selected.notes && <p className={styles.notes}>{selected.notes}</p>}

              {/* 互动记录 */}
              <div className={styles.detailSection}>
                <h4>互动记录</h4>
                {selected.interactionLog.map((log, i) => (
                  <div key={i} className={styles.interaction}>
                    <div className={styles.intDate}>{log.date}</div>
                    <p>{log.summary}</p>
                    {log.keyPoints.length > 0 && <div className={styles.intTags}>{log.keyPoints.map((kp, j) => <span key={j} className={styles.tag}>{kp}</span>)}</div>}
                  </div>
                ))}
                <div className={styles.intInput}>
                  <input placeholder="记录新的互动..." value={interactionInput} onChange={(e) => setInteractionInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && interactionInput.trim()) { addInteraction(selected.id, { date: new Date().toISOString().slice(0, 10), summary: interactionInput.trim(), keyPoints: [], nextTopics: [] }); setInteractionInput(''); } }} />
                </div>
              </div>

              <div className={styles.detailActions}>
                <button className={styles.deleteBtn} onClick={() => { deleteContact(selected.id); setSelected(null); }}>删除联系人</button>
              </div>
            </div>
          ) : (
            <div className={styles.graphContainer}>
              <h3 style={{ fontSize: 13, marginBottom: 8, color: 'var(--text-secondary)' }}>🕸️ 关系网络图</h3>
              <ReactECharts option={graphOption} style={{ height: 400 }} notMerge lazyUpdate />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
