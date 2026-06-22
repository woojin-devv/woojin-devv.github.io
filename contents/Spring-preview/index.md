---
title: "[Spring] 소프트웨어 개발과 관심사의 분리"
description: "소프트웨어 개발과 관심사의 분리 1. 소프트웨어 설계의 핵심 소프트웨어 설계는 미래의 변화에 대비하는 작업 이다. 애플리케이션은 시간이 지나면서 계속 변화한다. 요구사항 변경 DB 변경 고객사별 환경 차이 기능 추가 및 수정 유지보수 비용 증가 따라서 좋은 코드는 변화에 대응하기 쉬운 "
date: 2026-06-11
slug: "/Spring-preview/"
tags: [spring]
heroImageAlt: "[Spring] 소프트웨어 개발과 관심사의 분리"
---

###  소프트웨어 개발과 관심사의 분리

###  1. 소프트웨어 설계의 핵심

소프트웨어 설계는 **미래의 변화에 대비하는 작업**이다.

애플리케이션은 시간이 지나면서 계속 변화한다.

- 요구사항 변경
- DB 변경
- 고객사별 환경 차이
- 기능 추가 및 수정
- 유지보수 비용 증가

따라서 좋은 코드는 **변화에 대응하기 쉬운 코드**여야 한다.

 

###  2. 관심사의 분리

### 관심사란?

관심사는 클래스나 메서드가 담당하는 **역할 또는 책임**을 의미한다.

예를 들어 `UserDao` 클래스에는 다음과 같은 관심사가 섞여 있다.

```
UserDao
├── DB 연결 작업
├── 데이터 작업(add, get)
└── 자원 해제 작업
```

 

###  3. 기존 UserDao의 문제점

### 문제 1. DB 연결 코드 중복

`add()`, `get()` 메서드마다 DB 연결 코드가 반복된다.

```java
Class.forName("oracle.jdbc.OracleDriver");
Connection c = DriverManager.getConnection(...);
```

이런 코드가 여러 메서드에 중복되면 다음과 같은 문제가 생긴다.

- DB 접속 정보가 바뀌면 여러 곳을 수정해야 한다.
- 코드가 길어지고 가독성이 떨어진다.
- 유지보수가 어려워진다.
- 실수로 일부 메서드만 수정하지 못할 수 있다.

 

###  4. 해결 방법 1: 리팩토링

중복된 관심사는 하나로 모은다.

DB 연결 코드를 `getConnection()` 메서드로 분리한다.

```java
private Connection getConnection() throws ClassNotFoundException, SQLException {
    Class.forName("oracle.jdbc.OracleDriver");
    return DriverManager.getConnection(url, user, password);
}
```

이후 `add()`, `get()`에서는 공통 메서드를 사용한다.

```java
Connection c = getConnection();
```

 

###  5. 리팩토링이란?

리팩토링은 **외부 동작은 그대로 유지하면서 내부 구조를 개선하는 작업**이다.

즉, 사용자가 보는 기능은 변하지 않지만 코드 구조를 더 좋게 바꾸는 것이다.

### 리팩토링 목적

- 중복 제거
- 가독성 향상
- 유지보수성 향상
- 변경에 강한 구조 만들기

 

###  6. 예외 처리와 자원 해제

DB 연결, `PreparedStatement`, `ResultSet` 같은 자원은 사용 후 반드시 해제해야 한다.

```java
rs.close();
ps.close();
c.close();
```

자원을 사용하는 쪽에서 예외를 강제 처리하도록 하는 것이 일반적이다.

```java
throws ClassNotFoundException, SQLException
```

 

## 1.2 요구사항 변화

###  새로운 요구사항

소프트웨어를 여러 고객사에 판매해야 하는 상황이 발생했다.

고객사마다 사용하는 DB가 다르다.

```
N사 -> Oracle 사용
D사 -> MySQL 사용
```

문제는 DB마다 연결 방식이 다르다는 점이다.

또한 사장님(가상 시나리오)의 요구사항은 다음과 같다.

