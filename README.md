# Woojin Devlog

Gatsby 기반 기술 블로그입니다.

## Development

Node.js 20 또는 22를 사용합니다.

```bash
npm install
npm run start
```

프로덕션 빌드는 `npm run build`로 확인합니다.

## Content

글은 `contents/<slug>/index.md`에 저장합니다. 필수 front matter는 다음과 같습니다.

```yaml
---
title: "글 제목"
description: "글 설명"
date: 2026-06-21
slug: "/post-slug/"
tags: ["tag"]
heroImage: ./heroImage.png
heroImageAlt: "대표 이미지 설명"
---
```

외부 대표 이미지는 `heroImage` 대신 `heroImageUrl`을 사용합니다.

Giscus 댓글은 저장소 Actions 변수 또는 로컬 환경 변수 `GATSBY_GISCUS_REPO_ID`, `GATSBY_GISCUS_CATEGORY_ID`를 설정하면 활성화됩니다.
