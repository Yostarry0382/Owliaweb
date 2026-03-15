/* ===================================
   Admin Content Editor
   Loaded only by admin.html
   =================================== */
(function () {
  'use strict';

  /* ---------- helpers ---------- */
  function esc(s) {
    if (!s) return '';
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  /* ---------- Toast ---------- */
  function showToast(msg, type) {
    var t = el('div', 'cms-toast cms-toast-' + (type || 'ok'));
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2200);
  }

  /* ========== Init (called from admin.html after login) ========== */
  window.initContentEditor = function () {
    var panel = document.getElementById('panelContent');
    if (!panel) return;

    OwliaContent.init();

    panel.innerHTML = '';

    /* Sub-tabs: Apps / Site */
    var subTabs = el('div', 'cms-sub-tabs');
    var btnApps = el('button', 'cms-sub-tab active', '\uD83D\uDCE6 \u30A2\u30D7\u30EA\u7BA1\u7406');
    var btnSite = el('button', 'cms-sub-tab', '\u270F\uFE0F \u30B5\u30A4\u30C8\u6587\u8A00');
    btnApps.dataset.sub = 'apps';
    btnSite.dataset.sub = 'site';
    subTabs.appendChild(btnApps);
    subTabs.appendChild(btnSite);
    panel.appendChild(subTabs);

    var subPanelApps = el('div', 'cms-sub-panel show');
    subPanelApps.id = 'cmsApps';
    var subPanelSite = el('div', 'cms-sub-panel');
    subPanelSite.id = 'cmsSite';
    panel.appendChild(subPanelApps);
    panel.appendChild(subPanelSite);

    var subs = { apps: subPanelApps, site: subPanelSite };
    subTabs.addEventListener('click', function (e) {
      var btn = e.target.closest('.cms-sub-tab');
      if (!btn) return;
      subTabs.querySelectorAll('.cms-sub-tab').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      Object.values(subs).forEach(function (p) { p.classList.remove('show'); });
      subs[btn.dataset.sub].classList.add('show');
    });

    buildAppsEditor(subPanelApps);
    buildSiteEditor(subPanelSite);
  };

  /* ========== Apps Editor ========== */
  function buildAppsEditor(container) {
    container.innerHTML = '';

    /* toolbar */
    var toolbar = el('div', 'cms-toolbar');
    var addBtn = el('button', 'cms-btn cms-btn-add', '+ \u30A2\u30D7\u30EA\u8FFD\u52A0');
    toolbar.appendChild(addBtn);

    var saveBtn = el('button', 'cms-btn cms-btn-save', '\uD83D\uDCBE \u4FDD\u5B58');
    toolbar.appendChild(saveBtn);

    var previewBtn = el('button', 'cms-btn cms-btn-preview', '\uD83D\uDC41 \u30D7\u30EC\u30D3\u30E5\u30FC');
    toolbar.appendChild(previewBtn);

    var resetBtn = el('button', 'cms-btn cms-btn-reset', '\u21A9 \u30C7\u30D5\u30A9\u30EB\u30C8\u306B\u623B\u3059');
    toolbar.appendChild(resetBtn);

    var exportBtn = el('button', 'cms-btn cms-btn-export', '\u2B07 JSON\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8');
    toolbar.appendChild(exportBtn);

    container.appendChild(toolbar);

    if (OwliaContent.hasOverride('apps')) {
      var notice = el('div', 'cms-notice', '\u26A0\uFE0F \u30ED\u30FC\u30AB\u30EB\u30B9\u30C8\u30EC\u30FC\u30B8\u306E\u30AA\u30FC\u30D0\u30FC\u30E9\u30A4\u30C9\u304C\u9069\u7528\u3055\u308C\u3066\u3044\u307E\u3059');
      container.appendChild(notice);
    }

    /* app list */
    var list = el('div', 'cms-app-list');
    list.id = 'cmsAppList';
    container.appendChild(list);

    renderAppList(list);

    /* Events */
    addBtn.addEventListener('click', function () {
      var apps = getCurrentApps();
      var newId = 'app_' + Date.now();
      apps.push({
        id: newId, name: 'New App', role: '', description: '',
        categories: ['coming'], badge: 'coming', badgeLabel: '\u23F3 Coming Soon',
        icon: '', tags: [], ctaLabel: '\u6E96\u5099\u4E2D', ctaLink: null,
        detail: { emoji: '', eyecatch: '', fullRole: '', fullDescription: '', features: [], hint: null, detailCtaLabel: null }
      });
      OwliaContent.apps = apps;
      renderAppList(list);
    });

    saveBtn.addEventListener('click', function () {
      collectAppForms();
      OwliaContent.save('apps', OwliaContent.apps);
      showToast('\u30A2\u30D7\u30EA\u30C7\u30FC\u30BF\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F');
      /* rebuild to reflect override notice */
      buildAppsEditor(container);
    });

    previewBtn.addEventListener('click', function () {
      collectAppForms();
      OwliaContent.save('apps', OwliaContent.apps);
      window.open('index.html', '_blank');
    });

    resetBtn.addEventListener('click', function () {
      if (!confirm('\u30C7\u30D5\u30A9\u30EB\u30C8\u30C7\u30FC\u30BF\u306B\u623B\u3057\u307E\u3059\u304B\uFF1F')) return;
      OwliaContent.reset('apps');
      OwliaContent.apps = window.__OWLIA_APPS || [];
      buildAppsEditor(container);
      showToast('\u30C7\u30D5\u30A9\u30EB\u30C8\u306B\u623B\u3057\u307E\u3057\u305F');
    });

    exportBtn.addEventListener('click', function () {
      collectAppForms();
      downloadJSON('apps.json', OwliaContent.apps);
    });
  }

  function getCurrentApps() {
    return OwliaContent.apps || [];
  }

  function renderAppList(container) {
    container.innerHTML = '';
    var apps = getCurrentApps();
    for (var i = 0; i < apps.length; i++) {
      container.appendChild(buildAppCard(apps[i], i));
    }
  }

  function buildAppCard(app, idx) {
    var card = el('div', 'cms-app-card');
    card.dataset.idx = idx;

    /* Header (collapsible) */
    var header = el('div', 'cms-app-header');
    var title = el('span', 'cms-app-header-title', esc(app.name || 'New App'));
    var badge = el('span', 'cms-app-badge ' + (app.badge === 'coming' ? 'badge-soon' : 'badge-ok'), esc(app.badgeLabel || ''));
    var toggle = el('button', 'cms-app-toggle', '\u25BC');
    var delBtn = el('button', 'cms-app-del', '\u2715');
    header.appendChild(title);
    header.appendChild(badge);
    header.appendChild(toggle);
    header.appendChild(delBtn);
    card.appendChild(header);

    /* Body (fields) */
    var body = el('div', 'cms-app-body');
    body.style.display = 'none';

    body.appendChild(field('ID', 'text', app.id, 'cms-f-id'));
    body.appendChild(field('\u30A2\u30D7\u30EA\u540D', 'text', app.name, 'cms-f-name'));
    body.appendChild(field('\u5F79\u5272', 'text', app.role, 'cms-f-role'));
    body.appendChild(field('\u8AAC\u660E', 'textarea', app.description, 'cms-f-description'));
    body.appendChild(fieldSelect('\u30D0\u30C3\u30B8', app.badge, 'cms-f-badge', [
      { v: 'available', l: '\u2705 \u5229\u7528\u53EF\u80FD' },
      { v: 'coming', l: '\u23F3 Coming Soon' }
    ]));
    body.appendChild(field('\u30A2\u30A4\u30B3\u30F3\u753B\u50CF\u30D1\u30B9', 'text', app.icon, 'cms-f-icon'));
    body.appendChild(fieldCheckboxes('\u30AB\u30C6\u30B4\u30EA', app.categories || [], 'cms-f-categories', [
      { v: 'available', l: '\u5229\u7528\u53EF\u80FD' },
      { v: 'dev', l: '\u958B\u767A\u5411\u3051' },
      { v: 'general', l: '\u5168\u8077\u7A2E\u5411\u3051' },
      { v: 'coming', l: 'Coming Soon' }
    ]));
    body.appendChild(field('\u30BF\u30B0\uFF08\u30AB\u30F3\u30DE\u533A\u5207\u308A\uFF09', 'text', (app.tags || []).join(', '), 'cms-f-tags'));
    body.appendChild(field('CTA\u30E9\u30D9\u30EB', 'text', app.ctaLabel, 'cms-f-ctaLabel'));
    body.appendChild(field('CTA\u30EA\u30F3\u30AF', 'text', app.ctaLink || '', 'cms-f-ctaLink'));

    /* Detail sub-section */
    var detailHeader = el('h4', 'cms-detail-header', '\u8A73\u7D30\u30DA\u30FC\u30B8');
    body.appendChild(detailHeader);

    var d = app.detail || {};
    body.appendChild(field('\u7D75\u6587\u5B57', 'text', d.emoji || '', 'cms-f-emoji'));
    body.appendChild(field('\u30A2\u30A4\u30AD\u30E3\u30C3\u30C1\u753B\u50CF', 'text', d.eyecatch || '', 'cms-f-eyecatch'));
    body.appendChild(field('\u5F79\u5272\uFF08\u8A73\u7D30\uFF09', 'text', d.fullRole || '', 'cms-f-fullRole'));
    body.appendChild(field('\u8AAC\u660E\uFF08\u8A73\u7D30\uFF09', 'textarea', d.fullDescription || '', 'cms-f-fullDescription'));
    body.appendChild(field('\u6A5F\u80FD\u4E00\u89A7\uFF081\u884C1\u9805\u76EE\uFF09', 'textarea', (d.features || []).join('\n'), 'cms-f-features'));
    body.appendChild(field('\u30D2\u30F3\u30C8\uFF08HTML\u53EF\uFF09', 'text', d.hint || '', 'cms-f-hint'));
    body.appendChild(field('\u8A73\u7D30CTA\u30E9\u30D9\u30EB', 'text', d.detailCtaLabel || '', 'cms-f-detailCtaLabel'));

    card.appendChild(body);

    /* Toggle expand */
    header.addEventListener('click', function (e) {
      if (e.target === delBtn) return;
      var open = body.style.display !== 'none';
      body.style.display = open ? 'none' : '';
      toggle.textContent = open ? '\u25BC' : '\u25B2';
    });

    /* Delete */
    delBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!confirm('\u300C' + (app.name || 'New App') + '\u300D\u3092\u524A\u9664\u3057\u307E\u3059\u304B\uFF1F')) return;
      collectAppForms();
      OwliaContent.apps.splice(idx, 1);
      var list = document.getElementById('cmsAppList');
      renderAppList(list);
    });

    return card;
  }

  function collectAppForms() {
    var cards = document.querySelectorAll('#cmsAppList .cms-app-card');
    var apps = [];
    cards.forEach(function (card) {
      var g = function (cls) {
        var el = card.querySelector('.' + cls);
        return el ? el.value : '';
      };

      var badgeVal = g('cms-f-badge');
      var cats = [];
      card.querySelectorAll('.cms-f-categories:checked').forEach(function (cb) { cats.push(cb.value); });

      apps.push({
        id: g('cms-f-id'),
        name: g('cms-f-name'),
        role: g('cms-f-role'),
        description: g('cms-f-description'),
        categories: cats,
        badge: badgeVal,
        badgeLabel: badgeVal === 'coming' ? '\u23F3 Coming Soon' : '\u2705 \u5229\u7528\u53EF\u80FD',
        icon: g('cms-f-icon'),
        tags: g('cms-f-tags').split(',').map(function (s) { return s.trim(); }).filter(Boolean),
        ctaLabel: g('cms-f-ctaLabel'),
        ctaLink: g('cms-f-ctaLink') || null,
        detail: {
          emoji: g('cms-f-emoji'),
          eyecatch: g('cms-f-eyecatch'),
          fullRole: g('cms-f-fullRole'),
          fullDescription: g('cms-f-fullDescription'),
          features: g('cms-f-features').split('\n').map(function (s) { return s.trim(); }).filter(Boolean),
          hint: g('cms-f-hint') || null,
          detailCtaLabel: g('cms-f-detailCtaLabel') || null
        }
      });
    });
    OwliaContent.apps = apps;
  }

  /* ========== Site Editor ========== */
  function buildSiteEditor(container) {
    container.innerHTML = '';

    var toolbar = el('div', 'cms-toolbar');
    var saveBtn = el('button', 'cms-btn cms-btn-save', '\uD83D\uDCBE \u4FDD\u5B58');
    toolbar.appendChild(saveBtn);
    var previewBtn = el('button', 'cms-btn cms-btn-preview', '\uD83D\uDC41 \u30D7\u30EC\u30D3\u30E5\u30FC');
    toolbar.appendChild(previewBtn);
    var resetBtn = el('button', 'cms-btn cms-btn-reset', '\u21A9 \u30C7\u30D5\u30A9\u30EB\u30C8\u306B\u623B\u3059');
    toolbar.appendChild(resetBtn);
    var exportBtn = el('button', 'cms-btn cms-btn-export', '\u2B07 JSON\u30A8\u30AF\u30B9\u30DD\u30FC\u30C8');
    toolbar.appendChild(exportBtn);
    container.appendChild(toolbar);

    if (OwliaContent.hasOverride('site')) {
      container.appendChild(el('div', 'cms-notice', '\u26A0\uFE0F \u30ED\u30FC\u30AB\u30EB\u30B9\u30C8\u30EC\u30FC\u30B8\u306E\u30AA\u30FC\u30D0\u30FC\u30E9\u30A4\u30C9\u304C\u9069\u7528\u3055\u308C\u3066\u3044\u307E\u3059'));
    }

    var site = OwliaContent.site || {};
    var form = el('div', 'cms-site-form');
    form.id = 'cmsSiteForm';

    /* Hero */
    form.appendChild(el('h4', 'cms-section-title', '\u30D2\u30FC\u30ED\u30FC'));
    form.appendChild(field('\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB', 'text', (site.hero || {}).titleSub || '', 'cms-s-hero-titleSub'));
    form.appendChild(field('\u30E1\u30A4\u30F3\u30BF\u30A4\u30C8\u30EB', 'text', (site.hero || {}).titleMain || '', 'cms-s-hero-titleMain'));
    form.appendChild(field('\u30AD\u30E3\u30C3\u30C1\u30B3\u30D4\u30FC', 'text', (site.hero || {}).titleCatch || '', 'cms-s-hero-titleCatch'));

    /* Sections */
    var secKeys = ['apps', 'roles', 'detail'];
    var secNames = { apps: 'APPS\u30BB\u30AF\u30B7\u30E7\u30F3', roles: 'FOR YOU\u30BB\u30AF\u30B7\u30E7\u30F3', detail: 'DETAILS\u30BB\u30AF\u30B7\u30E7\u30F3' };
    for (var i = 0; i < secKeys.length; i++) {
      var k = secKeys[i];
      var sec = (site.sections || {})[k] || {};
      form.appendChild(el('h4', 'cms-section-title', secNames[k]));
      form.appendChild(field('\u30E9\u30D9\u30EB', 'text', sec.label || '', 'cms-s-' + k + '-label'));
      form.appendChild(field('\u30BF\u30A4\u30C8\u30EB', 'text', sec.title || '', 'cms-s-' + k + '-title'));
      form.appendChild(field('\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB', 'text', sec.subtitle || '', 'cms-s-' + k + '-subtitle'));
    }

    /* CTA */
    form.appendChild(el('h4', 'cms-section-title', 'CTA\u30BB\u30AF\u30B7\u30E7\u30F3'));
    form.appendChild(field('\u30E9\u30D9\u30EB', 'text', (site.cta || {}).label || '', 'cms-s-cta-label'));
    form.appendChild(field('\u30BF\u30A4\u30C8\u30EB', 'text', (site.cta || {}).title || '', 'cms-s-cta-title'));
    form.appendChild(field('\u30B5\u30D6\u30BF\u30A4\u30C8\u30EB', 'text', (site.cta || {}).subtitle || '', 'cms-s-cta-subtitle'));

    /* Footer */
    form.appendChild(el('h4', 'cms-section-title', '\u30D5\u30C3\u30BF\u30FC'));
    form.appendChild(field('\u30C6\u30AD\u30B9\u30C8', 'text', (site.footer || {}).text || '', 'cms-s-footer-text'));

    container.appendChild(form);

    /* Events */
    saveBtn.addEventListener('click', function () {
      OwliaContent.site = collectSiteForm();
      OwliaContent.save('site', OwliaContent.site);
      showToast('\u30B5\u30A4\u30C8\u6587\u8A00\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F');
      buildSiteEditor(container);
    });

    previewBtn.addEventListener('click', function () {
      OwliaContent.site = collectSiteForm();
      OwliaContent.save('site', OwliaContent.site);
      window.open('index.html', '_blank');
    });

    resetBtn.addEventListener('click', function () {
      if (!confirm('\u30C7\u30D5\u30A9\u30EB\u30C8\u30C7\u30FC\u30BF\u306B\u623B\u3057\u307E\u3059\u304B\uFF1F')) return;
      OwliaContent.reset('site');
      OwliaContent.site = window.__OWLIA_SITE || {};
      buildSiteEditor(container);
      showToast('\u30C7\u30D5\u30A9\u30EB\u30C8\u306B\u623B\u3057\u307E\u3057\u305F');
    });

    exportBtn.addEventListener('click', function () {
      OwliaContent.site = collectSiteForm();
      downloadJSON('site.json', OwliaContent.site);
    });
  }

  function collectSiteForm() {
    var g = function (cls) {
      var el = document.querySelector('#cmsSiteForm .' + cls);
      return el ? el.value : '';
    };
    return {
      hero: {
        titleSub: g('cms-s-hero-titleSub'),
        titleMain: g('cms-s-hero-titleMain'),
        titleCatch: g('cms-s-hero-titleCatch')
      },
      sections: {
        apps: { label: g('cms-s-apps-label'), title: g('cms-s-apps-title'), subtitle: g('cms-s-apps-subtitle') },
        roles: { label: g('cms-s-roles-label'), title: g('cms-s-roles-title'), subtitle: g('cms-s-roles-subtitle') },
        detail: { label: g('cms-s-detail-label'), title: g('cms-s-detail-title'), subtitle: g('cms-s-detail-subtitle') }
      },
      cta: { label: g('cms-s-cta-label'), title: g('cms-s-cta-title'), subtitle: g('cms-s-cta-subtitle') },
      footer: { text: g('cms-s-footer-text') }
    };
  }

  /* ========== Form field helpers ========== */
  function field(label, type, value, cls) {
    var wrap = el('div', 'cms-field');
    wrap.appendChild(el('label', 'cms-label', esc(label)));
    var input;
    if (type === 'textarea') {
      input = el('textarea', 'cms-input ' + cls);
      input.rows = 3;
      input.value = value || '';
    } else {
      input = document.createElement('input');
      input.type = type;
      input.className = 'cms-input ' + cls;
      input.value = value || '';
    }
    wrap.appendChild(input);
    return wrap;
  }

  function fieldSelect(label, value, cls, options) {
    var wrap = el('div', 'cms-field');
    wrap.appendChild(el('label', 'cms-label', esc(label)));
    var sel = el('select', 'cms-input ' + cls);
    for (var i = 0; i < options.length; i++) {
      var opt = document.createElement('option');
      opt.value = options[i].v;
      opt.textContent = options[i].l;
      if (options[i].v === value) opt.selected = true;
      sel.appendChild(opt);
    }
    wrap.appendChild(sel);
    return wrap;
  }

  function fieldCheckboxes(label, values, cls, options) {
    var wrap = el('div', 'cms-field');
    wrap.appendChild(el('label', 'cms-label', esc(label)));
    var row = el('div', 'cms-checkbox-row');
    for (var i = 0; i < options.length; i++) {
      var lbl = el('label', 'cms-checkbox-label');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = cls;
      cb.value = options[i].v;
      if (values.indexOf(options[i].v) !== -1) cb.checked = true;
      lbl.appendChild(cb);
      lbl.appendChild(document.createTextNode(' ' + options[i].l));
      row.appendChild(lbl);
    }
    wrap.appendChild(row);
    return wrap;
  }

  /* ========== Download JSON ========== */
  function downloadJSON(filename, data) {
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast(filename + ' \u3092\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9\u3057\u307E\u3057\u305F');
  }
})();
