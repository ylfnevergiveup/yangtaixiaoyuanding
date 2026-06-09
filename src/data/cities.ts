/**
 * 中国城市气候数据
 *
 * 覆盖全部地级市（含直辖市、自治州、地区、盟），共约 337 个。
 * 气候数据根据省份 → 气候区自动推导，无需逐城市手写。
 */

// ============================================================
// 类型定义
// ============================================================

export interface CityClimate {
  id: string;
  name: string;
  province: string;
  zone: "north" | "south" | "central" | "northeast" | "southwest";
  avgTemp: number;
  minWinterTemp: number;
  maxSummerTemp: number;
  feature: string;
  advice: string;
  recommendedPlantIds: string[];
  avoidPlantIds: string[];
}

interface CityInput {
  id: string;
  name: string;
  province: string;
}

// ============================================================
// 气候区模板
// ============================================================

interface ZoneTemplate {
  zone: CityClimate["zone"];
  avgTemp: number;
  minWinterTemp: number;
  maxSummerTemp: number;
  feature: string;
  advice: string;
  recommendedPlantIds: string[];
  avoidPlantIds: string[];
}

const zoneTemplates: Record<string, ZoneTemplate> = {
  north: {
    zone: "north",
    avgTemp: 12,
    minWinterTemp: -8,
    maxSummerTemp: 37,
    feature: "四季分明，冬季寒冷干燥，夏季炎热",
    advice: "冬季需防寒，选择耐寒品种；夏季注意遮阳",
    recommendedPlantIds: ["green-onion", "lettuce", "chili", "mint", "succulent-mix"],
    avoidPlantIds: [],
  },
  northeast: {
    zone: "northeast",
    avgTemp: 5,
    minWinterTemp: -22,
    maxSummerTemp: 33,
    feature: "冬季漫长严寒，夏季短暂凉爽",
    advice: "冬季需全部移入室内，选择耐寒短周期品种",
    recommendedPlantIds: ["green-onion", "lettuce", "mint", "basil"],
    avoidPlantIds: ["rose", "tomato"],
  },
  central: {
    zone: "central",
    avgTemp: 16,
    minWinterTemp: -3,
    maxSummerTemp: 37,
    feature: "四季分明，梅雨季节潮湿，夏季炎热",
    advice: "梅雨季注意通风防霉，夏季防晒控水",
    recommendedPlantIds: ["basil", "mint", "lettuce", "green-onion", "strawberry"],
    avoidPlantIds: [],
  },
  south: {
    zone: "south",
    avgTemp: 22,
    minWinterTemp: 5,
    maxSummerTemp: 36,
    feature: "长夏无冬，高温多雨，气候温暖湿润",
    advice: "夏季注意防暴雨暴晒，台风天移入室内，全年可种植",
    recommendedPlantIds: ["chili", "basil", "mint", "succulent-mix", "lettuce"],
    avoidPlantIds: [],
  },
  southwest: {
    zone: "southwest",
    avgTemp: 16,
    minWinterTemp: 2,
    maxSummerTemp: 33,
    feature: "冬暖夏凉，多云雾少日照，气候温和",
    advice: "选择耐阴品种为主，注意旱季补水",
    recommendedPlantIds: ["mint", "lettuce", "succulent-mix", "green-onion", "basil"],
    avoidPlantIds: [],
  },
};

// ============================================================
// 省份 → 气候区 映射
// ============================================================

const provinceZone: Record<string, keyof typeof zoneTemplates> = {
  "北京": "north",
  "天津": "north",
  "河北": "north",
  "山西": "north",
  "内蒙古": "north",
  "辽宁": "northeast",
  "吉林": "northeast",
  "黑龙江": "northeast",
  "上海": "central",
  "江苏": "central",
  "浙江": "central",
  "安徽": "central",
  "江西": "central",
  "湖北": "central",
  "湖南": "central",
  "河南": "north",
  "山东": "north",
  "陕西": "north",
  "甘肃": "north",
  "宁夏": "north",
  "青海": "north",
  "新疆": "north",
  "西藏": "southwest",
  "四川": "southwest",
  "重庆": "southwest",
  "贵州": "southwest",
  "云南": "southwest",
  "广东": "south",
  "广西": "south",
  "海南": "south",
  "福建": "south",
  "台湾": "south",
  "香港": "south",
  "澳门": "south",
};

