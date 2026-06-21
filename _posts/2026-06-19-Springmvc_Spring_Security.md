---
title: "[Spring] Spring Security"
date: 2026-06-19
categories: [java, spring]
tags: [java, spring]
image: "/assets/img/spring/logo.png"
layout: post
math: true
toc: true
mermaid: true
---

## Spring Security 

### 1. Spring 기반 보안 설정 처리

> **Spring Security**는 Spring 기반 애플리케이션에서 **인증(Authentication)** 과 **권한/인가(Authorization)** 를 처리하기 위한 보안 프레임워크이다.
> 웹 애플리케이션에서 사용자는 단순히 로그인만 하는 것이 아니라, 로그인 이후 자신이 가진 권한에 따라 접근 가능한 기능이 달라져야 한다.
> 예를 들어 일반 사용자는 게시글 조회만 가능하고, 관리자는 게시글 등록, 수정, 삭제까지 가능해야 한다.

### 2. 인증과 권한
#### 2.1 인증 Authentication
- 인증이란 - 사용자가 누구인지 확인하는 과정이다.
  - 아이디 & 비밀번호 입력 
  - 로그인 성공
  - 서버가 해당 사용자를 인증된 사용자로 판단
  
#### 2.2 권한 Authorization
- 권한은 인증된 사용자가 어떤 기능을 사용할 수 있는지 판단하는 과정
  - 로그인한 사용자가 게시판 상세 페이지에 접근할 수 있는가?
  - 로그인한 사용자가 글쓰기 페이지에 접근할 수 있는가?
  - 로그인한 사용자가 관리자 페이지에 접근할 수 있는가?
  
- ***사용자의 권한(ROLE)에 따라 접근 가능한 프로세스를 제어하는 것이 권한 처리*** 이다. 
  
### 3. Security를 사용하지 않는 전통적인 인증/권한 처리
- Spring Security를 사용하지 않는 경우에는 보통 session을 직접 사용한다.
- 세션기반 방식에 대한 설명은 아래 링크 참조 
  - [세션과 JWT 방식](https://woojin-devv.github.io/posts/Spring-JWT/)

#### 기존 방식의 문제 
1. 모든 페이지마다 session 체크 코드가 반복된다.
2. 권한 변경 시 여러 JSP와 Controller를 수정해야 한다.
3. URL 접근 제어가 분산된다.
4. 권한이 많아지면 관리가 복잡해진다.
5. 보안 관련 처리가 개발자 코드에 흩어진다.

### 4. Spring Security를 사용하는 이유 
Spring Security를 사용하면 인증과 권한 처리를 하나의 설정 파일에서 통합적으로 관리할 수 있음. 
- 즉, Spring Security는 보안 처리를 Controller나 JSP에 흩어놓지 않고, 보안 설정 파일에서 중앙 집중식으로 관리하게 해준다.

#### 통합 관리의 의미 
- Spring Security를 사용하면 다음 항목을 한 곳에서 관리할 수 있음. 
    - 사용자 인증, 권한 관리 
    - URL 접근 관리
    - 로그인 페이지 설정
    - 로그아웃 처리 
    - 세션 만료 처리 
    - 권한 없는 사용자 접근 처리 

```mermaid
flowchart LR
    A[로그인 성공] --> B[Authentication 객체 생성]
    B --> C[SecurityContext에 저장]
    C --> D[Session을 통해 인증 상태 유지]
    D --> E[요청마다 Security Filter가 권한 확인]
```
