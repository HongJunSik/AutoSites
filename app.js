/**
 * DermDesk Hub - Application Logic
 * 피부과 데스크 코디네이터 자동화 포털 핵심 스크립트
 */

// ==================== 0. GLOBAL CONFIG & SYSTEM INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
  // Lucide Icons 초기화
  lucide.createIcons();
  
  // 모달 상태 초기화 및 닫기 바인딩
  initModals();
  
  // 1. 주의사항 생성기 초기화
  initPrecautions();
  
  // 3. QR 생성기 초기화
  initQRGenerator();
  
  // 4. 타이머 복구
  restoreActiveTimers();
  
  // 5. 대기자 리스트 복구 및 렌더링
  renderWaitingPatients();
  
  // 6. 의학 약어 사전 초기화
  initDictionary();
  
  // 7. Supabase 대시보드 카드 로드
  loadDashboardCards();
});

// Toast 알림 함수
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast-notify');
  const toastText = document.getElementById('toast-message-text');
  const toastIcon = document.getElementById('toast-icon-render');
  
  toastText.textContent = message;
  
  if (isSuccess) {
    toastIcon.setAttribute('data-lucide', 'check-circle');
    toastIcon.style.color = '#D4AF37';
  } else {
    toastIcon.setAttribute('data-lucide', 'alert-circle');
    toastIcon.style.color = '#E74C3C';
  }
  lucide.createIcons();
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 모달 제어 함수
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    // QR코드 탭의 경우 모달이 열릴 때 첫 QR코드를 렌더링해야 크기가 잡힘
    if (modalId === 'modal-qrcode') {
      setTimeout(generateQRCode, 100);
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

function closeModalOnOverlay(event, modalId) {
  // 모달 콘텐츠 바깥 영역(오버레이)을 눌렀을 때만 닫히도록 처리
  if (event.target.classList.contains('modal-overlay')) {
    closeModal(modalId);
  }
}

function initModals() {
  // ESC 키 클릭 시 활성화된 모달 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeOverlay = document.querySelector('.modal-overlay.active');
      if (activeOverlay) {
        activeOverlay.classList.remove('active');
      }
    }
  });
}


// ==================== 1. 시술별 주의사항 템플릿 생성기 ====================

