---
title: "[개발자 필수 개념] JSON, XML, HTML의 차이와 데이터 교환 형식"
description: "JSON과 XML의 구조, 직렬화와 역직렬화, HTML의 표준 요소와 XML 사용자 정의 요소의 차이, 각 형식의 활용 사례를 정리합니다."
date: 2026-09-21
slug: "/data-exchange-formats/"
tags: ["Web", "JSON", "XML", "HTML"]
series: "개발자 필수 개념"
seriesOrder: 1
heroImageAlt: "JSON XML HTML 데이터 교환 형식 비교"
---

# JSON, XML, HTML의 차이와 데이터 교환 형식

웹 애플리케이션에서는 클라이언트와 서버, 서로 다른 서버, 프로그램과 파일 사이에서 데이터를 주고받는다.

이때 데이터를 어떤 규칙으로 표현할지 정한 것이 <strong>데이터 형식(Data Format)</strong>이다. 대표적인 형식으로 JSON과 XML이 있으며, HTML도 태그를 사용한다는 점에서 XML과 자주 비교된다.

세 형식은 겉으로 비슷해 보이지만 목적이 다르다.

> 이 글은 인프런의 <strong>큰돌님의 CS 지식 강의</strong>를 학습한 뒤, 관련 개념을 추가로 확인하고 예제와 활용 사례를 더해 재구성한 내용입니다.

- <strong>JSON</strong>: 구조화된 데이터를 가볍게 표현하고 교환한다.
- <strong>XML</strong>: 사용자가 정의한 요소로 데이터와 문서 구조를 표현한다.
- <strong>HTML</strong>: 웹 브라우저에 문서의 구조와 의미를 전달한다.

## 마크업이란?

마크업(Markup)은 태그 등의 표식을 사용해 문서나 데이터의 구조와 의미를 나타내는 방법이다.

```html
<h1>게시글 제목</h1>
<p>게시글 내용</p>
```

`h1`은 최상위 제목, `p`는 문단이라는 의미를 가진다. 브라우저는 이 의미를 바탕으로 문서 구조를 해석한다.

XML도 태그를 사용하지만, 태그가 미리 정해져 있지 않다는 차이가 있다.

```xml
<post>
  <title>게시글 제목</title>
  <content>게시글 내용</content>
</post>
```

## JSON이란?

JSON(JavaScript Object Notation)은 구조화된 데이터를 텍스트로 표현하는 형식이다.

JavaScript 객체 표기법에서 영향을 받았지만 <strong>JSON 자체가 JavaScript 객체인 것은 아니다.</strong> JSON은 언어에 독립적인 텍스트 형식이므로 JavaScript뿐 아니라 Python, Java, Kotlin 등 여러 언어에서 사용할 수 있다.

```json
{
  "name": "woojin",
  "age": 25,
  "languages": ["Python", "JavaScript"],
  "active": true
}
```

JSON에서 사용할 수 있는 값의 종류는 다음과 같다.

- 문자열
- 숫자
- 객체
- 배열
- 불리언
- `null`

문자열과 객체의 키에는 큰따옴표를 사용해야 한다. 함수, 주석, `undefined` 등은 JSON 값으로 표현할 수 없다.

## JSON 직렬화와 역직렬화

프로그램 내부의 객체는 언어와 실행 환경에 종속된 메모리 구조다. 이 객체를 파일에 저장하거나 네트워크로 전송하려면 공통된 형식으로 변환해야 한다.

객체를 JSON 문자열로 변환하는 과정을 <strong>직렬화(Serialization)</strong>라고 한다. 반대로 JSON 문자열을 프로그램에서 사용할 객체로 복원하는 과정을 <strong>역직렬화(Deserialization)</strong>라고 한다.

```text
JavaScript 객체
    ↓ JSON.stringify()
JSON 문자열
    ↓ JSON.parse()
JavaScript 객체
```

### JSON.stringify()

`JSON.stringify()`는 JavaScript 값을 JSON 문자열로 변환한다.

```javascript
const user = {
  name: "woojin",
  age: 25,
};

const json = JSON.stringify(user);

console.log(json);
// {"name":"woojin","age":25}
```

### JSON.parse()

`JSON.parse()`는 JSON 문자열을 JavaScript 값으로 변환한다.

```javascript
const json = '{"name":"woojin","age":25}';
const user = JSON.parse(json);

console.log(user.name); // woojin
```

