---
title: "포트폴리오 스킨 흡수 시작"
date: 2026-03-14 02:17:02 +0900
categories:
  - stelog
tags:
  - Build Log
  - Jekyll
cover: /assets/images/portfolio/cover.png
summary: "정적 portfolio 페이지를 Jekyll 블로그 메인으로 흡수하기 위해 구조를 다시 정리한 첫 번째 작업 기록입니다."
---

정적 `portfolio` 페이지를 그대로 유지하지 않고, Jekyll 기본 시스템을 최대한 활용하는 방향으로 홈 구조를 다시 정리하기로 했습니다.

![초기 참고 이미지]({{ '/assets/images/portfolio/cover.jpg' | relative_url }})

이번 정리에서는 `_works`와 `_posts`를 따로 두는 대신, 모든 문서를 `_posts` 하나로 모으고 `categories`로 `portfolio`와 `stelog`를 구분하는 쪽으로 방향을 잡았습니다.

## 이번에 바꾼 기준

- 문서 저장 위치는 `_posts` 하나로 통일
- 섹션 구분은 `categories`
- 섹션 내부 필터는 `tags`
- 시그니처 작품만 `featured: true`
- 포트폴리오 수동 정렬은 `order`

```yml
permalink: /:categories/:title/
```

## 왜 이 방향이 더 맞는가

이 방식이면 `site.posts`를 그대로 쓸 수 있고, Jekyll의 날짜 처리와 기본 정렬 흐름도 유지됩니다.  
블로그 쪽은 자연스럽게 최신순으로 쌓이고, 포트폴리오 쪽은 필요할 때 `order`로 수동 정렬을 추가할 수 있습니다.

## 메모

앞으로 이미지는 본문 안 원하는 위치에 직접 넣고, 필요하면 코드 블록이나 인용문도 같은 방식으로 섞어서 작성할 수 있습니다.

> 구조를 단순하게 만들면서도 Jekyll 기본 기능을 최대한 유지하는 것이 이번 정리의 핵심입니다.
