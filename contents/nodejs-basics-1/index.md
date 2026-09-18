---
title: "Node.js란 무엇인가?"
description: "Node.js의 정의와 특징, 브라우저 JavaScript와의 차이를 정리합니다."
date: "2026-09-18T07:00:00.000Z"
slug: "/nodejs-basics-1/"
tags: ["nodejs", "javascript", "backend"]
series: "Node.js 기초"
seriesOrder: 1
heroImageUrl: "/assets/img/nodejs-thumbnail.png"
heroImageAlt: "Node.js 로고"
---

# Node.js란 무엇인가?

> Node.js는 브라우저 밖에서도 JavaScript를 실행할 수 있게 해주는 JavaScript 런타임이다.

## JavaScript 런타임

JavaScript 자체에는 파일 시스템이나 네트워크 통신 기능이 없다. Node.js는 JavaScript 엔진인 V8과 비동기 I/O를 담당하는 libuv 등을 결합해 서버 프로그램을 만들 수 있는 실행 환경을 제공한다.

## V8 엔진

Node.js는 V8 엔진을 사용해 JavaScript 코드를 실행한다. V8은 C++로 작성된 오픈소스 JavaScript 엔진이다.

- 엔진은 사용자가 작성한 코드를 해석하고 실행하는 프로그램이다.
- V8은 파서, 인터프리터, 컴파일러, 가비지 컬렉터, Call Stack, Heap 등으로 구성된다.
- Ignition은 바이트 코드를 실행하는 인터프리터 역할을 한다.
- TurboFan은 자주 실행되는 코드를 최적화하는 컴파일러 역할을 한다.
- 실행 중 코드를 최적화하는 방식을 JIT(Just-In-Time) 컴파일이라고 한다.

### libuv

libuv는 Node.js가 파일, 네트워크, 소켓 등의 비동기 I/O를 처리하도록 돕는 C 라이브러리다. 운영체제의 비동기 기능과 내부 Thread Pool을 이용하고, 작업이 끝나면 그 결과를 이벤트 루프에 전달한다.

## 이벤트 기반 아키텍처

![Node.js event driven architecture](/assets/img/nodejs-event-driven-architecture.png)

Node.js의 JavaScript 코드는 기본적으로 하나의 메인 스레드에서 실행된다. (언어자체가 싱글 스레드라서) 하지만 I/O 작업이 끝날 때까지 메인 스레드가 그대로 기다리는 것은 아니다.

1. 메인 스레드가 HTTP 요청을 받는다.
2. 데이터베이스, 파일 또는 네트워크 작업을 실행 환경에 위임한다.
3. 이벤트 루프는 기다리지 않고 다른 요청을 처리한다.
4. 작업이 완료되면 등록해 둔 콜백이 실행된다.

```javascript
app.get('/users', async (request, response) => {
  const users = await database.findUsers()
  response.json(users)
})
```

`await`가 있더라도 메인 스레드가 데이터베이스 응답을 붙잡고 기다리는 것은 아니다. 결과가 도착할 때까지 이벤트 루프는 다른 요청의 JavaScript를 실행할 수 있다.

![Node.js 비동기 요청 처리 예시](/assets/img/nodejs-async-request-flow.png)

## Java와 Node.js의 요청 처리 방식

Java가 멀티스레드이고 JavaScript가 싱글스레드라는 설명만으로 두 서버를 구분하면 정확하지 않다. 중요한 차이는 언어보다 서버가 동시성을 처리하는 방식에 있다.

전통적인 Spring MVC 서버는 여러 요청을 Thread Pool의 서로 다른 스레드에서 처리하는 Blocking I/O 모델을 주로 사용한다.

```text
요청 A → Thread 1
요청 B → Thread 2
요청 C → Thread 3
```

Node.js는 하나의 JavaScript 메인 스레드와 이벤트 루프를 중심으로 여러 I/O 요청을 번갈아 처리한다. 또한 Java에서도 Spring WebFlux나 Netty를 사용하면 이벤트 루프 기반의 Non-blocking 서버를 만들 수 있다.