### 직렬화는 바이트 변환과 다르다

`JSON.stringify()`의 결과는 바이트가 아니라 <strong>문자열</strong>이다.

실제로 네트워크를 통해 전송할 때는 이 문자열을 UTF-8과 같은 문자 인코딩을 이용해 바이트로 변환한다.

```text
객체
  ↓ 직렬화
JSON 문자열
  ↓ 문자 인코딩
바이트
  ↓ 네트워크 전송
바이트
  ↓ 디코딩
JSON 문자열
  ↓ 역직렬화
객체
```

따라서 직렬화와 인코딩은 서로 다른 과정이다.

## XML이란?

XML(eXtensible Markup Language)은 태그를 이용해 데이터와 문서의 구조를 표현하는 확장 가능한 마크업 언어다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <name>woojin</name>
  <age>25</age>
  <languages>
    <language>Python</language>
    <language>JavaScript</language>
  </languages>
</user>
```

XML 문서는 일반적으로 다음 요소로 구성된다.

### 프롤로그

XML 문서의 버전과 문자 인코딩 정보를 나타낸다. 필수는 아니지만 문서의 해석 방법을 명확하게 전달할 수 있다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
```

### 루트 요소

XML 문서에는 전체 내용을 감싸는 루트 요소가 하나만 존재해야 한다.

```xml
<users>
  <user>...</user>
  <user>...</user>
</users>
```

### 하위 요소와 속성

요소는 다른 요소를 포함해 계층 구조를 만들 수 있으며 속성을 가질 수도 있다.

```xml
<user id="1">
  <name>woojin</name>
</user>
```

## XML에서 태그를 직접 만들 수 있다는 의미

HTML에서는 `<h1>`, `<p>`, `<a>`처럼 HTML 명세에 정의된 <strong>표준 HTML 요소(Standard HTML Elements)</strong>를 사용한다.

XML에서는 문서의 목적에 맞게 요소 이름을 직접 정의할 수 있다.

```xml
<book>
  <title>클린 코드</title>
  <author>Robert C. Martin</author>
</book>
```

여기서 `book`, `title`, `author`는 XML 언어가 미리 제공한 태그가 아니다. 문서 작성자가 데이터의 의미에 맞게 만든 사용자 정의 요소다.

다만 태그를 만들 수 있다는 것이 아무 규칙 없이 작성해도 된다는 뜻은 아니다. XML 문서는 최소한 다음 문법을 지켜야 한다.

- 시작 태그와 종료 태그가 일치해야 한다.
- 요소가 올바른 순서로 중첩되어야 한다.
- 루트 요소는 하나만 존재해야 한다.
- 요소 이름은 대소문자를 구분한다.
- 속성값은 따옴표로 감싸야 한다.

```xml
<!-- 올바른 XML -->
<user>
  <name>woojin</name>
</user>
```

```xml
<!-- 잘못된 XML: 종료 태그 불일치 -->
<user>
  <name>woojin</Name>
</user>
```

XML 문서에서 허용할 요소, 속성, 순서와 데이터 타입을 더 엄격하게 정의하려면 DTD나 XML Schema(XSD)를 사용할 수 있다.

## HTML과 XML의 차이

HTML과 XML은 모두 태그를 사용하지만 목적과 처리 방식이 다르다.

| 구분 | HTML | XML |
| --- | --- | --- |
| 주요 목적 | 웹 문서의 구조와 의미 표현 | 데이터와 문서 구조의 저장 및 전달 |
| 요소 | 명세에 정의된 표준 요소 사용 | 목적에 맞는 사용자 정의 요소 사용 |
| 대소문자 | HTML 문법에서는 일반적으로 구분하지 않음 | 엄격하게 구분함 |
| 종료 태그 | 일부 요소는 종료 태그 생략 가능 | 모든 요소를 올바르게 닫아야 함 |
| 오류 처리 | 브라우저가 일부 오류를 보정함 | 문법 오류가 있으면 파싱에 실패함 |
| 표현 방법 | 브라우저가 요소의 의미에 따라 렌더링 | 표현 방법이 기본적으로 정해져 있지 않음 |

HTML의 태그가 미리 정의되어 있다는 것은 브라우저가 각 요소의 의미와 동작을 알고 있다는 뜻이다.

```html
<a href="https://example.com">링크</a>
```

