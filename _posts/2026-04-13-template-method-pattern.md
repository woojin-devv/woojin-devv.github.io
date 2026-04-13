---
title: "[OOP] 템플릿 메서드 패턴 정리"
date: 2026-04-13
categories: [JAVA]
tags: [JAVA, OOP]
image: https://cdn.shopaccino.com/igmguru/products/java-oop-training-course-1579280444136756_l.jpg?v=547
layout: post
math: true
toc: true
---

## 1. 템플릿 메서드 패턴이란?

---

> 작업의 뼈대는 미리 정해두고 구체적인 단계는 자식 클래스에서 구현하게 만든 패턴.
> 
- 상위 클래스에서 실행 프로세스의 순서를 정의하고, 그 일부 단계를 `abstract` 메서드나 상속 가능한 메서드로 비워둔다.
    - 알고리즘의 뼈대
    - 자식이 건들이지 못하도록 `final` 로 선언함
- 하위 클래스에서는 해당 상위 클래스를 오버라이딩 세부 로직을 채우는 방식

### 구조

1. **Template Method** : 알고리즘의 전체 흐름을 정의 (변경 불가)
2. **Primitive Operations (추상 메서드)**: 하위 클래스가 구현해야 하는 부분
3. **Hook (선택적 메서드)** : 기본 구현이 있지만, 필요시 오버라이드 가능

## 2. 언제 사용하나?

---

1. 알고리즘 구조가 동일할 때 but. 일부 단계만 다를때
2. **순서를 강제해야할 때**
    - **파일 처리 로직 (열기 → 읽기 → 닫기)**
    - **게임 턴 처리**
        
        [턴 시작] → [행동 선택] → [행동 수행] → [결과 처리] → [턴 종료]
        
    - **Spring Framework의 `JdbcTemplate`**
        1. 커넥션 생성
        2. 쿼리 실행 (개발자가 정의)
        3. ResultSet 처리 (개발자가 정의)
        4. 커넥션 반환
    - **API 요청 처리**
        1. 요청 검증
        2. 인증 / 인가 체크
        3. 비즈니스 로직 실행
        4. 응답 생성
        5. 로깅
    - **로그 / 트랜잭션 처리**
        1. 트랜잭션 시작
        2. 비즈니스 로직 실행
        3. 커밋 or 롤백
        4. 로그 기록 
3. 코드의 중복을 줄이고 싶을 때
4. 확장을 제어하고 싶을 때

### 1. 추상 클래스 (부모)

> 알고리즘의 뼈대를 정의함.
> 
> 
> 공통 로직은 직접 구현하고, 달라지는 로직은 추상 메서드로 비워둠
> 

```java
abstract class CaffeineBeverage {
    // 템플릿 메서드: 실행 순서를 정의하며, 자식이 오버라이드 하지 못하도록 final 선언
    final void prepareRecipe() {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }

    // 공통 로직
    void boilWater() {
        System.out.println("물 끓이는 중...");
    }

    void pourInCup() {
        System.out.println("컵에 붓는 중...");
    }

    // 상세 구현은 자식에게 맡김
    abstract void brew();
    abstract void addCondiments();
}
```

### 2. 구체 클래스 (자식)

> 부모가 비워든 메서드를 상황에 맞게 구현
> 

```java
class Coffee extends CaffeineBeverage { // 자식은 추상화(부모) 클래스를 상속 받음
    
    @Override
    void brew() {
        System.out.println("필터를 통해 커피를 우려내는 중...");
    }

    @Override
    void addCondiments() {
        System.out.println("설탕과 우유를 추가하는 중...");
    }
}

class Tea extends CaffeineBeverage {
    @Override
    void brew() {
        System.out.println("찻잎을 우려내는 중...");
    }

    @Override
    void addCondiments() {
        System.out.println("레몬을 추가하는 중...");
    }
}
```

### 3. 메인 실행부

```java
public class Main {
    public static void main(String[] args) {
        CaffeineBeverage coffee = new Coffee();
        CaffeineBeverage tea = new Tea();

        System.out.println("--- 커피 준비 ---");
        coffee.prepareRecipe(); // 

        System.out.println("\n--- 차 준비 ---");
        tea.prepareRecipe();
    }
}
```

## 3. 템플릿 메서드의 장/단점

### 장점

- 코드 중복 제거
- 알고리즘 구조 통일
- 확장성 용이 (OCP 만족)
- 상위 클래스가 흐름 통제

### 단점

- 상속 기반 → 유연성 제한
- 클래스 수 증가
- 런타임 변경 어려움 (컴파일 시 결정됨)