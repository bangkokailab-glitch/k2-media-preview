// Shared between the comparison gallery and the actual article previews.
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const authorDesigns = [
  {id:'a',name:'カード型',description:'淡いベージュの面に、写真と名前を横並び。紹介文とプロフィールへの入口をひとつにまとめます。',measure:'記事下72px・スマホ64px／サイド56px'},
  {id:'b',name:'編集記事型',description:'上下の細い罫線で本文と区切り、写真・名前と紹介文を分けて配置。落ち着いた余白を持たせます。',measure:'記事下88px・スマホ72px／サイド72px'},
  {id:'c',name:'署名型',description:'小さな写真を添えて、名前と紹介文を主役に。記事を読み終えた流れに自然につなげます。',measure:'記事下・サイドとも48px'}
];
export function renderAuthorProposal(variant, place, {photoUrl, interactive = false} = {}) {
  const design=authorDesigns.find(d=>d.id===variant)||authorDesigns[0];
  const id=`author-${design.id}-${place}`;
  const label=place==='sidebar'?'著者について':'プロフィールを見る';
  const link=interactive?`<a class="ap-link" href="#profile" data-pending="profile">${label}</a>`:`<span class="ap-link" aria-disabled="true">${label}</span>`;
  return `<section class="author-proposal ap-${design.id} ap-${place}" aria-labelledby="${id}"><p class="ap-eyebrow">AUTHOR</p><div class="ap-identity"><img class="ap-portrait" src="${escapeHTML(photoUrl)}" alt="河合 圭（著者写真・仮配置）" width="300" height="300" loading="lazy" decoding="async"><div class="ap-nameplate"><h2 id="${id}">河合 圭</h2><p class="ap-role">K2 Family Office</p></div></div><p class="ap-bio">事業・資産・家族をつなぎ、経営者のこれからを考える視点をお届けします。</p>${link}<p class="ap-note">写真は仮配置です。</p></section>`;
}