// 주의사항 데이터 정의
const PRECAUTIONS_DATA = {
  botox: [
    {
      name: "사각턱/주름 보톡스",
      text: "[더웰니스 의원] 턱/주름 보톡스 시술 후 주의사항 안내\n\n안녕하세요, {이름} 고객님. 오늘 받으신 보톡스 시술 후 주의사항을 안내해 드립니다.\n\n1. 시술 후 3~4시간 동안은 주사 부위 약물이 고루 퍼지도록 눕지 않고 바른 자세를 유지해 주세요.\n2. 세안 및 화장은 시술 후 2~3시간 이후부터 가볍게 가능합니다.\n3. 주사 부위에 약간의 멍이나 붓기, 통증이 생길 수 있으나 며칠 내에 자연스럽게 가라앉습니다.\n4. 시술 후 1주일 동안은 사우나, 찜질방, 심한 운동, 음주 및 흡연을 피해 주세요.\n5. 사각턱 보톡스의 경우 시술 후 딱딱하거나 질긴 음식(오징어, 껌 등)은 1달 정도 피하셔야 효과가 오래 지속됩니다.\n\n불편한 점이 있으시면 언제든지 병원으로 문의 주시기 바랍니다. 감사합니다."
    },
    {
      name: "입술/이마 필러",
      text: "[더웰니스 의원] 필러 시술 후 주의사항 안내\n\n안녕하세요, {이름} 고객님. 오늘 필러 시술 부위가 예쁘게 안착할 수 있도록 주의사항을 안내 드립니다.\n\n1. 시술 후 2주 동안은 시술 부위에 강한 압력이나 마찰을 피하셔야 모양 변형이 없습니다. (경락 마사지, 엎드려 자기 금지)\n2. 세안 및 화장은 시술 후 바로 가능하나 자극적이지 않게 살살 해주세요.\n3. 필러 안착 기간인 1~2주간은 음주, 흡연, 사우나, 찜질방 및 격렬한 운동을 삼가주세요. (염증 예방)\n4. 시술 부위에 멍, 붓기, 가벼운 통증이 생길 수 있으나 시간이 지남에 따라 점차 호전됩니다.\n5. [경고] 시술 부위가 점차 붉어지거나 검붉은 색으로 변하고, 통증이 악화되거나 수포가 생기는 경우 지체하지 마시고 즉시 병원(혹은 응급실)으로 연락해 내원해 주셔야 합니다.\n\n늘 정성을 다하는 클리닉이 되겠습니다. 좋은 하루 보내세요."
    }
  ],
  laser: [
    {
      name: "레이저 토닝 / IPL",
      text: "[더웰니스 의원] 레이저 토닝 시술 후 주의사항 안내\n\n안녕하세요, {이름} 고객님. 맑고 깨끗한 피부를 위한 레이저 토닝 후 주의사항입니다.\n\n1. 시술 후 피부가 일시적으로 붉어지거나 건조함을 느낄 수 있습니다. 수분 크림과 재생 크림을 평소보다 충분히 발라 주세요.\n2. 외출 시 반드시 SPF 30 이상의 자외선 차단제(선크림)를 꼼꼼히 발라 주세요. 자외선 노출 시 색소 침착이 재발할 수 있습니다.\n3. 세안 시 알갱이가 든 스크럽제나 필링제 사용은 최소 1주일간 피해주시고 미온수로 부드럽게 세안하세요.\n4. 가벼운 화장은 시술 후 바로 가능합니다.\n5. 사우나, 격한 운동, 음주 등 체온을 높이는 활동은 3~5일간 삼가주세요.\n\n다음 예약일에 뵙겠습니다. 감사합니다."
    },
    {
      name: "CO2 / 점·편평사마귀 제거",
      text: "[더웰니스 의원] 점/사마귀 제거 시술 후 주의사항\n\n안녕하세요, {이름} 고객님. 오늘 점/사마귀 제거 후 피부 상처가 흉터 없이 회복될 수 있도록 관리법을 안내 드립니다.\n\n1. 시술 부위에 붙여드린 듀오덤(재생테이프)은 하얗게 부풀어 오르더라도 진물이 새어나오기 전까지는 2~3일간 떼지 말고 유지해 주세요.\n2. 테이프가 떨어지면 가볍게 물기를 닦고 새 듀오덤을 붙여주세요. (보통 7~10일간 유지)\n3. 듀오덤을 붙인 상태에서는 가벼운 물세안이 가능하나 물이 테이프 안으로 들어가지 않게 주의하세요.\n4. 상처 부위가 붉게 새살이 돋아나면 테이프를 떼고 자외선 차단제(선크림)를 수시로 발라 붉은 자국이 색소침착으로 남지 않게 관리해야 합니다.\n5. 딱지가 앉은 경우 억지로 떼어내지 마시고 자연 탈락되도록 놔두세요.\n\n오늘도 방문해 주셔서 감사합니다."
    }
  ],
  booster: [
    {
      name: "리쥬란 힐러 (힐러/아이)",
      text: "[더웰니스 의원] 리쥬란 힐러 시술 후 주의사항 안내\n\n안녕하세요, {이름} 고객님. 피부 속 탄력과 광채를 채우는 리쥬란 힐러 후 주의사항입니다.\n\n1. 시술 직후 엠보싱 현상(모기 물린 것처럼 볼록하게 올라오는 현상)과 미세한 주삿바늘 자국, 멍이 발생할 수 있습니다. 이는 보통 2~3일 이내, 길게는 1주일 내에 자연스럽게 사라집니다.\n2. 시술 부위에 손을 대거나 긁지 마시고 가벼운 세안과 메이크업은 시술 후 4~5시간 이후 권장합니다.\n3. 일주일 동안은 과도한 음주, 사우나, 흡연, 땀이 많이 나는 격렬한 운동을 자제해 주세요.\n4. 피부 재생을 돕기 위해 수분 섭취를 늘려 주시고, 재생 크림과 자외선 차단제를 꼼꼼히 도포해 주세요.\n\n궁금한 점이 있으시면 데스크로 연락 주세요. 감사합니다."
    },
    {
      name: "엑소좀 / 아기주사 스킨부스터",
      text: "[더웰니스 의원] 스킨부스터 시술 후 주의사항 안내\n\n안녕하세요, {이름} 고객님. 오늘 시술받으신 스킨부스터 주의사항 안내 드립니다.\n\n1. 시술 당일은 가벼운 세안만 하시고 기능성 화장품(레티놀, 비타민C, 고함량 필링 제품)의 사용은 3일간 중단해 주세요.\n2. MTS나 미세바늘 시술로 인해 얼굴에 붉은 기와 미세한 통증이 1~2일간 지속될 수 있으며 진정 팩을 해주시면 조기 진정에 도움됩니다.\n3. 외출 시 자외선 차단은 필수이며 상처가 아물 때까지 음주 및 땀을 흘리는 운동은 피해 주세요.\n4. 재생 크림을 아침저녁으로 넉넉히 발라 피부 회복 속도를 높여 주세요.\n\n감사합니다."
    }
  ],
  lifting: [
    {
      name: "슈링크 / 울쎄라 (HIFU)",
      text: "[더웰니스 의원] HIFU 초음파 리프팅 시술 후 주의사항 안내\n\n안녕하세요, {이름} 고객님. 더욱 탄력 있는 라인을 위한 리프팅 시술 후 안내입니다.\n\n1. 시술 후 일시적으로 욱신거리는 뻐근한 통증, 붓기, 얼얼한 느낌이 1~2주간 이어질 수 있으며 이는 피부 속 근막층에 열 에너지가 정상적으로 반응하고 있는 과정입니다.\n2. 피부 온도를 따뜻하게 유지해야 콜라겐 생성에 더 도움이 되므로 시술 후 3일간은 너무 차가운 냉수 세안이나 아이스팩은 피해 주시는 것이 좋습니다. 미온수 세안을 권장합니다.\n3. 시술 후 일시적인 트러블이나 건조증이 생길 수 있으니 보습 제품을 듬뿍 발라 주세요.\n4. 일주일 동안 음주, 흡연, 사우나는 리프팅 효과를 저해할 수 있으므로 피하셔야 합니다.\n\n안내된 주의사항을 지켜 시술 효과를 극대화해 보세요. 감사합니다."
    },
    {
      name: "올리지오 / 인모드 (RF 고주파)",
      text: "[더웰니스 의원] 고주파 리프팅 시술 후 주의사항 안내\n\n안녕하세요, {이름} 고객님. 오늘 시술받으신 리프팅 주의사항 안내 드립니다.\n\n1. 인모드(FORMA/MINI FX) 시술의 경우 음압 흡입으로 인해 붉은 멍 자국(부항 자국 비슷함)이 남을 수 있으며 이는 보통 3~7일 사이에 서서히 사라집니다.\n2. 얼굴에 약간의 온기가 남아 있는 상태가 시술 효과를 높여주므로 찬물 세안보다는 미온수 세안을 해주세요.\n3. 자극받은 피부 보호를 위해 외출 시 선크림을 필수적으로 바르시고 1주일 동안은 필링이나 경락 마사지를 피하세요.\n4. 일시적인 피부 건조증 예방을 위해 보습 크림을 충분히 도포해 주시기 바랍니다.\n\n감사합니다."
    }
  ],
  peeling: [
    {
      name: "아쿠아필 / 각질 스케일링",
      text: "[더웰니스 의원] 아쿠아필 피부관리 시술 후 주의사항\n\n안녕하세요, {이름} 고객님. 모공 청소 및 수분 충전을 위한 아쿠아필 관리 후 주의사항입니다.\n\n1. 시술 당일 일시적으로 피부가 붉어질 수 있으나 몇 시간 내에 호전되니 안심하셔도 됩니다.\n2. 모공 속 노폐물과 피지가 청소된 상태이므로 화장품 흡수율이 높습니다. 고영양/수분 에센스나 수분 크림을 가득 공급해 주세요.\n3. 피지선 자극으로 인해 일시적으로 좁쌀 여드름이 올라올 수 있으나 며칠 내 소멸합니다.\n4. 시술 후 2~3일간은 사우나와 뜨거운 목욕을 피해주시고 스크럽제를 이용해 얼굴을 세게 밀지 마세요.\n\n꾸준한 홈케어로 빛나는 피부를 유지하세요."
    }
  ]
};

