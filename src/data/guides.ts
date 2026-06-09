export interface Guide {
  [key: string]: any;
  _id?: string;
  id: string;
  title: string;
  slug: string;
  category: string;
  description?: string;
  summary: string;
  content: string | string[];
  image?: string;
  imagePosition?: string;
  author: string;
  authorImage?: string;
  date: string;
  readTime: number;
  tags: string[];
  difficulty?: string;
  season?: string[];
  relatedPlants?: string[];
}

export interface GuideCategory {
  value: string;
  label: string;
  icon: string;
}

export const guideCategories: GuideCategory[] = [
  { value: "beginner", label: "新手入门", icon: "🌱" },
  { value: "seasonal", label: "时令种植", icon: "🌸" },
  { value: "diy", label: "DIY 造景", icon: "🔧" },
  { value: "advanced", label: "进阶技巧", icon: "🌿" },
];

export const guides: Guide[] = 
[
  {
    "_id": "6a1c585f2ff00cb3452b1dfd",
    "id": "5",
    "title": "用可乐瓶制作自动浇花器",
    "slug": "diy-watering",
    "summary": "出差旅行也不怕，简单DIY让你的植物自动喝水。",
    "coverImage": "/images/guides/diy-watering.jpg",
    "category": "diy",
    "readTime": 4,
    "author": "小园丁",
    "date": "2026-04-28",
    "tags": [
      "DIY",
      "自动浇灌",
      "节水"
    ],
    "content": [
      "## 为什么要DIY自动浇花器",
      "出差或旅游时，植物的浇水问题是很多花友的烦恼。用废弃塑料瓶制作简易自动浇花器，成本几乎为零，效果却很可靠。",
      "## 材料准备",
      "- 大号塑料瓶（1.5L或2L可乐瓶）\n- 棉绳或尼龙绳（约30cm）\n- 剪刀\n- 水",
      "## 制作步骤",
      "1. 将塑料瓶从中间剪开\n2. 瓶盖中心开一个小孔\n3. 将棉绳穿过瓶盖孔，在瓶内打结固定\n4. 将瓶口朝下插入下半部瓶中\n5. 上半部装土种植物，下半部装水\n6. 棉绳将水持续吸入土壤中",
      "## 使用提示",
      "这种方法适合中型盆栽，持续供水约5-7天。出行前测试一下吸水速度，根据植物需水量调整棉绳粗细。"
    ],
    "_createdAt": "2026-05-31T15:48:46.386Z",
    "_updatedAt": "2026-05-31T15:48:46.386Z"
  },
  {
    "_id": "6a1c585f2ff00cb3452b1dfc",
    "id": "4",
    "title": "病虫害防治——绿色方法大集合",
    "slug": "pest-control",
    "summary": "不用化学农药，用天然方法防治常见阳台植物病虫害。",
    "coverImage": "/images/guides/pest.jpg",
    "category": "technique",
    "readTime": 7,
    "author": "小园丁",
    "date": "2026-05-20",
    "tags": [
      "病虫害",
      "天然防治",
      "养护"
    ],
    "content": [
      "## 预防胜于治疗",
      "健康的植物不容易生病。保证充足光照、良好的通风、合理的浇水频率是预防病虫害的基础。",
      "## 常见虫害及天然防治",
      "**蚜虫**：用水流冲洗，或喷洒肥皂水（1升水+5ml液体肥皂）。引入瓢虫也是生物防治的好方法。\n\n**红蜘蛛**：喜欢干燥环境，经常喷水增加湿度即可预防。严重时用印楝油喷洒。\n\n**白粉虱**：黄色粘虫板非常有效。也可用大蒜水喷洒驱赶。\n\n**蜗牛/蛞蝓**：夜间人工捕捉，或撒蛋壳碎末形成物理屏障。",
      "## 常见病害及处理",
      "**白粉病**：剪除病叶，喷洒小苏打溶液（1升水+1勺小苏打+几滴洗洁精）。\n\n**根腐病**：通常由浇水过多引起。立即停止浇水，更换干燥透气土壤，修剪腐烂根系。\n\n**灰霉病**：加强通风，降低湿度，剪除病组织。可用肉桂粉撒在伤口处杀菌。"
    ],
    "_createdAt": "2026-05-31T15:48:46.386Z",
    "_updatedAt": "2026-05-31T15:48:46.386Z"
  },
  {
    "_id": "6a1c585f2ff00cb3452b1dfb",
    "id": "3",
    "title": "自制堆肥——厨余变黑金",
    "slug": "composting-guide",
    "summary": "用厨房剩菜果皮制作有机堆肥，省钱又环保。",
    "coverImage": "/images/guides/compost.jpg",
    "category": "diy",
    "readTime": 10,
    "author": "小园丁",
    "date": "2026-05-10",
    "tags": [
      "堆肥",
      "DIY",
      "环保"
    ],
    "content": [
      "## 为什么要自制堆肥",
      "厨余垃圾占家庭垃圾的很大比例，将其转化为有机堆肥不仅可以减少垃圾排放，还能为阳台植物提供免费的优质肥料。一石二鸟，何乐而不为？",
      "## 阳台堆肥方法（波卡西堆肥法）",
      "波卡西堆肥法是最适合阳台空间的堆肥方式。你需要：一个带龙头的密封桶、EM菌糠和厨余原料。\n\n步骤：\n1. 在桶底铺一层菌糠\n2. 放入厨余（切小块），每层撒少量菌糠\n3. 压实后密封，排出空气\n4. 每2-3天放一次液肥（稀释后直接浇花）\n5. 约2-4周后堆肥完成",
      "## 适合堆肥的厨余",
      "✔️ 果皮（香蕉皮富含钾）、\n✔️ 菜叶菜梗、\n✔️ 咖啡渣、茶渣（注意茶叶包要去除外包装）、\n✔️ 蛋壳（洗净晒干碾碎）、\n✔️ 枯枝落叶",
      "## 不适合堆肥的厨余",
      "❌ 肉类、鱼类、\n❌ 乳制品、\n❌ 油膩食物、\n❌ 带病斑的植物残体"
    ],
    "_createdAt": "2026-05-31T15:48:46.386Z",
    "_updatedAt": "2026-05-31T15:48:46.386Z"
  },
  {
    "_id": "6a1c585f2ff00cb3452b1dfa",
    "id": "2",
    "title": "春季阳台种植计划",
    "slug": "spring-planting",
    "summary": "春暖花开，盘点最适合春天播种的10种阳台植物。",
    "coverImage": "/images/guides/spring.jpg",
    "category": "seasonal",
    "readTime": 6,
    "author": "小园丁",
    "date": "2026-03-01",
    "tags": [
      "春季",
      "播种",
      "时令"
    ],
    "content": [
      "## 春季阳台种植正当时",
      "春季（3-5月）是阳台园艺的黄金季节。气温回升、日照增长，大多数植物都适合在这个时期播种或移栽。",
      "## 推荐种植清单",
      "1. 番茄：3-4月育苗，5月移栽，7月即可收获。\n2. 辣椒：3月室内育苗，稳定15℃以上后移出。\n3. 罗勒：4月直接播种，喜温暖，出苗快。\n4. 生菜：可分批播种，实现持续收获。\n5. 草莓：春季购买幼苗种植，当年可结果。\n6. 黄瓜：4月播种，需搭架攀爬。\n7. 四季豆：4月直播，生长迅速。\n8. 向日葵：3-4月播种，观赏性强。\n9. 薄荷：分株繁殖，极易成活。\n10. 薰衣草：3月播种，喜阳光充足。",
      "## 春季养护要点",
      "春季气温波动大，注意倒春寒。晴朗天气多开窗通风，促进植物光合作用。开始恢复施肥频率，春季是生长旺盛期。"
    ],
    "_createdAt": "2026-05-31T15:48:46.386Z",
    "_updatedAt": "2026-05-31T15:48:46.386Z"
  },
  {
    "_id": "6a1c585f2ff00cb3452b1df9",
    "id": "1",
    "title": "阳台种菜小白入门指南",
    "slug": "beginner-guide",
    "summary": "从零开始打造你的家庭小菜园，选盆、选土、选种，看这一篇就够了。",
    "coverImage": "/images/guides/beginner.jpg",
    "category": "beginner",
    "readTime": 8,
    "author": "小园丁",
    "date": "2026-04-15",
    "tags": [
      "入门",
      "选盆",
      "配土"
    ],
    "content": [
      "## 第一步：确定你的阳台条件",
      "在开始种植之前，你需要评估阳台的几个关键条件：光照时长、通风情况和可用空间。南向阳台光照最充足，适合大多数蔬菜和花卉；东向阳台有上午柔和的光线，适合绿叶蔬菜和喜半阴植物；北向阳台光照较少，适合耐阴植物如绿萝、蕨类。",
      "## 第二步：选择合适的容器",
      "容器选择遵循宁大勿小原则。一般叶菜类需要15-20cm深的盆，果菜类需要25-35cm深的盆。材质上推荐陶盆（透气好）或加仑盆（轻便耐用）。底部必须有排水孔，这是植物健康生长的关键。",
      "## 第三步：配制合适的土壤",
      "不要直接使用园土！推荐配方：泥炭土（40%）+ 珍珠岩（30%）+ 蛭石（30%），这种配比透气保水又轻盈。如果种植果菜类，可加入少量腐熟羊粪作为底肥。",
      "## 第四步：选择合适的种子/幼苗",
      "新手建议从种子育苗开始，但也可以直接购买幼苗降低难度。推荐入手：樱桃番茄、生菜、薄荷、小葱——这些植物对新手非常友好。",
      "## 第五步：日常养护要点",
      "浇水见干见湿，用手指插入土壤2cm感受湿度。施肥薄肥勤施，生长季每7-10天施一次液肥。及时关注病虫害，早发现早处理。"
    ],
    "_createdAt": "2026-05-31T15:48:46.386Z",
    "_updatedAt": "2026-05-31T15:48:46.386Z"
  },
  {
    "_id": "15a233946a26aa1d023a6c441d51f6e0",
    "id": "阳台微型月季精细化种植微型教程",
    "title": "阳台微型月季精细化种植微型教程",
    "slug": "阳台微型月季精细化种植微型教程",
    "summary": "",
    "category": "beginner",
    "readTime": 5,
    "author": "小园丁",
    "date": "2026-06-08",
    "tags": [
      "入门"
    ],
    "relatedPlants": [
      "rose"
    ],
    "content": "<h2 style=\"text-align: left;\">一、适宜种植季节</h2><p><strong>最佳定植：春季 3～4 月、秋季 9～10 月</strong></p><ol><li><p>春栽：气温稳定 12℃以上栽种，缓苗 7～10 天，当月即可孕育花苞，是全年成活率最高时段；</p></li><li><p>秋栽：9 月中下旬至 10 月上旬，避开高温暴晒，入冬前根系扎稳，次年早春快速复花；</p></li><li><p>夏季（6～8 月）不建议裸根移栽，仅可带原土盆换盆，高温易闷根枯萎；冬季气温低于 5℃禁止露天上盆，室内阳台可少量盆栽定植。</p></li></ol><h2 style=\"text-align: left;\">二、阳台朝向选择（优先级从高到低）</h2><ol><li><p><strong>南向阳台（首选）</strong>：全天日照充足，最适配微型月季，全年开花量最多、株型紧凑不易徒长；</p></li><li><p><strong>东南向阳台（次选）</strong>：上午 6～12 点直射光照，午后遮阴，夏季不易暴晒焦叶，适合怕高温品种；</p></li><li><p><strong>东向阳台</strong>：仅晨间 3～5 小时直射光，开花偏少，需精简分枝、少施肥；</p></li><li><p><strong>西向阳台</strong>：午后强光暴晒，夏季高温易灼伤花瓣，需正午拉薄纱遮阳；</p></li><li><p><strong>北向阳台（不推荐）</strong>：几乎无直射阳光，很难开花，仅能勉强维持植株存活。</p></li></ol><h2 style=\"text-align: left;\">三、精准光照时长要求（硬性数值）</h2><p>微型月季属于强喜光花卉，<strong>每日直射光照≥6 小时为开花及格线，7～8 小时为最佳光照时长</strong></p><ol><li><p>春秋凉爽季：尽量全天露天摆放，保证每日 7～8h 直射阳光；</p></li><li><p>夏季高温（气温＞30℃）：正午 11:30～15:00 遮光 2～3 小时，保留早、傍晚 4～5 小时直射光，避免叶片、花苞晒伤；</p></li><li><p>冬季低温：优先放在阳台采光最好位置，尽可能凑够每日 5 小时以上直射光，光照不足极易黄叶、落蕾、徒长细杆。</p></li></ol><blockquote><p>补充：长期光照＜4 小时 / 天，微型月季基本不开花，枝条细长倒伏。</p></blockquote><h2 style=\"text-align: left;\">四、精细化浇水频率（分季节，明确频次 + 浇水方法）</h2><p>遵循<strong>见干见湿、盆面土发白再浇透</strong>，以 12～18cm 常规阳台盆栽微型月季花盆为标准：</p><ol><li><p><strong>春季（3～5 月，气温 15～25℃）：2 天浇水 1 次</strong></p><p>盆土表层 2cm 干燥就浇，单次沿盆边缓慢浇灌，直到盆底流水即停；阴雨天气顺延至 3～4 天一次，雨天完全停水。</p></li><li><p><strong>夏季（6～8 月，气温＞28℃）：晴天每日 1 次</strong></p><p>早晚凉爽时段浇水（清晨 7 点前 / 傍晚 19 点后），正午严禁浇水；遇连续阴雨天 5～7 天补水 1 次，及时倒掉托盘积水防烂根。</p></li><li><p><strong>秋季（9～11 月，气温 12～24℃）：2～3 天 1 次</strong></p><p>降温后蒸发变慢，土干再浇，深秋临近入冬改为 3～4 天一次。</p></li><li><p><strong>冬季（12～次年 2 月，气温＜10℃）：7～10 天 1 次</strong></p><p>植株半休眠，需水量骤降，仅盆土完全干透后少量补水，保持土壤微润即可，严禁盆土积水。</p></li></ol><blockquote><p>禁忌：托盘积水超过 12 小时必烂根，每次浇水不留存积水。</p></blockquote><h2 style=\"text-align: left;\">五、配土与花盆选配（阳台必备）</h2><ol><li><p>花盆：选用口径 12～18cm 透气加仑盆 / 青山盆，底部带排水孔，一盆定植 1 株微型月季，花盆过大容易闷根；</p></li><li><p>营养土配方：泥炭土 5 份 + 珍珠岩 2 份 + 腐熟羊粪 2 份 + 园土 1 份，疏松透气、保肥不积水，杜绝纯园土黏重土。</p></li></ol><h2 style=\"text-align: left;\">六、施肥方案（配合花期，助力持续开花）</h2><ol><li><p>生长期（无花苞）：每隔 10 天一次稀薄均衡水溶肥；</p></li><li><p>孕蕾期（冒小花苞）：每隔 7 天一次磷钾肥（磷酸二氢钾 1:1000 兑水叶面 + 灌根）；</p></li><li><p>夏季高温＞32℃、冬季＜8℃停止追肥，避免烧根。</p></li></ol><h2 style=\"text-align: left;\">七、修剪与开花收获周期</h2><h3 style=\"text-align: left;\">1. 开花收获周期（全年多季重复开花）</h3><p>正常养护达标（光照、水肥合格）：<strong>从冒花苞到花朵完全开放约 25～35 天，单朵花期 5～10 天</strong>；</p><ul><li><p>春秋凉爽：花谢后修剪残花，28～35 天再次孕育下一茬花苞，一年可开 5～7 茬；</p></li><li><p>夏季高温：开花速度加快，20～25 天一茬，但单朵花花期缩短至 3～5 天；</p></li><li><p>冬季低温：生长停滞，多数品种停止开花，来年气温回升重新复花。</p></li></ul><h3 style=\"text-align: left;\">2. 花后修剪方法（促复花关键）</h3><p>花朵凋谢后，在残花往下第 2～3 组饱满叶片上方斜剪，剪掉细弱内膛枝、交叉枝，节省养分，快速萌发新花枝。</p><h2 style=\"text-align: left;\">八、阳台日常病虫害简易防治</h2><ol><li><p>高发虫害：红蜘蛛、蚜虫，每月晴天傍晚用清水喷淋叶片正反面预防；</p></li><li><p>病害：高温高湿易白粉病，阳台保证通风，不往叶片频繁喷水，发病后及时摘除病叶。</p></li></ol><p></p>",
    "status": "published",
    "_updatedAt": "2026-06-08T11:42:11.101Z",
    "_createdAt": "2026-06-08T11:40:13.654Z"
  },
  {
    "_id": "15a233946a2425ae018014527890d49f",
    "id": "小葱阳台种植全攻略（超量化版）",
    "title": "小葱阳台种植全攻略（超量化版）",
    "slug": "小葱阳台种植全攻略（超量化版）",
    "summary": "",
    "category": "beginner",
    "readTime": 5,
    "author": "小园丁",
    "date": "2026-06-06",
    "tags": [
      "入门"
    ],
    "content": "<p>小葱是阳台种植入门首选，生长速度快、病虫害少、可多次采收，几乎零失败。本教程所有参数均经过实际种植验证，全部量化可直接执行。</p><h2 style=\"text-align: left;\">一、最佳种植季节与阳台朝向</h2><h3 style=\"text-align: left;\">种植季节（全年可种，分最佳和次佳）</h3><ul><li><p><strong>黄金季节</strong>：春季（3-5 月）、秋季（9-11 月）</p><ul><li><p>温度 15-25℃，生长最快，口感最好</p></li><li><p>从种植到首次收获仅需 20-25 天</p></li></ul></li><li><p><strong>次佳季节</strong>：冬季（12-2 月，南方）、夏季（6-8 月，北方）</p><ul><li><p>南方冬季室内温度高于 10℃可正常生长，收获周期延长至 30-35 天</p></li><li><p>北方夏季需遮阴降温，避免 35℃以上高温灼伤叶片</p></li></ul></li><li><p><strong>不建议种植时段</strong>：南方 7-8 月高温期（易倒伏、口感辛辣发苦）</p></li></ul><h3 style=\"text-align: left;\">阳台朝向选择（优先级从高到低）</h3><ol><li><p><strong>南向阳台</strong>：★★★★★（完美）</p><ul><li><p>全天光照充足，无需额外补光</p></li><li><p>春秋季可露养，夏季中午适当遮阴即可</p></li></ul></li><li><p><strong>东向阳台</strong>：★★★★（优秀）</p><ul><li><p>上午有 3-5 小时柔和直射光，下午散射光</p></li><li><p>夏季无需遮阴，冬季生长稍慢</p></li></ul></li><li><p><strong>西向阳台</strong>：★★★（尚可）</p><ul><li><p>下午有 3-4 小时强烈直射光</p></li><li><p>夏季必须遮阴（14:00-17:00），否则叶片易焦枯</p></li></ul></li><li><p><strong>北向阳台</strong>：★★（勉强）</p><ul><li><p>几乎无直射光，只有散射光</p></li><li><p>必须使用补光灯（每天补光 10-12 小时），否则会徒长细弱</p></li></ul></li></ol><h2 style=\"text-align: left;\">二、核心生长参数（精确量化）</h2><h3 style=\"text-align: left;\">光照需求</h3><ul><li><p><strong>生长旺盛期</strong>：每天<strong>6-8 小时直射光</strong>（最低不能少于 4 小时）</p></li><li><p><strong>幼苗期</strong>：每天<strong>4-6 小时直射光</strong>，避免强光直射</p></li><li><p><strong>光照不足补救</strong>：使用全光谱 LED 补光灯，距离叶片 20-30 厘米，每天补光 8-10 小时</p></li><li><p><strong>光照过强处理</strong>：夏季中午 12:00-14:00 用遮阳网遮阴，透光率 50%</p></li></ul><h3 style=\"text-align: left;\">浇水频率与浇水量（最关键环节）</h3><p>小葱喜湿润但怕积水，严格按照季节和生长阶段浇水：&nbsp;&nbsp;&nbsp;&nbsp;</p><table style=\"min-width: 125px;\"><colgroup><col style=\"min-width: 25px;\"><col style=\"min-width: 25px;\"><col style=\"min-width: 25px;\"><col style=\"min-width: 25px;\"><col style=\"min-width: 25px;\"></colgroup><tbody><tr><th colspan=\"1\" rowspan=\"1\"><p>季节</p></th><th colspan=\"1\" rowspan=\"1\"><p>生长阶段</p></th><th colspan=\"1\" rowspan=\"1\"><p>浇水频率</p></th><th colspan=\"1\" rowspan=\"1\"><p>浇水量</p></th><th colspan=\"1\" rowspan=\"1\"><p>判断标准</p></th></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>春秋季</p></td><td colspan=\"1\" rowspan=\"1\"><p>播种 / 扦插后 7 天内</p></td><td colspan=\"1\" rowspan=\"1\"><p>每天 1 次</p></td><td colspan=\"1\" rowspan=\"1\"><p>浇透至盆底漏水</p></td><td colspan=\"1\" rowspan=\"1\"><p>保持土壤表面湿润</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>春秋季</p></td><td colspan=\"1\" rowspan=\"1\"><p>幼苗期（7-15 天）</p></td><td colspan=\"1\" rowspan=\"1\"><p>每 2 天 1 次</p></td><td colspan=\"1\" rowspan=\"1\"><p>浇透</p></td><td colspan=\"1\" rowspan=\"1\"><p>土壤表面下 1 厘米干燥即浇</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>春秋季</p></td><td colspan=\"1\" rowspan=\"1\"><p>生长旺盛期（15 天以上）</p></td><td colspan=\"1\" rowspan=\"1\"><p>每 3 天 1 次</p></td><td colspan=\"1\" rowspan=\"1\"><p>浇透</p></td><td colspan=\"1\" rowspan=\"1\"><p>土壤表面下 2 厘米干燥即浇</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>夏季</p></td><td colspan=\"1\" rowspan=\"1\"><p>全阶段</p></td><td colspan=\"1\" rowspan=\"1\"><p>每天 1 次（早晚各 1 次）</p></td><td colspan=\"1\" rowspan=\"1\"><p>半透</p></td><td colspan=\"1\" rowspan=\"1\"><p>避免中午浇水，防止烂根</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\"><p>冬季</p></td><td colspan=\"1\" rowspan=\"1\"><p>全阶段</p></td><td colspan=\"1\" rowspan=\"1\"><p>每 5-7 天 1 次</p></td><td colspan=\"1\" rowspan=\"1\"><p>半透</p></td><td colspan=\"1\" rowspan=\"1\"><p>选择晴天中午浇水，水温与室温一致</p></td></tr></tbody></table><p>&nbsp;<strong>重要提示</strong>：绝对不能积水！盆底必须有排水孔，托盘积水要及时倒掉。</p><h2 style=\"text-align: left;\">三、两种种植方法对比（推荐葱根扦插法）</h2><h3 style=\"text-align: left;\">方法一：葱根扦插法（新手首选，最快收获）</h3><ol><li><p><strong>材料准备</strong>：超市购买的新鲜小葱（带完整白色葱根和 1-2 厘米葱白）</p></li><li><p><strong>处理步骤</strong>：</p><ul><li><p>切下葱根部分，保留<strong>3-4 厘米葱白</strong>（不要切到生长点）</p></li><li><p>剪掉发黄枯萎的叶片，保留顶部 2-3 片绿叶</p></li><li><p>将葱根浸泡在清水中 2 小时，促进生根</p></li></ul></li><li><p><strong>种植</strong>：</p><ul><li><p>土壤挖 3-4 厘米深的坑，将葱根放入，覆土压实</p></li><li><p>株距 3-4 厘米，行距 5-6 厘米，一盆（直径 20 厘米）可种 15-20 株</p></li></ul></li><li><p><strong>首次收获时间</strong>：<strong>20-25 天</strong></p></li></ol><h3 style=\"text-align: left;\">方法二：种子播种法（适合长期种植）</h3><ol><li><p><strong>材料准备</strong>：新鲜小葱种子（保质期不超过 1 年）</p></li><li><p><strong>播种步骤</strong>：</p><ul><li><p>将种子均匀撒在土壤表面，覆盖 0.5 厘米厚的细土</p></li><li><p>用喷壶喷湿土壤，盖上保鲜膜保湿</p></li><li><p>温度 20-25℃时，<strong>5-7 天发芽</strong></p></li></ul></li><li><p><strong>间苗</strong>：</p><ul><li><p>幼苗长到 3-4 厘米高时间苗，保留株距 3-4 厘米</p></li><li><p>间下来的幼苗可以直接食用</p></li></ul></li><li><p><strong>首次收获时间</strong>：<strong>40-50 天</strong></p></li></ol><h2 style=\"text-align: left;\">四、土壤与容器要求</h2><h3 style=\"text-align: left;\">土壤</h3><ul><li><p><strong>最佳配方</strong>：园土：腐叶土：珍珠岩 = 3:2:1</p></li><li><p><strong>简易配方</strong>：购买通用营养土 + 10% 河沙（增加排水性）</p></li><li><p><strong>禁忌</strong>：使用纯园土（易板结）、未腐熟的有机肥（会烧根）</p></li></ul><h3 style=\"text-align: left;\">容器</h3><ul><li><p><strong>材质</strong>：塑料盆、陶盆、泡沫箱均可</p></li><li><p><strong>尺寸</strong>：深度至少 15 厘米，直径 20 厘米以上</p></li><li><p><strong>要求</strong>：底部必须有 3-4 个排水孔，孔径 0.5-1 厘米</p></li></ul><h2 style=\"text-align: left;\">五、施肥与病虫害防治</h2><h3 style=\"text-align: left;\">施肥</h3><ul><li><p><strong>基肥</strong>：种植前在土壤底部埋入少量腐熟的羊粪或鸡粪（每盆 50 克）</p></li><li><p><strong>追肥</strong>：</p><ul><li><p>生长旺盛期每 10 天施一次稀薄的氮肥（如尿素，浓度 0.1%）</p></li><li><p>或者每 15 天浇一次腐熟的淘米水（稀释 10 倍）</p></li></ul></li><li><p><strong>禁忌</strong>：收获前 7 天停止施肥</p></li></ul><h3 style=\"text-align: left;\">病虫害防治</h3><p>小葱病虫害极少，主要预防：</p><ul><li><p><strong>蚜虫</strong>：用肥皂水（1:500）喷洒叶片背面，每天 1 次，连续 3 天</p></li><li><p><strong>霜霉病</strong>：保持通风，避免叶片长时间湿润，发病初期用多菌灵（1:1000）喷洒</p></li><li><p><strong>潜叶蝇</strong>：及时摘除受害叶片，集中销毁</p></li></ul><h2 style=\"text-align: left;\">六、收获与后续管理</h2><h3 style=\"text-align: left;\">收获方法</h3><ul><li><p><strong>首次收获</strong>：当小葱长到 20-30 厘米高时，距离土壤表面<strong>2-3 厘米</strong>处用剪刀剪断</p></li><li><p><strong>多次收获</strong>：保留根部和生长点，每次收获后浇水并施一次薄肥</p></li><li><p><strong>收获周期</strong>：每<strong>15-20 天</strong>可收获一次，一盆小葱可持续收获<strong>3-4 个月</strong></p></li><li><p><strong>最后一次收获</strong>：当葱根开始老化、生长变慢时，连根拔起全部收获</p></li></ul><h3 style=\"text-align: left;\">后续管理</h3><ul><li><p>每次收获后及时清理黄叶和残叶</p></li><li><p>每 2 个月松一次土，增加土壤透气性</p></li><li><p>种植 6 个月后更换新土，避免土壤板结和养分耗尽</p></li></ul><h2 style=\"text-align: left;\">七、常见问题与解决方案</h2><ol><li><p><strong>小葱徒长细弱</strong>：光照不足，增加光照时间或使用补光灯</p></li><li><p><strong>叶片发黄</strong>：浇水过多（烂根）或浇水过少（干旱），调整浇水频率</p></li><li><p><strong>生长缓慢</strong>：温度过低或养分不足，提高温度或追施氮肥</p></li><li><p><strong>叶片尖端焦枯</strong>：光照过强或空气干燥，适当遮阴并向周围喷水增湿</p></li></ol><p></p>",
    "status": "published",
    "_updatedAt": "2026-06-07T06:58:49.863Z",
    "_createdAt": "2026-06-06T13:50:38.082Z"
  }
];
