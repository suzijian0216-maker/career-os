import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { useEnglishStore } from '../stores/englishStore';
import styles from './EnglishPage.module.css';

const statusLabels: Record<string, string> = { unread: '未读', reading: '阅读中', read: '已读', reproduced: '已复现' };

export default function EnglishPage() {
  const { vocabulary, papers, speakingCards, examScores, addVocabRecord, updatePaper, updateSpeaking, addExamScore, getVocabGrowth } = useEnglishStore();

  const [vocabInput, setVocabInput] = useState(3000);
  const [examInput, setExamInput] = useState({ type: 'CET-6阅读', score: 0, totalScore: 710 });
  const [editSpeaking, setEditSpeaking] = useState<string | null>(null);
  const [speakNote, setSpeakNote] = useState('');

  const vocabGrowth = getVocabGrowth();

  // 词汇量折线图
  const vocabOption = {
    xAxis: { type: 'category', data: vocabulary.map((v) => v.date.slice(5)), axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', name: '词汇量', min: 0, axisLabel: { fontSize: 10 } },
    series: [{ data: vocabulary.map((v) => v.count), type: 'line', smooth: true, lineStyle: { color: '#3b82f6' }, areaStyle: { color: 'rgba(59,130,246,0.1)' }, symbol: 'circle', symbolSize: 4 }],
    grid: { left: 40, right: 10, top: 10, bottom: 25 },
  };

  return (
    <div className={styles.page}>
      <h2>🇬🇧 英语 Cockpit</h2>

      <div className={styles.grid}>
        {/* 词汇量追踪 */}
        <div className={styles.section}>
          <h3>📈 词汇量追踪</h3>
          <div className={styles.vocabStats}>
            <div className={styles.vocabStat}>
              <div className={styles.vsValue}>{vocabulary.length > 0 ? vocabulary[vocabulary.length - 1].count : '—'}</div>
              <div className={styles.vsLabel}>当前词汇量</div>
            </div>
            <div className={styles.vocabStat}>
              <div className={`${styles.vsValue} ${vocabGrowth > 0 ? styles.positive : ''}`}>{vocabGrowth > 0 ? `+${vocabGrowth}` : vocabGrowth}</div>
              <div className={styles.vsLabel}>增长量</div>
            </div>
          </div>
          <div className={styles.vocabInput}>
            <input type="number" value={vocabInput} onChange={(e) => setVocabInput(Number(e.target.value))} placeholder="词汇量" />
            <button onClick={() => { addVocabRecord({ date: new Date().toISOString().slice(0, 10), count: vocabInput }); setVocabInput(vocabInput + 200); }}>+ 记录</button>
          </div>
          {vocabulary.length > 0 && <ReactECharts option={vocabOption} style={{ height: 200 }} />}
        </div>

        {/* 论文阅读清单 */}
        <div className={styles.section}>
          <h3>📄 技术论文阅读清单</h3>
          <div className={styles.paperList}>
            {papers.map((p) => (
              <div key={p.id} className={styles.paperItem}>
                <div className={styles.paperInfo}>
                  <div className={styles.paperTitle}>{p.title}</div>
                  <div className={styles.paperAuthors}>{p.authors}</div>
                </div>
                <select value={p.status} onChange={(e) => updatePaper(p.id, { status: e.target.value as 'unread' | 'reading' | 'read' | 'reproduced' })} className={styles.paperSelect}>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* 英语面试闪卡 */}
        <div className={styles.section}>
          <h3>🎤 英语面试</h3>
          {speakingCards.map((c) => (
            <div key={c.id} className={styles.speakCard}>
              <div className={styles.speakQ}>{c.question}</div>
              <div className={styles.speakMeta}>
                <span>自评：{c.selfRating}/5</span>
                {c.notes && <span>笔记：{c.notes}</span>}
              </div>
              <button className={styles.speakBtn} onClick={() => setEditSpeaking(editSpeaking === c.id ? null : c.id)}>✏️</button>
              {editSpeaking === c.id && (
                <div className={styles.speakEdit}>
                  <input type="number" min={0} max={5} value={c.selfRating} onChange={(e) => updateSpeaking(c.id, { selfRating: Number(e.target.value) })} placeholder="自评 0-5" />
                  <input value={speakNote} onChange={(e) => setSpeakNote(e.target.value)} placeholder="笔记..."
                    onKeyDown={(e) => { if (e.key === 'Enter' && speakNote.trim()) { updateSpeaking(c.id, { notes: speakNote }); setSpeakNote(''); setEditSpeaking(null); } }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 考试成绩 */}
        <div className={styles.section}>
          <h3>📝 考试成绩记录</h3>
          <div className={styles.examInput}>
            <select value={examInput.type} onChange={(e) => setExamInput({ ...examInput, type: e.target.value })}>
              <option>CET-6 阅读</option><option>CET-6 翻译</option><option>考研英语</option><option>模拟</option>
            </select>
            <input type="number" placeholder="得分" value={examInput.score || ''} onChange={(e) => setExamInput({ ...examInput, score: Number(e.target.value) })} />
            <span>/</span>
            <input type="number" placeholder="满分" value={examInput.totalScore || ''} onChange={(e) => setExamInput({ ...examInput, totalScore: Number(e.target.value) })} />
            <button onClick={() => { if (examInput.score > 0) { addExamScore(examInput); setExamInput({ type: examInput.type, score: 0, totalScore: examInput.totalScore }); } }}>+</button>
          </div>
          {examScores.length > 0 && (
            <div className={styles.scoreList}>
              {examScores.map((s) => (
                <div key={s.id} className={styles.scoreItem}>
                  <span>{s.date} · {s.type}</span>
                  <strong>{s.score}/{s.totalScore}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
