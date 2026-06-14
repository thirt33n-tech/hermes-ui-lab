# Hermes UI Lab

## CI 構成

```
push / pull_request (main)
│
├── test          Playwright E2E（Chromium・Firefox・WebKit）
│   ├── coverage  カバレッジレポート生成
│   └── artifacts playwright-report / test-results / coverage
│
├── bundle-size   npm run build:prod → npm run size（250 kB 超過で CI 失敗）
│
├── lighthouse    Lighthouse CI（パフォーマンス・アクセシビリティ計測）
│
└── analyze       CodeQL 静的解析（JavaScript/TypeScript）
                  ※ weekly schedule（毎週月曜 02:00 UTC）でも実行
```

## 品質監視

### Dependabot

毎週月曜日に npm パッケージと GitHub Actions の更新 PR を自動作成する（最大 5 件/エコシステム）。

- 対象: `npm` / `github-actions`
- スケジュール: 毎週月曜
- ターゲットブランチ: `main`

### CodeQL

GitHub 公式の静的解析ツール。JavaScript/TypeScript のセキュリティ脆弱性を検出する。

- トリガー: `push(main)` / `pull_request(main)` / 毎週月曜 02:00 UTC
- 結果は GitHub Security タブ → Code scanning alerts に表示される。

### Bundle Size

ビルド成果物 (`dist/assets/*.js`) のサイズを CI で自動計測する。

| 対象 | 上限 |
|---|---|
| `dist/assets/*.js` | 250 kB |

上限超過時は CI が失敗する。閾値変更は `package.json` の `bundlesize` 設定を編集する。

```bash
npm run size   # ローカルで計測（要 npm run build:prod）
```

---

## E2E Testing

| Script | Description |
|---|---|
| `npm run test:e2e` | Chromium + Firefox（ローカル開発） |
| `npm run test:e2e:webkit` | WebKit 単独実行 |
| `npm run coverage` | カバレッジレポート生成 |
| `npm run lighthouse` | Lighthouse CI（要 `npm run build:prod`） |
| `npm run docker:test` | Docker コンテナで E2E 実行 |

### 既知制限: WSL2 Arch Linux での WebKit

WSL2 Arch Linux 環境では、Playwright WebKit が依存システムライブラリ不足により起動できない場合がある。

**原因**: Playwright は Ubuntu 24.04 向けビルドを使用しており、ICU 74 (`libicudata.so.74`) および libjxl 0.8 (`libjxl.so.0.8`) が必要。Arch Linux は現時点でそれぞれ ICU 78・libjxl 0.11 を提供しており ABI 非互換。

**対処**: WebKit の正式検証環境は GitHub Actions (ubuntu-latest) とする。CI では `npx playwright install --with-deps` により Chromium・Firefox・WebKit 全ブラウザが正常動作する。

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
