// THE WELLNESS STUDY HUB - 상세 웹페이지 비즈니스 로직
let activeItemId = null;

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  
  if (!id) {
    showError("학습서 식별 정보(ID)가 누락되었습니다.");
    return;
  }
  
  const item = studyData.find(d => d.id === id);
  if (!item) {
    showError("해당 학습서 데이터를 찾을 수 없습니다.");
    return;
  }
  
  activeItemId = id;
  loadDetailContent(item);
  initLucide();
});

// Show Error state
function showError(msg) {
  const container = document.getElementById("detail-loading-box");
  if (container) {
    container.innerHTML = `
      <div class="no-results">
        <i data-lucide="alert-octagon" class="no-results-icon" style="color: #c62828;"></i>
        <h3>오류 발생</h3>
        <p>${msg}</p>
        <button class="btn-primary" onclick="window.close()" style="margin-top: 15px;">창 닫기</button>
      </div>
    `;
    initLucide();
  }
}

// Load Content into page
function loadDetailContent(item) {
  // Hide Loader, Show Wrapper
  document.getElementById("detail-loading-box").style.display = "none";
  document.getElementById("detail-content-wrapper").style.display = "grid";

  // Document Title Change
  document.title = `THE WELLNESS | ${item.title}`;

  // Populate Header info
  document.getElementById("detail-title-text").innerText = item.title;
  document.getElementById("detail-sub-text").innerText = item.subTitle;
  document.getElementById("detail-category-tag").innerText = item.categoryKo;
  document.getElementById("detail-concept-desc").innerHTML = formatMarkdownText(item.concept);

  // Big graphic box styling
  const graphicBox = document.getElementById("detail-graphic-box");
  if (graphicBox) {
    graphicBox.innerHTML = `
      <img src="images/${item.id.replace(/-/g, '_')}.jpg" alt="${item.title}" class="detail-large-image-el">
    `;
  }

  // Populate Accordion Sections
  const accordionContainer = document.getElementById("detail-sections-accordion");
  if (accordionContainer && item.details) {
    accordionContainer.innerHTML = item.details.map((section, idx) => `
      <div class="accordion-section">
        <button class="accordion-trigger active" onclick="toggleAccordion(this)">
          <span class="accordion-title-text">${section.title}</span>
          <i data-lucide="chevron-down" class="accordion-arrow"></i>
        </button>
        <div class="accordion-panel" style="max-height: none;">
          <div class="accordion-inner-content">
            ${formatMarkdownText(section.content)}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Checklist
  renderChecklist(item);

  // Sync Complete Button State
  syncCompleteButtonState();
}

// Generate Checklist items based on content splits
function renderChecklist(item) {
  const container = document.getElementById("detail-checklist-items");
  if (!container) return;

  // Extract checklist criteria depending on items
  let criteria = [];
  if (item.id === "thermage-flx") {
    criteria = [
      "써마지 시술 전 스턴트/제세동기 확인 완료",
      "금속 피어싱 및 악세사리 제거 확인 완료",
      "금니/교정 장치 환자 거즈 물림 파악 완료",
      "올리지오 비교 멘트 및 울써마지 시너지 파악"
    ];
  } else if (item.id === "repot-manual") {
    criteria = [
      "리팟 시술 전 마크뷰 필수 촬영 체크 완료",
      "듀오덤 부착 3주 기본 안내 스펙 확인 완료",
      "젤클렌저(3.3만)/CU크림(2만) 안내 규칙 숙지",
      "제거 후 리팟재생주사 멘트 및 T/CU크림 순서 숙지"
    ];
  } else if (item.id === "desk-starter") {
    criteria = [
      "초진 신환 차트 및 피부과 동의서 작성 규칙 확인",
      "네모딕 파트별(피부/간호) 부서 매칭 분기 확인",
      "내원현황판 대기 사유(15분 지연 시) 기록 필수 숙지",
      "매출 100만(하늘)/300만(노랑) 컬러 마킹 엄수 확인"
    ];
  } else if (item.id === "rules-and-ot") {
    criteria = [
      "단정한 용모 헤어(헤어망 혹은 포니테일) 규정 확인",
      "오전 9시 45분까지 환복 및 무전기 장착 엄수",
      "연차 신청서 최소 1달 전 제출 승인 규정 파악",
      "무단결근 3일 또는 지각 3회 시 경위서 작성 숙지"
    ];
  } else if (item.id === "cosmetics-price") {
    criteria = [
      "밀크 클렌저(2.8만) 및 CU크림(2만) 판매가 체크",
      "EGF 앰플(6.4만) 및 벨모나 BB(4만) 판매가 체크",
      "벨모나 와인겔 판매금지(판매X) 가이드 확인",
      "리팟 시술 부위 미백/비타민C 화장품 금지 숙지"
    ];
  } else {
    // Generic fallback checkpoints from concept
    criteria = [
      "시술 기본 효과 및 원내 장비 위치 파악 완료",
      "시술 전후 사진 촬영 여부 확인 및 타이밍 체크",
      "귀가 시 안내 문자 발송 및 처방전 발급 확인",
      "특이사항 메모 펜차트 및 무전 인수인계 숙지"
    ];
  }

  container.innerHTML = criteria.map((text, idx) => {
    const key = `chk-detail-${activeItemId}-${idx}`;
    const isChecked = localStorage.getItem(key) === "true";
    return `
      <label class="detail-check-row">
        <input type="checkbox" class="detail-checkbox-input" data-key="${key}" ${isChecked ? 'checked' : ''} onchange="toggleChecklistItem('${key}', this)">
        <span class="detail-check-label-text">${text}</span>
      </label>
    `;
  }).join('');
}

// Checkbox item change trigger
window.toggleChecklistItem = function(key, checkbox) {
  localStorage.setItem(key, checkbox.checked);
};

// Toggle Main Study Complete Action
window.toggleMainStudyComplete = function() {
  if (!activeItemId) return;

  const key = `study-complete-${activeItemId}`;
  const isCompleted = localStorage.getItem(key) === "true";
  
  if (isCompleted) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, "true");
  }

  syncCompleteButtonState();
  
  // Try to update parent window if available
  if (window.opener && !window.opener.closed) {
    if (typeof window.opener.renderStudyGrid === "function") {
      window.opener.renderStudyGrid();
    }
  }
};

// Sync Complete Button Styling
function syncCompleteButtonState() {
  const btn = document.getElementById("btn-complete-study");
  const text = document.getElementById("complete-btn-text");
  const icon = document.getElementById("complete-btn-icon");
  if (!btn || !text || !icon) return;

  const isCompleted = localStorage.getItem(`study-complete-${activeItemId}`) === "true";

  if (isCompleted) {
    text.innerText = "학습 완료됨";
    btn.classList.add("completed");
    icon.setAttribute("data-lucide", "check-square");
  } else {
    text.innerText = "학습 완료로 표시";
    btn.classList.remove("completed");
    icon.setAttribute("data-lucide", "check");
  }
  initLucide();
}

// Toggle Accordion Panel
window.toggleAccordion = function(button) {
  const panel = button.nextElementSibling;
  const arrow = button.querySelector(".accordion-arrow");
  
  button.classList.toggle("active");
  
  if (button.classList.contains("active")) {
    panel.style.maxHeight = "none";
    if (arrow) arrow.style.transform = "rotate(0deg)";
  } else {
    panel.style.maxHeight = "0px";
    if (arrow) arrow.style.transform = "rotate(-90deg)";
  }
};

// Icon mapping helper
function getIconName(icon) {
  if (icon === "zap") return "zap";
  if (icon === "award") return "award";
  if (icon === "users") return "users";
  if (icon === "book-open") return "book-open";
  if (icon === "file-text") return "file-text";
  if (icon === "prescription") return "file-signature";
  if (icon === "shopping-bag") return "shopping-bag";
  if (icon === "shield") return "shield";
  return "book-marked";
}

// Initialize Lucide Icons
function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Format bold markdown inside text
function formatMarkdownText(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}
