import { useState } from 'react';
import { useProjectStore, type Project } from '../stores/projectStore';
import styles from './ProjectsPage.module.css';

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject } = useProjectStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState<Partial<Project>>({
    name: '', tagline: '', background: '', techStack: [], architecture: '',
    highlights: [], status: 'planned', githubUrl: '', demoUrl: '',
  });
  const [techInput, setTechInput] = useState('');
  const [highlightInput, setHighlightInput] = useState('');

  const selectedProject = selected ? projects.find((p) => p.id === selected) : null;

  const handleSave = () => {
    if (!form.name || !form.tagline) return;
    addProject(form as Omit<Project, 'id'>);
    setForm({ name: '', tagline: '', background: '', techStack: [], architecture: '', highlights: [], status: 'planned', githubUrl: '', demoUrl: '' });
    setTechInput(''); setHighlightInput(''); setShowAdd(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>🖼️ 作品陈列馆</h2>
        <button className={styles.addBtn} onClick={() => setShowAdd(!showAdd)}>+ 新项目</button>
      </div>

      {showAdd && (
        <div className={styles.addForm}>
          <h3>新建项目</h3>
          <div className={styles.formGrid}>
            <input placeholder="项目名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="一句话描述" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            <textarea placeholder="项目背景" rows={3} value={form.background} onChange={(e) => setForm({ ...form, background: e.target.value })} />
            <input placeholder="架构描述" value={form.architecture} onChange={(e) => setForm({ ...form, architecture: e.target.value })} />
            <div className={styles.tagInput}>
              <input placeholder="添加技术栈" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && techInput.trim()) { setForm({ ...form, techStack: [...(form.techStack || []), techInput.trim()] }); setTechInput(''); } }} />
              <div className={styles.tagList}>{(form.techStack || []).map((t, i) => <span key={i} className={styles.tag}>{t} <button onClick={() => setForm({ ...form, techStack: (form.techStack || []).filter((_, j) => j !== i) })}>×</button></span>)}</div>
            </div>
            <div className={styles.tagInput}>
              <input placeholder="添加亮点" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && highlightInput.trim()) { setForm({ ...form, highlights: [...(form.highlights || []), highlightInput.trim()] }); setHighlightInput(''); } }} />
              <div className={styles.tagList}>{(form.highlights || []).map((h, i) => <span key={i} className={styles.tag}>{h} <button onClick={() => setForm({ ...form, highlights: (form.highlights || []).filter((_, j) => j !== i) })}>×</button></span>)}</div>
            </div>
            <input placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'planned' | 'building' | 'done' })}>
              <option value="planned">计划中</option>
              <option value="building">开发中</option>
              <option value="done">已完成</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button className={styles.saveBtn} onClick={handleSave}>保存</button>
            <button className={styles.cancelBtn} onClick={() => setShowAdd(false)}>取消</button>
          </div>
        </div>
      )}

      {selectedProject ? (
        <div className={styles.detail}>
          <button className={styles.backBtn} onClick={() => setSelected(null)}>← 返回列表</button>
          <div className={styles.detailHeader}>
            <h2>{selectedProject.name}</h2>
            <span className={`${styles.statusBadge} ${selectedProject.status === 'done' ? styles.done : selectedProject.status === 'building' ? styles.building : ''}`}>
              {selectedProject.status === 'done' ? '已完成' : selectedProject.status === 'building' ? '开发中' : '计划中'}
            </span>
          </div>
          <p className={styles.tagline}>{selectedProject.tagline}</p>

          <div className={styles.detailSection}>
            <h3>背景</h3>
            <p>{selectedProject.background}</p>
          </div>

          <div className={styles.detailSection}>
            <h3>技术栈</h3>
            <div className={styles.tagList}>
              {selectedProject.techStack.map((t, i) => <span key={i} className={styles.tag}>{t}</span>)}
            </div>
          </div>

          <div className={styles.detailSection}>
            <h3>架构</h3>
            <p className={styles.arch}>{selectedProject.architecture}</p>
          </div>

          <div className={styles.detailSection}>
            <h3>亮点</h3>
            <ul>{selectedProject.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
          </div>

          {selectedProject.adrs.length > 0 && (
            <div className={styles.detailSection}>
              <h3>技术决策记录 (ADR)</h3>
              {selectedProject.adrs.map((adr, i) => (
                <div key={i} className={styles.adr}>
                  <strong>决策：{adr.decision}</strong>
                  <p>备选：{adr.alternatives.join(' / ')}</p>
                  <p>理由：{adr.rationale}</p>
                </div>
              ))}
            </div>
          )}

          <div className={styles.detailActions}>
            {selectedProject.githubUrl && <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>GitHub →</a>}
            {selectedProject.demoUrl && <a href={selectedProject.demoUrl} target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>Demo →</a>}
            <button className={styles.deleteBtn} onClick={() => { deleteProject(selectedProject.id); setSelected(null); }}>删除项目</button>
          </div>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          {projects.map((p) => (
            <div key={p.id} className={styles.card} onClick={() => setSelected(p.id)}>
              <div className={styles.cardTop}>
                <span className={`${styles.statusBadge} ${p.status === 'done' ? styles.done : p.status === 'building' ? styles.building : ''}`}>
                  {p.status === 'done' ? '✓' : p.status === 'building' ? '●' : '○'}
                </span>
                <h3 className={styles.cardTitle}>{p.name}</h3>
              </div>
              <p className={styles.cardTagline}>{p.tagline}</p>
              <div className={styles.cardTech}>
                {p.techStack.slice(0, 4).map((t, i) => <span key={i} className={styles.tag}>{t}</span>)}
                {p.techStack.length > 4 && <span className={styles.tag}>+{p.techStack.length - 4}</span>}
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className={styles.empty}>
              <span style={{ fontSize: 48 }}>📭</span>
              <p>还没有项目，创建第一个吧</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
