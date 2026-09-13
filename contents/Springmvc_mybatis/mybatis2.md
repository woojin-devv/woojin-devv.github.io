---
title: "[Spring] MyBatis Mapper와 CRUD 흐름 정리"
description: "MyBatis의 역할과 Mapper 인터페이스·XML 연결 방식, CRUD 작성법, 파라미터 바인딩, resultMap, 동적 SQL 사용 시 주의점을 정리합니다."
date: 2026-06-19
slug: "/Springmvc_mybatis_2/"
tags: [spring, mybatis]
heroImage: ./heroImage.png
heroImageAlt: "Spring MVC에서 MyBatis Mapper를 사용하는 흐름"
---

## 1. MyBatis란?

MyBatis는 Java 객체와 SQL 실행 결과를 연결해 주는 **SQL Mapper 프레임워크**다.

JDBC만 사용할 때 반복해서 작성해야 하는 `Connection`, `PreparedStatement`, `ResultSet` 처리와 객체 변환을 대신하고, 개발자는 SQL과 매핑 규칙에 집중할 수 있게 해준다.

```text
Controller → Service → Mapper 인터페이스 → Mapper XML → Database
```

MyBatis는 SQL을 자동으로 만들어 주는 JPA와 성격이 다르다. SQL을 직접 작성하기 때문에 복잡한 조회문을 세밀하게 제어하기 좋지만, SQL과 객체의 필드를 개발자가 정확하게 연결해야 한다.

## 2. Mapper 인터페이스와 XML 연결

게시글을 조회하고 저장하는 `NoticeMapper`를 예로 들어 보자.

```java
package com.example.mapper;

import com.example.domain.Notice;
import java.util.List;

public interface NoticeMapper {
    List<Notice> findAll();
    Notice findById(long id);
    int insert(Notice notice);
    int update(Notice notice);
    int delete(long id);
}
```

Mapper XML의 `namespace`는 인터페이스의 전체 경로와 같아야 한다. 각 SQL 태그의 `id`는 실행할 메서드 이름과 연결된다.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "https://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.mapper.NoticeMapper">
  <!-- SQL 작성 영역 -->
</mapper>
```

연결 규칙을 정리하면 다음과 같다.

| Mapper 인터페이스 | Mapper XML |
| --- | --- |
| 인터페이스 전체 경로 | `namespace` |
| 메서드 이름 | SQL 태그의 `id` |
| 메서드 매개변수 | `parameterType` 또는 `#{...}` |
| 메서드 반환 타입 | `resultType` 또는 `resultMap` |

## 3. SELECT 작성하기

### 전체 목록 조회

```xml
<select id="findAll" resultType="com.example.domain.Notice">
  SELECT id,
         title,
         content,
         writer_id AS writerId,
         created_at AS createdAt
  FROM notice
  ORDER BY id DESC
</select>
```

`resultType`에는 한 행을 담을 Java 타입을 작성한다. 조회 결과가 여러 행이어도 인터페이스의 반환 타입을 `List<Notice>`로 선언하면 MyBatis가 각 행을 객체로 변환해 목록으로 반환한다.

DB 컬럼이 `writer_id`이고 Java 필드가 `writerId`라면 위 예시처럼 별칭을 지정할 수 있다. 프로젝트 전역에서 `mapUnderscoreToCamelCase` 옵션을 활성화하는 방법도 있다.

### 단건 조회

```xml
<select id="findById"
        parameterType="long"
        resultType="com.example.domain.Notice">
  SELECT id, title, content, writer_id AS writerId, created_at AS createdAt
  FROM notice
  WHERE id = #{id}
</select>
```

`#{id}`는 전달된 값을 JDBC의 바인딩 파라미터로 처리한다. 값이 SQL 문자열에 직접 합쳐지지 않으므로 일반적인 조건 값에는 `#{...}`를 사용한다.

## 4. INSERT, UPDATE, DELETE 작성하기

```xml
<insert id="insert"
        parameterType="com.example.domain.Notice"
        useGeneratedKeys="true"
        keyProperty="id">
  INSERT INTO notice (title, content, writer_id, created_at)
  VALUES (#{title}, #{content}, #{writerId}, CURRENT_TIMESTAMP)
</insert>

<update id="update" parameterType="com.example.domain.Notice">
  UPDATE notice
  SET title = #{title},
      content = #{content}
  WHERE id = #{id}
</update>

<delete id="delete" parameterType="long">
  DELETE FROM notice
  WHERE id = #{id}
</delete>
```

`insert`, `update`, `delete`의 반환값은 일반적으로 **영향받은 행의 수**다. 따라서 Mapper 메서드를 `int`로 선언하면 작업 성공 여부를 확인하기 쉽다.

```java
int changedRows = noticeMapper.update(notice);

if (changedRows == 0) {
    throw new IllegalArgumentException("수정할 게시글이 없습니다.");
}
```

자동 증가 키를 지원하는 DB에서는 `useGeneratedKeys="true"`와 `keyProperty="id"`를 사용해 생성된 키를 객체의 `id` 필드에 넣을 수 있다. DB 종류에 따라 시퀀스와 `<selectKey>`가 필요할 수 있다.

## 5. 여러 파라미터 전달하기

매개변수가 하나의 객체라면 필드명을 그대로 사용할 수 있다. 여러 값을 따로 전달할 때는 `@Param`으로 이름을 명시하는 편이 안전하다.

```java
List<Notice> findByWriter(
    @Param("writerId") long writerId,
    @Param("status") String status
);
```

```xml
<select id="findByWriter" resultType="com.example.domain.Notice">
  SELECT id, title, content, writer_id AS writerId, created_at AS createdAt
  FROM notice
  WHERE writer_id = #{writerId}
    AND status = #{status}
  ORDER BY id DESC
</select>
```

