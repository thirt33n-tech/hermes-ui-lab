# Hermes UI Lab

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
