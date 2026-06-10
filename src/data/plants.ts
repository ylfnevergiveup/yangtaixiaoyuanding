import { getCities, searchCities as searchCitiesFn, getProvinces as getProvincesFn, getCitiesByProvince as getCitiesByProvinceFn, type CityClimate } from "./cities";

export interface Plant {
  [key: string]: any;
  _id?: string;
  id: string;
  name: string;
  scientificName: string;
  category: "vegetable" | "herb" | "succulent" | "flower" | "fruit" | "foliage" | "bulb" | "aquatic" | "mushroom";
  difficulty: "easy" | "medium" | "hard";
  season: string[];
  sunlight: "full" | "partial" | "shade";
  water: "low" | "medium" | "high";
  harvestDays: number;
  description: string;
  tips: string | string[];
  image?: string;
  featured?: boolean;
  balconyFit: string;
  suitableOrientations: ("south" | "east" | "west" | "north")[];
  minPotDepth: number;
  suitablePot: string;
  minTemp: number;
  productIds?: string[];
}

// 阳台类型
export const balconyTypes = [
  { id: "south", name: "朝南阳台", emoji: "☀️", light: "全日照 6-8 小时", desc: "阳光充沛，适合大多数植物", caution: "", isSpecial: false },
  { id: "east", name: "朝东阳台", emoji: "🌅", light: "上午光照 3-4 小时", desc: "光照柔和，适合半阴植物", caution: "", isSpecial: false },
  { id: "west", name: "朝西阳台", emoji: "🌇", light: "下午光照 4-5 小时", desc: "午后强烈的阳光，注意遮阳", caution: "夏季午后需适当遮阳，避免强光灼伤植物叶片", isSpecial: false },
  { id: "north", name: "朝北阳台", emoji: "🌥️", light: "散射光为主", desc: "光照最少，选择耐阴植物", caution: "冬季光照严重不足，尽量选择耐阴品种", isSpecial: false },
  { id: "enclosed", name: "封闭阳台", emoji: "🪟", light: "透过玻璃的光", desc: "恒温恒湿，但紫外线被玻璃过滤", caution: "紫外线被玻璃阻挡，部分植物可能徒长，注意定期通风", isSpecial: true },
];

// 植物分类
export const categories = [
  { value: "all", label: "全部" },
  { value: "vegetable", label: "蔬菜" },
  { value: "herb", label: "香草" },
  { value: "succulent", label: "多肉" },
  { value: "flower", label: "花卉" },
  { value: "fruit", label: "水果" },
  { value: "foliage", label: "观叶" },
  { value: "bulb", label: "球根花卉" },
  { value: "aquatic", label: "水生植物" },
  { value: "mushroom", label: "食用菌" },
];

// 种植难度
export const difficulties = [
  { value: "all", label: "全部" },
  { value: "easy", label: "新手友好" },
  { value: "medium", label: "稍有挑战" },
  { value: "hard", label: "进阶玩家" },
];

// 城市数据（从 cities.ts 重新导出）
export const cities: CityClimate[] = getCities();
export const searchCities = searchCitiesFn;
export const getProvinces = getProvincesFn;
export const getCitiesByProvince = getCitiesByProvinceFn;