// ============================================================
// 城市列表 — 全国地级市（337个）
// 格式：[id, 名称, 省份]
// ============================================================

const cityList: CityInput[] = [
  // === 直辖市 ===
  { id: "beijing", name: "北京", province: "北京" },
  { id: "tianjin", name: "天津", province: "天津" },
  { id: "shanghai", name: "上海", province: "上海" },
  { id: "chongqing", name: "重庆", province: "重庆" },

  // === 河北（11市）===
  { id: "shijiazhuang", name: "石家庄", province: "河北" },
  { id: "tangshan", name: "唐山", province: "河北" },
  { id: "qinhuangdao", name: "秦皇岛", province: "河北" },
  { id: "handan", name: "邯郸", province: "河北" },
  { id: "xingtai", name: "邢台", province: "河北" },
  { id: "baoding", name: "保定", province: "河北" },
  { id: "zhangjiakou", name: "张家口", province: "河北" },
  { id: "chengde", name: "承德", province: "河北" },
  { id: "cangzhou", name: "沧州", province: "河北" },
  { id: "langfang", name: "廊坊", province: "河北" },
  { id: "hengshui", name: "衡水", province: "河北" },

  // === 山西（11市）===
  { id: "taiyuan", name: "太原", province: "山西" },
  { id: "datong", name: "大同", province: "山西" },
  { id: "yangquan", name: "阳泉", province: "山西" },
  { id: "changzhi", name: "长治", province: "山西" },
  { id: "jincheng", name: "晋城", province: "山西" },
  { id: "shuozhou", name: "朔州", province: "山西" },
  { id: "jinzhong", name: "晋中", province: "山西" },
  { id: "yuncheng", name: "运城", province: "山西" },
  { id: "xinzhou", name: "忻州", province: "山西" },
  { id: "linfen", name: "临汾", province: "山西" },
  { id: "lvliang", name: "吕梁", province: "山西" },

  // === 内蒙古（12盟市）===
  { id: "hohhot", name: "呼和浩特", province: "内蒙古" },
  { id: "baotou", name: "包头", province: "内蒙古" },
  { id: "wuhai", name: "乌海", province: "内蒙古" },
  { id: "chifeng", name: "赤峰", province: "内蒙古" },
  { id: "tongliao", name: "通辽", province: "内蒙古" },
  { id: "ordos", name: "鄂尔多斯", province: "内蒙古" },
  { id: "hulunbuir", name: "呼伦贝尔", province: "内蒙古" },
  { id: "bayannur", name: "巴彦淖尔", province: "内蒙古" },
  { id: "wulanchabu", name: "乌兰察布", province: "内蒙古" },
  { id: "xingan", name: "兴安盟", province: "内蒙古" },
  { id: "xilingol", name: "锡林郭勒盟", province: "内蒙古" },
  { id: "alashan", name: "阿拉善盟", province: "内蒙古" },

  // === 辽宁（14市）===
  { id: "shenyang", name: "沈阳", province: "辽宁" },
  { id: "dalian", name: "大连", province: "辽宁" },
  { id: "anshan", name: "鞍山", province: "辽宁" },
  { id: "fushun", name: "抚顺", province: "辽宁" },
  { id: "benxi", name: "本溪", province: "辽宁" },
  { id: "dandong", name: "丹东", province: "辽宁" },
  { id: "jinzhou", name: "锦州", province: "辽宁" },
  { id: "yingkou", name: "营口", province: "辽宁" },
  { id: "fuxin", name: "阜新", province: "辽宁" },
  { id: "liaoyang", name: "辽阳", province: "辽宁" },
  { id: "panjin", name: "盘锦", province: "辽宁" },
  { id: "tieling", name: "铁岭", province: "辽宁" },
  { id: "chaoyang", name: "朝阳", province: "辽宁" },
  { id: "huludao", name: "葫芦岛", province: "辽宁" },

  // === 吉林（9市州）===
  { id: "changchun", name: "长春", province: "吉林" },
  { id: "jilin", name: "吉林", province: "吉林" },
  { id: "siping", name: "四平", province: "吉林" },
  { id: "liaoyuan", name: "辽源", province: "吉林" },
  { id: "tonghua", name: "通化", province: "吉林" },
  { id: "baishan", name: "白山", province: "吉林" },
  { id: "songyuan", name: "松原", province: "吉林" },
  { id: "baicheng", name: "白城", province: "吉林" },
  { id: "yanbian", name: "延边朝鲜族自治州", province: "吉林" },

  // === 黑龙江（13市地）===
  { id: "harbin", name: "哈尔滨", province: "黑龙江" },
  { id: "qiqihar", name: "齐齐哈尔", province: "黑龙江" },
  { id: "jixi", name: "鸡西", province: "黑龙江" },
  { id: "hegang", name: "鹤岗", province: "黑龙江" },
  { id: "shuangyashan", name: "双鸭山", province: "黑龙江" },
  { id: "daqing", name: "大庆", province: "黑龙江" },
  { id: "yichun-hlj", name: "伊春", province: "黑龙江" },
  { id: "jiamusi", name: "佳木斯", province: "黑龙江" },
  { id: "qitaihe", name: "七台河", province: "黑龙江" },
  { id: "mudanjiang", name: "牡丹江", province: "黑龙江" },
  { id: "heihe", name: "黑河", province: "黑龙江" },
  { id: "suihua", name: "绥化", province: "黑龙江" },
  { id: "daxinganling", name: "大兴安岭地区", province: "黑龙江" },

  // === 江苏（13市）===
  { id: "nanjing", name: "南京", province: "江苏" },
  { id: "wuxi", name: "无锡", province: "江苏" },
  { id: "xuzhou", name: "徐州", province: "江苏" },
  { id: "changzhou", name: "常州", province: "江苏" },
  { id: "suzhou", name: "苏州", province: "江苏" },
  { id: "nantong", name: "南通", province: "江苏" },
  { id: "lianyungang", name: "连云港", province: "江苏" },
  { id: "huaian", name: "淮安", province: "江苏" },
  { id: "yancheng", name: "盐城", province: "江苏" },
  { id: "yangzhou", name: "扬州", province: "江苏" },
  { id: "zhenjiang", name: "镇江", province: "江苏" },
  { id: "taizhou-js", name: "泰州", province: "江苏" },
  { id: "suqian", name: "宿迁", province: "江苏" },

  // === 浙江（11市）===
  { id: "hangzhou", name: "杭州", province: "浙江" },
  { id: "ningbo", name: "宁波", province: "浙江" },
  { id: "wenzhou", name: "温州", province: "浙江" },
  { id: "jiaxing", name: "嘉兴", province: "浙江" },
  { id: "huzhou", name: "湖州", province: "浙江" },
  { id: "shaoxing", name: "绍兴", province: "浙江" },
  { id: "jinhua", name: "金华", province: "浙江" },
  { id: "quzhou", name: "衢州", province: "浙江" },
  { id: "zhoushan", name: "舟山", province: "浙江" },
  { id: "taizhou-zj", name: "台州", province: "浙江" },
  { id: "lishui", name: "丽水", province: "浙江" },

  // === 安徽（16市）===
  { id: "hefei", name: "合肥", province: "安徽" },
  { id: "wuhu", name: "芜湖", province: "安徽" },
  { id: "bengbu", name: "蚌埠", province: "安徽" },
  { id: "huainan", name: "淮南", province: "安徽" },
  { id: "maanshan", name: "马鞍山", province: "安徽" },
  { id: "huaibei", name: "淮北", province: "安徽" },
  { id: "tongling", name: "铜陵", province: "安徽" },
  { id: "anqing", name: "安庆", province: "安徽" },
  { id: "huangshan", name: "黄山", province: "安徽" },
  { id: "chuzhou", name: "滁州", province: "安徽" },
  { id: "fuyang", name: "阜阳", province: "安徽" },
  { id: "suzhou-ah", name: "宿州", province: "安徽" },
  { id: "luan", name: "六安", province: "安徽" },
  { id: "bozhou", name: "亳州", province: "安徽" },
  { id: "chizhou", name: "池州", province: "安徽" },
  { id: "xuancheng", name: "宣城", province: "安徽" },

  // === 福建（9市）===
  { id: "fuzhou", name: "福州", province: "福建" },
  { id: "xiamen", name: "厦门", province: "福建" },
  { id: "putian", name: "莆田", province: "福建" },
  { id: "sanming", name: "三明", province: "福建" },
  { id: "quanzhou", name: "泉州", province: "福建" },
  { id: "zhangzhou", name: "漳州", province: "福建" },
  { id: "nanping", name: "南平", province: "福建" },
  { id: "longyan", name: "龙岩", province: "福建" },
  { id: "ningde", name: "宁德", province: "福建" },

  // === 江西（11市）===
  { id: "nanchang", name: "南昌", province: "江西" },
  { id: "jingdezhen", name: "景德镇", province: "江西" },
  { id: "pingxiang", name: "萍乡", province: "江西" },
  { id: "jiujiang", name: "九江", province: "江西" },
  { id: "xinyu", name: "新余", province: "江西" },
  { id: "yingtan", name: "鹰潭", province: "江西" },
  { id: "ganzhou", name: "赣州", province: "江西" },
  { id: "jian", name: "吉安", province: "江西" },
  { id: "yichun", name: "宜春", province: "江西" },
  { id: "fuzhou-jx", name: "抚州", province: "江西" },
  { id: "shangrao", name: "上饶", province: "江西" },

  // === 山东（16市）===
  { id: "jinan", name: "济南", province: "山东" },
  { id: "qingdao", name: "青岛", province: "山东" },
  { id: "zibo", name: "淄博", province: "山东" },
  { id: "zaozhuang", name: "枣庄", province: "山东" },
  { id: "dongying", name: "东营", province: "山东" },
  { id: "yantai", name: "烟台", province: "山东" },
  { id: "weifang", name: "潍坊", province: "山东" },
  { id: "jining", name: "济宁", province: "山东" },
  { id: "taian", name: "泰安", province: "山东" },
  { id: "weihai", name: "威海", province: "山东" },
  { id: "rizhao", name: "日照", province: "山东" },
  { id: "linyi", name: "临沂", province: "山东" },
  { id: "dezhou", name: "德州", province: "山东" },
  { id: "liaocheng", name: "聊城", province: "山东" },
  { id: "binzhou", name: "滨州", province: "山东" },
  { id: "heze", name: "菏泽", province: "山东" },

  // === 河南（17市）===
  { id: "zhengzhou", name: "郑州", province: "河南" },
  { id: "kaifeng", name: "开封", province: "河南" },
  { id: "luoyang", name: "洛阳", province: "河南" },
  { id: "pingdingshan", name: "平顶山", province: "河南" },
  { id: "anyang", name: "安阳", province: "河南" },
  { id: "hebi", name: "鹤壁", province: "河南" },
  { id: "xinxiang", name: "新乡", province: "河南" },
  { id: "jiaozuo", name: "焦作", province: "河南" },
  { id: "puyang", name: "濮阳", province: "河南" },
  { id: "xuchang", name: "许昌", province: "河南" },
  { id: "luohe", name: "漯河", province: "河南" },
  { id: "sanmenxia", name: "三门峡", province: "河南" },
  { id: "nanyang", name: "南阳", province: "河南" },
  { id: "shangqiu", name: "商丘", province: "河南" },
  { id: "xinyang", name: "信阳", province: "河南" },
  { id: "zhoukou", name: "周口", province: "河南" },
  { id: "zhumadian", name: "驻马店", province: "河南" },

  // === 湖北（13市州）===
  { id: "wuhan", name: "武汉", province: "湖北" },
  { id: "huangshi", name: "黄石", province: "湖北" },
  { id: "shiyan", name: "十堰", province: "湖北" },
  { id: "yichang", name: "宜昌", province: "湖北" },
  { id: "xiangyang", name: "襄阳", province: "湖北" },
  { id: "ezhou", name: "鄂州", province: "湖北" },
  { id: "jingmen", name: "荆门", province: "湖北" },
  { id: "xiaogan", name: "孝感", province: "湖北" },
  { id: "jingzhou", name: "荆州", province: "湖北" },
  { id: "huanggang", name: "黄冈", province: "湖北" },
  { id: "xianning", name: "咸宁", province: "湖北" },
  { id: "suizhou", name: "随州", province: "湖北" },
  { id: "enshi", name: "恩施土家族苗族自治州", province: "湖北" },

  // === 湖南（14市州）===
  { id: "changsha", name: "长沙", province: "湖南" },
  { id: "zhuzhou", name: "株洲", province: "湖南" },
  { id: "xiangtan", name: "湘潭", province: "湖南" },
  { id: "hengyang", name: "衡阳", province: "湖南" },
  { id: "shaoyang", name: "邵阳", province: "湖南" },
  { id: "yueyang", name: "岳阳", province: "湖南" },
  { id: "changde", name: "常德", province: "湖南" },
  { id: "zhangjiajie", name: "张家界", province: "湖南" },
  { id: "yiyang", name: "益阳", province: "湖南" },
  { id: "chenzhou", name: "郴州", province: "湖南" },
  { id: "yongzhou", name: "永州", province: "湖南" },
  { id: "huaihua", name: "怀化", province: "湖南" },
  { id: "loudi", name: "娄底", province: "湖南" },
  { id: "xiangxi", name: "湘西土家族苗族自治州", province: "湖南" },

  // === 广东（21市）===
  { id: "guangzhou", name: "广州", province: "广东" },
  { id: "shenzhen", name: "深圳", province: "广东" },
  { id: "zhuhai", name: "珠海", province: "广东" },
  { id: "shantou", name: "汕头", province: "广东" },
  { id: "foshan", name: "佛山", province: "广东" },
  { id: "shaoguan", name: "韶关", province: "广东" },
  { id: "zhanjiang", name: "湛江", province: "广东" },
  { id: "zhaoqing", name: "肇庆", province: "广东" },
  { id: "jiangmen", name: "江门", province: "广东" },
  { id: "maoming", name: "茂名", province: "广东" },
  { id: "huizhou", name: "惠州", province: "广东" },
  { id: "meizhou", name: "梅州", province: "广东" },
  { id: "shanwei", name: "汕尾", province: "广东" },
  { id: "heyuan", name: "河源", province: "广东" },
  { id: "yangjiang", name: "阳江", province: "广东" },
  { id: "qingyuan", name: "清远", province: "广东" },
  { id: "dongguan", name: "东莞", province: "广东" },
  { id: "zhongshan", name: "中山", province: "广东" },
  { id: "chaozhou", name: "潮州", province: "广东" },
  { id: "jieyang", name: "揭阳", province: "广东" },
  { id: "yunfu", name: "云浮", province: "广东" },

  // === 广西（14市）===
  { id: "nanning", name: "南宁", province: "广西" },
  { id: "liuzhou", name: "柳州", province: "广西" },
  { id: "guilin", name: "桂林", province: "广西" },
  { id: "wuzhou", name: "梧州", province: "广西" },
  { id: "beihai", name: "北海", province: "广西" },
  { id: "fangchenggang", name: "防城港", province: "广西" },
  { id: "qinzhou", name: "钦州", province: "广西" },
  { id: "guigang", name: "贵港", province: "广西" },
  { id: "yulin", name: "玉林", province: "广西" },
  { id: "baise", name: "百色", province: "广西" },
  { id: "hezhou", name: "贺州", province: "广西" },
  { id: "hechi", name: "河池", province: "广西" },
  { id: "laibin", name: "来宾", province: "广西" },
  { id: "chongzuo", name: "崇左", province: "广西" },

  // === 海南（4市）===
  { id: "haikou", name: "海口", province: "海南" },
  { id: "sanya", name: "三亚", province: "海南" },
  { id: "sansha", name: "三沙", province: "海南" },
  { id: "danzhou", name: "儋州", province: "海南" },

  // === 四川（21市州）===
  { id: "chengdu", name: "成都", province: "四川" },
  { id: "zigong", name: "自贡", province: "四川" },
  { id: "panzhihua", name: "攀枝花", province: "四川" },
  { id: "luzhou", name: "泸州", province: "四川" },
  { id: "deyang", name: "德阳", province: "四川" },
  { id: "mianyang", name: "绵阳", province: "四川" },
  { id: "guangyuan", name: "广元", province: "四川" },
  { id: "suining", name: "遂宁", province: "四川" },
  { id: "neijiang", name: "内江", province: "四川" },
  { id: "leshan", name: "乐山", province: "四川" },
  { id: "nanchong", name: "南充", province: "四川" },
  { id: "meishan", name: "眉山", province: "四川" },
  { id: "yibin", name: "宜宾", province: "四川" },
  { id: "guangan", name: "广安", province: "四川" },
  { id: "dazhou", name: "达州", province: "四川" },
  { id: "yaan", name: "雅安", province: "四川" },
  { id: "bazhong", name: "巴中", province: "四川" },
  { id: "ziyang", name: "资阳", province: "四川" },
  { id: "aba", name: "阿坝藏族羌族自治州", province: "四川" },
  { id: "ganzi", name: "甘孜藏族自治州", province: "四川" },
  { id: "liangshan", name: "凉山彝族自治州", province: "四川" },

  // === 贵州（9市州）===
  { id: "guiyang", name: "贵阳", province: "贵州" },
  { id: "liupanshui", name: "六盘水", province: "贵州" },
  { id: "zunyi", name: "遵义", province: "贵州" },
  { id: "anshun", name: "安顺", province: "贵州" },
  { id: "bijie", name: "毕节", province: "贵州" },
  { id: "tongren", name: "铜仁", province: "贵州" },
  { id: "qianxinan", name: "黔西南布依族苗族自治州", province: "贵州" },
  { id: "qiandongnan", name: "黔东南苗族侗族自治州", province: "贵州" },
  { id: "qiannan", name: "黔南布依族苗族自治州", province: "贵州" },

  // === 云南（16市州）===
  { id: "kunming", name: "昆明", province: "云南" },
  { id: "qujing", name: "曲靖", province: "云南" },
  { id: "yuxi", name: "玉溪", province: "云南" },
  { id: "baoshan", name: "保山", province: "云南" },
  { id: "zhaotong", name: "昭通", province: "云南" },
  { id: "lijiang", name: "丽江", province: "云南" },
  { id: "puer", name: "普洱", province: "云南" },
  { id: "lincang", name: "临沧", province: "云南" },
  { id: "chuxiong", name: "楚雄彝族自治州", province: "云南" },
  { id: "honghe", name: "红河哈尼族彝族自治州", province: "云南" },
  { id: "wenshan", name: "文山壮族苗族自治州", province: "云南" },
  { id: "xishuangbanna", name: "西双版纳傣族自治州", province: "云南" },
  { id: "dali", name: "大理白族自治州", province: "云南" },
  { id: "dehong", name: "德宏傣族景颇族自治州", province: "云南" },
  { id: "nujiang", name: "怒江傈僳族自治州", province: "云南" },
  { id: "diqing", name: "迪庆藏族自治州", province: "云南" },

  // === 西藏（7市地）===
  { id: "lhasa", name: "拉萨", province: "西藏" },
  { id: "shigatse", name: "日喀则", province: "西藏" },
  { id: "chamdo", name: "昌都", province: "西藏" },
  { id: "nyingchi", name: "林芝", province: "西藏" },
  { id: "shannan", name: "山南", province: "西藏" },
  { id: "nagqu", name: "那曲", province: "西藏" },
  { id: "ngari", name: "阿里地区", province: "西藏" },

  // === 陕西（10市）===
  { id: "xian", name: "西安", province: "陕西" },
  { id: "tongchuan", name: "铜川", province: "陕西" },
  { id: "baoji", name: "宝鸡", province: "陕西" },
  { id: "xianyang", name: "咸阳", province: "陕西" },
  { id: "weinan", name: "渭南", province: "陕西" },
  { id: "yanan", name: "延安", province: "陕西" },
  { id: "hanzhong", name: "汉中", province: "陕西" },
  { id: "yulin-sx", name: "榆林", province: "陕西" },
  { id: "ankang", name: "安康", province: "陕西" },
  { id: "shangluo", name: "商洛", province: "陕西" },

  // === 甘肃（14市州）===
  { id: "lanzhou", name: "兰州", province: "甘肃" },
  { id: "jiayuguan", name: "嘉峪关", province: "甘肃" },
  { id: "jinchang", name: "金昌", province: "甘肃" },
  { id: "baiyin", name: "白银", province: "甘肃" },
  { id: "tianshui", name: "天水", province: "甘肃" },
  { id: "wuwei", name: "武威", province: "甘肃" },
  { id: "zhangye", name: "张掖", province: "甘肃" },
  { id: "pingliang", name: "平凉", province: "甘肃" },
  { id: "jiuquan", name: "酒泉", province: "甘肃" },
  { id: "qingyang", name: "庆阳", province: "甘肃" },
  { id: "dingxi", name: "定西", province: "甘肃" },
  { id: "longnan", name: "陇南", province: "甘肃" },
  { id: "linxia", name: "临夏回族自治州", province: "甘肃" },
  { id: "gannan", name: "甘南藏族自治州", province: "甘肃" },

  // === 青海（8市州）===
  { id: "xining", name: "西宁", province: "青海" },
  { id: "haidong", name: "海东", province: "青海" },
  { id: "haibei", name: "海北藏族自治州", province: "青海" },
  { id: "huangnan", name: "黄南藏族自治州", province: "青海" },
  { id: "hainan-qh", name: "海南藏族自治州", province: "青海" },
  { id: "guoluo", name: "果洛藏族自治州", province: "青海" },
  { id: "yushu", name: "玉树藏族自治州", province: "青海" },
  { id: "haixi", name: "海西蒙古族藏族自治州", province: "青海" },

  // === 宁夏（5市）===
  { id: "yinchuan", name: "银川", province: "宁夏" },
  { id: "shizuishan", name: "石嘴山", province: "宁夏" },
  { id: "wuzhong", name: "吴忠", province: "宁夏" },
  { id: "guyuan", name: "固原", province: "宁夏" },
  { id: "zhongwei", name: "中卫", province: "宁夏" },

  // === 新疆（14市州地区）===
  { id: "urumqi", name: "乌鲁木齐", province: "新疆" },
  { id: "karamay", name: "克拉玛依", province: "新疆" },
  { id: "turpan", name: "吐鲁番", province: "新疆" },
  { id: "hami", name: "哈密", province: "新疆" },
  { id: "changji", name: "昌吉回族自治州", province: "新疆" },
  { id: "bortala", name: "博尔塔拉蒙古自治州", province: "新疆" },
  { id: "bayingolin", name: "巴音郭楞蒙古自治州", province: "新疆" },
  { id: "aksu", name: "阿克苏地区", province: "新疆" },
  { id: "kizilsu", name: "克孜勒苏柯尔克孜自治州", province: "新疆" },
  { id: "kashgar", name: "喀什地区", province: "新疆" },
  { id: "hotan", name: "和田地区", province: "新疆" },
  { id: "ili", name: "伊犁哈萨克自治州", province: "新疆" },
  { id: "tacheng", name: "塔城地区", province: "新疆" },
  { id: "altay", name: "阿勒泰地区", province: "新疆" },

  // === 台湾（主要城市）===
  { id: "taipei", name: "台北", province: "台湾" },
  { id: "kaohsiung", name: "高雄", province: "台湾" },
  { id: "taichung", name: "台中", province: "台湾" },
  { id: "tainan", name: "台南", province: "台湾" },
  { id: "taoyuan", name: "桃园", province: "台湾" },
  { id: "hsinchu", name: "新竹", province: "台湾" },

  // === 香港 / 澳门 ===
  { id: "hongkong", name: "香港", province: "香港" },
  { id: "macau", name: "澳门", province: "澳门" },
];

