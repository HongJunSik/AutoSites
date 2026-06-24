/* -------------------------------------------------------------
 * Game Logic for The Wellness Clinic Quiz (Duolingo Style - Firebase Version)
 * ------------------------------------------------------------- */

// ==========================================
// 1. FIREBASE CONFIGURATION (연동 설정)
// ==========================================
// USER: Firebase 프로젝트 설정 화면에서 발급받은 키 값을 입력하세요.
const FIREBASE_API_KEY = "AIzaSyBgDEZlR8cBGrCThJ52nGOFSp4R9Y6ixWw";
const FIREBASE_PROJECT_ID = "quiz-6ff07";
const FIREBASE_APP_ID = "1:728668843771:web:a71e710f9207087dc60a5e";

// 전역 Firestore 레퍼런스
let db = null;

// ==========================================
// 2. QUIZ DATA (더웰니스의원 문제 은행)
// ==========================================
const QUIZ_DATA = {
  // 1) 리팟레이저 (Reepot Laser)
  reepot: {
    title: "🎯 리팟레이저",
    subtitle: "VSLS 기술과 과냉각 시스템 기반의 혁신적인 흑자 및 색소 제거 치료",
    tag: "색소 치료",
    icon: "fa-sun",
    colorClass: "bg-wellness",
    tagClass: "tag-wellness",
    questions: [
      {
        id: "reepot_q1",
        type: "multiple-choice",
        question: "리팟레이저가 일반 색소 레이저와 비교했을 때, 흑자 치료에서 색소침착(PIH) 부작용을 획기적으로 낮추는 핵심 특허 기술은?",
        options: [
          "VSLS (혈관 폐쇄 및 주변 혈관 보호 기술)",
          "이산화탄소 가스 고압 주입 기술",
          "고주파 고온 미세 바늘 응축 시스템",
          "피코초 초음파 파쇄 기술"
        ],
        answer: "VSLS (혈관 폐쇄 및 주변 혈관 보호 기술)",
        explanation: "리팟레이저는 VSLS 기술을 통해 레이저 조사 시 주변 혈관을 일시적으로 수축/폐쇄하여, 시술 후 생기는 과색소 침착 부작용을 효과적으로 예방합니다."
      },
      {
        id: "reepot_q2",
        type: "fill-blank",
        sentence: "리팟레이저는 표피 온도를 항상 낮추어 피부 화상을 완벽히 방지하고 통증을 경감시키는 강력한 스마트 {blank} 시스템을 사용합니다.",
        options: ["접촉식 과냉각", "공기 진동 완화", "온열 피부 이완", "화학적 박피"],
        answer: "접촉식 과냉각",
        explanation: "접촉식 스마트 과냉각 설계를 통해 강한 레이저 에너지를 가하는 도중에도 피부 표면을 차갑게 보호합니다."
      },
      {
        id: "reepot_q3",
        type: "word-bank",
        question: "리팟레이저 시술 후 관리 방법으로 알맞게 문장을 완성하세요.",
        words: ["시술 후", "듀오덤 테이프를", "1~2주일 동안", "부착하는 것이", "중요합니다"],
        answer: ["시술 후", "듀오덤 테이프를", "1~2주일 동안", "부착하는 것이", "중요합니다"],
        explanation: "리팟 시술 이후 병원에서 부착해 준 특수 듀오덤 패치는 scab(딱지)이 완전히 탈락할 때까지 1~2주간 잘 유지해야 맑은 피부를 얻을 수 있습니다."
      },
      {
        id: "reepot_q4",
        type: "multiple-choice",
        question: "리팟레이저의 주 치료 대상에 해당하는 질환으로 가장 적절한 것은?",
        options: [
          "일광 흑자 (Solar Lentigo)",
          "화농성 여드름 (Acne Vulgaris)",
          "안면 홍조 (Rosacea)",
          "깊은 주름 (Deep Wrinkles)"
        ],
        answer: "일광 흑자 (Solar Lentigo)",
        explanation: "리팟레이저는 주로 일광 흑자(Solar Lentigo) 및 다양한 편평 색소 병변을 안전하고 강력하게 치료하는 데 최적화되어 있습니다."
      },
      {
        id: "reepot_q5",
        type: "fill-blank",
        sentence: "리팟레이저는 시술 중 피부에 정확히 밀착되어 적절한 압력을 가할 수 있도록 조절하는 스마트 {blank} 센서를 장착하여, 레이저 조사의 정확도를 높입니다.",
        options: ["압력 감지", "심박수 측정", "주름 인식", "모공 감지"],
        answer: "압력 감지",
        explanation: "스마트 압력 센서를 통해 피부에 팁이 정확한 압력으로 밀착되었을 때만 레이저가 조사되도록 안전하게 설계되었습니다."
      },
      {
        id: "reepot_q6",
        type: "multiple-choice",
        question: "리팟레이저 시술 직후 나타나는 일반적인 피부 반응과 거리가 먼 것은?",
        options: [
          "시술 부위가 일시적으로 붉어지거나 하얗게 변함",
          "딱지가 생겼다가 1~2주 내에 서서히 탈락함",
          "시술 부위가 영구적으로 함몰됨",
          "약간의 후끈거림이나 가벼운 통증"
        ],
        answer: "시술 부위가 영구적으로 함몰됨",
        explanation: "리팟레이저는 정상 피부 조직 손상을 최소화하므로 영구적 함몰 부작용은 거의 발생하지 않으며, 일시적 홍반이나 딱지 형성 후 새 살이 돋아납니다."
      },
      {
        id: "reepot_q7",
        type: "word-bank",
        question: "리팟레이저의 주요 장점에 대해 바르게 완성하세요.",
        words: ["단 1회 시술로도", "흑자 병변의", "대부분을", "완벽하게", "제거합니다"],
        answer: ["단 1회 시술로도", "흑자 병변의", "대부분을", "완벽하게", "제거합니다"],
        explanation: "리팟레이저는 강력한 에너지를 안전하게 조사할 수 있어, 보통 수회 이상 걸리던 흑자 치료를 단 1회 시술로도 뛰어난 효과를 보입니다."
      },
      {
        id: "reepot_q8",
        type: "multiple-choice",
        question: "리팟레이저 시술 후 정상적인 피부 재생을 돕고 자외선으로부터 피부를 보호하기 위해 가장 강조되는 홈케어 수칙은?",
        options: [
          "자외선 차단제를 꼼꼼히 바르고 직접적인 햇빛 노출을 피한다",
          "시술 당일부터 바로 딥클렌징과 스크럽을 강하게 한다",
          "피부 재생을 방해하므로 수분 크림을 절대 바르지 않는다",
          "매일 고농도 알코올 토너로 시술 부위를 소독한다"
        ],
        answer: "자외선 차단제를 꼼꼼히 바르고 직접적인 햇빛 노출을 피한다",
        explanation: "듀오덤 테이프 제거 후에는 붉은 기가 남아있을 수 있으므로 자외선 차단제를 철저히 발라 색소침착의 재발을 막아야 합니다."
      },
      {
        id: "reepot_q9",
        type: "fill-blank",
        sentence: "리팟레이저는 레이저 빔의 침투 깊이와 균일성을 보장하기 위해 빔 프로파일을 {blank} 형태로 조사하여 피부 표면에 일정한 에너지를 전달합니다.",
        options: ["플랫 탑 (Flat Top)", "가우시안 (Gaussian)", "스파이럴 (Spiral)", "체커보드 (Checkerboard)"],
        answer: "플랫 탑 (Flat Top)",
        explanation: "가운데가 뾰족하고 주변이 흐려지는 일반 빔과 달리, 에너지가 고르게 퍼지는 플랫 탑(Flat-Top) 형태의 빔 기술로 피부에 균일한 자극을 줍니다."
      },
      {
        id: "reepot_q10",
        type: "multiple-choice",
        question: "리팟레이저 시술 전 환자 상담 시 주의 깊게 확인해야 하는 사항으로 가장 적절한 것은?",
        options: [
          "최근 태닝 여부 및 광과민성 약물 복용력",
          "환자가 어제 저녁에 먹은 음식 종류",
          "평소 즐겨 입는 의류의 브랜드",
          "유산소 운동 시 선호하는 속도"
        ],
        answer: "최근 태닝 여부 및 광과민성 약물 복용력",
        explanation: "태닝을 하여 피부가 그을렸거나 광과민성 약물을 복용 중인 경우 부작용 발생 우려가 있으므로, 시술 일정을 조율해야 합니다."
      }
    ]
  },

  // 2) 쥬브젠 자가진피재생술 (Juvgen)
  juvgen: {
    title: "🧬 쥬브젠 자가진피재생술",
    subtitle: "특허받은 원리로 깊은 주름과 패인 흉터 하부에 피부 자체 콜라겐을 생성하는 시술",
    tag: "주름 & 흉터",
    icon: "fa-feather",
    colorClass: "bg-treatment",
    tagClass: "tag-treatment",
    questions: [
      {
        id: "juvgen_q1",
        type: "multiple-choice",
        question: "쥬브젠 자가진피재생술은 극미세 바늘을 통해 진피층의 콜라겐 생성을 물리적/화학적으로 촉진하기 위해 무엇을 교차 주입합니까?",
        options: [
          "이산화탄소(CO2) 가스와 히알루론산(HA) 용액",
          "보툴리눔 톡신과 인공 합성 필러 액",
          "고농도 생리식염수와 비타민 앰플 용액",
          "액체 질소 가스와 콜라겐 단백질 가루"
        ],
        answer: "이산화탄소(CO2) 가스와 히알루론산(HA) 용액",
        explanation: "극미량의 이산화탄소 가스와 히알루론산 성분을 순차적으로 교차 주입하여 진피 조직 내에 미세 상처를 내고 재생 유도를 극대화합니다."
      },
      {
        id: "juvgen_q2",
        type: "fill-blank",
        sentence: "쥬브젠 자가진피재생술은 단순히 인공물질을 채우는 필러와 달리, 내 피부의 {blank}을 직접 자가 형성하게 하므로 부작용이 적고 효과가 영구적입니다.",
        options: ["자가 콜라겐", "인공 콜라겐", "지방 세포", "근육 조직"],
        answer: "자가 콜라겐",
        explanation: "외부 인공 충전 물질에 기대지 않고, 내 진피층에 진짜 새 살(자가 콜라겐 섬유 조직)을 돋아오르게 하는 특허 주름 치료법입니다."
      },
      {
        id: "juvgen_q3",
        type: "multiple-choice",
        question: "다음 중 쥬브젠 자가진피재생술의 가장 핵심적인 치료 대상이 아닌 것은?",
        options: [
          "이마, 미간의 깊은 표정 고정 주름",
          "여드름이나 흉터로 깊게 패인 박스형 자국",
          "기미, 잡티 등 넓고 얕은 색소 병변",
          "수술 흉터나 사고로 깊게 패인 선상 흉터"
        ],
        answer: "기미, 잡티 등 넓고 얕은 색소 병변",
        explanation: "쥬브젠은 깊은 주름 및 패인 흉터를 진피 조직 재생을 통해 평평하게 메우는 데 탁월하지만, 겉 표면의 색소 및 잡티 제거에는 맞지 않습니다."
      },
      {
        id: "juvgen_q4",
        type: "multiple-choice",
        question: "쥬브젠 자가진피재생술 시술 후 세안과 화장은 언제부터 가능합니까?",
        options: [
          "시술 다음날부터 가볍게 가능합니다",
          "시술 후 최소 2주일간 불가합니다",
          "시술 직후 30분 이내에 강하게 문질러 씻어야 합니다",
          "피부 재생을 위해 한 달 동안 세안하지 않아야 합니다"
        ],
        answer: "시술 다음날부터 가볍게 가능합니다",
        explanation: "바늘 자국이 미세하므로 대개 시술 다음날부터 가벼운 물세안 및 메이크업이 가능하여 일상생활 복귀가 빠른 편입니다."
      },
      {
        id: "juvgen_q5",
        type: "fill-blank",
        sentence: "쥬브젠 자가진피재생술은 주름 바로 밑 진피층에 이산화탄소를 극미량씩 주입하여 극미세 물리적 공간(박리)을 만들고 여기에 {blank} 용액을 유입시켜 재생을 자극합니다.",
        options: ["히알루론산", "필러", "스테로이드", "비타민C"],
        answer: "히알루론산",
        explanation: "이산화탄소 가스로 진피조직을 물리적으로 떼어놓은 공간에 히알루론산을 유입시켜 자가 콜라겐 조직 형성을 유도합니다."
      },
      {
        id: "juvgen_q6",
        type: "multiple-choice",
        question: "쥬브젠 시술 후 흔히 나타날 수 있는 경과 중, 며칠 내에 자연스럽게 가라앉는 일시적 현상은?",
        options: [
          "미세한 멍과 붓기, 붉은 기",
          "영구 탈모와 시력 저하",
          "시술 부위의 영구적 전신 감각 마비",
          "피부 표면 전체의 영구 착색"
        ],
        answer: "미세한 멍과 붓기, 붉은 기",
        explanation: "바늘 주입 시술이므로 시술 직후 약간의 붓기나 멍, 붉은 기가 있을 수 있으나 대부분 수일 내에 자연스럽게 호전됩니다."
      },
      {
        id: "juvgen_q7",
        type: "word-bank",
        question: "쥬브젠 자가진피재생술의 작동 방식에 대해 바르게 조립하세요.",
        words: ["깊은 주름 하부에", "새로운 피부 조직을", "스스로 채워 넣어", "평평하게", "만들어줍니다"],
        answer: ["깊은 주름 하부에", "새로운 피부 조직을", "스스로 채워 넣어", "평평하게", "만들어줍니다"],
        explanation: "주름이나 흉터 부위 아래의 위축된 진피층에 자가 조직 재생을 일으켜 자연스럽고 매끄럽게 차오르게 합니다."
      },
      {
        id: "juvgen_q8",
        type: "multiple-choice",
        question: "쥬브젠 자가진피재생술은 한 번 돋아난 자가 콜라겐 조직의 수명이 반영구적이라고 합니다. 그 이유는 무엇일까요?",
        options: [
          "내 몸이 생성한 진짜 콜라겐 섬유 조직이기 때문에",
          "주입한 히알루론산이 평생 흡수되지 않기 때문에",
          "특수 금속 나노입자가 피부 속에 남아있기 때문에",
          "피부 신경을 완전히 파괴하여 고정하기 때문에"
        ],
        answer: "내 몸이 생성한 진짜 콜라겐 섬유 조직이기 때문에",
        explanation: "외부 물질로 일시적 부피를 주는 필러와 달리, 환자 본인의 진피 조직 세포가 생성한 콜라겐이므로 흡수되거나 사라지지 않고 유지됩니다."
      },
      {
        id: "juvgen_q9",
        type: "fill-blank",
        sentence: "쥬브젠 자가진피재생술은 아주 얇은 30G 내외의 {blank}을 활용하여 통증을 최소화하고 정교하게 타겟 주름 아래에 에너지를 조준합니다.",
        options: ["미세 바늘 (Micro-needle)", "고압 분사기", "메스 (칼)", "실리콘 카테터"],
        answer: "미세 바늘 (Micro-needle)",
        explanation: "특허받은 미세 바늘 가이드를 통해 주름의 깊은 부위에 이산화탄소 가스와 약물을 완벽하게 조절하여 주입합니다."
      },
      {
        id: "juvgen_q10",
        type: "multiple-choice",
        question: "다음 중 쥬브젠 자가진피재생술 시술을 받는 환자에게 안내해야 할 올바른 정보는?",
        options: [
          "시술 부위의 재생을 돕기 위해 시술 후 사우나, 음주 등은 1주일간 피해야 합니다",
          "시술 즉시 피부가 100% 완벽히 재생되며 사후 관리는 필요 없습니다",
          "시술 부위를 손가락으로 매일 10분간 세게 마사지해야 합니다",
          "시술 당일에 바로 사우나와 뜨거운 탕욕을 장시간 즐기면 좋습니다"
        ],
        answer: "시술 부위의 재생을 돕기 위해 시술 후 사우나, 음주 등은 1주일간 피해야 합니다",
        explanation: "주입된 성분들이 안정화되고 피부가 재생되는 기간 동안 사우나, 찜질방, 음주 등 열을 유발하는 활동은 1주일간 삼가는 것이 좋습니다."
      }
    ]
  },

  // 3) 울쎄라피프라임 (Ultherapy Prime)
  ulthera: {
    title: "⚡ 울쎄라피 프라임",
    subtitle: "실시간 초음파 모니터링 영상 기술을 더해 근막층을 정교하게 당기는 명품 리프팅",
    tag: "리프팅",
    icon: "fa-angles-up",
    colorClass: "bg-info",
    tagClass: "tag-info",
    questions: [
      {
        id: "ulthera_q1",
        type: "multiple-choice",
        question: "울쎄라 리프팅이 피부 처짐의 근본적인 원인을 조이기 위해 도달하는 가장 깊은 피부 구조층은?",
        options: [
          "SMAS (근막층)",
          "표피층",
          "각질층",
          "피하지방층"
        ],
        answer: "SMAS (근막층)",
        explanation: "울쎄라는 볼 처짐 및 이중턱의 주요 원인이 되는 4.5mm 깊이의 SMAS(근막층)까지 초음파 에너지를 전달하여 수축 효과를 냅니다."
      },
      {
        id: "ulthera_q2",
        type: "fill-blank",
        sentence: "울쎄라 시술 시 의료진이 환자의 표피, 진피, 지방층 깊이를 화면으로 직접 관찰하며 안전하게 쏠 수 있게 돕는 실시간 모니터링 기술 이름은 {blank} 입니다.",
        options: ["DeepSee", "AccuREP", "CoolingGas", "VSLS"],
        answer: "DeepSee",
        explanation: "실시간 초음파 시각화 기술인 DeepSee 특허 장치를 통해 신경선과 뼈 위치 등을 관찰하며 오차 없이 안전하게 타겟 조사가 가능합니다."
      },
      {
        id: "ulthera_q3",
        type: "word-bank",
        question: "울쎄라 리프팅이 작동하는 핵심 원리를 알맞은 문장으로 조합하세요.",
        words: ["고강도", "집속 초음파 에너지를", "원하는 깊이에", "정확하게", "전달합니다"],
        answer: ["고강도", "집속 초음파 에너지를", "원하는 깊이에", "정확하게", "전달합니다"],
        explanation: "고강도 집속 초음파(HIFU) 에너지를 돋보기처럼 모아 특정 깊이에만 열 응고점을 만들어 내는 원리로 리프팅을 진행합니다."
      },
      {
        id: "ulthera_q4",
        type: "multiple-choice",
        question: "울쎄라 시술 시 1.5mm, 3.0mm, 4.5mm 등 다양한 깊이에 에너지를 타겟팅할 수 있게 해주는 교체용 부품 명칭은 무엇입니까?",
        options: [
          "트랜스듀서 (팁)",
          "고주파 전극판",
          "과냉각 가스캔",
          "피코 카트리지"
        ],
        answer: "트랜스듀서 (팁)",
        explanation: "울쎄라는 피부 깊이에 따라 각각 다른 트랜스듀서(팁)를 사용하여 표피, 진피, 피하지방층 및 SMAS층을 선택적으로 맞춤 조사합니다."
      },
      {
        id: "ulthera_q5",
        type: "fill-blank",
        sentence: "울쎄라 리프팅은 피부 내부의 단백질 변성이 일어나는 약 {blank} ℃ 내외의 적정 열 손상 온도를 유도하여 새로운 콜라겐 합성을 촉진합니다.",
        options: ["60~70", "30~40", "90~100", "5~15"],
        answer: "60~70",
        explanation: "울쎄라는 단백질 수축과 신생 콜라겐 유도에 가장 효과적인 온도로 알려진 60~70도의 열을 타겟 부위에 정확하게 조사합니다."
      },
      {
        id: "ulthera_q6",
        type: "multiple-choice",
        question: "울쎄라 시술 직후와 시술 후 수개월에 걸친 리프팅 경과에 대한 설명으로 가장 옳은 것은?",
        options: [
          "시술 즉시 단백질 수축으로 탄력이 생기고, 이후 2~3개월에 걸쳐 점진적으로 리프팅 효과가 강화된다",
          "시술 직후에는 아무런 변화가 없으며 1년 뒤에 갑자기 살이 차오른다",
          "시술 당일 효과가 최대치에 도달한 뒤 점차 사라진다",
          "시술 후 1주일 내로 모든 피부 재생이 끝나고 원래대로 돌아간다"
        ],
        answer: "시술 즉시 단백질 수축으로 탄력이 생기고, 이후 2~3개월에 걸쳐 점진적으로 리프팅 효과가 강화된다",
        explanation: "울쎄라는 1차적으로 즉각적인 열 응고로 인한 탄력 개선이 있으며, 이후 2~6개월 동안 신생 콜라겐이 분비되어 얼굴 라인이 서서히 다듬어집니다."
      },
      {
        id: "ulthera_q7",
        type: "word-bank",
        question: "울쎄라의 특화된 리프팅 장점에 대한 올바른 설명을 맞추세요.",
        words: ["피부층을 실시간으로", "화면으로 관찰하며", "뼈나 신경선을", "피해서 안전하게", "시술합니다"],
        answer: ["피부층을 실시간으로", "화면으로 관찰하며", "뼈나 신경선을", "피해서 안전하게", "시술합니다"],
        explanation: "초음파 진단 화면을 보면서 시술하기 때문에 신경 자극이나 뼈 타격 등의 부작용을 최소화할 수 있습니다."
      },
      {
        id: "ulthera_q8",
        type: "multiple-choice",
        question: "일명 '울쎄라 부작용'으로 불리는 볼 패임 현상은 왜 발생하며, 이를 예방하려면 어떻게 해야 합니까?",
        options: [
          "지방층이 많은 부위에 깊은 팁을 강하게 잘못 쐈을 때 발생하므로, 정확한 실시간 모니터링 시술이 필수적이다",
          "모든 환자에게 무조건 발생하는 자연스러운 리프팅 과정이므로 예방할 수 없다",
          "피부가 너무 얇아서 생기는 현상이므로 무조건 가장 얕은 팁만 쏴야 한다",
          "레이저 강도가 너무 약해서 생기므로 무조건 높은 샷수로 시술한다"
        ],
        answer: "지방층이 많은 부위에 깊은 팁을 강하게 잘못 쐈을 때 발생하므로, 정확한 실시간 모니터링 시술이 필수적이다",
        explanation: "지방층이 위축될 수 있는 볼 주변 부위는 과도한 열 손상을 피하고 적합한 팁과 에너지를 사용하여 세심하게 모니터링하며 시술해야 합니다."
      },
      {
        id: "ulthera_q9",
        type: "fill-blank",
        sentence: "울쎄라는 정품 팁 사용이 매우 중요합니다. 울쎄라 공식 정품 팁으로 시술받았는지 확인하기 위해 시술 후 환자가 발급받을 수 있는 공식 {blank} 스티커(인증서)가 제공됩니다.",
        options: ["정품 인증", "품질 보증", "할인 쿠폰", "우수 고객"],
        answer: "정품 인증",
        explanation: "시술받은 정품 샷 수에 맞추어 제공되는 공식 정품 인증 스티커를 통해 정식 수입된 팁의 사용 여부를 쉽게 확인 가능합니다."
      },
      {
        id: "ulthera_q10",
        type: "multiple-choice",
        question: "울쎄라 시술 시 통증 관리를 위해 일반적으로 시행하는 방법 중 하나가 아닌 것은?",
        options: [
          "전신을 완전히 잠재우는 흡입 전신 마취 수술",
          "마취 크림 도포 및 대기",
          "의료진 처방에 따른 경구 진통제 복용",
          "수면 마취 (정맥 마취) 상태에서의 편안한 시술"
        ],
        answer: "전신을 완전히 잠재우는 흡입 전신 마취 수술",
        explanation: "울쎄라는 비수술적 리프팅 시술로 보통 연고 마취나 수면(정맥) 마취 등으로 조절하며, 수술실에서 사용하는 가스 전신 마취는 필요로 하지 않습니다."
      }
    ]
  },

  // 4) 써마지FLX (Thermage FLX)
  thermage: {
    title: "💖 써마지 FLX",
    subtitle: "단극성 고주파 열 에너지를 전달하여 느슨해진 콜라겐을 조이고 피부를 탄탄하게 만드는 타이트닝",
    tag: "타이트닝",
    icon: "fa-shield-heart",
    colorClass: "bg-info",
    tagClass: "tag-info",
    questions: [
      {
        id: "thermage_q1",
        type: "multiple-choice",
        question: "써마지 FLX가 진피 전체에 강력한 열 효과를 발생시키기 위해 방출하는 핵심 에너지는?",
        options: [
          "단극성 고주파 (Monopolar RF)",
          "양극성 고주파 (Bipolar RF)",
          "고강도 집속 초음파 (HIFU)",
          "피코초 엔디야그 레이저"
        ],
        answer: "단극성 고주파 (Monopolar RF)",
        explanation: "써마지 FLX는 6.78MHz의 단극성(Monopolar) 고주파 에너지를 사용하여 피부 밑 깊은 진피층 전체에 일관된 열을 발생시킵니다."
      },
      {
        id: "thermage_q2",
        type: "fill-blank",
        sentence: "써마지 FLX는 시술 중 매 샷마다 달라지는 환자 부위별 피부 전기 저항값(임피던스)을 자동 측정하여 에너지를 미세 조율하는 {blank} 알고리즘을 사용합니다.",
        options: ["AccuREP", "DeepSee", "AutoCooling", "VSLS"],
        answer: "AccuREP",
        explanation: "AccuREP(액큐랩) 기술이 매 샷 조사 직전 피부 저항값을 실시간 체크 및 조율하여 시술 강도의 편차와 화상 위험을 줄여줍니다."
      },
      {
        id: "thermage_q3",
        type: "multiple-choice",
        question: "다음 중 써마지 FLX 시술의 기대 효과와 가장 거리가 먼 것은 무엇일까요?",
        options: [
          "피부 진피층의 밀도 증가 및 스킨 타이트닝",
          "눈가 및 얼굴 전반의 미세 잔주름 개선",
          "비대해진 침샘과 턱 주변 근육의 볼륨 영구 축소",
          "콜라겐 수축을 통한 늘어진 피부 탄력 향상"
        ],
        answer: "비대해진 침샘과 턱 주변 근육의 볼륨 영구 축소",
        explanation: "써마지는 진피층 세포를 자극하여 콜라겐을 합성하고 쫀쫀하게 조이는 타이트닝 레이저입니다. 근육이나 침샘 부피의 축소는 보톡스 시술 영역에 속합니다."
      },
      {
        id: "thermage_q4",
        type: "multiple-choice",
        question: "써마지 FLX 시술 중 환자가 느끼는 뜨거운 열감을 줄이고 표피를 보호하기 위해 시술 도중 계속 작동하는 쿨링 방식은?",
        options: [
          "펄스형 극저온 액체 질소 가스 분사 쿨링 (진동 포함)",
          "에어컨 바람 노출 시스템",
          "시술 부위 얼음팩 직접 밀착 마취",
          "화학 재생 보습 겔 흡수"
        ],
        answer: "펄스형 극저온 액체 질소 가스 분사 쿨링 (진동 포함)",
        explanation: "써마지는 고주파 조사 전, 중, 후에 냉각 가스를 분사하고 팁이 진동을 발생시켜 통증 인지 경로를 교란함으로써 통증을 안전하게 경감합니다."
      },
      {
        id: "thermage_q5",
        type: "fill-blank",
        sentence: "써마지는 에너지가 흐르는 폐회로를 형성하기 위해 시술 전 환자의 등이나 대퇴부에 전도성 {blank} 패드를 부착하여 전류를 통과시킵니다.",
        options: ["접지 (Return)", "절연", "냉각", "보습"],
        answer: "접지 (Return)",
        explanation: "단극성(Monopolar) 고주파의 회로 구성을 위해 몸에 부착하는 대형 접지 패드가 필수적입니다."
      },
      {
        id: "thermage_q6",
        type: "multiple-choice",
        question: "다음 중 써마지 FLX 시술이 권장되는 피부 고민과 가장 적절한 매칭은?",
        options: [
          "모공이 넓어지고 피부 탄력이 저하되어 늘어진 얇은 피부",
          "짙은 기미와 주근깨가 많이 덮인 피부",
          "안면 뼈 비대칭으로 사각턱이 심한 얼굴",
          "화농성 여드름 흉터로 울퉁불퉁해진 피부 전체"
        ],
        answer: "모공이 넓어지고 피부 탄력이 저하되어 늘어진 얇은 피부",
        explanation: "써마지 고주파는 얇고 처진 피부의 타이트닝 및 잔주름 개선, 콜라겐 밀도 증대에 매우 탁월한 명품 안티에이징 시술입니다."
      },
      {
        id: "thermage_q7",
        type: "word-bank",
        question: "써마지 FLX의 스킨 타이트닝 작용에 대해 바르게 조립하세요.",
        words: ["늘어진 피부의", "콜라겐 섬유를", "열로 즉각 수축시켜", "피부 밀도를", "높여줍니다"],
        answer: ["늘어진 피부의", "콜라겐 섬유를", "열로 즉각 수축시켜", "피부 밀도를", "높여줍니다"],
        explanation: "고주파 열이 가해지면 즉각적으로 느슨해졌던 콜라겐 결합이 조여지며 스킨이 수축하고, 시간이 흐를수록 자가 콜라겐이 생성됩니다."
      },
      {
        id: "thermage_q8",
        type: "multiple-choice",
        question: "써마지 정품 팁은 일회용 의료기기입니다. 써마지 시술 시 주의해야 하는 불법 재생 팁 사용의 문제점이 아닌 것은?",
        options: [
          "재생 팁 사용 시 에너지가 균일하지 않아 화상 및 흉터 위험이 높다",
          "팁 표면 막이 훼손되어 전류 스파크가 튈 수 있다",
          "정품 인증 및 리워드 프로그램 혜택을 받을 수 없다",
          "팁의 가격이 비싸지므로 병원에서 시술비용을 더 비싸게 청구한다"
        ],
        answer: "팁의 가격이 비싸지므로 병원에서 시술비용을 더 비싸게 청구한다",
        explanation: "불법 재생 팁은 비정상적으로 단가를 낮추어 유통되나, 팁의 안전막 손상 등으로 불균일한 출력이 방출되어 심각한 부작용(화상 등)을 초래합니다."
      },
      {
        id: "thermage_q9",
        type: "fill-blank",
        sentence: "써마지 시술에는 페이스 팁 외에도 눈가 전용 주름 개선을 위한 0.25㎠ 크기의 작은 정품 {blank} 팁이 별도로 있어 정교한 눈가 리프팅이 가능합니다.",
        options: ["아이 (Eye)", "바디 (Body)", "토탈 (Total)", "얼티밋 (Ultimate)"],
        answer: "아이 (Eye)",
        explanation: "얇고 예민한 눈꺼풀 및 눈가 주변의 미세 주름에는 특별히 설계된 써마지 아이(Eye) 팁을 사용하여 치료합니다."
      },
      {
        id: "thermage_q10",
        type: "multiple-choice",
        question: "써마지 FLX 시술 후 일시적인 홍반(붉어짐)과 미세 부종(부기)은 보통 언제 사라지는지 환자에게 어떻게 안내해야 합니까?",
        options: [
          "대부분 몇 시간에서 수일 내에 자연스럽게 사라집니다",
          "약 6개월 이상 길게 지속되므로 레이저 진정 연고를 매일 발라야 합니다",
          "영구적인 흉터로 남으므로 즉각적으로 부기 제거 수술을 해야 합니다",
          "시술 직후 5분 이내로 완전히 건조되어 소멸합니다"
        ],
        answer: "대부분 몇 시간에서 수일 내에 자연스럽게 사라집니다",
        explanation: "시술 열감으로 생기는 미세 붉은 기와 부기는 시술 부작용이 아닌 정상적인 조직 자극 반응으로, 대부분 며칠 내로 진정됩니다."
      }
    ]
  },

  // 5) 덴서티 (Density)
  density: {
    title: "📈 덴서티",
    subtitle: "모노폴라와 바이폴라 두 가지 고주파 시너지를 담은 고출력 프리미엄 고주파 리프팅",
    tag: "타이트닝",
    icon: "fa-wave-square",
    colorClass: "bg-wellness",
    tagClass: "tag-wellness",
    questions: [
      {
        id: "density_q1",
        type: "multiple-choice",
        question: "덴서티 레이저(특히 덴서티 하이) 장비가 제공하는 고주파 조사 방식의 가장 두드러진 차별점은 무엇입니까?",
        options: [
          "모노폴라(단극성)와 바이폴라(양극성) 에너지의 동시 및 교차 조사",
          "극초단 피코 레이저와 초음파의 복합 순차 조사",
          "이산화탄소 가스 분사와 수액 주입의 동시 진행",
          "진동 물리 필링과 레이저 필링의 결합 방식"
        ],
        answer: "모노폴라(단극성)와 바이폴라(양극성) 에너지의 동시 및 교차 조사",
        explanation: "덴서티는 진피 깊숙이 열을 전달하는 모노폴라 방식과 피부 얕은 층을 빠르게 조이는 바이폴라 방식을 동시에 사용하여 타이트닝 시너지를 냅니다."
      },
      {
        id: "density_q2",
        type: "fill-blank",
        sentence: "덴서티 시술 시 열 자극에 따른 표피 화상을 보호하고 통증을 경감하기 위해 작동하는 강력한 자동 분사 방식의 친환경 {blank} 가스 시스템이 있습니다.",
        options: ["냉각(디플루오로에탄)", "탄소(CO2)", "산소(Oxygen)", "질소(Nitrogen)"],
        answer: "냉각(디플루오로에탄)",
        explanation: "친환경 냉각 가스(디플루오로에탄) 분사 시스템을 시술 주기마다 총 5단계로 제어 분사하여 표피를 시원하게 보호합니다."
      },
      {
        id: "density_q3",
        type: "multiple-choice",
        question: "덴서티의 안전장치 중, 시술 팁이 피부 표면에 균일하게 닿지 않고 붕 떴을 때 오작동 및 안전사고를 막기 위한 기술은?",
        options: [
          "실시간 접촉 센서 및 압력 감지기 장치",
          "접촉식 이산화탄소 측정 장치",
          "근육 움직임 추적 센서",
          "공기압 유량 경보 장치"
        ],
        answer: "실시간 접촉 센서 및 압력 감지기 장치",
        explanation: "덴서티 팁은 피부와 완전한 접촉 및 가해지는 압력을 실시간 감지하여, 불완전 접촉 상태일 때는 장비 에너지 출력을 차단해 화상을 방지합니다."
      },
      {
        id: "density_q4",
        type: "multiple-choice",
        question: "덴서티의 쿨링 시스템은 어떤 유틸리티 방식을 통해 표피 온도를 정밀하게 제어합니까?",
        options: [
          "고압 가스를 5단계 맞춤 제어 분사하여 통증과 화상을 막는 쿨링",
          "얼음물을 직접 순환하는 튜브 연결",
          "강력한 송풍기를 이용한 바람 건조",
          "상온 대기 상태 유지"
        ],
        answer: "고압 가스를 5단계 맞춤 제어 분사하여 통증과 화상을 막는 쿨링",
        explanation: "덴서티는 시술 시 매 샷마다 쿨링 가스의 분사 주기를 5단계로 세밀하게 조절하여 표피를 화상 위험으로부터 완벽히 차단합니다."
      },
      {
        id: "density_q5",
        type: "fill-blank",
        sentence: "덴서티는 시술 전 접촉 임피던스를 매 샷마다 실시간으로 측정하는 {blank} 피드백 시스템을 탑재하여 안전하게 맞춤 에너지를 공급합니다.",
        options: ["임피던스 (저항)", "심전도", "초음파 모니터링", "온도 추적"],
        answer: "임피던스 (저항)",
        explanation: "피부 저항값(임피던스)을 실시간 보상하여 모든 부위에 일관되고 안전한 고주파 전류가 흐르도록 보장합니다."
      },
      {
        id: "density_q6",
        type: "multiple-choice",
        question: "덴서티 리프팅에서 단극성(Monopolar) 모노 팁과 양극성/단극성 복합형인 하이(High) 팁의 가장 큰 차이는 무엇입니까?",
        options: [
          "하이 팁은 모노폴라와 바이폴라 두 가지 에너지를 결합해 진피 깊은 층과 얕은 층을 입체적으로 타이트닝한다",
          "하이 팁은 초음파 리프팅만 방출하는 전용 팁이다",
          "하이 팁은 차가운 가스를 쏘지 않는 보급형 팁이다",
          "모노 팁은 통증이 전혀 없지만 하이 팁은 마취가 필수이다"
        ],
        answer: "하이 팁은 모노폴라와 바이폴라 두 가지 에너지를 결합해 진피 깊은 층과 얕은 층을 입체적으로 타이트닝한다",
        explanation: "덴서티 하이 팁은 모노폴라와 바이폴라 기술을 한 샷에 모두 구현하여 효율적인 피부 상/하부 타이트닝 시너지를 냅니다."
      },
      {
        id: "density_q7",
        type: "word-bank",
        question: "덴서티 고주파 리프팅의 시술 특징을 올바르게 문장으로 정렬하세요.",
        words: ["안전하고 정교한", "쿨링 시스템 덕분에", "시술 시 마취 없이도", "비교적 덜 아프게", "받을 수 있습니다"],
        answer: ["안전하고 정교한", "쿨링 시스템 덕분에", "시술 시 마취 없이도", "비교적 덜 아프게", "받을 수 있습니다"],
        explanation: "강력하고 빠른 냉각 가스 가드가 표피 신경을 안전하게 보호하여, 고출력 에너지 조사 대비 통증이 현저히 적습니다."
      },
      {
        id: "density_q8",
        type: "multiple-choice",
        question: "덴서티 리프팅 시술이 적합한 주 대상과 시술 주기로 가장 권장되는 것은?",
        options: [
          "탄력 저하와 잔주름이 고민이며, 연 1~2회 정기적인 시술",
          "매주 3회씩 집중적인 고주파 반복 조사 시술",
          "10대 청소년의 사춘기 골격 성장 치료용 시술",
          "영구적인 흉터 성형 외과적 이식 수술"
        ],
        answer: "탄력 저하와 잔주름이 고민이며, 연 1~2회 정기적인 시술",
        explanation: "덴서티 고주파 리프팅은 통상 6개월~1년 주기로 정기 리프팅을 받아 진피 콜라겐을 지속 유지 및 촉진하는 데 효과적입니다."
      },
      {
        id: "density_q9",
        type: "fill-blank",
        sentence: "덴서티 장비의 팁은 정품을 확인하고 재생 팁 남용을 원천 방지하기 위해 팁 내부에 {blank} 칩을 탑재하여 샷 수 유효성과 장비 매칭을 실시간 제어합니다.",
        options: ["RFID (정품인식)", "GPS (위치추적)", "블루투스", "NFC 결제"],
        answer: "RFID (정품인식)",
        explanation: "덴서티 정품 팁은 장비에 부착 시 무선 주파수 인식(RFID) 칩을 통해 정품 팁 여부와 잔여 샷 수를 자동으로 인식하고 제한합니다."
      },
      {
        id: "density_q10",
        type: "multiple-choice",
        question: "덴서티 시술을 받은 당일 홈케어 가이드로 올바르지 않은 것은?",
        options: [
          "피부 온도를 빠르게 낮추기 위해 시술 즉시 얼음 주머니로 시술 부위를 2시간 동안 세게 문지른다",
          "충분한 보습을 해주고 자외선 차단제를 꼼꼼히 바른다",
          "음주, 사우나, 흡연 및 과도한 필링 패드 사용을 피한다",
          "세안은 미온수로 가볍게 시행한다"
        ],
        answer: "피부 온도를 빠르게 낮추기 위해 시술 즉시 얼음 주머니로 시술 부위를 2시간 동안 세게 문지른다",
        explanation: "고주파 열 자극이 진피 내에 잘 머무는 것이 신생 콜라겐 생성에 유리하므로 시술 직후 인위적인 냉찜질을 과도하게 대어 열을 급격히 내리는 것은 권장하지 않습니다."
      }
    ]
  },

  // 6) 보톡스 (Botox)
  botox: {
    title: "💉 보톡스",
    subtitle: "근육 신호 전달을 일시적으로 차단하여 표정 주름과 근육 부피를 개선하는 시술",
    tag: "쁘띠 시술",
    icon: "fa-syringe",
    colorClass: "bg-treatment",
    tagClass: "tag-treatment",
    questions: [
      {
        id: "botox_q1",
        type: "multiple-choice",
        question: "보톡스 시술 시 주입되는 보툴리눔 톡신이 운동 신경과 근육이 만나는 부위에서 신경 차단을 유도하는 신경전달물질의 명칭은?",
        options: [
          "아세틸콜린",
          "세로토닌",
          "도파민",
          "아드레날린"
        ],
        answer: "아세틸콜린",
        explanation: "보톡스는 신경 말단에서 근육 수축 명령을 내리는 신경전달물질인 '아세틸콜린'의 방출을 억제하여 근육을 마비/이완시킵니다."
      },
      {
        id: "botox_q2",
        type: "fill-blank",
        sentence: "보톡스를 반복적으로 다량 맞았을 때 우리 몸에 항체가 생겨 효과가 현저히 감소하는 내성을 예방하기 위해, 불필요한 복합 단백질을 완전 제거한 {blank} 보톡스(예: 제오민, 코어톡스)를 선택하는 것이 좋습니다.",
        options: ["순수(내성예방)", "고농도", "천연한방", "동결겔형"],
        answer: "순수(내성예방)",
        explanation: "톡신 주위의 불필요한 비독소 복합 단백질을 정밀 정제하여 톡신 본연의 순수 성분만 담은 보톡스 제제가 약물 내성 항체 생성을 막아줍니다."
      },
      {
        id: "botox_q3",
        type: "word-bank",
        question: "보톡스 시술 이후 일상 속 중요한 주의사항 조항을 조립하세요.",
        words: ["시술 후", "약 1주일 동안은", "사우나나 찜질방", "출입을", "피해야 합니다"],
        answer: ["시술 후", "약 1주일 동안은", "사우나나 찜질방", "출입을", "피해야 합니다"],
        explanation: "보톡스 시술 후 약 일주일간은 주입 부위의 균일한 확산 및 염증 방지를 위해 사우나, 음주, 격렬한 열감 운동은 피하는 것이 좋습니다."
      },
      {
        id: "botox_q4",
        type: "multiple-choice",
        question: "다음 중 보톡스 시술로 개선할 수 있는 가장 대표적인 증상 영역은?",
        options: [
          "표정을 지을 때 생기는 움직이는 주름과 사각턱 근육 축소",
          "피부 표면에 넓게 퍼진 짙은 기미와 주근깨 치료",
          "패인 여드름 흉터 하부에 콜라겐을 채워 올리는 치료",
          "피부 장벽을 복구하여 아토피 피부염 자체를 완치하는 치료"
        ],
        answer: "표정을 지을 때 생기는 움직이는 주름과 사각턱 근육 축소",
        explanation: "보톡스는 근육 수축을 일시적 약화시키므로 미간, 눈가, 이마의 표정 주름과 저작근(사각턱) 부피 축소에 최고의 효능을 발휘합니다."
      },
      {
        id: "botox_q5",
        type: "fill-blank",
        sentence: "보톡스의 내성 위험을 높이는 대표적인 나쁜 시술 습관은 너무 잦은 주기와 {blank} 용량을 짧은 시간 안에 반복 시술하는 것입니다.",
        options: ["과도한 (대용량)", "적당한", "희석된", "일시적"],
        answer: "과도한 (대용량)",
        explanation: "필요 이상의 높은 용량을 너무 자주 주사하면 우리 몸에 보툴리눔 톡신 항체가 더 쉽게 형성되어 이후 효과가 급감하는 원인이 됩니다."
      },
      {
        id: "botox_q6",
        type: "multiple-choice",
        question: "보톡스 시술 효과가 최고조에 달하는 시점과 그 지속 기간에 대한 설명으로 가장 대중적인 것은?",
        options: [
          "주름은 1~2주 내, 근육은 1개월쯤에 최대 효과가 나타나며 약 3~6개월 지속된다",
          "주입 즉시 5초 만에 주름이 완전 펴지고 평생 유지된다",
          "시술 후 1년 내내 아무 변화가 없다가 갑자기 나타난다",
          "시술 후 1주일 내로 완전히 모든 성분이 흡수되어 효과가 사라진다"
        ],
        answer: "주름은 1~2주 내, 근육은 1개월쯤에 최대 효과가 나타나며 약 3~6개월 지속된다",
        explanation: "보톡스는 주사 후 서서히 신경 마비가 일어나 주름은 1~2주 내에, 비대해진 사각턱 근육은 약 4주 이후부터 축소되어 평균 3~6개월 정도 효과가 유지됩니다."
      },
      {
        id: "botox_q7",
        type: "word-bank",
        question: "보톡스 시술 후 부작용 및 주의사항에 대해 바르게 연결하세요.",
        words: ["주사 부위를", "세게 문지르면", "약물이 엉뚱한 근육으로", "확산하여", "안검하수 등이 생길 수 있습니다"],
        answer: ["주사 부위를", "세게 문지르면", "약물이 엉뚱한 근육으로", "확산하여", "안검하수 등이 생길 수 있습니다"],
        explanation: "시술 부위를 세게 누르거나 문지르면 톡신 약물이 주변의 다른 근육(눈꺼풀 올림근 등)으로 퍼져 안검하수(눈꺼풀 처짐)나 표정 어색함 같은 부작용을 유발할 수 있습니다."
      },
      {
        id: "botox_q8",
        type: "multiple-choice",
        question: "이마 보톡스 시술 후 일시적으로 눈꺼풀이 무겁게 느껴지거나 눈뜨기가 힘들어지는 현상을 예방하기 위한 시술 팁으로 적합하지 않은 것은?",
        options: [
          "최대한 눈과 눈썹에 아주 가까운 부위에 깊고 강하게 주입한다",
          "환자의 표정 근육의 움직임과 안검하수 유무를 사전에 철저히 진단한다",
          "이마 상부에 고르게 얕게 주사하고 환자 나이를 감안해 용량을 정한다",
          "시술 직후 시술 부위를 과도하게 압박하여 비비지 않도록 환자를 교육한다"
        ],
        answer: "최대한 눈과 눈썹에 아주 가까운 부위에 깊고 강하게 주입한다",
        explanation: "눈썹과 너무 인접한 눈썹상 1~2cm 부위에 강하게 보톡스를 주사하면 이마근 수축이 과도하게 억제되어 눈꺼풀 처짐이 심해질 수 있으므로 피해야 합니다."
      },
      {
        id: "botox_q9",
        type: "fill-blank",
        sentence: "보톡스를 근육이 아닌 피부 표면에 얇게 분산 주사하여, 얼굴 전체 탄력과 잔주름, 모공, 홍조 개선 효과를 거두는 시술을 스킨 보톡스 혹은 {blank} 보톡스라고 부릅니다.",
        options: ["더모톡신 (Dermotoxin)", "지방 보톡스", "필러 톡신", "신경 마비"],
        answer: "더모톡신 (Dermotoxin)",
        explanation: "더모톡신(Dermotoxin)은 피부층에 소량씩 주사하여 근육 마비는 최소화하면서 피부 결 개선, 미세 탄력 및 리프팅 시너지를 얻는 대중적인 쁘띠 성형술입니다."
      },
      {
        id: "botox_q10",
        type: "multiple-choice",
        question: "보톡스 시술을 받을 병원이나 제품을 선택할 때, 무엇보다 중요하게 다루어야 하는 '환자의 권리'는?",
        options: [
          "사용하는 보톡스 제품의 정품 유무와 유효기간, 그리고 정확한 개봉 정량 시술 확인",
          "시술 직후 마실 수 있는 웰컴 드링크의 알코올 도수와 빈티지",
          "시술실 대기 의자의 이탈리아 명품 가죽 브랜드 유무",
          "병원 대기실 TV의 화면 해상도가 8K 화질 이상인지 여부"
        ],
        answer: "사용하는 보톡스 제품의 정품 유무와 유효기간, 그리고 정확한 개봉 정량 시술 확인",
        explanation: "보톡스는 엄격히 승인된 정품 약제의 정량 주입이 환자의 안전과 치료 완성도에 직결되는 핵심 요소이므로 이를 투명하게 검증받는 것이 중요합니다."
      }
    ]
  }
};