| 환경           | 대표적인 처리 모델                |
| -------------- | --------------------------------- |
| Node.js        | 이벤트 루프 기반 Non-blocking I/O |
| Spring MVC     | Thread Pool 기반 Blocking I/O     |
| Spring WebFlux | 이벤트 루프 기반 Non-blocking I/O |

## 싱글 스레드가 서버 지연을 막아줄까?

Node.js는 I/O 대기 때문에 서버 전체가 멈추는 상황을 효과적으로 줄일 수 있다. 따라서 데이터베이스 조회나 외부 API 호출이 많은 I/O 중심 서버에서 많은 연결을 효율적으로 처리할 수 있다.

하지만 싱글 스레드 자체가 서버 지연을 막아주는 것은 아니다. 무거운 JavaScript 연산이나 동기 API가 메인 스레드를 점유하면 이벤트 루프도 함께 멈춘다.

```javascript
app.get('/calculate', (request, response) => {
  let result = 0

  for (let i = 0; i < 10_000_000_000; i++) {
    result += i
  }

  response.json({ result })
})
```

위 계산이 끝날 때까지 다른 HTTP 요청과 완료된 I/O 콜백의 실행도 지연된다.

```text
요청 A → 무거운 계산 시작 ━━━━━━━━━ 계산 종료 → 응답
요청 B → 대기 ─────────────────────→ 처리
요청 C → 대기 ─────────────────────→ 처리
```

파일을 읽을 때도 `readFileSync()`와 같은 동기 API 대신 비동기 API를 사용하는 것이 좋다.

```javascript
const data = await fs.promises.readFile('large-file.txt')
```

CPU 연산이 무거운 작업은 Worker Thread, 별도의 Node.js 프로세스 또는 작업 큐를 이용해 메인 스레드에서 분리해야 한다.

## 브라우저 JavaScript와의 차이

브라우저와 Node.js는 모두 V8과 같은 JavaScript 엔진으로 코드를 실행할 수 있지만 제공하는 실행 환경이 다르다.

- 브라우저는 DOM, `window`, 사용자 이벤트와 같은 Web API를 제공한다.
- Node.js는 파일 시스템, 프로세스, 서버 네트워크 기능 등을 제공한다.
- Node.js에는 기본적으로 DOM과 `window`가 없다.

## require()와 모듈

모듈은 특정 기능을 재사용할 수 있도록 분리한 코드 단위다.

```javascript
const http = require('node:http')
```

- `require()`는 모듈이 `module.exports`로 공개한 값을 반환한다.
- `http`에는 내장 HTTP 모듈 객체 전체가 복사되는 것이 아니라 그 객체를 가리키는 참조가 저장된다.
- 같은 모듈을 다시 불러오면 일반적으로 캐시된 객체를 반환한다.
- `http.createServer()`는 모듈의 메서드이고, `response.end()`는 요청마다 전달되는 응답 객체의 메서드다.
- `const`는 `http`에 다른 값을 다시 대입하지 못하게 할 뿐, 새로운 모듈 객체를 만드는 문법은 아니다.

## Node.js가 적합한 작업

- REST API 서버
- 채팅과 실시간 알림 서버
- 데이터베이스 조회가 많은 서비스
- 외부 API 호출이 많은 서비스
- 다수의 동시 연결을 유지하는 서비스

반대로 이미지 처리, 대규모 계산, 복잡한 암호화처럼 CPU 사용량이 큰 작업은 메인 스레드에서 직접 처리하지 않도록 주의해야 한다.

## 핵심 정리

- Node.js의 JavaScript는 기본적으로 하나의 메인 스레드에서 실행된다. 
- I/O 작업은 운영체제의 비동기 기능이나 libuv Thread Pool에 위임한다.
- 이벤트 루프는 I/O 대기 중에도 다른 요청을 계속 처리할 수 있다.
- CPU 연산과 동기 코드는 메인 스레드를 막아 전체 요청을 지연시킬 수 있다.
- Node.js의 장점은 단순한 싱글 스레드가 아니라 이벤트 기반 Non-blocking I/O 모델에서 나온다.
