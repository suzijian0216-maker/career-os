import { useState } from 'react';
import { useFinanceStore } from '../stores/financeStore';
import styles from './FinancePage.module.css';

const cityIds = ['beijing', 'wuhan', 'nanchang', 'shenzhen'];

export default function FinancePage() {
  const { cities, getCity, updateCity, targetHouseSize, setTargetHouseSize, targetSavings, setTargetSavings, calcNetSalary, calcMonthlySavings, calcHouseYears, calcSavingsYears } = useFinanceStore();
  const [salaryInputs, setSalaryInputs] = useState<Record<string, number>>({ beijing: 30, wuhan: 22, nanchang: 15, shenzhen: 35 });

  return (
    <div className={styles.page}>
      <h2 className={styles.pageTitle}>💰 生存账本</h2>
      <p className={styles.subtitle}>输入各城市的预期起薪（万/年），模拟购房和储蓄时间线</p>

      {/* 目标设置 */}
      <div className={styles.settings}>
        <div className={styles.settingItem}>
          <label>目标住房面积 (㎡)</label>
          <input type="number" value={targetHouseSize} onChange={(e) => setTargetHouseSize(Number(e.target.value))} min={30} max={200} />
        </div>
        <div className={styles.settingItem}>
          <label>储蓄目标 (万元)</label>
          <input type="number" value={targetSavings} onChange={(e) => setTargetSavings(Number(e.target.value))} min={10} max={500} />
        </div>
      </div>

      {/* 四城对比 */}
      <div className={styles.cardGrid}>
        {cityIds.map((cid) => {
          const city = getCity(cid);
          const gross = salaryInputs[cid] || 0;
          const { net, pf } = calcNetSalary(gross, cid);
          const monthlySavings = calcMonthlySavings(gross, cid);
          const houseYears = calcHouseYears(gross, cid);
          const savingsYears = calcSavingsYears(gross, cid, targetSavings);
          const monthlyExp = city.rent + city.commute + city.food + city.social + city.parents + city.other;

          return (
            <div key={cid} className={styles.cityCard}>
              <h3 className={styles.cityName}>{city.city}</h3>
              <div className={styles.cityInput}>
                <label>预期年薪 (万)</label>
                <input type="number" value={gross} onChange={(e) => setSalaryInputs({ ...salaryInputs, [cid]: Number(e.target.value) })} min={5} max={200} />
              </div>
              <div className={styles.cityStats}>
                <div className={styles.cityStat}><span>税后年收入</span><strong>{net}w</strong></div>
                <div className={styles.cityStat}><span>公积金/月</span><strong>¥{pf}</strong></div>
                <div className={styles.cityStat}><span>月储蓄</span><strong className={monthlySavings < 0 ? styles.negative : ''}>¥{monthlySavings}</strong></div>
                <div className={styles.cityStat}><span>月开支</span><strong>¥{monthlyExp}</strong></div>
                <div className={styles.cityStat} style={{ borderTop: '1px solid var(--border)', paddingTop: 8, marginTop: 4 }}>
                  <span>🏠 购房首付</span><strong>{houseYears >= 999 ? '😰 不可能' : `${houseYears} 年`}</strong>
                </div>
                <div className={styles.cityStat}>
                  <span>💰 攒到{targetSavings}万</span><strong>{savingsYears >= 999 ? '😰 不可能' : `${savingsYears} 年`}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 购房时间线柱状图 */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🏠 购房首付年限对比 (目标 {targetHouseSize}㎡)</h3>
        <div className={styles.barChart}>
          {cityIds.map((cid) => {
            const city = getCity(cid);
            const gross = salaryInputs[cid] || 0;
            const years = calcHouseYears(gross, cid);
            const maxYears = 30;
            const pct = Math.min(100, (years / maxYears) * 100);
            return (
              <div key={cid} className={styles.barRow}>
                <span className={styles.barLabel}>{city.city}</span>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${pct}%`, background: years <= 5 ? 'var(--accent2)' : years <= 10 ? 'var(--accent)' : years <= 20 ? 'var(--warning)' : 'var(--danger)' }}>
                    <span>{years} 年</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 开支拼图 */}
      {cityIds.map((cid) => {
        const city = getCity(cid);
        const items = [
          { label: '房租', value: city.rent, key: 'rent' as const },
          { label: '通勤', value: city.commute, key: 'commute' as const },
          { label: '餐饮', value: city.food, key: 'food' as const },
          { label: '社交', value: city.social, key: 'social' as const },
          { label: '父母', value: city.parents, key: 'parents' as const },
          { label: '其他', value: city.other, key: 'other' as const },
        ];
        const total = items.reduce((s, i) => s + i.value, 0);
        return (
          <div key={cid} className={styles.section} style={{ marginTop: 12 }}>
            <h3 className={styles.sectionTitle}>📊 {city.city} 月开支明细 (总计 ¥{total})</h3>
            <div className={styles.expenseGrid}>
              {items.map((item) => (
                <div key={item.key} className={styles.expenseItem}>
                  <span>{item.label}</span>
                  <input type="number" value={item.value} onChange={(e) => updateCity(cid, { [item.key]: Number(e.target.value) })} min={0} max={50000} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