## 6. `#{}`와 `${}`의 차이

두 문법은 비슷해 보이지만 처리 방식이 다르다.

| 문법 | 처리 방식 | 일반적인 용도 |
| --- | --- | --- |
| `#{value}` | PreparedStatement 바인딩 | 조건 값, 저장할 값 |
| `${value}` | 문자열을 SQL에 그대로 치환 | 검증된 컬럼명 등 제한적인 경우 |

```xml
WHERE title = #{title}
```

`${...}`에 사용자 입력을 그대로 넣으면 SQL Injection이 발생할 수 있다. 정렬 컬럼처럼 바인딩할 수 없는 SQL 구조를 동적으로 바꿔야 한다면, 허용할 값을 Java 코드에서 화이트리스트로 제한하거나 XML의 `<choose>`를 사용한다.

```xml
ORDER BY
<choose>
  <when test="sort == 'oldest'">id ASC</when>
  <otherwise>id DESC</otherwise>
</choose>
```

## 7. `resultMap`으로 결과 매핑하기

컬럼명과 필드명이 많이 다르거나 객체 안에 다른 객체가 포함되는 경우에는 `resultMap`이 더 명확하다.

```xml
<resultMap id="noticeResultMap" type="com.example.domain.Notice">
  <id property="id" column="notice_id" />
  <result property="title" column="notice_title" />
  <result property="content" column="notice_content" />
  <result property="writerId" column="writer_id" />
  <result property="createdAt" column="created_at" />
</resultMap>

<select id="findById" resultMap="noticeResultMap">
  SELECT id AS notice_id,
         title AS notice_title,
         content AS notice_content,
         writer_id,
         created_at
  FROM notice
  WHERE id = #{id}
</select>
```

- `<id>`: 객체를 식별하는 기본 키 매핑
- `<result>`: 일반 컬럼과 필드 매핑
- `<association>`: 일대일 관계의 객체 매핑
- `<collection>`: 일대다 관계의 컬렉션 매핑

단순한 조회는 `resultType`으로 충분하지만, JOIN 결과나 중첩 객체를 다룰 때는 `resultMap`을 사용하면 매핑 의도가 분명해진다.

## 8. 동적 SQL 사용하기

검색 조건이 선택 사항일 때 문자열을 직접 이어 붙이지 않고 MyBatis의 동적 SQL 태그를 사용할 수 있다.

```xml
<select id="search" resultType="com.example.domain.Notice">
  SELECT id, title, content, writer_id AS writerId, created_at AS createdAt
  FROM notice
  <where>
    <if test="title != null and title != ''">
      AND title LIKE CONCAT('%', #{title}, '%')
    </if>
    <if test="writerId != null">
      AND writer_id = #{writerId}
    </if>
  </where>
  ORDER BY id DESC
</select>
```

`<where>`는 내부 조건이 있을 때만 `WHERE`를 추가하고, 첫 번째 조건 앞의 불필요한 `AND` 또는 `OR`도 정리한다. 수정할 값이 선택적인 경우에는 `<set>`, 목록 조건에는 `<foreach>`를 활용할 수 있다.

## 9. Service에서 Mapper 사용하기

Mapper는 DB 접근에 집중하고 트랜잭션의 경계는 Service 계층에 두는 것이 일반적이다.

```java
@Service
public class NoticeService {

    private final NoticeMapper noticeMapper;

    public NoticeService(NoticeMapper noticeMapper) {
        this.noticeMapper = noticeMapper;
    }

    @Transactional
    public long create(Notice notice) {
        noticeMapper.insert(notice);
        return notice.getId();
    }
}
```

하나의 비즈니스 작업에서 여러 SQL을 실행한다면 `@Transactional`로 묶어 중간에 예외가 발생했을 때 전체 작업이 함께 롤백되도록 한다.

## 10. 자주 발생하는 오류

### `Invalid bound statement (not found)`

- Mapper XML의 `namespace`와 인터페이스 전체 경로가 다른지 확인한다.
- XML의 SQL `id`와 메서드 이름이 같은지 확인한다.
- `mapperLocations`가 실제 XML 경로를 읽고 있는지 확인한다.

### 조회 결과 필드가 `null`인 경우

- DB 컬럼명과 Java 필드명이 일치하는지 확인한다.
- SQL 별칭, camel case 설정 또는 `resultMap`을 사용한다.
- getter/setter가 정상적으로 존재하는지 확인한다.

### 파라미터를 찾지 못하는 경우

- XML에 작성한 이름과 객체 필드명이 같은지 확인한다.
- 여러 매개변수에는 `@Param`을 명시한다.
- 값에는 `${}`가 아니라 `#{}`를 우선 사용한다.

## 정리

MyBatis의 핵심은 **Java 메서드와 SQL을 정확하게 연결하는 것**이다.

1. Mapper 인터페이스 경로와 XML의 `namespace`를 맞춘다.
2. 메서드 이름과 SQL 태그의 `id`를 맞춘다.
3. 입력값은 `#{}`로 안전하게 바인딩한다.
4. 단순 결과는 `resultType`, 복잡한 결과는 `resultMap`으로 매핑한다.
5. 선택 조건은 `<if>`, `<where>`, `<choose>` 등의 동적 SQL로 처리한다.
6. 트랜잭션은 비즈니스 작업을 묶는 Service 계층에서 관리한다.

이 흐름을 이해하면 Mapper 오류가 발생했을 때 인터페이스, XML, 파라미터, 결과 매핑 중 어느 지점을 확인해야 하는지 빠르게 찾을 수 있다.
