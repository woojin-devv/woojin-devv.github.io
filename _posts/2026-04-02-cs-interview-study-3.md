---
title: 3주차 - 네트워크
date: 2026-04-02
categories: [cs]
tags: [cs]
image: https://cdn.inflearn.com/public/courses/328823/cover/1081d7c2-64b4-4063-87f4-c40e11bb481f/KakaoTalk_20220517_140737840.jpg?w=736
layout: post
math: true
---
## 참고자료

<div>
{% include bookmark.html 
   url="https://www.youtube.com/watch?v=UMwQjFzTQXw" 
   title="HTTP 1 Vs HTTP 2 Vs HTTP 3!" 
   description="HTTP 프로토콜의 진화 과정..." 
   image="https://img.youtube.com/vi/UMwQjFzTQXw/maxresdefault.jpg" %}
</div>

# HTTP 헤더(Header)

사용자가 HTTP 요청을 하게 되면 헤더와 바디를 주고 받는다.

![alt text](/assets/img/cs-interview-3/1.png)

- 헤더: 바디를 설명하는 정보를 포함한 정보 묶음
    - 헤더는 콜론(:)으로 구분되는 key-value 형태로 설정됨
    - HTTP 요청을 할 때 3가지 헤더인 **일반헤더, 요청헤더, 응답헤더**가 자동으로 생김
- 바디 : 주고받고자 하는 컨텐츠 본문 (json, html, image)

### 일반헤더 (General Header)

![alt text](/assets/img/cs-interview-3/2.png)
요청한 URL, 요청 메서드, 해당 자원을 요청할 때 해당 자원의 출처를 나타내는 URL을 노출시킬 지 말지를 정하는 보안정도가 설정되어 있는 Referrer Policy 등이 들어감.

- Request URL : 요청한 대상의 주소
- Request Method : 요청 방식 (GET, POST, PUT, DELETE 등)
- Status Code : 서버의 처리 결과 상태
    - Status Code
- Referrer Policy : 보안을 위해 이전 페이지의 주소를 어디까지 노출할지 결정하는 정책

### 요청헤더 (Request Header)

![alt text](/assets/img/cs-interview-3/3.png)

- Host : 요청이 전송되는 도메인 명
- User-Agent : 요청을 보내는 클라이언트의 정보
- Accept: 클라이언트가 처리할 수 있는 미디어 타입
    - 예: `text/html` , `application/json`

### 응답헤더 (Response Header)

![alt text](/assets/img/cs-interview-3/4.png)

서버가 클라이언트에게 보낼 때, 서버 자체의 정보나 응답 데이터의 특성을 설명함

- Content-Type : 바디에 담긴 컨텐츠의 종류
    - 예: `text/html` ; `charset=utf-8`
    - 이를 통해 브라우저는 데이터를 어떻게 렌더링할 지 결정함
- Set-Cookie : 서버가 클라이언트에 쿠키를 저장하라고 명령할 때 사용
- Cache-Control : 해당 응답을 얼마나 오랫동안 캐시(임시 저장)해도 되는 지 지시
- Server: 응답을 처리한 서버 소프트웨어의 정보 (예: `Apache` , `nginx`)
- Access-Control-Allow-Origin: CORS(Cross-Origin Resource Sharing)와 관련된 보안 정책으로, 어떤 도메인의 접근을 허용할지 명시.

# HTTP/1.0과 1.1의 차이

![alt text](/assets/img/cs-interview-3/5.png)

### HTTP/1.0: 단기 커넥션(Short-lived Connections)

HTTP/1.0은 기본적으로 한 번의 연결에 하나의 요청만 처리한다는 원칙을 가지고 설계되었다.

1. **작동방식 (3-way handshake → 데이터 요청 / 응답 → 연결 종료)**
    1. TCP 연결 : 클라이언트와 서버가 3-Way Handshake를 통해 연결을 맺는다.
    2. 요청/응답: 클라이언트가 HTML 파일을 요청하고, 서버가 응답한다.
    3. 연결 종료: 응답이 끝나면 즉시 TCP 연결을 끊는다.
    4. 반복: 만약 HTML 안에 이미지가 3개가 있다면, 해당 과정을 3번 더 반복함
