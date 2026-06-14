export type OperationLaw = "職業安全衛生設施規則" | "營造安全衛生設施標準";

export type OperationExamPoint = {
  id: string;
  name: string;
  law: OperationLaw;
  article: string;
  keywords: string[];
};

const lawCodes: Record<OperationLaw, string> = {
  職業安全衛生設施規則: "N0060009",
  營造安全衛生設施標準: "N0060014",
};

export const operationExamPoints: OperationExamPoint[] = [
  { id: "facility-road-use", name: "使用道路作業", law: "職業安全衛生設施規則", article: "21-2", keywords: ["道路", "交通", "管制"] },
  { id: "facility-road-construction", name: "道路挖掘、施工、工程材料吊運作業", law: "職業安全衛生設施規則", article: "21-2", keywords: ["道路挖掘", "施工", "吊運"] },
  { id: "facility-confined-space", name: "局限空間作業", law: "職業安全衛生設施規則", article: "29-1", keywords: ["局限空間", "進入許可", "測定"] },
  { id: "facility-confined-hot-work", name: "局限空間動火作業", law: "職業安全衛生設施規則", article: "29-6", keywords: ["局限空間", "動火", "焊接", "切割"] },
  { id: "facility-oxygen-deficiency", name: "缺氧危險作業", law: "職業安全衛生設施規則", article: "29-7", keywords: ["缺氧", "硫化氫", "作業主管"] },
  { id: "facility-rotary-cutter", name: "鑽孔機、截角機等旋轉刃具作業", law: "職業安全衛生設施規則", article: "56", keywords: ["旋轉刃具", "鑽孔機", "截角機"] },
  { id: "facility-high-pressure-water", name: "高壓水切割作業", law: "職業安全衛生設施規則", article: "63-1", keywords: ["高壓水", "切割", "350kg"] },
  { id: "facility-crane", name: "起重機具作業", law: "職業安全衛生設施規則", article: "88", keywords: ["起重機", "吊掛", "指揮"] },
  { id: "facility-vehicle-construction-machine", name: "車輛系營建機械作業", law: "職業安全衛生設施規則", article: "120", keywords: ["車輛系", "營建機械", "誘導"] },
  { id: "facility-vehicle-machine-repair", name: "車輛系營建機械修理、裝卸作業", law: "職業安全衛生設施規則", article: "121", keywords: ["修理", "附屬裝置", "拆卸"] },
  { id: "facility-aerial-work-platform", name: "高空工作車作業", law: "職業安全衛生設施規則", article: "128-1", keywords: ["高空工作車", "工作台", "指揮"] },
  { id: "facility-aerial-work-platform-repair", name: "高空工作車修理、工作台裝設或拆卸作業", law: "職業安全衛生設施規則", article: "128-4", keywords: ["高空工作車", "修理", "監督"] },
  { id: "facility-stacking", name: "物料積垛作業", law: "職業安全衛生設施規則", article: "161", keywords: ["物料", "積垛", "拆垛"] },
  { id: "facility-hot-work", name: "熔接、熔斷、明火作業", law: "職業安全衛生設施規則", article: "173", keywords: ["熔接", "熔斷", "明火"] },
  { id: "facility-dangerous-material-transfer", name: "危險物灌注、卸收、儲藏作業", law: "職業安全衛生設施規則", article: "186", keywords: ["危險物", "灌注", "卸收"] },
  { id: "facility-chemical-equipment-maintenance", name: "化學設備改善、修理、清掃、拆卸作業", law: "職業安全衛生設施規則", article: "198", keywords: ["化學設備", "修理", "清掃"] },
  { id: "facility-drying", name: "乾燥作業", law: "職業安全衛生設施規則", article: "202", keywords: ["乾燥", "危險物", "可燃性氣體"] },
  { id: "facility-acetylene-welding", name: "乙炔熔接裝置作業", law: "職業安全衛生設施規則", article: "217", keywords: ["乙炔", "熔接", "熔斷"] },
  { id: "facility-gas-welding", name: "氣體集合熔接裝置作業", law: "職業安全衛生設施規則", article: "218", keywords: ["氣體集合", "熔接", "加熱"] },
  { id: "facility-blasting", name: "火藥爆破作業", law: "職業安全衛生設施規則", article: "219", keywords: ["火藥", "爆破", "點火"] },
  { id: "facility-water-work", name: "水上作業", law: "職業安全衛生設施規則", article: "234", keywords: ["水上", "救生", "夜間"] },
  { id: "facility-power-outage", name: "停電作業", law: "職業安全衛生設施規則", article: "254", keywords: ["停電", "電路", "開路"] },
  { id: "facility-live-line", name: "活線作業、活線接近作業", law: "職業安全衛生設施規則", article: "265", keywords: ["活線", "接近界限", "電氣"] },
  { id: "facility-delivery", name: "外送作業", law: "職業安全衛生設施規則", article: "286-3", keywords: ["外送", "交通事故", "天候"] },
  { id: "facility-hazardous-air", name: "有害氣體、蒸氣、粉塵作業", law: "職業安全衛生設施規則", article: "292", keywords: ["有害氣體", "蒸氣", "粉塵"] },
  { id: "facility-bio-contact", name: "易與動、植物接觸作業", law: "職業安全衛生設施規則", article: "295-1", keywords: ["畜牧", "採收", "動植物"] },
  { id: "facility-repetitive-work", name: "重複性作業", law: "職業安全衛生設施規則", article: "324-1", keywords: ["重複性", "人因", "過度施力"] },
  { id: "facility-shift-night-long-work", name: "輪班、夜間、長時間工作等作業", law: "職業安全衛生設施規則", article: "324-2", keywords: ["輪班", "夜間", "長時間"] },

  { id: "construction-high-place", name: "高處作業", law: "營造安全衛生設施標準", article: "17", keywords: ["高處", "二公尺", "墜落"] },
  { id: "construction-roof", name: "屋頂作業", law: "營造安全衛生設施標準", article: "18", keywords: ["屋頂", "易踏穿", "石綿板"] },
  { id: "construction-scaffold", name: "施工架組配作業", law: "營造安全衛生設施標準", article: "41", keywords: ["施工架", "組配", "拆除"] },
  { id: "construction-open-cut", name: "露天開挖作業", law: "營造安全衛生設施標準", article: "63", keywords: ["露天開挖", "地質", "地下埋設物"] },
  { id: "construction-soil-retaining", name: "擋土支撐組配、拆除作業", law: "營造安全衛生設施標準", article: "74", keywords: ["擋土支撐", "組配", "拆除"] },
  { id: "construction-tunnel-excavation", name: "隧道、坑道開挖作業", law: "營造安全衛生設施標準", article: "80", keywords: ["隧道", "坑道", "開挖"] },
  { id: "construction-tunnel", name: "隧道、坑道作業", law: "營造安全衛生設施標準", article: "86", keywords: ["隧道", "坑道", "落磐"] },
  { id: "construction-shield", name: "潛盾工法隧道、坑道開挖作業", law: "營造安全衛生設施標準", article: "101", keywords: ["潛盾", "隧道", "開挖"] },
  { id: "construction-tunnel-lining", name: "隧道等挖掘、襯砌作業", law: "營造安全衛生設施標準", article: "102", keywords: ["隧道", "挖掘", "襯砌"] },
  { id: "construction-compressed-air", name: "壓氣沉箱、壓氣沉筒、壓氣潛盾作業", law: "營造安全衛生設施標準", article: "106", keywords: ["壓氣", "沉箱", "潛盾"] },
  { id: "construction-cofferdam", name: "圍堰作業", law: "營造安全衛生設施標準", article: "107", keywords: ["圍堰", "水位", "土石流"] },
  { id: "construction-pile-equipment", name: "基樁等施工設備裝配、解體、變更、移動作業", law: "營造安全衛生設施標準", article: "124", keywords: ["基樁", "施工設備", "移動"] },
  { id: "construction-form-support", name: "模板支撐組配、拆除作業", law: "營造安全衛生設施標準", article: "133", keywords: ["模板支撐", "組配", "拆除"] },
  { id: "construction-concrete-pouring", name: "混凝土澆置作業", law: "營造安全衛生設施標準", article: "142", keywords: ["混凝土", "澆置", "輸送管"] },
  { id: "construction-pump-concrete", name: "泵送混凝土作業", law: "營造安全衛生設施標準", article: "143", keywords: ["泵送", "混凝土", "輸送"] },
  { id: "construction-steel-assembly", name: "鋼構組配作業", law: "營造安全衛生設施標準", article: "149", keywords: ["鋼構", "組立", "架設", "拆除"] },
  { id: "construction-steel-lifting", name: "鋼構吊運、組配作業", law: "營造安全衛生設施標準", article: "148", keywords: ["鋼構", "吊運", "組配"] },
  { id: "construction-demolition", name: "構造物拆除作業", law: "營造安全衛生設施標準", article: "155", keywords: ["構造物", "拆除", "倒塌"] },
  { id: "construction-water", name: "水面、水下作業", law: "營造安全衛生設施標準", article: "105", keywords: ["水面", "水下", "沉箱"] },
  { id: "construction-asphalt", name: "瀝青作業", law: "營造安全衛生設施標準", article: "156", keywords: ["瀝青", "噴撒", "火傷"] },
];

export function getOperationOfficialUrl(point: OperationExamPoint) {
  return `https://law.moj.gov.tw/LawClass/LawSingle.aspx?pcode=${lawCodes[point.law]}&flno=${point.article}`;
}

export function buildOperationSearchQuery(point: OperationExamPoint) {
  return `乙級職業安全衛生管理員 ${point.law} 第${point.article}條 ${point.name} 作業計畫 作業主管 紀錄 報告書 考古題`;
}
