/**
 * 第四波批量添加植物 — 20 种新植物
 * 用法: CMS_ADMIN_PASSWORD=xxx node scripts/bulk-add-plants-4.mjs
 */

const CMS_API = process.env.CMS_API || "https://yangtaixiaoyuanding-d7b1c10c2d50.service.tcloudbase.com/api/cms";
const PASSWORD = process.env.CMS_ADMIN_PASSWORD;

if (!PASSWORD) {
  console.error("❌ 请设置 CMS_ADMIN_PASSWORD 环境变量");
  process.exit(1);
}

const plants = [
  // ==================== 蔬菜 vegetable (5) ====================
  {
    id: "cauliflower", name: "花椰菜", scientificName: "Brassica oleracea var. botrytis", category: "vegetable", difficulty: "medium",
    season: ["秋","春"], sunlight: "full", water: "medium", harvestDays: 65,
    description: "<p>花椰菜是甘蓝家族的明星成员，洁白的半球形花球营养丰富。阳台种一棵，看它从一片叶子中慢慢膨大出花球，很有成就感。</p>",
    tips: "<p>1. 喜冷凉气候，秋季种植品质最佳<br>2. 花球开始形成时遮光绑叶，保持洁白<br>3. 需肥量较大，生长期每两周追肥一次<br>4. 花球直径15-20cm时及时采收</p>",
    balconyFit: "<p>南向或西向阳台最佳。需要25cm以上深度的盆，单棵占盆种。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 25, suitablePot: "3加仑以上深盆", minTemp: 0,
  },
  {
    id: "onion", name: "洋葱", scientificName: "Allium cepa", category: "vegetable", difficulty: "easy",
    season: ["秋","春"], sunlight: "full", water: "medium", harvestDays: 100,
    description: "<p>洋葱是厨房必备调味菜，阳台种植占空间小、病虫害少。既可以收获鳞茎，嫩苗期也可当青葱食用。</p>",
    tips: "<p>1. 直播需疏松沙质土，条播间距10cm<br>2. 苗期保持湿润，鳞茎膨大期减少浇水<br>3. 叶片倒伏变黄时即可收获<br>4. 也可用洋葱底部水培生根观赏</p>",
    balconyFit: "<p>南向阳台，全日照条件下鳞茎膨大最好。也可播种在深盆密植收小洋葱。</p>",
    suitableOrientations: ["south"], minPotDepth: 20, suitablePot: "长条盆密植或单棵3加仑盆", minTemp: -5,
  },
  {
    id: "pumpkin", name: "南瓜", scientificName: "Cucurbita moschata", category: "vegetable", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 80,
    description: "<p>阳台种南瓜要用矮生品种，搭个小架子让它爬藤。金黄色的花朵和可爱的果实既是食材也是风景。</p>",
    tips: "<p>1. 选择矮生或小型品种（贝贝南瓜等）<br>2. 需大盆（10加仑以上）和支架<br>3. 人工授粉提高坐果率（雄花对雌花）<br>4. 藤蔓可修剪控制长度</p>",
    balconyFit: "<p>南向阳台，需要较大空间和支架。选矮生品种成功率高。</p>",
    suitableOrientations: ["south"], minPotDepth: 35, suitablePot: "10加仑以上深盆+攀爬架", minTemp: 10,
  },
  {
    id: "chinese-yam", name: "山药", scientificName: "Dioscorea polystachya", category: "vegetable", difficulty: "hard",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 180,
    description: "<p>山药是滋补食材中的上品，阳台用深容器栽培也能收获。藤蔓沿着支架攀爬，绿叶成荫也好看。</p>",
    tips: "<p>1. 用山药嘴子或零余子（山药豆）繁殖<br>2. 需要深50cm以上的容器<br>3. 搭高架让藤蔓攀爬<br>4. 秋末茎叶枯黄后挖取</p>",
    balconyFit: "<p>南向阳台+深容器+高攀爬架。生长周期长但管理简单，适合有耐心的种植者。</p>",
    suitableOrientations: ["south"], minPotDepth: 50, suitablePot: "特深种植桶+高1.5m以上支架", minTemp: 5,
  },
  {
    id: "edamame", name: "毛豆", scientificName: "Glycine max", category: "vegetable", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "medium", harvestDays: 70,
    description: "<p>毛豆就是新鲜的大豆，嫩荚水煮后是绝佳零食和下酒菜。植株不高，适合阳台盆栽，一家人种几盆就够吃一顿。</p>",
    tips: "<p>1. 直播点播，每穴2-3粒种子<br>2. 豆科植物有根瘤菌可自固氮，少施氮肥<br>3. 开花结荚期保持水分充足<br>4. 豆荚饱满但未变黄时采收</p>",
    balconyFit: "<p>南向或东向阳台。植株矮壮不占空间，密植一盆能收不少。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "3加仑盆或长条盆", minTemp: 8,
  },

  // ==================== 香草 herb (2) ====================
  {
    id: "arugula", name: "芝麻菜", scientificName: "Eruca vesicaria", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "partial", water: "medium", harvestDays: 25,
    description: "<p>芝麻菜是西餐沙拉中的明星绿叶菜，带有独特的坚果辛香味。长得快、好管理，是阳台种菜入门首选之一。</p>",
    tips: "<p>1. 撒播即可，出苗后间苗至10cm<br>2. 喜凉爽，高温易抽薹开花<br>3. 掰外叶采收可多次收获<br>4. 开花后叶片变苦，及时采摘</p>",
    balconyFit: "<p>东向或南向阳台，春秋表现最佳。浅盆也能种好。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 12, suitablePot: "长条浅盆或2加仑盆", minTemp: 0,
  },
  {
    id: "lemon-balm", name: "香蜂草", scientificName: "Melissa officinalis", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "partial", water: "medium", harvestDays: 40,
    description: "<p>香蜂草是薄荷的近亲，叶片带有清新的柠檬香气。泡茶安神助眠，做沙拉提味，是阳台香草园的优雅成员。</p>",
    tips: "<p>1. 播种或扦插均可，成活率极高<br>2. 喜半阴湿润环境，怕强光暴晒<br>3. 定期修剪促分枝，越长越旺<br>4. 夏末开小白花，也可观赏</p>",
    balconyFit: "<p>东向或北向阳台最佳，喜半阴环境。地栽会泛滥，盆栽正好控制。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 15, suitablePot: "2加仑盆", minTemp: -10,
  },

  // ==================== 多肉 succulent (3) ====================
  {
    id: "echeveria-glauca", name: "玉蝶", scientificName: "Echeveria secunda var. glauca", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>玉蝶是多肉中的经典品种，蓝灰色叶片排列成完美的莲座形，如同一朵石化的蓝莲花。耐旱好养，颜值超高。</p>",
    tips: "<p>1. 全日照养护，光照不足会摊大饼<br>2. 干透浇透，夏季休眠控水<br>3. 叶插和砍头都容易繁殖<br>4. 冬季保持5℃以上</p>",
    balconyFit: "<p>南向阳台阳光最足的位置。多肉拼盘的主角担当。</p>",
    suitableOrientations: ["south"], minPotDepth: 8, suitablePot: "多肉专用浅盆或陶盆", minTemp: 5,
  },
  {
    id: "sempervivum", name: "观音莲", scientificName: "Sempervivum tectorum", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>观音莲（长生草）是多肉界的耐寒冠军，紫红色的莲座形植株外圈会不断冒出小崽，繁殖力超强。冬态颜色更艳丽。</p>",
    tips: "<p>1. 耐寒性极强，-15℃也能安全越冬<br>2. 全日照叶片紧凑，颜色更红<br>3. 侧芽掰下即种，成活率100%<br>4. 夏季高温时适当遮阴</p>",
    balconyFit: "<p>南向或西向阳台。耐寒耐热，是新手多肉首选。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 8, suitablePot: "浅口陶盆或拼盘", minTemp: -15,
  },
  {
    id: "orostachys", name: "子持莲华", scientificName: "Orostachys boehmeri", category: "succulent", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>子持莲华是日本培育的经典多肉品种，小巧玲珑的莲座形植株会不断伸出走茎繁殖小崽，像一个个小莲花漂浮在土面上。</p>",
    tips: "<p>1. 走茎繁殖力极强，一盆能变十盆<br>2. 喜充足光照，半阴也能生长<br>3. 干透浇透，盆土不能积水<br>4. 夏季休眠时外层叶片干枯是正常的</p>",
    balconyFit: "<p>东向或南向阳台。体型小巧不占地方，适合桌面盆栽。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 8, suitablePot: "小巧陶盆", minTemp: 0,
  },

  // ==================== 花卉 flower (4) ====================
  {
    id: "dahlia", name: "大丽花", scientificName: "Dahlia pinnata", category: "flower", difficulty: "medium",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 70,
    description: "<p>大丽花是夏秋阳台最耀眼的明星。花朵直径可达15cm以上，菊花形、牡丹形、球形等花型丰富多彩，一盆就能点亮整个阳台。</p>",
    tips: "<p>1. 春季种块根，选矮生品种适合盆栽<br>2. 需充足光照和水分<br>3. 花后剪去残花促新花不断<br>4. 冬季地上部分枯死后挖出块根储藏</p>",
    balconyFit: "<p>南向阳台，选矮生品种（30-50cm高）。需支架支撑花朵。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "5加仑以上深盆+支撑杆", minTemp: 5,
  },
  {
    id: "peony", name: "芍药", scientificName: "Paeonia lactiflora", category: "flower", difficulty: "medium",
    season: ["秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>芍药是中国传统名花，花朵硕大如碗、层层叠叠，香气浓郁。虽是宿根花卉，盆栽也能开出震撼效果，年年如期绽放。</p>",
    tips: "<p>1. 秋季种块根，春季不宜移栽<br>2. 需要冬季低温才能开花<br>3. 花蕾期立支架防倒伏<br>4. 花后剪去残花保留叶片养根</p>",
    balconyFit: "<p>南向阳台，需要冬季低温春化。选矮生品种，大盆深栽。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "5加仑以上深盆", minTemp: -20,
  },
  {
    id: "iris", name: "鸢尾", scientificName: "Iris germanica", category: "flower", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>鸢尾花形优雅如蝴蝶展翅，蓝紫色调是阳台上的高级色。根茎浅栽就能年年开花，适合懒人养护。</p>",
    tips: "<p>1. 根茎浅埋，顶芽露出土面<br>2. 喜光照充足，半阴也能开花<br>3. 花后分株繁殖，2-3年分一次<br>4. 冬季地上部分枯黄是正常的</p>",
    balconyFit: "<p>南向或东向阳台。低维护高颜值，适合忙碌的都市人。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "3加仑盆或长条盆", minTemp: -10,
  },
  {
    id: "azalea", name: "杜鹃", scientificName: "Rhododendron simsii", category: "flower", difficulty: "medium",
    season: ["春"], sunlight: "partial", water: "high", harvestDays: 0,
    description: "<p>杜鹃是中国十大名花之一，春天开成花球看不到叶子。阳台种一盆西洋杜鹃，花期长达两个月，年味十足。</p>",
    tips: "<p>1. 喜酸性土，用杜鹃专用土或松针土<br>2. 喜半阴湿润，怕暴晒和干燥<br>3. 花后及时剪残花促分枝<br>4. 浇水用雨水或放置过的自来水</p>",
    balconyFit: "<p>东向或北向阳台，忌西晒。需要保持空气湿度，经常喷雾。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 20, suitablePot: "3加仑透气陶盆", minTemp: -5,
  },

  // ==================== 水果 fruit (3) ====================
  {
    id: "grape-vine", name: "葡萄", scientificName: "Vitis vinifera", category: "fruit", difficulty: "hard",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>阳台种葡萄选矮生品种，搭个小棚架让它爬藤。春夏绿叶成荫，秋天挂着一串串果实，既有收成又能遮阳。</p>",
    tips: "<p>1. 选矮生或小型果品种（如巨峰盆栽型）<br>2. 大盆深栽+棚架支撑<br>3. 冬季修剪保留结果枝<br>4. 套袋防鸟防虫</p>",
    balconyFit: "<p>南向阳台，需要棚架和大盆。适合有空间且愿意长期投入的进阶玩家。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 40, suitablePot: "15加仑以上大盆+攀爬棚架", minTemp: -10,
  },
  {
    id: "loquat", name: "枇杷", scientificName: "Eriobotrya japonica", category: "fruit", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>枇杷树形优美四季常绿，冬春开花初夏结果，果实金黄甜蜜。矮化品种盆栽也能开花结果，还是优秀的观叶植物。</p>",
    tips: "<p>1. 选嫁接苗或矮化品种<br>2. 需充足光照，花芽分化在秋季<br>3. 果实坐果后疏果留大果<br>4. 冬季开花，注意防霜冻</p>",
    balconyFit: "<p>南向阳台，需要大盆和一定空间。四季常绿是附加价值。</p>",
    suitableOrientations: ["south"], minPotDepth: 35, suitablePot: "10加仑以上大盆", minTemp: -5,
  },
  {
    id: "bayberry", name: "杨梅", scientificName: "Myrica rubra", category: "fruit", difficulty: "hard",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>杨梅是江南特产水果，果实紫红多汁酸甜可口。阳台种矮化品种，春看新叶夏品鲜果，满满的家乡味。</p>",
    tips: "<p>1. 需雌雄异株，选已嫁接的结果苗<br>2. 喜酸性土，用山泥或松针土<br>3. 果实成熟期防鸟啄<br>4. 6-7月果实成熟，紫黑色时采摘</p>",
    balconyFit: "<p>南向阳台，需要大盆和酸性土壤。适合江南地区种植爱好者。</p>",
    suitableOrientations: ["south"], minPotDepth: 40, suitablePot: "12加仑以上大盆", minTemp: -5,
  },

  // ==================== 菌菇 mushroom (2) ====================
  {
    id: "hericium", name: "猴头菇", scientificName: "Hericium erinaceus", category: "mushroom", difficulty: "medium",
    season: ["秋","冬"], sunlight: "shade", water: "high", harvestDays: 25,
    description: "<p>猴头菇形似猴头、洁白如雪，是珍贵的食药两用菌。阳台用菌包培养，25天就能收获，肉质鲜美营养丰富。</p>",
    tips: "<p>1. 用菌包培养，保持湿度80%以上<br>2. 避免直射光，散射光即可<br>3. 每天喷雾3-5次保持湿润<br>4. 子实体成熟后及时采收</p>",
    balconyFit: "<p>北向阳台或室内阴凉处。需要高湿度环境，可放在加湿器旁。</p>",
    suitableOrientations: ["north"], minPotDepth: 10, suitablePot: "菌包直接培养或浅托盘", minTemp: 15,
  },
  {
    id: "agrocybe", name: "茶树菇", scientificName: "Agrocybe cylindracea", category: "mushroom", difficulty: "easy",
    season: ["春","秋"], sunlight: "shade", water: "high", harvestDays: 20,
    description: "<p>茶树菇是南方常见的食用菌，菌柄脆嫩口感独特。阳台用菌包培养出菇快、产量高，是菌菇种植入门首选。</p>",
    tips: "<p>1. 菌包开袋后每天喷水保湿<br>2. 温度20-28℃出菇最快<br>3. 菌盖展开但未完全平展时采收<br>4. 采完一茬继续喷水可出第二茬</p>",
    balconyFit: "<p>北向阳台或室内散射光处。占地小、周期短，适合新手体验。</p>",
    suitableOrientations: ["north"], minPotDepth: 8, suitablePot: "菌包直接培养", minTemp: 18,
  },

  // ==================== 观叶 foliage (1) ====================
  {
    id: "pachira", name: "发财树", scientificName: "Pachira aquatica", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "low", harvestDays: 0,
    description: "<p>发财树是经典的室内观叶植物，掌状复叶四季常绿，寓意招财进宝。耐阴耐旱好养活，是新手绿植入门之选。</p>",
    tips: "<p>1. 喜散射光，避免暴晒<br>2. 耐旱怕涝，盆土干透再浇<br>3. 定期旋转盆方向防偏冠<br>4. 春季修剪促分枝</p>",
    balconyFit: "<p>东向或北向阳台，明亮散射光处。也可室内养护。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 20, suitablePot: "3加仑盆", minTemp: 8,
  },
];

async function main() {
  console.log(`🚀 开始批量添加 ${plants.length} 种植物...\n`);

  const authHeaders = {
    "Content-Type": "application/json",
    "X-Cms-Password": PASSWORD,
    "Authorization": `Bearer ${PASSWORD}`,
  };

  let okCount = 0;
  let failCount = 0;

  for (const plant of plants) {
    try {
      // 检查是否已存在
      const checkRes = await fetch(`${CMS_API}/plants/${plant.id}`);
      const checkJson = await checkRes.json();

      if (checkJson.code === 0 && checkJson.data) {
        console.log(`  ⏭️  ${plant.name} (${plant.id}) — 已存在，跳过`);
        continue;
      }

      // 添加缺失字段
      const record = {
        ...plant,
        image: "",
        imagePosition: "50% 50%",
        featured: false,
        status: "published",
        _updatedAt: new Date().toISOString(),
      };

      const res = await fetch(`${CMS_API}/plants`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(record),
      });

      if (res.ok) {
        console.log(`  ✅ ${plant.name} (${plant.id}) — ${plant.category}`);
        okCount++;
      } else {
        const errBody = await res.text();
        console.error(`  ❌ ${plant.name} — HTTP ${res.status}: ${errBody.slice(0, 100)}`);
        failCount++;
      }
    } catch (err) {
      console.error(`  ❌ ${plant.name} — ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n🎉 完成！成功 ${okCount} 种，跳过 ${plants.length - okCount - failCount} 种，失败 ${failCount} 种`);
}

main().catch(console.error);
