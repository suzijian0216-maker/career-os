import { create } from 'zustand';
import { loadLS, saveLS } from '../utils/storage';

export interface CityFinanceData {
  id: string;
  city: string;
  avgHousePrice: number;    // 元/㎡
  providentFundRate: number;
  providentFundCap: number;
  rent: number;
  commute: number;
  food: number;
  social: number;
  parents: number;
  other: number;
}

const defaults: Record<string, CityFinanceData> = {
  beijing: { id: 'beijing', city: '北京', avgHousePrice: 60000, providentFundRate: 12, providentFundCap: 8000, rent: 4000, commute: 300, food: 2500, social: 1500, parents: 1000, other: 1000 },
  wuhan: { id: 'wuhan', city: '武汉', avgHousePrice: 18000, providentFundRate: 12, providentFundCap: 5000, rent: 1800, commute: 150, food: 1800, social: 1000, parents: 800, other: 600 },
  nanchang: { id: 'nanchang', city: '南昌', avgHousePrice: 12000, providentFundRate: 12, providentFundCap: 4000, rent: 1200, commute: 100, food: 1200, social: 800, parents: 500, other: 500 },
  shenzhen: { id: 'shenzhen', city: '深圳', avgHousePrice: 55000, providentFundRate: 12, providentFundCap: 7500, rent: 3500, commute: 300, food: 2500, social: 1500, parents: 1000, other: 1000 },
};

interface FinanceState {
  cities: Record<string, CityFinanceData>;
  targetHouseSize: number;
  targetSavings: number;

  getCity: (id: string) => CityFinanceData;
  updateCity: (id: string, data: Partial<CityFinanceData>) => void;
  setTargetHouseSize: (s: number) => void;
  setTargetSavings: (s: number) => void;

  calcNetSalary: (gross: number, cityId: string) => { net: number; pf: number; tax: number; socialIns: number };
  calcMonthlySavings: (gross: number, cityId: string) => number;
  calcHouseYears: (gross: number, cityId: string) => number;
  calcSavingsYears: (gross: number, cityId: string, target: number) => number;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  cities: loadLS('financeCities', defaults),
  targetHouseSize: loadLS('targetHouseSize', 90),
  targetSavings: loadLS('targetSavings', 50),

  getCity: (id) => get().cities[id] || defaults.beijing,
  updateCity: (id, data) => {
    const cities = { ...get().cities, [id]: { ...get().cities[id], ...data } };
    set({ cities });
    saveLS('financeCities', cities);
  },
  setTargetHouseSize: (s) => { set({ targetHouseSize: s }); saveLS('targetHouseSize', s); },
  setTargetSavings: (s) => { set({ targetSavings: s }); saveLS('targetSavings', s); },

  calcNetSalary: (gross, cityId) => {
    const city = get().getCity(cityId);
    const annualGross = gross * 10000;
    const monthlyGross = annualGross / 12;
    const pfBase = Math.min(monthlyGross, city.providentFundCap);
    const pf = pfBase * city.providentFundRate * 2 / 100;
    const socialIns = monthlyGross * 0.105;
    const taxable = monthlyGross - socialIns - 5000;
    let tax = 0;
    if (taxable > 80000) tax = taxable * 0.45 - 15160;
    else if (taxable > 55000) tax = taxable * 0.35 - 7160;
    else if (taxable > 35000) tax = taxable * 0.30 - 4410;
    else if (taxable > 25000) tax = taxable * 0.25 - 2660;
    else if (taxable > 12000) tax = taxable * 0.20 - 1410;
    else if (taxable > 3000) tax = taxable * 0.10 - 210;
    else if (taxable > 0) tax = taxable * 0.03;
    const netMonthly = monthlyGross - socialIns - tax;
    return {
      net: Math.round(netMonthly / 10000 * 12 * 100) / 100,
      pf: Math.round(pf),
      tax: Math.round(tax),
      socialIns: Math.round(socialIns),
    };
  },

  calcMonthlySavings: (gross, cityId) => {
    const city = get().getCity(cityId);
    const { net } = get().calcNetSalary(gross, cityId);
    const monthlyNet = net * 10000 / 12;
    const monthlyExp = city.rent + city.commute + city.food + city.social + city.parents + city.other;
    return Math.round(monthlyNet - monthlyExp);
  },

  calcHouseYears: (gross, cityId) => {
    const city = get().getCity(cityId);
    const savings = get().calcMonthlySavings(gross, cityId);
    if (savings <= 0) return 999;
    const totalPrice = city.avgHousePrice * get().targetHouseSize;
    const downPayment = totalPrice * 0.3;
    return Math.round(downPayment / (savings * 12) * 10) / 10;
  },

  calcSavingsYears: (gross, cityId, target) => {
    const savings = get().calcMonthlySavings(gross, cityId);
    if (savings <= 0) return 999;
    return Math.round(target / (savings * 12) * 10) / 10;
  },
}));
