/**
 * 第五波批量添加植物 — 30 种
 * 重点补充：水生植物、球根花卉、食用菌、观叶植物
 * 用法: CMS_ADMIN_PASSWORD=xxx node scripts/bulk-add-plants-5.mjs
 */

const CMS_API = process.env.CMS_API || "https://yangtaixiaoyuanding-d7b1c10c2d50.service.tcloudbase.com/api/cms";
const PASSWORD = process.env.CMS_ADMIN_PASSWORD;

if (!PASSWORD) {
  console.error("❌ 请设置 CMS_ADMIN_PASSWORD 环境变量");
  process.exit(1);
}

const plants = [
  // ==================== 水生植物 aquatic (6) ====================
  {
    id: "lotus", name: "荷花", scientificName: "Nelumbo nucifera", category: "aquatic", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>荷花是夏季阳台水景的灵魂，碧绿的荷叶和粉嫩的花朵让阳台瞬间有了诗意。用大缸种植，春天种藕，夏天赏花，秋天还能收莲藕。</p>",
    tips: "<p>1. 选直径40cm以上的大水缸<br>2. 塘泥+基肥打底，水深保持15-30cm<br>3. 全日照才能多开花<br>4. 冬季枯叶后留水过冬，来年再发</p>",
    balconyFit: "<p>南向阳台，需要大水缸和充足光照。选碗莲品种空间需求更小。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "直径40cm以上大水缸", minTemp: 0,
  },
  {
    id: "arrowhead", name: "慈姑", scientificName: "Sagittaria sagittifolia", category: "aquatic", difficulty: "easy",
    season: ["春"], sunlight: "full", water: "high", harvestDays: 120,
    description: "<p>慈姑是江南水八仙之一，箭形叶片优雅美观，地下球茎粉糯可食。阳台用水盆种植，既能观叶又能收获，一举两得。</p>",
    tips: "<p>1. 春季种球茎于淤泥中，水深5-10cm<br>2. 全日照或半日照均可<br>3. 秋季叶片枯黄后挖取球茎<br>4. 也可纯水培观赏</p>",
    balconyFit: "<p>南向或东向阳台，水盆或小水缸即可。可食可赏。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "直径30cm水盆或小水缸", minTemp: 5,
  },
  {
    id: "water-caltrop", name: "菱角", scientificName: "Trapa natans", category: "aquatic", difficulty: "easy",
    season: ["春"], sunlight: "full", water: "high", harvestDays: 90,
    description: "<p>菱角是南方水乡的经典水生植物，菱形的叶盘浮在水面像一朵朵绿色的花。夏天开小白花，秋天就能捞菱角吃。</p>",
    tips: "<p>1. 春季将菱角种子投入水中即可<br>2. 水深20-40cm，需要一定水体<br>3. 全日照结菱多<br>4. 秋季菱角成熟后沉入水底，捞出食用</p>",
    balconyFit: "<p>南向阳台大水盆或水缸。生长迅速，夏季能覆盖水面遮阳。</p>",
    suitableOrientations: ["south"], minPotDepth: 25, suitablePot: "直径40cm以上水缸或大盆", minTemp: 10,
  },
  {
    id: "scirpus", name: "水葱", scientificName: "Schoenoplectus tabernaemontani", category: "aquatic", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>水葱是水景中的线条担当，翠绿的圆柱形茎秆笔直挺拔，给阳台水景增添层次感和禅意。几乎不需要打理。</p>",
    tips: "<p>1. 种在水盆边缘或浅水区<br>2. 耐寒耐热，几乎无病虫害<br>3. 冬季地上部分枯黄，来年春天重新发芽<br>4. 可与其他水生植物组合造景</p>",
    balconyFit: "<p>任何朝向均可，极其耐阴耐晒。水盆种植，高度可达80-120cm。</p>",
    suitableOrientations: ["south","east","west","north"], minPotDepth: 15, suitablePot: "水盆或小水缸", minTemp: -15,
  },
  {
    id: "floating-heart", name: "荇菜", scientificName: "Nymphoides peltata", category: "aquatic", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>荇菜是诗经里走出来的水生植物，心形叶片浮在水面，夏天开出一朵朵金黄色小花，清新雅致不输睡莲。</p>",
    tips: "<p>1. 根茎浅埋泥土中，水深10-30cm<br>2. 全日照开花更多<br>3. 繁殖力强，一盆能蔓延满水面<br>4. 冬季可留根茎在泥中越冬</p>",
    balconyFit: "<p>南向或东向阳台水缸。开花期长，是小型水景的亮点。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 20, suitablePot: "直径30cm以上水盆", minTemp: -5,
  },
  {
    id: "spatterdock", name: "萍蓬草", scientificName: "Nuphar pumila", category: "aquatic", difficulty: "easy",
    season: ["春","夏"], sunlight: "full", water: "high", harvestDays: 0,
    description: "<p>萍蓬草是缩小版的睡莲，浮在水面的叶片圆润可爱，黄色小花挺出水面，精致小巧适合阳台小水景。</p>",
    tips: "<p>1. 根茎种在泥中，水深10-20cm<br>2. 喜充足光照<br>3. 花后分株繁殖<br>4. 冬季保持根茎在水下不结冰即可</p>",
    balconyFit: "<p>南向或东向阳台。比睡莲小巧，适合中小型水盆。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 15, suitablePot: "直径25cm以上水盆", minTemp: -10,
  },

  // ==================== 球根花卉 bulb (6) ====================
  {
    id: "grape-hyacinth", name: "葡萄风信子", scientificName: "Muscari armeniacum", category: "bulb", difficulty: "easy",
    season: ["秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>葡萄风信子是春天最早开花的球根之一，一串串蓝紫色小花像迷你葡萄，精致又可爱。种一盆密植，春天给你一片蓝色花毯。</p>",
    tips: "<p>1. 秋季种球根，覆土5cm深<br>2. 需要冬季低温才能开花<br>3. 密植效果最佳，一盆种10-15球<br>4. 花后保留叶片养球，来年复花</p>",
    balconyFit: "<p>南向或东向阳台。浅盆密植，早春开花最早。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 12, suitablePot: "宽口浅盆密植", minTemp: -15,
  },
  {
    id: "snowdrop", name: "雪滴花", scientificName: "Galanthus nivalis", category: "bulb", difficulty: "easy",
    season: ["秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>雪滴花是最勇敢的花——冬末春初冰雪未消时就开出洁白如雪的小花，三片花瓣像水滴一样垂下来，是春天到来的第一个信号。</p>",
    tips: "<p>1. 秋季种球根，覆土3-5cm<br>2. 喜半阴湿润环境<br>3. 群植效果最佳<br>4. 花后自然休眠，不需特殊管理</p>",
    balconyFit: "<p>东向或北向阳台。耐寒性极强，北方也能安全越冬。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 10, suitablePot: "浅口盆密植", minTemp: -25,
  },
  {
    id: "lily-of-the-valley", name: "铃兰", scientificName: "Convallaria majalis", category: "bulb", difficulty: "medium",
    season: ["秋","春"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>铃兰是Dior先生最爱的花，一串串白色小铃铛垂下来，香气清幽令人陶醉。北欧新娘手捧花中常见它的身影，自带仙气。</p>",
    tips: "<p>1. 春秋均可种植根茎，覆土2-3cm<br>2. 喜半阴湿润，怕暴晒<br>3. 全株有毒，注意远离宠物<br>4. 花后分株繁殖</p>",
    balconyFit: "<p>东向或北向阳台最佳。喜阴耐寒，适合光照不足的阳台。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 12, suitablePot: "浅盆密植", minTemp: -20,
  },
  {
    id: "ornamental-onion", name: "大花葱", scientificName: "Allium giganteum", category: "bulb", difficulty: "easy",
    season: ["秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>大花葱是球根花卉里的巨人，15cm直径的紫色花球像一颗巨大的棒棒糖插在花盆里，视觉冲击力十足，是阳台上的绝对焦点。</p>",
    tips: "<p>1. 秋季种大球根，覆土10cm深<br>2. 需要冬季低温春化<br>3. 花后剪去花茎保留叶片养球<br>4. 球根可多年复花</p>",
    balconyFit: "<p>南向阳台，需要深盆。一棵就能撑起一个花盆的气场。</p>",
    suitableOrientations: ["south"], minPotDepth: 25, suitablePot: "5加仑深盆", minTemp: -15,
  },
  {
    id: "freesia", name: "香雪兰", scientificName: "Freesia refracta", category: "bulb", difficulty: "medium",
    season: ["秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>香雪兰的花香是春天最迷人的味道之一，清甜不腻、持久悠远。花色丰富从纯白到深紫，剪下插瓶满室生香，是高级香水的原料。</p>",
    tips: "<p>1. 秋季种球根，覆土3-5cm<br>2. 出苗后多晒太阳防徒长<br>3. 花后保留叶片养球<br>4. 夏季休眠期保持干燥</p>",
    balconyFit: "<p>南向或东向阳台。需要充足光照才能花香浓郁。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 15, suitablePot: "3加仑盆密植", minTemp: 5,
  },
  {
    id: "ranunculus", name: "花毛茛", scientificName: "Ranunculus asiaticus", category: "bulb", difficulty: "medium",
    season: ["秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>花毛茛的花层层叠叠像牡丹一样华丽，却比牡丹小巧精致。颜色从纯白、粉红到深红、橙黄应有尽有，是切花市场上的超级明星。</p>",
    tips: "<p>1. 秋季种爪子根，先泡水吸水再种<br>2. 喜冷凉，高温会休眠<br>3. 花后保留叶片养根<br>4. 夏季挖出块根干燥储存</p>",
    balconyFit: "<p>南向或东向阳台，秋季种植春季赏花。花色极其丰富。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 15, suitablePot: "3加仑盆", minTemp: 0,
  },

  // ==================== 食用菌 mushroom (4) ====================
  {
    id: "king-oyster", name: "杏鲍菇", scientificName: "Pleurotus eryngii", category: "mushroom", difficulty: "easy",
    season: ["秋","冬"], sunlight: "shade", water: "high", harvestDays: 20,
    description: "<p>杏鲍菇肉质肥厚、口感如鲍鱼，是菌菇中的高档货。阳台用菌包培养非常简单，20天就能收获，一个菌包能出2-3茬。</p>",
    tips: "<p>1. 菌包开袋后每天喷水保湿<br>2. 温度15-20℃最适合出菇<br>3. 菌盖直径3-5cm时采收口感最佳<br>4. 采后继续保湿可出下一茬</p>",
    balconyFit: "<p>北向阳台或室内阴凉处。需高湿度，放在加湿器旁效果好。</p>",
    suitableOrientations: ["north"], minPotDepth: 10, suitablePot: "菌包直接培养", minTemp: 12,
  },
  {
    id: "straw-mushroom", name: "草菇", scientificName: "Volvariella volvacea", category: "mushroom", difficulty: "medium",
    season: ["夏"], sunlight: "shade", water: "high", harvestDays: 10,
    description: "<p>草菇是岭南人最爱的菌菇之一，伞盖未开时像一颗黑色小蛋，鲜嫩爽滑。需要较高温度才能出菇，是夏天专属的美味。</p>",
    tips: "<p>1. 需要28-35℃高温才能出菇<br>2. 湿度保持85%以上<br>3. 菌蛋未开伞时采收品质最佳<br>4. 夏季培养10天即可采收</p>",
    balconyFit: "<p>北向阳台，夏季高温时最适合。需要频繁喷水保湿。</p>",
    suitableOrientations: ["north"], minPotDepth: 10, suitablePot: "菌包培养+保湿罩", minTemp: 25,
  },
  {
    id: "wood-ear", name: "木耳", scientificName: "Auricularia auricula-judae", category: "mushroom", difficulty: "easy",
    season: ["春","秋"], sunlight: "shade", water: "high", harvestDays: 25,
    description: "<p>木耳口感脆嫩，凉拌热炒皆宜。阳台用菌包培养，看着一朵朵黑褐色的耳朵从菌包里冒出来，收获的乐趣比吃还要满足。</p>",
    tips: "<p>1. 菌包开袋后划口出耳<br>2. 每天喷水3-5次保湿<br>3. 散射光即可，不需要直射光<br>4. 耳片展开后及时采收</p>",
    balconyFit: "<p>北向阳台或卫生间窗边。喜高湿，常喷雾长得快。</p>",
    suitableOrientations: ["north"], minPotDepth: 8, suitablePot: "菌包悬挂或平放培养", minTemp: 15,
  },
  {
    id: "tremella", name: "银耳", scientificName: "Tremella fuciformis", category: "mushroom", difficulty: "hard",
    season: ["秋"], sunlight: "shade", water: "high", harvestDays: 30,
    description: "<p>银耳是滋补养颜的圣品，晶莹剔透如白牡丹。阳台栽培有一定挑战性但成就感爆棚，一朵就能炖一锅红枣银耳羹。</p>",
    tips: "<p>1. 需要菌包培养，温湿度要求严格<br>2. 温度20-25℃、湿度90%以上<br>3. 每天喷雾4-6次或用加湿器<br>4. 银耳充分展开成菊花状时采收</p>",
    balconyFit: "<p>北向阳台+加湿器。需要精心管理温湿度，但颜值极高。</p>",
    suitableOrientations: ["north"], minPotDepth: 10, suitablePot: "菌包+透明保湿罩", minTemp: 18,
  },

  // ==================== 观叶 foliage (4) ====================
  {
    id: "peace-lily", name: "白掌", scientificName: "Spathiphyllum wallisii", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>白掌是室内净化空气的冠军植物，深绿色的叶片四季常绿，白色佛焰苞像一艘艘小白帆漂在绿叶中。耐阴好养，是新手首选。</p>",
    tips: "<p>1. 喜散射光，暴晒会黄叶<br>2. 叶片稍微发软下垂时再浇水<br>3. 经常喷雾清洁叶片<br>4. 花期长，单朵花可开一个月</p>",
    balconyFit: "<p>东向或北向阳台。极耐阴，也可室内养护。净化空气小能手。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 15, suitablePot: "2加仑盆", minTemp: 10,
  },
  {
    id: "areca-palm", name: "散尾葵", scientificName: "Dypsis lutescens", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>散尾葵是打造阳台热带风情的利器，羽毛状的复叶轻盈飘逸，一棵就能撑起一片度假氛围。也是优秀的室内空气净化器。</p>",
    tips: "<p>1. 喜明亮散射光，忌暴晒<br>2. 保持盆土湿润但不积水<br>3. 经常向叶片喷水增加湿度<br>4. 春季修剪枯黄老叶促新叶</p>",
    balconyFit: "<p>东向或南向阳台半阴处。植株较大，适合有空间的阳台。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 25, suitablePot: "5加仑以上大盆", minTemp: 8,
  },
  {
    id: "happiness-tree", name: "幸福树", scientificName: "Radermachera sinica", category: "foliage", difficulty: "easy",
    season: ["春","夏","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>幸福树寓意家庭美满幸福，是中式家居的经典绿植。羽状复叶郁郁葱葱，新叶嫩绿如翡翠，管理简单长势旺盛。</p>",
    tips: "<p>1. 喜明亮散射光，也能耐半阴<br>2. 见干见湿浇水，怕积水<br>3. 喜欢温暖湿润，冬季注意防寒<br>4. 春季修剪塑形</p>",
    balconyFit: "<p>东向或南向阳台散射光处。寓意好，适合送人自养。</p>",
    suitableOrientations: ["east","south"], minPotDepth: 25, suitablePot: "5加仑盆", minTemp: 5,
  },
  {
    id: "croton", name: "变叶木", scientificName: "Codiaeum variegatum", category: "foliage", difficulty: "medium",
    season: ["春","夏","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>变叶木是大自然的调色盘——同一棵植株上能同时看到红、黄、橙、绿、紫多种颜色。光照越好色彩越艳丽，一盆就能点亮整个阳台。</p>",
    tips: "<p>1. 全日照色彩最艳丽，半阴也能生长<br>2. 喜湿润，叶片常喷雾<br>3. 怕寒冷，冬季保持15℃以上<br>4. 春季修剪促分枝</p>",
    balconyFit: "<p>南向阳台光照充足处。色彩之王，一颗就能撑起阳台颜值。</p>",
    suitableOrientations: ["south","west"], minPotDepth: 20, suitablePot: "3加仑盆", minTemp: 15,
  },

  // ==================== 花卉 flower (4) ====================
  {
    id: "camellia", name: "山茶花", scientificName: "Camellia japonica", category: "flower", difficulty: "medium",
    season: ["春","秋"], sunlight: "partial", water: "medium", harvestDays: 0,
    description: "<p>山茶花是中国传统十大名花之一，冬春开花、花大如碗、层层叠叠。品种繁多从纯白到深红，是阳台上的名门闺秀。</p>",
    tips: "<p>1. 喜酸性土，用山泥或松针土<br>2. 喜半阴湿润，怕西晒<br>3. 花蕾期疏蕾，每枝留1-2朵<br>4. 浇水用雨水或放置过的自来水</p>",
    balconyFit: "<p>东向阳台最佳，忌西晒。需要酸性土壤和稳定湿度。</p>",
    suitableOrientations: ["east","north"], minPotDepth: 25, suitablePot: "5加仑陶盆", minTemp: -5,
  },
  {
    id: "osmanthus", name: "桂花", scientificName: "Osmanthus fragrans", category: "flower", difficulty: "medium",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>桂花是中国人最爱的香花之一，秋天开花时满阳台都是甜而不腻的桂花香。四季桂品种还能多次开花，一盆香一年。</p>",
    tips: "<p>1. 选四季桂矮生品种适合盆栽<br>2. 全日照开花更多更香<br>3. 喜酸性土，怕盐碱<br>4. 花后可采摘做桂花蜜、桂花糕</p>",
    balconyFit: "<p>南向阳台。一棵桂花树就是一瓶天然香水。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "7加仑以上大盆", minTemp: -5,
  },
  {
    id: "michelia", name: "白兰花", scientificName: "Michelia alba", category: "flower", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>白兰花是江南夏天最熟悉的香气，洁白如玉的小花藏在绿叶间，摘下几朵放在床头或胸前，清香能持续一整天。</p>",
    tips: "<p>1. 喜温暖湿润，怕霜冻<br>2. 全日照或半日照均可<br>3. 春季修剪控高，适合盆栽<br>4. 冬季室内越冬或套袋防护</p>",
    balconyFit: "<p>南向阳台，冬季需要防寒。花香迷人，值得用心呵护。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 30, suitablePot: "7加仑大盆", minTemp: 5,
  },
  {
    id: "wintersweet", name: "腊梅", scientificName: "Chimonanthus praecox", category: "flower", difficulty: "easy",
    season: ["秋","春"], sunlight: "full", water: "low", harvestDays: 0,
    description: "<p>腊梅是最有骨气的花——寒冬腊月百花凋零时，它独自绽放出蜡黄色的花朵，香气凛冽清透，几枝插瓶满室生香。</p>",
    tips: "<p>1. 选矮生品种或通过修剪控高<br>2. 耐旱怕涝，干透再浇<br>3. 花后重剪促分枝<br>4. 冬季开花需要低温刺激</p>",
    balconyFit: "<p>南向阳台。极耐寒耐旱，冬季阳台上的一抹亮色和清香。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "7加仑深盆", minTemp: -15,
  },

  // ==================== 水果 fruit (3) ====================
  {
    id: "guava", name: "番石榴", scientificName: "Psidium guajava", category: "fruit", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>番石榴（芭乐）是热带水果中的维生素C之王，果肉脆甜香气独特。矮化品种盆栽也能开花结果，叶片揉搓后有特殊清香。</p>",
    tips: "<p>1. 选矮化嫁接苗，容易盆栽开花<br>2. 全日照结果多<br>3. 果实坐果后套袋防虫<br>4. 冬季防寒，保持10℃以上</p>",
    balconyFit: "<p>南向阳台，需要充足光照和温暖环境。北方冬季需室内越冬。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "10加仑大盆", minTemp: 10,
  },
  {
    id: "wampee", name: "黄皮", scientificName: "Clausena lansium", category: "fruit", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>黄皮是岭南特色水果，果皮金黄果肉酸甜，有消食化痰的功效。矮化品种树形优美四季常绿，春看花夏品果，是阳台上的岭南味道。</p>",
    tips: "<p>1. 选矮化嫁接苗，3-5年可结果<br>2. 全日照果实更甜<br>3. 果实转金黄色时采收<br>4. 春季修剪控高</p>",
    balconyFit: "<p>南向阳台，需大盆和充足光照。适合南方地区种植。</p>",
    suitableOrientations: ["south"], minPotDepth: 35, suitablePot: "10加仑以上大盆", minTemp: 5,
  },
  {
    id: "sapodilla", name: "人心果", scientificName: "Manilkara zapota", category: "fruit", difficulty: "medium",
    season: ["春"], sunlight: "full", water: "medium", harvestDays: 0,
    description: "<p>人心果是热带珍稀水果，果实外形像猕猴桃但果肉如蜜糖般甜糯。矮化品种四季常绿，花和果能同时挂在树上，观赏价值极高。</p>",
    tips: "<p>1. 选嫁接苗，盆栽也能开花结果<br>2. 全日照果实更甜<br>3. 果实变软时采收食用<br>4. 耐盐碱土，管理粗放</p>",
    balconyFit: "<p>南向阳台，需要温暖环境。四季常绿+花果同树=高颜值。</p>",
    suitableOrientations: ["south"], minPotDepth: 30, suitablePot: "10加仑大盆", minTemp: 10,
  },

  // ==================== 香草 herb (2) ====================
  {
    id: "mugwort", name: "艾草", scientificName: "Artemisia argyi", category: "herb", difficulty: "easy",
    season: ["春"], sunlight: "full", water: "low", harvestDays: 60,
    description: "<p>艾草是中国传统文化中的神草——端午挂艾驱邪、艾灸温经通络、艾叶做青团清香扑鼻。阳台种一盆，既是草药也是文化传承。</p>",
    tips: "<p>1. 播种或分株繁殖，极易成活<br>2. 耐旱耐贫瘠，管理粗放<br>3. 端午节前后采收药效最佳<br>4. 可晒干储存做艾灸或泡脚</p>",
    balconyFit: "<p>南向阳台最佳。极其耐旱耐热，种下基本不用管。</p>",
    suitableOrientations: ["south","west","east"], minPotDepth: 20, suitablePot: "3加仑盆", minTemp: -15,
  },
  {
    id: "schizonepeta", name: "荆芥", scientificName: "Schizonepeta tenuifolia", category: "herb", difficulty: "easy",
    season: ["春","秋"], sunlight: "full", water: "medium", harvestDays: 40,
    description: "<p>荆芥是北方人最爱的调味香草之一，独特的清凉辛香味是凉拌菜和捞面的灵魂。长得快、好管理，一盆能吃整个夏天。</p>",
    tips: "<p>1. 撒播即可，出苗后间苗至10cm<br>2. 喜光照充足，半阴也能生长<br>3. 摘心促分枝，越摘越旺<br>4. 开花后叶片变老，及时采摘</p>",
    balconyFit: "<p>南向或东向阳台。长势旺盛，一棵够一家人吃。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 15, suitablePot: "2加仑盆或长条盆", minTemp: 0,
  },

  // ==================== 蔬菜 vegetable (1) ====================
  {
    id: "tatsoi", name: "乌塌菜", scientificName: "Brassica rapa subsp. narinosa", category: "vegetable", difficulty: "easy",
    season: ["秋","冬"], sunlight: "partial", water: "medium", harvestDays: 40,
    description: "<p>乌塌菜是冬季菜园里的黑牡丹，墨绿色的叶片排列成完美的莲座形，颜值爆表还能吃。霜打过后更甜更糯，是冬天阳台上的颜值+美味担当。</p>",
    tips: "<p>1. 秋季播种，喜冷凉气候<br>2. 半日照即可，东向阳台也适合<br>3. 霜打后叶片更甜更糯<br>4. 掰外叶采收可持续吃到春天</p>",
    balconyFit: "<p>东向或南向阳台。冬季阳台上的颜值冠军，好看又好吃。</p>",
    suitableOrientations: ["south","east"], minPotDepth: 15, suitablePot: "2加仑盆或长条盆", minTemp: -5,
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
  let skipCount = 0;

  for (const plant of plants) {
    try {
      const checkRes = await fetch(`${CMS_API}/plants/${plant.id}`);
      const checkJson = await checkRes.json();

      if (checkJson.code === 0 && checkJson.data) {
        console.log(`  ⏭️  ${plant.name} (${plant.id}) — 已存在，跳过`);
        skipCount++;
        continue;
      }

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

  console.log(`\n🎉 完成！成功 ${okCount} 种，跳过 ${skipCount} 种，失败 ${failCount} 种`);
}

main().catch(console.error);