// ==========================================
// 3. APPLICATION STATE (애플리케이션 상태 관리)
// ==========================================
const state = {
  user: {
    name: "",
    xp: 0,
    streak: 0,
    lastActiveDate: ""
  },
  currentCategory: null,
  currentQuestions: [],
  currentQuestionIndex: 0,
  hearts: 5,
  selectedAnswer: null, // Multiple Choice용
  wordBankTarget: [],  // Word Bank 조립 단어 목록
  quizStartTime: null,
  correctCount: 0,
  isAnswerChecked: false,
  soundMuted: false
};

// ==========================================
// 4. SOUND ENGINE (웹 오디오 API 효과음 합성)
// ==========================================
const SoundEngine = {
  ctx: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  play(type) {
    if (state.soundMuted) return;
    this.init();
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    switch (type) {
      case "click": {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case "correct": {
        const notes = [523.25, 659.25]; // C5, E5
        notes.forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + index * 0.08);
          gain.gain.setValueAtTime(0.1, now + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.15);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + index * 0.08);
          osc.stop(now + index * 0.08 + 0.15);
        });
        break;
      }
      case "incorrect": {
        const notes = [196.00, 155.56]; // G3, Eb3
        notes.forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, now + index * 0.1);
          gain.gain.setValueAtTime(0.12, now + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.3);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + index * 0.1);
          osc.stop(now + index * 0.1 + 0.3);
        });
        break;
      }
      case "victory": {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + index * 0.1);
          gain.gain.setValueAtTime(0.08, now + index * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + index * 0.1);
          osc.stop(now + index * 0.1 + 0.4);
        });
        break;
      }
    }
  }
};