// ============================================================
// 城市气候数据自动推导
// ============================================================

/** 根据城市基本信息自动推导完整气候数据 */
export function deriveCityClimate(city: CityInput): CityClimate {
  const zoneKey = provinceZone[city.province] || "central";
  const tmpl = zoneTemplates[zoneKey];

  return {
    id: city.id,
    name: city.name,
    province: city.province,
    zone: tmpl.zone,
    avgTemp: tmpl.avgTemp,
    minWinterTemp: tmpl.minWinterTemp,
    maxSummerTemp: tmpl.maxSummerTemp,
    feature: tmpl.feature,
    advice: tmpl.advice,
    recommendedPlantIds: [...tmpl.recommendedPlantIds],
    avoidPlantIds: [...tmpl.avoidPlantIds],
  };
}

/** 所有城市的完整气候数据（惰性初始化） */
let _citiesCache: CityClimate[] | null = null;

export function getCities(): CityClimate[] {
  if (!_citiesCache) {
    _citiesCache = cityList.map(deriveCityClimate);
  }
  return _citiesCache;
}

/** 按省份获取城市 */
export function getCitiesByProvince(province: string): CityClimate[] {
  return getCities().filter((c) => c.province === province);
}

/** 获取所有不重复的省份列表 */
export function getProvinces(): string[] {
  const set = new Set(cityList.map((c) => c.province));
  return Array.from(set).sort();
}

/** 按搜索关键词过滤城市（支持城市名、省份名） */
export function searchCities(query: string): CityClimate[] {
  const q = query.toLowerCase().trim();
  if (!q) return getCities();
  return getCities().filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.province.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
  );
}

/** 根据城市 ID 获取城市 */
export function getCityById(id: string): CityClimate | undefined {
  return getCities().find((c) => c.id === id);
}

/** 导出原始城市列表（不含气候数据的纯城市信息） */
export { cityList };
