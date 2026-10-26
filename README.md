# K2 Family Office メディア テストサイト

公開する入口は次の3つです（記事確認用は2026-10-27のご依頼で追加）。

- クライアント確認用: https://bangkokailab-glitch.github.io/k2-media-preview/media-review-responsive-20261023/?rev=e89b8c7
  - 2026-10-26送信メールのトップページ。全リンクを無効化し、下層ページは公開しません。
  - index.html と assets は今回の整理前の状態を保持しています。
- 記事詳細・確認専用: https://bangkokailab-glitch.github.io/k2-media-preview/article-preview/
  - 承認済み記事1ページのみ。全リンク無効。開発用とは独立したHTML・素材で保存。
- 開発用: https://bangkokailab-glitch.github.io/k2-media-preview/development/
  - 最新トップから記事、カテゴリー、全記事、タグ、検索、会社情報、規約、問い合わせ表示を接続。
  - 開発用ページ一覧: development/review/
  - 承認済み記事: development/articles/business-owner-own-shares/

ガイド01〜03、FAQ、プロフィール、サービスLP、ログインは未実装・未接続です。準備中表示を使用し、未確定の外部URLへは接続しません。記事には配置確認用の仮原稿が含まれます。問い合わせは表示確認のみで送信しません。

旧確認版・旧デザイン比較版は公開から削除しました。復元用資料はGit履歴および作業フォルダーの output/media-build/20261026-site-consolidation/retired-tests.tar.gz に保存しています。

開発サイト生成: `node development/build.mjs`。クライアント確認用はこのビルドの対象外です。