// ==========================================
// 5. CONFETTI EFFECT (캔버스 축하 폭죽)
// ==========================================
const ConfettiEffect = {
  canvas: null,
  ctx: null,
  particles: [],
  animationId: null,

  init() {
    this.canvas = document.getElementById("confetti-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  },

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  start() {
    this.particles = [];
    const colors = ["#58cc02", "#1cb0f6", "#ff9600", "#ff4b4b", "#ffc800", "#c684ff"];
    for (let i = 0; i < 150; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height - this.canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * this.canvas.height,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 5,
        tiltAngleIncremental: Math.random() * 0.07 + 0.02,
        tiltAngle: 0,
        speedY: Math.random() * 3 + 4,
        speedX: Math.random() * 2 - 1
      });
    }
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.draw();
  },

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let active = false;

    this.particles.forEach((p) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += p.speedY;
      p.x += p.speedX;
      p.tilt = Math.sin(p.tiltAngle) * 12;

      if (p.y < this.canvas.height) {
        active = true;
      }

      this.ctx.beginPath();
      this.ctx.lineWidth = p.r;
      this.ctx.strokeStyle = p.color;
      this.ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      this.ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      this.ctx.stroke();
    });

    if (active) {
      this.animationId = requestAnimationFrame(() => this.draw());
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  },

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

