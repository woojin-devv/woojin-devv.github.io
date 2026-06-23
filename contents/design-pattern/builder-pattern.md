---
title: "Builder 패턴 정리"
description: "Builder 패턴이란?"
date: 2026-06-23
slug: "/builder-pattern/"
tags: [design-pattern]
heroImageAlt: "Builder 패턴 정리"
---

## Builder 패턴
> 복잡한 객체를 단계적으로 생성할 수 있게 해주는 생성 디자인 패턴

### 왜 필요한가? 
- 생성자(Constructor)만 사용할 때의 문제점

```java
// 매개변수가 많아지면 어떤 값이 뭔지 알기 어려움
User user = new User("홍길동", 25, "hong@email.com", "서울", "010-1234-5678", true, null);
//                      ↑     ↑         ↑            ↑           ↑          ↑     ↑
//                     이름    나이      이메일         주소        전화번호   활성화  프로필
```

-> *이걸 점층적 생성자 패턴으로 해결하려 하면 더 복잡해짐*

```java
public User(String name) { ... }
public User(String name, int age) { ... }
public User(String name, int age, String email) { ... }
// ... 생성자가 폭발적으로 늘어남
```

### Builder 패턴 구조 

```java
public class User {
    // 필드 (final로 불변 객체 보장)
    private final String name;      // 필수
    private final int age;          // 필수
    private final String email;     // 선택
    private final String address;   // 선택
    private final String phone;     // 선택

    // private 생성자 → Builder를 통해서만 생성 가능
    private User(Builder builder) {
        this.name    = builder.name;
        this.age     = builder.age;
        this.email   = builder.email;
        this.address = builder.address;
        this.phone   = builder.phone;
    }

    // 정적 중첩 클래스
    public static class Builder {
        // 필수 값
        private final String name;
        private final int age;

        // 선택 값 (기본값 설정)
        private String email   = "";
        private String address = "";
        private String phone   = "";

        // 필수 값은 Builder 생성자에서 받음
        public Builder(String name, int age) {
            this.name = name;
            this.age  = age;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public Builder address(String address) {
            this.address = address;
            return this;
        }

        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }

        // 최종 객체 생성
        public User build() {
            return new User(this);
        }
    }
}
```

### 사용 방법 

```java
// 필수값만
User user1 = new User.Builder("홍길동", 25)
    .build();

// 선택값 추가
User user2 = new User.Builder("홍길동", 25)
    .email("hong@email.com")
    .address("서울")
    .phone("010-1234-5678")
    .build();
```

### Lombok으로 간단하게 

```java

@Getter
@Builder
public class User {
    private String name;
    private int age;
    private String email;
    private String address;
    private String phone;
}

// 사용
User user = User.builder()
    .name("홍길동")
    .age(25)
    .email("hong@email.com")
    .build();
```