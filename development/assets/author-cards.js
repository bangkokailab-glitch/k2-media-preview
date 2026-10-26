// Card-only author variations, shared by the comparison page and article previews.
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const cardDesigns = [
  {id:'card-a',name:'横並びカード',description:'写真と名前を横に並べ、紹介文をその下へ。記事の読み終わりから自然につながる、すっきりしたカードです。',measure:'記事下72px・スマホ64px／サイド56px'},
  {id:'card-b',name:'名刺カード',description:'写真・名前の欄と紹介文の欄を左右に分けた構成。小さな写真でも著者の情報がまとまって見えます。',measure:'記事下64px・スマホ56px／サイド48px'},
  {id:'card-c',name:'中央配置カード',description:'小さな写真、名前、リンクを中央にまとめ、紹介文には読みやすい幅を確保。静かな存在感のあるカードです。',measure:'記事下・サイドとも48px'}
];

export function renderAuthorCard(variant, place, {photoUrl, interactive = false} = {}) {
  const design = cardDesigns.find(item => item.id === variant) || cardDesigns[0];
  const position = place === 'sidebar' ? 'sidebar' : 'after';
  const id = `author-${design.id}-${position}`;
  const label = position === 'sidebar' ? '著者について' : 'プロフィールを見る';
  const action = interactive
    ? `<a class="acp-link" href="#profile" data-pending="profile">${label}</a>`
    : `<span class="acp-link" aria-disabled="true">${label}</span>`;
  return `<section class="author-card-proposal acp-${design.id} acp-${position}" aria-labelledby="${id}"><p class="acp-eyebrow">AUTHOR</p><div class="acp-identity"><img class="acp-portrait" src="${escapeHTML(photoUrl)}" alt="河合 圭（著者写真・仮配置）" width="300" height="300" loading="lazy" decoding="async"><div class="acp-nameplate"><h2 id="${id}">河合 圭</h2><p class="acp-role">K2 Family Office</p></div></div><div class="acp-details"><p class="acp-bio">事業・資産・家族をつなぎ、経営者のこれからを考える視点をお届けします。</p>${action}</div><p class="acp-note">写真は仮配置です。</p></section>`;
}