브라우저는 `a` 요소를 링크로 해석한다. 반면 XML의 사용자 정의 요소는 이름만으로 화면 표시 방법이 결정되지 않는다.

```xml
<link>https://example.com</link>
```

이 요소를 어떻게 처리할지는 XML을 읽는 프로그램이 정해야 한다.

## JSON과 XML의 차이

같은 데이터를 JSON과 XML로 표현하면 구조상의 차이를 쉽게 확인할 수 있다.

### JSON

```json
{
  "user": {
    "name": "woojin",
    "age": 25
  }
}
```

### XML

```xml
<user>
  <name>woojin</name>
  <age>25</age>
</user>
```

| 구분 | JSON | XML |
| --- | --- | --- |
| 기본 구조 | 객체와 배열 | 요소와 속성의 트리 |
| 문법 크기 | 비교적 간결함 | 시작·종료 태그로 인해 길어질 수 있음 |
| 데이터 타입 | 문자열, 숫자, 불리언, 배열, 객체, `null` | 기본적으로 텍스트이며 스키마로 타입 정의 가능 |
| 주석 | 표준 JSON에서는 지원하지 않음 | 주석 지원 |
| 네임스페이스 | 지원하지 않음 | 지원함 |
| 주요 활용 | REST API, 설정, 웹 데이터 교환 | 문서 형식, 설정, 표준 프로토콜, 복잡한 스키마 |

JSON은 문법이 간결하고 JavaScript에서 바로 다루기 쉬워 웹 API에서 널리 사용된다.

XML은 태그가 반복되어 JSON보다 용량이 커질 수 있지만, 속성, 네임스페이스, 스키마와 문서 중심 구조가 필요한 환경에서 장점이 있다.

## JavaScript에서 XML 파싱하기

브라우저에서는 `DOMParser`를 사용해 XML 문자열을 문서 객체로 변환할 수 있다.

```javascript
const xml = `
  <user>
    <name>woojin</name>
  </user>
`;

const parser = new DOMParser();
const document = parser.parseFromString(xml, "application/xml");
const name = document.querySelector("name")?.textContent;

console.log(name); // woojin
```

Node.js에서는 실행 환경과 사용하는 라이브러리에 따라 XML 파서가 필요할 수 있다. 특정 모듈을 반드시 `require()`해야 하는 것은 아니며, CommonJS에서는 `require()`, ES Module에서는 `import`를 사용할 수 있다.

## 어떤 형식을 사용해야 할까?

### JSON이 적합한 경우

- REST API의 요청과 응답
- 프론트엔드와 백엔드 사이의 데이터 교환
- 간단한 설정 파일
- 객체와 배열 중심의 데이터를 간결하게 표현할 때

### XML이 적합한 경우

- 이미 XML을 사용하는 시스템과 연동할 때
- 문서 구조와 데이터가 함께 중요할 때
- 네임스페이스가 필요할 때
- XSD를 이용한 엄격한 문서 검증이 필요할 때
- SOAP, RSS, SVG 등 XML 기반 표준을 사용할 때

### HTML이 적합한 경우

- 브라우저에 표시할 웹 문서를 작성할 때
- 제목, 문단, 링크, 목록 등 콘텐츠의 의미 구조를 표현할 때
- 접근성과 검색 엔진이 이해할 수 있는 시맨틱 구조를 만들 때

## 정리

- JSON은 구조화된 데이터를 표현하는 언어 독립적인 텍스트 형식이다.
- `JSON.stringify()`는 객체를 JSON 문자열로 직렬화한다.
- `JSON.parse()`는 JSON 문자열을 JavaScript 값으로 역직렬화한다.
- 직렬화는 객체를 문자열 형식으로 바꾸는 과정이며, 바이트 변환은 별도의 인코딩 과정이다.
- HTML은 명세에 정의된 표준 HTML 요소를 사용한다.
- XML은 목적에 맞는 사용자 정의 요소를 만들 수 있다.
- XML은 대소문자를 구분하고 모든 요소를 올바르게 닫아야 한다.
- JSON은 간결한 데이터 교환에, XML은 문서 중심 구조와 엄격한 스키마가 필요한 환경에 적합하다.

## 참고 자료

- [인프런 큰돌님의 CS 지식 강의](https://www.inflearn.com/courses/lecture?courseId=328823&tab=none&type=LECTURE&unitId=127699&subtitleLanguage=ko)