// ==========================================
// 6. MASCOT SVG EXPRESSION MANAGER & GYM SLOWPOKE GENERATOR (캐릭터 및 성장 관리)
// ==========================================
let currentMascotExpression = "normal";
let mascotIdleInterval = null;

// Mascot SVG generator (Slowpoke Gym growth model)
function getMascotSVG(xp, expression, isMini = false) {
  const size = isMini ? 80 : 160;
  const viewBoxSize = 200;
  const strokeColor = "#7d3b47"; // Dark pink outline color
  
  // Base body/face parts of Slowpoke-like mascot
  let svgContent = `
    <!-- Body Shadow -->
    <ellipse cx="100" cy="200" rx="60" ry="12" fill="rgba(0,0,0,0.06)" />
    
    <!-- Curled Tail -->
    <path d="M 140,165 Q 185,185 175,145 T 145,130" fill="none" stroke="#ff9ebb" stroke-width="18" stroke-linecap="round" />
    <path d="M 152,134 Q 146,131 145,130" fill="none" stroke="#ffe066" stroke-width="18" stroke-linecap="round" />
    
    <!-- Back Legs (darker pink for depth) -->
    <rect x="42" y="165" width="22" height="30" rx="11" fill="#e08da0" />
    <rect x="136" y="165" width="22" height="30" rx="11" fill="#e08da0" />
    
    <!-- Main Body -->
    <rect x="50" y="100" width="100" height="90" rx="45" fill="#ff9ebb" />
    <rect x="65" y="130" width="70" height="60" rx="30" fill="#fff2e2" />
    
    <!-- Front Legs -->
    <rect x="55" y="175" width="22" height="30" rx="11" fill="#ff9ebb" />
    <rect x="123" y="175" width="22" height="30" rx="11" fill="#ff9ebb" />
    
    <!-- Head -->
    <circle cx="100" cy="95" r="45" fill="#ff9ebb" />
    
    <!-- Ears -->
    <!-- Left Ear -->
    <ellipse cx="58" cy="72" rx="14" ry="10" transform="rotate(-30, 58, 72)" fill="#ff9ebb" />
    <ellipse cx="58" cy="72" rx="9" ry="6" transform="rotate(-30, 58, 72)" fill="#ffb3cc" />
    <!-- Right Ear -->
    <ellipse cx="142" cy="72" rx="14" ry="10" transform="rotate(30, 142, 72)" fill="#ff9ebb" />
    <ellipse cx="142" cy="72" rx="9" ry="6" transform="rotate(30, 142, 72)" fill="#ffb3cc" />
    
    <!-- Muzzle / Snout -->
    <ellipse cx="100" cy="112" rx="30" ry="18" fill="#fff2e2" />
    <!-- Nostrils -->
    <circle cx="95" cy="108" r="2" fill="#b37d8a" />
    <circle cx="105" cy="108" r="2" fill="#b37d8a" />
  `;

  // Mouth rendering based on expression
  if (expression === "eating") {
    svgContent += `<!-- Open mouth for eating -->
      <circle cx="100" cy="118" r="6" fill="#7d3b47" />
      <circle cx="100" cy="120" r="4" fill="#ff4b4b" />`;
  } else if (expression === "excited" || expression === "happy") {
    svgContent += `<!-- Smiling open mouth -->
      <path d="M 92,116 Q 100,126 108,116 Z" fill="#ff4b4b" stroke="#7d3b47" stroke-width="2" />`;
  } else {
    svgContent += `<!-- Neutral mouth -->
      <path d="M 92,118 Q 100,121 108,118" fill="none" stroke="#7d3b47" stroke-width="2" stroke-linecap="round" />`;
  }

  // Eyes rendering based on expression
  if (expression === "sleeping") {
    svgContent += `
      <!-- Sleeping Eyes (closed curves) -->
      <path d="M 75,94 Q 82,88 89,94" fill="none" stroke="#7d3b47" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 111,94 Q 118,88 125,94" fill="none" stroke="#7d3b47" stroke-width="3.5" stroke-linecap="round" />
    `;
  } else if (expression === "excited" || expression === "happy") {
    svgContent += `
      <!-- Happy squinting eyes -->
      <path d="M 75,93 Q 82,99 89,93" fill="none" stroke="#7d3b47" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 111,93 Q 118,99 125,93" fill="none" stroke="#7d3b47" stroke-width="3.5" stroke-linecap="round" />
    `;
  } else if (expression === "sad") {
    svgContent += `
      <!-- Sad eyes -->
      <path d="M 76,89 Q 82,95 88,91" fill="none" stroke="#7d3b47" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 112,89 Q 118,95 124,91" fill="none" stroke="#7d3b47" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="82" cy="95" r="4.5" fill="#000000" />
      <circle cx="118" cy="95" r="4.5" fill="#000000" />
    `;
  } else {
    // Normal vacant Dopey eyes (Slowpoke classic)
    svgContent += `
      <circle cx="82" cy="92" r="8" fill="#ffffff" stroke="#7d3b47" stroke-width="1.5" />
      <circle cx="82" cy="92" r="2.5" fill="#000000" />
      <circle cx="118" cy="92" r="8" fill="#ffffff" stroke="#7d3b47" stroke-width="1.5" />
      <circle cx="118" cy="92" r="2.5" fill="#000000" />
    `;
  }

  // --- GROWTH OVERLAY ELEMENTS (LOCKED BY USER XP) ---
  
  // 100+ XP: Gym headband
  if (xp >= 100) {
    svgContent += `
      <!-- 100 XP: Gym Headband -->
      <rect x="74" y="65" width="52" height="12" rx="3" fill="#ff4b4b" stroke="#7d3b47" stroke-width="1.5" />
      <rect x="85" y="65" width="10" height="12" fill="#ffffff" />
      <rect x="105" y="65" width="10" height="12" fill="#ffffff" />
    `;
  }

  // 200+ XP: Dumbbell on the ground
  if (xp >= 200) {
    svgContent += `
      <!-- 200 XP: Dumbbell on the ground -->
      <g transform="translate(25, 175)">
        <rect x="0" y="8" width="22" height="5" fill="#888" stroke="#333" stroke-width="1" />
        <circle cx="0" cy="10" r="9" fill="#555" stroke="#333" stroke-width="1" />
        <circle cx="22" cy="10" r="9" fill="#555" stroke="#333" stroke-width="1" />
        <line x1="0" y1="10" x2="22" y2="10" stroke="#777" stroke-width="1" />
      </g>
    `;
  }

  // 300+ XP: arm muscle contours (and active lift dumbbell if doing hobby state!)
  if (xp >= 300) {
    if (expression === "hobby") {
      svgContent += `
        <!-- 300 XP: Lifting dumbbell animation -->
        <g class="dumbbell-anim" style="transform-origin: 50px 145px;">
          <path d="M 55,145 C 30,135 25,160 55,170" fill="#ff9ebb" stroke="#7d3b47" stroke-width="2" />
          <rect x="10" y="130" width="24" height="6" fill="#888" stroke="#333" stroke-width="1" />
          <circle cx="10" cy="133" r="11" fill="#444" stroke="#333" stroke-width="1" />
          <circle cx="34" cy="133" r="11" fill="#444" stroke="#333" stroke-width="1" />
          <text x="10" y="125" font-size="8" fill="#ff4b4b" font-weight="900">UP!</text>
        </g>
      `;
    } else {
      svgContent += `
        <!-- 300 XP: Basic arm muscle definition -->
        <path d="M 58,145 Q 44,152 56,165" fill="none" stroke="#7d3b47" stroke-width="3" stroke-linecap="round" />
        <path d="M 142,145 Q 156,152 144,165" fill="none" stroke="#7d3b47" stroke-width="3" stroke-linecap="round" />
      `;
    }
  }

  // 400+ XP: Tight Gym tank top / singlet
  if (xp >= 400) {
    svgContent += `
      <!-- 400 XP: Gym Singlet -->
      <path d="M 70,128 L 130,128 L 134,188 L 66,188 Z" fill="#1cb0f6" stroke="#1899d6" stroke-width="1.5" opacity="0.9" />
      <path d="M 82,128 C 82,142 118,142 118,128 Z" fill="#fff2e2" />
      <ellipse cx="68" cy="142" rx="6" ry="12" fill="#ff9ebb" />
      <ellipse cx="132" cy="142" rx="6" ry="12" fill="#ff9ebb" />
      <text x="100" y="165" fill="#ffffff" font-size="10" font-family="'Outfit', sans-serif" font-weight="800" text-anchor="middle">GYM</text>
    `;
  }

  // 500+ XP: Bicep shoulder definitions
  if (xp >= 500) {
    svgContent += `
      <!-- 500 XP: Defined trap/shoulder curves -->
      <path d="M 72,97 Q 62,115 72,128" fill="none" stroke="#7d3b47" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 128,97 Q 138,115 128,128" fill="none" stroke="#7d3b47" stroke-width="3.5" stroke-linecap="round" />
    `;
  }

  // 600+ XP: Abs / Six pack lines
  if (xp >= 600) {
    svgContent += `
      <!-- 600 XP: Chiseled Abs (shows if tank top is open, or layered on top) -->
      <g stroke="#7d3b47" stroke-width="3" stroke-linecap="round" opacity="0.65">
        <line x1="90" y1="152" x2="110" y2="152" />
        <line x1="90" y1="164" x2="110" y2="164" />
        <line x1="90" y1="176" x2="110" y2="176" />
        <line x1="100" y1="147" x2="100" y2="182" />
      </g>
    `;
  }

  // 700+ XP: Retro Sunglasses & Gold Medallion
  if (xp >= 700) {
    svgContent += `
      <!-- 700 XP: Sunglasses & Gold Chain -->
      <!-- Sunglasses -->
      <g stroke="#111" stroke-width="1.5">
        <polygon points="70,86 94,86 91,97 73,97" fill="#222" />
        <polygon points="106,86 130,86 127,97 109,97" fill="#222" />
        <line x1="94" y1="89" x2="106" y2="89" stroke-width="3" />
        <!-- Highlights on glasses -->
        <line x1="74" y1="89" x2="82" y2="89" stroke="#fff" stroke-width="1.5" />
        <line x1="110" y1="89" x2="118" y2="89" stroke="#fff" stroke-width="1.5" />
      </g>
      <!-- Gold Chain -->
      <path d="M 75,120 Q 100,138 125,120" fill="none" stroke="#ffc800" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="100" cy="131" r="6" fill="#ffc800" stroke="#e6b400" stroke-width="1" />
      <text x="100" y="134" font-size="7" font-weight="900" fill="#e68000" text-anchor="middle">W</text>
    `;
  }

  // 800+ XP: Bulky Muscle shoulders and biceps
  if (xp >= 800) {
    svgContent += `
      <!-- 800 XP: Bulky Giga Biceps -->
      <g stroke="#7d3b47" stroke-width="3">
        <!-- Left arm flex -->
        <path d="M 45,130 C 20,120 15,150 45,165" fill="#ff9ebb" />
        <!-- Right arm flex -->
        <path d="M 155,130 C 180,120 185,150 155,165" fill="#ff9ebb" />
      </g>
    `;
  }

  // 900+ XP: Protein shaker cup on ground
  if (xp >= 900) {
    svgContent += `
      <!-- 900 XP: Protein Shaker -->
      <g transform="translate(150, 155)">
        <rect x="0" y="0" width="16" height="24" rx="2" fill="#555" stroke="#333" stroke-width="1.5" />
        <rect x="-2" y="-4" width="20" height="5" rx="1" fill="#ff4b4b" stroke="#333" stroke-width="1.5" />
        <rect x="5" y="-8" width="6" height="5" fill="#fff" stroke="#333" stroke-width="1" />
        <text x="8" y="14" fill="#ff4b4b" font-size="7" font-weight="900" text-anchor="middle">100%</text>
      </g>
    `;
  }

  // 1000+ XP: Sharp GigaChad jawline & King Crown (Final Form)
  if (xp >= 1000) {
    svgContent += `
      <!-- 1000 XP: Sharp GigaChad chin and King Crown -->
      <!-- Jawline -->
      <path d="M 78,106 L 100,128 L 122,106" fill="none" stroke="#7d3b47" stroke-width="4.5" stroke-linecap="round" />
      
      <!-- Pectoral Chest definition -->
      <path d="M 75,133 Q 100,143 125,133" fill="none" stroke="#7d3b47" stroke-width="4" stroke-linecap="round" />
      
      <!-- Golden Crown -->
      <g fill="#ffc800" stroke="#e6b400" stroke-width="1.5">
        <polygon points="76,60 81,42 91,52 100,35 109,52 119,42 124,60" />
        <!-- Crown Jewels -->
        <circle cx="81" cy="42" r="2" fill="#ff4b4b" />
        <circle cx="100" cy="35" r="2.5" fill="#1cb0f6" />
        <circle cx="119" cy="42" r="2" fill="#ff4b4b" />
      </g>
    `;
  }

  // Animations in SVG
  if (expression === "sleeping") {
    svgContent += `
      <!-- Sleep Zzz floating particles -->
      <g opacity="0.8">
        <text x="135" y="70" font-size="18" font-weight="bold" fill="#1cb0f6" class="z1">Z</text>
        <text x="145" y="52" font-size="13" font-weight="bold" fill="#1cb0f6" class="z2">z</text>
        <text x="155" y="38" font-size="10" font-weight="bold" fill="#1cb0f6" class="z3">z</text>
      </g>
    `;
  }

  if (expression === "eating") {
    svgContent += `
      <!-- Food Bowl (Protein salad) -->
      <g class="bowl-anim" style="transform-origin: 100px 145px;">
        <path d="M 82,130 C 82,148 118,148 118,130 Z" fill="#ff4b4b" stroke="#7d3b47" stroke-width="2" />
        <ellipse cx="100" cy="128" rx="16" ry="6" fill="#84e036" />
        <circle cx="95" cy="128" r="3" fill="#ffe066" />
        <circle cx="105" cy="127" r="2" fill="#ff9600" />
      </g>
    `;
  }

  return `
    <svg id="mascot-svg" class="slowpoke-mascot" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      ${svgContent}
    </svg>
  `;
}

