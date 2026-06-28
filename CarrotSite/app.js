// trainingData containing actual training materials for 더웰니스의원
const trainingData = [
  {
    id: "ot-rules",
    category: "ot",
    categoryKo: "취업규칙 & 복무 규정",
    eyebrow: "신입 O.T 복무",
    title: "더웰니스의원 기본 용모 및 출근 규칙",
    badges: ["필수 숙지", "기본 복무"],
    details: {
      items: [
        "**출근 시간 엄수:** 오전 **9시 45분까지 유니폼 환복 및 무전기 착용 완료** 후 출근 보고하는 것을 원칙으로 합니다.",
        "**지각 및 결근 대처:** 피치 못할 사정으로 지각 또는 결근 시, **오전 9시 이전**에 전 직원이 있는 소통채널에 보고해야 하며 관련 증빙 서류를 필수로 제출해야 합니다.",
        "**용모 및 헤어 규정:** 근무 시 항상 정해진 근무복(유니폼)을 착용하고, 머리는 단정하게 **헤어망을 하거나 포니테일**로 묶어야 합니다.",
        "**근무 시간 예절:** 근무 중 개인 용도의 핸드폰 사용, 업무용 PC를 통한 개인 메신저(카카오톡 등) 사용, 업무와 무관한 개인 잡담은 엄격히 금지됩니다."
      ]
    }
  },
  {
    id: "ot-vacation",
    category: "ot",
    categoryKo: "취업규칙 & 복무 규정",
    eyebrow: "인사 규정",
    title: "연차 휴가 및 경조사 휴무 규정",
    badges: ["인사 정보"],
    details: {
      items: [
        "**연차 발생 (1년 미만):** 1달 만근 시 익월에 1개의 연차휴가가 부여되며, 입사 후 2개월 이상 근무 후부터 사용하는 것을 원칙으로 합니다. (주 40시간 미만 근무자는 조정됨)",
        "**연차 신청 절차:** 최소 **1달 전에 신청**하여 대표원장님의 결재를 받아야 하며, 병원 사정에 따라 1달 이내 신청 시 반려될 수 있습니다.",
        "**병가 규정:** 수술 및 입원 치료 시 위로 차 **3일 이내 유급 병가**가 가능하며 진단서/입원확인서가 필수입니다. 일반 외래 진료는 병가 처리가 불가하며 연차로 대체합니다.",
        "**본인 결혼 경조사:** 본인 결혼 시 3일의 휴가가 주어지며 본인 연차를 포함해 **최대 연속 6일**까지 사용 가능합니다."
      ]
    }
  },
  {
    id: "vocab-abb",
    category: "vocab",
    categoryKo: "원내 약어 및 챠팅",
    eyebrow: "약어 정리",
    title: "의료진 지정 약어 및 공간 명칭",
    badges: ["기본 용어"],
    details: {
      doctors: [
        "**대표원장님:** 김혜진 원장님 (H1) / 배성조 원장님 (B1)",
        "**의사지정 표기:** 이수진 원장님 (L1) / 김건주 원장님 (J1) / 김동현 원장님 (K2) / 황선영 원장님 (Y1) / 김이랑 원장님 (E2) / 임수민 원장님 (S1) / 김주환 원장님 (J2)",
        "**R (Random):** 특정 의사 지정이 없는 신규/기존 고객 배정 시 사용"
      ],
      rooms: [
        "**큰시 (큰시술실):** 냉장고 쪽은 **큰시2**, 파우더룸 쪽은 **큰시1**로 세부 구분",
        "**작시:** 작은시술실 / **창시:** 창가시술실",
        "**큰레:** 큰레이저실 / **작레:** 작은레이저실"
      ],
      lasers: [
        "**토닝(LT):** '토' / **루카스:** '루' / **큐라스:** '큐'",
        "**제네시스:** '제' / **클라리티:** '클' / **네오빔:** '네'",
        "**꿀광주사:** '꿀' / **멀티부스터:** '멀' / **필러:** 'F'",
        "**보톡스:** 'B' (국산: 국, 제오민: 제 또는 J) / **쥬베룩볼륨:** '쥬볼'",
        "**마크뷰:** '마' / **메타뷰:** '메' / **경과 체크:** '경체' 또는 'F/U' / **리터치:** 're'"
      ]
    }
  },
  {
    id: "vocab-charting",
    category: "vocab",
    categoryKo: "원내 약어 및 챠팅",
    eyebrow: "챠팅 및 위치",
    title: "핵심 챠팅 코드 및 레이저 장비 위치",
    badges: ["챠팅 규칙"],
    details: {
      chartCodes: [
        "**N) (NEXT 시술):** 다음 내원 시 진행할 시술을 차트에 메모할 때 사용",
        "**T) (TODAY 시술):** 당일 방문하여 진행할 시술을 표기할 때 사용",
        "**V** (VIP 고객):** VIP 고객 우대 표기",
        "**우선** (우선 고객):** 우선 예약자 및 대기 발생 절대 금지 대상 고객 표기",
        "**CP:** 고객 컴플레인(Complain) 발생 이력 표기"
      ],
      positions: [
        "**큰레이저실 오른쪽:** 루카스, 클라리티, IPL",
        "**큰레이저실 왼쪽:** EV, 어븀, FRX",
        "**작은레이저실:** 큐라스, 네오빔, 피코",
        "**바디룸1:** 울쎄라 (이동 가능) / **바디룸3:** 리팟레이저 / **바디룸2:** 어븀",
        "**창가시술실:** 쥬브젠 / **큰시술실:** CO2 / **도수2:** 큐어젯",
        "**도수4번:** 티타늄 / **도수1, 3:** 써마지, 피팅",
        "**작시 통로:** 인모드, 포텐자 / **히든도어 통로:** 올리지오, 슈링크"
      ]
    }
  },
  {
    id: "flow-reception",
    category: "flow",
    categoryKo: "접수 및 원내 FLOW",
    eyebrow: "접수 프로토콜",
    title: "더웰니스의원 환자 접수 FLOW 및 차트 등록",
    badges: ["실무 프로세스"],
    details: {
      greeting: "인사 멘트: '환영합니다, 더웰니스의원입니다. (태블릿 앞에 오시면) 고객님, 예약하셨을까요?'",
      steps: [
        { title: "예약 환자 접수", desc: "태블릿 접수를 안내해 드리고 대기실로 모십니다." },
        { title: "예약 외 방문 (워크인)", desc: "희망 진료 과목을 확인하고 원내 스케줄 대조 후 담당 실장님께 연결합니다. 진료 가능 여부 및 예상 대기 시간을 사전에 안내합니다." },
        { title: "신환 (신규 환자) 차트 등록", desc: "펜차트에서 **[차트관리 - 추가 - 2025초진차트]** 등록 (색소 환자는 2장, 일반 환자는 1장 작성). 추가로 **[피부관리 - 진료기록지 2024]**를 등록하고 저장합니다. 태블릿으로 차트를 띄워 고객 서명을 받은 후 내원 경로를 필수로 수정합니다." },
        { title: "구환 (재방문 환자) 차트 확인", desc: "펜차트 날짜 조회 ➡️ 예약 메모 및 펜차트 정보 더블체크 ➡️ 당일 진행할 시술 및 네모딕 작성 ➡️ 파트(피부/간호)에 맞춰 네모딕 꽂은 후 무전으로 전달합니다." }
      ]
    }
  },
  {
    id: "flow-status-table",
    category: "flow",
    categoryKo: "접수 및 원내 FLOW",
    eyebrow: "실무 관리",
    title: "내원현황표 및 시술현황표 기입 가이드",
    badges: ["중요", "컬러 챠팅"],
    details: {
      statusTable: [
        "**내원시간:** 고객이 병원에 도착하여 태블릿 자동 접수를 완료한 시간 기록.",
        "**대기종료:** [신환] 짐을 맡기고 클렌징하러 이동하는 시간. [구환] 각 팀에서 고객을 룸으로 모셔가는 시간 기록.",
        "**대기사유:** 대기 시간이 15분 이상 지연될 시 대기 사유(방 부족, 손 부족 등)를 필수로 입력합니다.",
        "**매출 행 컬러 규칙 (필수):** 매출액에 따라 현황표 행 색상을 구분하여 마킹합니다.\n  - **100만 원 미만:** 회색\n  - **100만 원 ~ 300만 원 체결:** 하늘색\n  - **300만 원 이상 체결:** 노란색"
      ],
      currentDayTable: [
        "**시작/종료 시간 기입:** 시술실 출입 시 실제 시작 및 종료 시간을 필수로 기입합니다.",
        "**상담내용 표기:** 고객 희망 상담 카테고리, 특이사항(예: '써마지 비슷한 장비 희망, OUT 14시') 기입.",
        "**촬영 여부 마킹:** 촬영 전에는 **(-)** 기호로, 촬영이 완료되면 **(+)** 기호로 즉시 변경 표시합니다."
      ]
    }
  },
  {
    id: "flow-photography",
    category: "flow",
    categoryKo: "접수 및 원내 FLOW",
    eyebrow: "촬영 프로토콜",
    title: "메타뷰 / 마크뷰 촬영 기준 및 거부 환자 대응",
    badges: ["CS 실무"],
    details: {
      standards: [
        "**내국인 신환:** 메타뷰와 마크뷰 **2개 모두 촬영**을 진행합니다.",
        "**외국인 신환:** 원칙적으로 마크뷰 또는 메타뷰 1개만 촬영하되, 피부 상태에 따라 2개 모두 촬영할 수 있습니다.",
        "**촬영 유형별 분류:**\n  - **클마 (클렌징 + 마크뷰):** 색소 치료 고객 대상\n  - **클메 (클렌징 + 메타뷰):** 리프팅, 쥬브젠, 필러, 쥬베룩 볼륨 시술 고객 대상\n  - **클메마 (클렌징 + 메타뷰 + 마크뷰):** 복합 시술 및 정밀 진단 대상 고객",
        "**시술별 촬영 타이밍:**\n  - **보톡스:** 시술실에서 마취 크림을 바르거나 아이싱하기 전에 태블릿으로 임상 사진 촬영\n  - **메타뷰:** 눈밑트콜, 이마트콜, 리프팅, 쥬브젠, 필러, 쥬베룩 볼륨 시술 전\n  - **마크뷰:** 리팟 및 색소 치료 고객 (1회차, 5회차, 10회차 및 원장님 오더 시)"
      ],
      refusal: "**고객이 사진 촬영을 거부하는 경우:**\n정밀 진단을 통한 안전한 치료 플랜 수립과 시술 전후 효과 비교를 위해 필요함을 부드럽게 권유합니다. 그럼에도 최종 거부하실 경우, 차트 및 현황표에 **'거부' 대신 대문자 'X'**로만 기재합니다. ('거부'라는 단어가 고객에게 노출될 시 불편함을 야기할 수 있기 때문입니다.)"
    }
  },
  {
    id: "repot-protocol",
    category: "repot",
    categoryKo: "리팟 & 쥬브젠 실무",
    eyebrow: "리팟 (Repot)",
    title: "원내 1위 시술 - 리팟 레이저 교육 및 데스크 업무",
    badges: ["보증제", "데스크 필수"],
    details: {
      concept: "기미, 흑자, 검버섯을 단 1회 만에 치료하는 것을 목표로 하는 혁신적인 레이저 시술입니다. 더웰니스의원에서는 **'리팟 1년 책임 보증제'**를 시행하여 시술 후 1년 이내 동일 부위 재발 시 본인 부담금 없이 재시술을 진행해 드립니다.",
      packages: "**트리플 리팟 올인원:** 리팟 레이저 1회 + 재발 예방 리팟 재생주사 2회 + 줄기세포 리팟 재생케어(엑소좀) + 홈케어 리팟 전용팩 및 티크림 증정.",
      deskGuide: {
        day1: "**[시술 당일 귀가 시]**\n- 시술 부위에 듀오덤이 밀착하여 잘 붙어 있는지 펜차트 드로잉과 대조하여 꼼꼼하게 확인합니다.\n- 듀오덤 주의사항 안내: '2주 전에는 절대 떼어내지 마시고, 떨어지거나 밀리면 더 크게 오려 덧붙여 주세요. 혹시 완전히 떨어지면 즉시 병원으로 연락 주셔야 합니다.'\n- 듀오덤 부위 가려움증(알러지 반응) 발생 시 즉시 내원하여 처방전 수령을 안내합니다.\n- **3주 후 리팟 듀오덤 제거 예약**을 미리 잡습니다. (가급적 시술 진행한 원장님으로 예약하되 타 원장님 배정 시 고객 동의를 얻습니다.)",
        day2: "**[듀오덤 제거 및 경과체크 당일]**\n- 듀오덤 제거 후 클렌징 ➡️ 마크뷰 촬영 ➡️ 원장님 진료 연결을 신속히 돕습니다. (진료 대기시간 단축을 위해 피부/간호팀과 미리 무전 조율 필수)\n- **기미약 처방 확인:** 처방 유무 확인 후, NC 시스템에서 처방코드에 **'tn'**을 검색하여 **'트라넥엠캡슐(트라넥삼산)'**이 입력되어 있는지 더블체크합니다. (용량 2, 일투수 1, 일수 30 기준. 임산부/수유부 복용 불가)\n- **귀가 안내:** 리팟 홈케어 키트(티크림 2개, 듀제 후 관리방법 카드, SB팩 1장)를 지급하고 사후관리 주의사항을 문자/카카오톡으로 발송합니다. 재생연고(CU크림)를 수시 도포하게 하고, 이중세안 금지 및 미백/비타민C/주름개선 화장품은 자극 예방을 위해 사용을 일절 금지하도록 정중히 안내합니다."
      }
    }
  },
  {
    id: "juvegen-protocol",
    category: "repot",
    categoryKo: "리팟 & 쥬브젠 실무",
    eyebrow: "쥬브젠 (JUVGEN)",
    title: "쥬브젠 3STEP 새살재생술 실무 프로토콜",
    badges: ["3단계 재생", "처방전 수정"],
    details: {
      concept: "이마, 팔자, 마리오네트 주름 등 필러나 일반 주사로 해결하기 힘든 깊은 유착 주름을 개선하는 반영구 주름 복원술입니다.",
      steps: [
        "**STEP 01:** 증상별 쥬브젠 진피재생술 (진피 내부 콜라겐 유도체 주입)",
        "**STEP 02:** 진피 하부 고주파 유착 박리술 (트라이덤 장비 이용)",
        "**STEP 03:** 공기압 유착 박리술 및 재생 물질 주입 ➡️ 줄기세포 플라즈마 애프터 케어로 마무리"
      ],
      deskGuide: [
        "**시술 당일 접수:** 네모딕에 **'클메 -'** 기록 후, 3D 주름 채워짐 효과 비교를 위해 시술 전 **메타뷰 촬영**을 필수로 진행합니다.",
        "**처방전 발행 중요 규칙 (필수):** 항생제 알레르기를 더블체크합니다. 원장님 오더 확인 후 스마트 NC에서 처방내역을 불러옵니다. 이때 **'필러실약속처방' 팝업창이 뜨면 기본 입력값인 '1'을 반드시 '5'(5일분)로 수정 변경**하여 처방전을 저장하고 인쇄해야 합니다.",
        "**사후 해피콜:** 시술 1일 후 안부 전화를 드려 상태를 점검합니다. 간지러움이나 붓기가 심할 경우 병원 카카오톡으로 사진 공유를 받아 원장님 확인을 진행합니다.",
        "**리터치 일정 관리:** 시술 **2달 후 경과 체크 및 리터치 일정**을 예약합니다. (원장님 경과 확인 후 필요한 경우 리터치가 진행되며 리터치 비용은 무료입니다.)"
      ]
    }
  },
  {
    id: "treatment-omakase",
    category: "treatment",
    categoryKo: "시술 및 치료 정보",
    eyebrow: "색소 치료",
    title: "색소 오마카세 올인원 프로그램",
    badges: ["최다 PICK", "커스텀 레이저"],
    details: {
      concept: "고객의 피부 컨디션에 맞춰 매회 의료진이 직접 피부 상태를 진단하고 가장 적합한 맞춤 레이저와 부스팅 관리를 처방하는 1:1 커스터마이징 시그니처 프로그램입니다. 기본 10회 코스를 강력히 추천합니다.",
      packages: {
        basic: "**올인원 베이직 (99만원):** 커스텀 레이저 1종 (루카스, MLA프락셀, 매트릭셀, 네오빔, IPL 중 택1) + 부스팅 케어 1종 (꿀광, 크라이오, 초음파, 비타민 관리 중 택1)",
        dual: "**올인원 듀얼 (150만원 / 최다선택):** 커스텀 레이저 2종 (엑셀브이, 루카스, 매트릭셀, MLA프락셀, 클라리티2, 네오빔 중 택2) + 부스팅 케어 2종 (멀티부스터, 기미주사, 연어주사, LDM, 라라젯, 아쿠아필 등 중 택2)",
        triple: "**올인원 트리플 (190만원):** 커스텀 레이저 3종 + 부스팅 케어 2종 + 포텐자 3회 서비스 추가",
        ev: "**올인원 EV:** 올인원 베이직 레이저/관리 + B1C1 영양 수액 포함 (수액카드 필요 없음)",
        ss: "**올인원 SS수액:** 올인원 베이직 + 환자 맞춤형 수액. **시술 전 수액카드 작성 및 혈압 측정 필수.** 시술 완료 후 대표원장님 수액 오더를 직접 받아야 하며, 원장님 책상이 아닌 시술실로 직접 찾아가서 수액 처방 오더를 전달해야 누락이 발생하지 않습니다."
      },
      deskGuide: [
        "올인원 프로그램은 시술 시작 전, 프로그램 중간(5회차), 마지막 회차 전(10회차)에 **마크뷰 촬영**을 진행하여 효과를 추적합니다.",
        "차트에 원장님이 **n) 마, 클, 꿀** 등과 같이 다음 오더를 기록한 경우, 다음 내원 시 네모딕에 이를 기록해 촬영 및 준비가 누락되지 않도록 해야 합니다.",
        "수액 오더 전달 시 간호팀 누락을 예방하기 위해 **[채널톡 + 닥톡 + 무전]의 트리플 체크**를 수행해야 합니다."
      ]
    }
  },
  {
    id: "treatment-leeds",
    category: "treatment",
    categoryKo: "시술 및 치료 정보",
    eyebrow: "주름 & 탄력",
    title: "리즈타임주사 (눈밑트콜)",
    badges: ["눈밑 재생"],
    details: {
      concept: "눈가 꺼짐, 눈밑 주름, 다크서클 개선을 위해 특별히 개발된 더웰니스의원의 시그니처 주사입니다. '눈밑트콜' 또는 '무제한 콜라겐 리즈타임주사'와 동일한 프로그램입니다.",
      method: "트라이덤 고주파 장비로 눈 밑에 단단하게 유착된 조직 섬유들을 박리한 후, 자가 콜라겐 생성을 강력히 촉진하는 울트라콜200(PDO 콜라겐 분말) 성분을 정교하게 주입하여 눈밑 탄력과 볼륨을 복원합니다.",
      deskGuide: [
        "시술 전 3D 입체 효과 비교를 위해 네모딕에 **'클메 -'** 기록 및 **메타뷰 촬영**을 진행합니다.",
        "귀가 시 처방전 및 시술 후 관리 방법 안내 메시지를 철저하게 체크하고 발송합니다."
      ]
    }
  },
  {
    id: "repot-duoderm",
    category: "repot",
    categoryKo: "리팟 & 쥬브젠 실무",
    eyebrow: "진료실 배정",
    title: "리팟 듀오덤 제거 및 경체 진료실 배정 규칙",
    badges: ["무전 멘트", "실무 규칙"],
    details: {
      duodermOnly: "**단독 듀오덤 제거 환자:** 다른 패키지나 시술 없이 듀오덤 제거 및 원장님 경과체크만 진행할 경우, **데스크에서 즉시 진료실 연결**을 잡아야 합니다. 간호팀 에스코트 후 시술현황표 상태를 '대기'로 즉시 변경하고 원장님께 무전합니다.\n- *무전 예시:* '00원장님, 리팟 진료 1분 대기중입니다.'",
      repotFollowUp: "**리팟 경체 (경과체크) 접수:** 데스크에서 쿨링 마스크(클마) 접수 및 대기실 안내 후 무전 및 시술현황표 입력을 마칩니다.\n- *무전 예시:* '00원장님, 리팟 경체 1분 대기중이십니다.'",
      roomAssign: "**진료실 배정 가이드:** 듀오덤 제거 및 경과체크 환자 배정 시, 상담실이나 시술실 중 비어 있는 방의 위생 상태(베드 시트 교체 유무, 휴지통 비워짐 상태 등)를 미리 확인한 뒤, **재생주사가 놓여 있는지 체크**합니다. 세팅이 되어 있지 않다면 간호팀에 즉시 세팅을 요청한 후 시술현황표에 배정 장소를 입력하고 아래와 같이 무전합니다.\n- *무전 예시:* '00원장님, 리팟 경체 1분 진료실 3번에서 진료 부탁드려요.'"
    }
  }
];