let selectedCategory = 'botox';

function initPrecautions() {
  // 초기 탭 로드 및 드롭다운 바인딩
  selectTemplateCategory('botox');
}

function selectTemplateCategory(category) {
  selectedCategory = category;
  
  // 탭 활성화 클래스 변경
  const tabs = document.querySelectorAll('#precautions-tabs .tab-btn');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  
  const activeTab = document.getElementById(`tab-${category}`);
  if (activeTab) activeTab.classList.add('active');
  
  // 드롭다운 업데이트
  const select = document.getElementById('precautions-detail-select');
  select.innerHTML = '';
  
  const options = PRECAUTIONS_DATA[category];
  options.forEach((opt, idx) => {
    const el = document.createElement('option');
    el.value = idx;
    el.textContent = opt.name;
    select.appendChild(el);
  });
  
  updateTemplate();
}

function updateTemplate() {
  const select = document.getElementById('precautions-detail-select');
  const patientInput = document.getElementById('precautions-patient-name');
  const viewArea = document.getElementById('template-content-view');
  
  if (!select.childNodes.length) return;
  
  const selectedIndex = select.value;
  const rawText = PRECAUTIONS_DATA[selectedCategory][selectedIndex].text;
  
  let patientName = patientInput.value.trim();
  if (!patientName) {
    patientName = '000'; // 기본 플레이스홀더 이름
  }
  
  // {이름} 치환
  const formattedText = rawText.replace(/{이름}/g, patientName);
  viewArea.textContent = formattedText;
}

function copyTemplateToClipboard() {
  const viewArea = document.getElementById('template-content-view');
  const text = viewArea.textContent;
  
  navigator.clipboard.writeText(text).then(() => {
    showToast('주의사항 메세지가 클립보드에 복사되었습니다! 💬');
  }).catch(err => {
    showToast('복사에 실패했습니다. 직접 복사해 주세요.', false);
  });
}


// ==================== 2. 결제 금액 계산기 ====================

function calculatePrice() {
  const basePrice = parseFloat(document.getElementById('calc-base-price').value) || 0;
  const qty = parseInt(document.getElementById('calc-qty').value) || 1;
  const discount = parseFloat(document.getElementById('calc-discount').value) || 0;
  
  // 1. 수량 반영
  let total = basePrice * qty;
  // 2. 할인 적용
  if (discount > 0) {
    total = total * (1 - (discount / 100));
  }
  
  // 3. 소수점 이하 내림 및 부가세 10%
  const discountedBase = Math.floor(total);
  const vat = Math.floor(discountedBase * 0.1);
  const finalPay = discountedBase + vat;
  
  // 화면 렌더링
  document.getElementById('res-discounted-base').textContent = formatCurrency(discountedBase);
  document.getElementById('res-vat').textContent = formatCurrency(vat);
  document.getElementById('res-total-pay').textContent = formatCurrency(finalPay);
  
  // 카드/현금 금액이 채워져 있을 경우 남은 금액 분할 계산 업데이트
  updateRemainingBalance(finalPay);
}

// 화폐 포맷팅 (예: 1,000,000 원)
function formatCurrency(value) {
  return value.toLocaleString('ko-KR') + ' 원';
}

