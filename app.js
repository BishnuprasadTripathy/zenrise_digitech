/* Zenrise Digitech - Pure Vanilla JS Engine & Animations */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide SVG Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initCustomCursor();
  initSunriseCanvas();
  initThemeEngine();
  initMobileMenu();
  initServiceModals();
  initPortfolioFilters();
  initTestimonialsSlider();
  initFaqAccordion();
  initContactForm();
  initScrollReveals();
  initMagneticButtons();
});

/* ==========================================================================
   1. CUSTOM DUAL-RING GLOW CURSOR & MAGNETIC EFFECT
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('custom-cursor-dot');
  const ring = document.getElementById('custom-cursor-ring');
  const toggleBtn = document.getElementById('cursor-toggle-btn');
  const toggleLabel = document.getElementById('cursor-toggle-label');

  if (!dot || !ring) return;

  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
  const savedCursor = localStorage.getItem('zenrise_cursor');
  let cursorEnabled = savedCursor ? savedCursor === 'enabled' : !isTouchDevice;

  let mouseX = -100;
  let mouseY = -100;
  let dotX = -100;
  let dotY = -100;
  let ringX = -100;
  let ringY = -100;
  let isMoving = false;

  function updateCursorUI() {
    if (cursorEnabled && !isTouchDevice) {
      document.body.classList.add('custom-cursor-enabled');
      dot.style.display = 'block';
      ring.style.display = 'block';
      if (toggleLabel) toggleLabel.textContent = 'Cursor On';
      if (toggleBtn) {
        toggleBtn.classList.add('bg-solar-500/20', 'border-solar-500/50', 'text-solar-400');
        toggleBtn.classList.remove('bg-obsidian-850', 'border-white/10', 'text-slate-400');
      }
    } else {
      document.body.classList.remove('custom-cursor-enabled');
      dot.style.display = 'none';
      ring.style.display = 'none';
      if (toggleLabel) toggleLabel.textContent = 'Cursor Off';
      if (toggleBtn) {
        toggleBtn.classList.remove('bg-solar-500/20', 'border-solar-500/50', 'text-solar-400');
        toggleBtn.classList.add('bg-obsidian-850', 'border-white/10', 'text-slate-400');
      }
    }
  }

  updateCursorUI();

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      dotX = mouseX;
      dotY = mouseY;
      ringX = mouseX;
      ringY = mouseY;
      isMoving = true;
    }

    const isInteractive = e.target.closest('a, button, input, textarea, select, [role="button"], .interactive-hover');
    if (isInteractive) {
      dot.classList.add('hovered');
      ring.classList.add('hovered');
    } else {
      dot.classList.remove('hovered');
      ring.classList.remove('hovered');
    }
  });

  window.addEventListener('mousedown', () => {
    dot.classList.add('clicked');
    ring.classList.add('clicked');
  });

  window.addEventListener('mouseup', () => {
    dot.classList.remove('clicked');
    ring.classList.remove('clicked');
  });

  function animateCursor() {
    if (cursorEnabled && !isTouchDevice && isMoving) {
      // Direct fast tracking for dot
      dotX += (mouseX - dotX) * 0.75;
      dotY += (mouseY - dotY) * 0.75;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

      // Smooth delayed lerp tracking for ring
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      cursorEnabled = !cursorEnabled;
      localStorage.setItem('zenrise_cursor', cursorEnabled ? 'enabled' : 'disabled');
      updateCursorUI();
    });
  }
}

/* Magnetic Buttons */
function initMagneticButtons() {
  const magBtns = document.querySelectorAll('.btn-magnetic');
  magBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate3d(${x * 0.2}px, ${y * 0.2}px, 0)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

/* ==========================================================================
   2. HTML5 PARTICLES SUNRISE CANVAS
   ========================================================================== */
function initSunriseCanvas() {
  const canvas = document.getElementById('sunrise-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(width / 25), 65);
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = -Math.random() * 0.5 - 0.1;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.4 ? '#FF5722' : Math.random() > 0.5 ? '#FF9100' : '#FFC107';
    }

    update(mouseX, mouseY) {
      this.x += this.speedX;
      this.y += this.speedY;

      if (mouseX !== undefined && mouseY !== undefined) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 5;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = document.body.classList.contains('light-mode-active') ? Math.min(1, this.alpha * 1.8) : this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = document.body.classList.contains('light-mode-active') ? 14 : 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let mouseX = undefined;
  let mouseY = undefined;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.body.classList.contains('light-mode-active');
    const gradient = ctx.createRadialGradient(
      width / 2,
      height * 0.3,
      50,
      width / 2,
      height * 0.3,
      width * 0.75
    );

    if (isLight) {
      gradient.addColorStop(0, 'rgba(255, 87, 34, 0.16)');
      gradient.addColorStop(0.4, 'rgba(255, 145, 0, 0.08)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(255, 87, 34, 0.06)');
      gradient.addColorStop(0.4, 'rgba(255, 145, 0, 0.02)');
      gradient.addColorStop(1, 'rgba(11, 12, 16, 0)');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    particles.forEach((p) => {
      p.update(mouseX, mouseY);
      p.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   3. FULL PAGE THEME ENGINE (SWITCHES ALL SECTIONS INCLUDING 100VH HERO)
   ========================================================================== */
function initThemeEngine() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.getElementById('theme-sun-icon');
  const moonIcon = document.getElementById('theme-moon-icon');

  const savedTheme = localStorage.getItem('zenrise_theme');
  let isDark = savedTheme ? savedTheme === 'dark' : false;

  function updateThemeUI() {
    if (isDark) {
      document.body.classList.remove('light-mode-active');
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');

      document.querySelectorAll('.theme-section').forEach((sec) => {
        sec.classList.remove('bg-white', 'text-slate-900');
        sec.classList.add('bg-obsidian-950', 'text-slate-100');
      });
      document.querySelectorAll('.theme-card').forEach((card) => {
        card.classList.remove('bg-white', 'border-slate-200', 'text-slate-900');
        card.classList.add('bg-white/5', 'border-white/10', 'text-slate-100');
      });

    } else {
      document.body.classList.add('light-mode-active');
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');

      document.querySelectorAll('.theme-section').forEach((sec) => {
        sec.classList.remove('bg-obsidian-950', 'bg-obsidian-900', 'text-slate-100');
        sec.classList.add('bg-white', 'text-slate-900');
      });
      document.querySelectorAll('.theme-card').forEach((card) => {
        card.classList.remove('bg-white/5', 'border-white/10', 'text-slate-100');
        card.classList.add('bg-white', 'border-slate-200', 'text-slate-900');
      });

    }
  }

  // Apply saved theme state immediately on load
  updateThemeUI();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      isDark = !isDark;
      localStorage.setItem('zenrise_theme', isDark ? 'dark' : 'light');
      updateThemeUI();
    });
  }
}

/* ==========================================================================
   4. SERVICE SCOPE DETAILS MODAL (MODE-ADAPTIVE)
   ========================================================================== */
const serviceData = {
  seo: {
    title: 'SEO & Search Engine Dominance',
    iconName: 'search',
    fullDescription: 'Our Search Engine Optimization strategy focuses on driving measurable organic growth. We audit your technical site architecture, eliminate crawl errors, build contextual topic clusters, and acquire top-tier authority backlinks to turn Google search queries into your biggest customer acquisition funnel.',
    deliverables: [
      'Complete Technical & Mobile Performance Audit',
      'Intent-Driven Keyword Research & Mapping',
      'On-Page Optimization & Schema Markup',
      'High-DA Backlink Acquisition Strategy',
      'Local SEO & Google Business Optimization',
      'Monthly Transparent Ranking & Revenue Reports'
    ],
    tools: ['Ahrefs', 'SEMrush', 'Google Search Console', 'Screaming Frog', 'SurferSEO'],
    timeline: '2 - 4 Weeks Initial Launch'
  },
  web: {
    title: 'Website Engineering & UI/UX Design',
    iconName: 'layout',
    fullDescription: 'Your website is your 24/7 digital flagship storefront. We engineer custom web applications using modern web technologies, responsive layouts, glassmorphic visual aesthetics, and intuitive UI/UX workflows optimized for Core Web Vitals and peak conversion rates.',
    deliverables: [
      'Custom Figma UI/UX Interactive Prototypes',
      'Ultra-Fast Responsive Web Engineering',
      'Conversion Rate Optimized (CRO) Funnels',
      'CMS & E-Commerce System Integration',
      'Security, SSL & Cloud Hosting Deployment',
      'Core Web Vitals 95+ Performance Scores'
    ],
    tools: ['React', 'Tailwind CSS', 'Figma', 'Next.js', 'Vite', 'WordPress'],
    timeline: '3 - 5 Weeks Complete Build'
  },
  ads: {
    title: 'Performance Marketing & Paid Ads',
    iconName: 'target',
    fullDescription: 'Eliminate wasted ad spend with Zenrise performance campaigns. We develop high-converting ad copy, visual assets, retargeting pixels, and bid management models engineered to achieve a 4x+ Return on Ad Spend (ROAS).',
    deliverables: [
      'Omnichannel Ad Account & Pixel Setup',
      'Deep Competitor & Audience Targeting',
      'A/B Testing Ad Creative & Landing Pages',
      'Remarketing & Cart Recovery Funnels',
      'Daily Bid Management & Cost Reduction',
      'Live Real-Time ROI Analytics Dashboard'
    ],
    tools: ['Google Ads', 'Meta Business Suite', 'LinkedIn Ads', 'Google Tag Manager', 'Hotjar'],
    timeline: 'Immediate Launch (48 Hours)'
  },
  social: {
    title: 'Social Media & Content Strategy',
    iconName: 'share-2',
    fullDescription: 'Build an engaged, loyal community around your brand. We handle end-to-end content calendar creation, high-definition graphic design, short-form reel editing, and active community management that transforms casual followers into brand advocates.',
    deliverables: [
      'Monthly Content Strategy & Calendar',
      'High-Impact Graphic Design & Video Reels',
      'Copywriting & Trending Audio Research',
      'Community Engagement & DM Funnel Automation',
      'Brand Voice & Visual Style Guide',
      'Audience Growth Analytics'
    ],
    tools: ['Canva Pro', 'CapCut', 'Adobe Premiere Pro', 'Buffer', 'Brand24'],
    timeline: 'Ongoing Monthly Growth'
  },
  brand: {
    title: 'Brand Strategy & Digital Identity',
    iconName: 'compass',
    fullDescription: 'Stand out from competitors with a crisp, professional brand identity. We craft brand guidelines, logo suites, typography hierarchies, and compelling market positioning narratives that resonate with modern consumers.',
    deliverables: [
      'Primary & Secondary Logo Architecture',
      'Brand Color Palette & Typography Systems',
      'Brand Voice & Value Proposition Guide',
      'Social Media Kit & Pitch Deck Templates',
      'Competitor Differentiation Matrix',
      'Complete Brand Stylebook PDF'
    ],
    tools: ['Adobe Illustrator', 'Figma', 'Photoshop', 'Miro'],
    timeline: '2 Weeks Delivery'
  },
  funnels: {
    title: 'Influencer & Email Marketing',
    iconName: 'mail',
    fullDescription: 'Maximized retention and outreach. We connect your brand with vetted influencers in your niche and design high-converting email sequences (welcome flows, cart abandonments, product updates) that consistently generate recurring sales.',
    deliverables: [
      'Influencer Discovery & Contract Negotiation',
      'Automated Email Welcome & Nurture Sequences',
      'Custom Email Newsletter Template Design',
      'List Segmentation & Deliverability Optimization',
      'UGC Content Rights Acquisition',
      'Conversion & Click-Through Tracking'
    ],
    tools: ['Klaviyo', 'Mailchimp', 'Modash', 'Upfluence'],
    timeline: '1 - 2 Weeks Setup'
  }
};

function initServiceModals() {
  const modalOverlay = document.getElementById('service-modal-overlay');
  const modalBox = document.getElementById('service-modal-box');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modalOverlay || !modalBox) return;

  document.querySelectorAll('[data-service-trigger]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const srvKey = btn.getAttribute('data-service-trigger');
      const data = serviceData[srvKey];
      if (!data) return;

      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.fullDescription;
      document.getElementById('modal-timeline').textContent = data.timeline;

      // Render Deliverables
      const delivContainer = document.getElementById('modal-deliverables');
      delivContainer.innerHTML = data.deliverables.map((item) => `
        <div class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-xs text-slate-800 dark:text-slate-200">
          <i data-lucide="check-circle-2" class="w-4 h-4 text-solar-500 shrink-0 mt-0.5"></i>
          <span>${item}</span>
        </div>
      `).join('');

      // Render Tools
      const toolsContainer = document.getElementById('modal-tools');
      toolsContainer.innerHTML = data.tools.map((t) => `
        <span class="px-3 py-1 rounded-full bg-solar-500/10 border border-solar-500/20 text-xs font-medium text-solar-600 dark:text-solar-300">
          ${t}
        </span>
      `).join('');

      if (window.lucide) window.lucide.createIcons();

      // Check mode for adaptive modal background
      if (document.body.classList.contains('light-mode-active')) {
        modalBox.className = 'relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-slate-900 animate-fadeIn';
      } else {
        modalBox.className = 'relative w-full max-w-2xl bg-obsidian-900 rounded-3xl border border-solar-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-slate-100 animate-fadeIn';
      }

      modalOverlay.classList.remove('hidden');
      modalOverlay.classList.add('flex');
    });
  });

  const closeModal = () => {
    modalOverlay.classList.add('hidden');
    modalOverlay.classList.remove('flex');
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

/* ==========================================================================
   5. PORTFOLIO CASE STUDY FILTERS
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('[data-portfolio-filter]');
  const cards = document.querySelectorAll('[data-portfolio-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-portfolio-filter');

      filterBtns.forEach((b) => {
        b.classList.remove('bg-solar-500', 'text-white', 'shadow-solar-glow');
        b.classList.add('text-slate-600', 'dark:text-slate-400');
      });
      btn.classList.add('bg-solar-500', 'text-white', 'shadow-solar-glow');
      btn.classList.remove('text-slate-600', 'dark:text-slate-400');

      cards.forEach((card) => {
        const cardCat = card.getAttribute('data-portfolio-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          card.classList.add('animate-fadeIn');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. TESTIMONIALS SLIDER CAROUSEL
   ========================================================================== */
function initTestimonialsSlider() {
  const prevBtn = document.getElementById('review-prev-btn');
  const nextBtn = document.getElementById('review-next-btn');

  const nameEl = document.getElementById('review-name');
  const roleEl = document.getElementById('review-role');
  const companyEl = document.getElementById('review-company');
  const commentEl = document.getElementById('review-comment');

  if (!prevBtn || !nextBtn) return;

  const reviews = [
    {
      name: 'SofZenix Management Team',
      role: 'IT Solutions & Enterprise Services',
      company: 'SofZenix IT Solutions',
      comment: 'Zenrise Digitech completely transformed our online identity. Their website redesign gave us a modern visual presence that our clients constantly praise, and our monthly lead inquiries jumped over 2.8x within the first 60 days of launch.'
    },
    {
      name: 'Marketing Director',
      role: 'Growth & Acquisition Lead',
      company: 'LT SuperCom',
      comment: 'Working with the Zenrise team on performance paid marketing was an absolute game changer. They optimized our ad campaigns with surgical precision, reducing our cost per acquisition while boosting our overall ad ROAS to 4.8x.'
    },
    {
      name: 'Founding Team',
      role: 'Product & Brand Strategy',
      company: 'SkilStation',
      comment: 'The SEO strategy implemented by Zenrise Digitech put our core transactional keywords right at the top of Google search results. Their transparent monthly reporting and proactive communication make them our most trusted growth partner.'
    }
  ];

  let currentIndex = 0;

  function renderReview() {
    const cur = reviews[currentIndex];
    if (nameEl) nameEl.textContent = cur.name;
    if (roleEl) roleEl.textContent = cur.role;
    if (companyEl) companyEl.textContent = cur.company;
    if (commentEl) commentEl.textContent = `"${cur.comment}"`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1;
    renderReview();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = currentIndex === reviews.length - 1 ? 0 : currentIndex + 1;
    renderReview();
  });
}