2. **문제점 : RTT의 증가**
    - **RTT(Round Trip Time)**란? 패킷이 왕복하는데 걸리는 시간을 의미함
    - **지연시간(Latency) 발생** : 매번 연결을 새로 맺어야함, 따라서 실제 데이터를 주고 받는 시간보다 연결을 설정(Handshake)하는데 드는 시간이 더 길어지는 상황이 발생함
    - **서버 부하** : 수 많은 클라이언트가 매번 연결을 맺고 끊으면 서버의 CPU와 메모리 자원들을 빠르게 소모하게 됨
3. **정리**
    - HTTP/1.0은 수명이 짧은 연결이다.
    - HTTP 요청은 자체 요청에서 완료된다
    - 각 HTTP 요청당 TCP 핸드셰이크가 발생되며 기본적으로 한 연결당 하나의 요청을 처리하도록 설계되었다.
    - 한 번 연결할 때마다 TCP 연결을 계속해야하므로 RTT가 늘어나는 문제점이 있다.

## HTTP/1.1

HTTP/1.0의 RTT 증가 문제점을 해결하기 위해 HTTP/1.1이 나오게 됨

### 1. Keep-alive default

데이터를 요청할 때마다 TCP 연결을 하는게 아닌 한번 연결 하면, 계속 데이터를 주고 받을 수 있도록 함. 

- keep-alive 옵션을 기본 옵션으로 유지

### 2. 호스트 헤더

HTTP/1.0은 서버가 하나의 호스트만 가진다고 가정하기 때문에 HTTP/1.0은 헤더에 호스트를 포함하지 않음

- 때문에, HTTP/1.0은 IP 하나당 하나의 호스트만 가질 수 있었음
- 하지만, HTTP/1.1은 헤더에 특정 호스트를 포함할 수 있게 변경되었고 항상 호스트를 포함해서 요청하도록 변경됨

### 3. 대역폭 최소화 (Chunking) : 다운로드 이어받기 가능

![alt text](/assets/img/cs-interview-3/6.png)

- HTTP/1.0은 어떠한 파일을 다운로드 받다가 연결이 끊기면 다시 다운로드 받는 것이 불가능 했음
    - 예를 들어, HTTP/1.0에서는 10KB 파일을 다운로드 받는다고 했을 때, 5KB까지 다운 받고 이후의 데이터를 받는 것은 불가능했음.
        - 하지만, HTTP/1.1에서는 `Ragne:bytes=5000-` 라는 헤더를 추가하여 다운로드 재개 요청을 할 수 있도록 바뀜

### 4. 파이프라이닝(Pipelining)

응답을 기다리지 않고 여러 요청을 연속해서 보낼 수 있게 됨

![alt text](/assets/img/cs-interview-3/7.png)

예시)

Client가 Server단에 이미지를 2개를 요청할 때, 응답에 관계없이 GET요청을 보낼 수 있음

### But. HTTP/1.1의 한계 : HOL(Head-of-Line) Blocking 문제

![alt text](/assets/img/cs-interview-3/8.png)

1. **왜 발생하나?**
    
    HTTP/1.1은 이전 버전의 비효율을 해결하기 위해 파이프라이닝(Pipelining)을 도입하였음. 응답을 기다리지 않고 여러 요청을 연속해서 보내는 방식.
    
    하지만, 
    
    **응답은 반드시 요청받은 순서대로 보내야한다.** 라는 제약사항이 존재함
    
    서버는 클라이언트가 요청한 순서를 기억했다가 그 순서에 맞춰 응답을 돌려줘야하기 때문
    
2. **어떻게 해결했나?**
    - **Domaing Sharding (도메인 분할)**
        - 브라우저는 한 도메인당 연결 수 (보통 6개)를 제한함
            - 이를 우회하기 위해 `static1.example.com`, `static2.example.com` 처럼 여러 서브도메인을 만들어 연결 개수를 강제로 늘림
    - **Image Sprite (이미지 스프라이트)**
        - 수십개의 작은 아이콘을 하나의 커다란 이미지 파일로 합쳐서 요청 횟수 자체를 1번으로 줄임
    - **Code Bundling**
        - 여러 개의 JS/CSS 파일을 하나로 합쳐서 전송 효율을 높임

## HTTP/2와 HTTP/3의 차이

### HTTP/2

![alt text](/assets/img/cs-interview-3/9.png)

### HTTP/2의 도입 배경 & HTTP/1.1의 한계