// Quiz Questions & Answers based on 더웰니스의원 실무 가이드
const quizData = [
  {
    question: "더웰니스의원 스태프의 공식 출근 및 유니폼 환복, 무전기 착용 완료 시간은 언제인가요?",
    options: [
      "오전 09:30까지",
      "오전 09:45까지",
      "오전 09:50까지",
      "오전 10:00까지"
    ],
    answerIndex: 1,
    explanation: "더웰니스의원 취업규칙에 따르면, 오전 9시 45분까지 유니폼 환복 및 무전기 착용을 모두 마치고 출근 보고하는 것을 원칙으로 합니다."
  },
  {
    question: "원내 챠팅 및 현황표 작성 시, 100만 원 이상 ~ 300만 원 미만 매출 체결 시 행 컬러는 무슨 색으로 채워야 하나요?",
    options: [
      "회색",
      "하늘색",
      "노란색",
      "연두색"
    ],
    answerIndex: 1,
    explanation: "매출별 행 컬러 구분 기준에 따라 100만 원 미만은 회색, 100만~300만 원은 하늘색, 300만 원 이상 체결 시에는 노란색으로 지정 마킹합니다."
  },
  {
    question: "고객이 메타뷰/마크뷰 사진 촬영을 거부하였을 경우, 차트 및 현황표에 기재해야 하는 올바른 방법은 무엇인가요?",
    options: [
      "'촬영 거부'라고 명확하게 기재한다.",
      "고객의 기분 완화를 위해 빈칸으로 비워둔다.",
      "불편함 유발을 방지하기 위해 단어 대신 대문자 'X'로만 기재한다.",
      "차트 맨 위에 '컴플레인 환자'로 표기한다."
    ],
    answerIndex: 2,
    explanation: "고객에게 '거부'라는 단어가 노출되면 불편함을 야기할 수 있으므로, 부드러운 권유 후에도 촬영을 거부하시는 경우 차트 및 시술현황표에는 '거부' 대신 'X'로 심플하게 기입합니다."
  },
  {
    question: "리팟 시술을 받은 환자가 귀가할 때 처방전 발행 여부를 확인하고, 처방 코드에 'tn'을 검색하여 확인해야 하는 기미 약의 정확한 명칭은 무엇인가요?",
    options: [
      "도란사민",
      "트라넥엠캡슐 (트라넥삼산)",
      "타이레놀",
      "모멘타크림"
    ],
    answerIndex: 1,
    explanation: "리팟 시술 후 기미 반응 예방을 위한 처방약 코드는 tn이며, 약전상 공식 명칭은 '트라넥엠캡슐(트라넥삼산)'입니다. 용량 2, 일투 1, 일수 30 기준으로 나갑니다."
  },
  {
    question: "쥬브젠(JUVGEN) 시술 당일 처방전을 발행할 때 데스크에서 필수로 거쳐야 하는 수정 입력 사항은 무엇인가요?",
    options: [
      "처방 일수를 기본값 1에서 5(5일분)로 반드시 수정한다.",
      "처방 약의 수량을 무조건 2배로 증량한다.",
      "임산부인 경우에도 예외 없이 처방전을 발행한다.",
      "처방 코드에 tn을 추가 입력한다."
    ],
    answerIndex: 0,
    explanation: "쥬브젠 처방전 발행 시 스마트 NC에서 '필러실약속처방' 팝업이 뜨면, 기본 입력 일수인 1일을 반드시 5일(5)로 수정하여 인쇄 및 발행해야 합니다."
  },
  {
    question: "올인원 SS수액 프로그램 진행 시, 데스크에서 누락을 예방하고 간호팀에 완벽한 어레인지를 위해 수행해야 하는 '트리플 체크' 방식이 아닌 것은?",
    options: [
      "채널톡 전송",
      "닥톡(DocTalk) 메신저 기록",
      "직접 전화 통화 및 구두 지시",
      "무전기 전달"
    ],
    answerIndex: 2,
    explanation: "올인원 SS수액의 누락 방지 트리플 체크 시스템은 [채널톡 + 닥톡 + 무전] 세 가지 소통 채널을 모두 가동하여 간호팀에 크로스 체크를 하는 것입니다. 단순 구두 지시는 기록에 남지 않아 제외됩니다."
  }
];

