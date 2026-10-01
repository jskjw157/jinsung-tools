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

// Close modals on backdrop click
document.addEventListener('click', (e) => {
  const quoteModal = document.getElementById('quote-modal');
  if (quoteModal && e.target === quoteModal) {
    closeQuoteModal();
  }
  const kakaoModal = document.getElementById('kakao-modal');
  if (kakaoModal && e.target === kakaoModal) {
    closeKakaoModal();
  }
});

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeQuoteModal();
    closeKakaoModal();
  }
});

// Handle Quote Submission (Dispatches directly to owner's phone & copies to clipboard)
function handleQuoteSubmit(e) {
  e.preventDefault();
  
  const company = document.getElementById('company-name')?.value || '';
  const contact = document.getElementById('contact-name')?.value || '';
  const phone = document.getElementById('contact-phone')?.value || '';
  const items = document.getElementById('quote-items')?.value || '';
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value === 'pickup' ? '매장 방문 픽업' : '현장 화물 직배송';

  if (!items) {
    alert('필요한 품목 및 수량을 먼저 입력해 주세요.');
    document.getElementById('quote-items')?.focus();
    return;
  }

  const quoteMessage = `[진성공구철물 도매견적 신청]\n• 상호/현장: ${company || '현장'}\n• 담당자: ${contact || '담당자'}\n• 연락처: ${phone}\n• 수령방식: ${deliveryType}\n\n[신청품목]\n${items}`;
  const targetNumber = '0316710409';

  // 1. Save to localStorage as backup record
  try {
    const existing = JSON.parse(localStorage.getItem('jinsung_quotes') || '[]');
    existing.push({ company, contact, phone, items, deliveryType, submittedAt: new Date().toISOString() });
    localStorage.setItem('jinsung_quotes', JSON.stringify(existing));
  } catch (err) {
    console.error('Storage error:', err);
  }

  // 2. Copy formatted text to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(quoteMessage).catch(() => {});
  }

  closeQuoteModal();

  // 3. Dispatch to representative
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = `sms:${targetNumber}?body=${encodeURIComponent(quoteMessage)}`;
    showToast(`견적서 내용이 문자 앱으로 연결되었습니다. [전송]을 누르시면 대표님께 즉시 발송됩니다.`);
  } else {
    showToast(`견적서 내용이 클립보드에 복사되었습니다. 대표님 카톡이나 문자로 전송해 주세요.`);
    openKakaoInquiry(quoteMessage);
  }
  
  // Reset form
  const form = document.getElementById('quote-form');
  if (form) form.reset();
}

// Direct SMS Quote Generator
function sendQuoteViaSms() {
  const company = document.getElementById('company-name')?.value || '';
  const contact = document.getElementById('contact-name')?.value || '';
  const phone = document.getElementById('contact-phone')?.value || '';
  const items = document.getElementById('quote-items')?.value || '';
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value === 'pickup' ? '매장 방문 픽업' : '현장 화물 직배송';

  if (!items) {
    alert('필요한 품목 및 수량을 먼저 입력해 주세요.');
    document.getElementById('quote-items')?.focus();
    return;
  }

  const message = `[진성공구철물 견적문의]\n• 상호/현장: ${company || '현장'}\n• 담당자: ${contact || '담당자'}\n• 연락처: ${phone}\n• 수령방식: ${deliveryType}\n\n[문의품목]\n${items}`;
  const targetNumber = '0316710409';
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).catch(() => {});
  }

  window.location.href = `sms:${targetNumber}?body=${encodeURIComponent(message)}`;
  showToast(`문자 앱으로 연결합니다. (PC 이용 시 내용이 클립보드에 복사되었습니다)`);
}

// Send Quote via KakaoTalk
function sendQuoteViaKakao() {
  const company = document.getElementById('company-name')?.value || '';
  const contact = document.getElementById('contact-name')?.value || '';
  const phone = document.getElementById('contact-phone')?.value || '';
  const items = document.getElementById('quote-items')?.value || '';
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value === 'pickup' ? '매장 방문 픽업' : '현장 화물 직배송';

  if (!items) {
    alert('필요한 품목 및 수량을 먼저 입력해 주세요.');
    document.getElementById('quote-items')?.focus();
    return;
  }

  const message = `[진성공구철물 견적신청]\n• 상호/현장: ${company || '현장'}\n• 담당자: ${contact || '담당자'}\n• 연락처: ${phone}\n• 수령방식: ${deliveryType}\n\n[신청품목]\n${items}`;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(message).catch(() => {});
  }

  closeQuoteModal();
  openKakaoInquiry(message);
}