function setMascotExpression(expression) {
  currentMascotExpression = expression;
  updateMascotsHTML();
}

function updateMascotsHTML() {
  const xp = state.user.xp || 0;
  
  // Home mascot (Welcome screen)
  const homeContainer = document.getElementById("home-mascot-container");
  if (homeContainer) {
    homeContainer.innerHTML = getMascotSVG(xp, currentMascotExpression, false);
  }
  
  // Mini mascot (Quiz screen helper)
  const quizContainer = document.getElementById("quiz-mascot-container");
  if (quizContainer) {
    quizContainer.innerHTML = getMascotSVG(xp, currentMascotExpression, true);
  }
  
  // Final mascot (Results screen celebration)
  const finalContainer = document.getElementById("final-mascot-container");
  if (finalContainer) {
    finalContainer.innerHTML = getMascotSVG(xp, "excited", false);
  }
}

function startMascotIdleLoop() {
  if (mascotIdleInterval) {
    clearInterval(mascotIdleInterval);
    mascotIdleInterval = null;
  }
  
  mascotIdleInterval = setInterval(() => {
    const welcomeScreen = document.getElementById("welcome-screen");
    if (!welcomeScreen || !welcomeScreen.classList.contains("active") || !state.user.name || state.user.xp < 300) {
      return;
    }
    
    // Choose a random idle behavior
    const action = Math.floor(Math.random() * 5);
    let expression = "normal";
    let greeting = "";
    
    switch (action) {
      case 0:
        expression = "normal";
        greeting = `오늘도 화이팅, ${state.user.name}! 공부하고 싶은 시술 카드를 클릭해봐!`;
        break;
      case 1:
        expression = "sleeping";
        greeting = "드르렁... 쿨쿨... (리팟레이저는 색소 치료에 끝판왕이라던데...) Zzz";
        break;
      case 2:
        expression = "eating";
        greeting = "뇸뇸뇸... 🥤 득근을 위한 단백질 파우더 셰이크 섭취 완료!";
        break;
      case 3:
        expression = "hobby";
        greeting = "영차! 영차! 🏋️ 3대 500을 향해서 열심히 덤벨 리프팅 중이다 야돈!";
        break;
      case 4:
        const quotes = [
          "내 야돈 근육이 점점 성장하는 게 느껴져! 1000 XP까지 달린다!",
          "울쎄라피는 초음파 리프팅으로 나처럼 탄력을 탱탱하게 해준대!",
          "써마지FLX는 고주파 시술로 피부 탄력을 건강하게 만들어준대!",
          "보톡스는 주름 예방이랑 사각턱 개선에 최고라구! 내 근육은 안돼!",
          "더웰니스의원 대표 리팟레이저는 색소 병변을 안전하고 확실하게 지워준대!"
        ];
        expression = "normal";
        greeting = quotes[Math.floor(Math.random() * quotes.length)];
        break;
    }
    
    setMascotExpression(expression);
    
    const greetingEl = document.getElementById("mascot-greeting");
    if (greetingEl) {
      greetingEl.textContent = greeting;
    }
    
    // Temporary return to normal
    if (expression !== "normal") {
      setTimeout(() => {
        if (currentMascotExpression === expression) {
          setMascotExpression("normal");
          if (greetingEl) {
            greetingEl.textContent = `다시 학습에 집중해볼까, ${state.user.name}?`;
          }
        }
      }, 7000);
    }
  }, 15000);
}