```
UserDao 클래스의 핵심 소스는 외부에 노출되면 안 된다.
```

 

###  변경되는 부분과 유지되는 부분

###  유지되어야 하는 코드

`UserDao`의 핵심 기능은 그대로 유지되어야 한다.

```java
add()
get()
```

### 변경되는 코드

DB 연결 방식만 고객사마다 달라진다.

```java
getConnection();
```

즉, 변화하는 부분은 **DB 연결 코드**이고, 변화하지 않는 부분은 **데이터 처리 로직**이다.

 

## 해결 방법 2: 상속 사용

###  구조

`UserDao`를 추상 클래스로 만들고, DB 연결 메서드를 추상 메서드로 만든다.

```
UserDao 추상 클래스
├── add()
├── get()
└── getConnection() 추상 메서드
```

각 고객사는 `UserDao`를 상속받아 자신에게 맞는 DB 연결 방식을 구현한다.

```
NUserDao -> Oracle 연결 구현
DUserDao -> MySQL 연결 구현
```

 

###  예시 구조

```
UserDao
├── NUserDao
└── DUserDao
```

`UserDao`는 공통 로직을 담당한다.

```
add()
get()
```

각 하위 클래스는 DB 연결 로직만 담당한다.

```
getConnection()
```

 

###  Program 코드 변경

사용자는 필요한 DB에 맞는 DAO 객체를 선택해서 사용한다.

```java
UserDao dao = new NUserDao();
```

또는

```java
UserDao dao = new DUserDao();
```

 

## 상속 방식의 문제점

###  문제 1. 자바는 단일 상속만 지원한다

자바 클래스는 하나의 클래스만 상속할 수 있다.

```java
class NUserDao extends UserDao{}
```

이미 `UserDao`를 상속하고 있으면 다른 클래스를 추가로 상속할 수 없다.

 

###  문제 2. 부모와 자식 클래스의 결합도가 높다

상속 관계에서는 부모 클래스와 자식 클래스가 강하게 연결된다.

부모 클래스가 변경되면 자식 클래스도 영향을 받을 가능성이 높다.

```
부모 클래스 변경
-> 자식 클래스 영향
-> 유지보수 부담 증가
```

즉, 상속은 코드 재사용에는 도움이 되지만, 구조가 강하게 묶이는 문제가 있다.

 

## 다음 개선 방향

상속 관계를 줄이고, 더 유연한 구조로 바꿔야 한다.

핵심은 다음과 같다.

```
상속 관계를 파괴하자.
그러면서도 고객사별 DB 연결 요구사항은 만족하자.
```

이를 위해 생각해야 할 개념은 다음 두 가지다.

###  is-a 관계

상속 관계이다.

```
NUserDao is a UserDao
```

즉, `NUserDao`는 `UserDao`의 한 종류라는 의미이다.

 

###  has-a 관계

포함 관계이다.

```
UserDao has a ConnectionMaker
```

즉, `UserDao`가 DB 연결 기능을 직접 상속받는 것이 아니라, DB 연결 객체를 내부에 가지고 사용하는 구조이다.

 

# Spring이 선호하는 구조

Spring은 상속보다 다음 구조를 선호한다.

```
인터페이스 + 다형성 + 조합
```

즉, 변하는 부분을 인터페이스로 분리하고, 실제 구현체는 외부에서 주입받는 방식이다.

이 구조는 이후 Spring의 핵심 개념인 다음 내용으로 이어진다.

```
DI, Dependency Injection
의존성 주입
```


## 정리

###  현재까지의 흐름

```
1. UserDao 안에 DB 연결 코드가 중복됨
2. getConnection() 메서드로 분리하여 리팩토링
3. 고객사마다 DB 연결 방식이 달라지는 요구사항 발생
4. 상속을 이용해 고객사별 DAO 구현
5. 하지만 상속은 단일 상속과 강한 결합 문제가 있음
6. 상속 대신 인터페이스와 다형성을 사용하는 구조로 개선 필요
```

