/**
 * 批量添加植物到 CMS 数据库
 * 用法: CMS_ADMIN_PASSWORD=xxx node scripts/bulk-add-plants.mjs
 *
 * CMS API 写入限制 30 次/分钟，本脚本每条间隔 2.5 秒（24条/分钟）
 */

import { writeFileSync, existsSync } from "fs";

const CMS_API = process.env.CMS_API || "https://yangtaixiaoyuanding-d7b1c10c2d50.service.tcloudbase.com/api/cms";
const PASSWORD = process.env.CMS_ADMIN_PASSWORD;

if (!PASSWORD) {
  console.error("❌ 请设置 CMS_ADMIN_PASSWORD 环境变量");
  console.error("   CMS_ADMIN_PASSWORD=xxx node scripts/bulk-add-plants.mjs");
  process.exit(1);
}

const plants = [
  // ==================== 蔬菜 (vegetable) ====================
  {
    id: "cucumber", name: "黄瓜", scientificName: "Cucumis sativus", category: "vegetable", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 50,
    description: "<p>阳台夏季必备！黄瓜生长迅速，攀爬能力强，搭个架子就能收获满满的清脆黄瓜。</p>",
    tips: "<p>1. 需要搭架或牵引绳让藤蔓攀爬<br>2. 每天浇水保持土壤湿润<br>3. 及时采摘嫩瓜，过老会发苦<br>4. 选用水果黄瓜品种更适合阳台盆栽</p>",
    balconyFit: "<p>适合南向和东南向阳台。需要充足光照和较大空间，建议用深盆并搭架。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 30, suitablePot: "5加仑以上深盆，搭配爬藤架", minTemp: 15,
  },
  {
    id: "eggplant", name: "茄子", scientificName: "Solanum melongena", category: "vegetable", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 70,
    description: "<p>紫黑色的果实挂在枝头非常好看，既能观赏又能食用。阳台盆栽选择矮生品种效果最佳。</p>",
    tips: "<p>1. 选择矮生盆栽品种（如'黑美人'）<br>2. 开花后需人工授粉提高坐果率<br>3. 每10天追施磷钾肥一次<br>4. 及时摘除老叶保持通风</p>",
    balconyFit: "<p>喜强光，南向阳台最适宜。需要较大容器和充足肥水。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "5加仑以上花盆", minTemp: 15,
  },
  {
    id: "spinach", name: "菠菜", scientificName: "Spinacia oleracea", category: "vegetable", difficulty: "easy",
    season: ["春","秋","冬"], sunlight: "partial", water: "medium", harvestDays: 30,
    description: "<p>营养丰富的绿叶菜，春秋季阳台上长得又快又好。播种后一个月就能收获，是新手必种的入门蔬菜。</p>",
    tips: "<p>1. 直接撒播，覆土1cm，保持湿润<br>2. 出苗后及时间苗，保持5cm间距<br>3. 适时追施氮肥促进叶片生长<br>4. 摘外层大叶食用，留芯继续长</p>",
    balconyFit: "<p>耐半阴，东向或北向阳台也能种。春秋季是黄金种植期。</p>",
    suitableOrientations: ["south","east","north"], minPotDepth: 15, suitablePot: "长条种植箱或20cm以上花盆", minTemp: 5,
  },
  {
    id: "celery", name: "芹菜", scientificName: "Apium graveolens", category: "vegetable", difficulty: "medium",
    season: ["春","秋"], sunlight: "partial", water: "high", harvestDays: 60,
    description: "<p>阳台种芹菜香气浓郁，比超市买的更有芹菜味。摘叶食用可持续收获数月。</p>",
    tips: "<p>1. 种子细小，育苗需耐心（10-15天出苗）<br>2. 保持土壤持续湿润<br>3. 摘外围叶柄食用，保留芯部<br>4. 夏季需遮阴降温</p>",
    balconyFit: "<p>喜冷凉气候，东向阳台最适宜。需持续供水，不耐干旱。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 20, suitablePot: "长条种植箱", minTemp: 5,
  },
  {
    id: "chinese-chives", name: "韭菜", scientificName: "Allium tuberosum", category: "vegetable", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "medium", harvestDays: 40,
    description: "<p>韭菜是阳台种植的'懒人菜'，种一次可以反复收割2-3年。割完一茬又长一茬，越割越旺。</p>",
    tips: "<p>1. 可用韭菜根直接种植，比播种快很多<br>2. 收割时留3-4cm茬口<br>3. 每次收割后追施氮肥<br>4. 冬季地上部分枯萎，来年春天重新萌发</p>",
    balconyFit: "<p>适应性极强，任何朝向都能种。南向长得最快，北向也能正常生长。</p>",
    suitableOrientations: ["south","east","west","north"], minPotDepth: 20, suitablePot: "长条种植箱或2加仑以上花盆", minTemp: -10,
  },
  {
    id: "water-spinach", name: "空心菜", scientificName: "Ipomoea aquatica", category: "vegetable", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 30,
    description: "<p>夏季阳台必种！空心菜耐热耐湿，越热长得越快，是南方夏季阳台的主力蔬菜。</p>",
    tips: "<p>1. 可用茎段扦插快速繁殖<br>2. 喜欢水，每天浇透<br>3. 摘嫩茎叶食用，越摘越旺<br>4. 35℃以上也能正常生长</p>",
    balconyFit: "<p>喜高温高湿，南向或西向阳台最适合。夏季生长旺季每天浇水。</p>",
    suitableOrientations: ["south","west","east"], minPotDepth: 15, suitablePot: "2加仑以上花盆或泡沫箱", minTemp: 15,
  },
  {
    id: "okra", name: "秋葵", scientificName: "Abelmoschus esculentus", category: "vegetable", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 55,
    description: "<p>秋葵开黄色大花，结出翠绿的豆荚，观赏与食用兼备。一株秋葵能持续收获2-3个月。</p>",
    tips: "<p>1. 直播或育苗移栽均可<br>2. 果实长到6-8cm时采摘最嫩<br>3. 采果后及时追肥<br>4. 植株可达1米，需要支撑</p>",
    balconyFit: "<p>喜强光和温暖，南向阳台最佳。株型较高，注意防风。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 30, suitablePot: "5加仑以上深盆", minTemp: 18,
  },
  {
    id: "zucchini", name: "西葫芦", scientificName: "Cucurbita pepo", category: "vegetable", difficulty: "easy",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 45,
    description: "<p>西葫芦生长速度惊人，从播种到收获不到两个月。一朵花一个瓜，产量可观。</p>",
    tips: "<p>1. 选矮生品种适合盆栽<br>2. 需要人工授粉（雌花下面有小瓜）<br>3. 果实15-20cm时采收最嫩<br>4. 及时摘除老叶保持通风</p>",
    balconyFit: "<p>需要全日照，南向阳台最佳。植株较大，需要充足空间。</p>",
    suitableOrientations: ["south"], minPotDepth: 35, suitablePot: "7加仑以上大盆或种植箱", minTemp: 12,
  },
  {
    id: "bitter-gourd", name: "苦瓜", scientificName: "Momordica charantia", category: "vegetable", difficulty: "medium",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 60,
    description: "<p>苦瓜清热解暑，夏季阳台种植既能遮阴又能收获。虽然味道苦，但越苦越健康。</p>",
    tips: "<p>1. 需要搭架攀爬<br>2. 开花后需人工授粉<br>3. 果实饱满有光泽时采收<br>4. 蚜虫高发期注意防治</p>",
    balconyFit: "<p>喜高温强光，南向或西向阳台合适。爬藤可遮挡夏季烈日。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 30, suitablePot: "5加仑以上花盆配爬藤架", minTemp: 18,
  },
  {
    id: "luffa", name: "丝瓜", scientificName: "Luffa cylindrica", category: "vegetable", difficulty: "medium",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 70,
    description: "<p>丝瓜攀爬能力强，一根藤能结十几个瓜。嫩瓜做菜，老瓜做丝瓜络，全身是宝。</p>",
    tips: "<p>1. 需要大盆和牢固的爬架<br>2. 每天浇足水<br>3. 嫩瓜花后7-10天采收<br>4. 留1-2个瓜长老做丝瓜络</p>",
    balconyFit: "<p>需要全日照和较大空间，南向阳台最佳。夏季爬藤可形成绿色遮阴帘。</p>",
    suitableOrientations: ["south"], minPotDepth: 35, suitablePot: "7加仑以上大盆+牢固爬架", minTemp: 18,
  },
  {
    id: "cowpea", name: "豇豆", scientificName: "Vigna unguiculata", category: "vegetable", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 60,
    description: "<p>豇豆是阳台种菜的'高产王'，几棵就能收获一大把。豆角挂满藤架，观赏性也很强。</p>",
    tips: "<p>1. 直播，每穴3-4粒种子<br>2. 出苗后搭架引蔓<br>3. 豆荚饱满但未鼓粒时采收<br>4. 及时采摘促进后续结荚</p>",
    balconyFit: "<p>喜光耐热，南向或东南向阳台最佳。需要搭架供藤蔓攀爬。</p>",
    suitableOrientations: ["south","east","west"], minPotDepth: 25, suitablePot: "3加仑以上花盆配支架", minTemp: 15,
  },
  {
    id: "pea", name: "豌豆", scientificName: "Pisum sativum", category: "vegetable", difficulty: "easy",
    season: ["秋","冬","春"], sunlight: "full", water: "medium", harvestDays: 65,
    description: "<p>豌豆秋冬种植，来年春天收获。嫩豆苗可以当豆苗菜吃，长大了结豆荚，一菜两吃。</p>",
    tips: "<p>1. 选择矮生品种无需搭架<br>2. 播种前浸种12小时<br>3. 幼苗期可摘嫩尖食用<br>4. 豆荚饱满时采收</p>",
    balconyFit: "<p>喜冷凉，秋冬春三季可种。南向或东向阳台均可。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "长条种植箱或3加仑花盆", minTemp: 2,
  },
  {
    id: "broccoli", name: "西兰花", scientificName: "Brassica oleracea var. italica", category: "vegetable", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 75,
    description: "<p>西兰花营养价值极高，阳台盆栽一棵就能收获一颗大花球。收获后侧枝还会继续长出小花球。</p>",
    tips: "<p>1. 育苗后移栽，株距40cm<br>2. 生长期需充足氮肥<br>3. 花球紧密饱满时采收<br>4. 采收主花球后侧枝会继续结小球</p>",
    balconyFit: "<p>需要充足光照和较大空间，南向阳台最合适。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "5加仑以上花盆", minTemp: 5,
  },
  {
    id: "cabbage", name: "卷心菜", scientificName: "Brassica oleracea var. capitata", category: "vegetable", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 80,
    description: "<p>阳台盆栽卷心菜，从外叶展开到内心卷曲，整个过程非常治愈。选早熟小型品种更适合盆栽。</p>",
    tips: "<p>1. 选早熟小型品种<br>2. 育苗后移栽到大盆<br>3. 定期追肥促进包心<br>4. 注意防治菜青虫</p>",
    balconyFit: "<p>喜冷凉气候和充足光照，南向或东向阳台合适。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 25, suitablePot: "3加仑以上花盆", minTemp: 5,
  },
  {
    id: "amaranth", name: "苋菜", scientificName: "Amaranthus tricolor", category: "vegetable", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 25,
    description: "<p>苋菜生长极快，播种后不到一个月就能收获。红苋菜的叶片色彩艳丽，既能吃又能观赏。</p>",
    tips: "<p>1. 直接撒播，覆薄土<br>2. 出苗后15天即可间苗食用<br>3. 可多次采收嫩茎叶<br>4. 高温季节生长更快</p>",
    balconyFit: "<p>耐热耐湿，夏季阳台也能长好。任何朝向均可。</p>",
    suitableOrientations: ["south","east","west","north"], minPotDepth: 15, suitablePot: "长条种植箱或2加仑花盆", minTemp: 10,
  },
  {
    id: "lettuce-leaf", name: "油麦菜", scientificName: "Lactuca sativa var. longifolia", category: "vegetable", difficulty: "easy",
    season: ["春","秋","冬"], sunlight: "partial", water: "medium", harvestDays: 30,
    description: "<p>油麦菜是生菜的近亲，口感更脆嫩。耐热性比生菜好，阳台种植几乎零失败。</p>",
    tips: "<p>1. 撒播后覆薄土<br>2. 出苗后间苗留8-10cm间距<br>3. 摘外叶食用可持续收获<br>4. 夏季适当遮阴防止抽薹</p>",
    balconyFit: "<p>适应性强，东向、南向阳台均适合。耐半阴。</p>",
    suitableOrientations: ["south","east","north"], minPotDepth: 15, suitablePot: "长条种植箱或泡沫箱", minTemp: 5,
  },
  {
    id: "garland-chrysanthemum", name: "茼蒿", scientificName: "Glebionis coronaria", category: "vegetable", difficulty: "easy",
    season: ["春","秋","冬"], sunlight: "partial", water: "medium", harvestDays: 30,
    description: "<p>茼蒿有特殊的清香，涮火锅必备。阳台种植长得快，播种一个月就能摘来吃。</p>",
    tips: "<p>1. 撒播，覆土1cm<br>2. 保持土壤湿润直到出苗<br>3. 长到15cm时可整株采收<br>4. 或摘嫩尖促发侧枝</p>",
    balconyFit: "<p>喜冷凉气候，春秋季种植最佳。东向阳台最适宜。</p>",
    suitableOrientations: ["east","south","north"], minPotDepth: 15, suitablePot: "长条种植箱", minTemp: 5,
  },
  {
    id: "chinese-kale", name: "芥蓝", scientificName: "Brassica oleracea var. albiflora", category: "vegetable", difficulty: "easy",
    season: ["秋","冬"], sunlight: "full", water: "medium", harvestDays: 45,
    description: "<p>芥蓝是粤菜经典蔬菜，茎秆脆嫩甘甜。阳台盆栽选择早熟品种，秋冬种植效果最好。</p>",
    tips: "<p>1. 选择早熟品种<br>2. 育苗后移栽<br>3. 主薹采收后侧薹继续生长<br>4. 施足基肥促进抽薹</p>",
    balconyFit: "<p>喜冷凉，秋冬种植。南向阳台全日光照最佳。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "3加仑花盆或种植箱", minTemp: 8,
  },

  // ==================== 香草 (herb) ====================
  {
    id: "perilla", name: "紫苏", scientificName: "Perilla frutescens", category: "herb", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 25,
    description: "<p>紫苏是中式料理的灵魂香草，紫绿色的叶片香气浓郁。阳台种一盆，炒菜、做鱼、包烤肉随摘随用。</p>",
    tips: "<p>1. 种子细小，撒播不覆土<br>2. 喜光，光照越足叶片越紫<br>3. 摘嫩叶食用，越摘越旺<br>4. 秋季可收种子来年再种</p>",
    balconyFit: "<p>适应性强，任何朝向都能种。南向阳台叶片颜色最紫。</p>",
    suitableOrientations: ["south","east","west","north"], minPotDepth: 15, suitablePot: "2加仑以上花盆", minTemp: 10,
  },
  {
    id: "rosemary", name: "迷迭香", scientificName: "Salvia rosmarinus", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 60,
    description: "<p>迷迭香是地中海料理的经典香草，烤肉、煎牛排必备。耐旱耐晒，是阳台'懒人植物'的代表。</p>",
    tips: "<p>1. 扦插繁殖最容易成活<br>2. 宁干勿湿，怕积水烂根<br>3. 充足光照促进精油积累<br>4. 定期修剪保持株形紧凑</p>",
    balconyFit: "<p>喜强光和干燥，南向或西向阳台最理想。非常耐旱。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 20, suitablePot: "透气陶盆，2加仑以上", minTemp: -5,
  },
  {
    id: "thyme", name: "百里香", scientificName: "Thymus vulgaris", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 50,
    description: "<p>百里香是西餐百搭香草，炖肉、烤蔬菜、做汤都少不了它。植株小巧精致，适合小盆种植。</p>",
    tips: "<p>1. 扦插易成活<br>2. 喜干燥怕潮湿<br>3. 充足光照才能积累香气<br>4. 花后修剪促分枝</p>",
    balconyFit: "<p>喜光照充足和通风良好的环境。南向阳台最适宜。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 15, suitablePot: "透气陶盆", minTemp: -5,
  },
  {
    id: "sage", name: "鼠尾草", scientificName: "Salvia officinalis", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 50,
    description: "<p>鼠尾草银灰色的叶片自带高级感，既是香草又是观赏植物。用于烤肉和意面调味极佳。</p>",
    tips: "<p>1. 扦插或分株繁殖<br>2. 喜干怕湿，控水是关键<br>3. 充足光照使叶片更香<br>4. 花后修剪保持株形</p>",
    balconyFit: "<p>耐旱耐晒，南向或西向阳台最适宜。需要良好通风。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 20, suitablePot: "透气陶盆，2加仑以上", minTemp: -5,
  },
  {
    id: "chamomile", name: "洋甘菊", scientificName: "Matricaria chamomilla", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 60,
    description: "<p>洋甘菊开白色小花，苹果般清香。花朵可泡茶助眠安神，是阳台上的'天然药箱'。</p>",
    tips: "<p>1. 撒播，不覆土（需光发芽）<br>2. 出苗后间苗保持15cm间距<br>3. 花朵盛开时采收晾干<br>4. 花后可留种来年再种</p>",
    balconyFit: "<p>喜光照充足，南向或东向阳台最佳。植株小巧适合盆栽。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 15, suitablePot: "2加仑以上花盆", minTemp: 5,
  },
  {
    id: "lemongrass", name: "柠檬草", scientificName: "Cymbopogon citratus", category: "herb", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 60,
    description: "<p>柠檬草（香茅）有浓郁的柠檬香气，是做冬阴功汤和东南亚料理的必备香草。叶片细长飘逸，观赏性强。</p>",
    tips: "<p>1. 可用超市买的香茅茎水培生根<br>2. 喜温暖湿润环境<br>3. 剪取茎秆使用，会不断萌发新茎<br>4. 冬季需移入室内防寒</p>",
    balconyFit: "<p>喜温暖和充足光照，南向阳台最佳。不耐寒，冬季注意保温。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 25, suitablePot: "3加仑以上花盆", minTemp: 10,
  },
  {
    id: "oregano", name: "牛至", scientificName: "Origanum vulgare", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 45,
    description: "<p>牛至是披萨和意面的灵魂香料，也叫'披萨草'。耐旱耐贫瘠，几乎是种不死的香草。</p>",
    tips: "<p>1. 扦插极易成活<br>2. 控水，土壤干了再浇<br>3. 开花前采收叶片香气最佳<br>4. 定期修剪促进分枝</p>",
    balconyFit: "<p>极耐旱，南向或西向阳台最佳。通风良好时几乎无病虫害。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 15, suitablePot: "透气陶盆或加仑盆", minTemp: -10,
  },
  {
    id: "parsley", name: "欧芹", scientificName: "Petroselinum crispum", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "partial", water: "medium", harvestDays: 40,
    description: "<p>欧芹是西餐摆盘和调味的经典香草。叶片翠绿卷曲，既是食材也是阳台上的美丽盆栽。</p>",
    tips: "<p>1. 种子发芽慢，浸种24小时再播<br>2. 出苗后保持土壤湿润<br>3. 摘外叶食用，留芯继续长<br>4. 夏季适当遮阴</p>",
    balconyFit: "<p>耐半阴，东向阳台最适合。也可在南向阳台与其他高株植物搭配。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 20, suitablePot: "2加仑以上花盆", minTemp: 5,
  },
  {
    id: "dill", name: "莳萝", scientificName: "Anethum graveolens", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 35,
    description: "<p>莳萝是北欧料理的代表香草，搭配三文鱼一绝。羽毛状的叶片轻盈飘逸，开花也很美。</p>",
    tips: "<p>1. 直播，不耐移栽<br>2. 保持土壤湿润<br>3. 嫩叶随时采收<br>4. 花后收种子可当调料</p>",
    balconyFit: "<p>喜光照充足，南向或东向阳台适合。植株较高需要防风。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "2加仑以上花盆", minTemp: 8,
  },
  {
    id: "spearmint", name: "留兰香", scientificName: "Mentha spicata", category: "herb", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "high", harvestDays: 25,
    description: "<p>留兰香（绿薄荷）比普通薄荷更清香甜美，是做莫吉托和薄荷茶的首选。生长旺盛，一盆变十盆。</p>",
    tips: "<p>1. 扦插或分株繁殖最快<br>2. 喜水，保持土壤湿润<br>3. 定期摘心促分枝<br>4. 侵略性强，建议单独盆栽</p>",
    balconyFit: "<p>适应性极强，任何朝向都能蓬勃生长。北向阳台也能长好。</p>",
    suitableOrientations: ["south","east","west","north"], minPotDepth: 15, suitablePot: "2加仑花盆（建议单独种）", minTemp: -5,
  },
  {
    id: "stevia", name: "甜叶菊", scientificName: "Stevia rebaudiana", category: "herb", difficulty: "medium",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 50,
    description: "<p>甜叶菊的叶片比蔗糖甜200-300倍，是天然零卡路里甜味剂。阳台种一盆，泡茶摘一片就够甜。</p>",
    tips: "<p>1. 扦插繁殖为主<br>2. 喜温暖，不耐寒<br>3. 充足光照提升甜度<br>4. 冬季需移入室内</p>",
    balconyFit: "<p>喜光照和温暖，南向阳台最适宜。冬季温度低于10℃需移入室内。</p>",
    suitableOrientations: ["south"], minPotDepth: 20, suitablePot: "2加仑以上花盆", minTemp: 10,
  },
  {
    id: "shiso", name: "紫苏（青苏）", scientificName: "Perilla frutescens var. crispa", category: "herb", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "medium", harvestDays: 30,
    description: "<p>青紫苏是日料必备香草，搭配生鱼片和天妇罗风味绝佳。叶片清香，生长旺盛。</p>",
    tips: "<p>1. 播种繁殖，出苗率高<br>2. 摘嫩叶食用<br>3. 花后结籽可留种<br>4. 自播能力强</p>",
    balconyFit: "<p>适应性强，各种朝向均可。南向阳台生长最快。</p>",
    suitableOrientations: ["south","east","west","north"], minPotDepth: 15, suitablePot: "2加仑以上花盆", minTemp: 5,
  },

  // ==================== 花卉 (flower) ====================
  {
    id: "petunia", name: "矮牵牛", scientificName: "Petunia × atkinsiana", category: "flower", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>矮牵牛是阳台花卉的'开花机器'，从春到秋持续不断开花。花色丰富，花量大，垂吊品种尤其适合阳台栏杆。</p>",
    tips: "<p>1. 喜光，光照越足开花越多<br>2. 每周施一次开花肥<br>3. 及时摘除残花促新花<br>4. 垂吊品种适合挂盆种植</p>",
    balconyFit: "<p>南向阳台最佳，光照充足时花开不断。垂吊品种适合栏杆装饰。</p>",
    suitableOrientations: ["south","east","west"], minPotDepth: 15, suitablePot: "挂盆或2加仑花盆", minTemp: 5,
  },
  {
    id: "geranium", name: "天竺葵", scientificName: "Pelargonium × hortorum", category: "flower", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>天竺葵是欧洲阳台的标配花卉，花球饱满色彩艳丽。耐旱好养，还有驱蚊效果。</p>",
    tips: "<p>1. 宁干勿湿，怕水涝<br>2. 充足光照促花<br>3. 花后修剪残花<br>4. 扦插极易成活</p>",
    balconyFit: "<p>南向或西向阳台最佳。耐旱怕涝，是阳台'懒人花'。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 15, suitablePot: "透气陶盆", minTemp: 5,
  },
  {
    id: "kalanchoe", name: "长寿花", scientificName: "Kalanchoe blossfeldiana", category: "flower", difficulty: "easy",
    season: ["冬","春"], sunlight: "partial", water: "low", harvestDays: 0,
    description: "<p>长寿花花期超长，从冬季开到春季，一开就是三四个月。色彩丰富，是冬日阳台的一抹亮色。</p>",
    tips: "<p>1. 短日照植物，每天光照8-9小时最佳<br>2. 控水，干透浇透<br>3. 花后修剪促分枝<br>4. 叶插极易成活</p>",
    balconyFit: "<p>东向阳台最适合。冬日阳台的主角花卉。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 12, suitablePot: "1加仑小盆", minTemp: 8,
  },
  {
    id: "jasmine", name: "茉莉花", scientificName: "Jasminum sambac", category: "flower", difficulty: "medium",
    season: ["春","夏","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>'好一朵美丽的茉莉花'——茉莉花洁白芬芳，一朵花开满屋香。可用来窨制花茶，是夏天的味道。</p>",
    tips: "<p>1. 喜强光，越晒越开花<br>2. 花后及时修剪枝条<br>3. 生长期薄肥勤施<br>4. 冬季入室防寒</p>",
    balconyFit: "<p>南向阳台全日照最佳。夏季盛花期需要充足肥水。</p>",
    suitableOrientations: ["south"], minPotDepth: 20, suitablePot: "3加仑以上花盆", minTemp: 5,
  },
  {
    id: "gardenia", name: "栀子花", scientificName: "Gardenia jasminoides", category: "flower", difficulty: "medium",
    season: ["春","夏"], sunlight: "partial", water: "high", harvestDays: 0,
    description: "<p>栀子花开，满室芬芳。洁白的花瓣层层叠叠，香气浓郁持久。南方阳台种植经典花卉。</p>",
    tips: "<p>1. 喜酸性土壤，可用硫酸亚铁调酸<br>2. 保持土壤湿润不积水<br>3. 喜半阴，避免夏季烈日暴晒<br>4. 花期前后追施磷钾肥</p>",
    balconyFit: "<p>东向阳台最适合，晨光充足又避开午后烈日。需要保持较高空气湿度。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 25, suitablePot: "3加仑以上花盆", minTemp: 5,
  },
  {
    id: "plumbago", name: "蓝雪花", scientificName: "Plumbago auriculata", category: "flower", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>蓝雪花是阳台花卉的'蓝色精灵'，淡蓝色花球从春开到秋。耐热耐晒，夏季阳台的主力花卉。</p>",
    tips: "<p>1. 喜光耐热，越晒越开花<br>2. 花后轻剪促复花<br>3. 生长期保持水肥充足<br>4. 可做垂吊或爬藤造型</p>",
    balconyFit: "<p>南向阳台最佳，夏季高温也能持续开花。耐热性极强。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 20, suitablePot: "3加仑花盆或挂盆", minTemp: 5,
  },
  {
    id: "portulaca", name: "太阳花", scientificName: "Portulaca grandiflora", category: "flower", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>太阳花（死不了）是最好养的花卉，给点阳光就灿烂。耐旱耐晒，越晒越开花，花色艳丽多彩。</p>",
    tips: "<p>1. 扦插即活，随便插土里就长<br>2. 控水，太湿反而长不好<br>3. 花后无需特殊管理<br>4. 冬季地上部分枯死，来年自播</p>",
    balconyFit: "<p>南向阳台全日照最佳。极耐旱，出差一周不浇水也没事。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 12, suitablePot: "浅盆或挂盆", minTemp: 8,
  },
  {
    id: "marguerite", name: "玛格丽特", scientificName: "Argyranthemum frutescens", category: "flower", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>玛格丽特（木春菊）花量大得惊人，一盆能开出几十朵小菊花，清新可爱。春秋两季是盛花期。</p>",
    tips: "<p>1. 喜凉爽，夏季高温需遮阴<br>2. 花后修剪促分枝<br>3. 每周施一次薄肥<br>4. 扦插容易成活</p>",
    balconyFit: "<p>春秋季南向阳台表现最佳。夏季需遮阴降温。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "3加仑花盆", minTemp: 5,
  },
  {
    id: "bougainvillea", name: "三角梅", scientificName: "Bougainvillea spectabilis", category: "flower", difficulty: "medium",
    season: ["春","夏","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>三角梅（簕杜鹃）是南方阳台的标志性花卉，花开时姹紫嫣红，几乎看不到叶子。花期极长，一开就是大半年。</p>",
    tips: "<p>1. 需要强光，光照不足不开花<br>2. 控水促花：叶子微蔫再浇水<br>3. 花后重剪塑形<br>4. 生长期施磷钾肥促花</p>",
    balconyFit: "<p>南向阳台全日照最佳。控水是开花关键——水多只长叶不开花。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "5加仑以上大盆", minTemp: 5,
  },
  {
    id: "hydrangea", name: "绣球花", scientificName: "Hydrangea macrophylla", category: "flower", difficulty: "medium",
    season: ["春","夏"], sunlight: "partial", water: "high", harvestDays: 0,
    description: "<p>绣球花团锦簇，一个大花球由无数小花组成，梦幻又浪漫。花色会随土壤酸碱度变化，非常神奇。</p>",
    tips: "<p>1. 喜半阴，怕暴晒<br>2. 需水量大，夏季每天浇水<br>3. 调酸变蓝，调碱变粉<br>4. 花后及时修剪</p>",
    balconyFit: "<p>东向阳台最适合，上午光照下午遮阴。需水量大，夏季不能断水。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 30, suitablePot: "5加仑以上大盆", minTemp: -5,
  },

  // ==================== 水果 (fruit) ====================
  {
    id: "blueberry", name: "蓝莓", scientificName: "Vaccinium corymbosum", category: "fruit", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>蓝莓是阳台果树的新宠，春天赏花、夏天吃果、秋天看红叶，一株多用。选择矮丛品种最适合盆栽。</p>",
    tips: "<p>1. 必须用酸性土（pH 4.5-5.5）<br>2. 至少种两棵不同品种互相授粉<br>3. 用雨水或放置过的自来水浇<br>4. 果期罩网防鸟</p>",
    balconyFit: "<p>南向或东向阳台最佳。最关键的是用酸性泥炭土种植。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 30, suitablePot: "5加仑以上花盆，酸性泥炭土", minTemp: -15,
  },
  {
    id: "lemon-tree", name: "柠檬", scientificName: "Citrus × limon", category: "fruit", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>阳台盆栽柠檬树，四季常青，花香果美。一棵树上有花有果，视觉和味觉的双重享受。</p>",
    tips: "<p>1. 选嫁接苗，结果更快<br>2. 喜光，全日照最好<br>3. 花期人工授粉提高坐果率<br>4. 冬季入室防寒</p>",
    balconyFit: "<p>南向阳台全日照最佳。选择矮化品种（如'香水柠檬'）更适合盆栽。</p>",
    suitableOrientations: ["south"], minPotDepth: 35, suitablePot: "7加仑以上大盆", minTemp: 5,
  },
  {
    id: "kumquat", name: "金桔", scientificName: "Citrus japonica", category: "fruit", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>金桔是盆栽果树的首选，挂果期超长，金黄色的果实挂满枝头非常喜庆。连皮一起吃，甜中带酸。</p>",
    tips: "<p>1. 选嫁接苗来年就能结果<br>2. 喜光，越晒果子越甜<br>3. 花后疏果保证品质<br>4. 冬季适当控水</p>",
    balconyFit: "<p>南向阳台全日照最适宜。比柠檬更耐寒，养护相对简单。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "5加仑以上花盆", minTemp: 0,
  },
  {
    id: "fig", name: "无花果", scientificName: "Ficus carica", category: "fruit", difficulty: "easy",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>无花果是阳台果树中的'高产王'，当年种当年结果。果实软糯甜蜜，有着独特的蜜糖风味。</p>",
    tips: "<p>1. 选择矮化品种（如'紫色波尔多'）<br>2. 需要大盆和充足基肥<br>3. 冬季落叶休眠是正常现象<br>4. 春果和秋果一年两季</p>",
    balconyFit: "<p>南向阳台全日照最佳。生长迅速，需大盆和充足空间。</p>",
    suitableOrientations: ["south"], minPotDepth: 40, suitablePot: "10加仑以上大盆", minTemp: -10,
  },
  {
    id: "passion-fruit", name: "百香果", scientificName: "Passiflora edulis", category: "fruit", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>百香果是热带水果，藤蔓攀爬能力强，花像艺术品一样奇特美丽。果实香气浓郁，泡水做饮料一绝。</p>",
    tips: "<p>1. 需要搭架供藤蔓攀爬<br>2. 需人工授粉提高坐果率<br>3. 果实变紫落地时采收<br>4. 冬季注意防寒</p>",
    balconyFit: "<p>南向阳台全日照，需要搭爬架。开花需要人工授粉。</p>",
    suitableOrientations: ["south"], minPotDepth: 35, suitablePot: "7加仑以上大盆+爬架", minTemp: 10,
  },
  {
    id: "raspberry", name: "树莓", scientificName: "Rubus idaeus", category: "fruit", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>树莓（覆盆子）红艳艳的果实像小宝石一样挂在枝头，酸酸甜甜。阳台种一盆，夏天随手摘一把吃。</p>",
    tips: "<p>1. 选秋季结果品种（秋果型）<br>2. 需要支撑或小架子<br>3. 果期保持浇水均匀<br>4. 冬季修剪老枝</p>",
    balconyFit: "<p>南向或东向阳台适合。选择无刺品种更方便管理。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 25, suitablePot: "5加仑花盆+支架", minTemp: -15,
  },
  {
    id: "goji-berry", name: "枸杞", scientificName: "Lycium barbarum", category: "fruit", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>枸杞全身是宝——春天摘嫩叶做菜（枸杞叶），夏秋采红果泡茶。耐旱耐寒，几乎不用管。</p>",
    tips: "<p>1. 扦插极易成活<br>2. 耐旱，控水养根<br>3. 春采叶，秋采果<br>4. 冬季落叶，来年春季萌发</p>",
    balconyFit: "<p>适应性极强，南向阳台最佳。耐旱耐寒耐贫瘠。</p>",
    suitableOrientations: ["south","east","west"], minPotDepth: 25, suitablePot: "3加仑以上花盆", minTemp: -20,
  },
  {
    id: "blackberry", name: "黑莓", scientificName: "Rubus fruticosus", category: "fruit", difficulty: "easy",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>黑莓果实乌黑发亮，富含花青素。藤蔓型生长，搭个架子就能收获一夏天的甜蜜果实。</p>",
    tips: "<p>1. 选无刺品种方便采摘<br>2. 需要架子支撑藤蔓<br>3. 果实变黑变软时采收<br>4. 冬季修剪老枝留新枝</p>",
    balconyFit: "<p>南向阳台全日照，需要搭架。选择直立型品种可节省空间。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "5加仑以上花盆+支架", minTemp: -15,
  },

  // ==================== 多肉 (succulent) ====================
  {
    id: "haworthia", name: "玉露", scientificName: "Haworthia cooperi", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "partial", water: "low", harvestDays: 0,
    description: "<p>玉露叶片晶莹剔透，像一颗颗绿色的水晶。是十二卷属多肉的代表，小巧精致不占地方。</p>",
    tips: "<p>1. 喜散射光，怕强光直射<br>2. 干透浇透，冬天几乎断水<br>3. 闷养可让叶片更透亮<br>4. 用颗粒土种植防烂根</p>",
    balconyFit: "<p>东向或北向阳台散射光最佳。夏天一定遮阴。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 8, suitablePot: "浅盆小盆，颗粒土", minTemp: 5,
  },
  {
    id: "bear-paw", name: "熊童子", scientificName: "Cotyledon tomentosa", category: "succulent", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>熊童子的叶片像小熊的爪子，毛茸茸的超级可爱。叶尖在光照充足时会变红，像涂了指甲油。</p>",
    tips: "<p>1. 喜光，光照足叶尖变红<br>2. 控水，叶子发软再浇<br>3. 夏季休眠少浇水<br>4. 不要摸叶片，会留指纹</p>",
    balconyFit: "<p>南向阳台春秋季最佳。夏季需适当遮阴通风。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 10, suitablePot: "小陶盆，颗粒土", minTemp: 5,
  },
];

const delay = (ms) => new Promise(r => setTimeout(r, ms));

console.log(`🚀 开始批量导入 ${plants.length} 种植物到 CMS...`);
console.log(`   API: ${CMS_API}`);
console.log(`   间隔: 2.5 秒/条 (约 ${Math.ceil(plants.length * 2.5 / 60)} 分钟完成)\n`);

let success = 0;
let failed = 0;
const failedList = [];

for (let i = 0; i < plants.length; i++) {
  const plant = plants[i];
  const progress = `[${i + 1}/${plants.length}]`;

  try {
    const resp = await fetch(`${CMS_API}/plants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cms-Password": PASSWORD,
      },
      body: JSON.stringify({ ...plant, status: "published" }),
    });

    const data = await resp.json();

    if (resp.ok && data.code === 0) {
      console.log(`${progress} ✅ ${plant.name} (${plant.id})`);
      success++;
    } else {
      console.log(`${progress} ❌ ${plant.name}: ${data.message || resp.statusText}`);
      failed++;
      failedList.push(plant.name);
    }
  } catch (err) {
    console.log(`${progress} ❌ ${plant.name}: ${err.message}`);
    failed++;
    failedList.push(plant.name);
  }

  // 间隔 2.5 秒（最后一条不需要等待）
  if (i < plants.length - 1) {
    await delay(2500);
  }
}

console.log(`\n🎉 导入完成！`);
console.log(`   ✅ 成功: ${success}`);
console.log(`   ❌ 失败: ${failed}`);
if (failedList.length > 0) {
  console.log(`   失败列表: ${failedList.join(", ")}`);
}