/* ==========================================================================
   8. FAQ ACCORDION TOGGLE
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-button');
    const content = item.querySelector('.faq-content');

    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      faqItems.forEach((other) => {
        const otherContent = other.querySelector('.faq-content');
        if (otherContent) otherContent.classList.add('hidden');
        other.classList.remove('border-solar-500', 'bg-solar-500/10');
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        item.classList.add('border-solar-500', 'bg-solar-500/10');
      }
    });
  });
}

/* ==========================================================================
   9. STRATEGY AUDIT CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('strategy-contact-form');
  const successBox = document.getElementById('form-success-box');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.innerHTML = `
        <span class="flex items-center justify-center gap-2">
          <span class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          Securing Blueprint...
        </span>
      `;
    }

    setTimeout(() => {
      form.classList.add('hidden');
      if (successBox) successBox.classList.remove('hidden');
    }, 1000);
  });
}

/* ==========================================================================
   10. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target); // Trigger once smoothly
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   11. MOBILE HAMBURGER MENU HANDLER
   ========================================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const dropdown = document.getElementById('mobile-menu-dropdown');

  if (btn && dropdown) {
    btn.addEventListener('click', () => {
      dropdown.classList.toggle('hidden');
    });
  }

  // Mobile Theme Toggle Button support
  const mobileThemeBtn = document.getElementById('theme-toggle-btn-mobile');
  const desktopThemeBtn = document.getElementById('theme-toggle-btn');
  if (mobileThemeBtn && desktopThemeBtn) {
    mobileThemeBtn.addEventListener('click', () => {
      desktopThemeBtn.click();
    });
  }
}
