---
title: "[Node.js] HTTP 요청과 라우팅 이해하기"
description: "Node.js HTTP 서버에서 URL, 쿼리스트링, JSON body를 구분하고 라우팅하는 방법을 정리합니다."
date: "2026-09-18T01:00:00.000Z"
slug: "/nodejs-basics-7/"
tags: ["nodejs", "javascript", "backend"]
series: "Node.js 기초"
seriesOrder: 7
heroImageUrl: "/assets/img/nodejs-thumbnail.png"
heroImageAlt: "Node.js 로고"
---

# HTTP 요청과 라우팅 이해하기

앞에서는 `http.createServer()`가 반환한 서버 객체에서 `listen()`을 호출하는 과정을 살펴봤다. 이번에는 서버가 받은 요청에서 경로, 쿼리스트링, body를 읽고 응답하는 방법을 알아보자.

## request와 response

`http.createServer()`에 전달한 콜백은 요청이 들어올 때마다 실행된다.

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.method);
  console.log(req.url);

  res.end("OK");
});

server.listen(3000);
```

- `req`는 클라이언트가 보낸 요청 정보를 가진 객체다.
- `res`는 클라이언트에게 응답을 보낼 때 사용하는 객체다.
- `req.method`에는 `GET`, `POST` 같은 HTTP 메서드가 들어 있다.
- `req.url`에는 요청 경로와 쿼리스트링이 들어 있다.

다음 주소로 요청하면:

```text
http://localhost:3000/api/users?page=2
```

서버에서는 다음 값을 확인할 수 있다.

```javascript
req.method; // "GET"
req.url;    // "/api/users?page=2"
```

## url 모듈의 parse 메서드

기존 Node.js 코드에서는 URL을 분석하기 위해 `url` 모듈의 `parse()` 메서드를 사용하기도 한다.

```javascript
const url = require("url");

const parsedUrl = url.parse(req.url, true);
```

`require("url")`이 반환한 모듈 객체를 `url`이라는 상수에 저장한 것이다. `parse()`는 JavaScript의 전역 함수가 아니라 이 `url` 객체가 제공하는 메서드다.

```javascript
console.log(typeof url);       // "object"
console.log(typeof url.parse); // "function"
```

개념적으로 단순화하면 다음과 같은 구조다.

```javascript
const url = {
  parse(urlString, parseQueryString) {
    // URL을 분석하는 로직
  },
};
```

### 두 번째 인자인 true

```javascript
url.parse(req.url, true);
```

두 번째 인자인 `true`는 URL의 `?` 뒤에 있는 쿼리스트링을 객체로 변환할 것인지 나타낸다.

```javascript
const parsedUrl = url.parse(
  "/api/users?keyword=node&page=2",
  true,
);

console.log(parsedUrl.query);
```

결과:

```javascript
{
  keyword: "node",
  page: "2",
}
```

`true`를 생략하거나 `false`를 전달하면 `query`는 문자열로 남는다.

```javascript
const parsedUrl = url.parse(
  "/api/users?keyword=node&page=2",
  false,
);

console.log(parsedUrl.query);
// "keyword=node&page=2"
```

여기서 `true`와 `false`는 request body를 JSON으로 변환할지 결정하는 값이 아니다. 오직 쿼리스트링을 객체로 분석할지 결정한다.

또한 아래 표현에서 `.query`는 메서드 호출이 아니라 반환된 객체의 프로퍼티에 접근하는 문법이다.

```javascript
const query = url.parse(req.url, true).query;
```

풀어서 작성하면 다음과 같다.

```javascript
const parsedUrl = url.parse(req.url, true);
const query = parsedUrl.query;
```

## URL 클래스로 요청 주소 분석하기

`url.parse()`는 레거시 API다. 새로운 코드에서는 WHATWG 표준을 따르는 `URL` 클래스를 사용하는 편이 좋다.

```javascript
const requestUrl = new URL(req.url, "http://localhost");

console.log(requestUrl.pathname);                // "/api/users"
console.log(requestUrl.searchParams.get("page")); // "2"
```

`req.url`은 `/api/users?page=2`와 같은 상대 주소이므로 `new URL()`에 기준 주소를 함께 전달해야 한다.

```javascript
new URL(req.url, "http://localhost");
```

여기서 기준 주소는 URL을 분석하기 위해 필요한 값이다. 실제 서버 포트를 열거나 새로운 요청을 보내는 것은 아니다.

## 쿼리스트링과 request body의 차이

HTTP 요청에는 경로, 쿼리스트링, 헤더, body 등이 각각 별도로 존재한다.

| 구분 | 예시 | Node.js에서 확인하는 방법 |
| --- | --- | --- |
| HTTP 메서드 | `GET`, `POST` | `req.method` |
| 경로 | `/api/users` | `requestUrl.pathname` |
| 쿼리스트링 | `?page=2` | `requestUrl.searchParams` |
| 헤더 | `Content-Type: application/json` | `req.headers` |
| 요청 본문 | `{"name":"woojin"}` | `req`의 `data`, `end` 이벤트 |

예를 들어 다음 요청에는 쿼리스트링과 JSON body가 모두 들어 있다.

```http
POST /api/users?notify=true
Content-Type: application/json

