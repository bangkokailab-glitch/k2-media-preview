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
 {cat:'ファミリーオフィス',title:'40代経営者にファミリーオフィスは必要か',img:'article-life.png',alt:'暮らしとこれからを考える静かな読書の空間'},
 {cat:'資産運用',title:'資産の全体像を整理するために、最初に考えたいこと',img:'library.png'},
 {cat:'コラム',title:'働く場所と暮らす場所を、自分の意思で選ぶ',img:'article-city.png'},
 {cat:'ファミリーオフィス',title:'事業と家族の未来を、ひとつの視点で考える',img:'office.png'}
];
const variants={
 A:{theme:'a',layout:'center',image:'hero-c.png',name:'A案｜夜の書斎・中央配置',description:'A案の写真背景を継承。夜景と書斎を大きく見せ、中央のコピーと控えめな枠線ボタンでガイドへ。'},
 B:{theme:'b',layout:'center',image:'guide-day-office.jpg',name:'B案｜海を望む仕事空間・中央配置',description:'B案のベージュの記事面から、海を望む仕事空間へ。中央のコピーとアイボリーのボタンで案内。'},
};
const url=p=>'#preview-'+p;
const catUrl=c=>url('category');
const logo=()=>'<img class="brand-logo" src="assets/k2-lp-logo.svg" alt="K2 Family Office"><span class="brand-media">MEDIA</span>';
function hero(){return '<div id="top"><iframe class="hero-frame" src="../?v=20261019-header" title="K2 Family Office 最新ファーストビュー" allow="autoplay"></iframe></div>'}
function categories(){return `<nav class="wrap categories" aria-label="記事カテゴリー"><span class="eyebrow">CATEGORY</span>${cats.map(c=>`<a href="${catUrl(c[0])}">${c[0]}</a>`).join('')}</nav>`}
function article(a,i){const link=url('article');return `<article class="article-card"><a class="article-image" href="${link}" tabindex="-1" aria-hidden="true"><img src="assets/${a.img}" alt="" loading="eager"></a><div class="article-info"><div class="article-meta"><a href="${catUrl(a.cat)}">${a.cat}</a><span class="date">YYYY.MM.DD</span></div><h3><a href="${link}">${a.title}</a></h3><a class="article-arrow" href="${link}" aria-label="${a.title}を読む">読む <span aria-hidden="true">→</span></a></div></article>`}
function reading(){return `<section class="reading-region"><div class="reading-photo" aria-hidden="true"></div>${categories()}<div class="wrap content-columns"><section class="latest" aria-labelledby="latest-title"><div class="section-heading"><div><p class="eyebrow">LATEST ARTICLES</p><h2 id="latest-title">新着記事</h2></div><span>新しい記事から</span></div><div class="article-grid">${articles.map(article).join('')}</div><nav class="pagination" aria-label="記事一覧のページ送り"><span aria-current="page">1</span><a href="${url('page-2')}" aria-label="2ページ目">2</a><a href="${url('page-3')}" aria-label="3ページ目">3</a><a class="next" href="${url('page-2')}">次へ <span aria-hidden="true">→</span></a></nav></section></div></section>`}
function guideSection(v){return `<section class="guide-banner layout-${v.layout}" id="guide-banner" aria-labelledby="guide-copy"><img class="guide-backdrop" src="assets/${v.image}" alt=""><div class="guide-veil"></div><div class="wrap guide-content"><div class="guide-message"><p class="eyebrow">FAMILY OFFICE GUIDE</p><h2 id="guide-copy"><span>最後に行き着くのは、</span><span>ファミリーオフィスという思想。</span></h2><a class="guide-cta" href="${url('guide-01')}"><span>ファミリーオフィスを知る</span><span class="cta-arrow" aria-hidden="true">→</span></a></div></div></section>`}
function footer(){return `<footer class="site-footer"><div class="wrap"><div class="footer-top"><a class="brand" href="#top">${logo()}</a><nav class="footer-major" aria-label="フッターナビゲーション"><a href="#top">Media</a><a href="${url('guide-01')}">Guide</a><a href="#top" class="back-top" aria-label="ページ上部へ">↑</a></nav></div><div class="footer-bottom"><small>© K2 Family Office</small><nav aria-label="サイト情報"><a href="${url('company')}">会社概要・運営者情報</a><a href="${url('privacy')}">プライバシーポリシー</a><a href="${url('terms')}">利用規約</a><a href="${url('contact')}">一般お問い合わせ</a></nav></div></div></footer>`}

function select(k){if(k==='A1'||k==='A2')k='A';if(k==='B1'||k==='B2')k='B';if(!variants[k])k='A';const v=variants[k],s=document.querySelector('#artboard');s.className='site theme-'+v.theme+' option-'+k.toLowerCase()+'1';if(!s.children.length)s.innerHTML=hero()+`<main>${reading()}${guideSection(v)}</main>`+footer();else document.querySelector('#guide-banner').outerHTML=guideSection(v);document.querySelector('#variant-note').textContent=v.description;document.querySelectorAll('.variant-tabs [data-variant]').forEach(b=>{if(b.dataset.variant===k)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});document.body.dataset.variant=k;document.querySelector('#standalone-link').href='?v='+k+'&view=site';document.title='K2 Family Office｜'+v.name;}
const params=new URLSearchParams(location.search);if(params.get('view')==='site')document.body.classList.add('site-only');select(params.get('v')||'A');
document.querySelectorAll('.variant-tabs [data-variant]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const old=document.querySelector('#guide-banner').getBoundingClientRect(),inBanner=old.top<innerHeight&&old.bottom>0;select(b.dataset.variant);history.replaceState(null,'','?v='+b.dataset.variant+(params.get('view')==='site'?'&view=site':'')+(inBanner?'#guide-banner':''));if(inBanner)document.querySelector('#guide-banner').scrollIntoView({behavior:'instant',block:'center'})}));
let timer;document.querySelector('#artboard').addEventListener('click',e=>{const a=e.target.closest('a');if(!a||!a.getAttribute('href').startsWith('#preview-'))return;e.preventDefault();const n=document.querySelector('.preview-toast');n.textContent=a.getAttribute('href')==='#preview-guide-01'?'ガイド01への入口です。今回はデザイン確認用です。':'今回はデザイン比較用のため、リンク先のページは表示しません。';clearTimeout(timer);timer=setTimeout(()=>n.textContent='',3000)});
