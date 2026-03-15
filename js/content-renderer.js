/* ===================================
   Owlia Content Renderer
   Generates DOM from OwliaContent data
   =================================== */

function escHtml(s) {
  if (!s) return '';
  var d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/* ----- App Cards (#appGrid) ----- */
function renderAppCards(apps) {
  var grid = document.getElementById('appGrid');
  if (!grid) return;

  var html = '';
  for (var i = 0; i < apps.length; i++) {
    var a = apps[i];
    var isSoon = a.badge === 'coming';
    var delay = i > 0 ? ' fi-d' + i : '';

    html += '<div class="app-card' + (isSoon ? ' soon' : '') + ' fi' + delay + '" data-cat="' + escHtml(a.categories.join(' ')) + '">';
    html += '<div class="app-card-top">';
    html += '<div class="app-card-icon"><img src="' + escHtml(a.icon) + '" alt="' + escHtml(a.id) + '" loading="lazy"></div>';
    html += '<span class="badge ' + (isSoon ? 'badge-soon' : 'badge-ok') + '">' + a.badgeLabel + '</span>';
    html += '</div>';
    html += '<div class="app-card-name">' + escHtml(a.name) + '</div>';
    html += '<div class="app-card-role">' + escHtml(a.role) + '</div>';
    html += '<div class="app-card-desc">' + escHtml(a.description) + '</div>';
    html += '<div class="app-card-tags">';
    for (var t = 0; t < a.tags.length; t++) {
      html += '<span class="app-tag">' + escHtml(a.tags[t]) + '</span>';
    }
    html += '</div>';
    html += '<div class="app-card-cta">';
    if (a.ctaLink) {
      html += '<a href="' + escHtml(a.ctaLink) + '" class="btn btn-teal btn-sm" target="_blank" rel="noopener">' + escHtml(a.ctaLabel) + '</a>';
    } else {
      html += '<button class="btn btn-disabled btn-sm">' + escHtml(a.ctaLabel) + '</button>';
    }
    html += '</div></div>';
  }
  grid.innerHTML = html;
}

/* ----- Detail Tabs + Panels ----- */
function renderDetailTabs(apps) {
  var tabsContainer = document.getElementById('detailTabsContainer');
  var panelsContainer = document.getElementById('detailPanelsContainer');
  if (!tabsContainer || !panelsContainer) return;

  var tabsHtml = '';
  var panelsHtml = '';

  for (var i = 0; i < apps.length; i++) {
    var a = apps[i];
    var d = a.detail;
    if (!d) continue;
    var isFirst = i === 0;
    var isSoon = a.badge === 'coming';

    // Tab button
    tabsHtml += '<button class="detail-tab' + (isFirst ? ' active' : '') + '" data-tab="' + escHtml(a.id) + '" role="tab">' + escHtml(a.name.replace('Owlia-', '')) + '</button>';

    // Panel
    panelsHtml += '<div class="detail-panel' + (isFirst ? ' active' : '') + '" id="p-' + escHtml(a.id) + '">';
    panelsHtml += '<div class="detail-content"><div class="detail-info">';
    panelsHtml += '<h3>' + (d.emoji || '') + ' ' + escHtml(a.name) + '</h3>';
    panelsHtml += '<span class="badge ' + (isSoon ? 'badge-soon' : 'badge-ok') + '" style="margin-bottom:12px">' + (isSoon ? 'Coming Soon' : '利用可能') + '</span>';
    panelsHtml += '<div class="detail-role">' + escHtml(d.fullRole) + '</div>';
    panelsHtml += '<div class="detail-desc">' + escHtml(d.fullDescription) + '</div>';
    panelsHtml += '<div class="detail-features">';
    for (var f = 0; f < d.features.length; f++) {
      panelsHtml += '<div class="detail-feat"><span class="ck">\u2714</span> ' + escHtml(d.features[f]) + '</div>';
    }
    panelsHtml += '</div>';
    if (d.hint) {
      panelsHtml += '<div class="step-hint" style="margin-bottom:16px">' + d.hint + '</div>';
    }
    if (a.ctaLink && d.detailCtaLabel) {
      panelsHtml += '<a href="' + escHtml(a.ctaLink) + '" class="btn btn-teal" target="_blank" rel="noopener">' + escHtml(d.detailCtaLabel) + '</a>';
    } else {
      panelsHtml += '<button class="btn btn-disabled">\u6E96\u5099\u4E2D</button>';
    }
    panelsHtml += '</div><div><div class="detail-character">';
    panelsHtml += '<img src="' + escHtml(d.eyecatch) + '" alt="' + escHtml(a.name) + '" loading="lazy">';
    panelsHtml += '</div></div></div></div>';
  }

  tabsContainer.innerHTML = tabsHtml;
  panelsContainer.innerHTML = panelsHtml;
}

/* ----- Site Text (hero, sections, cta, footer) ----- */
function renderSiteText(site) {
  if (!site) return;

  // Hero
  if (site.hero) {
    var el;
    el = document.getElementById('heroTitleSub');
    if (el) el.textContent = site.hero.titleSub || '';
    el = document.getElementById('heroTitleMain');
    if (el) el.textContent = site.hero.titleMain || '';
    el = document.getElementById('heroTitleCatch');
    if (el) el.textContent = site.hero.titleCatch || '';
  }

  // Sections
  if (site.sections) {
    var keys = Object.keys(site.sections);
    for (var i = 0; i < keys.length; i++) {
      var sec = site.sections[keys[i]];
      var header = document.querySelector('[data-section="' + keys[i] + '"]');
      if (header) {
        var lbl = header.querySelector('.section-label');
        var ttl = header.querySelector('.section-title');
        var sub = header.querySelector('.section-subtitle');
        if (lbl) lbl.textContent = sec.label || '';
        if (ttl) ttl.textContent = sec.title || '';
        if (sub) sub.textContent = sec.subtitle || '';
      }
    }
  }

  // CTA
  if (site.cta) {
    var ctaSec = document.getElementById('ctaSection');
    if (ctaSec) {
      var lbl = ctaSec.querySelector('.section-label');
      var ttl = ctaSec.querySelector('.section-title');
      var sub = ctaSec.querySelector('.section-subtitle');
      if (lbl) lbl.textContent = site.cta.label || '';
      if (ttl) ttl.textContent = site.cta.title || '';
      if (sub) sub.textContent = site.cta.subtitle || '';
    }
  }

  // Footer
  if (site.footer) {
    var ftEl = document.getElementById('footerText');
    if (ftEl) ftEl.textContent = site.footer.text || '';
  }
}

/* ----- Render all ----- */
function renderAllContent() {
  OwliaContent.init();
  renderAppCards(OwliaContent.apps);
  renderDetailTabs(OwliaContent.apps);
  renderSiteText(OwliaContent.site);
}
