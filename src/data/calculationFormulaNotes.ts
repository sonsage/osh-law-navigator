export type CalculationFormulaGroup = {
  title: string;
  formulas: {
    name: string;
    expression: string;
    sourceType?: "law" | "exam" | "conversion";
    sourceLabel?: string;
    note?: string;
  }[];
};

export const calculationFormulaGroups: CalculationFormulaGroup[] = [
  {
    title: "失能傷害統計",
    formulas: [
      { name: "失能傷害頻率 FR", expression: "失能傷害人次*1000000/總工時", sourceType: "exam", sourceLabel: "考場統計式" },
      { name: "失能傷害嚴重率 SR", expression: "損失日數*1000000/總工時", sourceType: "exam", sourceLabel: "考場統計式" },
      { name: "總合傷害指數 FSI", expression: "sqrt(FR*SR/1000)", sourceType: "exam", sourceLabel: "考場統計式" },
      { name: "千人率", expression: "傷害人數*1000/平均勞工人數", sourceType: "exam", sourceLabel: "考場統計式" },
      { name: "年千人率換算", expression: "期間傷害人數*1000*365/(平均勞工人數*期間天數)", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "平均損失日數", expression: "總損失日數/失能傷害人次", sourceType: "exam", sourceLabel: "考場換算式" },
    ],
  },
  {
    title: "噪音",
    formulas: [
      { name: "等能量音壓級 Leq", expression: "10*log((t1*10^(L1/10)+t2*10^(L2/10)+t3*10^(L3/10))/(t1+t2+t3))", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "兩音源合成", expression: "10*log(10^(L1/10)+10^(L2/10))", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "多音源合成", expression: "10*log(10^(L1/10)+10^(L2/10)+10^(L3/10))", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "相同音源 N 台合成", expression: "單台dB+10*log(N)", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "聲壓比換 dB", expression: "20*log(P/P0)", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "聲功率比換 dB", expression: "10*log(W/W0)", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "距離衰減", expression: "L1-20*log(r2/r1)", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "噪音劑量 D%", expression: "(C1/T1+C2/T2+C3/T3)*100", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "5 dB 交換率容許時間 T", expression: "8/(2^((L-90)/5))", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "劑量換 TWA", expression: "16.61*log(D/100)+90", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "TWA 換劑量%", expression: "100*10^((TWA-90)/16.61)", sourceType: "exam", sourceLabel: "考場換算式" },
    ],
  },
  {
    title: "化學暴露與採樣",
    formulas: [
      { name: "採樣體積 m3", expression: "流量L/min*時間min/1000", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "濃度 mg/m3", expression: "採得質量mg/採樣體積m3", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "ug 質量換濃度", expression: "採得質量ug/1000/採樣體積m3", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "ppm 轉 mg/m3", expression: "ppm*分子量/24.45", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "mg/m3 轉 ppm", expression: "mg/m3*24.45/分子量", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "8 小時 TWA", expression: "(C1*T1+C2*T2+C3*T3)/8", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "一般時間加權平均", expression: "(C1*T1+C2*T2+C3*T3)/(T1+T2+T3)", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "混合有害物暴露指數", expression: "C1/TLV1+C2/TLV2+C3/TLV3", sourceType: "exam", sourceLabel: "考場換算式", note: "大於 1 通常判定超標。" },
      { name: "空白校正質量", expression: "樣品質量-空白質量", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "去除率%", expression: "(入口濃度-出口濃度)/入口濃度*100", sourceType: "conversion", sourceLabel: "一般換算式" },
    ],
  },
  {
    title: "綜合溫度熱指數 WBGT",
    formulas: [
      { name: "室內或室外無日曬", expression: "0.7*自然濕球溫度+0.3*黑球溫度", sourceType: "law", sourceLabel: "法規原式" },
      { name: "室外有日曬", expression: "0.7*自然濕球溫度+0.2*黑球溫度+0.1*乾球溫度", sourceType: "law", sourceLabel: "法規原式" },
      { name: "分時 WBGT 平均", expression: "(WBGT1*t1+WBGT2*t2+WBGT3*t3)/(t1+t2+t3)", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "工作休息代謝率平均", expression: "(M工作*t工作+M休息*t休息)/(t工作+t休息)", sourceType: "exam", sourceLabel: "考場換算式" },
    ],
  },
  {
    title: "通風與換氣",
    formulas: [
      { name: "風量 Q", expression: "風速*截面積", sourceType: "conversion", sourceLabel: "文字換算式", note: "非法規原式；有機、特化、粉塵等題目若引用法規或附表，優先用該法規原式。" },
      { name: "圓管截面積", expression: "3.1416*直徑^2/4", sourceType: "conversion", sourceLabel: "幾何換算式" },
      { name: "矩形風管截面積", expression: "長*寬", sourceType: "conversion", sourceLabel: "幾何換算式" },
      { name: "換氣次數 ACH，Q 為 m3/hr", expression: "Q/空間體積", sourceType: "conversion", sourceLabel: "文字換算式", note: "非法規原式；題目若給法規條件，回原法規或附表確認。" },
      { name: "換氣次數 ACH，Q 為 m3/min", expression: "Q*60/空間體積", sourceType: "conversion", sourceLabel: "文字換算式", note: "非法規原式；題目若給法規條件，回原法規或附表確認。" },
      { name: "已知 ACH 求所需風量", expression: "ACH*空間體積/60", sourceType: "conversion", sourceLabel: "文字換算式", note: "非法規原式；題目若給法規條件，回原法規或附表確認。" },
      { name: "捕集效率%", expression: "捕集量/產生量*100", sourceType: "conversion", sourceLabel: "文字換算式" },
      { name: "稀釋後濃度，完全混合", expression: "產生率/通風量", sourceType: "conversion", sourceLabel: "概念換算式", note: "僅作概念換算；職安乙級法規題優先查有機、特化、粉塵等原條文。" },
      { name: "兩風量混合濃度", expression: "(Q1*C1+Q2*C2)/(Q1+Q2)", sourceType: "conversion", sourceLabel: "概念換算式" },
    ],
  },
  {
    title: "照明",
    formulas: [
      { name: "照度 E", expression: "光通量/面積", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "總光通量需求", expression: "照度*面積/(利用率*維護率)", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "燈具數", expression: "照度*面積/(每盞光通量*利用率*維護率)", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "平均照度", expression: "(E1+E2+E3+E4+E5)/點數", sourceType: "conversion", sourceLabel: "一般換算式" },
    ],
  },
  {
    title: "吊掛與力學",
    formulas: [
      { name: "重量", expression: "質量kg*9.8", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "安全係數", expression: "破斷強度/使用荷重", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "使用荷重", expression: "破斷強度/安全係數", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "兩索等角吊掛，單索張力", expression: "重量/(2*cos(與垂直夾角))", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "兩索夾角為 theta，單索張力", expression: "重量/(2*cos(theta/2))", sourceType: "exam", sourceLabel: "考場換算式" },
      { name: "滑動摩擦力", expression: "摩擦係數*正向力", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "功", expression: "力*距離", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "功率", expression: "功/時間", sourceType: "conversion", sourceLabel: "一般換算式" },
    ],
  },
  {
    title: "火災、爆炸與單位",
    formulas: [
      { name: "爆炸下限百分比", expression: "可燃氣體體積/混合氣體總體積*100", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "稀釋後濃度", expression: "原濃度*原體積/稀釋後總體積", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "LEL%", expression: "實際濃度/爆炸下限*100", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "蒸氣密度，空氣=1", expression: "分子量/29", sourceType: "conversion", sourceLabel: "一般換算式" },
      { name: "L 轉 m3", expression: "L/1000", sourceType: "conversion", sourceLabel: "單位換算" },
      { name: "cm2 轉 m2", expression: "cm2/10000", sourceType: "conversion", sourceLabel: "單位換算" },
      { name: "ug 轉 mg", expression: "ug/1000", sourceType: "conversion", sourceLabel: "單位換算" },
      { name: "攝氏轉絕對溫度", expression: "C+273", sourceType: "conversion", sourceLabel: "單位換算" },
    ],
  },
];
