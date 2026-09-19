---
title: "[Node.js] require부터 createServer().listen()까지"
description: "Node.js 내장 모듈을 불러와 HTTP 서버를 만들고, 반환값과 메서드 체이닝이 어떻게 동작하는지 정리합니다."
date: "2026-09-18T06:00:00.000Z"
slug: "/nodejs-basics-2/"
tags: ["nodejs", "javascript", "backend"]
series: "Node.js 기초"
seriesOrder: 2
heroImageUrl: "/assets/img/nodejs-thumbnail.png"
heroImageAlt: "Node.js 로고"
---

# require부터 createServer().listen()까지

1편에서는 Node.js가 무엇인지 살펴봤다. 이번에는 다음 코드를 한 줄씩 나누어 보면서 JavaScript 문법과 HTTP 서버가 만들어지는 과정을 알아보자.

```javascript
const http = require("http");
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end("OK");
});

server.listen(3000, () => {
  console.log("http://localhost:3000 에서 서버 실행 중");
});
```

## http 모듈 불러오기

```javascript
const http = require("http");
```

`require("http")`가 반환한 Node.js 내장 모듈을 `http`라는 상수에 저장한다. `require()`와 `import`를 포함한 모듈 시스템은 6편에서 자세히 살펴본다.

## HTTP 서버 만들기

`http.createServer()`는 HTTP 서버를 생성하고 `Server` 객체를 반환한다.

```javascript
const server = http.createServer((req, res) => {
  // 요청을 받을 때 실행할 코드
});
```

전달된 화살표 함수는 클라이언트의 요청이 들어올 때마다 실행되는 콜백 함수다.

- `req`에는 클라이언트가 보낸 요청 정보가 들어 있다.
- `res`는 클라이언트에게 응답을 보낼 때 사용한다.
- `res.setHeader()`는 응답 헤더를 설정한다.
- `res.end()`는 응답을 보내고 처리를 종료한다.

## listen으로 요청 기다리기

서버 객체의 `listen()` 메서드를 호출하면 지정한 포트에서 요청을 기다리기 시작한다.

```javascript
server.listen(3000, () => {
  console.log("server start");
});
```

기본 형태는 다음과 같다.

```javascript
server.listen(포트번호, 호스트, 실행할_콜백);
```

- 포트 번호: 서버가 요청을 받을 통로의 번호
- 호스트: 서버를 실행할 주소이며 생략할 수 있다.
- 콜백: 서버가 요청을 받을 준비를 마치면 실행된다.

포트 번호는 숫자로 작성하는 편이 의도가 더 명확하다.

```javascript
server.listen(3000);
```

## createServer().listen()과 메서드 체이닝

서버를 별도 상수에 저장하지 않고 다음과 같이 연결해서 작성할 수도 있다.

```javascript
http
  .createServer((req, res) => {
    res.end("OK");
  })
  .listen(3000, () => {
    console.log("server start");
  });
```

이처럼 앞 메서드의 반환값에서 다음 메서드를 연이어 호출하는 방식을 `메서드 체이닝(Method Chaining)`이라고 한다.

```javascript
http.createServer(callback).listen(3000);
```

동작 과정을 풀어서 작성하면 다음과 같다.

```javascript
const server = http.createServer(callback);

server.listen(3000);
```

핵심은 `.`이나 `()`가 연속으로 등장한다는 사실이 아니라 앞에서 호출한 메서드의 `반환값`이다.

1. `http.createServer(callback)`을 호출한다.
2. `createServer()`가 `Server` 객체를 반환한다.
3. 반환된 `Server` 객체에서 `listen()`을 호출한다.

즉, `createServer()`와 `listen()`은 같은 객체에서 호출되는 메서드가 아니다.

```text
http 객체
  └─ createServer() 호출
       └─ Server 객체 반환
            └─ listen() 호출
```

앞 메서드의 반환값에 다음 메서드가 존재하지 않으면 체이닝할 수 없다.

```javascript
const result = object.method1();

result.method2(); // result에 method2가 있어야 호출 가능
```

## 메서드 체이닝 직접 만들어 보기

객체의 메서드가 `this`를 반환하도록 만들면 같은 객체의 메서드를 계속 연결할 수 있다.

```javascript
const calculator = {
  value: 0,

  add(number) {
    this.value += number;
    return this;
  },

  multiply(number) {
    this.value *= number;
    return this;
  },
};

calculator.add(5).multiply(2);

console.log(calculator.value); // 10
```

`add()`와 `multiply()`가 현재 객체인 `this`를 반환하기 때문에 다음 메서드를 이어서 호출할 수 있다.

## 함수 호출이 이어지는 경우

다음 코드는 모양이 비슷하지만 전형적인 메서드 체이닝과는 다르다.

```javascript
function getFunction() {
  return function () {
    console.log("실행");
  };
}

getFunction()();
```

첫 번째 `getFunction()`이 함수를 반환하고, 뒤의 `()`가 반환된 함수를 즉시 호출한다. 이는 객체의 메서드를 `.`으로 이어서 호출하는 메서드 체이닝과 구분할 수 있다.

## 핵심 정리

- `require("http")`는 Node.js의 내장 HTTP 모듈을 불러온다.
- `http.createServer()`는 `Server` 객체를 반환한다.
- `listen()`은 반환된 `Server` 객체의 메서드다.
- 앞 메서드의 반환값에서 다음 메서드를 호출하는 방식을 메서드 체이닝이라고 한다.
- 체이닝 가능 여부는 앞 메서드가 무엇을 반환하는지에 따라 결정된다.
