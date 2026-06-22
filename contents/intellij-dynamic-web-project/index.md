---
title: "[JPA] Intellij Dynamic Web project 생성"
description: "서론 IntelliJ IDEA에서 JSP/Servlet 기반의 Dynamic Web Project를 생성하는 과정을 정리한다. Eclipse에서는 Dynamic Web Project 메뉴를 통해 바로 생성할 수 있지만, IntelliJ에서는 Jakarta EE 템플릿과 Tomcat 실행"
date: 2026-05-20
slug: "/intellij-dynamic-web-project/"
tags: [Web]
heroImage: ./heroImage.png
heroImageAlt: "[JPA] Intellij Dynamic Web project 생성"
---

## 서론

IntelliJ IDEA에서 JSP/Servlet 기반의 Dynamic Web Project를 생성하는 과정을 정리한다.
Eclipse에서는 `Dynamic Web Project` 메뉴를 통해 바로 생성할 수 있지만, IntelliJ에서는 Jakarta EE 템플릿과 Tomcat 실행 설정을 함께 잡아줘야 한다.

### 환경

- IntelliJ IDEA 2025.3.1.1
- JDK 11
- Apache Tomcat 10.1.55

## 프로젝트 생성

![새 프로젝트 생성 화면](/assets/img/jpa-01/1.png)

새 프로젝트를 생성할 때 `Jakarta EE`를 선택하고 템플릿은 `웹 애플리케이션`으로 지정한다.
Servlet, `web.xml`, `index.jsp`가 포함된 기본 웹 프로젝트 구조를 만들 수 있다.

애플리케이션 서버는 미리 연동해 둔 `Tomcat 10.1.55`를 선택한다.
Tomcat이 아직 등록되어 있지 않다면 `새로 만들기`를 눌러 Tomcat 설치 경로를 지정한 뒤 다음 단계로 넘어간다.

![Jakarta EE 버전 선택 화면](/assets/img/jpa-01/2.png)

Jakarta EE 버전은 JDK 11과 호환되는 버전으로 선택한다.
여기서는 `Jakarta EE 10`을 기준으로 진행하고, 설정이 끝나면 `생성` 버튼을 눌러 프로젝트를 만든다.

![프로젝트 실행 화면](/assets/img/jpa-01/3.png)

프로젝트가 생성되면 우측 상단의 실행 버튼을 눌러 Tomcat 서버를 실행한다.
기본 애플리케이션 컨텍스트는 보통 `/{프로젝트명}_war_exploded` 형태로 잡힌다.

## 애플리케이션 컨텍스트 경로 수정

![실행 구성 편집 메뉴](/assets/img/jpa-01/4.png)

컨텍스트 경로를 변경하려면 상단 메뉴에서 `실행` > `구성 편집`으로 이동한다.
이후 등록된 Tomcat 서버 설정을 선택하고 `서버` 탭을 확인한다.

![Tomcat 서버 설정 화면](/assets/img/jpa-01/5.png)

배포 설정에서 애플리케이션 컨텍스트 값을 원하는 경로로 수정한다.
예를 들어 `/`로 설정하면 `http://localhost:8080/`에서 바로 프로젝트를 확인할 수 있다.

## 정리

IntelliJ에서 Dynamic Web Project를 만들 때는 `Jakarta EE` 템플릿을 사용하고, Tomcat 서버와 배포 아티팩트를 함께 설정해야 한다.
기본 컨텍스트 경로가 길게 생성될 수 있으므로, 실습이나 테스트 목적이라면 실행 구성에서 컨텍스트 경로를 간단하게 바꿔두는 것이 편하다.