function calculateSplitPay(changedType) {
  const finalPayText = document.getElementById('res-total-pay').textContent;
  const finalPay = parseInt(finalPayText.replace(/[^0-9]/g, '')) || 0;
  
  const cardInput = document.getElementById('calc-card-pay');
  const cashInput = document.getElementById('calc-cash-pay');
  
  let cardVal = parseInt(cardInput.value) || 0;
  let cashVal = parseInt(cashInput.value) || 0;
  
  if (changedType === 'card') {
    // 카드를 입력했으면 나머지 전액을 현금에 배정
    let remaining = finalPay - cardVal;
    if (remaining < 0) remaining = 0;
    cashInput.value = remaining;
  } else if (changedType === 'cash') {
    // 현금을 입력했으면 나머지 전액을 카드에 배정
    let remaining = finalPay - cashVal;
    if (remaining < 0) remaining = 0;
    cardInput.value = remaining;
  }
  
  updateRemainingBalance(finalPay);
}

function updateRemainingBalance(finalPay) {
  const cardVal = parseInt(document.getElementById('calc-card-pay').value) || 0;
  const cashVal = parseInt(document.getElementById('calc-cash-pay').value) || 0;
  const warningRow = document.getElementById('row-split-warning');
  const remainingSpan = document.getElementById('res-remaining-pay');
  
  const sum = cardVal + cashVal;
  const diff = finalPay - sum;
  
  if (diff !== 0 && (cardVal > 0 || cashVal > 0)) {
    warningRow.style.display = 'flex';
    remainingSpan.textContent = formatCurrency(diff);
  } else {
    warningRow.style.display = 'none';
  }
}

function resetCalculator() {
  document.getElementById('calc-base-price').value = '';
  document.getElementById('calc-qty').value = '1';
  document.getElementById('calc-discount').value = '0';
  document.getElementById('calc-card-pay').value = '';
  document.getElementById('calc-cash-pay').value = '';
  
  calculatePrice();
  showToast('계산기가 초기화되었습니다.');
}

function copyCalcToClipboard() {
  const basePrice = document.getElementById('calc-base-price').value || '0';
  const qty = document.getElementById('calc-qty').value || '1';
  const discount = document.getElementById('calc-discount').value || '0';
  
  const baseDiscText = document.getElementById('res-discounted-base').textContent;
  const vatText = document.getElementById('res-vat').textContent;
  const totalText = document.getElementById('res-total-pay').textContent;
  
  const cardVal = document.getElementById('calc-card-pay').value || '0';
  const cashVal = document.getElementById('calc-cash-pay').value || '0';
  
  const copyText = `[더웰니스 의원 결제 계산서]\n\n` +
                   `• 시술 기본가: ${parseInt(basePrice).toLocaleString()} 원 (x ${qty}회)\n` +
                   `• 적용 할인율: ${discount}%\n` +
                   `• 할인 적용가: ${baseDiscText}\n` +
                   `• 부가세(10%): ${vatText}\n` +
                   `----------------------------\n` +
                   `★ 최종 결제액: ${totalText}\n` +
                   `----------------------------\n` +
                   `• 카드 결제액: ${parseInt(cardVal).toLocaleString()} 원\n` +
                   `• 현금 결제액: ${parseInt(cashVal).toLocaleString()} 원`;
                   
  navigator.clipboard.writeText(copyText).then(() => {
    showToast('계산 결과가 복사되었습니다! 🧮');
  }).catch(err => {
    showToast('복사에 실패했습니다.', false);
  });
}


// ==================== 3. 모바일 동의서 QR/링크 생성기 ====================

const QR_PRESETS = {
  custom: "",
  botox: "https://forms.gle/thewellness-botox-consent",
  filler: "https://forms.gle/thewellness-filler-consent",
  laser: "https://forms.gle/thewellness-laser-consent",
  skindoctor: "https://forms.gle/thewellness-skindoctor-consent",
  lifting: "https://forms.gle/thewellness-lifting-consent"
};

let qrInstance = null;

function initQRGenerator() {
  // 기본 QR 초기 인스턴스 생성
  const canvas = document.getElementById('qrcode');
  qrInstance = new QRious({
    element: canvas,
    size: 200,
    value: "https://google.com",
    background: '#ffffff',
    foreground: '#2C3E50',
    level: 'H'
  });
}

function applyQRPreset() {
  const select = document.getElementById('qr-preset-select');
  const urlInput = document.getElementById('qr-link-url');
  
  const selectedVal = select.value;
  const url = QR_PRESETS[selectedVal];
  
  urlInput.value = url;
  if (selectedVal !== 'custom') {
    urlInput.readOnly = true;
  } else {
    urlInput.readOnly = false;
  }
  
  generateQRCode();
}

function generateQRCode() {
  const urlInput = document.getElementById('qr-link-url');
  const url = urlInput.value.trim() || "https://google.com";
  
  if (qrInstance) {
    qrInstance.value = url;
  }
}

function copyQRLink() {
  const urlInput = document.getElementById('qr-link-url');
  const url = urlInput.value.trim();
  
  if (!url) {
    showToast('링크 주소를 먼저 입력해 주세요.', false);
    return;
  }
  
  navigator.clipboard.writeText(url).then(() => {
    showToast('동의서 링크가 복사되었습니다! 📋');
  });
}


// ==================== 4. 시술 대기 / 마취 시간 타이머 ====================

let activeTimers = [];

