// Reusable editorial blocks. All article copy and attribute values are escaped.
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[character]);
const asList = value => Array.isArray(value) ? value : value == null ? [] : [value];
const paragraphs = (items, className = '') => asList(items).map(text =>
  `<p${className ? ` class="${className}"` : ''}>${escapeHTML(text)}</p>`
).join('');

const icon = paths => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths}</svg>`;
const personIcon = icon('<circle cx="16" cy="9" r="5"/><path d="M5 28v-3a11 11 0 0 1 22 0v3"/>');
const warningIcon = icon('<path d="M16 4 29 27H3L16 4Z"/><path d="M16 12v7m0 4v.2"/>');
const bookIcon = icon('<path d="M16 7v21M16 7C12 4 7 4 3 5v21c4-1 9-1 13 2 4-3 9-3 13-2V5c-4-1-9-1-13 2Z"/>');

function brandImage(logoUrl) {
  return `<img src="${escapeHTML(logoUrl)}" alt="K2 Family Office" width="96" height="85" loading="lazy" decoding="async">`;
}

function renderBlock(block, logoUrl) {
  if (!block || typeof block !== 'object') return '';
  switch (block.type) {
    case 'paragraph':
      return paragraphs(block.text);
    case 'heading':
      return `<h3 id="${escapeHTML(block.id)}">${escapeHTML(block.text)}</h3>`;
    case 'qa':
      return `<section class="article-qa" aria-label="質問と回答"><div class="qa-question-row"><span class="qa-person-icon" aria-hidden="true">${personIcon}</span><div class="qa-question-bubble"><p><span aria-hidden="true">Q.</span><span class="sr-only">質問：</span> ${escapeHTML(block.question)}</p></div></div><div class="qa-answer-row"><div class="qa-answer-bubble"><span class="sr-only">回答：</span>${paragraphs(block.answer)}</div><div class="qa-brand">${brandImage(logoUrl)}</div></div></section>`;
    case 'risk-list':
      return `<div class="article-risk"><div class="risk-icon" aria-hidden="true">${warningIcon}</div><ul>${asList(block.items).map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul></div>`;
    case 'note':
      return `<aside class="article-note" aria-label="補足"><p class="note-label">${bookIcon}<span lang="en">NOTE</span></p><div class="note-copy">${paragraphs(block.paragraphs)}</div></aside>`;
    default:
      return '';
  }
}

function renderCover(cover) {
  if (!cover?.src) return '';
  const dimension = value => Number.isInteger(value) && value > 0 ? value : 1254;
  const responsive = `${cover.srcset ? ` srcset="${escapeHTML(cover.srcset)}"` : ''}${cover.sizes ? ` sizes="${escapeHTML(cover.sizes)}"` : ''}`;
  return `<figure class="editorial-cover"><img src="${escapeHTML(cover.src)}"${responsive} alt="${escapeHTML(cover.alt || '')}" width="${dimension(cover.width)}" height="${dimension(cover.height)}" loading="eager" fetchpriority="high" decoding="async"></figure>`;
}

function normalizedSections(article) {
  return [...asList(article.sections), ...(article.summary ? [article.summary] : [])].map((section, index) => {
    const id = section.id || `editorial-section-${index + 1}`;
    return { ...section, id, blocks: asList(section.blocks).map((block, blockIndex) => block.type === 'heading' ? { ...block, id: block.id || `${id}-heading-${blockIndex + 1}` } : block) };
  });
}
function renderContents(sections) {
  const items = sections.map(section => {
    const children = section.blocks.filter(block => block.type === 'heading');
    return `<li><a href="#${escapeHTML(section.id)}">${escapeHTML(section.title)}</a>${children.length ? `<ol>${children.map(block => `<li><a href="#${escapeHTML(block.id)}">${escapeHTML(block.text)}</a></li>`).join('')}</ol>` : ''}</li>`;
  }).join('');
  return `<nav class="editorial-toc" aria-labelledby="article-toc-title"><h2 id="article-toc-title">目次</h2><ol>${items}</ol></nav>`;
}
// The banner HTML slot is a trusted local template, never article-body user input.
export function renderEditorialContent(article, { logoUrl, cover, guideBannerHTML = '' } = {}) {
  const sectionData = normalizedSections(article);
  const points = asList(article.points);
  const keypoints = points.length ? `<section class="article-keypoints" aria-label="この記事のポイント"><div class="keypoints-brand"><p lang="en">KEY POINT</p>${brandImage(logoUrl)}</div><ol class="keypoints-list">${points.map(point => `<li>${escapeHTML(point)}</li>`).join('')}</ol></section>` : '';
  const sections = sectionData.map((section, index) => {
    const isSummary = Boolean(article.summary) && index === sectionData.length - 1;
    return `<section class="editorial-section${isSummary ? ' editorial-summary' : ''}" id="${escapeHTML(section.id)}"><h2>${escapeHTML(section.title)}</h2>${isSummary ? keypoints : ''}${section.blocks.map(block => renderBlock(block, logoUrl)).join('')}</section>`;
  }).join('');
  const opening = asList(article.openingBlocks).map(block => renderBlock(block, logoUrl)).join('');
  const contents = article.template === 'editorial-v2' ? renderContents(sectionData) : '';
  return `<header class="editorial-heading"><p class="eyebrow">ASSETS / 資産運用</p><h1>${escapeHTML(article.title)}</h1></header>${renderCover(cover)}<div class="article-prose editorial-prose"><div class="editorial-introduction">${paragraphs(article.introParagraphs, 'editorial-intro')}</div>${opening}${guideBannerHTML}${contents}${sections}${article.summary ? '' : keypoints}</div>`;
}

// Search indexes each reusable body block, including opening and summary content.
export function editorialSearchText(article) {
  const text = [article.title, ...asList(article.introParagraphs)];
  const sections = normalizedSections(article);
  const blocks = [...asList(article.openingBlocks)];
  for (const section of sections) { text.push(section.title); blocks.push(...section.blocks); }
  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue;
    switch (block.type) {
      case 'paragraph': case 'heading': text.push(block.text); break;
      case 'qa': text.push(block.question, ...asList(block.answer)); break;
      case 'risk-list': text.push(...asList(block.items)); break;
      case 'note': text.push(...asList(block.paragraphs)); break;
    }
  }
  text.push(...asList(article.points));
  return text.filter(value => value != null).map(String);
}