// KakaoTalk Inquiry Modal Controls
function openKakaoInquiry(prefilledText = '') {
  const modal = document.getElementById('kakao-modal');
  if (modal) {
    const copyBox = document.getElementById('kakao-copy-box');
    const msgElem = document.getElementById('kakao-prefilled-text');
    if (prefilledText && msgElem && copyBox) {
      msgElem.textContent = prefilledText;
      copyBox.classList.remove('hidden');
    } else if (copyBox) {
      copyBox.classList.add('hidden');
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeKakaoModal() {
  const modal = document.getElementById('kakao-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// Launch KakaoTalk with smart PC & Mobile support
function launchKakaoTalk() {
  const kakaoUrl = window.JINSUNG_KAKAO_URL || '';
  if (kakaoUrl) {
    window.open(kakaoUrl, '_blank');
    return;
  }

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = 'kakaotalk://';
    showToast('카카오톡 앱으로 연결합니다.');
  } else {
    // On PC, copy phone number and highlight the PC guidance box
    copyKakaoNumber();
    const pcGuide = document.getElementById('pc-kakao-guide');
    if (pcGuide) {
      pcGuide.classList.add('ring-2', 'ring-amber-500');
      setTimeout(() => pcGuide.classList.remove('ring-2', 'ring-amber-500'), 3000);
    }
    showToast('매장 대표 번호(031-671-0409)가 복사되었습니다! PC 카톡 [친구 추가 > 연락처]에 붙여넣어 주세요.');
  }
}

function copyKakaoNumber() {
  const num = '031-671-0409';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(num).then(() => {
      showToast('매장 대표 번호(031-671-0409)가 복사되었습니다!');
    }).catch(() => {
      showToast('번호: 031-671-0409');
    });
  }
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

// ==========================================
// 24h AI Chatbot (OpenCode VPS Live Bridge)
// ==========================================
const JINSUNG_CHAT_API = 'https://srv1898445.hstgr.cloud/api/chat';
let chatHistory = [];
let isChatbotLoading = false;

function toggleChatbot() {
  const widget = document.getElementById('chatbot-widget');
  if (!widget) return;

  const isHidden = widget.classList.contains('hidden');
  if (isHidden) {
    widget.classList.remove('hidden');
    const input = document.getElementById('chat-input');
    if (input) setTimeout(() => input.focus(), 150);
  } else {
    widget.classList.add('hidden');
  }

  if (window.lucide) window.lucide.createIcons();
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = promptText;
  }
  handleChatSubmit();
}

async function handleChatSubmit(e) {
  if (e) e.preventDefault();
  if (isChatbotLoading) return;

  const input = document.getElementById('chat-input');
  if (!input) return;
  const userText = input.value.trim();
  if (!userText) return;

  // Clear input
  input.value = '';

  // Hide quick chips once first question is sent
  const chips = document.getElementById('chat-quick-chips');
  if (chips) chips.classList.add('hidden');

  // Add User Message Bubble
  appendChatMessage('user', userText);

  // Show typing indicator & disable button
  setChatbotLoading(true);

  try {
    const response = await fetch(JINSUNG_CHAT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userText,
        history: chatHistory.slice(-6)
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.reply || '답변을 생성하지 못했습니다. 매장 대표(031-671-0409)으로 문의해 주세요.';

    appendChatMessage('assistant', replyText);

    // Save in session history
    chatHistory.push({ role: 'user', content: userText });
    chatHistory.push({ role: 'assistant', content: replyText });

  } catch (err) {
    console.warn('Chatbot API fallback triggered:', err);
    // Instant smart local fallback
    const fallbackReply = generateLocalFallback(userText);
    appendChatMessage('assistant', fallbackReply);
  } finally {
    setChatbotLoading(false);
  }
}

function setChatbotLoading(loading) {
  isChatbotLoading = loading;
  const typing = document.getElementById('chat-typing');
  const btn = document.getElementById('chat-submit-btn');
  const input = document.getElementById('chat-input');

  if (typing) {
    if (loading) typing.classList.remove('hidden');
    else typing.classList.add('hidden');
  }
  if (btn) btn.disabled = loading;
  if (input && !loading) input.focus();

  scrollChatToBottom();
}

function appendChatMessage(role, text) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'flex items-start gap-2 animate-in fade-in duration-200';

  const formattedHtml = formatChatMarkdown(text);

  if (role === 'user') {
    msgDiv.classList.add('justify-end');
    msgDiv.innerHTML = `
      <div class="bg-amber-500 text-slate-950 font-medium rounded-2xl rounded-tr-sm p-3 max-w-[85%] leading-relaxed shadow-sm">
        ${formattedHtml}
      </div>
    `;
  } else {
    msgDiv.innerHTML = `
      <div class="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
        <i data-lucide="bot" class="w-3.5 h-3.5"></i>
      </div>
      <div class="bg-slate-800 border border-slate-700/80 rounded-2xl rounded-tl-sm p-3 text-slate-200 space-y-2 max-w-[88%] leading-relaxed shadow-sm">
        <div>${formattedHtml}</div>
        <div class="pt-1.5 border-t border-slate-700/60 flex items-center gap-2">
          <a href="tel:0316710409" class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300">
            <i data-lucide="phone-call" class="w-3 h-3"></i>
            <span>031-671-0409 매장 전화 연결</span>
          </a>
        </div>
      </div>
    `;
  }

  container.appendChild(msgDiv);
  if (window.lucide) window.lucide.createIcons();
  scrollChatToBottom();
}

function formatChatMarkdown(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\n/g, '<br>');
}

function scrollChatToBottom() {
  const container = document.getElementById('chat-messages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function generateLocalFallback(query) {
  const q = query.toLowerCase();
  if (q.includes('영업') || q.includes('시간') || q.includes('오픈') || q.includes('몇 시')) {
    return '진성공구철물은 **평일 오전 07:00 ~ 19:00**, **토요일 오전 07:00 ~ 15:00** 정상 영업합니다 (일요일 휴무).\n현장 출근 전 조기 자재 픽업이 가능합니다!';
  }
  if (q.includes('주차') || q.includes('트럭') || q.includes('화물')) {
    return '매장 전면에 **1톤 화물차 전용 상하차 및 대형 주차 공간**이 완비되어 있어 자재 싣고 내리기 매우 편리합니다.';
  }
  if (q.includes('차단기') || q.includes('ls')) {
    return '**LS산전 누전차단기(ELB) 및 배선차단기(MCCB) 15A~225A 전 규격** 상시 대량 보유 중입니다. 실시간 수량 확인은 매장 대표(031-671-0409)으로 연락 주시면 즉시 확인해 드립니다.';
  }
  return '네, 말씀해 주신 내용 확인했습니다! 대량 발주 및 실시간 재고·단가는 **매장 대표 번호(031-671-0409)**로 전화 또는 문자 주시면 가장 빠르고 정확하게 안내받으실 수 있습니다.';
}