function stopMascotIdleLoop() {
  if (mascotIdleInterval) {
    clearInterval(mascotIdleInterval);
    mascotIdleInterval = null;
  }
}

// ==========================================
// 7. FIREBASE DATA STORAGE (파이어베이스 연동 로직)
// ==========================================

// Firebase 클라이언트 초기화
function initFirebase() {
  const isConfigured = FIREBASE_API_KEY && FIREBASE_API_KEY !== "YOUR_FIREBASE_API_KEY" &&
                      FIREBASE_PROJECT_ID && FIREBASE_PROJECT_ID !== "YOUR_FIREBASE_PROJECT_ID" &&
                      FIREBASE_APP_ID && FIREBASE_APP_ID !== "YOUR_FIREBASE_APP_ID";

  const statusBadge = document.getElementById("firebase-status");

  if (isConfigured && window.firebase) {
    try {
      let app;
      // 이미 초기화된 Firebase 앱이 없을 때만 초기화 진행 (SPA 중복 초기화 방지)
      if (firebase.apps.length === 0) {
        app = firebase.initializeApp({
          apiKey: FIREBASE_API_KEY,
          projectId: FIREBASE_PROJECT_ID,
          appId: FIREBASE_APP_ID
        });
      } else {
        app = firebase.app();
      }
      db = app.firestore();
      
      statusBadge.classList.remove("offline");
      statusBadge.classList.add("online");
      statusBadge.querySelector(".status-label").textContent = "Firebase 온";
      statusBadge.title = "";
      console.log("Firebase Cloud Firestore 연동 완료!");

      // 비동기 퀴즈 데이터 시딩 및 동기화
      syncFirebaseQuizzes();
    } catch (e) {
      console.error("Firebase 초기화 에러:", e);
      fallbackToLocalMode();
    }
  } else {
    fallbackToLocalMode();
  }
}

// Firebase 퀴즈 데이터 시딩 및 동기화
async function syncFirebaseQuizzes() {
  if (!db) return;
  try {
    await seedQuizData();
    await loadQuizzesFromFirebase();
    updateDashboardProgress();
    renderTopicCards();
  } catch (err) {
    console.error("Firebase 퀴즈 동기화 에러:", err);
  }
}

async function seedQuizData() {
  if (!db) return;
  try {
    const snapshot = await db.collection("quizzes").get();
    let needSeeding = false;
    if (snapshot.empty) {
      needSeeding = true;
    } else {
      let count = 0;
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.questions && data.questions.length < 10) {
          needSeeding = true;
        }
        count++;
      });
      if (count < Object.keys(QUIZ_DATA).length) {
        needSeeding = true;
      }
    }
    if (needSeeding) {
      console.log("Outdated database detected. Force-seeding 10 questions...");
      const batch = db.batch();
      for (const [key, data] of Object.entries(QUIZ_DATA)) {
        const docRef = db.collection("quizzes").doc(key);
        batch.set(docRef, data);
      }
      await batch.commit();
      console.log("Firebase 10-question datasets seeded successfully!");
    }
  } catch (err) {
    console.error("Firebase seeding failed:", err);
  }
}

async function loadQuizzesFromFirebase() {
  if (!db) return;
  try {
    const snapshot = await db.collection("quizzes").get();
    if (!snapshot.empty) {
      const fbQuizData = {};
      snapshot.forEach(doc => {
        fbQuizData[doc.id] = doc.data();
      });
      // 로컬 QUIZ_DATA 비우고 Firebase 데이터로 덮어쓰기
      for (const key in QUIZ_DATA) {
        delete QUIZ_DATA[key];
      }
      Object.assign(QUIZ_DATA, fbQuizData);
      console.log("Firebase 최신 퀴즈 동기화 완료:", Object.keys(QUIZ_DATA));
    }
  } catch (err) {
    console.error("Firebase 퀴즈 로딩 실패. 로컬 백업을 사용합니다:", err);
  }
}

function fallbackToLocalMode() {
  db = null;
  const statusBadge = document.getElementById("firebase-status");
  statusBadge.classList.remove("online");
  statusBadge.classList.add("offline");
  statusBadge.querySelector(".status-label").textContent = "Local 모드";
  statusBadge.title = "";
  console.log("로컬 브라우저 저장소 데이터베이스 구동 중");
}

// 리더보드 데이터 동기화 및 가져오기
async function fetchLeaderboard() {
  const listEl = document.getElementById("leaderboard-rankings-list");
  listEl.innerHTML = `<div class="loading-state"><i class="fa-solid fa-circle-notch fa-spin"></i> 순위를 불러오는 중...</div>`;

  let leaderboardData = [];

  if (db) {
    try {
      // users 컬렉션에서 XP 기준 상위 10개 조회
      const querySnapshot = await db.collection("users")
        .orderBy("xp", "desc")
        .limit(10)
        .get();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leaderboardData.push({
          name: data.name,
          xp: data.xp,
          streak: data.streak
        });
      });
    } catch (err) {
      console.warn("Firestore 순위 로드 실패. 로컬 저장소를 활용합니다.", err);
      leaderboardData = getLocalLeaderboardData();
    }
  } else {
    leaderboardData = getLocalLeaderboardData();
  }

  renderLeaderboard(leaderboardData);
}

function getLocalLeaderboardData() {
  const localUsers = getLocalUsers();
  return Object.values(localUsers)
    .map(u => ({ name: u.name, xp: u.xp, streak: u.streak }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);
}

// 사용자 스코어 데이터 저장
async function saveUserScore() {
  if (!state.user.name) return;

  // 세션 스토리지 업데이트
  saveUserSession(state.user);

  // 1. Firebase Firestore에 사용자 정보 업데이트
  if (db) {
    try {
      await db.collection("users").doc(state.user.name).set({
        xp: state.user.xp,
        streak: state.user.streak,
        lastActiveDate: state.user.lastActiveDate,
        progress: state.user.progress || {}
      }, { merge: true });
      console.log("Firebase 사용자 정보 업데이트 완료!");
    } catch (err) {
      console.error("Firestore 사용자 업데이트 실패:", err);
    }
  } else {
    // 2. 로컬 저장소 업데이트
    let localUsers = getLocalUsers();
    if (localUsers[state.user.name]) {
      localUsers[state.user.name].xp = state.user.xp;
      localUsers[state.user.name].streak = state.user.streak;
      localUsers[state.user.name].lastActiveDate = state.user.lastActiveDate;
      localUsers[state.user.name].progress = state.user.progress || {};
      saveLocalUsers(localUsers);
    }
  }
}

function renderLeaderboard(rankings) {
  const listEl = document.getElementById("leaderboard-rankings-list");
  if (!rankings || rankings.length === 0) {
    listEl.innerHTML = `<div class="empty-state"><i class="fa-solid fa-face-smile"></i> 아직 등록된 순위 정보가 없습니다. 첫 퀴즈를 풀어보세요!</div>`;
    return;
  }

  listEl.innerHTML = rankings.map((user, index) => {
    const isCurrentUser = user.name === state.user.name ? "current-user" : "";
    return `
      <div class="rank-item ${isCurrentUser}">
        <span class="rank-number">${index + 1}</span>
        <span class="rank-name">${escapeHtml(user.name)}</span>
        <span class="rank-streak"><i class="fa-solid fa-fire"></i> ${user.streak || 1}일</span>
        <span class="rank-xp">${user.xp} XP</span>
      </div>
    `;
  }).join("");
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ==========================================
// 8. PROGRESS LOGIC (진도 확인 및 카드 동적 생성)
// ==========================================
function renderTopicCards() {
  const container = document.getElementById("topics-grid-container");
  if (!container) return;
  container.innerHTML = "";

  const categories = Object.keys(QUIZ_DATA);
  if (categories.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 40px 20px; text-align: center; color: var(--color-gray-medium);">
        <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 16px; opacity: 0.6;"></i>
        <p style="font-weight: 700; font-size: 1.1rem; color: var(--text-color);">등록된 퀴즈 주제가 없습니다.</p>
        <p style="font-size: 0.85rem; margin-top: 6px; line-height: 1.5;">app.js 파일의 <strong>QUIZ_DATA</strong>에 주제와 문제를 정의해 주세요!</p>
      </div>
    `;
    return;
  }

  categories.forEach(cat => {
    const data = QUIZ_DATA[cat];
    const progress = getCategoryProgress(cat);

    const card = document.createElement("div");
    card.className = "topic-card card-3d";
    card.setAttribute("data-category", cat);
    card.id = `card-${cat}`;

    card.innerHTML = `
      <div class="topic-icon-container ${data.colorClass || 'bg-info'}">
        <i class="fa-solid ${data.icon || 'fa-graduation-cap'}"></i>
      </div>
      <div class="topic-details">
        <span class="topic-tag ${data.tagClass || 'tag-info'}">${data.tag || '일반'}</span>
        <h3>${escapeHtml(data.title)}</h3>
        <p>${escapeHtml(data.subtitle)}</p>
        <div class="topic-progress">
          <div class="progress-bar-bg"><div class="progress-bar-fill" id="pb-${cat}" style="width: ${progress}%"></div></div>
          <span class="progress-percentage" id="pt-${cat}">${progress}% 완료</span>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      if (document.getElementById("topic-selection-section").classList.contains("disabled")) return;
      startQuiz(cat);
    });

    container.appendChild(card);
  });
}

function updateDashboardProgress() {
  const categories = Object.keys(QUIZ_DATA);
  categories.forEach(cat => {
    const progress = getCategoryProgress(cat);
    const pb = document.getElementById(`pb-${cat}`);
    const pt = document.getElementById(`pt-${cat}`);
    if (pb && pt) {
      pb.style.width = `${progress}%`;
      pt.textContent = `${progress}% 완료`;
    }
  });
}

function getCategoryProgress(cat) {
  if (state.user && state.user.progress && state.user.progress[cat] !== undefined) {
    return parseInt(state.user.progress[cat]);
  }
  return 0;
}

