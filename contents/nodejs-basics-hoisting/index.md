---
title: "[JavaScript] 호이스팅과 TDZ 이해하기"
description: "JavaScript의 var, let, const, 함수 선언문이 호이스팅되는 방식과 TDZ를 실행 순서 관점에서 정리합니다."
date: "2026-09-18T05:30:00.000Z"
slug: "/nodejs-basics-hoisting/"
tags: ["javascript", "nodejs"]
series: "Node.js 기초"
seriesOrder: 3
heroImageUrl: "/assets/img/nodejs-thumbnail.png"
heroImageAlt: "Node.js 로고"
---

# 호이스팅과 TDZ 이해하기

JavaScript 코드를 읽다 보면 선언문보다 위에서 변수나 함수를 사용하는 코드를 만날 수 있다.

```javascript
sayHello();

function sayHello() {
  console.log("Hello");
}
```

함수가 아래에 선언되어 있는데도 호출할 수 있는 이유를 설명할 때 **호이스팅(Hoisting)**이라는 개념을 사용한다.

하지만 모든 선언이 같은 방식으로 호이스팅되는 것은 아니다. `var`, `let`, `const`, 함수 선언문과 함수 표현식은 초기화되는 시점이 서로 다르다.

## 호이스팅이란?

호이스팅은 JavaScript가 코드를 실행하기 전에 현재 스코프의 선언을 미리 등록하는 동작을 의미한다.

흔히 "선언문이 코드 위쪽으로 끌어올려진다"고 설명하지만 실제 코드가 물리적으로 이동하는 것은 아니다. JavaScript 엔진이 코드를 실행하기 전에 변수와 함수의 바인딩을 먼저 준비한다고 이해하는 편이 정확하다.

```javascript
console.log(message);

var message = "Hello";
```

위 코드를 개념적으로 표현하면 다음과 비슷하다.

```javascript
var message;

console.log(message);

message = "Hello";
```

실제 JavaScript 엔진이 코드를 이렇게 다시 작성하는 것은 아니다. 선언과 초기화 시점을 이해하기 위한 표현이다.

## 선언, 초기화, 할당

호이스팅을 이해하려면 세 단계를 구분해야 한다.

| 단계 | 의미 |
| --- | --- |
| 선언 | 현재 스코프에 변수 이름을 등록한다. |
| 초기화 | 변수에 접근할 수 있는 상태로 만들고 초기값을 부여한다. |
| 할당 | 개발자가 작성한 값을 변수에 저장한다. |

```javascript
let name;       // 선언과 초기화
name = "우진"; // 할당
```

선언과 할당을 한 줄로 작성할 수도 있다.

```javascript
let name = "우진";
```

변수 선언 방식에 따라 선언과 초기화가 이루어지는 시점이 달라진다.

## var의 호이스팅

`var`로 선언한 변수는 선언과 동시에 `undefined`로 초기화된다. 따라서 선언문보다 위에서 접근해도 오류가 발생하지 않는다.

```javascript
console.log(name); // undefined

var name = "우진";

console.log(name); // "우진"
```

오류가 발생하지 않는다고 해서 권장되는 코드는 아니다. 값이 준비되기 전에 접근해 의도하지 않은 `undefined`를 사용할 수 있기 때문이다.

```javascript
console.log(count + 1); // NaN

var count = 10;
```

## let과 const의 호이스팅

`let`과 `const`로 선언한 변수도 현재 스코프에 미리 등록된다. 즉, 호이스팅 자체는 발생한다.

하지만 선언문이 실행되기 전에는 초기화되지 않으므로 접근할 수 없다.

```javascript
console.log(name);

const name = "우진";
```

결과:

```text
ReferenceError: Cannot access 'name' before initialization
```

따라서 "`let`과 `const`는 호이스팅되지 않는다"는 설명은 정확하지 않다.

> `let`과 `const`도 호이스팅되지만 선언문이 실행되기 전에는 접근할 수 없다.

