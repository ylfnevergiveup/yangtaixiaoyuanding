import { plants } from "./plants";

export interface Product {
  id: string;
  name: string;
  category: string;
  emoji: string;
  description: string;
  pros: string[];
  rating: number;
  price: string;
  /** 购买链接（CPS 导购链接） */
  buyLink?: string;
  /** 推荐理由 */
  recommendation: string;
  /** 适合哪些植物 */
  suitableFor: string[];
}

export const products: Product[] = [
  {
    id: "pot-1",
    name: "加仑盆（青山盆）",
    category: "花盆",
    emoji: "🪴",
    description: "目前最流行的阳台种植盆。青山盆侧面有导根槽设计，透气性极佳。",
    pros: ["透气性好", "轻便耐用", "导根防烂根", "口径齐全"],
    rating: 4.5,
    price: "¥5-15/个",
    buyLink: "https://s.click.taobao.com/example-pot1",
    recommendation: "新手首选，性价比最高。种番茄、辣椒选5加仑，种生菜、香草选2-3加仑",
    suitableFor: ["tomato", "chili", "strawberry", "basil", "lettuce"],
  },
  {
    id: "pot-2",
    name: "陶盆（红陶/粗陶）",
    category: "花盆",
    emoji: "🏺",
    description: "经典材质，透气性无与伦比，尤其适合多肉和怕积水的植物。",
    pros: ["极致透气", "自然质感", "水分蒸发均匀"],
    rating: 4,
    price: "¥20-80/个",
    buyLink: "https://s.click.taobao.com/example-pot2",
    recommendation: "多肉、微型月季首选，新盆用前浸泡半小时防止烧根",
    suitableFor: ["succulent-mix", "rose", "mint"],
  },
  {
    id: "tool-1",
    name: "园艺三件套",
    category: "工具",
    emoji: "🔧",
    description: "小铲子、耙子、松土叉黄金组合，日常养护必备。",
    pros: ["一件搞定", "小巧不占空间", "不锈钢耐用"],
    rating: 4.5,
    price: "¥25-60/套",
    buyLink: "https://s.click.taobao.com/example-tool1",
    recommendation: "选择一体成型不锈钢款，不要买胶水粘接的廉价品",
    suitableFor: ["tomato", "basil", "chili", "lettuce", "mint", "green-onion"],
  },
  {
    id: "soil-1",
    name: "通用营养土",
    category: "土壤",
    emoji: "🌍",
    description: "泥炭+珍珠岩+蛭石经典配方，开袋即用。",
    pros: ["无菌无虫卵", "配比科学", "轻便透气"],
    rating: 4.5,
    price: "¥15-30/10L",
    buyLink: "https://s.click.taobao.com/example-soil1",
    recommendation: "推荐美乐棵或花彩师品牌，种果菜加10%羊粪底肥效果更好",
    suitableFor: ["tomato", "basil", "chili", "strawberry", "lettuce", "mint", "rose", "green-onion"],
  },
  {
    id: "fert-1",
    name: "有机液肥（海藻肥）",
    category: "肥料",
    emoji: "🧪",
    description: "天然海藻提取，温和不烧根，阳台种植首选。",
    pros: ["天然有机", "富含微量元素", "不招虫"],
    rating: 4.5,
    price: "¥30-60/瓶",
    buyLink: "https://s.click.taobao.com/example-fert1",
    recommendation: "生长期每7-10天使用一次，花前果期配合磷酸二氢钾效果翻倍",
    suitableFor: ["tomato", "chili", "strawberry", "rose", "basil"],
  },
  {
    id: "seed-1",
    name: "樱桃番茄种子（矮生）",
    category: "种子",
    emoji: "🌱",
    description: "专门为阳台盆栽选育的矮生品种，株型紧凑，结果量大。",
    pros: ["矮生不占空间", "结果多", "适合盆栽"],
    rating: 4.5,
    price: "¥8-15/包",
    buyLink: "https://s.click.taobao.com/example-seed1",
    recommendation: "推荐千禧、金太阳品种，新手用育苗块+播种套装成功率更高",
    suitableFor: ["tomato"],
  },
  {
    id: "seed-2",
    name: "四季草莓苗",
    category: "种子",
    emoji: "🍓",
    description: "四季结果品种盆栽草莓苗，当年即可收获。",
    pros: ["四季结果", "易成活", "观赏性强"],
    rating: 4,
    price: "¥10-20/棵",
    buyLink: "https://s.click.taobao.com/example-seed2",
    recommendation: "选择脱毒种苗，收到后先缓苗3-5天再移栽",
    suitableFor: ["strawberry"],
  },
  {
    id: "pest-1",
    name: "印楝油",
    category: "防病虫害",
    emoji: "🛡️",
    description: "天然植物提取，对蚜虫、红蜘蛛、白粉病都有效，有机可用。",
    pros: ["天然有机", "广谱防病虫", "对人宠安全"],
    rating: 4,
    price: "¥30-50/瓶",
    buyLink: "https://s.click.taobao.com/example-pest1",
    recommendation: "预防每周喷一次，治疗每3天连续喷3次，加几滴洗洁精帮助乳化",
    suitableFor: ["tomato", "chili", "rose", "strawberry", "basil"],
  },
  {
    id: "light-1",
    name: "LED植物补光灯",
    category: "补光",
    emoji: "💡",
    description: "专为室内和北向阳台设计的全光谱补光灯，解决光照不足问题。",
    pros: ["全光谱", "能耗低", "安装简单"],
    rating: 4,
    price: "¥60-150/个",
    buyLink: "https://s.click.taobao.com/example-light1",
    recommendation: "北向或封闭阳台必备，每天开6-8小时，距离植物30-50cm",
    suitableFor: ["lettuce", "mint", "basil"],
  },
  {
    id: "rack-1",
    name: "多层种植架",
    category: "支架",
    emoji: "📐",
    description: "节省空间的阳台神器，可放多盆植物，适合小阳台。",
    pros: ["节省空间", "承重稳定", "可调节层高"],
    rating: 4.5,
    price: "¥80-200/个",
    buyLink: "https://s.click.taobao.com/example-rack1",
    recommendation: "小阳台必备，选择碳钢材质更耐用，层高至少40cm以上",
    suitableFor: ["succulent-mix", "lettuce", "mint", "basil", "green-onion"],
  },
  {
    id: "auto-water-1",
    name: "自动浇花器",
    category: "工具",
    emoji: "💧",
    description: "出差旅行神器，毛细绳导水或电子定时两种类型可选。",
    pros: ["出差无忧", "安装简单", "价格实惠"],
    rating: 4,
    price: "¥15-100",
    buyLink: "https://s.click.taobao.com/example-water1",
    recommendation: "短期出差选毛细绳款（3-5天），超过一周选电子定时款",
    suitableFor: ["tomato", "chili", "strawberry", "basil", "mint", "lettuce"],
  },
];

export const productCategories = [
  { value: "all", label: "全部" },
  { value: "花盆", label: "花盆" },
  { value: "工具", label: "工具" },
  { value: "土壤", label: "土壤" },
  { value: "肥料", label: "肥料" },
  { value: "种子", label: "种子" },
  { value: "防病虫害", label: "防病虫害" },
  { value: "补光", label: "补光灯" },
  { value: "支架", label: "种植架" },
];

/** 根据植物 id 获取推荐商品 */
export function getProductsForPlant(plantId: string): Product[] {
  const plant = plants.find((p) => p.id === plantId);
  if (!plant?.productIds) return [];
  return plant.productIds
    .map((pid) => products.find((p) => p.id === pid))
    .filter(Boolean) as Product[];
}
