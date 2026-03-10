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
  initQuiz();
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
  initHeroOwlHover();
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

/* ----- Hero Owl Hover (swap expression, pixel-accurate) ----- */
function initHeroOwlHover() {
  const owls = document.querySelectorAll('.hero-owl[data-hover-src]');
  if (!owls.length) return;

  const owlData = [];

  function buildAlphaMap(owl) {
    if (!owl.naturalWidth || !owl.naturalHeight) return null;
    try {
      const c = document.createElement('canvas');
      c.width = owl.naturalWidth;
      c.height = owl.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(owl, 0, 0);
      const imgData = ctx.getImageData(0, 0, c.width, c.height).data;
      return { data: imgData, w: c.width, h: c.height };
    } catch (e) {
      return null;
    }
  }

  owls.forEach(owl => {
    const defaultSrc = owl.dataset.defaultSrc;
    const hoverSrc = owl.dataset.hoverSrc;
    if (!defaultSrc || !hoverSrc) return;

    // Preload hover image
    const preload = new Image();
    preload.src = hoverSrc;

    const od = { el: owl, defaultSrc, hoverSrc, alphaMap: null, hovered: false };

    // Build alpha map now if image is already loaded, otherwise wait
    if (owl.complete && owl.naturalWidth) {
      od.alphaMap = buildAlphaMap(owl);
    } else {
      owl.addEventListener('load', () => {
        od.alphaMap = buildAlphaMap(owl);
      }, { once: true });
    }

    owlData.push(od);
  });

  function isOpaqueAt(od, clientX, clientY) {
    const rect = od.el.getBoundingClientRect();
    const rx = (clientX - rect.left) / rect.width;
    const ry = (clientY - rect.top) / rect.height;
    if (rx < 0 || rx > 1 || ry < 0 || ry > 1) return false;
    if (!od.alphaMap) {
      // Fallback: only react within a narrower central area (30% inset from each side)
      return rx > 0.30 && rx < 0.70 && ry > 0.15 && ry < 0.90;
    }
    const px = Math.floor(rx * od.alphaMap.w);
    const py = Math.floor(ry * od.alphaMap.h);
    const idx = (py * od.alphaMap.w + px) * 4 + 3;
    return od.alphaMap.data[idx] > 30;
  }

  // Disable default pointer-events, we handle it manually
  owls.forEach(owl => { owl.style.pointerEvents = 'none'; });

  const heroScene = document.getElementById('heroScene');
  if (!heroScene) return;

  heroScene.addEventListener('mousemove', (e) => {
    let handled = false;
    for (let i = owlData.length - 1; i >= 0; i--) {
      const od = owlData[i];
      if (!handled && isOpaqueAt(od, e.clientX, e.clientY)) {
        if (!od.hovered) {
          od.el.src = od.hoverSrc;
          od.hovered = true;
        }
        handled = true;
      } else if (od.hovered) {
        od.el.src = od.defaultSrc;
        od.hovered = false;
      }
    }
    heroScene.style.cursor = handled ? 'pointer' : '';
  });

  heroScene.addEventListener('mouseleave', () => {
    owlData.forEach(od => {
      if (od.hovered) {
        od.el.src = od.defaultSrc;
        od.hovered = false;
      }
    });
    heroScene.style.cursor = '';
  });
}

