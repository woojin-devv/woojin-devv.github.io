---
title: React - SVGR 설치 
date: 2026-02-03 00:34:00 +0800
categories: [React]
tags: [React]
image: https://coursework.vschool.io/content/images/size/w2000/2017/08/react-banner.png
---

### 1. Vite project에서 SVGR 설치

```jsx
npm install -D vite-plugin-svgr
```

### 2. vite.config.ts 설정

```jsx
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
})
```

### 3. 타입 선언 추가 (TypeScript 사용 시)

```jsx
/// <reference types="vite-plugin-svgr/client" />
```

### 4. 사용 방법

1. Vite 방식

```jsx
import Icon from '@/assets/icon.svg?react';

<Icon />
```

- `?react` 를 붙여야 하는 이유
    - Vite는 기본적으로 SVG를 URL으로 처리함
    - 따라서 ?react를 붙여야 React Component로 변환됨
1. CRA(Create React App) 방식 

```jsx
import { ReactComponent as Icon } from './icon.svg';
```

| 구분 | CRA | Vite |
| --- | --- | --- |
| SVG React 변환 | 기본 내장 | 별도 plugin 필요 |
| import 방식 | `{ ReactComponent as Icon }` | `?react` |
| 설정 접근 | Webpack 숨김 | 설정 파일 명시적 |