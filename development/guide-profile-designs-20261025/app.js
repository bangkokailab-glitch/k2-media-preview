(() => {
  'use strict';

  // Labels and descriptions can be updated without changing the gallery layout.
  const designs = [
    { id: 'guide-a', page: 'guide', variant: 'A', title: 'A案｜明るい読み物', description: 'イラストと余白を使い、落ち着いて読み進められる紙面。', image: 'assets/guide-a.webp' },
    { id: 'guide-b', page: 'guide', variant: 'B', title: 'B案｜LPとつながる夜景', description: '夜の書斎から入り、明るい本文へ切り替える構成。', image: 'assets/guide-b.webp' },
    { id: 'guide-c', page: 'guide', variant: 'C', title: 'C案｜図解で見渡す', description: '関係図と時間軸を大きく見せ、考え方を整理する構成。', image: 'assets/guide-c.webp' },
    { id: 'guide-d', page: 'guide', variant: 'D', title: 'D案｜章のメリハリ', description: '明暗を切り替え、中心となる思想の章を印象づける構成。', image: 'assets/guide-d.webp' },
    { id: 'guide-e', page: 'guide', variant: 'E', title: 'E案｜問いを整理する', description: '章ごとに紙面を分け、図解と問いを順番に追う構成。', image: 'assets/guide-e.webp' },
    { id: 'profile-a', page: 'profile', variant: 'A', title: 'A案｜明るい人物紹介', description: '小さな写真と落ち着いた本文で、経歴と思想を伝える構成。', image: 'assets/profile-a.webp' },
    { id: 'profile-b', page: 'profile', variant: 'B', title: 'B案｜書斎から伝える', description: '既存LPの書斎の雰囲気を使い、写真と文章を交互に配置。', image: 'assets/profile-b.webp' },
    { id: 'profile-c', page: 'profile', variant: 'C', title: 'C案｜歩みを整理する', description: '章の帯と分野のアイコンで、経験と考え方を整理する構成。', image: 'assets/profile-c.webp' },
    { id: 'profile-d', page: 'profile', variant: 'D', title: 'D案｜静かな書籍', description: '中央の人物写真から始まり、縦にゆっくり読み進める構成。', image: 'assets/profile-d.webp' },
    { id: 'profile-e', page: 'profile', variant: 'E', title: 'E案｜思想を図で伝える', description: '望む人生を中心に、事業・資産・家族のつながりを見せる構成。', image: 'assets/profile-e.webp' },
  ];
  const pageNames = { guide: 'ガイド01', profile: 'プロフィール' };
  const grid = document.getElementById('design-grid');
  const dialog = document.getElementById('design-dialog');
  const dialogContent = document.getElementById('dialog-content');
  const status = document.getElementById('status-message');
  let currentPage = new URLSearchParams(location.search).get('page') === 'profile' ? 'profile' : 'guide';
  let selected = [];
  let displayedId = null;
  let returnFocus = null;

  function el(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }
  function fullLabel(design) { return `${pageNames[design.page]} ${design.title}`; }
  function announce(message) { status.textContent = message; }
  function designById(id) { return designs.find(design => design.id === id); }

  function makeImage(design, lazy = false) {
    const image = el('img');
    image.alt = `${fullLabel(design)}のページ全体のデザイン`;
    image.decoding = 'async';
    image.loading = lazy ? 'lazy' : 'eager';
    image.addEventListener('error', () => {
      const fallback = el('div', 'image-fallback', 'デザイン画像を準備中です');
      fallback.append(el('span', '', fullLabel(design)));
      image.replaceWith(fallback);
    }, { once: true });
    image.src = design.image;
    return image;
  }

  function renderCards() {
    grid.replaceChildren();
    for (const design of designs.filter(item => item.page === currentPage)) {
      const card = el('article', 'design-card');
      card.dataset.designId = design.id;
      const preview = el('button', 'preview-button');
      preview.type = 'button';
      preview.setAttribute('aria-label', `${fullLabel(design)}のページ全体を見る`);
      preview.append(makeImage(design, true), el('span', 'preview-label', '全体を見る'));
      preview.addEventListener('click', () => openSingle(design.id));
      const details = el('div', 'card-details');
      details.append(el('p', 'card-type', design.page === 'guide' ? 'GUIDE 01' : 'PROFILE'), el('h3', 'card-title', design.title));
      if (design.description) details.append(el('p', 'card-description', design.description));
      const actions = el('div', 'card-actions');
      const view = el('button', 'outline-button', '全体を見る');
      view.type = 'button';
      view.setAttribute('aria-label', `${fullLabel(design)}のページ全体を見る`);
      view.addEventListener('click', () => openSingle(design.id));
      const select = el('button', 'select-button', '比較に追加');
      select.type = 'button';
      select.dataset.selectId = design.id;
      select.setAttribute('aria-pressed', 'false');
      select.setAttribute('aria-label', `${fullLabel(design)}を比較に追加`);
      select.addEventListener('click', () => toggleSelection(design.id));
      actions.append(view, select);
      details.append(actions);
      card.append(preview, details);
      grid.append(card);
    }
    document.getElementById('section-title').textContent = pageNames[currentPage];
    document.querySelectorAll('[data-page]').forEach(tab => {
      if (tab.dataset.page === currentPage) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
    document.title = `${pageNames[currentPage]} デザイン比較 | K2 Family Office`;
    syncSelection();
  }

  function toggleSelection(id) {
    if (selected.includes(id)) {
      selected = selected.filter(value => value !== id);
      announce(`${fullLabel(designById(id))}の選択を解除しました。`);
    } else if (selected.length < 2) {
      selected.push(id);
      announce(`${fullLabel(designById(id))}を比較に追加しました。${selected.length}案を選択しています。`);
    } else {
      announce('比較できるのは2案までです。先に選択中の案を1つ解除してください。');
      return;
    }
    syncSelection();
  }

  function syncSelection() {
    document.querySelectorAll('[data-select-id]').forEach(button => {
      const chosen = selected.includes(button.dataset.selectId);
      button.textContent = chosen ? '比較から外す' : '比較に追加';
      button.setAttribute('aria-pressed', String(chosen));
      button.setAttribute('aria-label', `${fullLabel(designById(button.dataset.selectId))}を${chosen ? '比較から外す' : '比較に追加'}`);
      button.closest('.design-card').classList.toggle('is-selected', chosen);
    });
    const chips = document.getElementById('selection-chips');
    chips.replaceChildren();
    selected.forEach(id => {
      const chip = el('button', 'selection-chip', fullLabel(designById(id)));
      chip.type = 'button';
      chip.setAttribute('aria-label', `${fullLabel(designById(id))}の選択を解除`);
      const close = el('span', 'chip-close', '×');
      close.setAttribute('aria-hidden', 'true');
      chip.append(close);
      chip.addEventListener('click', () => toggleSelection(id));
      chips.append(chip);
    });
    document.getElementById('compare-bar').hidden = selected.length === 0;
    document.getElementById('selection-count').textContent = `${selected.length} / 2`;
    document.getElementById('open-comparison').disabled = selected.length !== 2;
    document.body.classList.toggle('has-selection', selected.length > 0);
  }

  function makeFullDesign(design, showCaption = true) {
    const figure = el('figure', 'full-design');
    if (showCaption) {
      const caption = el('figcaption');
      caption.append(el('span', '', fullLabel(design)));
      const imageLink = el('a', '', '画像を別タブで開く');
      imageLink.href = design.image;
      imageLink.target = '_blank';
      imageLink.rel = 'noopener noreferrer';
      caption.append(imageLink);
      figure.append(caption);
    }
    figure.append(makeImage(design));
    return figure;
  }

  function showDialog() {
    if (!dialog.open) {
      returnFocus = document.activeElement;
      dialog.showModal();
      document.body.classList.add('dialog-open');
    }
    dialog.scrollTop = 0;
  }

  function openSingle(id) {
    const design = designById(id);
    if (!design) return;
    displayedId = id;
    dialog.classList.remove('is-comparison');
    document.getElementById('dialog-title').textContent = fullLabel(design);
    document.getElementById('dialog-eyebrow').textContent = 'FULL PAGE';
    document.getElementById('single-navigation').hidden = false;
    const peers = designs.filter(item => item.page === design.page);
    const index = peers.findIndex(item => item.id === id);
    document.getElementById('design-position').textContent = `${index + 1} / ${peers.length}`;
    document.getElementById('previous-design').disabled = index === 0;
    document.getElementById('next-design').disabled = index === peers.length - 1;
    dialogContent.replaceChildren(makeFullDesign(design));
    showDialog();
  }

  function stepDesign(direction) {
    const design = designById(displayedId);
    if (!design) return;
    const peers = designs.filter(item => item.page === design.page);
    const index = peers.findIndex(item => item.id === displayedId) + direction;
    if (peers[index]) openSingle(peers[index].id);
  }

  function openComparison() {
    if (selected.length !== 2) return;
    displayedId = null;
    dialog.classList.add('is-comparison');
    document.getElementById('dialog-title').textContent = '2案を比較';
    document.getElementById('dialog-eyebrow').textContent = 'COMPARE';
    document.getElementById('single-navigation').hidden = true;
    const comparison = el('div', 'comparison-grid');
    selected.forEach(id => comparison.append(makeFullDesign(designById(id))));
    dialogContent.replaceChildren(comparison);
    showDialog();
  }

  document.querySelectorAll('[data-page]').forEach(tab => {
    tab.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      currentPage = tab.dataset.page;
      const url = new URL(location.href);
      url.searchParams.set('page', currentPage);
      history.pushState({}, '', url);
      renderCards();
      announce(`${pageNames[currentPage]}の5案を表示しました。`);
    });
  });
  window.addEventListener('popstate', () => {
    currentPage = new URLSearchParams(location.search).get('page') === 'profile' ? 'profile' : 'guide';
    renderCards();
  });
  document.getElementById('clear-selection').addEventListener('click', () => {
    selected = [];
    syncSelection();
    announce('比較する案の選択を解除しました。');
  });
  document.getElementById('open-comparison').addEventListener('click', openComparison);
  document.getElementById('previous-design').addEventListener('click', () => stepDesign(-1));
  document.getElementById('next-design').addEventListener('click', () => stepDesign(1));
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    displayedId = null;
    if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (!dialog.open || !displayedId) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); stepDesign(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); stepDesign(1); }
  });
  renderCards();
})();
