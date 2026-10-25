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

export function renderEditorialContent(article, { logoUrl } = {}) {
  const sections = asList(article.sections).map((section, index) => {
    const id = section.id || `editorial-section-${index + 1}`;
    return `<section class="editorial-section" id="${escapeHTML(id)}"><h2>${escapeHTML(section.title)}</h2>${asList(section.blocks).map(block => renderBlock(block, logoUrl)).join('')}</section>`;
  }).join('');
  const points = asList(article.points);
  const keypoints = points.length ? `<section class="article-keypoints" aria-label="この記事のポイント"><div class="keypoints-brand"><p lang="en">KEY POINT</p>${brandImage(logoUrl)}</div><ol class="keypoints-list">${points.map(point => `<li>${escapeHTML(point)}</li>`).join('')}</ol></section>` : '';
  return `<header class="editorial-heading"><p class="eyebrow">ASSETS / 資産運用</p><h1>${escapeHTML(article.title)}</h1></header><div class="article-prose editorial-prose">${paragraphs(article.introParagraphs, 'editorial-intro')}${sections}${keypoints}</div>`;
}

// Shared by full-text search; return plain strings rather than rendered markup.
export function editorialSearchText(article) {
  const text = [article.title, ...asList(article.introParagraphs)];
  for (const section of asList(article.sections)) {
    text.push(section.title);
    for (const block of asList(section.blocks)) {
      if (!block || typeof block !== 'object') continue;
      switch (block.type) {
        case 'paragraph': text.push(block.text); break;
        case 'qa': text.push(block.question, ...asList(block.answer)); break;
        case 'risk-list': text.push(...asList(block.items)); break;
        case 'note': text.push(...asList(block.paragraphs)); break;
      }
    }
  }
  text.push(...asList(article.points));
  return text.filter(value => value != null).map(String);
}
