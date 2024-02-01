# 目的

AstroとSupabaseを使用したユーザー認証アプリケーションの動作検証である。

## app概要

create astro@latest -- --template basicsとSupabase Authで構築された認証プロジェクトです。

- 登録、ログイン、ログアウトの認証
- 認証はSupabaseのauthを使用
- フォームのバリデーションはzod
- 上記部分はUIフレームワークは使用せずjavascript
- ログイン後のダッシュボード画面
- ミドルウェアによる認証状態管理

## 開発環境

- astro 4.1.1
- svelte 4.2.8
- supabase 2.39.3
- zod 3.22.4

```text
/ ...プロジェクトルート
├── public ...画像ディレクトリ
├── src ...アプリケーションディレクトリ
│    │── components
│    │── layouts
│    │── lib
│    │── pages ...webルートディレクトリ
│    │     └─── api
│    └── middleware.ts
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## 注意点

- 前回のastro動作検証でViewTransitionsでの挙動がおかしいとしていたが、astroとViewTransitionsの両方の仕様でscriptタグ内が動かないという事が分かった。
- astroはscriptタグ内をデフォルトでis:globalのグローバルで呼んでしまう。
- ViewTransitionsは最初の読み込み時に全てのscriptタグ内を実行してしまう。
- これらの仕様によってイベントリスナーは最初の読み込み時に起動してしまい、イベント登録したページへ遷移した時には既に終わっている。だから動かない。
- ViewTransitionsでscriptタグ内を実行する場合はastroが用意しているイベントを登録する必要がある。
- いずれにせよastroではscriptタグを使用する場合は注意が必要。条件分岐などさせないと全てのページで適用されてしまいエラーの原因となる。コンポーネント内でis:inlineを適用しても良いと思う。
- UIフレームワークであれば上記問題は発生しないので、クライアント側で何か行う必要のある機能はUIフレームワークを使用した方が良いと思われる。
- コードフェンス内で読み込んだpropsやlocalsの値をscriptタグ内で使用する事はできない。

## 結論

- supabaseのauthに関しては以前nextで使った事があり、astroにおいてもリファレンスが用意されているので手順どおりに行えばよいだけであった。
- リファレンスがクッキーにトークンを格納しているので今回はクッキーに入れているが、astroのミドルウェアで認証管理する場合はクッキーに入れるしかない。
- 認証ということでmodeはserverのSSRで行い、ダッシュボード以外はオプトアウトしてSSGとしている。今後ディレクトリ単位でオプトアウトできる様になると嬉しい。
- 現状astroだけでリアクティブな状態管理はライブラリを待つしかないが、認証状態のチェックはミドルウェアで充分可能である。
- ただ、そこにDBの情報などが入ってくるとミドルウェアでは苦しいので、UIフレームワークとライブラリをいれて管理した方が良いと思われる。

[astroの動作検証はコチラ](https://github.com/k-gitest/astro-basic-ui-operation)