## TDZ

스코프가 시작된 지점부터 `let` 또는 `const` 선언문이 실행되기 전까지의 구간을 **TDZ(Temporal Dead Zone)**라고 한다.

```javascript
{
  // name의 TDZ 시작

  console.log(name); // ReferenceError

  const name = "우진"; // TDZ 종료

  console.log(name); // "우진"
}
```

TDZ는 초기화되지 않은 변수를 실수로 사용하는 문제를 빠르게 발견하게 해준다.

`const`는 선언할 때 값을 반드시 할당해야 한다.

```javascript
const name; // SyntaxError
```

`let`은 값을 생략할 수 있으며 선언문이 실행되면 `undefined`로 초기화된다.

```javascript
let name;

console.log(name); // undefined
```

## 함수 선언문의 호이스팅

함수 선언문은 함수 이름뿐 아니라 함수 본문까지 초기화된다. 따라서 선언문보다 위에서 호출할 수 있다.

```javascript
sayHello(); // "Hello"

function sayHello() {
  console.log("Hello");
}
```

이런 특성 때문에 여러 함수 선언문을 파일 아래쪽에 배치하고 파일 위쪽에서 주요 실행 흐름을 보여주는 코드도 작성할 수 있다.

```javascript
startServer();

function startServer() {
  console.log("서버 시작");
}
```

## 함수 표현식과 화살표 함수

함수 표현식이나 화살표 함수는 함수가 변수에 할당되는 형태다.

```javascript
const sayHello = () => {
  console.log("Hello");
};
```

이 경우에는 함수 선언문의 규칙이 아니라 `const` 변수의 규칙을 따른다.

```javascript
sayHello(); // ReferenceError

const sayHello = () => {
  console.log("Hello");
};
```

다음 함수 표현식도 마찬가지다.

```javascript
sayHello(); // ReferenceError

const sayHello = function () {
  console.log("Hello");
};
```

함수 선언문과 화살표 함수의 차이를 정리하면 다음과 같다.

| 작성 방식 | 선언 전에 호출 | 이유 |
| --- | --- | --- |
| `function sayHello() {}` | 가능 | 함수 전체가 초기화된다. |
| `const sayHello = () => {}` | 불가능 | `const`가 TDZ에 있다. |
| `let sayHello = function () {}` | 불가능 | `let`이 TDZ에 있다. |
| `var sayHello = () => {}` | 불가능 | 변수는 `undefined`로 초기화되어 함수가 아니다. |

`var` 함수 표현식을 선언 전에 호출하면 `ReferenceError`가 아니라 `TypeError`가 발생한다.

```javascript
sayHello(); // TypeError: sayHello is not a function

var sayHello = () => {
  console.log("Hello");
};
```

호출 시점의 `sayHello` 값이 `undefined`이기 때문이다.

## 서버 코드가 동작하는 이유

다음 Node.js 코드를 살펴보자.

```javascript
const http = require("http");

http
  .createServer((req, res) => {
    if (req.url in urlMap) {
      urlMap[req.url](req, res);
    }
  })
  .listen(3000);

const user = (req, res) => {
  res.end("USER");
};

const urlMap = {
  "/user": user,
};
```

`createServer()` 콜백 안에서 선언문보다 아래에 있는 `urlMap`을 사용하지만 이 코드는 정상적으로 동작한다.

그 이유는 `urlMap`을 선언 전에 읽은 것이 아니기 때문이다. `createServer()`를 호출할 때는 콜백 함수만 등록되고 콜백의 본문은 아직 실행되지 않는다.

실행 순서는 다음과 같다.

```text
1. createServer()에 요청 처리 콜백 등록
2. listen()으로 요청 대기 시작
3. user 함수 초기화
4. urlMap 객체 초기화
5. 현재 JavaScript 실행 종료
6. 나중에 HTTP 요청이 들어오면 콜백 실행
7. 초기화가 끝난 urlMap에 접근
```

