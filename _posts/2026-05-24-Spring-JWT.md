---
title: "[Spring] JWT란? (세션과 비교)"
date: 2026-05-24
categories: [WEB]
image: https://img.youtube.com/vi/36lpDzQzVXs/maxresdefault.jpg
tags: [WEB, Spring, Security, JWT, Authentication]
layout: post
math: true
toc: true
---

## 1. JWT란?

JWT는 `JSON Web Token`의 약어로, JSON 형식의 정보를 안전하게 주고받기 위한 토큰이다.
웹 애플리케이션에서는 주로 로그인 이후 사용자를 식별하기 위한 인증 수단으로 사용된다.

서버는 사용자가 로그인에 성공하면 JWT를 발급하고, 클라이언트는 이후 요청마다 이 토큰을 함께 보낸다.
서버는 전달받은 토큰의 서명을 검증한 뒤, 해당 요청이 인증된 사용자의 요청인지 판단한다.

## 2. JWT를 편지에 비유하기

JWT는 편지에 비유하면 이해하기 쉽다.

- Header: 편지 봉투
- Payload: 편지의 내용
- Signature: 누가 작성했는지 확인할 수 있는 서명

편지 봉투에는 이 편지가 어떤 형식인지, 어떤 방식으로 서명되었는지가 적혀 있다.
편지 내용에는 전달하고 싶은 정보가 들어 있다.
마지막으로 서명은 이 편지가 중간에 조작되지 않았는지 확인하는 역할을 한다.

## 3. JWT의 구조

JWT는 `.`을 기준으로 세 부분으로 나뉜다.

```text
Header.Payload.Signature
```

각 부분은 Base64Url 방식으로 인코딩된다.
즉, JWT는 암호화된 값이 아니라 인코딩된 값이다.
따라서 Payload에 비밀번호나 주민번호 같은 민감한 정보를 넣으면 안 된다.

![JWT 구조](/assets/img/jwt/1.png)

## 4. Header

Header에는 토큰의 타입과 서명 알고리즘 정보가 들어간다.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- `alg`: 서명에 사용할 알고리즘
- `typ`: 토큰 타입

JWT는 서명 알고리즘을 하나로 강제하지 않는다.
따라서 어떤 알고리즘으로 서명했는지 Header에 명시해야 한다.
이것이 JWT에 Header가 필요한 이유다.

## 5. Payload

Payload에는 서버와 클라이언트가 주고받을 데이터가 들어간다.
Payload에 들어가는 각각의 값을 Claim이라고 한다.

```json
{
  "sub": "1",
  "name": "woojin",
  "role": "USER",
  "iat": 1716537600,
  "exp": 1716541200
}
```

Claim은 말 그대로 "주장"이라는 의미다.
Payload에 적혀 있는 정보는 누구나 디코딩해서 볼 수 있기 때문에, 그 내용을 곧이곧대로 믿으면 안 된다.
서버는 반드시 Signature를 검증한 뒤에 Payload의 내용을 신뢰해야 한다.

자주 사용되는 Claim은 다음과 같다.

| Claim | 의미 |
| --- | --- |
| `sub` | 토큰의 주체, 보통 사용자 ID |
| `iat` | 토큰 발급 시간 |
| `exp` | 토큰 만료 시간 |
| `iss` | 토큰 발급자 |
| `aud` | 토큰 대상자 |

## 6. Signature

Signature는 Header와 Payload가 변조되지 않았는지 검증하기 위한 값이다.

예를 들어 HMAC SHA256 방식을 사용하면 다음과 같은 흐름으로 서명을 만든다.