HTTP/1.1의 성능 저하 문제(HOL)를 해결하기 위해, 구글의 SPDY 프로토콜을 바탕으로 탄생

- HOL : 네트워크에서 같은 큐에 있는 패킷이 그 첫번째 패킷에 의해 지연될 때 발생하는 성능저하 현상을 의미

### **어떻게 해결했나?**

- **바이너리 포맷 계층 (Binary Framing)**
    - 텍스트 대신 이진 형식(Binary)으로 프레임 단위로 데이터를 쪼개어 전달하여 처리 속도가 빨라짐
- **Multiplexing (다중화)**
    - 하나의 연결에서 여러 요청과 응답을 동시에 주고 받을 수 있어 HOLB 문제를 소프트웨어 수준에서 해결
    - 단일 TCP연결의 여러 스트림에서 여러 HTTP 요청과 응답을 보낼 수 있다.
        - HTTP/1.1에서는 병렬 요청을 하려면 다중 TCP 연결을 통해 진행하고, TCP 연결 하나당 병렬 요청은 불가능했다.
        - HTTP/2.0에서는 리소스를 작은 **프레임** 단위로 나누고 이를 스트림으로 프레임을 전달한다.
            - 각각의 프레임은 (스트림 ID / 청크 크기를 나타내는 프레임이 추가)
- **Header Compression (HPACK)**
    - 중복되는 헤더 정보를 압축하여 전송 데이터량을 크게 줄임
- **Server Push**
    - 클라이언트가 요청하지 않아도 서버가 필요한 리소스를 미리 밀어넣어 줄 수 있음

### HTTP/3

![alt text](/assets/img/cs-interview-3/10.png)

**TCP의 태생적 한계**를 극복하기 위해 구글이 개발한 QUIC 프로토콜을 사용

***→ TCP를 여전히 사용하기 때문에 RTT로 인한 지연시간 문제는 여전히..(HTTP/2)***

- UDP 기반(QUIC) 연결 설정 과정을 대폭 단축하여 첫 패킷 전송까지의 시간을 줄임
- **HOLD 문제 해결**
    - TCP 패킷 하나만 유실되어도 전체가 멈추지만, HTTP/3는 유실된 패킷이 포함된 스트림만 영향을 받고 나머지는 정상 작동
- **연결 유지**
    - 와이파이에서 LTE로 네트워크 환경이 바뀌어도 IP주소가 아닌 ‘Connection ID’를 사용

## HTTPS와 TLS #1. 암호화(대칭, 비대칭)

---

### 암호화란?

평문을 암호문으로 바꾸어 데이터의 기밀성과 무결성을 보장하는 기술 

1. **대칭 암호화 (Symmetric)**
    - 특징: 암호화와 복호화에 같은 키를 사용
    - 장점 : 속도가 빠름
    - 단점 : 탈취 위험
    - **대표 알고리즘 : AES-128**
2. **비대칭 암호화 (Asymmetric)**
    - 특징 : 공개키와 개인키의 쌍을 사용
    - 공식 : 공개키 암호화 → 개인키로만 복호화 가능
    - 장점 : 키 전달 문제 해결
    - 단점 : 계산 복잡도가 높은 편이라 속도가 느림
    - **대표 알고리즘 : RSA, DH(Diffie–Hellman), ECDHE**

### AES (대칭 암호화)

AES(Advanced Encryption Standard)는 스크램블을 사용한 대칭키 암호화 알고리즘

→ 10 라운드에 걸쳐 각 라운드마다 스크램블 등의 연산으로 데이터 암호화 

- **스크램블?**
    - 현재 상태의 키를 XOR 연산으로 더하는 단계
- [참고] AES는 AES-128, AES-192, AES-256이 있고 그 중 AES-128가 가장 빠르고 가벼우며 많이 쓰이는 알고리즘이다. AES-128는 HTTPS, TLS 통신, 파일 암호화 (ZIP, RAR) 등에 사용됨

### RSA, DH(Diffie–Hellman) ; 비대칭 암호화

![alt text](/assets/img/cs-interview-3/11.png)

**ex)**

1. A가 B에게 비밀 메시지를 보내려면 → B의 공개키로 암호화
2. 이 메시지는 오직 B의 개인키로만 복호화할 수 있음 즉, A는 암호화만 하고, B만 읽을 수 있음