/* ----- Parallax ----- */
function initParallax(isMobile) {
  if (isMobile) return;

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
   Akinator-style Quiz
   ======================================== */
function initQuiz() {
  const APPS = {
    sprite:    { name: 'Owlia-Sprite',    role: 'デスクトップ常駐ランチャー', badge: 'available', icon: 'docs/character/transparent/ChatGPT Image 2026年3月6日 14_24_07.webp', link: 'go.html?app=sprite&url=https://owlia-sprite.dairab.local', linkLabel: 'ダウンロード' },
    portal:    { name: 'Owlia-Portal',    role: 'AIチャット・RAG',          badge: 'available', icon: 'docs/character/transparent/ChatGPT Image 2026年3月6日 14_24_06.webp', link: 'go.html?app=portal&url=https://owlia.dairab.local/portal', linkLabel: 'ログイン' },
    grimoire:  { name: 'Owlia-Grimoire',  role: '開発者向けAPI',            badge: 'available', icon: 'docs/character/transparent/ChatGPT Image 2026年3月9日 22_11_21.webp', link: 'go.html?app=grimoire&url=#', linkLabel: 'ドキュメント' },
    cobol:     { name: 'Owlia-COBOL',     role: 'COBOL開発AI支援',          badge: 'coming',    icon: 'docs/character/transparent/ChatGPT Image 2026年3月6日 14_24_04.webp', link: null, linkLabel: '準備中' },
    chronicle: { name: 'Owlia-Chronicle', role: 'タスク管理・議事録',       badge: 'coming',    icon: 'docs/character/transparent/ChatGPT Image 2026年3月6日 14_25_03.webp', link: null, linkLabel: '準備中' },
    plugins:   { name: 'Owlia-Plugins',   role: '開発環境AI統合',           badge: 'coming',    icon: 'docs/character/transparent/ChatGPT Image 2026年3月6日 14_24_02.webp', link: null, linkLabel: '準備中' },
  };

  var TOTAL_STEPS = 5;

  var QUESTIONS = {
    // --- Q1: 職種 ---
    q1: {
      text: 'まず教えて！あなたのお仕事は？',
      answers: [
        { label: 'A', text: '開発・エンジニア系',   scores: { grimoire: 2, plugins: 2, sprite: 1, portal: 1 }, next: 'q2_dev' },
        { label: 'B', text: '事務・管理系',         scores: { portal: 2, sprite: 2, chronicle: 2 }, next: 'q2_admin' },
        { label: 'C', text: 'マネジメント・企画系',  scores: { portal: 2, chronicle: 2, sprite: 1 }, next: 'q2_mgmt' },
      ],
    },
    // --- Q2: 課題 ---
    q2_dev: {
      text: '開発で一番困っていることは？',
      answers: [
        { label: 'A', text: 'コードを書くのに時間がかかる',   scores: { plugins: 2, sprite: 1 }, next: 'q3_coding' },
        { label: 'B', text: '既存システムの保守が大変',       scores: { plugins: 1, portal: 1 }, next: 'q3_legacy' },
        { label: 'C', text: 'AIを自分のアプリに組み込みたい', scores: { grimoire: 3, portal: 1 }, next: 'q3_api' },
      ],
    },
    q2_admin: {
      text: '日々の業務で面倒に感じることは？',
      answers: [
        { label: 'A', text: '資料探し・情報の整理',       scores: { portal: 3, sprite: 1 }, next: 'q3_search' },
        { label: 'B', text: '議事録やタスクの管理',       scores: { chronicle: 3, sprite: 1 }, next: 'q3_task' },
        { label: 'C', text: '同じような文章を何度も書く', scores: { sprite: 2, portal: 2 }, next: 'q3_write' },
      ],
    },
    q2_mgmt: {
      text: 'チーム運営で課題に感じることは？',
      answers: [
        { label: 'A', text: '情報共有がうまくいかない',   scores: { portal: 3, sprite: 1 }, next: 'q3_share' },
        { label: 'B', text: '会議が多くて時間が足りない', scores: { chronicle: 3, portal: 1 }, next: 'q3_meeting' },
        { label: 'C', text: 'メンバーの生産性を上げたい', scores: { sprite: 2, portal: 1, chronicle: 1, plugins: 1 }, next: 'q3_prod' },
      ],
    },
    // --- Q3: 深掘り（9パターン） ---
    q3_coding: {
      text: 'どんな言語・環境で開発している？',
      answers: [
        { label: 'A', text: 'COBOL・レガシー系',       scores: { cobol: 6, plugins: 1 }, next: 'q4_dev' },
        { label: 'B', text: 'VSCode等のモダン環境',     scores: { plugins: 3, grimoire: 1 }, next: 'q4_dev' },
        { label: 'C', text: 'いろいろ（特定なし）',     scores: { sprite: 2, plugins: 1, grimoire: 1 }, next: 'q4_dev' },
      ],
    },
    q3_legacy: {
      text: 'レガシーシステムの課題は？',
      answers: [
        { label: 'A', text: 'COBOLの読解・改修が大変',   scores: { cobol: 6, grimoire: 1 }, next: 'q4_dev' },
        { label: 'B', text: 'ドキュメントが不足している', scores: { portal: 3, sprite: 1 }, next: 'q4_dev' },
        { label: 'C', text: 'テスト・品質管理が不十分',   scores: { plugins: 3, grimoire: 1 }, next: 'q4_dev' },
      ],
    },
    q3_api: {
      text: 'APIで実現したいことは？',
      answers: [
        { label: 'A', text: '社内チャットボットを作りたい',     scores: { grimoire: 3, portal: 2 }, next: 'q4_dev' },
        { label: 'B', text: '業務アプリにAI機能を追加したい',   scores: { grimoire: 4, plugins: 1 }, next: 'q4_dev' },
        { label: 'C', text: 'データ分析を自動化したい',         scores: { grimoire: 3, portal: 1, sprite: 1 }, next: 'q4_dev' },
      ],
    },
    q3_search: {
      text: 'どんな資料を扱うことが多い？',
      answers: [
        { label: 'A', text: '社内マニュアル・規定類', scores: { portal: 3, sprite: 1 }, next: 'q4_general' },
        { label: 'B', text: '顧客・案件の情報',     scores: { portal: 3, chronicle: 1 }, next: 'q4_general' },
        { label: 'C', text: '報告書・レポート類',    scores: { portal: 2, sprite: 2 }, next: 'q4_general' },
      ],
    },
    q3_task: {
      text: 'タスク管理で困っていることは？',
      answers: [
        { label: 'A', text: '議事録作成に時間がかかる', scores: { chronicle: 4, portal: 1 }, next: 'q4_general' },
        { label: 'B', text: 'タスクの抜け漏れが起きる', scores: { chronicle: 3, sprite: 1 }, next: 'q4_general' },
        { label: 'C', text: '進捗の共有が面倒',        scores: { chronicle: 3, portal: 1 }, next: 'q4_general' },
      ],
    },
    q3_write: {
      text: 'どんな文章を書くことが多い？',
      answers: [
        { label: 'A', text: 'メール・社内連絡', scores: { sprite: 3, portal: 1 }, next: 'q4_general' },
        { label: 'B', text: '提案書・企画書',   scores: { portal: 3, sprite: 1 }, next: 'q4_general' },
        { label: 'C', text: '報告書・日報',     scores: { sprite: 2, portal: 2 }, next: 'q4_general' },
      ],
    },
    q3_share: {
      text: '情報共有の課題は？',
      answers: [
        { label: 'A', text: 'ナレッジが属人化している', scores: { portal: 4, sprite: 1 }, next: 'q4_mgmt' },
        { label: 'B', text: '資料が散在して見つからない', scores: { portal: 3, sprite: 2 }, next: 'q4_mgmt' },
        { label: 'C', text: '部門間の連携が弱い',       scores: { portal: 2, chronicle: 2, sprite: 1 }, next: 'q4_mgmt' },
      ],
    },
    q3_meeting: {
      text: '会議の課題は？',
      answers: [
        { label: 'A', text: '議事録を書く余裕がない',       scores: { chronicle: 4, sprite: 1 }, next: 'q4_mgmt' },
        { label: 'B', text: '決定事項のフォローが漏れる',   scores: { chronicle: 3, portal: 1 }, next: 'q4_mgmt' },
        { label: 'C', text: '会議の事前準備に時間がかかる', scores: { portal: 2, sprite: 2, chronicle: 1 }, next: 'q4_mgmt' },
      ],
    },
    q3_prod: {
      text: '生産性向上で重視することは？',
      answers: [
        { label: 'A', text: '定型作業の自動化',               scores: { sprite: 3, chronicle: 1 }, next: 'q4_mgmt' },
        { label: 'B', text: '意思決定のスピードアップ',       scores: { portal: 3, chronicle: 1 }, next: 'q4_mgmt' },
        { label: 'C', text: 'ツール導入のハードルを下げたい', scores: { sprite: 3, portal: 1 }, next: 'q4_mgmt' },
      ],
    },
    // --- Q4: ツールへの期待（3パターン） ---
    q4_dev: {
      text: 'AIツールに求めることは？',
      answers: [
        { label: 'A', text: 'とにかく手軽に使いたい',         scores: { sprite: 3, portal: 1 }, next: 'q5' },
        { label: 'B', text: 'カスタマイズ性・自由度が欲しい', scores: { grimoire: 3, plugins: 1 }, next: 'q5' },
        { label: 'C', text: '社内データと連携したい',         scores: { portal: 3, grimoire: 1 }, next: 'q5' },
      ],
    },
    q4_general: {
      text: 'AIツールに求めることは？',
      answers: [
        { label: 'A', text: '簡単に始められること',       scores: { sprite: 3, portal: 1 }, next: 'q5' },
        { label: 'B', text: '社内の情報を学習させたい',   scores: { portal: 4 }, next: 'q5' },
        { label: 'C', text: 'チームで共有できること',     scores: { portal: 2, chronicle: 2 }, next: 'q5' },
      ],
    },
    q4_mgmt: {
      text: '導入で重視するポイントは？',
      answers: [
        { label: 'A', text: '誰でもすぐ使える簡単さ',   scores: { sprite: 3, portal: 1 }, next: 'q5' },
        { label: 'B', text: '社内データの活用',         scores: { portal: 4, grimoire: 1 }, next: 'q5' },
        { label: 'C', text: '段階的に導入できること',   scores: { sprite: 2, portal: 2 }, next: 'q5' },
      ],
    },
    // --- Q5: 経験レベル（共通・最終） ---
    q5: {
      text: 'AIの経験レベルは？',
      answers: [
        { label: 'A', text: '初めて・あまり使ったことがない', scores: { sprite: 3, portal: 1 }, next: null },
        { label: 'B', text: 'たまに使っている',              scores: { portal: 2, sprite: 1 }, next: null },
        { label: 'C', text: 'バリバリ使っている！',          scores: { grimoire: 2, plugins: 2 }, next: null },
      ],
    },
  };

  const stageEl = document.getElementById('quizStage');
  const resultsEl = document.getElementById('quizResults');
  const questionEl = document.getElementById('quizQuestion');
  const answersEl = document.getElementById('quizAnswers');
  const progressBar = document.getElementById('quizProgressBar');
  const resultCardsEl = document.getElementById('quizResultCards');
  const resultTextEl = document.getElementById('quizResultText');
  const restartBtn = document.getElementById('quizRestart');

  if (!stageEl || !resultsEl) return;

  let scores = {};
  let stepNum = 1;

  function resetScores() {
    scores = {};
    Object.keys(APPS).forEach(function(k) { scores[k] = 0; });
  }

  function addScores(s) {
    Object.keys(s).forEach(function(k) { scores[k] = (scores[k] || 0) + s[k]; });
  }

  function getTopApps(count) {
    return Object.keys(scores)
      .map(function(k) { return { key: k, score: scores[k] }; })
      .sort(function(a, b) { return b.score - a.score; })
      .slice(0, count)
      .map(function(entry) { return Object.assign({ key: entry.key }, APPS[entry.key]); });
  }

  function renderQuestion(qKey) {
    var q = QUESTIONS[qKey];
    if (!q) return;

    progressBar.style.width = (stepNum / TOTAL_STEPS * 100) + '%';

    var bubbleInner = document.querySelector('#quizBubble .quiz-bubble-inner');
    bubbleInner.classList.add('fade-out');

    setTimeout(function() {
      questionEl.textContent = q.text;
      bubbleInner.classList.remove('fade-out');
      bubbleInner.classList.add('fade-in');
      setTimeout(function() { bubbleInner.classList.remove('fade-in'); }, 350);
    }, 250);

    answersEl.innerHTML = '';
    q.answers.forEach(function(ans, i) {
      var btn = document.createElement('button');
      btn.className = 'quiz-answer-btn';
      btn.innerHTML = '<span class="quiz-answer-label">' + ans.label + '</span><span>' + ans.text + '</span>';
      btn.style.animationDelay = (0.3 + i * 0.1) + 's';
      btn.addEventListener('click', function() { handleAnswer(ans); });
      answersEl.appendChild(btn);
    });
  }

  function handleAnswer(answer) {
    addScores(answer.scores);
    if (answer.next === null) {
      showResults();
    } else {
      stepNum++;
      renderQuestion(answer.next);
    }
  }

  function showResults() {
    stageEl.style.display = 'none';
    resultsEl.style.display = '';
    resultsEl.classList.add('v');

    var topApps = getTopApps(3);
    resultTextEl.textContent = 'ホホウ！あなたには ' + topApps[0].name + ' がピッタリ！';

    resultCardsEl.innerHTML = '';
    topApps.forEach(function(app, i) {
      var card = document.createElement('div');
      card.className = 'quiz-result-card';

      var badgeHtml = app.badge === 'available'
        ? '<span class="badge badge-ok">&#x2705; 利用可能</span>'
        : '<span class="badge badge-soon">&#x23F3; Coming Soon</span>';

      var ctaHtml = app.link
        ? '<a href="' + app.link + '" class="btn btn-teal btn-sm">' + app.linkLabel + '</a>'
        : '<button class="btn btn-disabled btn-sm">' + app.linkLabel + '</button>';

      card.innerHTML =
        '<div class="quiz-result-rank">' + (i + 1) + '</div>' +
        '<div class="quiz-result-icon"><img src="' + app.icon + '" alt="' + app.name + '" loading="lazy"></div>' +
        '<div class="quiz-result-info">' +
          '<div class="quiz-result-name">' + app.name + '</div>' +
          '<div class="quiz-result-role">' + app.role + '</div>' +
          badgeHtml +
        '</div>' +
        '<div class="quiz-result-action">' + ctaHtml + '</div>';

      resultCardsEl.appendChild(card);
    });
  }

  restartBtn.addEventListener('click', function() {
    resetScores();
    stepNum = 1;
    resultsEl.style.display = 'none';
    stageEl.style.display = '';
    renderQuestion('q1');
  });

  resetScores();
  renderQuestion('q1');
}

/* ========================================
   Chatbot Widget (Vanilla JS)
   Ported from owlia-chatbot.jsx
   ======================================== */
function initChatbot() {
  // --- Config ---
  const PROXY_URL = '/api/chat';
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
          <div class="cb-avatar"><img src="docs/object/ChatGPT Image 2026年3月10日 00_00_29.webp" alt="オウくん" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>
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
        <div class="cb-avatar"><img src="docs/object/ChatGPT Image 2026年3月10日 00_00_29.webp" alt="オウくん" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>
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
