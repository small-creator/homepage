document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initTickers();
  initProperties();
  initNewsBoard();
  initCalculators();
  initConsultationForm();
  initModals();
});

/* ==========================================================================
   THEME TOGGLE (Light / Dark)
   ========================================================================== */
function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('jamsil_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const activeTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', activeTheme);
  updateThemeIcons(activeTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('jamsil_theme', newTheme);
      updateThemeIcons(newTheme);
      showToast(newTheme === 'dark' ? '다크 모드가 적용되었습니다.' : '라이트 모드가 적용되었습니다.');
    });
  });
}

function updateThemeIcons(theme) {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      btn.setAttribute('aria-label', '라이트 모드로 전환');
    } else {
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      btn.setAttribute('aria-label', '다크 모드로 전환');
    }
  });
}

/* ==========================================================================
   MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const navDrawer = document.getElementById('mobileNavDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link, .drawer-bottom-cta a');

  function openDrawer() {
    navDrawer.classList.add('open');
    drawerOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   TICKER BAR
   ========================================================================== */
function initTickers() {
  const tickerTrack = document.getElementById('tickerTrack');
  if (!tickerTrack || !window.JAMSIL_MARKET_TICKERS) return;

  const itemsHtml = JAMSIL_MARKET_TICKERS.map(item => `
    <span class="ticker-item" onclick="openConsultationWithContext('실시간 시세 문의')">
      ${item.text}
    </span>
  `).join('');

  // Duplicate for seamless infinite loop
  tickerTrack.innerHTML = itemsHtml + itemsHtml;
}

/* ==========================================================================
   PROPERTIES & LANDMARK COMPLEXES
   ========================================================================== */
let activePropCategory = 'all';

function initProperties() {
  const container = document.getElementById('propertyGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  renderProperties(activePropCategory);

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePropCategory = btn.getAttribute('data-category');
      renderProperties(activePropCategory);
    });
  });
}

