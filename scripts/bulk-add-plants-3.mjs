/**
 * 第三波批量添加植物到 CMS — 补充蔬菜/花卉/观叶/多肉/水果/球根/水生/菌菇
 * 用法: CMS_ADMIN_PASSWORD=xxx node scripts/bulk-add-plants-3.mjs
 */

const CMS_API = process.env.CMS_API || "https://yangtaixiaoyuanding-d7b1c10c2d50.service.tcloudbase.com/api/cms";
const PASSWORD = process.env.CMS_ADMIN_PASSWORD;

if (!PASSWORD) {
  console.error("❌ 请设置 CMS_ADMIN_PASSWORD 环境变量");
  process.exit(1);
}

const plants = [
  // ==================== 蔬菜 (vegetable) ====================
  {
    id: "bok-choy", name: "小白菜", scientificName: "Brassica rapa subsp. chinensis", category: "vegetable", difficulty: "easy",
    season: ["春","秋"], sunlight: "partial", water: "medium", harvestDays: 30,
    description: "<p>小白菜（上海青）是中国人餐桌上的当家绿叶菜，生长快、管理简单，一年可以种好几茬。阳台种上一盆，随吃随摘。</p>",
    tips: "<p>1. 撒播或条播均可，出苗后间苗至株距5-8cm<br>2. 保持土壤湿润，快速生长口感才嫩<br>3. 20-30天可采收小苗，40天长成大棵<br>4. 分批播种，实现持续供应</p>",
    balconyFit: "<p>春秋两季东向或南向阳台表现最佳。夏季需遮阴防抽薹。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 15, suitablePot: "长条盆或2加仑盆", minTemp: 3,
  },
  {
    id: "potato", name: "土豆", scientificName: "Solanum tuberosum", category: "vegetable", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 80,
    description: "<p>阳台种土豆比你想象的简单！用深盆或种植袋，收获时像挖宝藏一样翻出一个个土豆，乐趣无穷。</p>",
    tips: "<p>1. 用发芽的土豆切块（每块带1-2个芽眼）<br>2. 种在深25cm以上的容器中<br>3. 苗高15cm时培土覆盖茎基部<br>4. 茎叶变黄枯死后收获</p>",
    balconyFit: "<p>南向阳台最佳，需要充足光照。用深种植袋或桶栽，一桶能收1-2斤。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "5加仑以上深桶或种植袋", minTemp: 5,
  },
  {
    id: "carrot", name: "胡萝卜", scientificName: "Daucus carota subsp. sativus", category: "vegetable", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 70,
    description: "<p>自己种的胡萝卜比超市的甜十倍！选择短根品种（如手指胡萝卜），在深盆里也能种出漂亮的橙色萝卜。</p>",
    tips: "<p>1. 必须用疏松沙质土，板结土长不出直根<br>2. 直播不移植，根系怕打扰<br>3. 间苗距5-8cm，太密长不大<br>4. 施肥少氮多钾，否则只长叶子不长根</p>",
    balconyFit: "<p>南向阳台，需要深25cm以上的容器。土壤疏松是成功关键。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 25, suitablePot: "深桶盆或加高种植箱", minTemp: 3,
  },
  {
    id: "garlic", name: "大蒜", scientificName: "Allium sativum", category: "vegetable", difficulty: "easy",
    season: ["秋","冬"], sunlight: "full", water: "medium", harvestDays: 180,
    description: "<p>大蒜是最省心的阳台蔬菜之一。蒜头种下去，先吃蒜苗，再收蒜薹，最后挖蒜头，一种三吃，性价比超高。</p>",
    tips: "<p>1. 选饱满蒜瓣，尖头朝上埋入土中3-4cm<br>2. 株距10cm，不要太密<br>3. 苗期可剪蒜苗吃，保留2-3cm茎基继续长<br>4. 叶子枯黄一半时挖蒜头</p>",
    balconyFit: "<p>南向或西向阳台。秋季种植，越冬后春夏收获。几乎不生虫。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 20, suitablePot: "长条盆或3加仑盆", minTemp: -10,
  },
  {
    id: "sweet-potato", name: "红薯叶", scientificName: "Ipomoea batatas", category: "vegetable", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 40,
    description: "<p>红薯叶被誉为「蔬菜皇后」，营养丰富口感嫩滑。阳台种一盆，整个夏天都有吃不完的嫩叶，越摘越长。</p>",
    tips: "<p>1. 用红薯块茎水培出苗后移栽<br>2. 或者直接买红薯苗扦插，极易成活<br>3. 摘嫩梢和叶片吃，促进分枝<br>4. 充足水肥才能叶片肥嫩</p>",
    balconyFit: "<p>南向阳台最佳，越晒越旺。也可以垂吊种植，藤蔓自然下垂。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 20, suitablePot: "3加仑以上深盆", minTemp: 10,
  },
  {
    id: "bell-pepper", name: "甜椒", scientificName: "Capsicum annuum var. grossum", category: "vegetable", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 75,
    description: "<p>甜椒比辣椒更温和甜美，红黄绿各色搭配，既是蔬菜又是盆栽观赏。矮生品种最适合阳台盆栽。</p>",
    tips: "<p>1. 春季室内育苗，温度20℃以上<br>2. 苗高15cm时掐顶促分枝<br>3. 结果期需要支撑防倒伏<br>4. 果实变色后再摘更甜</p>",
    balconyFit: "<p>南向或西向阳台，全天日照最佳。一盆能结10-15个果实。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 25, suitablePot: "3加仑以上花盆+支架", minTemp: 12,
  },

  // ==================== 香草 (herb) ====================
  {
    id: "fennel", name: "茴香", scientificName: "Foeniculum vulgare", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 50,
    description: "<p>茴香的羽状复叶轻柔飘逸，带有独特的甘草香气。嫩叶做馅、炒蛋都是一绝，种子还可以泡茶助消化。</p>",
    tips: "<p>1. 直播或育苗移栽均可<br>2. 喜光，光照充足香气更浓<br>3. 怕涝，土壤透气排水要好<br>4. 花后收种子，香气最浓时采摘</p>",
    balconyFit: "<p>南向阳台，全天日照。株形较高，需要深盆支撑。</p>",
    suitableOrientations: ["south"], minPotDepth: 20, suitablePot: "3加仑以上深盆", minTemp: -5,
  },
  {
    id: "houttuynia", name: "鱼腥草", scientificName: "Houttuynia cordata", category: "herb", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "high", harvestDays: 30,
    description: "<p>鱼腥草（折耳根）是西南人民的心头好，凉拌折耳根是餐桌上的灵魂小菜。地下白嫩的根茎和嫩叶均可食用。</p>",
    tips: "<p>1. 用带节的根茎埋土繁殖，非常容易活<br>2. 喜湿润，土壤保持潮湿但不能积水<br>3. 采根茎时留一部分继续长<br>4. 夏季开白色小花，也有观赏价值</p>",
    balconyFit: "<p>半阴环境即可，东向阳台最合适。生长旺盛需控制范围。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 18, suitablePot: "2加仑以上宽口盆", minTemp: -5,
  },

  // ==================== 花卉 (flower) ====================
  {
    id: "sunflower", name: "向日葵（矮生）", scientificName: "Helianthus annuus (dwarf)", category: "flower", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 55,
    description: "<p>矮生向日葵专为盆栽培育，株高仅30-50cm，大朵金黄色花朵追着太阳转，是阳台上最灿烂的风景。</p>",
    tips: "<p>1. 直播不移植，每盆1-2粒种子<br>2. 必须全日照，光不足花小<br>3. 土壤肥沃花朵更大<br>4. 花谢后可收葵花籽</p>",
    balconyFit: "<p>南向阳台专属，光照越充足花开越灿烂。矮生品种不需要支架。</p>",
    suitableOrientations: ["south"], minPotDepth: 20, suitablePot: "3加仑花盆，每盆1棵", minTemp: 8,
  },
  {
    id: "chrysanthemum", name: "菊花", scientificName: "Chrysanthemum morifolium", category: "flower", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 90,
    description: "<p>菊花是中国的传统名花，秋日阳台上盛开的菊花千姿百态。选择小菊品种盆栽，秋天花开满盆，赏花还能泡菊花茶。</p>",
    tips: "<p>1. 春季扦插繁殖，成活率极高<br>2. 生长期多次打顶促分枝<br>3. 短日照植物，秋天自然开花<br>4. 花后剪去老枝，保留基部新芽越冬</p>",
    balconyFit: "<p>南向或东向阳台。秋季为主要观赏期。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "3加仑花盆", minTemp: -10,
  },
  {
    id: "periwinkle", name: "长春花", scientificName: "Catharanthus roseus", category: "flower", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>长春花又名日日春，名副其实地全年开花不断。五瓣小花密集绽放，粉色、白色、红色丰富多彩，是阳台上的开花机器。</p>",
    tips: "<p>1. 喜光，光照越足开花越多<br>2. 耐旱，土干了再浇<br>3. 花后轻度修剪促新一轮开花<br>4. 自播能力强，种子落在土里自己发芽</p>",
    balconyFit: "<p>南向或西向阳台。越晒越开花，夏天不惧酷热。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 15, suitablePot: "2加仑花盆或挂盆", minTemp: 10,
  },
  {
    id: "pansy", name: "三色堇", scientificName: "Viola × wittrockiana", category: "flower", difficulty: "easy",
    season: ["秋","冬","春"], sunlight: "full", water: "medium", harvestDays: 60,
    description: "<p>三色堇像一只只彩色蝴蝶停在绿叶间，花瓣上独特的「猫脸」花纹可爱至极。耐寒性强，是秋冬阳台的颜值担当。</p>",
    tips: "<p>1. 秋季播种或直接购苗种植<br>2. 耐寒，零下也能存活<br>3. 及时摘除残花延长花期<br>4. 花后可食用，做沙拉装饰</p>",
    balconyFit: "<p>秋冬春三季南向阳台开花不断。夏季怕热，可做一年生种植。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 12, suitablePot: "长条盆或浅盆密植", minTemp: -5,
  },
  {
    id: "impatiens", name: "凤仙花", scientificName: "Impatiens walleriana", category: "flower", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>凤仙花（指甲花）是童年的回忆，花瓣可以染指甲。花期极长，从春开到秋，半阴环境下也能花开满盆。</p>",
    tips: "<p>1. 种子直播或扦插繁殖<br>2. 半阴处开花最好，强光易萎蔫<br>3. 保持土壤湿润但不能积水<br>4. 果实成熟后会自己弹射种子</p>",
    balconyFit: "<p>东向阳台最佳，晨光柔和。也可北向阳台种植。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 15, suitablePot: "2加仑花盆或挂盆", minTemp: 8,
  },
  {
    id: "marigold", name: "万寿菊", scientificName: "Tagetes erecta", category: "flower", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>万寿菊金黄色的花球热情奔放，花期超长且几乎不生虫。它还是天然的「驱虫植物」，种在菜旁边能减少害虫。</p>",
    tips: "<p>1. 种子播种出苗快，一周发芽<br>2. 喜光不怕晒，越晒越壮<br>3. 花后摘除残花持续开花<br>4. 与蔬菜间种防虫效果好</p>",
    balconyFit: "<p>南向阳台，与蔬菜混种效果最佳。全日照环境下花量最大。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 18, suitablePot: "2加仑以上花盆", minTemp: 5,
  },
  {
    id: "violet", name: "紫罗兰", scientificName: "Matthiola incana", category: "flower", difficulty: "medium",
    season: ["秋","春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>紫罗兰是经典的芳香花卉，花穗挺拔，香气浓郁迷人。阳台种一盆，整个角落都弥漫着甜美的花香。</p>",
    tips: "<p>1. 喜凉爽，怕高温，秋播春开花<br>2. 需要充足光照<br>3. 花序从下往上开，花期持续一个月<br>4. 花后收集种子明年再种</p>",
    balconyFit: "<p>南向或东向阳台，秋冬春季观赏。夏季需遮阴度夏。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "3加仑花盆", minTemp: -3,
  },
  {
    id: "carnation", name: "康乃馨", scientificName: "Dianthus caryophyllus", category: "flower", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>康乃馨是母爱的象征，盆栽品种株型紧凑，花色从粉红到深红，花瓣边缘有精致的锯齿，花期持久。</p>",
    tips: "<p>1. 选择盆栽品种，植株矮壮<br>2. 喜光，光照充足花色艳丽<br>3. 土壤偏碱性更好，可加少量石灰<br>4. 花后剪掉花梗促进再开花</p>",
    balconyFit: "<p>南向或西向阳台，干燥通风环境最佳。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 18, suitablePot: "2加仑花盆", minTemp: 3,
  },

  // ==================== 观叶 (foliage) ====================
  {
    id: "asparagus-fern", name: "文竹", scientificName: "Asparagus setaceus", category: "foliage", difficulty: "medium",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>文竹体态轻盈如云似雾，细碎的叶片像微型竹叶，摆在书房案头自带文雅气质。其实它不是竹子而是天门冬科的植物。</p>",
    tips: "<p>1. 喜半阴散射光，直射光会黄叶<br>2. 保持空气湿度，经常喷雾<br>3. 修剪黄叶和过密枝条<br>4. 怕烟尘，远离厨房油烟</p>",
    balconyFit: "<p>东向或北向阳台，明亮散射光处。需要一定空气湿度。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 15, suitablePot: "透气陶盆", minTemp: 5,
  },
  {
    id: "rubber-plant", name: "橡皮树", scientificName: "Ficus elastica", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "low", harvestDays: 0,
    description: "<p>橡皮树宽大油亮的叶片充满热带风情，黑金刚品种的叶片近乎黑色，极富现代感。极度耐阴耐旱，懒人绿植首选。</p>",
    tips: "<p>1. 宁干勿湿，冬季可一个月浇一次<br>2. 叶片定期用湿布擦拭保持光泽<br>3. 太高了可以打顶控制高度<br>4. 汁液白色有微毒，避免接触</p>",
    balconyFit: "<p>东向或明亮北向阳台。大型品种空间要够。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 25, suitablePot: "5加仑以上大盆", minTemp: 8,
  },
  {
    id: "fiddle-leaf-fig", name: "琴叶榕", scientificName: "Ficus lyrata", category: "foliage", difficulty: "medium",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>琴叶榕是ins上最火的网红绿植，巨大的提琴形叶片线条优美，一棵就能撑起整个空间的颜值。但出了名的难伺候。</p>",
    tips: "<p>1. 固定位置不要频繁移动<br>2. 喜明亮散射光，冬季可适当直射<br>3. 土壤干了再浇透，怕涝<br>4. 定期转动花盆防偏冠</p>",
    balconyFit: "<p>东向或明亮南向阳台（避免夏日正午直射）。空间要足够大。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 30, suitablePot: "7加仑以上大盆", minTemp: 12,
  },
  {
    id: "coleus", name: "彩叶草", scientificName: "Coleus scutellarioides", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>彩叶草的叶片色彩斑斓胜过花朵，红、黄、紫、绿交织成绚丽的图案。品种繁多，几盆不同颜色放在一起就是一道彩虹。</p>",
    tips: "<p>1. 扦插极易成活，一盆变十盆<br>2. 光线影响叶色，明亮光下颜色更艳<br>3. 掐顶促分枝，株形更丰满<br>4. 开花后植株老化，及时修剪花穗</p>",
    balconyFit: "<p>东向或南向阳台。不同品种混搭观赏效果极佳。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 15, suitablePot: "2加仑花盆，多种几色", minTemp: 10,
  },

  // ==================== 球根花卉 (bulb) ====================
  {
    id: "crocus", name: "番红花", scientificName: "Crocus sativus", category: "bulb", difficulty: "easy",
    season: ["秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>番红花是春天的信使，在冬末春初最早破土开花。小巧的杯状花朵有紫、白、黄等色。部分品种的花蕊就是珍贵的藏红花。</p>",
    tips: "<p>1. 秋季种球根，覆土5cm深<br>2. 需要冬季低温才能开花<br>3. 群植效果最佳，密植更壮观<br>4. 花后保留叶片养球</p>",
    balconyFit: "<p>南向或东向阳台。适合浅盆栽种密植。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 12, suitablePot: "宽口浅盆密植", minTemp: -15,
  },
  {
    id: "calla-lily", name: "马蹄莲", scientificName: "Zantedeschia aethiopica", category: "bulb", difficulty: "medium",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>马蹄莲花朵优雅似马蹄，纯白色苞片中央伸出黄色肉穗，高雅圣洁。彩色马蹄莲还有粉、黄、紫等多种颜色。</p>",
    tips: "<p>1. 喜水，生长季保持土壤湿润<br>2. 春末夏初开花，花后减少浇水<br>3. 冬季休眠，保留球根干燥存储<br>4. 有毒，避免宠物和小孩误食</p>",
    balconyFit: "<p>南向或东向阳台。需保持盆土湿润但不能积水。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "3加仑花盆", minTemp: 5,
  },

  // ==================== 多肉 (succulent) ====================
  {
    id: "graptopetalum", name: "白牡丹", scientificName: "Graptopetalum paraguayense", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>白牡丹是多肉中的「普货之王」，价格便宜但颜值不低。叶片排列如白色牡丹花，出了状态叶尖泛粉，温润如玉。</p>",
    tips: "<p>1. 叶插成活率极高，一片叶子就是一棵<br>2. 多晒太阳，少浇水<br>3. 夏季适当遮阴防暴晒<br>4. 配土颗粒比例50%以上</p>",
    balconyFit: "<p>南向阳台全日照最佳，控水后状态更美。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 8, suitablePot: "多肉专用小盆", minTemp: 3,
  },
  {
    id: "black-aeonium", name: "黑法师", scientificName: "Aeonium arboreum 'Zwartkop'", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>黑法师是多肉中的暗黑系代表，深紫近乎黑色的莲座状叶片神秘而高贵。株形像一棵迷你树，是多肉老桩的经典品种。</p>",
    tips: "<p>1. 夏季休眠，严格控水<br>2. 秋冬春季生长，叶片颜色最深<br>3. 光照不足叶片会变绿<br>4. 砍头繁殖，一枝变多枝</p>",
    balconyFit: "<p>南向阳台全日照，出状态后黑色更深邃。</p>",
    suitableOrientations: ["south"], minPotDepth: 12, suitablePot: "透气陶盆或紫砂盆", minTemp: 5,
  },
  {
    id: "chihuahua-echeveria", name: "吉娃娃", scientificName: "Echeveria chihuahuaensis", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>吉娃娃是多肉中的「小公主」，紧凑的莲座形配上鲜红的叶尖，像涂了口红一样精致可爱。株形小巧不占地方。</p>",
    tips: "<p>1. 多晒太阳叶尖才红<br>2. 严格控水，半个月浇一次<br>3. 夏季遮阴通风<br>4. 叶片上白粉不要用手摸</p>",
    balconyFit: "<p>南向窗台或阳台，控水+暴晒出最佳状态。</p>",
    suitableOrientations: ["south"], minPotDepth: 8, suitablePot: "多肉专用小盆", minTemp: 3,
  },
  {
    id: "echeveria-elegans", name: "蓝石莲", scientificName: "Echeveria elegans", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>蓝石莲（皮氏石莲）披着一层梦幻的蓝白色粉末，叶片边缘微微透明，像冰晶凝结而成。是多肉拼盘中的颜值担当。</p>",
    tips: "<p>1. 喜强光，缺光会摊大饼<br>2. 干透浇透，夏季控水<br>3. 叶片白粉是保护层，不要擦掉<br>4. 叶插或分株繁殖</p>",
    balconyFit: "<p>南向阳台，阳光越多粉越厚越蓝。</p>",
    suitableOrientations: ["south"], minPotDepth: 8, suitablePot: "多肉拼盘或单盆", minTemp: 3,
  },

  // ==================== 水果 (fruit) ====================
  {
    id: "pomegranate", name: "石榴（矮化）", scientificName: "Punica granatum (dwarf)", category: "fruit", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 365,
    description: "<p>矮化石榴专为盆栽培育，株高仅50-80cm就能开花结果。春夏之交满树火红花朵，秋天挂满红灯笼般的小石榴，观花观果两相宜。</p>",
    tips: "<p>1. 需要充足光照才能开花结果<br>2. 春季修剪促发新枝<br>3. 花期适当控水提高坐果率<br>4. 冬季落叶休眠，减少浇水</p>",
    balconyFit: "<p>南向阳台，全日照。矮化品种不需太大空间。</p>",
    suitableOrientations: ["south"], minPotDepth: 25, suitablePot: "5加仑以上花盆", minTemp: -10,
  },
  {
    id: "dragon-fruit", name: "火龙果", scientificName: "Hylocereus undatus", category: "fruit", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "low", harvestDays: 365,
    description: "<p>火龙果是仙人掌科的果树，超级耐旱好养。用种子种一盆火龙果小苗，毛茸茸的像微型仙人掌森林，可爱到爆。盆栽也能开花结果。</p>",
    tips: "<p>1. 从火龙果中取种子洗净播种<br>2. 小苗期观赏毛茸茸的丛生状态<br>3. 长大后需要支架攀爬<br>4. 耐旱怕涝，仙人掌一样养</p>",
    balconyFit: "<p>南向阳台。从小苗到结果需要2-3年，前期当多肉观赏。</p>",
    suitableOrientations: ["south"], minPotDepth: 25, suitablePot: "5加仑以上大盆+攀爬架", minTemp: 8,
  },

  // ==================== 水生植物 (aquatic) ====================
  {
    id: "water-hyacinth", name: "水葫芦", scientificName: "Eichhornia crassipes", category: "aquatic", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>水葫芦（凤眼莲）叶片膨大成气囊漂浮水面，开出美丽的淡紫色花朵，花瓣上有凤眼般的图案。一盆清水就能养，繁殖迅速。</p>",
    tips: "<p>1. 放在水缸或大碗中加水即可<br>2. 喜全日照，越晒越旺<br>3. 繁殖太快需要定期分株<br>4. 冬季低于5℃需移入室内</p>",
    balconyFit: "<p>南向阳台，水缸或大容器养殖。注意控制数量，不要随意放生。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 15, suitablePot: "水缸或宽口水盆", minTemp: 5,
  },

  // ==================== 食用菌 (mushroom) ====================
  {
    id: "enoki", name: "金针菇", scientificName: "Flammulina velutipes", category: "mushroom", difficulty: "medium",
    season: ["秋","冬"], sunlight: "shade", water: "high", harvestDays: 14,
    description: "<p>在家种金针菇是一种神奇的体验！买个菌包放在暗处，每天喷水，两周就能收获一茬白嫩嫩的金针菇，火锅必备。</p>",
    tips: "<p>1. 购买成品菌包，新手零失败<br>2. 放在阴暗处（纸箱或柜子里）<br>3. 每天喷水2-3次保持湿润<br>4. 长到10-15cm时采收，可收2-3茬</p>",
    balconyFit: "<p>北向阳台或室内阴暗处。菌包种植最简单。</p>",
    suitableOrientations: ["north"], minPotDepth: 0, suitablePot: "直接使用菌包，无需花盆", minTemp: 5,
  },
];

async function main() {
  console.log(`📦 准备导入 ${plants.length} 种植物到 CMS...\n`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < plants.length; i++) {
    const plant = plants[i];
    try {
      const res = await fetch(`${CMS_API}/plants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Cms-Password": PASSWORD,
          "Authorization": `Bearer ${PASSWORD}`,
        },
        body: JSON.stringify(plant),
      });
      const json = await res.json();
      if (res.ok && json.code === 0) {
        ok++;
        console.log(`  ✅ [${i + 1}/${plants.length}] ${plant.name} (${plant.id})`);
      } else {
        fail++;
        console.log(`  ❌ [${i + 1}/${plants.length}] ${plant.name}: ${json.error || res.status}`);
      }
    } catch (err) {
      fail++;
      console.log(`  ❌ [${i + 1}/${plants.length}] ${plant.name}: ${err.message}`);
    }

    // 2.5s 间隔，避免触发限速（30次/分钟）
    if (i < plants.length - 1) {
      await new Promise(r => setTimeout(r, 2500));
    }
  }

  console.log(`\n🎉 完成！成功: ${ok}, 失败: ${fail}`);
}

main().catch(console.error);
