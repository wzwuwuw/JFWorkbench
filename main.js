(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const icon = name => `<svg class="icon" width="19" height="19" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const keys = value => value.split('+').map(key => `<kbd>${escape(key.trim())}</kbd>`).join('<span aria-hidden="true">+</span>');

  const pages = [
    { id: 'overview', title: '作钓总览', icon: 'grid', group: '作钓控制', description: '连接状态、三支鱼竿与本次作钓任务，在同一处看清。', sections: [
      ['overview-session', '当前会话', '查看连接状态、三杆读数、当前任务和待应用设置。', ['三杆状态', '会话记录']]
    ] },
    { id: 'fishing', title: '作钓与鱼饵', icon: 'hook', group: '作钓控制', description: '按下杆、控饵和咬口顺序，安排每一次作钓。', sections: [
      ['fishing-automation', '自动作钓', '选择作钓范围，配置抛投、换饵与入护流程。', ['抛投', '换饵', '入护']],
      ['fishing-depth', '鱼饵与控深', '快速沉底、一秒沉底、目标深度与持续控饵集中设置。', ['Alt + E', 'Alt + Q', '目标深度']],
      ['fishing-fish', '咬口与鱼行为', '配置咬口阶段与鱼的响应，按需要调整相关行为。', ['咬口阶段', '鱼行为']]
    ] },
    { id: 'equipment', title: '竿轮与搏鱼', icon: 'sliders', group: '作钓控制', description: '收线、拉力与保护，一页完成竿轮调整。', sections: [
      ['equipment-retrieval', '收线与入护', '集中调整收线倍率、收线方式和入护速度。', ['转速倍率', '入护速度']],
      ['equipment-forces', '拉力与竿体', '切换六档拉力，设置直接张力与竿体保护。', ['F7 / F8', '六档拉力']],
      ['equipment-protection', '挂钩保护', '管理脱钩与挂底保护，并核对与筛选条件的关系。', ['脱钩保护', '挂底保护']]
    ] },
    { id: 'filter', title: '鱼获与筛选', icon: 'filter', group: '作钓控制', description: '从通用重量到逐鱼种阈值，定义自己的保留条件。', sections: [
      ['filter-policy', '保留条件', '设置重量上下限、保留策略和状态过滤。', ['重量范围', '保留策略']],
      ['filter-species', '鱼种与阈值', '管理排除与保留名单、鱼库和逐鱼种重量阈值。', ['鱼种名单', '重量阈值']],
      ['filter-handling', '处理当前鱼获', '选择目标鱼竿，手动脱钩或强制入护。', ['Alt + 3', 'Alt + 2']]
    ] },
    { id: 'map', title: '水域地图', icon: 'map', group: '地图与记录', description: '切换水域、标记位置，把地图与钓点连起来。', sections: [
      ['map-image', '水域地图', '浏览 17 张水域地图，点图标记目标并查看换算坐标。', ['17 张地图', '目标标记']],
      ['map-calibration', '坐标校准', '核对地图坐标与世界坐标，调整换算关系。', ['坐标换算', '地图校准']],
      ['map-relative', '相对地图与点位', '查看玩家周围的相对位置，管理对应地图点位。', ['相对位置', '地图点位']]
    ] },
    { id: 'locations', title: '钓点与移动', icon: 'pin', group: '地图与记录', description: '收藏人物和船只钓点，常用位置随时找到。', sections: [
      ['locations-boat', '船只控制', '设置推进力、锁船与船只移动方式。', ['锁船', '推进力']],
      ['locations-points', '钓点收藏', '分别管理人物与船只点位，保留常用作钓位置。', ['人物钓点', '船只钓点']],
      ['locations-movement', '坐标与人物移动', '指定目标坐标，使用常用点或调整人物位置。', ['目标坐标', '常用点']]
    ] },
    { id: 'services', title: '交易补给', icon: 'bag', group: '地图与记录', description: '鱼市、商店与日常补给，集中在一个入口。', sections: [
      ['services-access', '交易与补给', '打开鱼市、商店、咖啡厅、食品店和工业品服务，查看操作结果。', ['F1 — F4', 'F6', '服务记录']]
    ] },
    { id: 'insights', title: '数据与记录', icon: 'chart', group: '地图与记录', description: '从现场动态到作钓日记，用记录回看每一场作钓。', sections: [
      ['insights-live', '现场动态', '查看三杆反馈、实时环境、数据来源状态与提醒。', ['实时环境', '三杆反馈']],
      ['insights-species', '鱼种与规则', '搜索鱼种目录，预览自己的筛选规则。', ['鱼种搜索', '规则预览']],
      ['insights-journal', '作钓记录', '按场景与坐标回看作钓日记，导出 JSON 或 CSV。', ['日记对比', 'JSON / CSV']],
      ['insights-supplies', '订单与物资', '查看订单、背包、当前装备和鱼市报价。', ['订单', '背包', '报价']]
    ] },
    { id: 'settings', title: '设置', icon: 'toggles', group: '工作台', description: '把显示、提示与快捷键调整成自己的使用习惯。', sections: [
      ['settings-preferences', '工作台偏好', '管理窗口、缩放、快捷键方案与配置。', ['两套快捷键', '保存偏好']],
      ['settings-feedback', '提示与状态显示', '配置声音、鱼名重量和独立置顶的三杆状态窗。', ['声音提示', '多屏状态窗']],
      ['settings-scene', '场景与游戏显示', '管理水面可见性、场景标记与游戏内面板。', ['场景标记', '水面显示']],
      ['settings-compatibility', '兼容设置', '查看当前游戏版本对应的兼容选项。', ['兼容选项']]
    ] },
    { id: 'logs', title: '日志', icon: 'list', group: '工作台', description: '连接变化、操作结果与错误信息，随时回看。', sections: [
      ['logs-trace', '鱼对象追踪', '查看鱼生成、状态变化与操作记录，按需搜索和过滤。', ['状态记录', '搜索过滤']]
    ] },
    { id: 'about', title: '诊断与说明', icon: 'info', group: '工作台', description: '了解功能状态，查看使用说明与诊断信息。', sections: [
      ['about-overview', '接入与说明', '查看功能可用状态与运行说明。', ['功能状态', '使用说明']],
      ['about-fields', '字段诊断', '记录和比较观察字段，辅助理解读数变化。', ['字段观察', '记录对比']]
    ] }
  ];

  // Map names, resource numbers and calibration anchors match the desktop map catalog.
  const maps = [
    [0, '克马羚诺也湖', 'lake', [394, 924, 58, 95, 745, 303, 80, 56, 51]],
    [1, '唯有诺克河', 'river', [402, 437, 79, 90, 901, 899, 116, 125, 51]],
    [2, '旧奥斯特罗格湖', 'lake', [806, 156, 54, 12, 137, 1024, 10, 69, 51]],
    [3, '白河', 'river', [768, 729, 72, 61, 703, 373, 66, 29, 51]],
    [4, '廓里湖', 'lake', [110, 544, 65, 92, 754, 803, 115, 121, 51]],
    [5, '梅德韦杰湖', 'lake', [954, 1133, 75, 86, 619, 117, 51, 15, 51]],
    [6, '沃尔霍夫河', 'river', [355, 835, 60, 140, 834, 238, 141, 40, 51]],
    [7, '北顿涅茨河', 'river', [60, 956, 22, 152, 1073, 359, 171, 64, 51]],
    [8, '苏拉河', 'river', [271, 837, 37, 112, 708, 337, 93, 48, 51]],
    [9, '拉多加湖', 'lake', [474, 901, 44, 71, 1074, 358, 89, 30, 51]],
    [10, '琥珀湖', 'lake', [340, 975, 58, 172, 1073, 238, 168, 61, 51]],
    [11, '拉多加群岛', 'sea', [237, 956, 120, 480, 955, 238, 480, 120, 51]],
    [12, '阿赫图巴河', 'river', [236, 1076, 41, 180, 955, 239, 160, 40, 51]],
    [16, '铜湖', 'lake', [979, 947, 67, 63, 255, 209, 36, 32, 51]],
    [13, '下通古斯卡河', 'river', [355, 805, 72, 162, 833, 239, 168, 48, 51]],
    [14, '亚马河', 'river', [627, 808, 156, 202, 316, 486, 79, 122, 51]],
    [15, '挪威海', 'sea', [56, 655, 47, 550, 902, 289, 751, 241, 51]]
  ].map(([resource, name, kind, anchors], index) => ({ resource, name, kind, anchors, index }));
  const kinds = { lake: '湖泊', river: '河流', sea: '群岛与海域' };

  const commonHotkeys = [
    ['Home', '显示 / 隐藏工作台', '离线也可使用'],
    ['Alt + E', '快速沉底', '切换开关'], ['Alt + Q', '一秒沉底', '切换开关'],
    ['Alt + 1', '转速倍率', '切换开关'], ['Alt + 2', '强制入护', '处理当前鱼获'],
    ['Alt + 3', '手动脱钩', '处理当前鱼获'], ['Ctrl + E', '锁船', '切换开关'], ['Ctrl + Q', '潜艇', '切换开关']
  ];
  const schemeHotkeys = {
    jf: [['F1', '鱼市'], ['F2', '商店'], ['F3', '咖啡厅'], ['F4', '食品店'], ['F5', '清空数据'], ['F6', '工业品'], ['F7', '拉力档位减一'], ['F8', '拉力档位加一']],
    rf4: [['Insert', '显示 / 隐藏工作台'], ['F1', '秒沉底'], ['F2', '中鱼后继续控饵'], ['F3', '饵上升 10 米'], ['F4', '饵沉底与定船'], ['F5', '自动作钓'], ['F7', '锁高'], ['F8', '超级收线'], ['F10', '自动挖饵']]
  };

  let activePage = 'overview';
  const explorerNav = $('#explorer-nav');
  const explorerPanel = $('#explorer-panel');
  if (explorerNav && explorerPanel) {
    explorerNav.setAttribute('role', 'tablist');
    explorerNav.setAttribute('aria-orientation', 'vertical');
    explorerPanel.setAttribute('role', 'tabpanel');
    explorerNav.innerHTML = [...new Set(pages.map(page => page.group))].map(group => `<div class="explorer-group xgroup"><p class="explorer-group-label xgroup-label">${group}</p>${pages.filter(page => page.group === group).map(page => `<button type="button" class="explorer-page xnav-item" role="tab" id="page-${page.id}" aria-controls="explorer-panel" aria-selected="false" tabindex="-1" data-page="${page.id}">${icon(page.icon)}<span>${page.title}</span></button>`).join('')}</div>`).join('');
    explorerNav.addEventListener('click', event => {
      const button = event.target.closest('[data-page]');
      if (button) {
        selectPage(button.dataset.page);
        if (window.matchMedia('(max-width: 680px)').matches) {
          explorerPanel.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
        }
      }
    });
    explorerNav.addEventListener('keydown', event => {
      const buttons = $$('[data-page]', explorerNav);
      const position = buttons.indexOf(document.activeElement);
      if (position < 0 || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (position + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      selectPage(buttons[index].dataset.page);
      buttons[index].focus();
    });
    selectPage(activePage);
  }

  function selectPage(id, sectionId) {
    const page = pages.find(item => item.id === id);
    if (!page || !explorerPanel) return;
    activePage = id;
    $$('[data-page]', explorerNav).forEach(button => {
      const selected = button.dataset.page === id;
      button.setAttribute('aria-selected', String(selected));
      button.classList.toggle('is-active', selected);
      button.tabIndex = selected ? 0 : -1;
    });
    explorerPanel.setAttribute('aria-labelledby', `page-${id}`);
    explorerPanel.innerHTML = `<header class="xpanel-head"><p class="explorer-kicker xpanel-kicker">${escape(page.group)}<span class="explorer-badge">${id === 'insights' ? '4 个页签' : `${page.sections.length} 个用途分区`}</span></p><h3 class="explorer-title">${escape(page.title)}</h3><p class="explorer-desc xpanel-lead">${escape(page.description)}</p></header><div class="explorer-sections xsections">${page.sections.map(([section, title, description, tags]) => `<article class="explorer-section xsection" id="preview-${section}" tabindex="-1"><h4>${escape(title)}</h4><p>${escape(description)}</p><ul class="tags">${tags.map(tag => `<li>${escape(tag)}</li>`).join('')}</ul></article>`).join('')}</div><p class="xpanel-foot">${icon('info')}功能导航预览 · 点击左侧页面，继续了解工作台</p>`;
    if (sectionId) requestAnimationFrame(() => $(`#preview-${sectionId}`)?.focus({ preventScroll: true }));
  }

  const menuToggle = $('.menu-toggle');
  const navigation = $('#nav-links');
  function closeMenu() {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开菜单');
    navigation.classList.remove('is-open');
  }
  menuToggle?.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(expanded));
    menuToggle.setAttribute('aria-label', expanded ? '关闭菜单' : '打开菜单');
    navigation?.classList.toggle('is-open', expanded);
  });
  navigation?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.nav-shell')) closeMenu(); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', closeMenu);

  const galleryTabs = $$('#gallery-tabs [data-shot]');
  function selectShot(button) {
    galleryTabs.forEach(tab => {
      const selected = tab === button;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    $$('#gallery-stage [data-shot]').forEach(image => {
      const selected = image.dataset.shot === button.dataset.shot;
      image.classList.toggle('is-active', selected);
      image.hidden = !selected;
    });
    $('#gallery-stage')?.setAttribute('aria-labelledby', button.id);
    if ($('#gallery-caption')) $('#gallery-caption').textContent = button.dataset.caption;
  }
  galleryTabs.forEach((button, index) => {
    button.addEventListener('click', () => selectShot(button));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? galleryTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + galleryTabs.length) % galleryTabs.length;
      selectShot(galleryTabs[next]);
      galleryTabs[next].focus();
    });
  });
  if (galleryTabs[0]) selectShot(galleryTabs[0]);

  const tension = $('.tension');
  function changeTension(step) {
    if (!tension) return;
    const level = Math.max(1, Math.min(6, Number(tension.dataset.level) + step));
    tension.dataset.level = String(level);
    $('.tension-out', tension).textContent = `档位 ${level} · ${['不修改', '20%', '50%', '70%', '90%', '100%'][level - 1]}`;
    $$('.tension-track span', tension).forEach((span, index) => span.classList.toggle('is-active', index === level - 1));
    $$('[data-step]', tension).forEach(button => { button.disabled = level === (Number(button.dataset.step) < 0 ? 1 : 6); });
  }
  $$('[data-step]', tension || document).forEach(button => button.addEventListener('click', () => changeTension(Number(button.dataset.step))));
  changeTension(0);

  let activeScheme = 'jf';
  function selectScheme(scheme) {
    if (!schemeHotkeys[scheme]) return;
    activeScheme = scheme;
    $$('[data-scheme]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scheme === scheme)));
    const list = $('#hotkey-grid');
    if (list) list.innerHTML = [...commonHotkeys, ...schemeHotkeys[scheme]].map(([key, title, description]) => `<li class="hotkey glass"><span class="hotkey-keys">${keys(key)}</span><span class="hotkey-copy hotkey-label"><b>${escape(title)}</b>${description ? `<small>${escape(description)}</small>` : ''}</span></li>`).join('');
    const note = $('#hotkeys-note');
    if (note) note.textContent = scheme === 'jf' ? '日常操作与补给入口，按键即达。' : '保留常用 Alt / Ctrl 组合键，切换原 RF4 功能键。';
  }
  $$('[data-scheme]').forEach(button => button.addEventListener('click', () => selectScheme(button.dataset.scheme)));
  selectScheme(activeScheme);

  let activeModal = null;
  let returnFocus = null;
  let previousOverflow = '';
  let inertElements = [];
  const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
  function openModal(modal, focusTarget) {
    if (!modal) return;
    const opener = activeModal ? returnFocus : document.activeElement;
    if (activeModal) closeModal(false);
    returnFocus = opener;
    activeModal = modal;
    modal.hidden = false;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inertElements = [...document.body.children].filter(element => element !== modal).map(element => [element, element.inert]);
    inertElements.forEach(([element]) => { element.inert = true; });
    requestAnimationFrame(() => { if (activeModal === modal) (focusTarget || $(focusableSelector, modal))?.focus({ preventScroll: true }); });
  }
  function closeModal(restoreFocus = true) {
    if (!activeModal) return;
    activeModal.hidden = true;
    activeModal = null;
    document.body.style.overflow = previousOverflow;
    inertElements.forEach(([element, wasInert]) => { element.inert = wasInert; });
    inertElements = [];
    if (restoreFocus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  }

  let mapFilter = 'all';
  let activeMap = null;
  let markerPosition = null;
  const mapGrid = $('#map-grid');
  const lightbox = $('#lightbox');
  if (mapGrid) {
    mapGrid.innerHTML = maps.map(map => `<button type="button" class="map-card glass" data-map="${map.index}" data-kind="${map.kind}" aria-label="查看${escape(map.name)}地图"><span class="map-image"><img src="assets/maps/${map.resource}.webp" alt="${escape(map.name)}水域地图" width="560" height="560" loading="lazy" decoding="async"><span class="map-kind">${kinds[map.kind]}</span></span><span class="map-card-body map-info"><span><b>${escape(map.name)}</b><small>查看地图与选点</small></span><span class="map-index" aria-hidden="true">${String(map.index + 1).padStart(2, '0')}${icon('arrow')}</span></span></button>`).join('');
    mapGrid.addEventListener('click', event => {
      const button = event.target.closest('[data-map]');
      if (button) openMap(Number(button.dataset.map));
    });
    $$('[data-kind-count]').forEach(span => { span.textContent = span.dataset.kindCount === 'all' ? maps.length : maps.filter(map => map.kind === span.dataset.kindCount).length; });
  }
  function filterMaps(kind) {
    mapFilter = kind;
    $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === kind)));
    $$('#map-grid [data-map]').forEach(button => { button.hidden = kind !== 'all' && button.dataset.kind !== kind; });
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => filterMaps(button.dataset.filter)));
  function openMap(index) {
    if (!lightbox || !maps[index]) return;
    activeMap = maps[index];
    if (mapFilter !== 'all' && activeMap.kind !== mapFilter) filterMaps('all');
    updateMap();
    openModal(lightbox, $('[data-close-lightbox][aria-label]', lightbox));
  }
  function updateMap() {
    if (!activeMap) return;
    markerPosition = null;
    $('#lb-title').textContent = activeMap.name;
    const subtitle = $('#lb-sub');
    subtitle.textContent = `${kinds[activeMap.kind]} · 地图选点预览`;
    subtitle.lang = 'zh-CN';
    const filteredMaps = maps.filter(map => mapFilter === 'all' || map.kind === mapFilter);
    $('#lb-counter').textContent = `${Math.max(0, filteredMaps.indexOf(activeMap)) + 1} / ${filteredMaps.length} · 水域地图`;
    const image = $('#lb-img');
    image.src = `assets/maps/large/${activeMap.resource}.webp`;
    image.alt = `${activeMap.name}完整地图，点击或用方向键移动标记`;
    $('#lb-marker').hidden = true;
    $('#lb-meta').innerHTML = `<div><dt>水域类型</dt><dd>${kinds[activeMap.kind]}</dd></div><div><dt>选点方式</dt><dd>点击地图 / 方向键</dd></div>`;
    $('#lb-coord').textContent = '点图查看坐标 · 本页仅演示地图标记';
  }
  function stepMap(step) {
    const filtered = maps.filter(map => mapFilter === 'all' || map.kind === mapFilter);
    const index = filtered.indexOf(activeMap);
    activeMap = filtered[(index + step + filtered.length) % filtered.length];
    updateMap();
  }
  $$('[data-lb-step]').forEach(button => button.addEventListener('click', () => stepMap(Number(button.dataset.lbStep))));
  $$('[data-close-lightbox]').forEach(element => element.addEventListener('click', () => closeModal()));
  const mapFigure = $('#lb-figure');
  if (mapFigure) {
    mapFigure.tabIndex = 0;
    mapFigure.setAttribute('role', 'group');
    mapFigure.setAttribute('aria-label', '地图选点预览：点击或使用方向键移动标记，按 Enter 标记中心点');
    mapFigure.addEventListener('click', event => {
      const rectangle = $('#lb-img').getBoundingClientRect();
      if (event.clientX < rectangle.left || event.clientX > rectangle.right || event.clientY < rectangle.top || event.clientY > rectangle.bottom) return;
      placeMarker((event.clientX - rectangle.left) / rectangle.width, (event.clientY - rectangle.top) / rectangle.height);
      mapFigure.focus({ preventScroll: true });
    });
    mapFigure.addEventListener('keydown', event => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      const [x, y] = markerPosition || [0.5, 0.5];
      const delta = event.shiftKey ? 0.05 : 0.01;
      placeMarker(x + (event.key === 'ArrowLeft' ? -delta : event.key === 'ArrowRight' ? delta : 0), y + (event.key === 'ArrowUp' ? -delta : event.key === 'ArrowDown' ? delta : 0));
    });
  }
  function placeMarker(x, y) {
    if (!activeMap) return;
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    markerPosition = [x, y];
    const figureRect = mapFigure.getBoundingClientRect();
    const imageRect = $('#lb-img').getBoundingClientRect();
    const marker = $('#lb-marker');
    marker.style.left = `${imageRect.left - figureRect.left + x * imageRect.width}px`;
    marker.style.top = `${imageRect.top - figureRect.top + y * imageRect.height}px`;
    marker.hidden = false;
    const a = activeMap.anchors;
    const f = Math.fround;
    const scaleX = f((a[6] - a[2]) / (a[4] - a[0]));
    const scaleY = f((a[7] - a[3]) / (a[5] - a[1]));
    const offsetX = f(a[2] - scaleX * a[0]);
    const offsetY = f(a[3] - scaleY * a[1]);
    const canvasScale = f(1296 / 700);
    const pixelX = f(f(f(Math.round(x * 700)) * canvasScale) - a[8]);
    const pixelY = f(f(1296 - f(f(Math.round(y * 700)) * canvasScale)) - a[8]);
    const round = value => (value < 0 ? -1 : 1) * Math.round(Math.abs(value));
    const coordinateX = round(f(pixelX * scaleX + offsetX));
    const coordinateY = round(f(pixelY * scaleY + offsetY));
    $('#lb-coord').textContent = `已标记 · X ${coordinateX} / Y ${coordinateY} · 本页仅演示选点`;
  }
  window.addEventListener('resize', () => { if (activeModal === lightbox && markerPosition) placeMarker(...markerPosition); });

  const palette = $('#palette');
  const paletteInput = $('#palette-input');
  const paletteList = $('#palette-list');
  const paletteEscape = $('.palette-input > kbd');
  if (paletteEscape) {
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'icon-btn palette-close';
    closeButton.setAttribute('aria-label', '关闭搜索');
    closeButton.setAttribute('data-close-palette', '');
    paletteEscape.replaceWith(closeButton);
    closeButton.append(paletteEscape);
  }
  let searchResults = [];
  let searchSelection = 0;
  const searchIndex = [
    ...pages.map(page => ({ title: page.title, description: page.description, kind: '页面', icon: page.icon, page: page.id })),
    ...pages.flatMap(page => page.sections.map(([id, title, description, tags]) => ({ title, description: `${page.title} · ${description} ${tags.join(' ')}`, kind: '功能', icon: page.icon, page: page.id, section: id }))),
    ...maps.map(map => ({ title: map.name, description: `水域地图 · ${kinds[map.kind]} · 点击查看并体验地图选点`, kind: '地图', icon: 'map', map: map.index })),
    ...Object.entries(schemeHotkeys).flatMap(([scheme, items]) => [...commonHotkeys, ...items].map(([key, title]) => ({ title, description: `${scheme === 'jf' ? 'JF 方案' : '原 RF4 方案'} · ${key}`, kind: '快捷键', icon: 'toggles', scheme })))
  ];
  function search() {
    const terms = paletteInput.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    searchResults = searchIndex.filter(result => terms.every(term => `${result.title} ${result.description} ${result.kind}`.toLocaleLowerCase().includes(term))).sort((a, b) => {
      const query = paletteInput.value.trim().toLocaleLowerCase();
      return Number(b.title.toLocaleLowerCase().startsWith(query)) - Number(a.title.toLocaleLowerCase().startsWith(query));
    }).slice(0, terms.length ? 30 : 11);
    searchSelection = 0;
    paletteList.innerHTML = searchResults.length ? searchResults.map((result, index) => `<li class="palette-result" id="search-result-${index}" role="option" aria-selected="false" data-result="${index}"><span class="result-icon">${icon(result.icon)}</span><span class="result-label"><b class="palette-result-title">${escape(result.title)}</b><small class="palette-result-detail result-description">${escape(result.description)}</small></span><span class="palette-result-type result-kind">${result.kind}</span></li>`).join('') : '<li class="palette-empty" role="presentation">没有找到相关功能，试试“鱼饵”“地图”或“快捷键”。</li>';
    updateSearchSelection();
  }
  function updateSearchSelection() {
    $$('[data-result]', paletteList).forEach((result, index) => {
      result.setAttribute('aria-selected', String(index === searchSelection));
      result.classList.toggle('is-active', index === searchSelection);
    });
    if (searchResults.length) paletteInput.setAttribute('aria-activedescendant', `search-result-${searchSelection}`);
    else paletteInput.removeAttribute('aria-activedescendant');
  }
  function openPalette() {
    if (!palette || !paletteInput) return;
    closeMenu();
    paletteInput.value = '';
    search();
    openModal(palette, paletteInput);
  }
  function selectSearchResult(index) {
    const result = searchResults[index];
    if (!result) return;
    closeModal();
    if (result.map !== undefined) { openMap(result.map); return; }
    if (result.scheme) selectScheme(result.scheme);
    else selectPage(result.page, result.section);
    const target = result.scheme ? $('#hotkeys') : result.section ? $(`#preview-${result.section}`) : explorerPanel;
    target?.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    if (!result.section) requestAnimationFrame(() => {
      if (result.scheme) $(`[data-scheme="${result.scheme}"]`)?.focus({ preventScroll: true });
      else explorerPanel?.focus({ preventScroll: true });
    });
  }
  $$('[data-open-palette]').forEach(button => button.addEventListener('click', openPalette));
  $$('[data-close-palette]').forEach(element => element.addEventListener('click', () => closeModal()));
  paletteInput?.addEventListener('input', search);
  paletteInput?.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return;
    event.preventDefault();
    if (!searchResults.length) return;
    if (event.key === 'Enter') selectSearchResult(searchSelection);
    else {
      searchSelection = (searchSelection + (event.key === 'ArrowDown' ? 1 : -1) + searchResults.length) % searchResults.length;
      updateSearchSelection();
      $(`#search-result-${searchSelection}`)?.scrollIntoView({ block: 'nearest' });
    }
  });
  paletteList?.addEventListener('click', event => {
    const result = event.target.closest('[data-result]');
    if (result) selectSearchResult(Number(result.dataset.result));
  });

  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      activeModal === palette ? closeModal() : openPalette();
      return;
    }
    if (event.key === 'Escape') {
      if (activeModal) { event.preventDefault(); closeModal(); }
      else if (menuToggle?.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); }
      return;
    }
    if (activeModal && event.key === 'Tab') {
      const focusable = $$(focusableSelector, activeModal).filter(element => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !activeModal.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !activeModal.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
      return;
    }
    if (activeModal === lightbox && event.target !== mapFigure && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault();
      stepMap(event.key === 'ArrowRight' ? 1 : -1);
    }
  });

  // Content stays visible without animations or when JavaScript is unavailable.
  if ('IntersectionObserver' in window) {
    const navigationLinks = $$('#nav-links a');
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    navigationLinks.forEach(link => {
      const section = $(link.getAttribute('href'));
      if (section) sectionObserver.observe(section);
    });
  }
})();