function renderProperties(category) {
  const container = document.getElementById('propertyGrid');
  if (!container || !window.JAMSIL_PROPERTIES) return;

  const filtered = category === 'all'
    ? JAMSIL_PROPERTIES
    : JAMSIL_PROPERTIES.filter(p => p.category === category);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">해당 조건의 등록 매물이 준비 중입니다.</p>
        <p style="font-size: 0.9rem;">전화로 문의주시면 실시간 비공개 맞춤 매물을 즉시 확인해 드립니다.</p>
        <a href="tel:02-421-8949" class="btn-primary" style="margin-top: 18px;">📞 전화로 매물 문의 (02-421-8949)</a>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(prop => `
    <article class="property-card" data-id="${prop.id}">
      <div class="prop-img-wrap">
        <img src="${prop.image}" alt="${prop.complexName}" loading="lazy">
        <span class="prop-badge-top ${prop.badgeType}">${prop.badge}</span>
        <span class="prop-type-badge">${prop.type}</span>
      </div>
      <div class="prop-body">
        <h3 class="prop-title">${prop.complexName}</h3>
        <div class="prop-price-box">
          <div class="prop-price-main">${prop.price}</div>
          <div class="prop-price-sub">${prop.priceSub}</div>
        </div>
        <div class="prop-specs-list">
          <div class="prop-spec-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span><strong>면적:</strong> ${prop.area} (${prop.structure})</span>
          </div>
          <div class="prop-spec-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span><strong>층/향:</strong> ${prop.floor} · ${prop.direction}</span>
          </div>
          <div class="prop-spec-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span><strong>교통:</strong> ${prop.station}</span>
          </div>
        </div>
        <div class="prop-tags-cloud">
          ${prop.features.map(f => `<span class="prop-tag">#${f}</span>`).join('')}
        </div>
        <div class="prop-actions">
          <button class="btn-card-detail" onclick="openPropertyDetail('${prop.id}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            상세정보
          </button>
          <a href="tel:02-421-8949" class="btn-card-call" onclick="handleCallClick('${prop.complexName}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            전화 상담
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

function openPropertyDetail(propId) {
  const prop = JAMSIL_PROPERTIES.find(p => p.id === propId);
  if (!prop) return;

  const modalBackdrop = document.getElementById('propertyModal');
  const modalContent = document.getElementById('propertyModalContent');

  modalContent.innerHTML = `
    <div class="modal-header">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <span class="prop-badge-top ${prop.badgeType}" style="position:static;">${prop.badge}</span>
        <span style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">${prop.type}</span>
      </div>
      <h2 style="font-size:1.6rem; font-weight:900; color:var(--text-main); margin-bottom:6px;">${prop.complexName}</h2>
      <div style="font-size:1.5rem; font-weight:900; color:var(--primary); font-family:var(--font-display);">${prop.price}</div>
      <div style="font-size:0.9rem; color:var(--text-muted);">${prop.priceSub}</div>
    </div>
    <div class="modal-body">
      <div style="margin-bottom: 24px; border-radius: var(--radius-md); overflow:hidden;">
        <img id="modalMainImg" src="${prop.image}" alt="${prop.complexName}" style="width:100%; height:320px; object-fit:cover;">
        <div style="display:flex; gap:8px; margin-top:8px;">
          ${prop.gallery.map((imgSrc, idx) => `
            <img src="${imgSrc}" onclick="document.getElementById('modalMainImg').src='${imgSrc}'" 
                 style="width:70px; height:50px; object-fit:cover; border-radius:6px; cursor:pointer; border:2px solid var(--border-light);" alt="갤러리 ${idx+1}">
          `).join('')}
        </div>
      </div>

      <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:12px;">🏢 단지 및 매물 세부 정보</h3>
      <table class="article-table" style="margin-top:0;">
        <tbody>
          <tr>
            <th style="width:25%;">전용/공급면적</th>
            <td>${prop.area}</td>
            <th style="width:25%;">구조 / 층수</th>
            <td>${prop.structure} / ${prop.floor}</td>
          </tr>
          <tr>
            <th>방향 / 난방</th>
            <td>${prop.direction} / ${prop.details.heating}</td>
            <th>총 세대수</th>
            <td>${prop.details.totalHouseholds}</td>
          </tr>
          <tr>
            <th>준공년월</th>
            <td>${prop.details.completionDate}</td>
            <th>주차 대수</th>
            <td>${prop.details.parkingRatio}</td>
          </tr>
          <tr>
            <th>월평균 관리비</th>
            <td colspan="3">${prop.details.maintenanceCost}</td>
          </tr>
        </tbody>
      </table>

      <div class="insight-box">
        <h4>💡 대표 공인중개사 추천 평의</h4>
        <p style="font-size:0.92rem; line-height:1.7; margin-bottom:0;">${prop.details.brokerComment}</p>
      </div>

      <div style="display:flex; gap:12px; margin-top:28px;">
        <a href="tel:02-421-8949" class="btn-primary" style="flex:1;" onclick="handleCallClick('${prop.complexName}')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          전화로 바로 문의 (02-421-8949)
        </a>
        <button class="btn-secondary" onclick="closeModal('propertyModal'); openConsultationWithContext('${prop.complexName} 매물 상담')">
          방문 예약하기
        </button>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   NEWS & INSIGHTS BOARD
   ========================================================================== */
let activeNewsCat = 'all';
let searchQuery = '';

function initNewsBoard() {
  const catBtns = document.querySelectorAll('.news-cat-btn');
  const searchInput = document.getElementById('newsSearchInput');
  const newsletterForm = document.getElementById('newsletterForm');

  renderNews();

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeNewsCat = btn.getAttribute('data-cat');
      renderNews();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderNews();
    });
  }

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newsletterInput');
      if (input && input.value) {
        showToast('잠실 부동산 주간 브리핑 구독이 완료되었습니다!');
        input.value = '';
      }
    });
  }
}

function renderNews() {
  const container = document.getElementById('newsCardsGrid');
  if (!container || !window.JAMSIL_NEWS) return;

  let filtered = JAMSIL_NEWS;

  if (activeNewsCat !== 'all') {
    filtered = filtered.filter(n => n.category === activeNewsCat);
  }

  if (searchQuery) {
    filtered = filtered.filter(n => 
      n.title.toLowerCase().includes(searchQuery) ||
      n.summary.toLowerCase().includes(searchQuery) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery))
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 48px 20px; color: var(--text-muted);">
        <p style="font-weight: 700; font-size: 1.05rem;">검색 결과가 없습니다.</p>
        <p style="font-size: 0.88rem; margin-top: 4px;">다른 검색어를 입력하시거나 카테고리를 전체로 선택해 주세요.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="news-card" onclick="openArticleModal('${item.id}')">
      <div class="news-thumb">
        <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
      </div>
      <div class="news-content">
        <div class="news-meta-top">
          <span class="news-cat-tag">#${item.categoryName}</span>
          <span>${item.date}</span>
        </div>
        <h3 class="news-card-title">${item.title}</h3>
        <p class="news-card-summary">${item.summary}</p>
        <div class="news-card-footer">
          <span>⏱️ ${item.readTime} · 👁️ ${item.views}회</span>
          <span class="news-read-btn">
            전문 읽기
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </span>
        </div>
      </div>
    </article>
  `).join('');
}

function openArticleModal(newsId) {
  const article = JAMSIL_NEWS.find(n => n.id === newsId);
  if (!article) return;

  const modal = document.getElementById('articleModal');
  const content = document.getElementById('articleModalContent');

  content.innerHTML = `
    <div class="modal-header">
      <div class="article-header-meta">
        <span class="news-cat-tag">#${article.categoryName}</span>
        <span>·</span>
        <span>${article.date}</span>
        <span>·</span>
        <span>⏱️ ${article.readTime}</span>
        <span>·</span>
        <span>조회수 ${article.views}</span>
      </div>
      <h1 class="article-modal-title">${article.title}</h1>
      <img src="${article.thumbnail}" alt="${article.title}" class="article-hero-img">
    </div>
    <div class="modal-body">
      <div class="article-prose">
        ${article.content}
      </div>

      <div style="margin-top: 36px; padding: 24px; background: var(--bg-surface-elevated); border: 1px solid var(--border-light); border-radius: var(--radius-lg); text-align: center;">
        <h4 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 8px;">본 기사 내용과 관련된 잠실 매물·세무·정책 상담이 필요하신가요?</h4>
        <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 18px;">잠실 전문 공인중개사가 1:1 맞춤형 무료 분석을 제공해 드립니다.</p>
        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          <a href="tel:02-421-8949" class="btn-primary" onclick="handleCallClick('뉴스 기사 상담: ${article.title}')">
            📞 02-421-8949 전화 상담
          </a>
          <button class="btn-secondary" onclick="closeModal('articleModal'); openConsultationWithContext('기사 관련 문의: ${article.title}')">
            온라인 상담 접수
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ==========================================================================
   REAL ESTATE SMART CALCULATORS
   ========================================================================== */
function initCalculators() {
  // Brokerage Fee Calc
  const feeTypeBtns = document.querySelectorAll('#feeTypeGroup .segment-btn');
  const feeAmountInput = document.getElementById('feeAmount');
  const feeVatCheckbox = document.getElementById('feeVat');

  let activeFeeType = 'trade'; // trade, lease, monthly

  feeTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      feeTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFeeType = btn.getAttribute('data-type');
      calculateBrokerageFee();
    });
  });

  if (feeAmountInput) feeAmountInput.addEventListener('input', calculateBrokerageFee);
  if (feeVatCheckbox) feeVatCheckbox.addEventListener('change', calculateBrokerageFee);

  function calculateBrokerageFee() {
    const amountManwon = parseFloat(feeAmountInput.value) || 0;
    const isVat = feeVatCheckbox ? feeVatCheckbox.checked : true;
    let rate = 0;
    let limit = Infinity;

    if (activeFeeType === 'trade') {
      if (amountManwon < 5000) { rate = 0.006; limit = 25; }
      else if (amountManwon < 20000) { rate = 0.005; limit = 80; }
      else if (amountManwon < 90000) { rate = 0.004; limit = Infinity; }
      else if (amountManwon < 120000) { rate = 0.005; limit = Infinity; }
      else if (amountManwon < 150000) { rate = 0.006; limit = Infinity; }
      else { rate = 0.007; limit = Infinity; }
    } else { // 임대차/전세
      if (amountManwon < 5000) { rate = 0.005; limit = 20; }
      else if (amountManwon < 10000) { rate = 0.004; limit = 30; }
      else if (amountManwon < 60000) { rate = 0.003; limit = Infinity; }
      else if (amountManwon < 120000) { rate = 0.004; limit = Infinity; }
      else if (amountManwon < 150000) { rate = 0.005; limit = Infinity; }
      else { rate = 0.006; limit = Infinity; }
    }

    let calculatedFee = amountManwon * rate;
    if (calculatedFee > limit) calculatedFee = limit;

    const ratePercent = (rate * 100).toFixed(1) + '%';
    const feeWon = Math.round(calculatedFee * 10000);
    const vatWon = isVat ? Math.round(feeWon * 0.1) : 0;
    const totalWon = feeWon + vatWon;

    document.getElementById('feeRateVal').textContent = ratePercent;
    document.getElementById('feeMaxVal').textContent = formatKoreanMoney(feeWon);
    document.getElementById('feeVatVal').textContent = formatKoreanMoney(vatWon);
    document.getElementById('feeTotalVal').textContent = formatKoreanMoney(totalWon);
  }

  // Acquisition Tax Calc
  const taxHouseBtns = document.querySelectorAll('#taxHouseGroup .segment-btn');
  const taxAmountInput = document.getElementById('taxAmount');
  let activeHouseCount = '1';

  taxHouseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      taxHouseBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeHouseCount = btn.getAttribute('data-house');
      calculateAcquisitionTax();
    });
  });

  if (taxAmountInput) taxAmountInput.addEventListener('input', calculateAcquisitionTax);

  function calculateAcquisitionTax() {
    const amountManwon = parseFloat(taxAmountInput.value) || 0;
    let taxRate = 0;
    let eduRate = 0;
    let ruralRate = 0.002; // 전용 85m2 초과 등 고려

    if (activeHouseCount === '1') {
      if (amountManwon <= 60000) {
        taxRate = 0.01;
        eduRate = 0.001;
      } else if (amountManwon <= 90000) {
        // 비례세율: (거래금액 * 2/3억원 - 3) / 100
        const priceEok = amountManwon / 10000;
        taxRate = (priceEok * (2/3) - 3) / 100;
        eduRate = taxRate * 0.1;
      } else {
        taxRate = 0.03;
        eduRate = 0.003;
      }
    } else if (activeHouseCount === '2') {
      // 조정대상지역(강남3구/용산구 - 잠실은 송파구로 조정지역)
      taxRate = 0.08;
      eduRate = 0.004;
    } else {
      // 3주택 이상
      taxRate = 0.12;
      eduRate = 0.004;
    }

    const totalRate = taxRate + eduRate + ruralRate;
    const baseWon = amountManwon * 10000;
    const taxWon = Math.round(baseWon * taxRate);
    const eduWon = Math.round(baseWon * eduRate);
    const ruralWon = Math.round(baseWon * ruralRate);
    const totalTaxWon = taxWon + eduWon + ruralWon;

    document.getElementById('taxRateVal').textContent = (totalRate * 100).toFixed(2) + '%';
    document.getElementById('taxBaseVal').textContent = formatKoreanMoney(taxWon);
    document.getElementById('taxEduVal').textContent = formatKoreanMoney(eduWon + ruralWon);
    document.getElementById('taxTotalVal').textContent = formatKoreanMoney(totalTaxWon);
  }

  // Initial runs
  calculateBrokerageFee();
  calculateAcquisitionTax();
}

function formatKoreanMoney(won) {
  if (won === 0) return '0원';
  const eok = Math.floor(won / 100000000);
  const man = Math.floor((won % 100000000) / 10000);
  const remainder = won % 10000;

  let result = '';
  if (eok > 0) result += `${eok}억 `;
  if (man > 0) result += `${man.toLocaleString()}만 `;
  if (remainder > 0 && eok === 0 && man === 0) result += `${remainder.toLocaleString()}`;
  return (result + '원').trim();
}

/* ==========================================================================
   CONSULTATION FORM & RESERVATION
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const complex = document.getElementById('clientComplex').value;
    const type = document.getElementById('clientInquiryType').value;

    if (!name || !phone) {
      showToast('성함과 연락처를 입력해 주세요.');
      return;
    }

    // Success simulation
    showToast(`✅ ${name} 고객님의 상담 접수가 완료되었습니다. 담당 공인중개사가 곧 연락드리겠습니다.`);
    form.reset();
  });
}

function openConsultationWithContext(contextText) {
  const consultSection = document.getElementById('contact');
  const memoInput = document.getElementById('clientMemo');
  if (memoInput) {
    memoInput.value = `[문의 항목]: ${contextText}`;
  }
  if (consultSection) {
    consultSection.scrollIntoView({ behavior: 'smooth' });
  }
  showToast(`📋 '${contextText}' 상담 양식으로 이동했습니다.`);
}

function handleCallClick(label) {
  showToast(`📞 잠실 프라임 대표번호로 연결합니다 (${label})`);
}

/* ==========================================================================
   MODAL CONTROLLER
   ========================================================================== */
function initModals() {
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   TOAST NOTIFICATION
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="toast-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    </span>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
