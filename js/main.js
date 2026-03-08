/* ===================================
   Owlia Landing Page - Main JavaScript
   GSAP Animations + Chatbot Widget
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFadeIn();
  initAppFilter();
  initDetailTabs();
  initScrollToTop();
  initSmoothScroll();
  initGSAP();
  initChatbot();
});

/* ----- Menu overlay ----- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('menuClose');
  if (!hamburger || !mobileMenu) return;

  const openMenu = () => mobileMenu.classList.add('open');
  const closeMenu = () => mobileMenu.classList.remove('open');

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ----- Scroll-triggered fade-in ----- */
function initFadeIn() {
  const elements = document.querySelectorAll('.fi');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('v');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
}

/* ----- App filter tabs ----- */
function initAppFilter() {
  const filterBtns = document.querySelectorAll('.apps-filter');
  const cards = document.querySelectorAll('.app-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const categories = card.dataset.cat || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ----- Detail section tabs ----- */
function initDetailTabs() {
  const tabs = document.querySelectorAll('.detail-tab');
  const panels = document.querySelectorAll('.detail-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById('p-' + tab.dataset.tab);
      if (panel) {
        panel.classList.add('active');
      }
    });
  });
}

/* ----- Scroll to top button ----- */
function initScrollToTop() {
  const btn = document.getElementById('toTop');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('show', window.scrollY > 500);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ----- Smooth scroll for anchor links ----- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ========================================
   GSAP Animation System
   ======================================== */
function initGSAP() {
  if (typeof gsap === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  gsap.registerPlugin(ScrollTrigger);

  const isMobile = window.innerWidth < 768;

  initHeroAnimations(isMobile);
  initParallax(isMobile);
  initTextAnimations();
  initCardHoverEffects();
  initMarquee();
}

/* ----- Hero Animations ----- */
function initHeroAnimations(isMobile) {
  // Split "Owlia" title into chars
  const titleEl = document.getElementById('heroTitleMain');
  if (titleEl) {
    const text = titleEl.textContent;
    titleEl.innerHTML = '';
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.className = 'hero-char';
      span.textContent = ch;
      titleEl.appendChild(span);
    });

    gsap.from('.hero-char', {
      opacity: 0,
      y: 40,
      duration: 0.6,
      stagger: 0.08,
      ease: 'back.out(1.7)',
      delay: 0.3,
    });
  }

  // Hero subtitle and catch
  gsap.from('.hero-title-sub', { opacity: 0, y: 20, duration: 0.6, delay: 0.1 });
  gsap.from('.hero-title-catch', { opacity: 0, y: 20, duration: 0.6, delay: 0.9 });
  gsap.from('.hero-scroll-hint', { opacity: 0, duration: 0.8, delay: 1.2 });

  // Campfire entrance
  gsap.from('.hero-campfire', {
    opacity: 0,
    scale: 0.8,
    duration: 0.8,
    ease: 'power2.out',
    delay: 0.5,
  });

  // Campfire subtle pulse
  gsap.to('.hero-campfire-img', {
    scale: 1.02,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Owl entrance
  gsap.from('.hero-owl', {
    opacity: 0,
    scale: 0.5,
    duration: 0.5,
    stagger: 0.1,
    ease: 'back.out(1.4)',
    delay: 0.8,
  });

  // Per-owl floating
  const owlConfigs = [
    { y: -8, rotation: 3, duration: 3.2 },
    { y: -10, rotation: -2, duration: 3.6 },
    { y: -6, rotation: 2, duration: 2.8 },
    { y: -9, rotation: -3, duration: 3.4 },
    { y: -7, rotation: 2.5, duration: 3.0 },
    { y: -11, rotation: -2, duration: 3.8 },
    { y: -8, rotation: 3, duration: 3.3 },
  ];

  document.querySelectorAll('.hero-owl').forEach((owl, i) => {
    const cfg = owlConfigs[i] || owlConfigs[0];
    gsap.to(owl, {
      y: cfg.y,
      rotation: cfg.rotation,
      duration: cfg.duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.3 + i * 0.15,
    });
  });
}

/* ----- Parallax ----- */
function initParallax(isMobile) {
  if (isMobile) return;

  // Hero scene parallax
  const heroScene = document.getElementById('heroScene');
  if (heroScene) {
    gsap.to(heroScene, {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Hero title opposite direction
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.to(heroTitle, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Section containers subtle parallax
  document.querySelectorAll('.comp, .apps, .steps, .roles, .detail').forEach(sec => {
    gsap.from(sec.querySelector('.container'), {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: sec,
        start: 'top bottom',
        end: 'top 30%',
        scrub: true,
      },
    });
  });
}

/* ----- Text Animations ----- */
function initTextAnimations() {
  // Split section titles into chars
  document.querySelectorAll('.section-title').forEach(title => {
    // Skip if already inside hero (handled by hero animation)
    if (title.closest('.hero')) return;

    const text = title.textContent;
    title.innerHTML = '';
    text.split('').forEach(ch => {
      const span = document.createElement('span');
      span.className = 'st-char';
      span.textContent = ch === ' ' ? '\u00a0' : ch;
      title.appendChild(span);
    });

    gsap.from(title.querySelectorAll('.st-char'), {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.03,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // Section labels slide in
  document.querySelectorAll('.section-label').forEach(label => {
    if (label.closest('.hero')) return;

    gsap.from(label, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: label,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

/* ----- Card Hover 3D Tilt ----- */
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.app-card, .role-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
    });
  });
}

/* ----- Marquee GSAP ----- */
function initMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;

  // Stop CSS animation, use GSAP
  track.style.animation = 'none';

  const trackWidth = track.scrollWidth / 2;

  gsap.to(track, {
    x: -trackWidth,
    duration: 30,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % trackWidth),
    },
  });
}

/* ========================================
   Chatbot Widget (Vanilla JS)
   Ported from owlia-chatbot.jsx
   ======================================== */
function initChatbot() {
  // --- Config ---
  const PROXY_URL = 'https://your-proxy.example.com/v1/messages';
  const SYSTEM_PROMPT = `あなたは「Owlia（オウリア）」という社内生成AIプラットフォームの案内フクロウ「オウくん」です。
ユーザーがAIで実現したいことを聞いて、Owliaの適切なアプリを紹介してください。

## Owliaとは
NIT社内専用の生成AIスイートです。社内ドキュメントを学習（RAG）し、Copilot等では返せない"NIT特有の答え"を提供します。

## アプリ一覧
- **Owlia-Sprite**（利用可能）: デスクトップ常駐ランチャー。Ctrl+Oで即起動。音声入力・テキスト選択・タスク登録・簡易チャット対応。exeをDLするだけ。
- **Owlia-Portal**（利用可能）: メインチャット基地。社内ドキュメントのRAG設定・チャット跨ぎの記憶・ファイルサーバー一括学習。ID=氏名コード、初回PW=12345678。
- **Owlia-COBOL**（Coming Soon）: VSCode風画面でCOBOL開発。日本語指示でコーディング・AI校正。
- **Owlia-Grimoire**（利用可能）: 開発者向けAPIプラットフォーム。Owlia APIをアプリ開発に組み込み可能。
- **Owlia-Chronicle**（Coming Soon）: AIタスク管理・議事録自動要約・スケジュール管理。
- **Owlia-Plugins**（Coming Soon）: VSCode等の開発環境にAIを統合。

## 回答スタイル
- 親しみやすいです・ます体で話す
- 「ホホウ！」「なるほど〜」などフクロウらしい相槌を自然に使う
- ユーザーのやりたいことに対して最適なOwliaアプリを1〜2個紹介する
- Coming Soonアプリはその旨を伝える
- 回答は短め（3〜5文）でテンポよく
- 最後に「他に気になることはありますか？」と聞く
- Owliaで対応できないことには「現時点ではOwliaの対応範囲外ですが、貴重なご意見として記録しておきます！」と答える
- マークダウンの**太字**は使ってOK、箇条書きも適度に使う`;

  const QUICK_CHIPS = [
    '社内資料をAIに覚えさせたい',
    'どこからでもAIをすぐ使いたい',
    'COBOL開発を楽にしたい',
    '議事録を自動でまとめたい',
    'Copilotと何が違うの？',
    'アプリにAIを組み込みたい',
  ];

  // --- Helpers ---
  const uid = () => Math.random().toString(36).slice(2, 9);
  const nowLabel = () => new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatMarkdown(text) {
    return escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function formatBotMessage(text) {
    const lines = text.split('\n');
    let html = '';
    for (const line of lines) {
      if (line.startsWith('- ') || line.startsWith('\u2022 ')) {
        const content = line.slice(2);
        html += '<div style="display:flex;gap:6px;align-items:flex-start;"><span style="color:var(--teal);font-weight:700;margin-top:1px;">\u2022</span><span>' + escapeHtml(content).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</span></div>';
      } else if (line.trim() === '') {
        html += '<div style="height:4px;"></div>';
      } else {
        html += '<p style="margin:0;line-height:1.7;">' + escapeHtml(line).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') + '</p>';
      }
    }
    return html;
  }

  // --- DOM refs ---
  const fab = document.getElementById('chatbotFab');
  const panel = document.getElementById('chatbotPanel');
  const closeBtn = document.getElementById('chatbotClose');
  const messagesEl = document.getElementById('chatbotMessages');
  const chipsEl = document.getElementById('chatbotChips');
  const inputEl = document.getElementById('chatbotInput');
  const sendBtn = document.getElementById('chatbotSend');

  if (!fab || !panel) return;

  // --- State ---
  let messages = [{
    role: 'assistant',
    id: uid(),
    content: 'ホホウ！こんにちは わたしはOwliaのご案内フクロウです。\n\n**「AIを使って何を実現させたい？」**\n\n業務で困っていること・やりたいことを自由に入力してください。あなたに合ったOwliaアプリをご紹介します！',
  }];
  let loading = false;

  // --- localStorage helpers for requests ---
  function getRequests() {
    try {
      const data = localStorage.getItem('owlia_requests');
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  function saveRequests(reqs) {
    try {
      localStorage.setItem('owlia_requests', JSON.stringify(reqs));
    } catch {}
  }

  function addRequest(msg) {
    const reqs = getRequests();
    const rec = { id: uid(), message: msg, ts: Date.now(), label: nowLabel() };
    reqs.unshift(rec);
    if (reqs.length > 200) reqs.length = 200;
    saveRequests(reqs);
    return rec;
  }

  // --- Render ---
  function renderMessages() {
    let html = '';
    for (const m of messages) {
      if (m.role === 'assistant') {
        html += `<div class="cb-msg-row cb-msg-bot">
          <div class="cb-avatar">&#x1F989;</div>
          <div class="cb-bubble cb-bubble-bot">${formatBotMessage(m.content)}</div>
        </div>`;
      } else {
        html += `<div class="cb-msg-row cb-msg-user">
          <div class="cb-bubble cb-bubble-user">${escapeHtml(m.content)}</div>
        </div>`;
      }
    }
    if (loading) {
      html += `<div class="cb-msg-row cb-msg-bot">
        <div class="cb-avatar">&#x1F989;</div>
        <div class="cb-bubble cb-bubble-bot cb-typing">
          <span class="cb-dot"></span><span class="cb-dot"></span><span class="cb-dot"></span>
        </div>
      </div>`;
    }
    messagesEl.innerHTML = html;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderChips() {
    let html = '';
    for (const chip of QUICK_CHIPS) {
      html += `<button class="cb-chip" ${loading ? 'disabled' : ''}>${escapeHtml(chip)}</button>`;
    }
    chipsEl.innerHTML = html;

    chipsEl.querySelectorAll('.cb-chip').forEach((btn, i) => {
      btn.addEventListener('click', () => send(QUICK_CHIPS[i]));
    });
  }

  function updateSendBtn() {
    const hasText = inputEl.value.trim().length > 0;
    sendBtn.disabled = !hasText || loading;
  }

  // --- API call ---
  async function send(text) {
    const txt = (text || inputEl.value).trim();
    if (!txt || loading) return;
    inputEl.value = '';
    updateSendBtn();

    const userMsg = { role: 'user', id: uid(), content: txt };
    messages.push(userMsg);
    loading = true;
    renderMessages();
    renderChips();

    addRequest(txt);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || '申し訳ありません、回答できませんでした。';
      messages.push({ role: 'assistant', id: uid(), content: reply });
    } catch {
      messages.push({ role: 'assistant', id: uid(), content: 'ごめんなさい エラーが発生しました。少し待ってから再度お試しください。' });
    } finally {
      loading = false;
      renderMessages();
      renderChips();
    }
  }

  // --- Event listeners ---
  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      renderMessages();
      renderChips();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => panel.classList.remove('open'));
  }

  inputEl.addEventListener('input', updateSendBtn);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  sendBtn.addEventListener('click', () => send());

  // Initial render
  renderChips();
}