async function saveCategoryProgress(cat, percent) {
  if (!state.user || !state.user.name) return;

  if (!state.user.progress) {
    state.user.progress = {};
  }

  const current = getCategoryProgress(cat);
  if (percent > current) {
    state.user.progress[cat] = percent;

    // 세션 스토리지 업데이트
    saveUserSession(state.user);

    // Save to Firebase if online
    if (db) {
      try {
        const userRef = db.collection("users").doc(state.user.name);
        await userRef.update({
          [`progress.${cat}`]: percent
        });
        console.log(`Firebase 진도 저장 완료 (${cat}: ${percent}%)`);
      } catch (err) {
        console.error("Firebase 진도 저장 중 에러, set으로 재시도:", err);
        try {
          await userRef.set({
            progress: {
              [cat]: percent
            }
          }, { merge: true });
        } catch (e) {
          console.error("Firestore set 에러:", e);
        }
      }
    }

    // Save to Local Storage (so that offline fallback works per user)
    let localUsers = getLocalUsers();
    if (localUsers[state.user.name]) {
      localUsers[state.user.name].progress = state.user.progress;
      saveLocalUsers(localUsers);
      console.log(`Local 진도 저장 완료 (${cat}: ${percent}%)`);
    }
  }
}

// ==========================================
// 9. USER AUTHENTICATION & LOGIN LOGIC
// ==========================================
function showSignupBox() {
  SoundEngine.play("click");
  document.getElementById("login-form-box").style.display = "none";
  document.getElementById("signup-form-box").style.display = "block";
}

function showLoginBox() {
  SoundEngine.play("click");
  document.getElementById("signup-form-box").style.display = "none";
  document.getElementById("login-form-box").style.display = "block";
}

async function handleUserSignup() {
  SoundEngine.play("click");
  const nickname = document.getElementById("signup-id-input").value.trim();
  const password = document.getElementById("signup-pw-input").value.trim();

  if (!nickname || !password) {
    alert("닉네임과 비밀번호를 모두 입력해 주세요.");
    return;
  }

  if (db) {
    try {
      const userRef = db.collection("users").doc(nickname);
      const doc = await userRef.get();
      
      if (doc.exists) {
        alert("이미 존재하는 닉네임입니다. 다른 닉네임을 사용해 주세요.");
        return;
      }

      const newUser = {
        name: nickname,
        password: password,
        xp: 0,
        streak: 1,
        lastActiveDate: new Date().toISOString(),
        progress: {}
      };

      await userRef.set(newUser);
      console.log("Firebase 신규 사용자 생성 완료:", nickname);
      loginUser(newUser);
    } catch (err) {
      console.error("Firebase 가입 중 에러:", err);
      alert("서버 연결에 실패했습니다. 로컬로 가입을 진행합니다.");
      handleLocalSignup(nickname, password);
    }
  } else {
    handleLocalSignup(nickname, password);
  }
}

function handleLocalSignup(nickname, password) {
  let localUsers = getLocalUsers();
  if (localUsers[nickname]) {
    alert("이미 존재하는 닉네임입니다. 다른 닉네임을 사용해 주세요.");
    return;
  }

  const newUser = {
    name: nickname,
    password: password,
    xp: 0,
    streak: 1,
    lastActiveDate: new Date().toISOString(),
    progress: {}
  };

  localUsers[nickname] = newUser;
  saveLocalUsers(localUsers);
  console.log("Local 신규 사용자 생성 완료:", nickname);
  loginUser(newUser);
}

async function handleUserLogin() {
  SoundEngine.play("click");
  const nickname = document.getElementById("login-id-input").value.trim();
  const password = document.getElementById("login-pw-input").value.trim();

  if (!nickname || !password) {
    alert("닉네임과 비밀번호를 모두 입력해 주세요.");
    return;
  }

  if (db) {
    try {
      const userRef = db.collection("users").doc(nickname);
      const doc = await userRef.get();
      
      if (!doc.exists) {
        alert("존재하지 않는 닉네임입니다.");
        return;
      }

      const userData = doc.data();
      if (userData.password !== password) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }

      console.log("Firebase 로그인 성공:", nickname);
      loginUser(userData);
    } catch (err) {
      console.error("Firebase 로그인 중 에러:", err);
      alert("서버 로그인에 실패했습니다. 로컬 계정을 확인합니다.");
      handleLocalLogin(nickname, password);
    }
  } else {
    handleLocalLogin(nickname, password);
  }
}

function handleLocalLogin(nickname, password) {
  const localUsers = getLocalUsers();
  const user = localUsers[nickname];

  if (!user) {
    alert("존재하지 않는 닉네임입니다.");
    return;
  }

  if (user.password !== password) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  console.log("Local 로그인 성공:", nickname);
  loginUser(user);
}

function getLocalUsers() {
  const data = localStorage.getItem("wellness_local_users");
  return data ? JSON.parse(data) : {};
}

function saveLocalUsers(users) {
  localStorage.setItem("wellness_local_users", JSON.stringify(users));
}

function loginUser(userData) {
  state.user.name = userData.name;
  state.user.xp = userData.xp || 0;
  state.user.streak = userData.streak || 1;
  state.user.lastActiveDate = userData.lastActiveDate || new Date().toISOString();
  state.user.progress = userData.progress || {};

  // 세션 스토리지 세션 저장
  saveUserSession(userData);

  // 로그인 창 닫기 및 화면 활성화
  document.getElementById("auth-form-container").style.display = "none";
  document.getElementById("topic-selection-section").classList.remove("disabled");
  
  // UI 동기화
  document.getElementById("logo-btn").textContent = `더웰니스: ${userData.name}`;
  document.getElementById("xp-count").textContent = state.user.xp;
  document.getElementById("streak-count").textContent = state.user.streak;

  checkAndUpdateStreak();
  updateDashboardProgress();
  renderTopicCards();
  updateMascotsHTML();
  startMascotIdleLoop();

  // Mascot Greeting
  setMascotExpression("excited");
  document.getElementById("mascot-greeting").textContent = `어서와, ${userData.name}! 학습을 계속해보자!`;
  setTimeout(() => setMascotExpression("normal"), 1800);
}

function loadUserData() {
  // 매번 닉네임/비밀번호 로그인을 거쳐야 하므로 시작 화면을 항상 표시합니다.
  document.getElementById("auth-form-container").style.display = "block";
  document.getElementById("topic-selection-section").classList.add("disabled");

  document.getElementById("xp-count").textContent = 0;
  document.getElementById("streak-count").textContent = 0;

  updateDashboardProgress();
  renderTopicCards();
  updateMascotsHTML();
  stopMascotIdleLoop();
}

function saveUserSession(userData) {
  if (!userData || !userData.name) return;
  
  // password가 없으면 기존 세션에서 password를 가져와 채움
  let password = userData.password;
  if (!password) {
    const existing = sessionStorage.getItem("wellness_session_user");
    if (existing) {
      try {
        password = JSON.parse(existing).password;
      } catch (e) {}
    }
  }

  const sessionUser = {
    name: userData.name,
    password: password,
    xp: userData.xp !== undefined ? userData.xp : state.user.xp,
    streak: userData.streak !== undefined ? userData.streak : state.user.streak,
    lastActiveDate: userData.lastActiveDate || state.user.lastActiveDate || new Date().toISOString(),
    progress: userData.progress || state.user.progress || {}
  };
  sessionStorage.setItem("wellness_session_user", JSON.stringify(sessionUser));
}

function tryAutoSessionLogin() {
  const sessionData = sessionStorage.getItem("wellness_session_user");
  if (!sessionData) {
    loadUserData();
    return;
  }

  try {
    const sessionUser = JSON.parse(sessionData);
    if (!sessionUser || !sessionUser.name || !sessionUser.password) {
      loadUserData();
      return;
    }

    console.log("Session auto-login successful (sessionStorage):", sessionUser.name);
    loginUser(sessionUser);

    // 백그라운드에서 최신 데이터를 Firestore로부터 비동기식으로 가져와 한 번 더 동기화
    if (db) {
      db.collection("users").doc(sessionUser.name).get()
        .then(doc => {
          if (doc.exists) {
            const latestData = doc.data();
            if (latestData.password === sessionUser.password) {
              console.log("Background session sync successful");
              // 기존 세션 스토리지 및 로컬 상태 업데이트
              saveUserSession(latestData);
              
              // 현재 화면이 welcome-screen이고 퀴즈 진행 중이 아니면 화면을 조용히 새로 고침
              const currentScreen = document.querySelector(".app-screen.active");
              if (currentScreen && currentScreen.id === "welcome-screen") {
                state.user.xp = latestData.xp || 0;
                state.user.streak = latestData.streak || 1;
                state.user.progress = latestData.progress || {};
                document.getElementById("xp-count").textContent = state.user.xp;
                document.getElementById("streak-count").textContent = state.user.streak;
                updateDashboardProgress();
                renderTopicCards();
                updateMascotsHTML();
              }
            }
          }
        })
        .catch(err => console.warn("Background session sync skipped:", err));
    }
  } catch (e) {
    console.error("Session auto-login error:", e);
    loadUserData();
  }
}

function checkAndUpdateStreak() {
  if (!state.user.lastActiveDate) return;

  const today = new Date().toDateString();
  const lastActive = new Date(state.user.lastActiveDate).toDateString();

  if (today === lastActive) {
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (lastActive === yesterdayStr) {
    // 스트릭 유지
  } else {
    state.user.streak = 0;
    document.getElementById("streak-count").textContent = 0;
    saveUserScore();
  }
}

// ==========================================
// 10. SCREEN SWITCHER (화면 라우터)
// ==========================================
function navigateTo(screenId) {
  document.querySelectorAll(".app-screen").forEach(screen => {
    screen.classList.remove("active");
  });
  const target = document.getElementById(screenId);
  target.classList.add("active");

  const header = document.querySelector(".app-header");
  if (screenId === "quiz-screen") {
    header.style.display = "none";
  } else {
    header.style.display = "flex";
  }

  if (screenId === "welcome-screen" && state.user.name) {
    setMascotExpression("normal");
    const greetingEl = document.getElementById("mascot-greeting");
    if (greetingEl) {
      greetingEl.textContent = `어서와, ${state.user.name}! 학습을 계속해보자!`;
    }
  }
  updateMascotsHTML();
}

// ==========================================
// 11. QUIZ CONTROLLER (퀴즈 흐름 관리)
// ==========================================
function startQuiz(category) {
  SoundEngine.play("click");
  state.currentCategory = category;
  
  const source = QUIZ_DATA[category]?.questions || [];
  state.currentQuestions = shuffleArray([...source]);
  state.currentQuestionIndex = 0;
  state.hearts = 5;
  state.correctCount = 0;
  state.quizStartTime = new Date();

  updateHeartsDisplay();
  renderQuestion();
  navigateTo("quiz-screen");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateHeartsDisplay() {
  const container = document.getElementById("hearts-container");
  container.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-heart heart-icon" + (i < state.hearts ? " active" : "");
    container.appendChild(icon);
  }
}

function renderQuestion() {
  if (state.currentQuestionIndex >= state.currentQuestions.length) {
    completeQuiz();
    return;
  }

  const question = state.currentQuestions[state.currentQuestionIndex];
  
  state.selectedAnswer = null;
  state.wordBankTarget = [];
  state.isAnswerChecked = false;

  const progressPercent = (state.currentQuestionIndex / state.currentQuestions.length) * 100;
  document.getElementById("quiz-progress-fill").style.width = `${progressPercent}%`;

  document.getElementById("quiz-question-prompt").textContent = question.question || "알맞은 답을 채우세요.";
  setMascotExpression("normal");

  const actionBtn = document.getElementById("quiz-action-btn");
  actionBtn.textContent = "확인";
  actionBtn.className = "disabled-btn btn-3d";
  actionBtn.disabled = true;

  const feedbackBox = document.getElementById("quiz-feedback-box");
  feedbackBox.style.display = "none";
  const footerAction = document.getElementById("quiz-footer-action");
  footerAction.className = "quiz-footer-bar";

  document.getElementById("panel-multiple-choice").style.display = "none";
  document.getElementById("panel-word-bank").style.display = "none";
  document.getElementById("panel-fill-blank").style.display = "none";

  if (question.type === "multiple-choice") {
    renderMultipleChoice(question);
  } else if (question.type === "word-bank") {
    renderWordBank(question);
  } else if (question.type === "fill-blank") {
    renderFillBlank(question);
  }
}

// 1) 객관식 렌더러
function renderMultipleChoice(q) {
  const container = document.getElementById("mc-options-container");
  container.innerHTML = "";
  document.getElementById("panel-multiple-choice").style.display = "block";

  const shuffledOpts = shuffleArray([...q.options]);

  shuffledOpts.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.id = `mc-opt-${idx}`;
    btn.innerHTML = `
      <span class="option-badge">${idx + 1}</span>
      <span class="option-text">${escapeHtml(opt)}</span>
    `;
    btn.addEventListener("click", () => selectMultipleChoiceOption(opt, idx));
    container.appendChild(btn);
  });
}

function selectMultipleChoiceOption(val, index) {
  if (state.isAnswerChecked) return;
  SoundEngine.play("click");
  state.selectedAnswer = val;

  document.querySelectorAll("#mc-options-container .option-btn").forEach(btn => {
    btn.classList.remove("selected");
  });
  document.getElementById(`mc-opt-${index}`).classList.add("selected");

  const actionBtn = document.getElementById("quiz-action-btn");
  actionBtn.className = "secondary-btn btn-3d";
  actionBtn.disabled = false;
  actionBtn.textContent = "제출";
}