```text
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

클라이언트가 토큰을 서버로 보내면, 서버는 같은 방식으로 다시 서명을 계산한다.
그리고 토큰에 포함된 Signature와 서버가 계산한 Signature가 일치하는지 비교한다.

일치하면 토큰이 변조되지 않았다고 판단할 수 있고, 일치하지 않으면 잘못된 토큰으로 처리한다.

## 7. JWT는 어디에서 사용될까?

JWT는 다음과 같은 상황에서 사용할 수 있다.

1. Authentication
2. Information Exchange
3. Authorization
4. Single Sign-On
5. Server-to-server communication

이 중에서 가장 많이 사용되는 분야는 Authentication, 즉 인증이다.

## 8. Authentication 방식

웹 애플리케이션에서 인증 상태를 유지하는 대표적인 방식은 Cookie 기반 Session 방식과 JWT 방식이다.

### 8.1 Cookie-based Session Management

![alt text](/assets/img/jwt/2.png)

Cookie 기반 Session 방식은 서버가 인증 상태를 Session Table에 저장하고, 클라이언트는 Session ID를 Cookie로 보관하는 방식이다.

1. Client에서 사용자가 로그인을 시도한다.
2. Application Server는 로그인한 사용자에 대한 Session 정보를 저장한다.
3. Server는 생성된 Session ID를 응답으로 반환한다.
4. Client는 Session ID를 Cookie에 저장하고, 이후 요청마다 Cookie를 함께 보낸다.

이 방식은 서버가 세션 상태를 직접 관리하기 때문에 구현이 직관적이다.
하지만 다음과 같은 문제가 생길 수 있다.

- 사용자 정보를 얻기 위해 매 요청마다 Session ID를 기준으로 Session Table을 다시 조회해야 한다.
- 사용자가 여러 기기에서 로그인할수록 Session Table의 데이터가 증가한다.
- 서버가 여러 대로 늘어나면 세션 공유를 위해 별도 저장소나 Sticky Session 전략이 필요해질 수 있다.

### 8.2 JWT Authentication

![alt text](/assets/img/jwt/3.png)

JWT 방식은 서버가 세션 상태를 저장하지 않고, 인증에 필요한 정보를 토큰에 담아 클라이언트에게 전달하는 방식이다.
클라이언트는 이후 요청마다 JWT를 `Authorization` 헤더에 담아 보낸다.

서버는 토큰의 Signature와 만료 시간을 검증한 뒤, Payload에 담긴 Claim을 바탕으로 사용자를 식별한다.
이 방식은 서버가 세션을 저장하지 않아도 되기 때문에 Stateless 인증에 적합하다.

## 9. Spring에서 JWT를 사용하는 흐름

Spring Security 기반 애플리케이션에서 JWT 인증은 보통 다음 흐름으로 동작한다.

1. 사용자가 아이디와 비밀번호로 로그인 요청을 보낸다.
2. 서버는 사용자 정보를 확인한다.
3. 인증에 성공하면 Access Token을 발급한다.
4. 클라이언트는 이후 요청마다 `Authorization` 헤더에 토큰을 담아 보낸다.
5. 서버는 JWT 필터에서 토큰을 추출하고 검증한다.
6. 토큰이 유효하면 SecurityContext에 인증 정보를 저장한다.
7. Controller에서는 인증된 사용자로 요청을 처리한다.

```http
Authorization: Bearer <access-token>
```

JWT는 세션을 서버에 저장하지 않아도 되기 때문에 Stateless 인증 방식에 적합하다.
특히 SPA, 모바일 앱, MSA 구조에서 자주 사용된다.

## 10. JWT 사용 시 주의할 점

JWT는 편리하지만 몇 가지 주의할 점이 있다.

- Payload는 암호화가 아니라 인코딩이므로 민감 정보를 넣지 않는다.
- Access Token의 만료 시간을 너무 길게 잡지 않는다.
- 토큰 탈취에 대비해 Refresh Token 전략을 함께 고려한다.
- 서버는 반드시 Signature와 만료 시간을 검증해야 한다.
- 로그아웃과 강제 만료 처리가 필요한 경우 별도 저장소나 블랙리스트 전략이 필요할 수 있다.

## 11. 정리

JWT는 Header, Payload, Signature로 구성된 토큰이다.
Header는 서명 방식, Payload는 Claim, Signature는 변조 여부 검증을 담당한다.

Spring Security에서 JWT를 사용하면 서버가 세션을 저장하지 않아도 인증 상태를 처리할 수 있다.
다만 JWT는 한 번 발급되면 만료 전까지 유효하므로, 만료 시간과 Refresh Token, 토큰 폐기 전략을 함께 설계해야 한다.

## 🗒️ 참고자료 & 사이트 
- [jwt.io 사이트](https://www.jwt.io/)

### 참고영상 
<div>
{% include bookmark.html 
   url="https://www.youtube.com/watch?v=36lpDzQzVXs" 
   title="JWT | 생활코딩" 
   description="JWT vs. Session" 
   image="https://img.youtube.com/vi/36lpDzQzVXs/maxresdefault.jpg" %}
</div>