{
  "name": "woojin",
  "age": 20
}
```

- `notify=true`는 쿼리스트링이다.
- `name`과 `age`는 request body에 담긴 데이터다.
- 쿼리스트링 분석 여부와 JSON body 분석 여부는 서로 관계가 없다.

일반적으로 쿼리스트링은 조회 조건에 사용한다.

```text
GET /api/users?page=2&sort=name
GET /api/products?category=book
GET /api/search?keyword=node
```

request body는 생성하거나 수정할 데이터를 전달할 때 주로 사용한다.

```http
POST /api/users
Content-Type: application/json

{
  "name": "woojin",
  "email": "woojin@example.com"
}
```

## JSON request body 읽기

Node.js의 기본 `http` 모듈은 JSON body를 자동으로 객체로 변환하지 않는다. `data` 이벤트로 조각을 모은 다음 `end` 이벤트에서 `JSON.parse()`를 호출해야 한다.

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, "http://localhost");

  if (req.method === "POST" && requestUrl.pathname === "/api/users") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const user = JSON.parse(body);

      console.log(user.name);

      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ message: "사용자 생성 완료" }));
    });

    return;
  }

  res.statusCode = 404;
  res.end("Not Found");
});

server.listen(3000);
```

이 코드에는 이름이 같은 두 종류의 `parse()`가 등장할 수 있다.

```javascript
url.parse(req.url, true); // URL 문자열 분석
JSON.parse(body);         // JSON 문자열 분석
```

두 메서드는 이름만 같을 뿐 서로 다른 객체가 제공하는 별개의 기능이다.

## 기본 라우팅

라우팅은 요청의 HTTP 메서드와 경로를 확인해 실행할 코드를 결정하는 과정이다.

```javascript
const requestUrl = new URL(req.url, "http://localhost");

if (req.method === "GET" && requestUrl.pathname === "/api/users") {
  // 사용자 목록 조회
}
```

경로가 같아도 HTTP 메서드에 따라 다른 작업을 수행할 수 있다.

```text
GET    /api/users       사용자 목록 조회
GET    /api/users/1     1번 사용자 조회
POST   /api/users       사용자 생성
PATCH  /api/users/1     1번 사용자 일부 수정
DELETE /api/users/1     1번 사용자 삭제
```

`/api/user`라고 작성해도 동작하지만, REST API에서는 여러 사용자라는 자원 집합을 나타내기 위해 `/api/users`처럼 복수형을 많이 사용한다. 이는 문법적인 강제 사항이 아니라 프로젝트에서 일관되게 정할 URL 설계 규칙이다.

## Node.js와 MPA

Node.js는 서버에서 JavaScript를 실행하는 환경이므로 JSON을 반환하는 API 서버뿐 아니라 완성된 HTML을 반환하는 MPA도 만들 수 있다.

API 서버는 보통 데이터를 JSON으로 반환한다.

```javascript
res.setHeader("Content-Type", "application/json");
res.end(JSON.stringify({ name: "woojin" }));
```

MPA 서버는 경로마다 서로 다른 HTML을 반환한다.

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, "http://localhost");

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (requestUrl.pathname === "/") {
    res.end(`
      <h1>홈 페이지</h1>
      <a href="/users">사용자 목록</a>
    `);
    return;
  }

  if (requestUrl.pathname === "/users") {
    res.end(`
      <h1>사용자 목록</h1>
      <ul>
        <li>우진</li>
        <li>철수</li>
      </ul>
    `);
    return;
  }

  res.statusCode = 404;
  res.end("<h1>404 Not Found</h1>");
});

server.listen(3000);
```

`/`에서 `/users`로 이동할 때 브라우저가 서버에 새로운 HTML 문서를 요청하므로 전형적인 MPA 방식이다.

Java의 Spring MVC와 Thymeleaf를 사용했던 구조는 Node.js에서 Express와 EJS, Pug, Handlebars 같은 템플릿 엔진을 이용해 비슷하게 구현할 수 있다.

```text
Spring MVC + Thymeleaf
          ↕
Express + EJS
```

## Express를 사용하는 이유

기본 `http` 모듈만 사용하면 라우팅 분기, body 수집, JSON 변환, 오류 처리를 직접 구현해야 한다. Express는 이 과정을 더 간단하게 만들어 준다.

```javascript
const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "woojin" }]);
});

app.post("/api/users", (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: "사용자 생성 완료" });
});

app.listen(3000);
```

`express.json()`이 JSON body를 분석해 `req.body`에 저장하고, `app.get()`과 `app.post()`가 메서드와 경로에 따른 라우팅을 담당한다.

## 핵심 정리

- `req.method`에는 HTTP 메서드가 들어 있다.
- `req.url`에는 요청 경로와 쿼리스트링이 들어 있다.
- `url.parse(req.url, true)`의 `true`는 쿼리스트링을 객체로 변환하라는 의미다.
- `true`와 `false`는 JSON request body 처리 여부와 관계없다.
- 새 코드에서는 레거시 `url.parse()`보다 `URL` 클래스 사용을 권장한다.
- 라우팅은 HTTP 메서드와 경로를 함께 확인해 처리할 기능을 결정한다.
- Node.js에서는 API 서버와 MPA를 모두 만들 수 있다.