// 2) 단어 조합(Word Bank) 렌더러
function renderWordBank(q) {
  const slotsContainer = document.getElementById("wb-slots-container");
  const poolContainer = document.getElementById("wb-pool-container");
  document.getElementById("panel-word-bank").style.display = "block";

  slotsContainer.innerHTML = `<span class="placeholder-text">이곳에 단어 칩을 조립하세요.</span>`;
  poolContainer.innerHTML = "";

  const shuffledWords = shuffleArray([...q.words]);

  shuffledWords.forEach((word, idx) => {
    const chip = document.createElement("button");
    chip.className = "word-chip";
    chip.id = `wb-chip-${idx}`;
    chip.textContent = word;
    chip.addEventListener("click", () => handleWordChipClick(word, idx));
    poolContainer.appendChild(chip);
  });
}

function handleWordChipClick(word, idx) {
  if (state.isAnswerChecked) return;
  SoundEngine.play("click");

  const chipEl = document.getElementById(`wb-chip-${idx}`);
  const targetIdx = state.wordBankTarget.findIndex(item => item.idx === idx);
  const slotsEl = document.getElementById("wb-slots-container");

  if (targetIdx === -1) {
    state.wordBankTarget.push({ word, idx });
    chipEl.classList.add("dragged");
  } else {
    state.wordBankTarget.splice(targetIdx, 1);
    chipEl.classList.remove("dragged");
  }

  if (state.wordBankTarget.length === 0) {
    slotsEl.innerHTML = `<span class="placeholder-text">이곳에 단어 칩을 조립하세요.</span>`;
    
    const actionBtn = document.getElementById("quiz-action-btn");
    actionBtn.className = "disabled-btn btn-3d";
    actionBtn.disabled = true;
    actionBtn.textContent = "확인";
  } else {
    slotsEl.innerHTML = "";
    state.wordBankTarget.forEach((item) => {
      const activeChip = document.createElement("span");
      activeChip.className = "word-chip";
      activeChip.textContent = item.word;
      activeChip.addEventListener("click", () => handleWordChipClick(item.word, item.idx));
      slotsEl.appendChild(activeChip);
    });

    const actionBtn = document.getElementById("quiz-action-btn");
    actionBtn.className = "secondary-btn btn-3d";
    actionBtn.disabled = false;
    actionBtn.textContent = "제출";
  }
}

// 3) 빈칸 채우기 렌더러
function renderFillBlank(q) {
  const sentenceContainer = document.getElementById("fib-sentence-container");
  const optionsContainer = document.getElementById("fib-options-container");
  document.getElementById("panel-fill-blank").style.display = "block";

  const baseSentence = q.sentence.replace("{blank}", `<span class="blank-slot" id="fib-blank-box"></span>`);
  sentenceContainer.innerHTML = baseSentence;

  optionsContainer.innerHTML = "";
  const shuffledOpts = shuffleArray([...q.options]);
  shuffledOpts.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "word-chip";
    btn.id = `fib-opt-${idx}`;
    btn.textContent = opt;
    btn.addEventListener("click", () => selectFillBlankOption(opt, idx));
    optionsContainer.appendChild(btn);
  });
}

function selectFillBlankOption(val, index) {
  if (state.isAnswerChecked) return;
  SoundEngine.play("click");
  state.selectedAnswer = val;

  const box = document.getElementById("fib-blank-box");
  box.innerHTML = `<span class="word-chip">${escapeHtml(val)}</span>`;
  box.classList.add("filled");

  document.querySelectorAll("#fib-options-container .word-chip").forEach(btn => {
    btn.style.opacity = "1";
    btn.style.transform = "none";
  });
  document.getElementById(`fib-opt-${index}`).style.opacity = "0.3";

  const actionBtn = document.getElementById("quiz-action-btn");
  actionBtn.className = "secondary-btn btn-3d";
  actionBtn.disabled = false;
  actionBtn.textContent = "제출";
}

// ==========================================
// 12. CHECK ANSWER & GRADATION (제출 및 채점)
// ==========================================
function checkAnswer() {
  const question = state.currentQuestions[state.currentQuestionIndex];
  let isCorrect = false;

  if (question.type === "multiple-choice" || question.type === "fill-blank") {
    isCorrect = (state.selectedAnswer === question.answer);
  } else if (question.type === "word-bank") {
    const playerArr = state.wordBankTarget.map(item => item.word);
    isCorrect = (JSON.stringify(playerArr) === JSON.stringify(question.answer));
  }

  state.isAnswerChecked = true;

  const footerAction = document.getElementById("quiz-footer-action");
  const feedbackBox = document.getElementById("quiz-feedback-box");
  const fbTitle = document.getElementById("feedback-title");
  const fbMessage = document.getElementById("feedback-message");
  const actionBtn = document.getElementById("quiz-action-btn");

  feedbackBox.style.display = "flex";
  actionBtn.textContent = "계속하기";

  if (isCorrect) {
    SoundEngine.play("correct");
    setMascotExpression("happy");
    state.correctCount++;

    footerAction.classList.add("correct-state");
    fbTitle.textContent = "훌륭해요!";
    fbMessage.textContent = question.explanation || "완벽한 정답입니다!";
  } else {
    SoundEngine.play("incorrect");
    setMascotExpression("sad");
    state.hearts--;
    updateHeartsDisplay();

    const container = document.getElementById("hearts-container");
    container.classList.add("shake");
    setTimeout(() => container.classList.remove("shake"), 500);

    footerAction.classList.add("incorrect-state");
    fbTitle.textContent = "아쉬워요!";
    
    const cleanAnswer = Array.isArray(question.answer) ? question.answer.join(" ") : question.answer;
    fbMessage.innerHTML = `정답은: <strong>${escapeHtml(cleanAnswer)}</strong>입니다.<br>${escapeHtml(question.explanation || "")}`;
  }

  if (state.hearts <= 0) {
    actionBtn.textContent = "학습 종료";
    actionBtn.className = "danger-btn btn-3d";
  } else {
    actionBtn.className = "primary-btn btn-3d";
  }
}

function handleQuizAction() {
  SoundEngine.play("click");

  if (!state.isAnswerChecked) {
    checkAnswer();
  } else {
    if (state.hearts <= 0) {
      alert("하트를 모두 잃었습니다. 다시 시작해보세요!");
      navigateTo("welcome-screen");
      setMascotExpression("normal");
      return;
    }

    state.currentQuestionIndex++;
    renderQuestion();
  }
}

// ==========================================
// 13. COMPLETION LOGIC (레슨 종료 및 통계)
// ==========================================
function completeQuiz() {
  SoundEngine.play("victory");
  setMascotExpression("excited");
  ConfettiEffect.start();

  const totalTimeSec = Math.floor((new Date() - state.quizStartTime) / 1000);
  const minutes = Math.floor(totalTimeSec / 60).toString().padStart(2, "0");
  const seconds = (totalTimeSec % 60).toString().padStart(2, "0");

  const accuracy = Math.round((state.correctCount / state.currentQuestions.length) * 100);
  const alreadyCompleted = (getCategoryProgress(state.currentCategory) === 100);
  const earnedXp = alreadyCompleted ? 0 : (state.currentQuestions.length * 3);

  state.user.xp += earnedXp;

  let streakUpdated = false;
  const todayStr = new Date().toDateString();
  if (state.user.lastActiveDate) {
    const lastActiveStr = new Date(state.user.lastActiveDate).toDateString();
    if (lastActiveStr !== todayStr) {
      state.user.streak++;
      streakUpdated = true;
    }
  } else {
    state.user.streak = 1;
    streakUpdated = true;
  }
  state.user.lastActiveDate = new Date().toISOString();

  localStorage.setItem("wellness_user_xp", state.user.xp);
  localStorage.setItem("wellness_user_streak", state.user.streak);
  localStorage.setItem("wellness_user_last_active", state.user.lastActiveDate);

  saveCategoryProgress(state.currentCategory, 100);

  document.getElementById("res-xp").textContent = earnedXp > 0 ? `+${earnedXp}` : "+0 (재학습)";
  document.getElementById("res-time").textContent = `${minutes}:${seconds}`;
  document.getElementById("res-accuracy").textContent = `${accuracy}%`;

  const streakBoostBox = document.getElementById("streak-boost-box");
  if (streakUpdated || state.user.streak === 1) {
    streakBoostBox.style.display = "flex";
    document.getElementById("streak-boost-title").textContent = `스트릭 ${state.user.streak}일 돌파!`;
  } else {
    streakBoostBox.style.display = "none";
  }

  document.getElementById("xp-count").textContent = state.user.xp;
  document.getElementById("streak-count").textContent = state.user.streak;

  saveUserScore();
  updateDashboardProgress();
  updateMascotsHTML();

  navigateTo("result-screen");
}

// ==========================================
// 14. SETTINGS & CONFLICT SETUP (설정 기능)
// ==========================================
function openSettings() {
  SoundEngine.play("click");
  document.getElementById("settings-modal").classList.add("active");
}

function saveSettings() {
  // 프로필 이름 변경 필드가 제거되었으므로 빈 상태로 둡니다.
}

async function resetAllProgress() {
  if (!state.user || !state.user.name) return;
  
  if (confirm("정말로 모든 학습 진도와 점수를 초기화하시겠습니까? Firebase 서버와 로컬 데이터가 완전히 리셋됩니다.")) {
    state.user.xp = 0;
    state.user.streak = 1;
    state.user.progress = {};
    
    // Save/update to firebase
    if (db) {
      try {
        await db.collection("users").doc(state.user.name).update({
          xp: 0,
          streak: 1,
          progress: {}
        });
        console.log("Firebase progress reset complete");
      } catch (err) {
        console.error("Firebase progress reset error:", err);
      }
    }
    
    // Save/update local
    let localUsers = getLocalUsers();
    if (localUsers[state.user.name]) {
      localUsers[state.user.name].xp = 0;
      localUsers[state.user.name].streak = 1;
      localUsers[state.user.name].progress = {};
      saveLocalUsers(localUsers);
    }
    
    // UI update
    document.getElementById("xp-count").textContent = 0;
    document.getElementById("streak-count").textContent = 1;
    
    // Hide settings modal
    document.getElementById("settings-modal").classList.remove("active");
    
    // Update dashboard progress & cards
    updateDashboardProgress();
    renderTopicCards();
    updateMascotsHTML();
    
    alert("학습 진도가 초기화되었습니다!");
  }
}

// ==========================================
// 15. INITIALIZATION ON LOAD (초기화 진입점)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  ConfettiEffect.init();

  // Firebase 연동 활성화
  initFirebase();

  tryAutoSessionLogin();

  document.getElementById("go-to-signup-btn").addEventListener("click", showSignupBox);
  document.getElementById("go-to-login-btn").addEventListener("click", showLoginBox);
  document.getElementById("signup-submit-btn").addEventListener("click", handleUserSignup);
  document.getElementById("login-submit-btn").addEventListener("click", handleUserLogin);
  
  document.getElementById("login-pw-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserLogin();
  });
  document.getElementById("signup-pw-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleUserSignup();
  });

  document.getElementById("logo-btn").addEventListener("click", () => {
    if (state.user.name) {
      navigateTo("welcome-screen");
      setMascotExpression("normal");
    }
  });

  document.getElementById("settings-toggle-btn").addEventListener("click", openSettings);
  document.getElementById("settings-close-btn").addEventListener("click", () => {
    document.getElementById("settings-modal").classList.remove("active");
  });
  document.getElementById("reset-progress-btn").addEventListener("click", resetAllProgress);

  const dmToggle = document.getElementById("dark-mode-toggle");
  dmToggle.checked = localStorage.getItem("wellness_dark_mode") === "true";
  if (dmToggle.checked) document.body.classList.add("dark-mode");
  dmToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("wellness_dark_mode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("wellness_dark_mode", "false");
    }
  });

  const soundToggle = document.getElementById("sound-toggle");
  soundToggle.addEventListener("change", (e) => {
    state.soundMuted = !e.target.checked;
  });

  document.getElementById("leaderboard-toggle-btn").addEventListener("click", () => {
    document.getElementById("leaderboard-modal").classList.add("active");
    fetchLeaderboard();
  });
  document.getElementById("leaderboard-close-btn").addEventListener("click", () => {
    document.getElementById("leaderboard-modal").classList.remove("active");
  });

  // Dynamic card rendering registers its click event listeners internally, so no static card binding is needed.

  document.getElementById("quiz-back-btn").addEventListener("click", () => {
    if (confirm("진행 중인 퀴즈를 종료하시겠습니까? 현재 진행 상황은 저장되지 않습니다.")) {
      navigateTo("welcome-screen");
      setMascotExpression("normal");
    }
  });

  document.getElementById("quiz-action-btn").addEventListener("click", handleQuizAction);

  document.getElementById("res-home-btn").addEventListener("click", () => {
    ConfettiEffect.stop();
    navigateTo("welcome-screen");
    setMascotExpression("normal");
  });

  document.addEventListener("keydown", (e) => {
    const quizScreen = document.getElementById("quiz-screen");
    if (!quizScreen.classList.contains("active")) return;

    if (e.key === "Enter") {
      const actionBtn = document.getElementById("quiz-action-btn");
      if (!actionBtn.disabled) {
        handleQuizAction();
      }
    } else if (["1", "2", "3", "4"].includes(e.key)) {
      const idx = parseInt(e.key) - 1;
      const mcOption = document.getElementById(`mc-opt-${idx}`);
      if (mcOption && !state.isAnswerChecked) {
        mcOption.click();
      }
      
      const fibOption = document.getElementById(`fib-opt-${idx}`);
      if (fibOption && !state.isAnswerChecked) {
        fibOption.click();
      }
    }
  });
});