따라서 이 코드는 호이스팅만으로 동작하는 것이 아니다. 콜백이 나중에 실행되고, 그때 주변 스코프의 `urlMap`에 접근할 수 있기 때문에 동작한다.

## 콜백과 클로저

함수는 선언된 위치의 주변 변수에 접근할 수 있다.

```javascript
const printMap = () => {
  console.log(urlMap);
};

const urlMap = {
  "/": "HOME",
};

printMap();
```

`printMap`을 만드는 시점에는 `urlMap`이 초기화되지 않았지만, 함수 본문도 실행되지 않는다. `printMap()`을 호출하는 시점에는 초기화가 끝났기 때문에 정상적으로 접근할 수 있다.

이처럼 함수가 자신이 선언된 렉시컬 환경의 변수에 접근하는 특성을 **클로저(Closure)**라고 한다.

반대로 함수를 즉시 호출하면 오류가 발생한다.

```javascript
const printMap = () => {
  console.log(urlMap);
};

printMap(); // ReferenceError

const urlMap = {
  "/": "HOME",
};
```

중요한 것은 함수가 선언된 위치보다 실제로 실행되는 시점이다.

## urlMap을 아래에 선언한 이유

`urlMap` 객체를 만들 때는 `user`와 `feed`의 값을 즉시 읽는다.

```javascript
const user = (req, res) => {
  res.end("USER");
};

const feed = (req, res) => {
  res.end("FEED");
};

const urlMap = {
  "/user": user,
  "/feed": feed,
};
```

따라서 `urlMap`을 화살표 함수보다 위에 작성하면 오류가 발생한다.

```javascript
const urlMap = {
  "/user": user, // ReferenceError
};

const user = (req, res) => {
  res.end("USER");
};
```

`urlMap` 객체를 생성하는 순간 `user`는 아직 TDZ에 있기 때문이다.

함수 선언문으로 변경하면 선언보다 위에서도 사용할 수 있다.

```javascript
const urlMap = {
  "/user": user,
};

function user(req, res) {
  res.end("USER");
}
```

함수 선언문은 함수 전체가 미리 초기화되므로 위 코드가 정상적으로 동작한다.

## 클래스의 호이스팅

클래스 선언도 현재 스코프에 미리 등록되지만 선언문이 실행되기 전에는 접근할 수 없다.

```javascript
const user = new User(); // ReferenceError

class User {}
```

즉, 클래스도 `let`과 `const`처럼 TDZ의 영향을 받는다.

## 안전하게 코드를 작성하는 방법

호이스팅에 의존하면 코드의 실행 순서를 파악하기 어려워질 수 있다.

- 변수는 사용하기 전에 선언한다.
- `var`보다 `let`과 `const`를 사용한다.
- 기본적으로 `const`를 사용하고 재할당이 필요할 때만 `let`을 사용한다.
- 함수 선언문과 함수 표현식의 호이스팅 차이를 알고 선택한다.
- 비동기 콜백에서는 함수가 등록되는 시점과 실행되는 시점을 구분한다.

## 핵심 정리

- 호이스팅은 코드를 실행하기 전에 선언을 현재 스코프에 등록하는 동작이다.
- 실제 선언문이 코드 위쪽으로 이동하는 것은 아니다.
- `var`는 `undefined`로 초기화되어 선언 전에 접근할 수 있다.
- `let`과 `const`도 호이스팅되지만 초기화 전에는 TDZ에 있어 접근할 수 없다.
- 함수 선언문은 함수 전체가 초기화되므로 선언 전에 호출할 수 있다.
- 화살표 함수와 함수 표현식은 할당된 변수의 호이스팅 규칙을 따른다.
- `createServer()` 콜백에서 아래에 선언된 `urlMap`을 사용할 수 있는 이유는 콜백이 나중에 실행되기 때문이다.
- `urlMap` 객체는 생성 시 `user`, `feed`를 즉시 읽으므로 해당 함수들이 먼저 초기화되어야 한다.
