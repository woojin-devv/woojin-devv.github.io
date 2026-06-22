---
title: "[Java] Record 정리"
description: "개선된 for문 인터페이스 인터페이스는 소프트웨어 설계 최상위 단계 인터페이스는 무에서 유를 창조 인터페이스란? 약속, 규칙, 규약, 표준 을 만드는 행위를 말함 표준이란? 아이폰의 C타입 충전 볼트를 조일 때 오른쪽 엘리베이터의 상승 버튼 (삼각형)등 ISO(International "
date: 2026-06-22
slug: "/java-record/"
tags: ["java"]
heroImageAlt: "[008] 자바 인터페이스 정리"
---

## **1. Record란?**

`record`는 **데이터를 담기 위한 불변 객체**를 간단하게 만들 수 있는 Java 문법입니다.

기존에는 DTO나 VO를 만들 때 아래 코드를 반복해서 작성해야 했습니다.

```java
private final String name;
private final int age;

public Person(String name, int age) {
    this.name = name;
    this.age = age;
}

public String getName() {
    return name;
}

public int getAge() {
    return age;
}

@Override
public String toString() { ... }

@Override
public boolean equals(Object o) { ... }

@Override
public int hashCode() { ... }
```

이런 반복 코드를 **보일러플레이트 코드**라고 합니다.

Record를 사용하면 위 코드를 한 줄로 줄일 수 있습니다.

```java
public record Person(String name, int age) {
}
```


# **2. Record의 도입 시점**

| **버전** | **상태**     |
| -------- | ------------ |
| Java 14  | Preview 기능 |
| Java 16  | 정식 도입    |

즉, **Java 16 이상부터 공식 문법**으로 사용할 수 있습니다.


# **3. 기본 문법**

```java
public record Point(int x, int y) {
}
```

위 코드는 컴파일 시 자동으로 다음 요소를 생성합니다.

```java
private final int x;
private final int y;

public Point(int x, int y) {
    this.x = x;
    this.y = y;
}

public int x() {
    return x;
}

public int y() {
    return y;
}

equals()
hashCode()
toString()
```



# **4. 사용 예시**

```java
public class Main {
    public static void main(String[] args) {
        Person person1 = new Person("홍길동", 30);
        Person person2 = new Person("이순신", 45);
        Person person3 = new Person("홍길동", 30);

        System.out.println(person1.name());
        System.out.println(person2.age());

        System.out.println(person1);
        System.out.println(person1.equals(person3));
        System.out.println(person1.equals(person2));
    }
}
```

출력 예시는 다음과 같습니다.

```
홍길동
45
Person[name=홍길동, age=30]
true
false
```


# **5. Getter 이름 차이**

일반 클래스에서는 보통 이렇게 접근합니다.

```java
person.getName();
person.getAge();
```

하지만 Record는 `getName()` 형식이 아닙니다.

```java
person.name();
person.age();
```

따라서 아래 코드는 오류입니다.

```java
person.getName(); // 오류
```

Record는 **필드명과 같은 이름의 접근자 메서드**를 자동 생성합니다.


# **6. Record의 특징**

| **항목**        | **설명**                           |
| --------------- | ---------------------------------- |
| 불변성          | 필드가 자동으로 `private final`    |
| 생성자          | 모든 필드를 받는 생성자 자동 생성  |
| Getter          | `getX()`가 아니라 `x()` 형식       |
| equals/hashCode | 자동 생성                          |
| toString        | 자동 생성                          |
| 상속            | 다른 클래스 상속 불가              |
| 인터페이스      | 구현 가능                          |
| 부모 클래스     | 암묵적으로 `java.lang.Record` 상속 |


# **7. 불변 객체라는 의미**

Record의 필드는 자동으로 `final`입니다.

```java
public record Point(int x, int y) {
}
```

따라서 아래처럼 값을 바꿀 수 없습니다.

```java
Point p = new Point(10, 20);

p.x = 100;     // 오류
p.setX(100);   // 오류
```

즉, Record는 생성된 뒤 내부 값을 변경하지 않는 **Immutable Object**입니다.


# **8. Record를 쓰기 좋은 경우**

Record는 단순히 데이터를 전달하는 객체에 적합합니다.

| **용도**           | **사용 여부** |
| ------------------ | ------------- |
| Request DTO        | 적합          |
| Response DTO       | 적합          |
| API 응답 객체      | 적합          |
| VO, Value Object   | 적합          |
| 설정값 객체        | 적합          |
| MyBatis DTO        | 적합          |
| REST API 결과 객체 | 적합          |

예시:

```java
public record UserResponse(
    Long id,
    String name,
    String email
) {
}
```

DTO처럼 **데이터만 담는 클래스**라면 Record가 깔끔합니다.


# **9. Record를 피해야 하는 경우**

## **JPA Entity에는 부적합**

JPA Entity는 보통 Record로 만들지 않습니다.

```java
@Entity
public class Member {
    @Id
    private Long id;

    private String name;
}
```

JPA Entity가 일반 클래스를 사용하는 이유는 다음과 같습니다.

| **이유**         | **설명**                                  |
| ---------------- | ----------------------------------------- |
| 기본 생성자 필요 | JPA는 객체 생성을 위해 기본 생성자가 필요 |
| 프록시 객체 생성 | 지연 로딩을 위해 프록시 객체를 사용       |
| Dirty Checking   | 필드 변경을 감지해서 update 처리          |
| 가변 상태 필요   | Entity는 상태 변경이 자주 발생            |

Record는 불변 객체라서 JPA Entity와 맞지 않습니다.

```java
public record Member(Long id, String name) {
}
```

이런 방식은 JPA Entity로는 적합하지 않습니다.

# **10. Lombok vs Record**

| **항목**                 | **Record**  | **Lombok** |
| ------------------------ | ----------- | ---------- |
| 불변 기본                | O           | X          |
| Getter 자동 생성         | O           | O          |
| Setter 자동 생성         | X           | O 가능     |
| equals/hashCode/toString | O           | O          |
| 상속                     | 불가(final) | 가능       |
| 생성자 유연성            | 제한적      | 유연       |
| 외부 라이브러리 필요     | X           | O          |
| Java 표준 기능           | O           | X          |


# **11. 실무 기준 정리**

간단하게 기억하면 됩니다.

```
DTO = Record 사용 가능
Entity = Class 사용
```

예를 들어 Spring Boot에서 API 응답 DTO는 Record로 작성하기 좋습니다.

```java
public record UserResponse(
    Long id,
    String name,
    String email
) {
}
```

반면 JPA Entity는 일반 클래스로 작성합니다.

```java
@Entity
public class User {
    @Id
    private Long id;

    private String name;
    private String email;
}
```