function adjustTimerDefaultValue() {
  const select = document.getElementById('timer-type');
  const minutesInput = document.getElementById('timer-minutes');
  const customGroup = document.getElementById('timer-custom-minutes-group');
  
  const timerType = select.value;
  customGroup.style.display = 'none';
  
  if (timerType === 'numb_face') {
    minutesInput.value = 20;
  } else if (timerType === 'numb_laser') {
    minutesInput.value = 30;
  } else if (timerType === 'wait_doctor') {
    minutesInput.value = 10;
  } else if (timerType === 'ldm') {
    minutesInput.value = 15;
  } else if (timerType === 'custom') {
    customGroup.style.display = 'block';
    minutesInput.value = 5;
  }
}

function startNewTimer() {
  const nameInput = document.getElementById('timer-patient-name');
  const typeSelect = document.getElementById('timer-type');
  const minutesInput = document.getElementById('timer-minutes');
  
  const patientName = nameInput.value.trim();
  if (!patientName) {
    showToast('환자 성함을 입력해 주세요.', false);
    return;
  }
  
  const timerTitle = typeSelect.options[typeSelect.selectedIndex].text.split(' ')[0];
  const durationMinutes = parseInt(minutesInput.value) || 20;
  const totalSeconds = durationMinutes * 60;
  
  const timerId = 'timer_' + Date.now();
  const endTime = Date.now() + (totalSeconds * 1000);
  
  const newTimer = {
    id: timerId,
    patientName: patientName,
    title: timerTitle,
    endTime: endTime,
    totalSeconds: totalSeconds
  };
  
  activeTimers.push(newTimer);
  saveTimersToLocalStorage();
  
  // 입력 필드 초기화
  nameInput.value = '';
  
  // 리스트 리렌더링 및 인터벌 시작
  renderActiveTimers();
  showToast(`${patientName} 환자의 ${timerTitle} 타이머 작동을 시작합니다. ⏱️`);
}

// Web Audio API를 활용한 비프음 알람 발생
function playBeepAlarm() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // 3차례 짧은 비프음 재생
    for (let i = 0; i < 3; i++) {
      const startTime = audioCtx.currentTime + (i * 0.4);
      
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 880; // A5 피치
      gainNode.gain.setValueAtTime(0.1, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.3);
    }
  } catch (e) {
    console.error("Audio API 비프음 재생 오류: ", e);
  }
}

function renderActiveTimers() {
  const container = document.getElementById('timers-list-container');
  const noTimersMsg = document.getElementById('no-timers-msg');
  
  // 초기화
  container.innerHTML = '';
  
  if (activeTimers.length === 0) {
    noTimersMsg.style.display = 'block';
    container.appendChild(noTimersMsg);
    return;
  } else {
    noTimersMsg.style.display = 'none';
  }
  
  activeTimers.forEach(timer => {
    const timerCard = document.createElement('div');
    timerCard.className = 'timer-card';
    timerCard.id = `card_${timer.id}`;
    
    // 잔여 초 계산
    const now = Date.now();
    const remainingSeconds = Math.max(0, Math.floor((timer.endTime - now) / 1000));
    
    // 시분초 포맷팅
    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    const timeString = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    
    let isDanger = remainingSeconds <= 180; // 3분 이하 위험 표시
    let isFinished = remainingSeconds === 0;
    
    timerCard.innerHTML = `
      <div class="timer-info">
        <span class="timer-title">${timer.title}</span>
        <span class="timer-patient">${timer.patientName} 환자</span>
      </div>
      <div class="timer-countdown ${isDanger ? 'danger' : ''} ${isFinished ? 'completed' : ''}">
        ${isFinished ? '완료' : timeString}
      </div>
      <button class="timer-cancel" onclick="removeTimer('${timer.id}')">
        <i data-lucide="trash-2" style="width: 18px; height: 18px;"></i>
      </button>
    `;
    
    container.appendChild(timerCard);
  });
  
  lucide.createIcons();
}

function removeTimer(timerId) {
  activeTimers = activeTimers.filter(t => t.id !== timerId);
  saveTimersToLocalStorage();
  renderActiveTimers();
}

// 타이머 인터벌 업데이트 (1초마다 호출)
setInterval(() => {
  if (activeTimers.length === 0) return;
  
  let updated = false;
  const now = Date.now();
  
  activeTimers.forEach(timer => {
    const remaining = Math.floor((timer.endTime - now) / 1000);
    // 완료 시점에 알람 1회 재생
    if (remaining === 0 && !timer.alarmPlayed) {
      playBeepAlarm();
      timer.alarmPlayed = true;
      showToast(`${timer.patientName} 환자님의 마취/대기 타이머가 종료되었습니다! 🔔`);
      updated = true;
    }
  });
  
  renderActiveTimers();
}, 1000);

function saveTimersToLocalStorage() {
  localStorage.setItem('dermdesk_active_timers', JSON.stringify(activeTimers));
}

function restoreActiveTimers() {
  const stored = localStorage.getItem('dermdesk_active_timers');
  if (stored) {
    try {
      activeTimers = JSON.parse(stored);
      // 지나간 완료된 타이머들도 시간 경과한 채로 로드됨
      renderActiveTimers();
    } catch (e) {
      activeTimers = [];
    }
  }
}


// ==================== 5. 실시간 예약/내원 대기 보드 ====================

let waitingPatients = [];

