// Jinsung Tools & Electric Landing Page Script

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
    if (window.lucide) window.lucide.createIcons();
  }
}

// Category Filtering
function filterCategory(category, element) {
  // Update active tab styles
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.classList.remove('bg-slate-900', 'text-amber-400', 'shadow-sm');
    tab.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
  });

  if (element) {
    element.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
    element.classList.add('bg-slate-900', 'text-amber-400', 'shadow-sm');
  }

  // Filter cards
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (category === 'all' || card.classList.contains(category)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });

  if (window.lucide) window.lucide.createIcons();
}

// Quote Modal Controls
function openQuoteModal() {
  const modal = document.getElementById('quote-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeQuoteModal() {
  const modal = document.getElementById('quote-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('quote-modal');
  if (modal && e.target === modal) {
    closeQuoteModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuoteModal();
  }
});

// Handle Quote Submission
function handleQuoteSubmit(e) {
  e.preventDefault();
  
  const company = document.getElementById('company-name')?.value || '';
  const contact = document.getElementById('contact-name')?.value || '';
  const phone = document.getElementById('contact-phone')?.value || '';
  const items = document.getElementById('quote-items')?.value || '';
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value === 'pickup' ? '매장 방문 픽업' : '현장 화물 직배송';

  const quoteData = {
    company,
    contact,
    phone,
    items,
    deliveryType,
    submittedAt: new Date().toISOString()
  };

  // Save to localStorage as a record
  try {
    const existing = JSON.parse(localStorage.getItem('jinsung_quotes') || '[]');
    existing.push(quoteData);
    localStorage.setItem('jinsung_quotes', JSON.stringify(existing));
  } catch (err) {
    console.error('Storage error:', err);
  }

  closeQuoteModal();
  showToast(`견적 요청이 정상 접수되었습니다. 남겨주신 연락처(${phone})로 신속히 회신드리겠습니다.`);
  
  // Reset form
  const form = document.getElementById('quote-form');
  if (form) form.reset();
}

// Direct SMS Quote Generator (Works seamlessly on mobile & copies on PC)
function sendQuoteViaSms() {
  const company = document.getElementById('company-name')?.value || '';
  const contact = document.getElementById('contact-name')?.value || '';
  const phone = document.getElementById('contact-phone')?.value || '';
  const items = document.getElementById('quote-items')?.value || '';

  if (!items) {
    alert('필요한 품목 및 수량을 먼저 입력해 주세요.');
    document.getElementById('quote-items')?.focus();
    return;
  }

  const message = `[진성공구철물 견적문의]\n상호/현장: ${company || '현장'}\n담당자: ${contact || '담당자'}\n연락처: ${phone}\n\n[문의품목]\n${items}`;
  const targetNumber = '01037847643';
  
  // 1. Copy formatted text to clipboard (works on both PC & mobile)
  navigator.clipboard.writeText(message).catch(() => {});

  // 2. Open SMS composer (opens native messaging app on smartphones)
  window.location.href = `sms:${targetNumber}?body=${encodeURIComponent(message)}`;

  // 3. User feedback toast
  showToast(`문자 앱으로 연결합니다. (PC 이용 시 내용이 클립보드에 복사되었습니다)`);
}

// FAQ Accordion Toggle
function toggleFaq(button) {
  const content = button.nextElementSibling;
  const icon = button.querySelector('[data-lucide="chevron-down"]');
  
  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    if (icon) icon.style.transform = 'rotate(180deg)';
  } else {
    content.classList.add('hidden');
    if (icon) icon.style.transform = 'rotate(0deg)';
  }
}

// Copy Address to Clipboard
function copyAddress() {
  const addressText = '경기도 안성시 미양면 신두만곡로 927-14 안성기계공구상가 진성공구철물';
  navigator.clipboard.writeText(addressText).then(() => {
    showToast('매장 주소가 클립보드에 복사되었습니다.');
  }).catch(() => {
    showToast('주소 복사에 실패했습니다. 직접 복사해 주세요.');
  });
}

// Toast Notification
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    
    if (window.lucide) window.lucide.createIcons();

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }
}