// App State
let activeCategory = 'all';
let searchQuery = '';
let completedCards = new Set();
let currentQuizIndex = 0;
let quizScore = 0;
let quizAnswers = []; // To keep track of user answers

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
  // Theme management
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
  }

  renderCategories();
  renderCards();
  initSearch();
  initQuiz();
  updateProgressBar();
  
  // Tab Navigation logic
  const tabLinks = document.querySelectorAll('.nav-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      tabLinks.forEach(t => t.classList.remove('active'));
      link.classList.add('active');
      
      const target = link.dataset.target;
      if (target === 'training') {
        document.getElementById('learning-portal-section').style.display = 'block';
        document.getElementById('quiz-portal-section').style.display = 'none';
      } else if (target === 'quiz') {
        document.getElementById('learning-portal-section').style.display = 'none';
        document.getElementById('quiz-portal-section').style.display = 'block';
        resetQuiz();
      }
    });
  });
});

// Render Category Navigation
function renderCategories() {
  const container = document.getElementById('category-filter-container');
  if (!container) return;
  
  const categories = [
    { id: 'all', name: '전체 보기', icon: 'M4 6h16M4 12h16M4 18h16' },
    { id: 'treatment', name: '원내 시술 가이드', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'flow', name: '접수 & 원내 FLOW', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'repot', name: '리팟 & 쥬브젠 실무', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'vocab', name: '원내 약어 & 챠팅', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'ot', name: '취업규칙 & O.T', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
  ];
  
  container.innerHTML = categories.map(cat => `
    <button class="category-filter-btn ${activeCategory === cat.id ? 'active' : ''}" data-id="${cat.id}">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="${cat.icon}"></path>
      </svg>
      <span>${cat.name}</span>
    </button>
  `).join('');
  
  // Click handler
  container.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.id;
      renderCards();
    });
  });
}

