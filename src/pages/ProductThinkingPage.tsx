import { useState } from 'react';
import { useProductStore } from '../stores/productStore';
import styles from './ProductThinkingPage.module.css';

export default function ProductThinkingPage() {
  const { ideas, competitors, caseStudies, addIdea, updateIdea, deleteIdea, addCaseStudy } = useProductStore();
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [ideaForm, setIdeaForm] = useState({ title: '', description: '', feasibility: 3, businessValue: 3, status: 'draft' as const });
  const [caseForm, setCaseForm] = useState({ title: '', company: '', domain: '金融', techUsed: '', businessModel: '', keyTakeaway: '', url: '' });
  const [techInput, setTechInput] = useState('');

  return (
    <div className={styles.page}>
      <h2>💡 产品思维角</h2>

      <div className={styles.grid}>
        {/* 灵感速记板 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>💭 灵感速记板</h3>
            <button className={styles.smallBtn} onClick={() => setShowIdeaForm(!showIdeaForm)}>+ 新想法</button>
          </div>
          {showIdeaForm && (
            <div className={styles.ideaForm}>
              <input placeholder="标题" value={ideaForm.title} onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })} />
              <textarea placeholder="描述" rows={3} value={ideaForm.description} onChange={(e) => setIdeaForm({ ...ideaForm, description: e.target.value })} />
              <div className={styles.formRow}>
                <label>可行性 <input type="number" min={1} max={5} value={ideaForm.feasibility} onChange={(e) => setIdeaForm({ ...ideaForm, feasibility: Number(e.target.value) })} /></label>
                <label>商业价值 <input type="number" min={1} max={5} value={ideaForm.businessValue} onChange={(e) => setIdeaForm({ ...ideaForm, businessValue: Number(e.target.value) })} /></label>
              </div>
              <button className={styles.saveBtn} onClick={() => { if (ideaForm.title) { addIdea(ideaForm); setIdeaForm({ title: '', description: '', feasibility: 3, businessValue: 3, status: 'draft' }); setShowIdeaForm(false); } }}>保存</button>
            </div>
          )}
          <div className={styles.ideaList}>
            {ideas.map((idea) => (
              <div key={idea.id} className={styles.ideaCard}>
                <div className={styles.ideaHeader}>
                  <strong>{idea.title}</strong>
                  <select value={idea.status} onChange={(e) => updateIdea(idea.id, { status: e.target.value as 'draft' | 'researching' | 'building' | 'abandoned' })} className={styles.statusSelect}>
                    <option value="draft">草稿</option><option value="researching">调研中</option><option value="building">开发中</option><option value="abandoned">已放弃</option>
                  </select>
                </div>
                <p>{idea.description}</p>
                <div className={styles.ideaMeta}>
                  <span>可行性 {'⭐'.repeat(idea.feasibility)}</span>
                  <span>商业价值 {'💰'.repeat(idea.businessValue)}</span>
                  <span>{idea.createdAt}</span>
                  <button className={styles.delBtn} onClick={() => deleteIdea(idea.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 竞品拆解 */}
        <div className={styles.section}>
          <h3>🔍 竞品拆解</h3>
          {competitors.map((comp) => (
            <details key={comp.id} className={styles.compCard}>
              <summary className={styles.compSummary}>
                <strong>{comp.product}</strong>
                <span className={styles.compCompany}>{comp.company}</span>
              </summary>
              <p className={styles.compStrategy}>策略：{comp.strategy}</p>
              <p className={styles.compPricing}>定价：{comp.pricing}</p>
              <div className={styles.compFeatures}>
                <strong>功能迭代：</strong>
                {comp.features.map((f, i) => (
                  <div key={i} className={styles.featureItem}>
                    <span className={styles.featName}>{f.name} ({f.releaseDate})</span>
                    <span className={styles.featTake}>我的看法：{f.myTake}</span>
                  </div>
                ))}
              </div>
              <div className={styles.compUpdated}>更新于 {comp.lastUpdated}</div>
            </details>
          ))}
        </div>

        {/* AI 落地案例 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>📖 AI 落地案例</h3>
            <button className={styles.smallBtn} onClick={() => setShowCaseForm(!showCaseForm)}>+ 新案例</button>
          </div>
          {showCaseForm && (
            <div className={styles.ideaForm}>
              <input placeholder="标题" value={caseForm.title} onChange={(e) => setCaseForm({ ...caseForm, title: e.target.value })} />
              <input placeholder="公司" value={caseForm.company} onChange={(e) => setCaseForm({ ...caseForm, company: e.target.value })} />
              <input placeholder="领域" value={caseForm.domain} onChange={(e) => setCaseForm({ ...caseForm, domain: e.target.value })} />
              <div className={styles.formRow}>
                <input placeholder="技术栈 (逗号分隔)" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && techInput.trim()) { setCaseForm({ ...caseForm, techUsed: techInput }); setTechInput(''); } }} />
              </div>
              <textarea placeholder="商业模式" rows={2} value={caseForm.businessModel} onChange={(e) => setCaseForm({ ...caseForm, businessModel: e.target.value })} />
              <textarea placeholder="关键 takeaways" rows={2} value={caseForm.keyTakeaway} onChange={(e) => setCaseForm({ ...caseForm, keyTakeaway: e.target.value })} />
              <button className={styles.saveBtn} onClick={() => { if (caseForm.title) { addCaseStudy({ ...caseForm, techUsed: caseForm.techUsed ? caseForm.techUsed.split(',').map((t) => t.trim()) : [] }); setCaseForm({ title: '', company: '', domain: '金融', techUsed: '', businessModel: '', keyTakeaway: '', url: '' }); setShowCaseForm(false); } }}>保存</button>
            </div>
          )}
          {caseStudies.map((cs) => (
            <div key={cs.id} className={styles.caseCard}>
              <div className={styles.caseHeader}>
                <strong>{cs.title}</strong>
                <span>{cs.company} · {cs.domain}</span>
              </div>
              <div className={styles.caseMeta}>
                <span>技术栈：{cs.techUsed.join(', ')}</span>
                <span>模式：{cs.businessModel}</span>
              </div>
              <p className={styles.caseTakeaway}>💡 {cs.keyTakeaway}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
