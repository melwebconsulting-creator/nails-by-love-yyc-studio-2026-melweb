/**
 * Nails by Love | NE Calgary
 * Vanilla JavaScript (script.js)
 * Clean, lightweight, zero-dependency functionality
 */

function initApp() {
  initTabs();
  initCalculator();
  initAccordions();
  initLightbox();
  initShareAndCopy();
  initImageFallbacks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   1. TAB NAVIGATION
   ========================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update panel visibility
      tabPanels.forEach(panel => {
        if (panel.id === `tab-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   2. INTERACTIVE PRICE ESTIMATOR & INSTAGRAM DM BUILDER
   ========================================================================== */
function initCalculator() {
  const state = {
    service: 'biab', // gelx, biab, shellac
    length: 'medium', // short, medium, long
    art: 'french', // plain, french, custom
    removal: 'no' // no, yes
  };

  const pricingData = {
    base: {
      gelx: { min: 75, max: 90, name: 'GelX Extensions' },
      biab: { min: 65, max: 80, name: 'BIAB Structured Gel' },
      shellac: { min: 45, max: 55, name: 'Shellac Gel Manicure' }
    },
    length: {
      short: { addMin: 0, addMax: 0, name: 'Short / Natural' },
      medium: { addMin: 5, addMax: 10, name: 'Medium' },
      long: { addMin: 10, addMax: 20, name: 'Long / XL' }
    },
    art: {
      plain: { addMin: 0, addMax: 0, name: 'Solid Color / Plain' },
      french: { addMin: 15, addMax: 25, name: 'French Tip / Glazed Chrome' },
      custom: { addMin: 25, addMax: 45, name: 'Custom Art / 3D / Pearls' }
    },
    removal: {
      no: { addMin: 0, addMax: 0, name: 'No removal required' },
      yes: { addMin: 15, addMax: 20, name: 'Soak-off removal needed' }
    }
  };

  const optionButtons = document.querySelectorAll('.calc-option-btn');
  const priceDisplay = document.getElementById('calc-price-display');
  const previewDisplay = document.getElementById('calc-preview-text');
  const copyDmBtn = document.getElementById('calc-copy-dm-btn');

  function updateEstimate() {
    const baseP = pricingData.base[state.service];
    const lenP = pricingData.length[state.length];
    const artP = pricingData.art[state.art];
    const remP = pricingData.removal[state.removal];

    const totalMin = baseP.min + lenP.addMin + artP.addMin + remP.addMin;
    const totalMax = baseP.max + lenP.addMax + artP.addMax + remP.addMax;

    if (priceDisplay) {
      priceDisplay.textContent = `$${totalMin} – $${totalMax} CAD`;
    }

    const messageTemplate = 
`Hi Love! 👋
I would love to book an appointment with Nails by Love:

• Service: ${baseP.name}
• Desired Length: ${lenP.name}
• Nail Art: ${artP.name}
• Removal: ${remP.name}

I am attaching my inspiration photos right now for an exact quote. 
Could you let me know your next availability in NE Calgary? Thank you! 💕`;

    if (previewDisplay) {
      previewDisplay.textContent = messageTemplate;
    }

    return messageTemplate;
  }

  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-cat');
      const val = btn.getAttribute('data-val');

      if (!category || !val) return;

      state[category] = val;

      // Update button UI in this group
      const parentGroup = btn.closest('.calc-options-grid');
      if (parentGroup) {
        parentGroup.querySelectorAll('.calc-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      }

      updateEstimate();
    });
  });

  if (copyDmBtn) {
    copyDmBtn.addEventListener('click', () => {
      const msg = updateEstimate();
      copyToClipboard(msg);
      showToast('📋 Message template copied! Opening Instagram DM...');
      setTimeout(() => {
        window.open('https://www.instagram.com/nailsbylove_yyc/', '_blank');
      }, 1100);
    });
  }

  // Initial calculation
  updateEstimate();
}

/* ==========================================================================
   3. POLICY & FAQ ACCORDIONS
   ========================================================================== */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      if (!item) return;

      const isOpen = item.classList.contains('open');

      // Close all other accordions
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
        }
      });

      // Toggle clicked
      if (isOpen) {
        item.classList.remove('open');
      } else {
        item.classList.add('open');
      }
    });
  });
}

/* ==========================================================================
   4. IMAGE LIGHTBOX
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalTitle = document.getElementById('lightbox-title');
  const modalSub = document.getElementById('lightbox-sub');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const dmInquireBtn = document.getElementById('lightbox-dm-btn');

  if (!modal || !modalImg) return;

  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'Nails by Love Inspiration';
      const desc = item.getAttribute('data-desc') || 'Send this look to @nailsbylove_yyc on Instagram for a custom quote';

      if (img) {
        modalImg.src = img.src;
        modalImg.alt = title;
      }
      if (modalTitle) modalTitle.textContent = title;
      if (modalSub) modalSub.textContent = desc;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (dmInquireBtn) {
    dmInquireBtn.addEventListener('click', () => {
      const styleName = modalTitle ? modalTitle.textContent : 'this nail set';
      const inquiryText = `Hi Love! I saw ${styleName} on your website and would love to ask about booking this look. I am attaching my nails & inspo!`;
      copyToClipboard(inquiryText);
      showToast('📋 Inspo inquiry copied! Opening Instagram...');
      setTimeout(() => {
        window.open('https://www.instagram.com/nailsbylove_yyc/', '_blank');
      }, 1000);
    });
  }
}

/* ==========================================================================
   5. SHARING & CLIPBOARD UTILITIES
   ========================================================================== */
function initShareAndCopy() {
  const shareButtons = document.querySelectorAll('.js-share-btn');
  const copyHandleButtons = document.querySelectorAll('.js-copy-handle-btn');

  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (navigator.share) {
        navigator.share({
          title: 'Nails by Love | NE Calgary',
          text: 'Check out Nails by Love in NE Calgary for GelX, BIAB, and Shellac appointments!',
          url: window.location.href
        }).catch(() => {
          copyLinkFallback();
        });
      } else {
        copyLinkFallback();
      }
    });
  });

  function copyLinkFallback() {
    copyToClipboard(window.location.href);
    showToast('✨ Website link copied to clipboard!');
  }

  copyHandleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard('@nailsbylove_yyc');
      showToast('📸 Instagram handle copied: @nailsbylove_yyc');
    });
  });
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.left = '-9999px';
  document.body.appendChild(tempInput);
  tempInput.focus();
  tempInput.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Copy fallback failed', err);
  }
  document.body.removeChild(tempInput);
}

function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  if (window._toastTimer) {
    clearTimeout(window._toastTimer);
  }

  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   6. ZERO-BROKEN-IMAGE POLICY FALLBACK
   ========================================================================== */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const parent = img.parentElement;
      if (parent) {
        parent.style.background = 'linear-gradient(135deg, #EFE8DF 0%, #DFD5C8 100%)';
        parent.style.display = 'flex';
        parent.style.alignItems = 'center';
        parent.style.justifyContent = 'center';
        if (!parent.querySelector('.fallback-label')) {
          const label = document.createElement('span');
          label.className = 'fallback-label';
          label.style.fontSize = '0.75rem';
          label.style.color = '#6B625B';
          label.style.fontWeight = '600';
          label.textContent = img.alt || 'Nails by Love';
          parent.appendChild(label);
        }
      }
    });
  });
}
