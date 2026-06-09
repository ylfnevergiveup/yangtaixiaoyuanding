/**
 * 第二波批量添加植物到 CMS — 观叶/球根/水生/食用菌/更多多肉/果树/趣味植物
 * 用法: CMS_ADMIN_PASSWORD=xxx node scripts/bulk-add-plants-2.mjs
 */

import { writeFileSync } from "fs";

const CMS_API = process.env.CMS_API || "https://yangtaixiaoyuanding-d7b1c10c2d50.service.tcloudbase.com/api/cms";
const PASSWORD = process.env.CMS_ADMIN_PASSWORD;

if (!PASSWORD) {
  console.error("❌ 请设置 CMS_ADMIN_PASSWORD 环境变量");
  process.exit(1);
}

const plants = [
  // ==================== 观叶植物 (foliage) ====================
  {
    id: "pothos", name: "绿萝", scientificName: "Epipremnum aureum", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "shade", water: "medium", harvestDays: 0,
    description: "<p>绿萝是国民级的室内绿植，几乎是'养不死'的代名词。心形叶片翠绿有光泽，垂吊或攀爬都极美，净化空气能力一流。</p>",
    tips: "<p>1. 水培土培均可，扦插即活<br>2. 耐阴，但明亮散射光下叶片更油亮<br>3. 干了再浇，不怕偶尔忘浇水<br>4. 定期修剪过长藤蔓促分枝</p>",
    balconyFit: "<p>北向阳台或室内散射光处最佳。几乎适应任何环境。</p>",
    suitableOrientations: ["north","east"], minPotDepth: 12, suitablePot: "挂盆或普通花盆", minTemp: 5,
  },
  {
    id: "spider-plant", name: "吊兰", scientificName: "Chlorophytum comosum", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>吊兰伸出的小吊像绿色瀑布一样垂下来，悬挂在阳台或窗边非常飘逸。还会开出小白花，朴实而优雅。</p>",
    tips: "<p>1. 挂在明亮散射光处最适宜<br>2. 小吊剪下来直接插土就活<br>3. 叶尖发黑通常是水多了<br>4. 春秋分株换盆促进生长</p>",
    balconyFit: "<p>东向或明亮北向阳台最佳。适合挂盆或高处置放。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 12, suitablePot: "挂盆", minTemp: 3,
  },
  {
    id: "snake-plant", name: "虎尾兰", scientificName: "Sansevieria trifasciata", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "shade", water: "low", harvestDays: 0,
    description: "<p>虎尾兰叶片挺拔如剑，纹理独特像虎尾花纹。NASA认证的空气净化植物，夜间释放氧气，适合放在卧室。</p>",
    tips: "<p>1. 极度耐旱，一个月不浇水也死不了<br>2. 宁干勿湿，最怕积水烂根<br>3. 叶插可繁殖，但生长慢<br>4. 光照不限，强光到暗处都能活</p>",
    balconyFit: "<p>任何朝向都能养。南阳台强光下叶片更挺拔，北阳台也能正常生长。</p>",
    suitableOrientations: ["south","east","west","north"], minPotDepth: 15, suitablePot: "透气陶盆", minTemp: 8,
  },
  {
    id: "monstera", name: "龟背竹", scientificName: "Monstera deliciosa", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>龟背竹是ins风绿植的代表，巨大的叶片上自然开裂成龟甲纹路，北欧风家居必备。长大后气势磅礴。</p>",
    tips: "<p>1. 喜明亮散射光，避免直射<br>2. 叶片需要定期喷水保湿<br>3. 气生根不要剪，帮助吸收养分<br>4. 需要支撑杆引导向上生长</p>",
    balconyFit: "<p>东向阳台最佳，晨光柔和。需要较大空间容纳宽大叶片。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 25, suitablePot: "5加仑以上大盆+支撑杆", minTemp: 10,
  },
  {
    id: "ivy", name: "常春藤", scientificName: "Hedera helix", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>常春藤是经典的垂吊绿植，藤蔓自然垂落如绿色瀑布。品种繁多，有纯绿、花叶、金边等多种选择。</p>",
    tips: "<p>1. 挂在高处让藤蔓自然下垂<br>2. 春秋生长季保持土壤湿润<br>3. 夏季高温时喷水降温<br>4. 扦插极易成活</p>",
    balconyFit: "<p>东向或半阴阳台最佳。适合栏杆挂盆或高处摆放。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 15, suitablePot: "挂盆或2加仑花盆", minTemp: -5,
  },
  {
    id: "calathea", name: "竹芋", scientificName: "Calathea spp.", category: "foliage", difficulty: "medium",
    season: ["春","夏","秋"], sunlight: "shade", water: "high", harvestDays: 0,
    description: "<p>竹芋的叶片花纹精美绝伦，像上帝打翻的调色盘。叶片白天展开晚上竖起来（祈祷状），非常有灵性。</p>",
    tips: "<p>1. 必须用纯净水或雨水浇，怕自来水氯气<br>2. 保持高湿度，叶片每天喷水<br>3. 绝对避免直射光<br>4. 冬天需要加湿器辅助</p>",
    balconyFit: "<p>北向阳台或室内散射光处。湿度要求高，干燥环境叶边会焦。</p>",
    suitableOrientations: ["north"], minPotDepth: 15, suitablePot: "透气陶盆", minTemp: 15,
  },
  {
    id: "lucky-bamboo", name: "富贵竹", scientificName: "Dracaena sanderiana", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋","冬"], sunlight: "shade", water: "high", harvestDays: 0,
    description: "<p>富贵竹寓意吉祥富贵，是最受欢迎的风水绿植。水培干净清爽，几根插在玻璃瓶里就是一道风景。</p>",
    tips: "<p>1. 水培最方便，水少了加水即可<br>2. 用晾过的自来水或纯净水<br>3. 避免阳光直射<br>4. 水中加一两颗活性炭防臭</p>",
    balconyFit: "<p>北向阳台或室内散射光最佳。水培养护最简单。</p>",
    suitableOrientations: ["north","east"], minPotDepth: 10, suitablePot: "玻璃瓶水培或小花盆", minTemp: 10,
  },
  {
    id: "dieffenbachia", name: "万年青", scientificName: "Dieffenbachia spp.", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "shade", water: "medium", harvestDays: 0,
    description: "<p>万年青叶片肥厚翠绿，有漂亮的斑纹，四季常青。耐阴性极强，是最好养的室内观叶植物之一。</p>",
    tips: "<p>1. 极耐阴，卫生间都能养活<br>2. 表土干了再浇水<br>3. 注意汁液有微毒，避免宠物啃食<br>4. 多年生，一盆能养很多年</p>",
    balconyFit: "<p>北向阳台或室内阴暗角落都能养。适应性极强。</p>",
    suitableOrientations: ["north","east","west"], minPotDepth: 15, suitablePot: "2加仑以上花盆", minTemp: 8,
  },

  // ==================== 球根花卉 (bulb) ====================
  {
    id: "tulip", name: "郁金香", scientificName: "Tulipa gesneriana", category: "bulb", difficulty: "medium",
    season: ["秋","冬"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>郁金香是春天的使者，杯状花朵亭亭玉立，色彩缤纷如调色盘。秋冬种下种球，来年春天就能收获一盆灿烂。</p>",
    tips: "<p>1. 11-12月种下种球，覆土10cm<br>2. 种球需经过低温春化才能开花<br>3. 开花期停止施肥<br>4. 花后养叶子养球，来年复花</p>",
    balconyFit: "<p>秋冬种球时放室外低温处理。春季开花时南向阳台最佳。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "3加仑以上花盆，可密植5-8球", minTemp: -15,
  },
  {
    id: "hyacinth", name: "风信子", scientificName: "Hyacinthus orientalis", category: "bulb", difficulty: "easy",
    season: ["秋","冬"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>风信子花香浓郁，一个花球就能让整个阳台香气四溢。水培盆栽两相宜，从种球到开花只需8-10周。</p>",
    tips: "<p>1. 水培时水位刚好碰到种球底部<br>2. 先在黑暗处生根2周再移到光下<br>3. 夹箭时可套个纸筒遮光促花茎伸长<br>4. 花后种球消耗大，复花效果一般</p>",
    balconyFit: "<p>春季开花时南向或东向阳台最佳。水培方式最干净省事。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 12, suitablePot: "专用水培瓶或小花盆", minTemp: -10,
  },
  {
    id: "lily", name: "百合", scientificName: "Lilium spp.", category: "bulb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>百合花大色艳，一株能开出好几朵硕大的喇叭花。香气浓郁，是阳台上的焦点花卉。亚洲百合品种最适合盆栽。</p>",
    tips: "<p>1. 选择矮生亚洲百合品种<br>泵2. 种球覆土8-10cm深<br>3. 花后剪掉残花保留叶片养球<br>4. 冬天地上部分枯死，球根来年复花</p>",
    balconyFit: "<p>南向或东向阳台最佳。需要深盆和充足光照。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 25, suitablePot: "3加仑以上深盆", minTemp: -15,
  },
  {
    id: "daffodil", name: "水仙", scientificName: "Narcissus tazetta", category: "bulb", difficulty: "easy",
    season: ["秋","冬"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>水仙是春节的标配花卉，清香四溢，金盏银台。水培养护简单，从种球到开花约40-50天，正好赶上过年。</p>",
    tips: "<p>1. 水培时水位浸没根部即可<br>2. 白天放阳光下，晚上倒掉水防徒长<br>3. 雕刻种球可控制造型<br>4. 花后种球已耗尽，来年需买新球</p>",
    balconyFit: "<p>冬季南向阳台光照充足处。水培最为传统和方便。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 8, suitablePot: "浅水仙盆或水培盘", minTemp: 0,
  },
  {
    id: "amaryllis", name: "朱顶红", scientificName: "Hippeastrum spp.", category: "bulb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>朱顶红是球根花卉中的'女王'，花朵巨大（可达20cm），一箭可开4-6朵，艳丽夺目。种一次年年开花。</p>",
    tips: "<p>1. 种球埋入1/3即可，顶部露出<br>2. 先开花后长叶是正常现象<br>3. 花后养叶子，每月施肥养球<br>4. 冬天休眠少浇水，来年复花</p>",
    balconyFit: "<p>南向阳台最佳。多年生，养护得当年年开花。</p>",
    suitableOrientations: ["south"], minPotDepth: 20, suitablePot: "大小适中的花盆（不宜太大）", minTemp: 5,
  },
  {
    id: "oxalis", name: "酢浆草", scientificName: "Oxalis spp.", category: "bulb", difficulty: "easy",
    season: ["秋","冬","春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>酢浆草是阳台上的'小可爱'，五彩缤纷的小花爆盆效果惊人。种球小巧，一盆可以密植十几个，花量惊人。</p>",
    tips: "<p>1. 秋天种下小种球，覆土1-2cm<br>2. 光照充足才能爆花<br>3. 花后叶子枯萎是休眠，断水即可<br>4. 收球后秋天再种</p>",
    balconyFit: "<p>南向阳台全日照最佳。盆小不占地方，可以收集多个品种。</p>",
    suitableOrientations: ["south"], minPotDepth: 10, suitablePot: "小盆，一盆种10-20球", minTemp: 0,
  },

  // ==================== 水生植物 (aquatic) ====================
  {
    id: "bowl-lotus", name: "碗莲", scientificName: "Nelumbo nucifera 'Bowl'", category: "aquatic", difficulty: "medium",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>碗莲是缩小版的荷花，一个小碗或小水缸就能种。夏日开出精致的粉色或白色荷花，微风吹过满阳台清香。</p>",
    tips: "<p>1. 春天破壳浸种，每天换水<br>2. 长出浮叶后移入有泥的容器<br>3. 必须全日照，光照不足不开花<br>4. 冬天水面结冰不影响来年生长</p>",
    balconyFit: "<p>南向阳台全日照必备。需要水缸或不透水容器+塘泥。</p>",
    suitableOrientations: ["south"], minPotDepth: 20, suitablePot: "直径30cm以上水缸或不透水容器+塘泥", minTemp: -5,
  },
  {
    id: "pennywort", name: "铜钱草", scientificName: "Hydrocotyle verticillata", category: "aquatic", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>铜钱草圆圆的叶片像一枚枚小铜钱，寓意财源滚滚。半土半水种植最旺盛，给点阳光就疯长。</p>",
    tips: "<p>1. 半土半水长得最快<br>2. 全日照下叶片最大最圆<br>3. 缺水就蔫，加水立挺<br>4. 分株繁殖极快</p>",
    balconyFit: "<p>南向阳台全日照最旺盛。半土半水种植最简单。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 12, suitablePot: "无孔容器+塘泥半土半水", minTemp: 5,
  },
  {
    id: "water-lily", name: "睡莲", scientificName: "Nymphaea spp.", category: "aquatic", difficulty: "medium",
    season: ["春","夏","秋"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>睡莲浮在水面的花朵像莫奈的画一样梦幻。选择微型品种，一个小水缸就能在阳台上种出一片小池塘。</p>",
    tips: "<p>1. 选微型或小型品种（如'海尔芙拉'）<br>2. 根茎埋入塘泥，水深20-40cm<br>3. 必须全日照才能开花<br>4. 冬天茎叶枯萎，来年重新萌发</p>",
    balconyFit: "<p>南向阳台全日照。需要较大水缸和塘泥。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "直径40cm以上水缸+塘泥", minTemp: -5,
  },

  // ==================== 食用菌 (mushroom) ====================
  {
    id: "oyster-mushroom", name: "平菇", scientificName: "Pleurotus ostreatus", category: "mushroom", difficulty: "easy",
    season: ["春","秋","冬"], sunlight: "shade", water: "high", harvestDays: 7,
    description: "<p>阳台种平菇是近年最火的家庭种植项目！买一个菌棒喷水就能出菇，7天从菇蕾到采收，成就感爆棚。</p>",
    tips: "<p>1. 购买成品菌棒最简单<br>2. 放在阴暗潮湿处，每天喷水2-3次<br>3. 菇伞展开但未完全平展时采收<br>4. 采完一茬还能出第二茬</p>",
    balconyFit: "<p>北向阳台或阴暗角落最佳！不需要阳光，只需要湿度。</p>",
    suitableOrientations: ["north"], minPotDepth: 0, suitablePot: "菌棒无需花盆，放在托盘上即可", minTemp: 10,
  },
  {
    id: "shiitake", name: "香菇", scientificName: "Lentinula edodes", category: "mushroom", difficulty: "medium",
    season: ["春","秋"], sunlight: "shade", water: "high", harvestDays: 14,
    description: "<p>在家种出新鲜香菇，比超市买的香十倍！需要菌棒或段木，温度和湿度控制好的话一年可收3-4茬。</p>",
    tips: "<p>1. 购买香菇菌棒开始<br>2. 温度15-25℃最适合出菇<br>3. 每天喷水保持湿度85%以上<br>4. 菇伞6-7分开时采收风味最佳</p>",
    balconyFit: "<p>北向阳台或卫生间旁阴暗处最佳。需要保持高湿度。</p>",
    suitableOrientations: ["north"], minPotDepth: 0, suitablePot: "菌棒放在塑料筐或托盘上", minTemp: 8,
  },

  // ==================== 更多多肉 (succulent) ====================
  {
    id: "pink-moonstone", name: "桃蛋", scientificName: "Pachyphytum oviferum 'Pink'", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>桃蛋（桃之卵）是多肉圈的'断货王'，圆滚滚粉嘟嘟的叶片像一颗颗小糖豆。出状态时粉红色，少女心爆棚。</p>",
    tips: "<p>1. 颗粒土比例70%以上<br>2. 控水+大温差才能出粉色<br>3. 夏天休眠少水通风<br>4. 叶插成功率极高</p>",
    balconyFit: "<p>南向阳台春秋季出状态最佳。夏季需遮阴控水。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 8, suitablePot: "小陶盆，高颗粒土", minTemp: 5,
  },
  {
    id: "lithops", name: "生石花", scientificName: "Lithops spp.", category: "succulent", difficulty: "hard",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>生石花（屁屁花）是地球上最像石头的植物，伪装大师。秋天会从中间裂开开出一朵小菊花，惊艳所有人。</p>",
    tips: "<p>1. 颗粒土90%以上，几乎全颗粒<br>2. 蜕皮期间绝对不能浇水<br>3. 一年浇水不超过10次<br>4. 宁愿干死不要涝死</p>",
    balconyFit: "<p>南向阳台全日照，但夏天需遮阴。控水是生存关键。</p>",
    suitableOrientations: ["south"], minPotDepth: 8, suitablePot: "极小盆+全颗粒土", minTemp: 10,
  },
  {
    id: "jelly-bean", name: "乙女心", scientificName: "Sedum pachyphyllum", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>乙女心的叶片像一颗颗果冻豆，出状态时顶端通红，像害羞的少女。生长迅速，容易爆盆成老桩。</p>",
    tips: "<p>1. 光线充足叶尖才变红<br>2. 叶片发皱再浇水<br>3. 容易徒长，控水控光<br>4. 叶插扦插均易成活</p>",
    balconyFit: "<p>南向阳台全日照出状态。耐晒耐旱好养活。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 10, suitablePot: "透气陶盆", minTemp: 3,
  },
  {
    id: "sedum-rubrotinctum", name: "虹之玉", scientificName: "Sedum rubrotinctum", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>虹之玉是多肉入门的经典品种，翠绿的叶片在阳光下变得通红透亮，像一串串红绿相间的宝石。</p>",
    tips: "<p>1. 全日照才能变红<br>2. 叶片一碰就掉是正常现象<br>3. 掉落的叶子放土上就能生根<br>4. 耐旱性强，偶尔忘浇水没事</p>",
    balconyFit: "<p>南向阳台全日照。新手的入门首选多肉。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 8, suitablePot: "小陶盆+颗粒土", minTemp: 0,
  },
  {
    id: "crassula-mesembryanthemopsis", name: "钱串", scientificName: "Crassula mesembryanthemopsis", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>钱串的叶子像一串串铜钱叠在一起，寓意招财进宝。长得快容易爆盆，是多肉拼盘的点睛之笔。</p>",
    tips: "<p>1. 光照充足叶子紧凑像钱串<br>2. 控水防徒长<br>3. 砍头可繁殖并促分枝<br>4. 徒长后很难恢复，预防为主</p>",
    balconyFit: "<p>南向阳台全日照。小盆栽也不占空间。</p>",
    suitableOrientations: ["south"], minPotDepth: 8, suitablePot: "小盆+颗粒土", minTemp: 5,
  },

  // ==================== 更多果树 (fruit) ====================
  {
    id: "cherry-dwarf", name: "樱桃（矮化）", scientificName: "Prunus avium 'Dwarf'", category: "fruit", difficulty: "hard",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>矮化樱桃是阳台果树的'天花板'，春天满树白花，夏天红果满枝。需要耐心和技术，但收获时一切值得。</p>",
    tips: "<p>1. 必须买嫁接矮化苗<br>2. 至少两个品种互相授粉<br>3. 冬天需足够的低温时数<br>4. 果期罩网防鸟</p>",
    balconyFit: "<p>南向阳台全日照。适合有经验的种植者挑战。</p>",
    suitableOrientations: ["south"], minPotDepth: 40, suitablePot: "10加仑以上大盆", minTemp: -20,
  },
  {
    id: "mulberry", name: "桑葚", scientificName: "Morus alba 'Dwarf'", category: "fruit", difficulty: "easy",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>矮化桑葚是阳台果树中的'容易模式'，春季结出一串串紫黑色的甜蜜果实。叶片还可以喂蚕宝宝，一树多用。</p>",
    tips: "<p>1. 选矮化品种，结果早<br>2. 耐修剪，可控制大小<br>3. 果实变黑变软再采摘<br>4. 冬季落叶正常休眠</p>",
    balconyFit: "<p>南向阳台全日照。比樱桃好养太多，果树入门首选。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "7加仑以上大盆", minTemp: -20,
  },
  {
    id: "feijoa", name: "菲油果", scientificName: "Acca sellowiana", category: "fruit", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>菲油果是新兴的阳台果树，花朵可食用（花瓣甜脆像棉花糖），果实有菠萝和草莓的混合香气。四季常青，花叶果俱美。</p>",
    tips: "<p>1. 选择自花授粉品种<br>2. 耐修剪，适合盆栽塑形<br>3. 花和果都可食用<br>4. 较耐寒，南方可露地过冬</p>",
    balconyFit: "<p>南向阳台全日照。观花赏叶吃果三合一。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 30, suitablePot: "7加仑以上大盆", minTemp: -8,
  },

  // ==================== 趣味植物 ====================
  {
    id: "mimosa", name: "含羞草", scientificName: "Mimosa pudica", category: "flower", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>含羞草一碰就会合拢叶片，像害羞的小姑娘。还会开出粉紫色的毛绒球小花，大人小孩都爱玩。</p>",
    tips: "<p>1. 种子播种出苗率高<br>2. 喜光喜暖怕冷<br>3. 不要频繁触碰，会消耗能量<br>4. 茎上有刺，小心手指</p>",
    balconyFit: "<p>南向阳台最适宜。趣味性强，适合亲子互动。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 12, suitablePot: "1-2加仑花盆", minTemp: 15,
  },
  {
    id: "venus-flytrap", name: "捕蝇草", scientificName: "Dionaea muscipula", category: "flower", difficulty: "medium",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>捕蝇草是会吃虫子植物中的大明星，夹子般的捕虫叶像小怪兽的嘴巴，碰到虫子瞬间闭合，超级酷。</p>",
    tips: "<p>1. 必须用纯净水或雨水，怕矿物质<br>2. 用无肥泥炭土+珍珠岩<br>3. 不要手动触发夹子（浪费能量）<br>4. 冬天休眠变黑是正常的</p>",
    balconyFit: "<p>南向或东向阳台。需要高湿度和纯净水。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 10, suitablePot: "小盆+无肥泥炭土", minTemp: 5,
  },
  {
    id: "air-plant", name: "空气凤梨", scientificName: "Tillandsia spp.", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "low", harvestDays: 0,
    description: "<p>空气凤梨不需要土壤！悬空挂在阳台就能活，靠叶片吸收空气中的水分。形态各异，像外星生物一样酷。</p>",
    tips: "<p>1. 每周泡水1-2次，甩干放回<br>2. 悬挂在明亮通风处<br>3. 泡水后必须彻底晾干防烂心<br>4. 开花后母株会枯萎并长出侧芽</p>",
    balconyFit: "<p>东向阳台明亮散射光最佳。挂起来养不占桌面空间。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 0, suitablePot: "无需花盆，悬挂装饰即可", minTemp: 8,
  },
];

const delay = (ms) => new Promise(r => setTimeout(r, ms));

console.log(`🚀 开始第二波批量导入 ${plants.length} 种植物到 CMS...`);
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
      console.log(`${progress} ✅ ${plant.name} (${plant.id}) [${plant.category}]`);
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

  if (i < plants.length - 1) {
    await delay(2500);
  }
}

console.log(`\n🎉 第二波导入完成！`);
console.log(`   ✅ 成功: ${success}`);
console.log(`   ❌ 失败: ${failed}`);
if (failedList.length > 0) {
  console.log(`   失败列表: ${failedList.join(", ")}`);
}