// Render Training Cards
function renderCards() {
  const container = document.getElementById('cards-display-container');
  if (!container) return;
  
  // Filter data based on category and search query
  const filtered = trainingData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.eyebrow && item.eyebrow.toLowerCase().includes(searchQuery.toLowerCase())) ||
      JSON.stringify(item.details).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-search-alert fade-in-element">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="serif-title" style="font-size: 1.3rem;">검색 결과가 없습니다.</p>
        <p style="font-size: 0.9rem; color: var(--text-secondary);">다른 키워드를 입력해 보시거나, 전체 분류 탭을 선택해 보세요.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(item => createCardHTML(item)).join('');
  
  // Re-attach card toggle & checkbox event listeners
  attachCardEvents();
}

// Generate HTML structure for cards
function createCardHTML(item) {
  const isCompleted = completedCards.has(item.id);
  const badgeHTML = item.badges ? item.badges.map(b => {
    let badgeClass = 'meta-badge';
    if (b === '인기' || b === '중요' || b === '안전 제일' || b === '필수 숙지') badgeClass += ' important';
    if (b === '추천' || b === '피부 재생' || b === '친절 가이드' || b === '보증제') badgeClass += ' sage';
    return `<span class="${badgeClass}">${b}</span>`;
  }).join('') : '';
  
  let expandedContentHTML = '';
  
  // Dynamic HTML generator based on unique keys in trainingData
  if (item.id === 'ot-rules' || item.id === 'ot-vacation' || item.id === 'checklist-consent' || item.id === 'checklist-daily') {
    expandedContentHTML = `
      <div class="detail-block">
        <div class="detail-label">복무 지침 체크리스트</div>
        <div class="interactive-checklist">
          ${item.details.items.map((checkItem, idx) => {
            const checkId = `${item.id}-item-${idx}`;
            const isItemChecked = localStorage.getItem(checkId) === 'true';
            return `
              <label class="checklist-row-item" for="${checkId}">
                <input type="checkbox" class="checkbox-custom-input list-check-trigger" id="${checkId}" ${isItemChecked ? 'checked' : ''} data-item-id="${checkId}">
                <div class="checkbox-custom-box"></div>
                <span class="checklist-item-text">${checkItem.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (item.id === 'vocab-abb') {
    expandedContentHTML = `
      <div class="detail-grid">
        <div class="detail-block" style="grid-column: span 2;">
          <div class="detail-label">의료진 약어 및 표법</div>
          <div class="detail-value">
            <ul class="detail-value-list">
              ${item.details.doctors.map(doc => `<li>${doc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="detail-block">
          <div class="detail-label">시술실 및 레이저실 표기</div>
          <div class="detail-value">
            <ul class="detail-value-list">
              ${item.details.rooms.map(rm => `<li>${rm.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="detail-block">
          <div class="detail-label">레이저 및 시술 약어</div>
          <div class="detail-value">
            <ul class="detail-value-list">
              ${item.details.lasers.map(ls => `<li>${ls.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (item.id === 'vocab-charting') {
    expandedContentHTML = `
      <div class="detail-grid">
        <div class="detail-block">
          <div class="detail-label">주요 챠팅 용어</div>
          <div class="detail-value">
            <ul class="detail-value-list">
              ${item.details.chartCodes.map(code => `<li>${code.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="detail-block">
          <div class="detail-label">원내 장비 및 레이저 위치</div>
          <div class="detail-value">
            <ul class="detail-value-list">
              ${item.details.positions.map(pos => `<li>${pos.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (item.id === 'flow-reception') {
    expandedContentHTML = `
      <div class="detail-block">
        <div class="detail-label">첫인상 인사 가이드</div>
        <div class="detail-value" style="font-weight: 600; color: var(--accent-dark); background-color: var(--accent-light); text-align: center; padding: 18px;">
          ${item.details.greeting}
        </div>
      </div>
      <div class="detail-block">
        <div class="detail-label">환자 접수 절차 (FLOW)</div>
        <div class="protocol-step-list">
          ${item.details.steps.map((step, idx) => `
            <div class="protocol-step-item">
              <div class="step-num-badge">${idx + 1}</div>
              <div class="step-details">
                <div class="step-title-text">${step.title}</div>
                <div class="step-desc-text">${step.desc}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (item.id === 'flow-status-table') {
    expandedContentHTML = `
      <div class="detail-grid">
        <div class="detail-block">
          <div class="detail-label">내원현황표 작성 가이드 (데스크 필수)</div>
          <div class="detail-value" style="line-height:1.7;">
            <ul class="detail-value-list">
              ${item.details.statusTable.map(s => `<li>${s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
            </ul>
          </div>
        </div>
        <div class="detail-block">
          <div class="detail-label">시술현황표 작성 가이드 (실무 관리)</div>
          <div class="detail-value" style="line-height:1.7;">
            <ul class="detail-value-list">
              ${item.details.currentDayTable.map(c => `<li>${c.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (item.id === 'flow-photography') {
    expandedContentHTML = `
      <div class="detail-block">
        <div class="detail-label">메타뷰/마크뷰 촬영 기준 및 촬영법</div>
        <div class="detail-value">
          <ul class="detail-value-list" style="line-height: 1.7;">
            ${item.details.standards.map(std => `<li>${std.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="detail-block">
        <div class="detail-label" style="color: var(--rose-terracotta);">촬영 거부 환자 대응 지침 (CRITICAL)</div>
        <div class="detail-value" style="line-height:1.7; border-left: 3px solid var(--rose-terracotta); background-color: rgba(200,122,122,0.03);">
          ${item.details.refusal}
        </div>
      </div>
    `;
  } else if (item.id === 'repot-protocol') {
    expandedContentHTML = `
      <div class="detail-grid">
        <div class="detail-block">
          <div class="detail-label">리팟 레이저 개요</div>
          <div class="detail-value">${item.details.concept}</div>
        </div>
        <div class="detail-block">
          <div class="detail-label">대표 올인원 프로그램 구성</div>
          <div class="detail-value">${item.details.packages}</div>
        </div>
      </div>
      <div class="detail-block">
        <div class="detail-label">1. 리팟 시술 당일 데스크 업무</div>
        <div class="detail-value" style="line-height:1.7; background-color: var(--accent-light);">${item.details.deskGuide.day1.replace(/\n/g, '<br>')}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">2. 리팟 듀오덤 제거 당일 데스크 업무</div>
        <div class="detail-value" style="line-height:1.7; border-left:3px solid var(--medical-sage);">${item.details.deskGuide.day2.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  } else if (item.id === 'juvegen-protocol') {
    expandedContentHTML = `
      <div class="detail-grid">
        <div class="detail-block" style="grid-column: span 2;">
          <div class="detail-label">쥬브젠 새살재생술 정의</div>
          <div class="detail-value">${item.details.concept}</div>
        </div>
      </div>
      <div class="detail-block">
        <div class="detail-label">쥬브젠 3STEP 재생 단계</div>
        <div class="protocol-step-list">
          ${item.details.steps.map((step, idx) => `
            <div class="protocol-step-item">
              <div class="step-num-badge">${idx + 1}</div>
              <div class="step-details">
                <div class="step-desc-text" style="font-weight: 500; color: var(--text-primary);">${step}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="detail-block">
        <div class="detail-label" style="color: var(--rose-terracotta);">쥬브젠 데스크 가이드 및 처방전 발급 규칙 (중요)</div>
        <div class="detail-value" style="line-height:1.7;">
          <ul class="detail-value-list">
            ${item.details.deskGuide.map(guide => `<li>${guide.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  } else if (item.id === 'treatment-omakase') {
    expandedContentHTML = `
      <div class="detail-block">
        <div class="detail-label">색소 오마카세 프로그램 개요</div>
        <div class="detail-value">${item.details.concept}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">오마카세 라인업 구성 및 수액 오더법</div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="background:var(--bg-primary); padding:14px 18px; border-radius:8px; border:1.5px solid var(--border-light);">
            <strong>올인원 베이직 (99만):</strong> ${item.details.packages.basic}
          </div>
          <div style="background:var(--bg-primary); padding:14px 18px; border-radius:8px; border:1.5px solid var(--accent-primary);">
            <strong>올인원 듀얼 (150만):</strong> ${item.details.packages.dual}
          </div>
          <div style="background:var(--bg-primary); padding:14px 18px; border-radius:8px; border:1.5px solid var(--border-light);">
            <strong>올인원 트리플 (190만):</strong> ${item.details.packages.triple}
          </div>
          <div style="background:var(--bg-primary); padding:14px 18px; border-radius:8px; border:1.5px solid var(--border-light);">
            <strong>올인원 EV (수액 포함):</strong> ${item.details.packages.ev}
          </div>
          <div style="background:rgba(200,122,122,0.03); padding:14px 18px; border-radius:8px; border:1.5px solid var(--rose-terracotta);">
            <strong>올인원 SS수액 (맞춤 수액 오더):</strong> ${item.details.packages.ss.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </div>
        </div>
      </div>
      <div class="detail-block">
        <div class="detail-label">데스크 실무 체크포인트</div>
        <div class="detail-value" style="line-height:1.7;">
          <ul class="detail-value-list">
            ${item.details.deskGuide.map(guide => `<li>${guide.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  } else if (item.id === 'treatment-leeds') {
    expandedContentHTML = `
      <div class="detail-grid">
        <div class="detail-block">
          <div class="detail-label">리즈타임주사 개요</div>
          <div class="detail-value">${item.details.concept}</div>
        </div>
        <div class="detail-block">
          <div class="detail-label">시술 방식 및 원리</div>
          <div class="detail-value">${item.details.method}</div>
        </div>
      </div>
      <div class="detail-block">
        <div class="detail-label">데스크 챙길 것</div>
        <div class="detail-value" style="line-height: 1.7;">
          <ul class="detail-value-list">
            ${item.details.deskGuide.map(guide => `<li>${guide.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  } else if (item.id === 'repot-duoderm') {
    expandedContentHTML = `
      <div class="detail-block">
        <div class="detail-label">1. 단독 듀오덤 제거 환자 진료 연결</div>
        <div class="detail-value" style="line-height: 1.7;">${item.details.duodermOnly.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label">2. 리팟 경체 (경과체크) 환자 대기 안내</div>
        <div class="detail-value" style="line-height: 1.7;">${item.details.repotFollowUp.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
      </div>
      <div class="detail-block">
        <div class="detail-label" style="color: var(--rose-terracotta);">3. 진료실 배정 가이드</div>
        <div class="detail-value" style="line-height: 1.7; border-left: 3px solid var(--rose-terracotta);">${item.details.roomAssign.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
      </div>
    `;
  }

  return `
    <article class="readable-card fade-in-element ${isCompleted ? 'completed' : ''}" id="card-el-${item.id}">
      <div class="readable-card-header">
        <div class="card-title-group">
          <span class="card-eyebrow">${item.categoryKo} · ${item.eyebrow}</span>
          <h3 class="card-main-title serif-title">${item.title}</h3>
          <div class="card-meta-badges">
            ${badgeHTML}
          </div>
        </div>
        <button class="card-chevron-btn" aria-label="상세 보기 접고 펴기" data-card-id="${item.id}">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
          </svg>
        </button>
      </div>
      
      <div class="card-body-expandable" id="card-body-${item.id}">
        ${expandedContentHTML}
        
        <div class="card-status-indicator">
          <span class="status-indicator-text">${isCompleted ? '학습 완료됨' : '아직 학습하지 않음'}</span>
          <button class="card-complete-btn complete-toggle-btn" data-card-id="${item.id}">
            ${isCompleted ? '학습 취소' : '학습 완료로 표시'}
          </button>
        </div>
      </div>
    </article>
  `;
}

// Attach event listeners to generated cards
function attachCardEvents() {
  // Chevron toggle expand/collapse
  document.querySelectorAll('.card-chevron-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cardId = btn.dataset.cardId;
      const card = document.getElementById(`card-el-${cardId}`);
      
      if (card.classList.contains('expanded')) {
        card.classList.remove('expanded');
        document.getElementById(`card-body-${cardId}`).style.maxHeight = '0';
      } else {
        document.querySelectorAll('.readable-card.expanded').forEach(expCard => {
          expCard.classList.remove('expanded');
          expCard.querySelector('.card-body-expandable').style.maxHeight = '0';
        });
        
        card.classList.add('expanded');
        const bodyEl = document.getElementById(`card-body-${cardId}`);
        bodyEl.style.maxHeight = bodyEl.scrollHeight + 150 + 'px';
      }
    });
  });
  
  // Complete toggle click
  document.querySelectorAll('.complete-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const cardId = btn.dataset.cardId;
      const card = document.getElementById(`card-el-${cardId}`);
      const indicatorText = card.querySelector('.status-indicator-text');
      
      if (completedCards.has(cardId)) {
        completedCards.delete(cardId);
        card.classList.remove('completed');
        btn.innerText = '학습 완료로 표시';
        indicatorText.innerText = '아직 학습하지 않음';
        localStorage.removeItem(`complete-status-${cardId}`);
      } else {
        completedCards.add(cardId);
        card.classList.add('completed');
        btn.innerText = '학습 취소';
        indicatorText.innerText = '학습 완료됨';
        localStorage.setItem(`complete-status-${cardId}`, 'true');
      }
      updateProgressBar();
    });
  });
  
  // Checklist triggers inside card
  document.querySelectorAll('.list-check-trigger').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const itemId = checkbox.dataset.itemId;
      localStorage.setItem(itemId, checkbox.checked);
      
      const parentCard = checkbox.closest('.readable-card');
      const checkboxes = parentCard.querySelectorAll('.list-check-trigger');
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      
      const cardId = parentCard.querySelector('.complete-toggle-btn').dataset.cardId;
      const completeBtn = parentCard.querySelector('.complete-toggle-btn');
      const indicatorText = parentCard.querySelector('.status-indicator-text');
      
      if (allChecked && !completedCards.has(cardId)) {
        completedCards.add(cardId);
        parentCard.classList.add('completed');
        completeBtn.innerText = '학습 취소';
        indicatorText.innerText = '학습 완료됨';
        localStorage.setItem(`complete-status-${cardId}`, 'true');
        updateProgressBar();
      }
    });
  });
  
  // Restore completed cards from localStorage
  trainingData.forEach(item => {
    if (localStorage.getItem(`complete-status-${item.id}`) === 'true') {
      completedCards.add(item.id);
      const card = document.getElementById(`card-el-${item.id}`);
      if (card) {
        card.classList.add('completed');
        const btn = card.querySelector('.complete-toggle-btn');
        if (btn) btn.innerText = '학습 취소';
        const indicator = card.querySelector('.status-indicator-text');
        if (indicator) indicator.innerText = '학습 완료됨';
      }
    }
  });
}

// Search Logic
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCards();
  });
}

// Update Progress Bar
function updateProgressBar() {
  const progressText = document.getElementById('progress-percentage-text');
  const progressBarFill = document.getElementById('progress-bar-fill-el');
  if (!progressText || !progressBarFill) return;
  
  const totalCount = trainingData.length;
  const completedCount = completedCards.size;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  progressText.innerText = `${percentage}% 완료`;
  progressBarFill.style.width = `${percentage}%`;
}

// Quiz System Logic
function initQuiz() {
  const startBtn = document.getElementById('start-quiz-btn');
  if (!startBtn) return;
  
  startBtn.addEventListener('click', startQuiz);
}

function startQuiz() {
  currentQuizIndex = 0;
  quizScore = 0;
  quizAnswers = [];
  
  document.getElementById('quiz-intro-box').style.display = 'none';
  document.getElementById('quiz-active-box').style.display = 'block';
  document.getElementById('quiz-results-box').style.display = 'none';
  
  showQuizQuestion();
}

function showQuizQuestion() {
  const questionData = quizData[currentQuizIndex];
  
  document.getElementById('quiz-question-num').innerText = `질문 ${currentQuizIndex + 1} / ${quizData.length}`;
  document.getElementById('quiz-question-text').innerText = questionData.question;
  
  const optionsList = document.getElementById('quiz-options-list');
  optionsList.innerHTML = questionData.options.map((option, idx) => `
    <button class="quiz-option-button" data-idx="${idx}">
      ${option}
    </button>
  `).join('');
  
  document.getElementById('quiz-next-btn').style.display = 'none';
  document.getElementById('quiz-explanation-container').style.display = 'none';
  
  optionsList.querySelectorAll('.quiz-option-button').forEach(btn => {
    btn.addEventListener('click', () => {
      if (document.querySelector('.quiz-option-button.correct') || document.querySelector('.quiz-option-button.incorrect')) {
        return;
      }
      
      const selectedIdx = parseInt(btn.dataset.idx);
      const correctIdx = questionData.answerIndex;
      
      if (selectedIdx === correctIdx) {
        btn.classList.add('correct');
        quizScore++;
        quizAnswers.push({ correct: true, selected: selectedIdx });
      } else {
        btn.classList.add('incorrect');
        optionsList.querySelector(`[data-idx="${correctIdx}"]`).classList.add('correct');
        quizAnswers.push({ correct: false, selected: selectedIdx });
      }
      
      const expText = document.getElementById('quiz-explanation-text');
      expText.innerHTML = `<strong>정답 해설:</strong> ${questionData.explanation}`;
      document.getElementById('quiz-explanation-container').style.display = 'block';
      
      const nextBtn = document.getElementById('quiz-next-btn');
      if (currentQuizIndex === quizData.length - 1) {
        nextBtn.innerText = '퀴즈 종료 및 결과 보기';
      } else {
        nextBtn.innerText = '다음 질문으로';
      }
      nextBtn.style.display = 'block';
    });
  });
  
  const nextBtn = document.getElementById('quiz-next-btn');
  const newNextBtn = nextBtn.cloneNode(true);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
  
  newNextBtn.addEventListener('click', () => {
    if (currentQuizIndex === quizData.length - 1) {
      showQuizResults();
    } else {
      currentQuizIndex++;
      showQuizQuestion();
    }
  });
}

function showQuizResults() {
  document.getElementById('quiz-active-box').style.display = 'none';
  document.getElementById('quiz-results-box').style.display = 'block';
  
  const scoreText = document.getElementById('quiz-score-summary');
  const feedbackText = document.getElementById('quiz-feedback-text');
  
  scoreText.innerHTML = `총 <strong>${quizData.length}</strong>문제 중 <strong>${quizScore}</strong>문제를 맞추셨습니다!`;
  
  const passRatio = quizScore / quizData.length;
  if (passRatio === 1) {
    feedbackText.innerText = "완벽합니다! 더웰니스의원의 O.T 규칙, 챠팅 기호, 촬영 기준, 리팟 및 쥬브젠 시술 프로토콜을 완벽하게 숙지하고 계십니다. 바로 업무에 투입되셔도 훌륭한 프리미엄 스태프로 활약하실 것입니다.";
  } else if (passRatio >= 0.6) {
    feedbackText.innerText = "훌륭합니다! 대부분의 실무 지식을 잘 파악하고 계십니다. 특히 리팟 듀오덤 제거 및 쥬브젠 처방전 수정 규칙 등을 다시 복습하여 실수를 방지해 보세요.";
  } else {
    feedbackText.innerText = "스태프 업무 숙지를 위해 추가적인 학습이 권장됩니다. 원내 FLOW, 촬영 기준 및 리팟 데스크 챙길 것 카드들의 상세 가이드를 다시 정독해 주세요.";
  }
  
  const restartBtn = document.getElementById('restart-quiz-btn');
  const newRestartBtn = restartBtn.cloneNode(true);
  restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
  newRestartBtn.addEventListener('click', startQuiz);
}

function resetQuiz() {
  document.getElementById('quiz-intro-box').style.display = 'flex';
  document.getElementById('quiz-active-box').style.display = 'none';
  document.getElementById('quiz-results-box').style.display = 'none';
}
