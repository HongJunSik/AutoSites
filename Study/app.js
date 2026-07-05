// THE WELLNESS STUDY HUB - 메인 애플리케이션 스크립트
let currentCategory = "all";
let searchQuery = "";
let currentSort = "default";

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  renderStudyGrid();
  initSearch();
  initLucide();
});

// Render Study Grid List
function renderStudyGrid() {
  const container = document.getElementById("study-grid-container");
  const countText = document.getElementById("results-count-text");
  if (!container) return;

  // Filter
  let items = [...studyData];
  if (currentCategory !== "all") {
    items = items.filter(item => item.category === currentCategory);
  }

  // Search
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    items = items.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.subTitle.toLowerCase().includes(query) ||
      item.concept.toLowerCase().includes(query)
    );
  }

  // Sort
  if (currentSort === "title") {
    items.sort((a, b) => a.title.localeCompare(b.title, "ko"));
  }

  // Update count text
  if (countText) {
    countText.innerText = `총 ${items.length}개의 학습 주제`;
  }

  // Render cards
  if (items.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i data-lucide="package-open" class="no-results-icon"></i>
        <h3>일치하는 교육 자료가 없습니다.</h3>
        <p>다른 검색어 또는 다른 카테고리를 선택해 보세요.</p>
      </div>
    `;
    initLucide();
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="product-card" onclick="openStudyDetail('${item.id}')">
      <!-- Thumbnail Area (YourNextStore Product Box Image representation) -->
      <div class="card-thumbnail">
        <img src="images/${item.id.replace(/-/g, '_')}.jpg" alt="${item.title}" class="thumbnail-image">
      </div>
      
      <!-- Card Information area -->
      <div class="card-info">
        <span class="card-category-label">${item.categoryKo}</span>
        <h3 class="card-title">${item.title}</h3>
        <p class="card-subtitle">${item.subTitle}</p>
        <p class="card-concept-summary">${truncateText(item.concept, 80)}</p>
        <div class="card-action-bar">
          <span class="btn-quick-view">상세 학습서 보기 &rarr;</span>
        </div>
      </div>
    </div>
  `).join('');

  initLucide();
}

// Icon mapper helper
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

// Open Detail Page in New Window/Tab
function openStudyDetail(id) {
  window.open(`detail.html?id=${id}`, "_blank");
}

// Truncate Text helper
function truncateText(text, length) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

// Filter Category Click
function filterCategory(catId) {
  currentCategory = catId;
  
  // Toggle Nav active state
  document.querySelectorAll(".nav-btn").forEach(btn => {
    if (btn.dataset.cat === catId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  renderStudyGrid();
}

// Search Field Setup
function initSearch() {
  const searchInput = document.getElementById("study-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderStudyGrid();
  });
}

// Sort setup
function handleSort() {
  const select = document.getElementById("sort-select");
  if (!select) return;
  currentSort = select.value;
  renderStudyGrid();
}

// Initialize Lucide Icons
function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}
