const cats=[
 ['ファミリーオフィス','考え方 / 人生設計 / 相続・承継'],
 ['資産運用','資産管理 / 運用の選択肢 / 分散'],
 ['経営者','事業 / M&A / 法人 / 組織・人材'],
 ['海外戦略','海外移住 / 教育 / ビザ / 国際分散'],
 ['コラム','世界情勢 / AI / 投資哲学 / 資本家思考']
];
const articles=[
 {cat:'経営者',title:'事業家から投資家・資本家へ移るタイミング',img:'article-architecture.png',alt:'街路に面した落ち着いた石造建築'},
 {cat:'海外戦略',title:'日本の経営者が海外に資産を持つ意味',img:'article-city.png',alt:'窓の先に広がる海外の都市と川'},
 {cat:'経営者',title:'会社で稼いだお金をいつ自社以外へ移すべきか',img:'notebook.png',alt:'木の机に置かれたノートとペン'},
 {cat:'資産運用',title:'経営者の資産はなぜ自社株に集中するのか',img:'office.png',alt:'都市を見渡す静かなオフィス'},
 {cat:'海外戦略',title:'子どもの海外教育と資産形成を一緒に考える',img:'campus.png',alt:'緑に囲まれた海外の大学キャンパス'},
 {cat:'ファミリーオフィス',title:'40代経営者にファミリーオフィスは必要か',img:'article-life.png',alt:'暮らしとこれからを考える静かな読書の空間'}
];
const guides=[
 {title:'ファミリーオフィスとは何か',img:'office.png'},
 {title:'なぜ課題がバラバラになるのか',img:'notebook.png'},
 {title:'専門家とファミリーオフィスの違い',img:'library.png'}
];
const variants={
 A:{name:'全面写真',hero:'hero-a.png',description:'ヘッダーから記事・ガイド・フッターまで写真背景で統一。LPの静かなオフィスの世界観を引き継ぐ案。'},
 B:{name:'ウォームベージュ',hero:'hero-a.png',description:'全面写真のメイン画像から、LPのFAQに近い温かなベージュの誌面へ。ブランドの一体感と記事の読みやすさを両立。'},
 C:{name:'エディトリアル',hero:'hero-c.png',description:'明るいアイボリーに、写真と見出しを横に並べた記事一覧。余白と細い線で、落ち着いたジャーナルに。'}
};
const url=(p,extra='')=>'#preview-'+p;
const catUrl=c=>url('category');
const logo=()=>'<img class="brand-logo" src="assets/k2-lp-logo.svg" alt="K2 Family Office"><span class="brand-media">MEDIA</span>';
function hero(){return '<div id="top"><iframe class="hero-frame" src="../?v=20261019-menu" title="K2 Family Office 最新ファーストビュー" allow="autoplay"></iframe></div>'}
function categories(){return `<nav class="wrap categories" aria-label="記事カテゴリー"><span class="eyebrow">CATEGORY</span>${cats.map(c=>`<a href="${catUrl(c[0])}">${c[0]}</a>`).join('')}</nav>`}
function article(a,i){let link=url('article','&title='+encodeURIComponent(a.title));return `<article class="article-card"><a class="article-image" href="${link}" tabindex="-1" aria-hidden="true"><img src="assets/${a.img}" alt="" loading="eager"></a><div class="article-info"><div class="article-meta"><a href="${catUrl(a.cat)}">${a.cat}</a><span class="date">YYYY.MM.DD</span></div><h3><a href="${link}">${a.title}</a></h3><a class="article-arrow" href="${link}" aria-label="${a.title}を読む">読む <span aria-hidden="true">→</span></a></div></article>`}
function sidebar(){return `<aside class="sidebar" aria-label="テーマとガイド"><section class="topic-block"><p class="eyebrow">EXPLORE TOPICS</p><h2>テーマから探す</h2><nav>${cats.map((c,i)=>`<a class="topic" href="${catUrl(c[0])}"><span class="topic-number">0${i+1}</span><span><strong>${c[0]}</strong><small>${c[1]}</small></span><span class="topic-arrow" aria-hidden="true">↗</span></a>`).join('')}</nav></section><section class="side-guide"><div class="side-guide-photo"><img src="assets/library.png" alt="静かな書斎の机と本"></div><p class="eyebrow">FAMILY OFFICE GUIDE</p><h2>ファミリーオフィスを知る</h2><p>人生・事業・資産をつなげて考える、その基本と役割をご紹介します。</p><ol>${guides.map((g,i)=>`<li><a href="${url('guide')}#guide-${i+1}"><span>0${i+1}</span>${g.title}<b aria-hidden="true">→</b></a></li>`).join('')}</ol><a href="${url('guide')}" class="text-link">ガイド一覧へ <span aria-hidden="true">→</span></a></section></aside>`}
function reading(){return `<section class="reading-region"><div class="reading-photo" aria-hidden="true"></div>${categories()}<div class="wrap content-columns"><section class="latest" aria-labelledby="latest-title"><div class="section-heading"><div><p class="eyebrow">LATEST ARTICLES</p><h2 id="latest-title">新着記事</h2></div><span>新しい記事から</span></div><div class="article-grid">${articles.map(article).join('')}</div><button class="load-more" type="button" disabled>さらに記事を見る <span aria-hidden="true">↓</span></button></section>${sidebar()}</div></section>`}
function guideSection(){return `<section class="guide-section"><div class="wrap"><div class="guide-heading"><div><p class="eyebrow">FAMILY OFFICE GUIDE</p><h2>ファミリーオフィスを知る</h2><p>人生・事業・資産をつなげて考える、その基本と役割をご紹介します。</p></div><a class="text-link" href="${url('guide')}">ガイド一覧を見る <span aria-hidden="true">→</span></a></div><div class="guide-grid">${guides.map((g,i)=>`<a class="guide-tile" href="${url('guide')}#guide-${i+1}"><div class="guide-image"><img src="assets/${g.img}" alt=""></div><div class="guide-info"><span class="guide-num">0${i+1}</span><h3>${g.title}</h3><span class="guide-arrow" aria-hidden="true">↗</span></div></a>`).join('')}</div></div></section>`}
function footer(){return `<footer class="site-footer"><div class="wrap"><div class="footer-top"><a class="brand" href="#top">${logo()}</a><nav class="footer-major" aria-label="フッターナビゲーション"><a href="#top">Media</a><a href="${url('guide')}">Guide</a><a href="#top" class="back-top" aria-label="ページ上部へ">↑</a></nav></div><div class="footer-bottom"><small>© K2 Family Office</small><nav aria-label="サイト情報"><a href="${url('company')}">会社概要・運営者情報</a><a href="${url('privacy')}">プライバシーポリシー</a><a href="${url('terms')}">利用規約</a><a href="${url('contact')}">一般お問い合わせ</a></nav></div></div></footer>`}
function select(k){if(!variants[k])k='A';const v=variants[k],s=document.querySelector('#artboard');s.className='site theme-'+k.toLowerCase();if(!s.children.length)s.innerHTML=hero()+`<main>${reading()}${guideSection()}</main>`+footer();document.querySelector('#variant-note').textContent=({A:'A：記事エリアも写真背景で統一したダークブラウン。',B:'B：記事エリアを温かいベージュで構成。',C:'C：アイボリー背景と横並びの記事で構成。'})[k];document.querySelectorAll('.variant-tabs [data-variant]').forEach(b=>{if(b.dataset.variant===k)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});document.body.dataset.variant=k;document.querySelector('#standalone-link').href='?v='+k+'&view=site';}
function setHeight(){document.documentElement.style.setProperty('--review-height',document.querySelector('.review-bar').getBoundingClientRect().height+'px')}
const params=new URLSearchParams(location.search);if(params.get('view')==='site')document.body.classList.add('site-only');select(params.get('v')||'A');setHeight();new ResizeObserver(setHeight).observe(document.querySelector('.review-bar'));
document.querySelectorAll('.variant-tabs [data-variant]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();select(b.dataset.variant);history.replaceState(null,'','?v='+b.dataset.variant)}));
let timer;document.querySelector('#artboard').addEventListener('click',e=>{const a=e.target.closest('a');if(!a||!a.getAttribute('href').startsWith('#preview-'))return;e.preventDefault();const n=document.querySelector('.preview-toast');n.textContent='今回はデザイン比較用のため、リンク先のページは表示しません。';clearTimeout(timer);timer=setTimeout(()=>n.textContent='',3000)});