export const plants: Plant[] = 
[
  {
    "_id": "6a1c585e2ff00cb3452b1d69",
    "id": "coriander",
    "name": "香菜",
    "scientificName": "Coriandrum sativum",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "香菜喜冷凉气候",
      "最适宜生长温度 15-22℃",
      "超过 25℃生长缓慢且易抽薹开花",
      "低于 5℃停止生长。 北方地区：春播 3 月中旬 - 4 月下旬",
      "秋播 8 月下旬 - 10 月上旬 南方地区：春播 2 月下旬 - 4 月上旬",
      "秋播 9 月上旬 - 11 月下旬 冬季：室内有暖气（温度保持 15℃以上）可全年种植 夏季避坑：6-8 月尽量不要露地种植",
      "若要种植需选择耐抽薹品种",
      "并全程遮阴降温"
    ],
    "sunlight": "partial",
    "water": "medium",
    "harvestDays": 25,
    "description": "<p>香菜是厨房必备调味菜。生长期短，播种后25天即可采摘，适合在阳台小面积种植。</p>",
    "tips": "<p>种子压碎后浸泡12小时再播种，发芽更快</p><p>喜凉爽，高温易抽薹开花</p><p>分批播种可实现持续供应</p>",
    "image": "https://7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcb.qcloud.la/images/2026-06/1780662202148-416ddc1a.png?sign=22593dcbadb161af697071ee6524e815&t=1780662202",
    "balconyFit": "<p>耐半阴，东向或北向阳台也能长好，夏季需适当遮阴</p>",
    "suitableOrientations": [
      "east",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "长条盆或浅型种植箱",
    "minTemp": 5,
    "featured": false,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-06-05T12:23:24.669Z",
    "status": "published",
    "imagePosition": "50% 20%"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d68",
    "id": "lavender",
    "name": "薰衣草",
    "scientificName": "Lavandula angustifolia",
    "category": "flower",
    "difficulty": "medium",
    "season": [
      "春",
      "夏",
      "冬"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 30,
    "description": "薰衣草香气宜人，能助眠安神。盆栽放在阳台或窗台，紫蓝色花穗极具观赏性。",
    "tips": [
      "需排水良好的沙质土壤",
      "浇水宁干勿湿，忌积水",
      "花后及时修剪可促进再次开花"
    ],
    "image": "/images/plants/lavender.jpg",
    "balconyFit": "需要充足阳光和良好通风，适合南向阳台",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 20,
    "suitablePot": "透气陶盆或加仑盆（口径25cm以上）",
    "minTemp": 5,
    "featured": false,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-06-02T14:01:12.583Z",
    "status": "published"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d67",
    "id": "green-bean",
    "name": "四季豆",
    "scientificName": "Phaseolus vulgaris",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 50,
    "description": "四季豆是阳台垂直种植的好选择，茎蔓攀爬生长，既遮阴又能收获鲜嫩的豆荚。",
    "tips": [
      "需要搭架或网格供其攀爬",
      "开花结荚期需要充足水分",
      "不宜连作，种植后需轮换位置"
    ],
    "image": "/images/plants/green-bean.jpg",
    "balconyFit": "需充足阳光，适合南向或西向阳台，垂直种植节省空间",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 25,
    "suitablePot": "深型花盆或种植箱（30cm以上深度）",
    "minTemp": 10,
    "featured": false,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-05-31T15:48:45.031Z"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d66",
    "id": "tomato",
    "name": "番茄",
    "scientificName": "Solanum lycopersicum",
    "category": "vegetable",
    "difficulty": "medium",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 60,
    "description": "<p>阳台最受欢迎的蔬菜之一。樱桃番茄品种尤其适合盆栽，果实累累，观赏性极佳。</p>",
    "tips": "<p>一、最佳种植季节（精准到月份）</p><p>• 南方地区（广东、广西、福建、海南等）：</p><p>◦ 春播：2月中旬-3月上旬（最佳），4-7月收获</p><p>◦ 秋播：8月下旬-9月上旬，11月-次年1月收获</p><p>◦ 冬季：11月上旬播种，需放在室内温暖处，次年2-4月收获</p><p>• 长江流域：</p><p>◦ 春播：3月中旬-4月上旬，6-8月收获</p><p>◦ 秋播：7月下旬-8月上旬，10-11月收获</p><p>• 北方地区：</p><p>◦ 春播：4月中旬-5月上旬（室内育苗可提前至3月），7-9月收获</p><p>◦ 秋播：不建议露地，室内可6月下旬播种，9-10月收获</p><p>关键提示：番茄最适宜生长温度为20-28℃，低于10℃停止生长，高于35℃会落花落果。</p><p>二、品种选择（阳台专属）</p><p>优先选择矮生、早熟、抗病、株高不超过1米的品种，无需搭架或只需简单支撑：</p><p>• 樱桃番茄（圣女果）：千禧、釜山88、黑珍珠、金太阳（单果重10-20g，产量高，口感好）</p><p>• 矮生大番茄：矮生红珍珠、小矮人、阳台丰收（单果重100-200g，适合盆栽）</p><p>• 特色品种：马蹄番茄（沙瓤）、绿宝石（绿色成熟）、黑美人（紫黑色）</p><p>三、准备工作</p><p>1. 容器选择</p><p>• 大小要求：单株番茄需要直径25cm以上、深度30cm以上的花盆，容量≥10L</p><p>• 材质：陶盆、塑料盆、加仑盆均可，底部必须有排水孔</p><p>• 数量：一个标准阳台（3-4㎡）可种植6-8株</p><p>2. 土壤配比（新手直接用这个配方）</p><p>• 通用配方：泥炭土6份+珍珠岩2份+腐熟有机肥2份</p><p>• 简易配方：园土4份+腐叶土4份+河沙2份</p><p>• 底肥：每盆加入100g腐熟羊粪或鸡粪，与底部土壤混合均匀</p><p>注意：不要直接使用纯园土，容易板结；不要使用未腐熟的生肥，会烧根。</p><p>四、播种与育苗（最关键步骤）</p><p>1. 种子处理</p><p>• 用55℃温水浸泡种子15分钟，不断搅拌</p><p>• 然后用常温清水浸泡6-8小时</p><p>• 捞出后用湿纱布包裹，放在25-30℃环境下催芽，每天用清水冲洗1次</p><p>• 2-3天后，种子露白即可播种</p><p>2. 播种</p><p>• 在育苗盘或小纸杯里装入育苗土，浇透水</p><p>• 每个穴播1粒露白的种子，覆盖0.5-1cm厚的细土</p><p>• 盖上保鲜膜，扎几个小孔透气</p><p>• 放在25-30℃的温暖处，保持土壤湿润</p><p>3. 育苗管理</p><p>• 出苗前：不需要光照，每天检查土壤湿度，干了就喷点水</p><p>• 出苗后：立即去掉保鲜膜，移到光照充足的地方</p><p>• 间苗：如果一个穴里长出多棵苗，只保留最健壮的1棵</p><p>• 假植：当幼苗长出2-3片真叶时，移栽到10cm左右的小盆里</p><p>• 定植：当幼苗长出4-6片真叶、高度15-20cm时，移栽到准备好的大花盆里</p><p>定植要点：带土移栽，不要伤根；定植后浇透定根水；放在阴凉处缓苗3-5天，然后移到阳光下。</p><p>五、核心养护管理（新手必看）</p><p>1. 光照需求（绝对不能少）</p><p>• 每天需要6-8小时以上的直射阳光，最好是上午9点到下午5点的阳光</p><p>• 光照不足会导致植株徒长、开花少、结果少、口感差</p><p>• 如果阳台光照不足，需要使用补光灯，每天补光10-12小时，距离植株30-40cm</p><p>2. 浇水频率（精准到天）</p><p>浇水原则：见干见湿，不干不浇，浇则浇透</p><img src=\"https://7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcb.qcloud.la/images/2026-06/1780661443132-078d28d5.png?sign=92859c06b091aa2f5f41860d27b9f964&amp;t=1780661443\"><p></p>",
    "image": "https://7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcb.qcloud.la/images/2026-06/1780661352056-0bb38993.png?sign=663c0a3fd6c796a2a612f9bbb4047843&t=1780661353",
    "balconyFit": "<p>番茄（含圣女果）是强阳性喜温作物，每天需要6-8小时以上直射阳光才能正常开花结果，阳台朝向直接决定了光照时长和强度，是种植成败的第一要素。</p><p>🏆 第一名：正南向阳台（完美适配）</p><p>• 核心优势：全天光照最充足、最均匀，夏季直射6-10小时，冬季4-6小时，完全满足番茄生长需求</p><p>• 温度特点：夏季中午温度可达35℃以上，冬季比其他朝向高3-5℃</p><p>• 适配性：</p><p>◦ 全年可种（广东等南方地区），春播、秋播、冬播都能高产</p><p>◦ 适合所有番茄品种，尤其是无限生长型和大果型</p><p>• 注意事项：</p><p>◦ 夏季（6-8月）中午12-2点需适当遮阴，避免叶片和果实被灼伤</p><p>◦ 通风要好，否则高温高湿容易引发病虫害</p><p>🥈 第二名：西南向阳台（次优选择）</p><p>• 核心优势：下午光照极强，全天直射5-8小时，光照强度足够</p><p>• 温度特点：下午2-5点温度最高，西晒明显，夏季容易超过38℃</p><p>• 适配性：</p><p>◦ 适合秋播和冬播，春播后期需注意降温</p><p>◦ 优先选择耐热品种（如千禧、釜山88）</p><p>• 注意事项：</p><p>◦ 夏季必须遮阴，否则会严重落花落果</p><p>◦ 浇水要比南向阳台更频繁，避免干旱</p><p>🥉 第三名：东南向阳台（温和友好）</p><p>• 核心优势：上午光照充足且温和，全天直射5-7小时，不会出现极端高温</p><p>• 温度特点：上午温度上升快，下午温度较低，昼夜温差适中</p><p>• 适配性：</p><p>◦ 特别适合春播和夏播，果实口感好</p><p>◦ 适合所有矮生品种和樱桃番茄</p><p>• 注意事项：</p><p>◦ 下午光照不足，植株可能会轻微徒长，需要适当控水控肥</p><p>◦ 冬季光照时间较短，收获会延迟5-7天</p><p>⚠️ 第四名：东向/西向阳台（勉强可种）</p><p>东向阳台</p><p>• 只有上午有直射光，全天3-5小时，光照时长不足</p><p>• 只能种植早熟、耐阴的矮生樱桃番茄品种</p><p>• 必须配合补光灯，每天补光4-6小时，否则只长叶不结果</p><p>西向阳台</p><p>• 只有下午有直射光，全天3-4小时，且西晒严重</p><p>• 夏季温度过高，容易灼伤植株，冬季光照不足</p><p>• 同样需要补光，且夏季必须做好遮阴降温</p><p>❌ 第五名：北向阳台（完全不适合）</p><p>• 几乎没有直射阳光，只有散射光，全天光照不足2小时</p><p>• 番茄会严重徒长，茎秆细弱，不开花不结果，即使结果也会很小且口感极差</p><p>• 建议改种耐阴蔬菜（如生菜、菠菜、香菜）</p><p></p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上花盆或长条种植箱",
    "minTemp": 10,
    "featured": false,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-06-07T13:41:36.308Z",
    "imagePosition": "50% 50%",
    "status": "published"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d65",
    "id": "green-onion",
    "name": "小葱",
    "scientificName": "Allium fistulosum",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋",
      "冬"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 20,
    "description": "<p>小葱是阳台种植入门首选，生长速度快、病虫害少、可多次采收，几乎零失败。随吃随剪，是厨房阳台必备。</p>",
    "tips": "<p>葱根留3cm插入水中即可水培</p><p>也可用葱头直接种土里</p><p>剪的时候留2-3cm，会继续生长</p>",
    "image": "https://7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcb.qcloud.la/images/2026-06/1780752311910-c32b203a.png?sign=1ac5256e756b2223e07c68e9d615c943&t=1780752312",
    "balconyFit": "<p>适应力极强，任何朝向的阳台都能种。</p><p>南向阳台最为适合，全天光照充足，只需夏季中午适当遮阴即可。</p><p>其次东向，上午有 3-5 小时柔和直射光，下午散射光，不过在冬季生长稍慢。</p><p>再次西向，下午是两点至五点会有直射光，容易叶片易焦枯。</p><p>最后北向，全年几乎无直射，长势会比较缓慢。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west",
      "north"
    ],
    "minPotDepth": 10,
    "suitablePot": "小容器即可，甚至水培瓶",
    "minTemp": 10,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-06-07T13:41:18.461Z",
    "featured": false,
    "imagePosition": "50% 50%",
    "status": "published"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d64",
    "id": "rose",
    "name": "微型月季",
    "scientificName": "Rosa chinensis minima",
    "category": "flower",
    "difficulty": "hard",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 30,
    "description": "<p>微型月季是阳台花园的颜值担当。花期长、花色丰富，适合打造浪漫的阳台角落。</p>",
    "tips": "<p>保证每天至少4小时直射光</p><p>花后及时修剪残花促进复花</p><p>注意预防红蜘蛛和白粉病</p>",
    "image": "https://7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcb.qcloud.la/images/2026-06/1780671433018-b14bfdac.png?sign=229ed19e33d9d9ee4ca31a80999f6749&t=1780671433",
    "balconyFit": "<p>需充足光照和良好通风，南向阳台最合适</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 25,
    "suitablePot": "3-5加仑透气陶盆",
    "minTemp": 5,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-06-07T13:42:35.069Z",
    "featured": false,
    "imagePosition": "50% 50%",
    "status": "published"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d63",
    "id": "lettuce",
    "name": "生菜",
    "scientificName": "Lactuca sativa",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "秋",
      "冬"
    ],
    "sunlight": "partial",
    "water": "medium",
    "harvestDays": 30,
    "description": "生长周期短，播种30天即可收获。摘叶食用可持续收获，是阳台种菜的首选。",
    "tips": [
      "分批播种可实现持续收获",
      "摘外围老叶食用，留芯继续生长",
      "高温易抽薹，夏季建议遮阴"
    ],
    "image": "/images/plants/lettuce.jpg",
    "balconyFit": "耐半阴，对光照要求不高，东向或北向阳台也能种",
    "suitableOrientations": [
      "east",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "长条种植箱或泡沫箱",
    "minTemp": 5,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-05-31T15:48:45.031Z"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d62",
    "id": "mint",
    "name": "薄荷",
    "scientificName": "Mentha haplocalyx",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "partial",
    "water": "high",
    "harvestDays": 20,
    "description": "薄荷是极易种植的入门香草。清凉香气驱蚊提神，泡茶做菜都是好选择。",
    "tips": [
      "薄荷生长迅速，建议单独盆栽以防侵占其他植物空间",
      "经常采摘可保持植株紧凑",
      "喜湿，夏季需保持土壤湿润"
    ],
    "image": "/images/plants/mint.jpg",
    "balconyFit": "适应性强，耐半阴，北向或东向阳台也能种好",
    "suitableOrientations": [
      "east",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "普通花盆或长条盆",
    "minTemp": 0,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-05-31T15:48:45.031Z"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d61",
    "id": "chili",
    "name": "辣椒",
    "scientificName": "Capsicum annuum",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 70,
    "description": "<p>阳台种辣椒又好看又实用。朝天椒、五彩椒结果时色彩缤纷，极具观赏价值。</p>",
    "tips": "<p>矮生品种更适合盆栽</p><p>结果期增施磷钾肥</p><p>辣椒喜温暖，温度低于10℃需入室</p>",
    "image": "https://7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcb.qcloud.la/images/2026-06/1780665151931-d3fcda07.png?sign=93512adb4b6224ffe648a5604a730cab&t=1780665152",
    "featured": false,
    "balconyFit": "<p>需充足阳光和温暖环境，南向或西向阳台最佳</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 25,
    "suitablePot": "3-5加仑花盆或长条种植箱",
    "minTemp": 10,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-06-07T13:42:49.103Z",
    "imagePosition": "50% 50%",
    "status": "published"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d60",
    "id": "strawberry",
    "name": "草莓",
    "scientificName": "Fragaria × ananassa",
    "category": "fruit",
    "difficulty": "medium",
    "season": [
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 90,
    "description": "<p>草莓是最适合阳台种植的水果之一，占地小、挂果快、观赏性强，而且自己种的草莓甜度高、无农药残留。本教程将提供<strong>精确到小时、次数、天数</strong>的可操作指南，新手也能一次成功。阳台种植草莓，既能观赏白花绿叶，又能收获甜蜜果实，非常适合家庭种植。</p>",
    "tips": "<p>你好不好很好123456</p><p>选择四季草莓品种可多次结果</p><p>使用透气性好的吊盆或长条盆</p><p>果实接触土壤易烂，建议铺稻草或垫高</p><p>二、品种选择（阳台专属推荐）</p><p>不要买普通大田品种，选择矮生、抗病、多季结果的阳台专用品种：</p><p>红颜（99 草莓）：甜度最高（糖度 12-15），果大香浓，是最受欢迎的品种</p><p>章姬（奶油草莓）：口感软糯，奶香味浓，适合老人小孩</p><p>甜查理：抗病性最强，产量最高，新手首选</p><p>四季草莓（塞娃、阿尔比）：一年可结果 2-3 次，适合想长期收获的人</p><p>购买渠道：优先选择本地苗圃的带土幼苗（成活率 95% 以上），不要买裸根苗和种子（种子发芽率低，结果需要 1 年以上）。</p><p>你</p><p></p><p></p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p><p></p><p></p><p></p><p></p>",
    "image": "https://7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcb.qcloud.la/images/2026-06/1780585583117-0949a1bf.png?sign=2032b74f5e11c4667024b857b286c471&t=1780585584",
    "featured": false,
    "balconyFit": "<p>需充足阳光，适合南向阳台，东向阳台次之</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 20,
    "suitablePot": "长条种植箱或吊挂盆",
    "minTemp": 10,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-06-07T13:42:12.746Z",
    "status": "published",
    "imagePosition": "80% 50%"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d5f",
    "id": "succulent-mix",
    "name": "多肉植物组合",
    "scientificName": "Succulents spp.",
    "category": "succulent",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "partial",
    "water": "low",
    "harvestDays": 30,
    "description": "<p>多肉植物是阳台新手最佳选择。形态多样，养护简单，适合打造迷你景观。</p>",
    "tips": "<p>宁干勿湿，浇水要节制</p><p>需要排水良好的多肉专用土</p><p>夏季高温休眠期减少浇水</p>",
    "image": "https://7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcb.qcloud.la/images/2026-06/1780666833461-b2baa8d0.png?sign=3a5b2ab2f1ba4d5b3e088497398825bd&t=1780666834",
    "featured": false,
    "balconyFit": "<p>耐半阴环境，适应各类阳台，尤其适合北向或光照不足的阳台</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west",
      "north"
    ],
    "minPotDepth": 8,
    "suitablePot": "小口径多肉专用盆或组合拼盘",
    "minTemp": 5,
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-06-07T13:41:11.260Z",
    "imagePosition": "50% 50%",
    "status": "published"
  },
  {
    "_id": "6a1c585e2ff00cb3452b1d5e",
    "id": "basil",
    "name": "罗勒",
    "scientificName": "Ocimum basilicum",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 30,
    "description": "<p>最受欢迎的阳台香草。紫罗勒和甜罗勒都适合盆栽，从顶端采摘可促进分枝。</p>",
    "tips": "<p>及时摘心促进分枝</p><p>开花前采摘叶片风味最佳</p><p>怕寒，冬季需移入室内</p>",
    "image": "https://7961-yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcb.qcloud.la/images/2026-06/1780665624474-a183c8d8.png?sign=b26e336f982cff7e39e5865e0b8019df&t=1780665625",
    "featured": false,
    "balconyFit": "<p>喜温暖阳光，南向阳台最佳，也适应东向或西向</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west"
    ],
    "minPotDepth": 15,
    "suitablePot": "普通花盆或长条盆（口径20cm以上）",
    "minTemp": 10,
    "productIds": [
      "pot-2",
      "soil-1",
      "seed-1"
    ],
    "_createdAt": "2026-05-31T15:48:45.031Z",
    "_updatedAt": "2026-06-07T13:42:20.636Z",
    "imagePosition": "50% 50%",
    "status": "published"
  },
  {
    "_id": "5e4631556a26ab4300515b0f0f034b00",
    "id": "venus-flytrap",
    "name": "捕蝇草",
    "scientificName": "Dionaea muscipula",
    "category": "flower",
    "difficulty": "medium",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "high",
    "harvestDays": 0,
    "description": "<p>捕蝇草是会吃虫子植物中的大明星，夹子般的捕虫叶像小怪兽的嘴巴，碰到虫子瞬间闭合，超级酷。</p>",
    "tips": "<p>1. 必须用纯净水或雨水，怕矿物质<br>2. 用无肥泥炭土+珍珠岩<br>3. 不要手动触发夹子（浪费能量）<br>4. 冬天休眠变黑是正常的</p>",
    "balconyFit": "<p>南向或东向阳台。需要高湿度和纯净水。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 10,
    "suitablePot": "小盆+无肥泥炭土",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-08T11:45:07.725Z",
    "_createdAt": "2026-06-08T11:45:07.725Z"
  },
  {
    "_id": "5e4631556a26ab3600515a7c31b999c2",
    "id": "crassula-mesembryanthemopsis",
    "name": "钱串",
    "scientificName": "Crassula mesembryanthemopsis",
    "category": "succulent",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>钱串的叶子像一串串铜钱叠在一起，寓意招财进宝。长得快容易爆盆，是多肉拼盘的点睛之笔。</p>",
    "tips": "<p>1. 光照充足叶子紧凑像钱串<br>2. 控水防徒长<br>3. 砍头可繁殖并促分枝<br>4. 徒长后很难恢复，预防为主</p>",
    "balconyFit": "<p>南向阳台全日照。小盆栽也不占空间。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 8,
    "suitablePot": "小盆+颗粒土",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:54.281Z",
    "_createdAt": "2026-06-08T11:44:54.281Z"
  },
  {
    "_id": "5e4631556a26ab3100515a5c67421d75",
    "id": "jelly-bean",
    "name": "乙女心",
    "scientificName": "Sedum pachyphyllum",
    "category": "succulent",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>乙女心的叶片像一颗颗果冻豆，出状态时顶端通红，像害羞的少女。生长迅速，容易爆盆成老桩。</p>",
    "tips": "<p>1. 光线充足叶尖才变红<br>2. 叶片发皱再浇水<br>3. 容易徒长，控水控光<br>4. 叶插扦插均易成活</p>",
    "balconyFit": "<p>南向阳台全日照出状态。耐晒耐旱好养活。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 10,
    "suitablePot": "透气陶盆",
    "minTemp": 3,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:48.991Z",
    "_createdAt": "2026-06-08T11:44:48.991Z"
  },
  {
    "_id": "5e4631556a26ab2e00515a451822f7c9",
    "id": "lithops",
    "name": "生石花",
    "scientificName": "Lithops spp.",
    "category": "succulent",
    "difficulty": "hard",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>生石花（屁屁花）是地球上最像石头的植物，伪装大师。秋天会从中间裂开开出一朵小菊花，惊艳所有人。</p>",
    "tips": "<p>1. 颗粒土90%以上，几乎全颗粒<br>2. 蜕皮期间绝对不能浇水<br>3. 一年浇水不超过10次<br>4. 宁愿干死不要涝死</p>",
    "balconyFit": "<p>南向阳台全日照，但夏天需遮阴。控水是生存关键。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 8,
    "suitablePot": "极小盆+全颗粒土",
    "minTemp": 10,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:46.345Z",
    "_createdAt": "2026-06-08T11:44:46.345Z"
  },
  {
    "_id": "5e4631556a26ab1b005159c81bb9bd8a",
    "id": "oxalis",
    "name": "酢浆草",
    "scientificName": "Oxalis spp.",
    "category": "bulb",
    "difficulty": "easy",
    "season": [
      "秋",
      "冬",
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>酢浆草是阳台上的'小可爱'，五彩缤纷的小花爆盆效果惊人。种球小巧，一盆可以密植十几个，花量惊人。</p>",
    "tips": "<p>1. 秋天种下小种球，覆土1-2cm<br>2. 光照充足才能爆花<br>3. 花后叶子枯萎是休眠，断水即可<br>4. 收球后秋天再种</p>",
    "balconyFit": "<p>南向阳台全日照最佳。盆小不占地方，可以收集多个品种。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 10,
    "suitablePot": "小盆，一盆种10-20球",
    "minTemp": 0,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:27.830Z",
    "_createdAt": "2026-06-08T11:44:27.830Z"
  },
  {
    "_id": "5e4631556a26ab110051599258574e3d",
    "id": "hyacinth",
    "name": "风信子",
    "scientificName": "Hyacinthus orientalis",
    "category": "bulb",
    "difficulty": "easy",
    "season": [
      "秋",
      "冬"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>风信子花香浓郁，一个花球就能让整个阳台香气四溢。水培盆栽两相宜，从种球到开花只需8-10周。</p>",
    "tips": "<p>1. 水培时水位刚好碰到种球底部<br>2. 先在黑暗处生根2周再移到光下<br>3. 夹箭时可套个纸筒遮光促花茎伸长<br>4. 花后种球消耗大，复花效果一般</p>",
    "balconyFit": "<p>春季开花时南向或东向阳台最佳。水培方式最干净省事。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 12,
    "suitablePot": "专用水培瓶或小花盆",
    "minTemp": -10,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:17.216Z",
    "_createdAt": "2026-06-08T11:44:17.216Z"
  },
  {
    "_id": "5e4631556a26ab060051595042f875ef",
    "id": "calathea",
    "name": "竹芋",
    "scientificName": "Calathea spp.",
    "category": "foliage",
    "difficulty": "medium",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "shade",
    "water": "high",
    "harvestDays": 0,
    "description": "<p>竹芋的叶片花纹精美绝伦，像上帝打翻的调色盘。叶片白天展开晚上竖起来（祈祷状），非常有灵性。</p>",
    "tips": "<p>1. 必须用纯净水或雨水浇，怕自来水氯气<br>2. 保持高湿度，叶片每天喷水<br>3. 绝对避免直射光<br>4. 冬天需要加湿器辅助</p>",
    "balconyFit": "<p>北向阳台或室内散射光处。湿度要求高，干燥环境叶边会焦。</p>",
    "suitableOrientations": [
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "透气陶盆",
    "minTemp": 15,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:06.659Z",
    "_createdAt": "2026-06-08T11:44:06.659Z"
  },
  {
    "_id": "5e4631556a26ab040051593a237b4a30",
    "id": "ivy",
    "name": "常春藤",
    "scientificName": "Hedera helix",
    "category": "foliage",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "partial",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>常春藤是经典的垂吊绿植，藤蔓自然垂落如绿色瀑布。品种繁多，有纯绿、花叶、金边等多种选择。</p>",
    "tips": "<p>1. 挂在高处让藤蔓自然下垂<br>2. 春秋生长季保持土壤湿润<br>3. 夏季高温时喷水降温<br>4. 扦插极易成活</p>",
    "balconyFit": "<p>东向或半阴阳台最佳。适合栏杆挂盆或高处摆放。</p>",
    "suitableOrientations": [
      "east",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "挂盆或2加仑花盆",
    "minTemp": -5,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:04.012Z",
    "_createdAt": "2026-06-08T11:44:04.012Z"
  },
  {
    "_id": "5e4631556a26aafc005158f71e82a1bb",
    "id": "spider-plant",
    "name": "吊兰",
    "scientificName": "Chlorophytum comosum",
    "category": "foliage",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "partial",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>吊兰伸出的小吊像绿色瀑布一样垂下来，悬挂在阳台或窗边非常飘逸。还会开出小白花，朴实而优雅。</p>",
    "tips": "<p>1. 挂在明亮散射光处最适宜<br>2. 小吊剪下来直接插土就活<br>3. 叶尖发黑通常是水多了<br>4. 春秋分株换盆促进生长</p>",
    "balconyFit": "<p>东向或明亮北向阳台最佳。适合挂盆或高处置放。</p>",
    "suitableOrientations": [
      "east",
      "north"
    ],
    "minPotDepth": 12,
    "suitablePot": "挂盆",
    "minTemp": 3,
    "status": "published",
    "_updatedAt": "2026-06-08T11:43:56.053Z",
    "_createdAt": "2026-06-08T11:43:56.053Z"
  },
  {
    "_id": "5e4631556a2592d900462ebe0068ca31",
    "id": "bear-paw",
    "name": "熊童子",
    "scientificName": "Cotyledon tomentosa",
    "category": "succulent",
    "difficulty": "medium",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>熊童子的叶片像小熊的爪子，毛茸茸的超级可爱。叶尖在光照充足时会变红，像涂了指甲油。</p>",
    "tips": "<p>1. 喜光，光照足叶尖变红<br>2. 控水，叶子发软再浇<br>3. 夏季休眠少浇水<br>4. 不要摸叶片，会留指纹</p>",
    "balconyFit": "<p>南向阳台春秋季最佳。夏季需适当遮阴通风。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 10,
    "suitablePot": "小陶盆，颗粒土",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:41.685Z",
    "_createdAt": "2026-06-07T15:48:41.685Z"
  },
  {
    "_id": "5e4631556a2592c900462e606e3d4648",
    "id": "fig",
    "name": "无花果",
    "scientificName": "Ficus carica",
    "category": "fruit",
    "difficulty": "easy",
    "season": [
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>无花果是阳台果树中的'高产王'，当年种当年结果。果实软糯甜蜜，有着独特的蜜糖风味。</p>",
    "tips": "<p>1. 选择矮化品种（如'紫色波尔多'）<br>2. 需要大盆和充足基肥<br>3. 冬季落叶休眠是正常现象<br>4. 春果和秋果一年两季</p>",
    "balconyFit": "<p>南向阳台全日照最佳。生长迅速，需大盆和充足空间。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 40,
    "suitablePot": "10加仑以上大盆",
    "minTemp": -10,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:25.793Z",
    "_createdAt": "2026-06-07T15:48:25.793Z"
  },
  {
    "_id": "5e4631556a2592af00462dbc6350ced8",
    "id": "jasmine",
    "name": "茉莉花",
    "scientificName": "Jasminum sambac",
    "category": "flower",
    "difficulty": "medium",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>'好一朵美丽的茉莉花'——茉莉花洁白芬芳，一朵花开满屋香。可用来窨制花茶，是夏天的味道。</p>",
    "tips": "<p>1. 喜强光，越晒越开花<br>2. 花后及时修剪枝条<br>3. 生长期薄肥勤施<br>4. 冬季入室防寒</p>",
    "balconyFit": "<p>南向阳台全日照最佳。夏季盛花期需要充足肥水。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 20,
    "suitablePot": "3加仑以上花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:59.244Z",
    "_createdAt": "2026-06-07T15:47:59.244Z"
  },
  {
    "_id": "5e4631556a2592ac00462db1714f32b3",
    "id": "kalanchoe",
    "name": "长寿花",
    "scientificName": "Kalanchoe blossfeldiana",
    "category": "flower",
    "difficulty": "easy",
    "season": [
      "冬",
      "春"
    ],
    "sunlight": "partial",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>长寿花花期超长，从冬季开到春季，一开就是三四个月。色彩丰富，是冬日阳台的一抹亮色。</p>",
    "tips": "<p>1. 短日照植物，每天光照8-9小时最佳<br>2. 控水，干透浇透<br>3. 花后修剪促分枝<br>4. 叶插极易成活</p>",
    "balconyFit": "<p>东向阳台最适合。冬日阳台的主角花卉。</p>",
    "suitableOrientations": [
      "east",
      "south"
    ],
    "minPotDepth": 12,
    "suitablePot": "1加仑小盆",
    "minTemp": 8,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:56.598Z",
    "_createdAt": "2026-06-07T15:47:56.598Z"
  },
  {
    "_id": "5e4631556a25927a00462cb954f3204b",
    "id": "cabbage",
    "name": "卷心菜",
    "scientificName": "Brassica oleracea var. capitata",
    "category": "vegetable",
    "difficulty": "medium",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 80,
    "description": "<p>阳台盆栽卷心菜，从外叶展开到内心卷曲，整个过程非常治愈。选早熟小型品种更适合盆栽。</p>",
    "tips": "<p>1. 选早熟小型品种<br>2. 育苗后移栽到大盆<br>3. 定期追肥促进包心<br>4. 注意防治菜青虫</p>",
    "balconyFit": "<p>喜冷凉气候和充足光照，南向或东向阳台合适。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 25,
    "suitablePot": "3加仑以上花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:06.241Z",
    "_createdAt": "2026-06-07T15:47:06.241Z"
  },
  {
    "_id": "5e4631556a25927700462ca8044ce64f",
    "id": "broccoli",
    "name": "西兰花",
    "scientificName": "Brassica oleracea var. italica",
    "category": "vegetable",
    "difficulty": "medium",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 75,
    "description": "<p>西兰花营养价值极高，阳台盆栽一棵就能收获一颗大花球。收获后侧枝还会继续长出小花球。</p>",
    "tips": "<p>1. 育苗后移栽，株距40cm<br>2. 生长期需充足氮肥<br>3. 花球紧密饱满时采收<br>4. 采收主花球后侧枝会继续结小球</p>",
    "balconyFit": "<p>需要充足光照和较大空间，南向阳台最合适。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:03.597Z",
    "_createdAt": "2026-06-07T15:47:03.597Z"
  },
  {
    "_id": "34d5e8e86a26ab4600ae1978731fc3d9",
    "id": "air-plant",
    "name": "空气凤梨",
    "scientificName": "Tillandsia spp.",
    "category": "foliage",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "partial",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>空气凤梨不需要土壤！悬空挂在阳台就能活，靠叶片吸收空气中的水分。形态各异，像外星生物一样酷。</p>",
    "tips": "<p>1. 每周泡水1-2次，甩干放回<br>2. 悬挂在明亮通风处<br>3. 泡水后必须彻底晾干防烂心<br>4. 开花后母株会枯萎并长出侧芽</p>",
    "balconyFit": "<p>东向阳台明亮散射光最佳。挂起来养不占桌面空间。</p>",
    "suitableOrientations": [
      "east",
      "south"
    ],
    "minPotDepth": 0,
    "suitablePot": "无需花盆，悬挂装饰即可",
    "minTemp": 8,
    "status": "published",
    "_updatedAt": "2026-06-08T11:45:10.376Z",
    "_createdAt": "2026-06-08T11:45:10.376Z"
  },
  {
    "_id": "34d5e8e86a26ab3e00ae184a51186d5a",
    "id": "feijoa",
    "name": "菲油果",
    "scientificName": "Acca sellowiana",
    "category": "fruit",
    "difficulty": "medium",
    "season": [
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>菲油果是新兴的阳台果树，花朵可食用（花瓣甜脆像棉花糖），果实有菠萝和草莓的混合香气。四季常青，花叶果俱美。</p>",
    "tips": "<p>1. 选择自花授粉品种<br>2. 耐修剪，适合盆栽塑形<br>3. 花和果都可食用<br>4. 较耐寒，南方可露地过冬</p>",
    "balconyFit": "<p>南向阳台全日照。观花赏叶吃果三合一。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 30,
    "suitablePot": "7加仑以上大盆",
    "minTemp": -8,
    "status": "published",
    "_updatedAt": "2026-06-08T11:45:02.387Z",
    "_createdAt": "2026-06-08T11:45:02.387Z"
  },
  {
    "_id": "34d5e8e86a26ab3b00ae181e5a68719b",
    "id": "mulberry",
    "name": "桑葚",
    "scientificName": "Morus alba 'Dwarf'",
    "category": "fruit",
    "difficulty": "easy",
    "season": [
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>矮化桑葚是阳台果树中的'容易模式'，春季结出一串串紫黑色的甜蜜果实。叶片还可以喂蚕宝宝，一树多用。</p>",
    "tips": "<p>1. 选矮化品种，结果早<br>2. 耐修剪，可控制大小<br>3. 果实变黑变软再采摘<br>4. 冬季落叶正常休眠</p>",
    "balconyFit": "<p>南向阳台全日照。比樱桃好养太多，果树入门首选。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 30,
    "suitablePot": "7加仑以上大盆",
    "minTemp": -20,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:59.617Z",
    "_createdAt": "2026-06-08T11:44:59.617Z"
  },
  {
    "_id": "34d5e8e86a26ab2b00ae17533da07c49",
    "id": "pink-moonstone",
    "name": "桃蛋",
    "scientificName": "Pachyphytum oviferum 'Pink'",
    "category": "succulent",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>桃蛋（桃之卵）是多肉圈的'断货王'，圆滚滚粉嘟嘟的叶片像一颗颗小糖豆。出状态时粉红色，少女心爆棚。</p>",
    "tips": "<p>1. 颗粒土比例70%以上<br>2. 控水+大温差才能出粉色<br>3. 夏天休眠少水通风<br>4. 叶插成功率极高</p>",
    "balconyFit": "<p>南向阳台春秋季出状态最佳。夏季需遮阴控水。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 8,
    "suitablePot": "小陶盆，高颗粒土",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:43.690Z",
    "_createdAt": "2026-06-08T11:44:43.690Z"
  },
  {
    "_id": "34d5e8e86a26ab2600ae17101358c3a1",
    "id": "oyster-mushroom",
    "name": "平菇",
    "scientificName": "Pleurotus ostreatus",
    "category": "mushroom",
    "difficulty": "easy",
    "season": [
      "春",
      "秋",
      "冬"
    ],
    "sunlight": "shade",
    "water": "high",
    "harvestDays": 7,
    "description": "<p>阳台种平菇是近年最火的家庭种植项目！买一个菌棒喷水就能出菇，7天从菇蕾到采收，成就感爆棚。</p>",
    "tips": "<p>1. 购买成品菌棒最简单<br>2. 放在阴暗潮湿处，每天喷水2-3次<br>3. 菇伞展开但未完全平展时采收<br>4. 采完一茬还能出第二茬</p>",
    "balconyFit": "<p>北向阳台或阴暗角落最佳！不需要阳光，只需要湿度。</p>",
    "suitableOrientations": [
      "north"
    ],
    "minPotDepth": 0,
    "suitablePot": "菌棒无需花盆，放在托盘上即可",
    "minTemp": 10,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:38.394Z",
    "_createdAt": "2026-06-08T11:44:38.394Z"
  },
  {
    "_id": "34d5e8e86a26ab1e00ae168b7ca34c0f",
    "id": "bowl-lotus",
    "name": "碗莲",
    "scientificName": "Nelumbo nucifera 'Bowl'",
    "category": "aquatic",
    "difficulty": "medium",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "high",
    "harvestDays": 0,
    "description": "<p>碗莲是缩小版的荷花，一个小碗或小水缸就能种。夏日开出精致的粉色或白色荷花，微风吹过满阳台清香。</p>",
    "tips": "<p>1. 春天破壳浸种，每天换水<br>2. 长出浮叶后移入有泥的容器<br>3. 必须全日照，光照不足不开花<br>4. 冬天水面结冰不影响来年生长</p>",
    "balconyFit": "<p>南向阳台全日照必备。需要水缸或不透水容器+塘泥。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 20,
    "suitablePot": "直径30cm以上水缸或不透水容器+塘泥",
    "minTemp": -5,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:30.463Z",
    "_createdAt": "2026-06-08T11:44:30.463Z"
  },
  {
    "_id": "34d5e8e86a26ab1600ae1609123ecaaa",
    "id": "daffodil",
    "name": "水仙",
    "scientificName": "Narcissus tazetta",
    "category": "bulb",
    "difficulty": "easy",
    "season": [
      "秋",
      "冬"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>水仙是春节的标配花卉，清香四溢，金盏银台。水培养护简单，从种球到开花约40-50天，正好赶上过年。</p>",
    "tips": "<p>1. 水培时水位浸没根部即可<br>2. 白天放阳光下，晚上倒掉水防徒长<br>3. 雕刻种球可控制造型<br>4. 花后种球已耗尽，来年需买新球</p>",
    "balconyFit": "<p>冬季南向阳台光照充足处。水培最为传统和方便。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 8,
    "suitablePot": "浅水仙盆或水培盘",
    "minTemp": 0,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:22.528Z",
    "_createdAt": "2026-06-08T11:44:22.528Z"
  },
  {
    "_id": "34d5e8e86a26ab1300ae15c23b9da988",
    "id": "lily",
    "name": "百合",
    "scientificName": "Lilium spp.",
    "category": "bulb",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>百合花大色艳，一株能开出好几朵硕大的喇叭花。香气浓郁，是阳台上的焦点花卉。亚洲百合品种最适合盆栽。</p>",
    "tips": "<p>1. 选择矮生亚洲百合品种<br>泵2. 种球覆土8-10cm深<br>3. 花后剪掉残花保留叶片养球<br>4. 冬天地上部分枯死，球根来年复花</p>",
    "balconyFit": "<p>南向或东向阳台最佳。需要深盆和充足光照。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 25,
    "suitablePot": "3加仑以上深盆",
    "minTemp": -15,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:19.869Z",
    "_createdAt": "2026-06-08T11:44:19.869Z"
  },
  {
    "_id": "34d5e8e86a26ab0b00ae14752d69fd73",
    "id": "dieffenbachia",
    "name": "万年青",
    "scientificName": "Dieffenbachia spp.",
    "category": "foliage",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "shade",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>万年青叶片肥厚翠绿，有漂亮的斑纹，四季常青。耐阴性极强，是最好养的室内观叶植物之一。</p>",
    "tips": "<p>1. 极耐阴，卫生间都能养活<br>2. 表土干了再浇水<br>3. 注意汁液有微毒，避免宠物啃食<br>4. 多年生，一盆能养很多年</p>",
    "balconyFit": "<p>北向阳台或室内阴暗角落都能养。适应性极强。</p>",
    "suitableOrientations": [
      "north",
      "east",
      "west"
    ],
    "minPotDepth": 15,
    "suitablePot": "2加仑以上花盆",
    "minTemp": 8,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:11.941Z",
    "_createdAt": "2026-06-08T11:44:11.941Z"
  },
  {
    "_id": "34d5e8e86a26aafe00ae13717d450a5a",
    "id": "snake-plant",
    "name": "虎尾兰",
    "scientificName": "Sansevieria trifasciata",
    "category": "foliage",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "shade",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>虎尾兰叶片挺拔如剑，纹理独特像虎尾花纹。NASA认证的空气净化植物，夜间释放氧气，适合放在卧室。</p>",
    "tips": "<p>1. 极度耐旱，一个月不浇水也死不了<br>2. 宁干勿湿，最怕积水烂根<br>3. 叶插可繁殖，但生长慢<br>4. 光照不限，强光到暗处都能活</p>",
    "balconyFit": "<p>任何朝向都能养。南阳台强光下叶片更挺拔，北阳台也能正常生长。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "透气陶盆",
    "minTemp": 8,
    "status": "published",
    "_updatedAt": "2026-06-08T11:43:58.724Z",
    "_createdAt": "2026-06-08T11:43:58.724Z"
  },
  {
    "_id": "34d5e8e86a26aaf900ae13142ef79687",
    "id": "pothos",
    "name": "绿萝",
    "scientificName": "Epipremnum aureum",
    "category": "foliage",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "shade",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>绿萝是国民级的室内绿植，几乎是'养不死'的代名词。心形叶片翠绿有光泽，垂吊或攀爬都极美，净化空气能力一流。</p>",
    "tips": "<p>1. 水培土培均可，扦插即活<br>2. 耐阴，但明亮散射光下叶片更油亮<br>3. 干了再浇，不怕偶尔忘浇水<br>4. 定期修剪过长藤蔓促分枝</p>",
    "balconyFit": "<p>北向阳台或室内散射光处最佳。几乎适应任何环境。</p>",
    "suitableOrientations": [
      "north",
      "east"
    ],
    "minPotDepth": 12,
    "suitablePot": "挂盆或普通花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-08T11:43:53.387Z",
    "_createdAt": "2026-06-08T11:43:53.387Z"
  },
  {
    "_id": "34d5e8e86a2592d40096d7554f2c5efa",
    "id": "blackberry",
    "name": "黑莓",
    "scientificName": "Rubus fruticosus",
    "category": "fruit",
    "difficulty": "easy",
    "season": [
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>黑莓果实乌黑发亮，富含花青素。藤蔓型生长，搭个架子就能收获一夏天的甜蜜果实。</p>",
    "tips": "<p>1. 选无刺品种方便采摘<br>2. 需要架子支撑藤蔓<br>3. 果实变黑变软时采收<br>4. 冬季修剪老枝留新枝</p>",
    "balconyFit": "<p>南向阳台全日照，需要搭架。选择直立型品种可节省空间。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上花盆+支架",
    "minTemp": -15,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:36.384Z",
    "_createdAt": "2026-06-07T15:48:36.384Z"
  },
  {
    "_id": "34d5e8e86a2592c10096d69b334243dc",
    "id": "blueberry",
    "name": "蓝莓",
    "scientificName": "Vaccinium corymbosum",
    "category": "fruit",
    "difficulty": "medium",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>蓝莓是阳台果树的新宠，春天赏花、夏天吃果、秋天看红叶，一株多用。选择矮丛品种最适合盆栽。</p>",
    "tips": "<p>1. 必须用酸性土（pH 4.5-5.5）<br>2. 至少种两棵不同品种互相授粉<br>3. 用雨水或放置过的自来水浇<br>4. 果期罩网防鸟</p>",
    "balconyFit": "<p>南向或东向阳台最佳。最关键的是用酸性泥炭土种植。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上花盆，酸性泥炭土",
    "minTemp": -15,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:17.869Z",
    "_createdAt": "2026-06-07T15:48:17.869Z"
  },
  {
    "_id": "34d5e8e86a2592bf0096d677105a73ab",
    "id": "hydrangea",
    "name": "绣球花",
    "scientificName": "Hydrangea macrophylla",
    "category": "flower",
    "difficulty": "medium",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "partial",
    "water": "high",
    "harvestDays": 0,
    "description": "<p>绣球花团锦簇，一个大花球由无数小花组成，梦幻又浪漫。花色会随土壤酸碱度变化，非常神奇。</p>",
    "tips": "<p>1. 喜半阴，怕暴晒<br>2. 需水量大，夏季每天浇水<br>3. 调酸变蓝，调碱变粉<br>4. 花后及时修剪</p>",
    "balconyFit": "<p>东向阳台最适合，上午光照下午遮阴。需水量大，夏季不能断水。</p>",
    "suitableOrientations": [
      "east",
      "north"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上大盆",
    "minTemp": -5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:15.231Z",
    "_createdAt": "2026-06-07T15:48:15.231Z"
  },
  {
    "_id": "34d5e8e86a2592bc0096d6647449b7a1",
    "id": "bougainvillea",
    "name": "三角梅",
    "scientificName": "Bougainvillea spectabilis",
    "category": "flower",
    "difficulty": "medium",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>三角梅（簕杜鹃）是南方阳台的标志性花卉，花开时姹紫嫣红，几乎看不到叶子。花期极长，一开就是大半年。</p>",
    "tips": "<p>1. 需要强光，光照不足不开花<br>2. 控水促花：叶子微蔫再浇水<br>3. 花后重剪塑形<br>4. 生长期施磷钾肥促花</p>",
    "balconyFit": "<p>南向阳台全日照最佳。控水是开花关键——水多只长叶不开花。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上大盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:12.577Z",
    "_createdAt": "2026-06-07T15:48:12.577Z"
  },
  {
    "_id": "34d5e8e86a2592b90096d6263eed048c",
    "id": "marguerite",
    "name": "玛格丽特",
    "scientificName": "Argyranthemum frutescens",
    "category": "flower",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>玛格丽特（木春菊）花量大得惊人，一盆能开出几十朵小菊花，清新可爱。春秋两季是盛花期。</p>",
    "tips": "<p>1. 喜凉爽，夏季高温需遮阴<br>2. 花后修剪促分枝<br>3. 每周施一次薄肥<br>4. 扦插容易成活</p>",
    "balconyFit": "<p>春秋季南向阳台表现最佳。夏季需遮阴降温。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 20,
    "suitablePot": "3加仑花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:09.940Z",
    "_createdAt": "2026-06-07T15:48:09.940Z"
  },
  {
    "_id": "34d5e8e86a2592b20096d5e357b65990",
    "id": "gardenia",
    "name": "栀子花",
    "scientificName": "Gardenia jasminoides",
    "category": "flower",
    "difficulty": "medium",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "partial",
    "water": "high",
    "harvestDays": 0,
    "description": "<p>栀子花开，满室芬芳。洁白的花瓣层层叠叠，香气浓郁持久。南方阳台种植经典花卉。</p>",
    "tips": "<p>1. 喜酸性土壤，可用硫酸亚铁调酸<br>2. 保持土壤湿润不积水<br>3. 喜半阴，避免夏季烈日暴晒<br>4. 花期前后追施磷钾肥</p>",
    "balconyFit": "<p>东向阳台最适合，晨光充足又避开午后烈日。需要保持较高空气湿度。</p>",
    "suitableOrientations": [
      "east",
      "south"
    ],
    "minPotDepth": 25,
    "suitablePot": "3加仑以上花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:01.969Z",
    "_createdAt": "2026-06-07T15:48:01.969Z"
  },
  {
    "_id": "34d5e8e86a2592a20096d5507eafe394",
    "id": "stevia",
    "name": "甜叶菊",
    "scientificName": "Stevia rebaudiana",
    "category": "herb",
    "difficulty": "medium",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 50,
    "description": "<p>甜叶菊的叶片比蔗糖甜200-300倍，是天然零卡路里甜味剂。阳台种一盆，泡茶摘一片就够甜。</p>",
    "tips": "<p>1. 扦插繁殖为主<br>2. 喜温暖，不耐寒<br>3. 充足光照提升甜度<br>4. 冬季需移入室内</p>",
    "balconyFit": "<p>喜光照和温暖，南向阳台最适宜。冬季温度低于10℃需移入室内。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 20,
    "suitablePot": "2加仑以上花盆",
    "minTemp": 10,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:46.009Z",
    "_createdAt": "2026-06-07T15:47:46.009Z"
  },
  {
    "_id": "34d5e8e86a2592940096d46c1640ec6c",
    "id": "lemongrass",
    "name": "柠檬草",
    "scientificName": "Cymbopogon citratus",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 60,
    "description": "<p>柠檬草（香茅）有浓郁的柠檬香气，是做冬阴功汤和东南亚料理的必备香草。叶片细长飘逸，观赏性强。</p>",
    "tips": "<p>1. 可用超市买的香茅茎水培生根<br>2. 喜温暖湿润环境<br>3. 剪取茎秆使用，会不断萌发新茎<br>4. 冬季需移入室内防寒</p>",
    "balconyFit": "<p>喜温暖和充足光照，南向阳台最佳。不耐寒，冬季注意保温。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 25,
    "suitablePot": "3加仑以上花盆",
    "minTemp": 10,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:32.778Z",
    "_createdAt": "2026-06-07T15:47:32.778Z"
  },
  {
    "_id": "34d5e8e86a25928a0096d4155ab8c467",
    "id": "rosemary",
    "name": "迷迭香",
    "scientificName": "Salvia rosmarinus",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 60,
    "description": "<p>迷迭香是地中海料理的经典香草，烤肉、煎牛排必备。耐旱耐晒，是阳台'懒人植物'的代表。</p>",
    "tips": "<p>1. 扦插繁殖最容易成活<br>2. 宁干勿湿，怕积水烂根<br>3. 充足光照促进精油积累<br>4. 定期修剪保持株形紧凑</p>",
    "balconyFit": "<p>喜强光和干燥，南向或西向阳台最理想。非常耐旱。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 20,
    "suitablePot": "透气陶盆，2加仑以上",
    "minTemp": -5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:22.127Z",
    "_createdAt": "2026-06-07T15:47:22.127Z"
  },
  {
    "_id": "34d5e8e86a25926c0096d30765cd19c4",
    "id": "bitter-gourd",
    "name": "苦瓜",
    "scientificName": "Momordica charantia",
    "category": "vegetable",
    "difficulty": "medium",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 60,
    "description": "<p>苦瓜清热解暑，夏季阳台种植既能遮阴又能收获。虽然味道苦，但越苦越健康。</p>",
    "tips": "<p>1. 需要搭架攀爬<br>2. 开花后需人工授粉<br>3. 果实饱满有光泽时采收<br>4. 蚜虫高发期注意防治</p>",
    "balconyFit": "<p>喜高温强光，南向或西向阳台合适。爬藤可遮挡夏季烈日。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上花盆配爬藤架",
    "minTemp": 18,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:52.545Z",
    "_createdAt": "2026-06-07T15:46:52.545Z"
  },
  {
    "_id": "34d5e8e86a2592610096d28d4e2a3aa0",
    "id": "chinese-chives",
    "name": "韭菜",
    "scientificName": "Allium tuberosum",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 40,
    "description": "<p>韭菜是阳台种植的'懒人菜'，种一次可以反复收割2-3年。割完一茬又长一茬，越割越旺。</p>",
    "tips": "<p>1. 可用韭菜根直接种植，比播种快很多<br>2. 收割时留3-4cm茬口<br>3. 每次收割后追施氮肥<br>4. 冬季地上部分枯萎，来年春天重新萌发</p>",
    "balconyFit": "<p>适应性极强，任何朝向都能种。南向长得最快，北向也能正常生长。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west",
      "north"
    ],
    "minPotDepth": 20,
    "suitablePot": "长条种植箱或2加仑以上花盆",
    "minTemp": -10,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:41.943Z",
    "_createdAt": "2026-06-07T15:46:41.943Z"
  },
  {
    "_id": "15a233946a26ab41023ad98411b1010a",
    "id": "mimosa",
    "name": "含羞草",
    "scientificName": "Mimosa pudica",
    "category": "flower",
    "difficulty": "easy",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>含羞草一碰就会合拢叶片，像害羞的小姑娘。还会开出粉紫色的毛绒球小花，大人小孩都爱玩。</p>",
    "tips": "<p>1. 种子播种出苗率高<br>2. 喜光喜暖怕冷<br>3. 不要频繁触碰，会消耗能量<br>4. 茎上有刺，小心手指</p>",
    "balconyFit": "<p>南向阳台最适宜。趣味性强，适合亲子互动。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 12,
    "suitablePot": "1-2加仑花盆",
    "minTemp": 15,
    "status": "published",
    "_updatedAt": "2026-06-08T11:45:05.084Z",
    "_createdAt": "2026-06-08T11:45:05.084Z"
  },
  {
    "_id": "15a233946a26ab38023acfe03dfd5545",
    "id": "cherry-dwarf",
    "name": "樱桃（矮化）",
    "scientificName": "Prunus avium 'Dwarf'",
    "category": "fruit",
    "difficulty": "hard",
    "season": [
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>矮化樱桃是阳台果树的'天花板'，春天满树白花，夏天红果满枝。需要耐心和技术，但收获时一切值得。</p>",
    "tips": "<p>1. 必须买嫁接矮化苗<br>2. 至少两个品种互相授粉<br>3. 冬天需足够的低温时数<br>4. 果期罩网防鸟</p>",
    "balconyFit": "<p>南向阳台全日照。适合有经验的种植者挑战。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 40,
    "suitablePot": "10加仑以上大盆",
    "minTemp": -20,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:56.957Z",
    "_createdAt": "2026-06-08T11:44:56.957Z"
  },
  {
    "_id": "15a233946a26ab33023acf8e66c88b44",
    "id": "sedum-rubrotinctum",
    "name": "虹之玉",
    "scientificName": "Sedum rubrotinctum",
    "category": "succulent",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>虹之玉是多肉入门的经典品种，翠绿的叶片在阳光下变得通红透亮，像一串串红绿相间的宝石。</p>",
    "tips": "<p>1. 全日照才能变红<br>2. 叶片一碰就掉是正常现象<br>3. 掉落的叶子放土上就能生根<br>4. 耐旱性强，偶尔忘浇水没事</p>",
    "balconyFit": "<p>南向阳台全日照。新手的入门首选多肉。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 8,
    "suitablePot": "小陶盆+颗粒土",
    "minTemp": 0,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:51.643Z",
    "_createdAt": "2026-06-08T11:44:51.643Z"
  },
  {
    "_id": "15a233946a26ab19023ace1b4720a20e",
    "id": "amaryllis",
    "name": "朱顶红",
    "scientificName": "Hippeastrum spp.",
    "category": "bulb",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>朱顶红是球根花卉中的'女王'，花朵巨大（可达20cm），一箭可开4-6朵，艳丽夺目。种一次年年开花。</p>",
    "tips": "<p>1. 种球埋入1/3即可，顶部露出<br>2. 先开花后长叶是正常现象<br>3. 花后养叶子，每月施肥养球<br>4. 冬天休眠少浇水，来年复花</p>",
    "balconyFit": "<p>南向阳台最佳。多年生，养护得当年年开花。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 20,
    "suitablePot": "大小适中的花盆（不宜太大）",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:25.173Z",
    "_createdAt": "2026-06-08T11:44:25.173Z"
  },
  {
    "_id": "15a233946a26ab01023ab9dc134f45c6",
    "id": "monstera",
    "name": "龟背竹",
    "scientificName": "Monstera deliciosa",
    "category": "foliage",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "partial",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>龟背竹是ins风绿植的代表，巨大的叶片上自然开裂成龟甲纹路，北欧风家居必备。长大后气势磅礴。</p>",
    "tips": "<p>1. 喜明亮散射光，避免直射<br>2. 叶片需要定期喷水保湿<br>3. 气生根不要剪，帮助吸收养分<br>4. 需要支撑杆引导向上生长</p>",
    "balconyFit": "<p>东向阳台最佳，晨光柔和。需要较大空间容纳宽大叶片。</p>",
    "suitableOrientations": [
      "east",
      "north"
    ],
    "minPotDepth": 25,
    "suitablePot": "5加仑以上大盆+支撑杆",
    "minTemp": 10,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:01.379Z",
    "_createdAt": "2026-06-08T11:44:01.379Z"
  },
  {
    "_id": "15a233946a2592d701e9d2db091602d8",
    "id": "haworthia",
    "name": "玉露",
    "scientificName": "Haworthia cooperi",
    "category": "succulent",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "partial",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>玉露叶片晶莹剔透，像一颗颗绿色的水晶。是十二卷属多肉的代表，小巧精致不占地方。</p>",
    "tips": "<p>1. 喜散射光，怕强光直射<br>2. 干透浇透，冬天几乎断水<br>3. 闷养可让叶片更透亮<br>4. 用颗粒土种植防烂根</p>",
    "balconyFit": "<p>东向或北向阳台散射光最佳。夏天一定遮阴。</p>",
    "suitableOrientations": [
      "east",
      "north"
    ],
    "minPotDepth": 8,
    "suitablePot": "浅盆小盆，颗粒土",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:39.044Z",
    "_createdAt": "2026-06-07T15:48:39.044Z"
  },
  {
    "_id": "15a233946a2592cf01e9d2837fd793c8",
    "id": "raspberry",
    "name": "树莓",
    "scientificName": "Rubus idaeus",
    "category": "fruit",
    "difficulty": "medium",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>树莓（覆盆子）红艳艳的果实像小宝石一样挂在枝头，酸酸甜甜。阳台种一盆，夏天随手摘一把吃。</p>",
    "tips": "<p>1. 选秋季结果品种（秋果型）<br>2. 需要支撑或小架子<br>3. 果期保持浇水均匀<br>4. 冬季修剪老枝</p>",
    "balconyFit": "<p>南向或东向阳台适合。选择无刺品种更方便管理。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 25,
    "suitablePot": "5加仑花盆+支架",
    "minTemp": -15,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:31.080Z",
    "_createdAt": "2026-06-07T15:48:31.080Z"
  },
  {
    "_id": "15a233946a2592b701e9c80e4818713f",
    "id": "portulaca",
    "name": "太阳花",
    "scientificName": "Portulaca grandiflora",
    "category": "flower",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>太阳花（死不了）是最好养的花卉，给点阳光就灿烂。耐旱耐晒，越晒越开花，花色艳丽多彩。</p>",
    "tips": "<p>1. 扦插即活，随便插土里就长<br>2. 控水，太湿反而长不好<br>3. 花后无需特殊管理<br>4. 冬季地上部分枯死，来年自播</p>",
    "balconyFit": "<p>南向阳台全日照最佳。极耐旱，出差一周不浇水也没事。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 12,
    "suitablePot": "浅盆或挂盆",
    "minTemp": 8,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:07.300Z",
    "_createdAt": "2026-06-07T15:48:07.300Z"
  },
  {
    "_id": "15a233946a2592a701e9b2326798e1b3",
    "id": "petunia",
    "name": "矮牵牛",
    "scientificName": "Petunia × atkinsiana",
    "category": "flower",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>矮牵牛是阳台花卉的'开花机器'，从春到秋持续不断开花。花色丰富，花量大，垂吊品种尤其适合阳台栏杆。</p>",
    "tips": "<p>1. 喜光，光照越足开花越多<br>2. 每周施一次开花肥<br>3. 及时摘除残花促新花<br>4. 垂吊品种适合挂盆种植</p>",
    "balconyFit": "<p>南向阳台最佳，光照充足时花开不断。垂吊品种适合栏杆装饰。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west"
    ],
    "minPotDepth": 15,
    "suitablePot": "挂盆或2加仑花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:51.311Z",
    "_createdAt": "2026-06-07T15:47:51.311Z"
  },
  {
    "_id": "15a233946a25929f01e9a01005ac13ac",
    "id": "spearmint",
    "name": "留兰香",
    "scientificName": "Mentha spicata",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "partial",
    "water": "high",
    "harvestDays": 25,
    "description": "<p>留兰香（绿薄荷）比普通薄荷更清香甜美，是做莫吉托和薄荷茶的首选。生长旺盛，一盆变十盆。</p>",
    "tips": "<p>1. 扦插或分株繁殖最快<br>2. 喜水，保持土壤湿润<br>3. 定期摘心促分枝<br>4. 侵略性强，建议单独盆栽</p>",
    "balconyFit": "<p>适应性极强，任何朝向都能蓬勃生长。北向阳台也能长好。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "2加仑花盆（建议单独种）",
    "minTemp": -5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:43.381Z",
    "_createdAt": "2026-06-07T15:47:43.381Z"
  },
  {
    "_id": "15a233946a25929a01e999d67a7be5a3",
    "id": "parsley",
    "name": "欧芹",
    "scientificName": "Petroselinum crispum",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "partial",
    "water": "medium",
    "harvestDays": 40,
    "description": "<p>欧芹是西餐摆盘和调味的经典香草。叶片翠绿卷曲，既是食材也是阳台上的美丽盆栽。</p>",
    "tips": "<p>1. 种子发芽慢，浸种24小时再播<br>2. 出苗后保持土壤湿润<br>3. 摘外叶食用，留芯继续长<br>4. 夏季适当遮阴</p>",
    "balconyFit": "<p>耐半阴，东向阳台最适合。也可在南向阳台与其他高株植物搭配。</p>",
    "suitableOrientations": [
      "east",
      "south"
    ],
    "minPotDepth": 20,
    "suitablePot": "2加仑以上花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:38.062Z",
    "_createdAt": "2026-06-07T15:47:38.062Z"
  },
  {
    "_id": "15a233946a25929701e99884734bc9da",
    "id": "oregano",
    "name": "牛至",
    "scientificName": "Origanum vulgare",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 45,
    "description": "<p>牛至是披萨和意面的灵魂香料，也叫'披萨草'。耐旱耐贫瘠，几乎是种不死的香草。</p>",
    "tips": "<p>1. 扦插极易成活<br>2. 控水，土壤干了再浇<br>3. 开花前采收叶片香气最佳<br>4. 定期修剪促进分枝</p>",
    "balconyFit": "<p>极耐旱，南向或西向阳台最佳。通风良好时几乎无病虫害。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 15,
    "suitablePot": "透气陶盆或加仑盆",
    "minTemp": -10,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:35.421Z",
    "_createdAt": "2026-06-07T15:47:35.421Z"
  },
  {
    "_id": "15a233946a25929201e9983739f82701",
    "id": "chamomile",
    "name": "洋甘菊",
    "scientificName": "Matricaria chamomilla",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 60,
    "description": "<p>洋甘菊开白色小花，苹果般清香。花朵可泡茶助眠安神，是阳台上的'天然药箱'。</p>",
    "tips": "<p>1. 撒播，不覆土（需光发芽）<br>2. 出苗后间苗保持15cm间距<br>3. 花朵盛开时采收晾干<br>4. 花后可留种来年再种</p>",
    "balconyFit": "<p>喜光照充足，南向或东向阳台最佳。植株小巧适合盆栽。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 15,
    "suitablePot": "2加仑以上花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:30.108Z",
    "_createdAt": "2026-06-07T15:47:30.108Z"
  },
  {
    "_id": "15a233946a25928f01e9980b02448053",
    "id": "sage",
    "name": "鼠尾草",
    "scientificName": "Salvia officinalis",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 50,
    "description": "<p>鼠尾草银灰色的叶片自带高级感，既是香草又是观赏植物。用于烤肉和意面调味极佳。</p>",
    "tips": "<p>1. 扦插或分株繁殖<br>2. 喜干怕湿，控水是关键<br>3. 充足光照使叶片更香<br>4. 花后修剪保持株形</p>",
    "balconyFit": "<p>耐旱耐晒，南向或西向阳台最适宜。需要良好通风。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 20,
    "suitablePot": "透气陶盆，2加仑以上",
    "minTemp": -5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:27.449Z",
    "_createdAt": "2026-06-07T15:47:27.449Z"
  },
  {
    "_id": "15a233946a25928701e997967da5f651",
    "id": "perilla",
    "name": "紫苏",
    "scientificName": "Perilla frutescens",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 25,
    "description": "<p>紫苏是中式料理的灵魂香草，紫绿色的叶片香气浓郁。阳台种一盆，炒菜、做鱼、包烤肉随摘随用。</p>",
    "tips": "<p>1. 种子细小，撒播不覆土<br>2. 喜光，光照越足叶片越紫<br>3. 摘嫩叶食用，越摘越旺<br>4. 秋季可收种子来年再种</p>",
    "balconyFit": "<p>适应性强，任何朝向都能种。南向阳台叶片颜色最紫。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "2加仑以上花盆",
    "minTemp": 10,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:19.477Z",
    "_createdAt": "2026-06-07T15:47:19.477Z"
  },
  {
    "_id": "15a233946a25928401e98e6135672977",
    "id": "chinese-kale",
    "name": "芥蓝",
    "scientificName": "Brassica oleracea var. albiflora",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "秋",
      "冬"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 45,
    "description": "<p>芥蓝是粤菜经典蔬菜，茎秆脆嫩甘甜。阳台盆栽选择早熟品种，秋冬种植效果最好。</p>",
    "tips": "<p>1. 选择早熟品种<br>2. 育苗后移栽<br>3. 主薹采收后侧薹继续生长<br>4. 施足基肥促进抽薹</p>",
    "balconyFit": "<p>喜冷凉，秋冬种植。南向阳台全日光照最佳。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 20,
    "suitablePot": "3加仑花盆或种植箱",
    "minTemp": 8,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:16.831Z",
    "_createdAt": "2026-06-07T15:47:16.831Z"
  },
  {
    "_id": "15a233946a25928201e98e4847d21650",
    "id": "garland-chrysanthemum",
    "name": "茼蒿",
    "scientificName": "Glebionis coronaria",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "秋",
      "冬"
    ],
    "sunlight": "partial",
    "water": "medium",
    "harvestDays": 30,
    "description": "<p>茼蒿有特殊的清香，涮火锅必备。阳台种植长得快，播种一个月就能摘来吃。</p>",
    "tips": "<p>1. 撒播，覆土1cm<br>2. 保持土壤湿润直到出苗<br>3. 长到15cm时可整株采收<br>4. 或摘嫩尖促发侧枝</p>",
    "balconyFit": "<p>喜冷凉气候，春秋季种植最佳。东向阳台最适宜。</p>",
    "suitableOrientations": [
      "east",
      "south",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "长条种植箱",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:14.183Z",
    "_createdAt": "2026-06-07T15:47:14.183Z"
  },
  {
    "_id": "15a233946a25927f01e98e296d9f4758",
    "id": "lettuce-leaf",
    "name": "油麦菜",
    "scientificName": "Lactuca sativa var. longifolia",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "秋",
      "冬"
    ],
    "sunlight": "partial",
    "water": "medium",
    "harvestDays": 30,
    "description": "<p>油麦菜是生菜的近亲，口感更脆嫩。耐热性比生菜好，阳台种植几乎零失败。</p>",
    "tips": "<p>1. 撒播后覆薄土<br>2. 出苗后间苗留8-10cm间距<br>3. 摘外叶食用可持续收获<br>4. 夏季适当遮阴防止抽薹</p>",
    "balconyFit": "<p>适应性强，东向、南向阳台均适合。耐半阴。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "长条种植箱或泡沫箱",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:11.532Z",
    "_createdAt": "2026-06-07T15:47:11.532Z"
  },
  {
    "_id": "15a233946a25927c01e98e0b11d7c930",
    "id": "amaranth",
    "name": "苋菜",
    "scientificName": "Amaranthus tricolor",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 25,
    "description": "<p>苋菜生长极快，播种后不到一个月就能收获。红苋菜的叶片色彩艳丽，既能吃又能观赏。</p>",
    "tips": "<p>1. 直接撒播，覆薄土<br>2. 出苗后15天即可间苗食用<br>3. 可多次采收嫩茎叶<br>4. 高温季节生长更快</p>",
    "balconyFit": "<p>耐热耐湿，夏季阳台也能长好。任何朝向均可。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "长条种植箱或2加仑花盆",
    "minTemp": 10,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:08.879Z",
    "_createdAt": "2026-06-07T15:47:08.879Z"
  },
  {
    "_id": "15a233946a25927401e984814030bc0b",
    "id": "pea",
    "name": "豌豆",
    "scientificName": "Pisum sativum",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "秋",
      "冬",
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 65,
    "description": "<p>豌豆秋冬种植，来年春天收获。嫩豆苗可以当豆苗菜吃，长大了结豆荚，一菜两吃。</p>",
    "tips": "<p>1. 选择矮生品种无需搭架<br>2. 播种前浸种12小时<br>3. 幼苗期可摘嫩尖食用<br>4. 豆荚饱满时采收</p>",
    "balconyFit": "<p>喜冷凉，秋冬春三季可种。南向或东向阳台均可。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 20,
    "suitablePot": "长条种植箱或3加仑花盆",
    "minTemp": 2,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:00.845Z",
    "_createdAt": "2026-06-07T15:47:00.845Z"
  },
  {
    "_id": "15a233946a25926f01e9843b648e68b7",
    "id": "luffa",
    "name": "丝瓜",
    "scientificName": "Luffa cylindrica",
    "category": "vegetable",
    "difficulty": "medium",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "high",
    "harvestDays": 70,
    "description": "<p>丝瓜攀爬能力强，一根藤能结十几个瓜。嫩瓜做菜，老瓜做丝瓜络，全身是宝。</p>",
    "tips": "<p>1. 需要大盆和牢固的爬架<br>2. 每天浇足水<br>3. 嫩瓜花后7-10天采收<br>4. 留1-2个瓜长老做丝瓜络</p>",
    "balconyFit": "<p>需要全日照和较大空间，南向阳台最佳。夏季爬藤可形成绿色遮阴帘。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 35,
    "suitablePot": "7加仑以上大盆+牢固爬架",
    "minTemp": 18,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:55.199Z",
    "_createdAt": "2026-06-07T15:46:55.199Z"
  },
  {
    "_id": "15a233946a25926701e983e4532e1f65",
    "id": "okra",
    "name": "秋葵",
    "scientificName": "Abelmoschus esculentus",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 55,
    "description": "<p>秋葵开黄色大花，结出翠绿的豆荚，观赏与食用兼备。一株秋葵能持续收获2-3个月。</p>",
    "tips": "<p>1. 直播或育苗移栽均可<br>2. 果实长到6-8cm时采摘最嫩<br>3. 采果后及时追肥<br>4. 植株可达1米，需要支撑</p>",
    "balconyFit": "<p>喜强光和温暖，南向阳台最佳。株型较高，注意防风。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上深盆",
    "minTemp": 18,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:47.261Z",
    "_createdAt": "2026-06-07T15:46:47.261Z"
  },
  {
    "_id": "15a233946a25926401e983ca6b5dbb26",
    "id": "water-spinach",
    "name": "空心菜",
    "scientificName": "Ipomoea aquatica",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "high",
    "harvestDays": 30,
    "description": "<p>夏季阳台必种！空心菜耐热耐湿，越热长得越快，是南方夏季阳台的主力蔬菜。</p>",
    "tips": "<p>1. 可用茎段扦插快速繁殖<br>2. 喜欢水，每天浇透<br>3. 摘嫩茎叶食用，越摘越旺<br>4. 35℃以上也能正常生长</p>",
    "balconyFit": "<p>喜高温高湿，南向或西向阳台最适合。夏季生长旺季每天浇水。</p>",
    "suitableOrientations": [
      "south",
      "west",
      "east"
    ],
    "minPotDepth": 15,
    "suitablePot": "2加仑以上花盆或泡沫箱",
    "minTemp": 15,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:44.612Z",
    "_createdAt": "2026-06-07T15:46:44.612Z"
  },
  {
    "_id": "15a233946a25925f01e9839534a496cd",
    "id": "celery",
    "name": "芹菜",
    "scientificName": "Apium graveolens",
    "category": "vegetable",
    "difficulty": "medium",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "partial",
    "water": "high",
    "harvestDays": 60,
    "description": "<p>阳台种芹菜香气浓郁，比超市买的更有芹菜味。摘叶食用可持续收获数月。</p>",
    "tips": "<p>1. 种子细小，育苗需耐心（10-15天出苗）<br>2. 保持土壤持续湿润<br>3. 摘外围叶柄食用，保留芯部<br>4. 夏季需遮阴降温</p>",
    "balconyFit": "<p>喜冷凉气候，东向阳台最适宜。需持续供水，不耐干旱。</p>",
    "suitableOrientations": [
      "east",
      "south"
    ],
    "minPotDepth": 20,
    "suitablePot": "长条种植箱",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:39.266Z",
    "_createdAt": "2026-06-07T15:46:39.266Z"
  },
  {
    "_id": "15a233946a25925c01e97a5957a82f2a",
    "id": "spinach",
    "name": "菠菜",
    "scientificName": "Spinacia oleracea",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "秋",
      "冬"
    ],
    "sunlight": "partial",
    "water": "medium",
    "harvestDays": 30,
    "description": "<p>营养丰富的绿叶菜，春秋季阳台上长得又快又好。播种后一个月就能收获，是新手必种的入门蔬菜。</p>",
    "tips": "<p>1. 直接撒播，覆土1cm，保持湿润<br>2. 出苗后及时间苗，保持5cm间距<br>3. 适时追施氮肥促进叶片生长<br>4. 摘外层大叶食用，留芯继续长</p>",
    "balconyFit": "<p>耐半阴，东向或北向阳台也能种。春秋季是黄金种植期。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "长条种植箱或20cm以上花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:36.603Z",
    "_createdAt": "2026-06-07T15:46:36.603Z"
  },
  {
    "_id": "15a233946a25925701e973ee15a41dd4",
    "id": "cucumber",
    "name": "黄瓜",
    "scientificName": "Cucumis sativus",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "high",
    "harvestDays": 50,
    "description": "<p>阳台夏季必备！黄瓜生长迅速，攀爬能力强，搭个架子就能收获满满的清脆黄瓜。</p>",
    "tips": "<p>1. 需要搭架或牵引绳让藤蔓攀爬<br>2. 每天浇水保持土壤湿润<br>3. 及时采摘嫩瓜，过老会发苦<br>4. 选用水果黄瓜品种更适合阳台盆栽</p>",
    "balconyFit": "<p>适合南向和东南向阳台。需要充足光照和较大空间，建议用深盆并搭架。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上深盆，搭配爬藤架",
    "minTemp": 15,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:31.093Z",
    "_createdAt": "2026-06-07T15:46:31.093Z"
  },
  {
    "_id": "11d826726a26ab29004a6e976922448a",
    "id": "shiitake",
    "name": "香菇",
    "scientificName": "Lentinula edodes",
    "category": "mushroom",
    "difficulty": "medium",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "shade",
    "water": "high",
    "harvestDays": 14,
    "description": "<p>在家种出新鲜香菇，比超市买的香十倍！需要菌棒或段木，温度和湿度控制好的话一年可收3-4茬。</p>",
    "tips": "<p>1. 购买香菇菌棒开始<br>2. 温度15-25℃最适合出菇<br>3. 每天喷水保持湿度85%以上<br>4. 菇伞6-7分开时采收风味最佳</p>",
    "balconyFit": "<p>北向阳台或卫生间旁阴暗处最佳。需要保持高湿度。</p>",
    "suitableOrientations": [
      "north"
    ],
    "minPotDepth": 0,
    "suitablePot": "菌棒放在塑料筐或托盘上",
    "minTemp": 8,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:41.040Z",
    "_createdAt": "2026-06-08T11:44:41.040Z"
  },
  {
    "_id": "11d826726a26ab23004a6e502dbf655b",
    "id": "water-lily",
    "name": "睡莲",
    "scientificName": "Nymphaea spp.",
    "category": "aquatic",
    "difficulty": "medium",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "high",
    "harvestDays": 0,
    "description": "<p>睡莲浮在水面的花朵像莫奈的画一样梦幻。选择微型品种，一个小水缸就能在阳台上种出一片小池塘。</p>",
    "tips": "<p>1. 选微型或小型品种（如'海尔芙拉'）<br>2. 根茎埋入塘泥，水深20-40cm<br>3. 必须全日照才能开花<br>4. 冬天茎叶枯萎，来年重新萌发</p>",
    "balconyFit": "<p>南向阳台全日照。需要较大水缸和塘泥。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 30,
    "suitablePot": "直径40cm以上水缸+塘泥",
    "minTemp": -5,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:35.767Z",
    "_createdAt": "2026-06-08T11:44:35.767Z"
  },
  {
    "_id": "11d826726a26ab21004a6e3130da1587",
    "id": "pennywort",
    "name": "铜钱草",
    "scientificName": "Hydrocotyle verticillata",
    "category": "aquatic",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "high",
    "harvestDays": 0,
    "description": "<p>铜钱草圆圆的叶片像一枚枚小铜钱，寓意财源滚滚。半土半水种植最旺盛，给点阳光就疯长。</p>",
    "tips": "<p>1. 半土半水长得最快<br>2. 全日照下叶片最大最圆<br>3. 缺水就蔫，加水立挺<br>4. 分株繁殖极快</p>",
    "balconyFit": "<p>南向阳台全日照最旺盛。半土半水种植最简单。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 12,
    "suitablePot": "无孔容器+塘泥半土半水",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:33.132Z",
    "_createdAt": "2026-06-08T11:44:33.132Z"
  },
  {
    "_id": "11d826726a26ab0e004a6d5543aba8b0",
    "id": "tulip",
    "name": "郁金香",
    "scientificName": "Tulipa gesneriana",
    "category": "bulb",
    "difficulty": "medium",
    "season": [
      "秋",
      "冬"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>郁金香是春天的使者，杯状花朵亭亭玉立，色彩缤纷如调色盘。秋冬种下种球，来年春天就能收获一盆灿烂。</p>",
    "tips": "<p>1. 11-12月种下种球，覆土10cm<br>2. 种球需经过低温春化才能开花<br>3. 开花期停止施肥<br>4. 花后养叶子养球，来年复花</p>",
    "balconyFit": "<p>秋冬种球时放室外低温处理。春季开花时南向阳台最佳。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 20,
    "suitablePot": "3加仑以上花盆，可密植5-8球",
    "minTemp": -15,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:14.578Z",
    "_createdAt": "2026-06-08T11:44:14.578Z"
  },
  {
    "_id": "11d826726a26ab09004a6d050c7ac65d",
    "id": "lucky-bamboo",
    "name": "富贵竹",
    "scientificName": "Dracaena sanderiana",
    "category": "foliage",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋",
      "冬"
    ],
    "sunlight": "shade",
    "water": "high",
    "harvestDays": 0,
    "description": "<p>富贵竹寓意吉祥富贵，是最受欢迎的风水绿植。水培干净清爽，几根插在玻璃瓶里就是一道风景。</p>",
    "tips": "<p>1. 水培最方便，水少了加水即可<br>2. 用晾过的自来水或纯净水<br>3. 避免阳光直射<br>4. 水中加一两颗活性炭防臭</p>",
    "balconyFit": "<p>北向阳台或室内散射光最佳。水培养护最简单。</p>",
    "suitableOrientations": [
      "north",
      "east"
    ],
    "minPotDepth": 10,
    "suitablePot": "玻璃瓶水培或小花盆",
    "minTemp": 10,
    "status": "published",
    "_updatedAt": "2026-06-08T11:44:09.300Z",
    "_createdAt": "2026-06-08T11:44:09.300Z"
  },
  {
    "_id": "11d826726a2592d1003cf754530fb828",
    "id": "goji-berry",
    "name": "枸杞",
    "scientificName": "Lycium barbarum",
    "category": "fruit",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>枸杞全身是宝——春天摘嫩叶做菜（枸杞叶），夏秋采红果泡茶。耐旱耐寒，几乎不用管。</p>",
    "tips": "<p>1. 扦插极易成活<br>2. 耐旱，控水养根<br>3. 春采叶，秋采果<br>4. 冬季落叶，来年春季萌发</p>",
    "balconyFit": "<p>适应性极强，南向阳台最佳。耐旱耐寒耐贫瘠。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west"
    ],
    "minPotDepth": 25,
    "suitablePot": "3加仑以上花盆",
    "minTemp": -20,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:33.739Z",
    "_createdAt": "2026-06-07T15:48:33.739Z"
  },
  {
    "_id": "11d826726a2592cc003cf72a59bc8987",
    "id": "passion-fruit",
    "name": "百香果",
    "scientificName": "Passiflora edulis",
    "category": "fruit",
    "difficulty": "medium",
    "season": [
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>百香果是热带水果，藤蔓攀爬能力强，花像艺术品一样奇特美丽。果实香气浓郁，泡水做饮料一绝。</p>",
    "tips": "<p>1. 需要搭架供藤蔓攀爬<br>2. 需人工授粉提高坐果率<br>3. 果实变紫落地时采收<br>4. 冬季注意防寒</p>",
    "balconyFit": "<p>南向阳台全日照，需要搭爬架。开花需要人工授粉。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 35,
    "suitablePot": "7加仑以上大盆+爬架",
    "minTemp": 10,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:28.438Z",
    "_createdAt": "2026-06-07T15:48:28.438Z"
  },
  {
    "_id": "11d826726a2592c7003cf7050a6918dd",
    "id": "kumquat",
    "name": "金桔",
    "scientificName": "Citrus japonica",
    "category": "fruit",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>金桔是盆栽果树的首选，挂果期超长，金黄色的果实挂满枝头非常喜庆。连皮一起吃，甜中带酸。</p>",
    "tips": "<p>1. 选嫁接苗来年就能结果<br>2. 喜光，越晒果子越甜<br>3. 花后疏果保证品质<br>4. 冬季适当控水</p>",
    "balconyFit": "<p>南向阳台全日照最适宜。比柠檬更耐寒，养护相对简单。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上花盆",
    "minTemp": 0,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:23.153Z",
    "_createdAt": "2026-06-07T15:48:23.153Z"
  },
  {
    "_id": "11d826726a2592c4003cf6f85e609f2c",
    "id": "lemon-tree",
    "name": "柠檬",
    "scientificName": "Citrus × limon",
    "category": "fruit",
    "difficulty": "medium",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>阳台盆栽柠檬树，四季常青，花香果美。一棵树上有花有果，视觉和味觉的双重享受。</p>",
    "tips": "<p>1. 选嫁接苗，结果更快<br>2. 喜光，全日照最好<br>3. 花期人工授粉提高坐果率<br>4. 冬季入室防寒</p>",
    "balconyFit": "<p>南向阳台全日照最佳。选择矮化品种（如'香水柠檬'）更适合盆栽。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 35,
    "suitablePot": "7加仑以上大盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:20.515Z",
    "_createdAt": "2026-06-07T15:48:20.515Z"
  },
  {
    "_id": "11d826726a2592b4003cf6b16454918c",
    "id": "plumbago",
    "name": "蓝雪花",
    "scientificName": "Plumbago auriculata",
    "category": "flower",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 0,
    "description": "<p>蓝雪花是阳台花卉的'蓝色精灵'，淡蓝色花球从春开到秋。耐热耐晒，夏季阳台的主力花卉。</p>",
    "tips": "<p>1. 喜光耐热，越晒越开花<br>2. 花后轻剪促复花<br>3. 生长期保持水肥充足<br>4. 可做垂吊或爬藤造型</p>",
    "balconyFit": "<p>南向阳台最佳，夏季高温也能持续开花。耐热性极强。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 20,
    "suitablePot": "3加仑花盆或挂盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:48:04.649Z",
    "_createdAt": "2026-06-07T15:48:04.649Z"
  },
  {
    "_id": "11d826726a2592a9003cf6435f16a78a",
    "id": "geranium",
    "name": "天竺葵",
    "scientificName": "Pelargonium × hortorum",
    "category": "flower",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 0,
    "description": "<p>天竺葵是欧洲阳台的标配花卉，花球饱满色彩艳丽。耐旱好养，还有驱蚊效果。</p>",
    "tips": "<p>1. 宁干勿湿，怕水涝<br>2. 充足光照促花<br>3. 花后修剪残花<br>4. 扦插极易成活</p>",
    "balconyFit": "<p>南向或西向阳台最佳。耐旱怕涝，是阳台'懒人花'。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 15,
    "suitablePot": "透气陶盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:53.954Z",
    "_createdAt": "2026-06-07T15:47:53.954Z"
  },
  {
    "_id": "11d826726a2592a4003cf61977d42ea6",
    "id": "shiso",
    "name": "紫苏（青苏）",
    "scientificName": "Perilla frutescens var. crispa",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "夏",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 30,
    "description": "<p>青紫苏是日料必备香草，搭配生鱼片和天妇罗风味绝佳。叶片清香，生长旺盛。</p>",
    "tips": "<p>1. 播种繁殖，出苗率高<br>2. 摘嫩叶食用<br>3. 花后结籽可留种<br>4. 自播能力强</p>",
    "balconyFit": "<p>适应性强，各种朝向均可。南向阳台生长最快。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west",
      "north"
    ],
    "minPotDepth": 15,
    "suitablePot": "2加仑以上花盆",
    "minTemp": 5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:48.674Z",
    "_createdAt": "2026-06-07T15:47:48.674Z"
  },
  {
    "_id": "11d826726a25929c003cf5f00666ec79",
    "id": "dill",
    "name": "莳萝",
    "scientificName": "Anethum graveolens",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 35,
    "description": "<p>莳萝是北欧料理的代表香草，搭配三文鱼一绝。羽毛状的叶片轻盈飘逸，开花也很美。</p>",
    "tips": "<p>1. 直播，不耐移栽<br>2. 保持土壤湿润<br>3. 嫩叶随时采收<br>4. 花后收种子可当调料</p>",
    "balconyFit": "<p>喜光照充足，南向或东向阳台适合。植株较高需要防风。</p>",
    "suitableOrientations": [
      "south",
      "east"
    ],
    "minPotDepth": 20,
    "suitablePot": "2加仑以上花盆",
    "minTemp": 8,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:40.711Z",
    "_createdAt": "2026-06-07T15:47:40.711Z"
  },
  {
    "_id": "11d826726a25928c003cf55d30f04fb1",
    "id": "thyme",
    "name": "百里香",
    "scientificName": "Thymus vulgaris",
    "category": "herb",
    "difficulty": "easy",
    "season": [
      "春",
      "秋"
    ],
    "sunlight": "full",
    "water": "low",
    "harvestDays": 50,
    "description": "<p>百里香是西餐百搭香草，炖肉、烤蔬菜、做汤都少不了它。植株小巧精致，适合小盆种植。</p>",
    "tips": "<p>1. 扦插易成活<br>2. 喜干燥怕潮湿<br>3. 充足光照才能积累香气<br>4. 花后修剪促分枝</p>",
    "balconyFit": "<p>喜光照充足和通风良好的环境。南向阳台最适宜。</p>",
    "suitableOrientations": [
      "south",
      "west"
    ],
    "minPotDepth": 15,
    "suitablePot": "透气陶盆",
    "minTemp": -5,
    "status": "published",
    "_updatedAt": "2026-06-07T15:47:24.781Z",
    "_createdAt": "2026-06-07T15:47:24.781Z"
  },
  {
    "_id": "11d826726a259271003cf4d64875e619",
    "id": "cowpea",
    "name": "豇豆",
    "scientificName": "Vigna unguiculata",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春",
      "夏"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 60,
    "description": "<p>豇豆是阳台种菜的'高产王'，几棵就能收获一大把。豆角挂满藤架，观赏性也很强。</p>",
    "tips": "<p>1. 直播，每穴3-4粒种子<br>2. 出苗后搭架引蔓<br>3. 豆荚饱满但未鼓粒时采收<br>4. 及时采摘促进后续结荚</p>",
    "balconyFit": "<p>喜光耐热，南向或东南向阳台最佳。需要搭架供藤蔓攀爬。</p>",
    "suitableOrientations": [
      "south",
      "east",
      "west"
    ],
    "minPotDepth": 25,
    "suitablePot": "3加仑以上花盆配支架",
    "minTemp": 15,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:57.875Z",
    "_createdAt": "2026-06-07T15:46:57.875Z"
  },
  {
    "_id": "11d826726a259269003cf4b64a8d6562",
    "id": "zucchini",
    "name": "西葫芦",
    "scientificName": "Cucurbita pepo",
    "category": "vegetable",
    "difficulty": "easy",
    "season": [
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 45,
    "description": "<p>西葫芦生长速度惊人，从播种到收获不到两个月。一朵花一个瓜，产量可观。</p>",
    "tips": "<p>1. 选矮生品种适合盆栽<br>2. 需要人工授粉（雌花下面有小瓜）<br>3. 果实15-20cm时采收最嫩<br>4. 及时摘除老叶保持通风</p>",
    "balconyFit": "<p>需要全日照，南向阳台最佳。植株较大，需要充足空间。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 35,
    "suitablePot": "7加仑以上大盆或种植箱",
    "minTemp": 12,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:49.904Z",
    "_createdAt": "2026-06-07T15:46:49.904Z"
  },
  {
    "_id": "11d826726a259259003cf45c641553be",
    "id": "eggplant",
    "name": "茄子",
    "scientificName": "Solanum melongena",
    "category": "vegetable",
    "difficulty": "medium",
    "season": [
      "春"
    ],
    "sunlight": "full",
    "water": "medium",
    "harvestDays": 70,
    "description": "<p>紫黑色的果实挂在枝头非常好看，既能观赏又能食用。阳台盆栽选择矮生品种效果最佳。</p>",
    "tips": "<p>1. 选择矮生盆栽品种（如'黑美人'）<br>2. 开花后需人工授粉提高坐果率<br>3. 每10天追施磷钾肥一次<br>4. 及时摘除老叶保持通风</p>",
    "balconyFit": "<p>喜强光，南向阳台最适宜。需要较大容器和充足肥水。</p>",
    "suitableOrientations": [
      "south"
    ],
    "minPotDepth": 30,
    "suitablePot": "5加仑以上花盆",
    "minTemp": 15,
    "status": "published",
    "_updatedAt": "2026-06-07T15:46:33.916Z",
    "_createdAt": "2026-06-07T15:46:33.916Z"
  }
];