const STATUS_KOREAN = {
  wait: "접수대기",
  numb: "마취도포",
  care: "시술중",
  done: "수납/귀가"
};

function addWaitingPatient() {
  const nameInput = document.getElementById('wait-input-name');
  const treatmentInput = document.getElementById('wait-input-treatment');
  const statusSelect = document.getElementById('wait-input-status');
  
  const name = nameInput.value.trim();
  const treatment = treatmentInput.value.trim();
  const status = statusSelect.value;
  
  if (!name || !treatment) {
    showToast('환자 성함과 시술 내용을 모두 입력하세요.', false);
    return;
  }
  
  const now = new Date();
  const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const newPatient = {
    id: 'patient_' + Date.now(),
    time: timeString,
    name: name,
    treatment: treatment,
    status: status
  };
  
  waitingPatients.push(newPatient);
  saveWaitingToLocalStorage();
  
  // 폼 초기화
  nameInput.value = '';
  treatmentInput.value = '';
  
  renderWaitingPatients();
  showToast(`${name} 환자 접수가 완료되었습니다.`);
}

function renderWaitingPatients() {
  const tbody = document.getElementById('waiting-patients-tbody');
  tbody.innerHTML = '';
  
  // 대기자 데이터가 없을 때의 처리
  if (waitingPatients.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem 0;">
          현재 내원 대기 중인 환자가 없습니다.
        </td>
      </tr>
    `;
    return;
  }
  
  waitingPatients.forEach((patient, index) => {
    const tr = document.createElement('tr');
    tr.id = patient.id;
    
    tr.innerHTML = `
      <td style="font-family: 'Outfit', sans-serif; font-weight: 500; color: var(--text-light);">${patient.time}</td>
      <td style="font-weight: 700;">${patient.name}</td>
      <td>${patient.treatment}</td>
      <td>
        <span class="status-badge ${patient.status}">${STATUS_KOREAN[patient.status]}</span>
      </td>
      <td>
        <button class="action-btn-sm" title="다음 단계로 진행" onclick="advancePatientStatus('${patient.id}')">
          <i data-lucide="chevron-right" style="width: 18px; height: 18px; color: var(--primary-gold);"></i>
        </button>
        <button class="action-btn-sm" title="대기 삭제" onclick="removePatient('${patient.id}')">
          <i data-lucide="x-circle" style="width: 18px; height: 18px; color: #E74C3C;"></i>
        </button>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
  
  lucide.createIcons();
}

function advancePatientStatus(patientId) {
  const patient = waitingPatients.find(p => p.id === patientId);
  if (!patient) return;
  
  // 상태 변경 흐름: wait -> numb -> care -> done
  if (patient.status === 'wait') {
    patient.status = 'numb';
  } else if (patient.status === 'numb') {
    patient.status = 'care';
  } else if (patient.status === 'care') {
    patient.status = 'done';
  } else if (patient.status === 'done') {
    // 수납까지 끝났다면 목록에서 제외시킵니다.
    waitingPatients = waitingPatients.filter(p => p.id !== patientId);
    showToast(`${patient.name} 환자님의 수납/귀가 처리가 완료되어 리스트에서 퇴실 처리되었습니다.`);
    saveWaitingToLocalStorage();
    renderWaitingPatients();
    return;
  }
  
  saveWaitingToLocalStorage();
  renderWaitingPatients();
}

function removePatient(patientId) {
  const patient = waitingPatients.find(p => p.id === patientId);
  if (!patient) return;
  
  waitingPatients = waitingPatients.filter(p => p.id !== patientId);
  saveWaitingToLocalStorage();
  renderWaitingPatients();
  showToast(`${patient.name} 환자 정보가 삭제되었습니다.`);
}

function saveWaitingToLocalStorage() {
  localStorage.setItem('dermdesk_waiting_patients', JSON.stringify(waitingPatients));
}

// 대기보드 로컬스토리지 복구
const storedPatients = localStorage.getItem('dermdesk_waiting_patients');
if (storedPatients) {
  try {
    waitingPatients = JSON.parse(storedPatients);
  } catch (e) {
    waitingPatients = [];
  }
}


// ==================== 6. 코디네이터 의학 약어 사전 ====================

const CLINIC_DICTIONARY = [
  { abbr: "BTX", full: "Botox / Botulinum Toxin", meaning: "보톡스 시술", desc: "근육을 마비시켜 주름을 개선하거나 부피를 줄이는 시술 (턱, 이마, 미간 등)." },
  { abbr: "C/O", full: "Complains Of", meaning: "주소 (환자가 호소하는 증상/불편사항)", desc: "차팅 기록 시 예: 'C/O: 양볼 홍조 및 건조'" },
  { abbr: "F/U", full: "Follow-Up", meaning: "경과 관찰 / 재내원", desc: "시술이나 치료 후 효과/부작용 관찰을 위한 내원 약속." },
  { abbr: "Tx", full: "Treatment", meaning: "치료 / 시술", desc: "오늘 시행할 예정인 처치 혹은 치료 전체를 지칭." },
  { abbr: "L/A", full: "Local Anesthesia", meaning: "국소 마취", desc: "리도카인 주사마취 또는 연고 마취 등을 의미함." },
  { abbr: "LDM", full: "Local Dynamic Micro-massage", meaning: "LDM 물방울 리프팅", desc: "초음파를 이용해 피부 장벽을 강화하고 재생을 돕는 무통증 관리." },
  { abbr: "H/R", full: "Hair Removal", meaning: "레이저 제모", desc: "겨드랑이, 얼굴, 바디 등 젠틀맥스 등 기기를 활용한 영구제모 시술." },
  { abbr: "P.R.N", full: "Pro Re Nata", meaning: "필요 시마다 / 수시로", desc: "처방전 또는 처치 오더에서 '통증 호소 시 처방' 등의 의미로 사용." },
  { abbr: "A/C", full: "Acne Care", meaning: "여드름 관리", desc: "압출, 염증주사, 진정 팩 등이 포함된 스킨케어 치료." },
  { abbr: "MTS", full: "Microneedle Therapy System", meaning: "미세침 치료", desc: "피부에 미세 구멍을 내어 스킨부스터(엑소좀 등) 침투를 극대화하는 솔루션." },
  { abbr: "Post-op", full: "Post-operative", meaning: "수술/시술 후", desc: "시술이나 관리 직후의 단계를 뜻함." },
  { abbr: "Pre-op", full: "Pre-operative", meaning: "수술/시술 전", desc: "시술 대기실, 마취 크림 도포 상태 등 시술 직전 상태." },
  { abbr: "PRP", full: "Platelet-Rich Plasma", meaning: "자가혈소판 풍부혈장", desc: "본인의 피를 채혈 및 원심분리해 성장인자를 추출하고 주사하는 재생술." },
  { abbr: "Erbium", full: "Erbium-YAG Laser", meaning: "어븀 야그 레이저", desc: "피부를 미세하게 깎아 흉터나 점을 제거하는 고정밀 레이저." },
  { abbr: "Cryo", full: "Cryotherapy", meaning: "크라이오 진정 관리", desc: "시술 후 화끈거리는 피부를 냉각 진정시키는 전기이온 기기 케어." }
];

function initDictionary() {
  renderDictionary(CLINIC_DICTIONARY);
}

function renderDictionary(data) {
  const container = document.getElementById('dict-items-container');
  container.innerHTML = '';
  
  if (data.length === 0) {
    container.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
        검색 결과와 일치하는 약어가 없습니다.
      </div>
    `;
    return;
  }
  
  data.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'dict-item';
    
    itemEl.innerHTML = `
      <div class="dict-term">
        <span class="dict-abbr">${item.abbr}</span>
        <span class="dict-full">${item.full}</span>
      </div>
      <div class="dict-meaning">${item.meaning}</div>
      <div class="dict-desc">${item.desc}</div>
    `;
    
    container.appendChild(itemEl);
  });
}

function filterDictionary() {
  const searchInput = document.getElementById('dict-search-input');
  const query = searchInput.value.toLowerCase().trim();
  
  if (!query) {
    renderDictionary(CLINIC_DICTIONARY);
    return;
  }
  
  const filtered = CLINIC_DICTIONARY.filter(item => {
    return item.abbr.toLowerCase().includes(query) || 
           item.full.toLowerCase().includes(query) || 
           item.meaning.toLowerCase().includes(query) ||
           item.desc.toLowerCase().includes(query);
  });
  
  renderDictionary(filtered);
}


// ==================== 7. Supabase 실시간 카드 데이터 연동 ====================

// 1. Supabase 연동 실패 또는 미입력시 기본 6개 툴 데이터 (Fallback)
const DEFAULT_LOCAL_CARDS = [
  {
    title: "시술 주의사항 생성기",
    description: "시술별(보톡스, 필러, 리쥬란 등) 맞춤 사후 주의사항 문자 안내문을 빠르게 생성하고 클립보드에 복사합니다.",
    modal_id: "modal-precautions",
    icon_name: "message-square-more"
  },
  {
    title: "결제 금액 계산기",
    description: "부가세(10%) 계산, 패키지 다회차 할인율 일괄 적용 및 카드/현금 복합 결제 시 차액을 즉시 계산합니다.",
    modal_id: "modal-calculator",
    icon_name: "calculator"
  },
  {
    title: "동의서 QR/링크 생성기",
    description: "환자용 태블릿 모바일 동의서 링크를 즉시 QR 코드로 변환하여 대기 데스크 모니터에 띄우거나 고객에게 전달합니다.",
    modal_id: "modal-qrcode",
    icon_name: "qr-code"
  },
  {
    title: "시술 시간 타이머",
    description: "마취 크림 도포 환자의 실시간 대기 시간을 카운트다운하여 최적의 레이저 시술 타이밍을 관리해 줍니다.",
    modal_id: "modal-timer",
    icon_name: "timer"
  },
  {
    title: "실시간 예약 대기 보드",
    description: "내원 환자의 접수 현황, 마취 대기, 시술실 입실, 수납 대기 등의 진행 상황을 유연하게 트래킹하는 간이 보드입니다.",
    modal_id: "modal-waiting",
    icon_name: "users"
  },
  {
    title: "코디네이터 약어 사전",
    description: "데스크 신입 교육 및 실무에서 자주 사용되는 차트 내 피부과 의학 약어와 시술 은어를 빠르게 초성 검색합니다.",
    modal_id: "modal-dictionary",
    icon_name: "book-open"
  },
  {
    title: "더웰니스 퀴즈 게임",
    description: "피부과 데스크 코디네이터 업무 관련 재미있는 퀴즈를 맞히고 실력을 향상하는 퀴즈 사이트로 이동합니다.",
    site_url: "./quiz/index.html",
    icon_name: "help-circle"
  },
  {
    title: "더웰니스 원내 스태프 교육관",
    description: "원내 공식 교육 PDF 자료만을 100% 탑재하여 학습하는 프리미엄 미니멀리즘 스터디 룸입니다.",
    site_url: "./Study/index.html",
    icon_name: "book-open"
  },
  {
    title: "매달 이벤트",
    description: "더웰니스 의원 매달 진행되는 이벤트와 프로모션 정보를 한눈에 확인하고 비교 분석합니다.",
    site_url: "./Month_Event/7month.html",
    icon_name: "calendar"
  },
  {
    title: "내현 업데이트",
    description: "예약 조회 엑셀 파일을 업로드하여 중복 및 해외 예약을 제거하고 내원현황표 형식에 맞게 변환합니다.",
    site_url: "./nhupdate/index.html",
    icon_name: "refresh-cw"
  }
];

// Supabase 고정 접속 상수
const SUPABASE_URL = "https://lowhammzuymzinocujag.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvd2hhbW16dXltemlub2N1amFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTI3OTgsImV4cCI6MjA5NzI2ODc5OH0.1Ex6Wxy1E6FnTWlB-P0t5YDjQZl3UlBVRu9_jxFPNKA";

let supabaseClient = null;

// Supabase 초기화 함수 (고정 상수를 활용하여 즉시 연동)
function initSupabase() {
  try {
    if (typeof supabase !== 'undefined') {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return true;
    }
  } catch (e) {
    console.error("Supabase 초기화 도중 오류 발생:", e);
    return false;
  }
  return false;
}

// 대시보드 카드 로드
async function loadDashboardCards() {
  const gridContainer = document.getElementById('tools-grid-container');
  
  // 로딩 마크업 렌더링
  gridContainer.innerHTML = `
    <div style="grid-column: 1/-1; text-align: center; padding: 4rem 0; color: var(--text-light);">
      <div style="font-size: 1.2rem; margin-bottom: 0.8rem; font-weight: 700; color: var(--wellness-pink);">
        데이터 로딩 중...
      </div>
      <p style="font-size: 0.9rem; color: var(--text-muted);">Supabase 데이터베이스로부터 사이트 목록을 불러오고 있습니다.</p>
    </div>
  `;

  if (initSupabase()) {
    try {
      // 'automated_sites' 테이블에서 데이터 조회
      const { data, error } = await supabaseClient
        .from('automated_sites')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        renderDashboardCards(data);
        return;
      }
    } catch (err) {
      console.warn("Supabase 데이터 로드 실패, 로컬 기본 카드 세트를 활성화합니다:", err);
      showToast("DB 연동 오류로 로컬 기본 툴을 활성화했습니다.", false);
    }
  }

  // Supabase 연동 정보가 없거나 에러가 났을 때 Fallback 데이터 렌더링
  renderDashboardCards(DEFAULT_LOCAL_CARDS);
}

// 동적 카드 렌더링 실행
function renderDashboardCards(cards) {
  const gridContainer = document.getElementById('tools-grid-container');
  gridContainer.innerHTML = ''; // 초기화
  
  cards.forEach(card => {
    const cardEl = document.createElement('div');
    cardEl.className = 'tool-card';
    cardEl.id = `card-dynamic-${card.id || card.modal_id || 'link'}`;
    
    const desc = card.description || '더웰니스 데스크 자동화 시스템';
    
    // 유연한 변수 감지 (사용자가 수동으로 테이블 작성 시 컬럼 오타 대비 방어 코드)
    const modalId = card.modal_id || card.modalid || card.modal;
    let siteUrl = card.site_url || card.siteurl || card.url || card.link || card.link_url || card.linkurl;
    
    const hasModal = !!modalId;
    
    cardEl.innerHTML = `
      <div>
        <div class="card-icon"><i data-lucide="${card.icon_name || 'link'}"></i></div>
        <h3 class="card-title">${card.title}</h3>
        <p class="card-desc">${desc}</p>
      </div>
      <div class="card-action">
        <span>${hasModal ? '도구 열기' : '사이트 방문'}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    `;
    
    // 클릭 이벤트 바인딩
    cardEl.addEventListener('click', () => {
      console.log("클릭된 카드 데이터:", card); // F12 디버깅용 로그 출력
      
      if (modalId) {
        console.log(`내부 도구 실행: modal_id = ${modalId}`);
        openModal(modalId);
      } else if (siteUrl) {
        let targetUrl = siteUrl.trim();
        // 상대경로(./ 또는 / 로 시작)가 아닐 때만 http/https 접두사 자동 보정을 적용합니다.
        if (!/^\.?\//.test(targetUrl) && !/^https?:\/\//i.test(targetUrl)) {
          targetUrl = 'https://' + targetUrl;
        }
        console.log(`외부 링크 이동: targetUrl = ${targetUrl}`);
        window.open(targetUrl, '_blank');
      } else {
        console.warn("실행 불가능한 카드 누름. 데이터 누락 상태:", card);
        showToast('실행 가능한 도구 또는 링크가 지정되지 않았습니다.', false);
      }
    });
    
    gridContainer.appendChild(cardEl);
  });
  
  // Lucide 아이콘 새로 렌더링
  lucide.createIcons();
}
