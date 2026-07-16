---
title: "[Oracle] SQL 코딩테스트 정리" 
description: "Oracle SQL 코딩테스트에서 자주 쓰는 정렬, NULL 처리, 집계, 조인, 문자열, 날짜, 조건문, 윈도우 함수, 서브쿼리 패턴 정리"
date: 2026-07-09
slug: "/sql-practice/"
tags: ["SQL"]
heroImageUrl: "https://yt3.googleusercontent.com/wH4UKFDaD7ibQoRkZR_Ck2JW4WZ264pq4r9yke3YrxByS1V5EYZAJu3CIBbsJ6C8Pwmrw4Xv=s900-c-k-c0x00ffffff-no-rj"
heroImageAlt: "[ORACLE] 정리"
---

# Oracle SQL 코딩테스트 정리

SQL 코딩테스트에서는 문법을 많이 아는 것보다, 문제에서 요구하는 조건을 `SELECT`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY` 순서로 정확히 옮기는 것이 중요하다.

## 0. SELECT 실행 순서

실제 작성 순서와 실행 순서는 다르다.

```sql
SELECT 컬럼명                 -- 5
FROM 테이블명                 -- 1
WHERE 조건                   -- 2
GROUP BY 그룹기준             -- 3
HAVING 그룹조건               -- 4
ORDER BY 정렬기준             -- 6
FETCH FIRST N ROWS ONLY;      -- 7
```

### 코딩테스트 체크 포인트

- 일반 조건은 `WHERE`
- 집계 함수 조건은 `HAVING`
- `GROUP BY`를 사용하면 `SELECT`에는 그룹 기준 컬럼 또는 집계 함수만 사용
- `ORDER BY`는 `SELECT` 별칭 사용 가능

---

## 1. 출력되는 행 제한하기 (FETCH CLAUSE)

### 1.1 기본 문법

```sql
SELECT 컬럼명
FROM 테이블명
ORDER BY 정렬기준
FETCH FIRST 숫자 ROWS ONLY;
```

### 1.2 상위 N개 조회

```sql
SELECT *
FROM ANIMAL_INS
ORDER BY DATETIME
FETCH FIRST 3 ROWS ONLY;
```

`FIRST`와 `NEXT`는 같은 의미로 사용할 수 있다.

```sql
FETCH FIRST 3 ROWS ONLY;
FETCH NEXT 3 ROWS ONLY;
```

### 1.3 가장 최근 데이터 1개

```sql
SELECT NAME
FROM ANIMAL_INS
ORDER BY DATETIME DESC
FETCH FIRST 1 ROW ONLY;
```

> `FETCH FIRST`를 사용할 때는 보통 `ORDER BY`와 함께 사용한다. 정렬 기준이 없으면 어떤 행이 먼저 나올지 보장하기 어렵다.

---

## 2. NULL 처리

`NULL`은 값이 없다는 뜻이다. `= NULL`, `!= NULL`처럼 비교하면 안 된다.

### 2.1 IS NULL / IS NOT NULL

```sql
SELECT ANIMAL_ID
FROM ANIMAL_INS
WHERE NAME IS NULL;
```

```sql
SELECT ANIMAL_ID
FROM ANIMAL_INS
WHERE NAME IS NOT NULL;
```

### 2.2 NVL

> 검사할 데이터 또는 컬럼이 `NULL`이 아니라면 그대로 출력하고, `NULL`이면 기본값을 반환한다.

```sql
NVL(NULL인지_검사할_컬럼, NULL일_경우_반환할_값)
```

```sql
SELECT ANIMAL_TYPE,
       NVL(NAME, 'No name') AS NAME,
       SEX_UPON_INTAKE
FROM ANIMAL_INS
ORDER BY ANIMAL_ID;
```

### 2.3 NVL2

`NULL` 여부에 따라 서로 다른 값을 반환한다.

```sql
NVL2(컬럼명, NULL이_아닐_때_값, NULL일_때_값)
```

```sql
SELECT NAME,
       NVL2(NAME, 'O', 'X') AS NAME_EXISTS
FROM ANIMAL_INS;
```

### 2.4 COALESCE

왼쪽부터 확인해서 처음으로 `NULL`이 아닌 값을 반환한다.

```sql
SELECT COALESCE(NICKNAME, NAME, 'UNKNOWN') AS DISPLAY_NAME
FROM USERS;
```

---

## 3. 정렬 (ORDER BY)

### 3.1 오름차순 / 내림차순

```sql
SELECT *
FROM ANIMAL_INS
ORDER BY ANIMAL_ID ASC;
```

```sql
SELECT *
FROM ANIMAL_INS
ORDER BY DATETIME DESC;
```

`ASC`는 생략 가능하다.

### 3.2 여러 기준 정렬

```sql
SELECT ANIMAL_ID, NAME, DATETIME
FROM ANIMAL_INS
ORDER BY NAME ASC, DATETIME DESC;
```

앞의 기준이 같을 때 다음 기준으로 정렬한다.

### 3.3 CASE로 조건 정렬

```sql
SELECT ANIMAL_ID, NAME, ANIMAL_TYPE
FROM ANIMAL_INS
ORDER BY CASE WHEN ANIMAL_TYPE = 'Dog' THEN 0 ELSE 1 END,
         NAME;
```

특정 값을 먼저 보여줘야 할 때 자주 사용한다.

---

## 4. 중복 제거 (DISTINCT)

### 4.1 단일 컬럼 중복 제거

```sql
SELECT DISTINCT ANIMAL_TYPE
FROM ANIMAL_INS
ORDER BY ANIMAL_TYPE;
```

### 4.2 여러 컬럼 조합 중복 제거

```sql
SELECT DISTINCT ANIMAL_TYPE, SEX_UPON_INTAKE
FROM ANIMAL_INS;
```

여러 컬럼을 쓰면 각 컬럼의 조합이 중복 제거 기준이 된다.

### 4.3 중복 제거 후 개수 세기

```sql
SELECT COUNT(DISTINCT NAME) AS COUNT
FROM ANIMAL_INS
WHERE NAME IS NOT NULL;
```

---

## 5. 집계 함수

### 5.1 자주 쓰는 집계 함수

| 함수          | 의미                              |
| ------------- | --------------------------------- |
| `COUNT(*)`    | 전체 행 개수                      |
| `COUNT(컬럼)` | 해당 컬럼이 `NULL`이 아닌 행 개수 |
| `SUM(컬럼)`   | 합계                              |
| `AVG(컬럼)`   | 평균                              |
| `MIN(컬럼)`   | 최솟값                            |
| `MAX(컬럼)`   | 최댓값                            |

### 5.2 전체 개수

```sql
SELECT COUNT(*) AS COUNT
FROM ANIMAL_INS;
```

### 5.3 최댓값 / 최솟값

```sql
SELECT MAX(DATETIME) AS 시간
FROM ANIMAL_INS;
```

```sql
SELECT MIN(DATETIME) AS 시간
FROM ANIMAL_INS;
```

### 5.4 평균 반올림

```sql
SELECT ROUND(AVG(DAILY_FEE), 0) AS AVERAGE_FEE
FROM CAR_RENTAL_COMPANY_CAR
WHERE CAR_TYPE = 'SUV';
```

---

## 6. GROUP BY / HAVING

### 6.1 그룹별 개수

```sql
SELECT ANIMAL_TYPE, COUNT(*) AS COUNT
FROM ANIMAL_INS
GROUP BY ANIMAL_TYPE
ORDER BY ANIMAL_TYPE;
```

### 6.2 그룹별 조건

집계 결과에 조건을 걸 때는 `HAVING`을 사용한다.

```sql
SELECT NAME, COUNT(*) AS COUNT
FROM ANIMAL_INS
WHERE NAME IS NOT NULL
GROUP BY NAME
HAVING COUNT(*) >= 2
ORDER BY NAME;
```

### 6.3 WHERE와 HAVING 차이

```sql
SELECT CATEGORY, COUNT(*) AS PRODUCTS
FROM PRODUCT
WHERE PRICE >= 10000
GROUP BY CATEGORY
HAVING COUNT(*) >= 2;
```

- `WHERE PRICE >= 10000`: 그룹을 만들기 전에 행을 필터링
- `HAVING COUNT(*) >= 2`: 그룹을 만든 뒤 집계 결과를 필터링

---

## 7. 문자열 처리

### 7.1 LIKE

```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE NAME LIKE 'A%';
```

| 패턴    | 의미           |
| ------- | -------------- |
| `'A%'`  | A로 시작       |
| `'%A'`  | A로 끝남       |
| `'%A%'` | A 포함         |
| `'A_'`  | A 뒤에 한 글자 |

### 7.2 NOT LIKE

```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE NAME NOT LIKE '%el%';
```

### 7.3 대소문자 처리

```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE UPPER(NAME) LIKE '%EL%';
```

```sql
SELECT LOWER(NAME) AS NAME
FROM ANIMAL_INS;
```

### 7.4 문자열 자르기

```sql
SELECT SUBSTR(PRODUCT_CODE, 1, 2) AS CATEGORY
FROM PRODUCT;
```

Oracle의 `SUBSTR` 시작 위치는 1부터 시작한다.

### 7.5 문자열 길이

```sql
SELECT NAME
FROM ANIMAL_INS
WHERE LENGTH(NAME) >= 5;
```

### 7.6 문자열 연결

```sql
SELECT NAME || ' - ' || ANIMAL_TYPE AS INFO
FROM ANIMAL_INS;
```

---

## 8. 날짜 처리

### 8.1 날짜 포맷 변경

```sql
SELECT ANIMAL_ID,
       NAME,
       TO_CHAR(DATETIME, 'YYYY-MM-DD') AS 날짜
FROM ANIMAL_INS
ORDER BY ANIMAL_ID;
```

### 8.2 연도 / 월 / 일 추출

```sql
SELECT EXTRACT(YEAR FROM DATETIME) AS YEAR
FROM ANIMAL_INS;
```

```sql
SELECT TO_CHAR(DATETIME, 'MM') AS MONTH
FROM ANIMAL_INS;
```

### 8.3 특정 기간 조회

```sql
SELECT *
FROM ANIMAL_INS
WHERE DATETIME >= TO_DATE('2022-01-01', 'YYYY-MM-DD')
  AND DATETIME < TO_DATE('2023-01-01', 'YYYY-MM-DD');
```

날짜 컬럼에 시간이 포함되어 있을 수 있으므로, 특정 연도나 월을 조회할 때는 종료일을 `< 다음 날짜`로 잡는 방식이 안전하다.

### 8.4 날짜 차이

```sql
SELECT O.ANIMAL_ID,
       O.NAME
FROM ANIMAL_OUTS O
JOIN ANIMAL_INS I
  ON O.ANIMAL_ID = I.ANIMAL_ID
ORDER BY O.DATETIME - I.DATETIME DESC
FETCH FIRST 2 ROWS ONLY;
```

Oracle에서 날짜끼리 빼면 일 단위 차이가 나온다.

---

## 9. 조건문

### 9.1 CASE WHEN

```sql
SELECT ANIMAL_ID,
       NAME,
       CASE
         WHEN SEX_UPON_INTAKE LIKE 'Neutered%' THEN 'O'
         WHEN SEX_UPON_INTAKE LIKE 'Spayed%' THEN 'O'
         ELSE 'X'
       END AS 중성화
FROM ANIMAL_INS
ORDER BY ANIMAL_ID;
```

### 9.2 DECODE

값이 정확히 일치하는 경우에는 `DECODE`도 사용할 수 있다.

```sql
SELECT ANIMAL_ID,
       NAME,
       DECODE(ANIMAL_TYPE, 'Dog', '강아지', 'Cat', '고양이', '기타') AS TYPE_NAME
FROM ANIMAL_INS;
```

복잡한 조건은 `CASE WHEN`이 더 읽기 쉽다.

---

## 10. JOIN

### 10.1 INNER JOIN

두 테이블 모두에 매칭되는 데이터만 조회한다.

```sql
SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I
JOIN ANIMAL_OUTS O
  ON I.ANIMAL_ID = O.ANIMAL_ID;
```

### 10.2 LEFT OUTER JOIN

왼쪽 테이블은 모두 남기고, 오른쪽 테이블에 매칭되는 데이터가 없으면 `NULL`로 채운다.

```sql
SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I
LEFT JOIN ANIMAL_OUTS O
  ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE O.ANIMAL_ID IS NULL
ORDER BY I.ANIMAL_ID;
```

입양을 못 간 동물을 찾는 문제처럼, 한쪽에는 있고 다른 쪽에는 없는 데이터를 찾을 때 자주 사용한다.

### 10.3 SELF JOIN

같은 테이블을 두 번 사용해서 비교한다.

```sql
SELECT A.ID, A.NAME, B.NAME AS PARENT_NAME
FROM ECOLI_DATA A
LEFT JOIN ECOLI_DATA B
  ON A.PARENT_ID = B.ID;
```

---

## 11. IN / EXISTS

### 11.1 IN

```sql
SELECT *
FROM FOOD_PRODUCT
WHERE CATEGORY IN ('과자', '국', '김치');
```

서브쿼리와 함께 사용할 수도 있다.

```sql
SELECT NAME
FROM ANIMAL_INS
WHERE ANIMAL_ID IN (
    SELECT ANIMAL_ID
    FROM ANIMAL_OUTS
);
```

### 11.2 NOT IN 주의

`NOT IN`의 서브쿼리 결과에 `NULL`이 포함되면 의도와 다르게 결과가 안 나올 수 있다.

```sql
SELECT NAME
FROM ANIMAL_INS
WHERE ANIMAL_ID NOT IN (
    SELECT ANIMAL_ID
    FROM ANIMAL_OUTS
    WHERE ANIMAL_ID IS NOT NULL
);
```

### 11.3 EXISTS

조건을 만족하는 행이 존재하는지 확인한다.

```sql
SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I
WHERE EXISTS (
    SELECT 1
    FROM ANIMAL_OUTS O
    WHERE O.ANIMAL_ID = I.ANIMAL_ID
);
```

---

## 12. 서브쿼리

### 12.1 최댓값과 같은 행 조회

```sql
SELECT PRODUCT_ID, PRODUCT_NAME, PRICE
FROM FOOD_PRODUCT
WHERE PRICE = (
    SELECT MAX(PRICE)
    FROM FOOD_PRODUCT
);
```

### 12.2 그룹별 최댓값 조회

```sql
SELECT CATEGORY, PRICE, PRODUCT_NAME
FROM FOOD_PRODUCT
WHERE (CATEGORY, PRICE) IN (
    SELECT CATEGORY, MAX(PRICE)
    FROM FOOD_PRODUCT
    GROUP BY CATEGORY
)
ORDER BY CATEGORY;
```

### 12.3 FROM 절 서브쿼리

```sql
SELECT CATEGORY, COUNT(*) AS COUNT
FROM (
    SELECT SUBSTR(PRODUCT_CODE, 1, 2) AS CATEGORY
    FROM PRODUCT
)
GROUP BY CATEGORY
ORDER BY CATEGORY;
```

---

## 13. 윈도우 함수

윈도우 함수는 행을 유지한 상태로 순위나 누적값을 계산할 때 사용한다.

### 13.1 ROW_NUMBER

```sql
SELECT *
FROM (
    SELECT ANIMAL_ID,
           NAME,
           DATETIME,
           ROW_NUMBER() OVER (ORDER BY DATETIME DESC) AS RN
    FROM ANIMAL_INS
)
WHERE RN <= 3;
```

### 13.2 RANK / DENSE_RANK

```sql
SELECT NAME,
       SCORE,
       RANK() OVER (ORDER BY SCORE DESC) AS RANK,
       DENSE_RANK() OVER (ORDER BY SCORE DESC) AS DENSE_RANK
FROM STUDENT;
```

| 함수         | 특징                                          |
| ------------ | --------------------------------------------- |
| `ROW_NUMBER` | 무조건 1, 2, 3 순서 부여                      |
| `RANK`       | 동점이면 같은 순위, 다음 순위는 건너뜀        |
| `DENSE_RANK` | 동점이면 같은 순위, 다음 순위를 건너뛰지 않음 |

### 13.3 그룹별 상위 N개

```sql
SELECT CATEGORY, PRODUCT_NAME, PRICE
FROM (
    SELECT CATEGORY,
           PRODUCT_NAME,
           PRICE,
           ROW_NUMBER() OVER (
               PARTITION BY CATEGORY
               ORDER BY PRICE DESC
           ) AS RN
    FROM FOOD_PRODUCT
)
WHERE RN = 1
ORDER BY CATEGORY;
```

### 13.4 누적합

```sql
SELECT SALES_DATE,
       AMOUNT,
       SUM(AMOUNT) OVER (
           ORDER BY SALES_DATE
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS CUMULATIVE_AMOUNT
FROM SALES;
```

---

## 14. 숫자 함수

### 14.1 반올림 / 버림 / 올림

```sql
SELECT ROUND(123.456, 2) AS ROUND_VALUE,
       TRUNC(123.456, 2) AS TRUNC_VALUE,
       CEIL(123.456) AS CEIL_VALUE,
       FLOOR(123.456) AS FLOOR_VALUE
FROM DUAL;
```

| 함수                | 결과   |
| ------------------- | ------ |
| `ROUND(123.456, 2)` | 123.46 |
| `TRUNC(123.456, 2)` | 123.45 |
| `CEIL(123.456)`     | 124    |
| `FLOOR(123.456)`    | 123    |

### 14.2 나머지

```sql
SELECT MOD(10, 3) AS RESULT
FROM DUAL;
```

짝수 / 홀수 조건에서 자주 사용한다.

```sql
SELECT *
FROM PLACES
WHERE MOD(ID, 2) = 0;
```

---

## 15. Oracle에서 자주 막히는 포인트

### 15.1 별칭에 큰따옴표를 쓰는 경우

```sql
SELECT MAX(DATETIME) AS "시간"
FROM ANIMAL_INS;
```

한글 별칭이나 공백이 있는 별칭은 큰따옴표를 사용할 수 있다.

### 15.2 문자열은 작은따옴표

```sql
WHERE ANIMAL_TYPE = 'Dog'
```

문자열 값은 작은따옴표를 사용한다. 큰따옴표는 주로 컬럼명, 별칭 같은 식별자에 사용한다.

### 15.3 Oracle에는 LIMIT가 없다

MySQL에서는 아래처럼 쓰지만,

```sql
SELECT *
FROM ANIMAL_INS
LIMIT 3;
```

Oracle에서는 `FETCH FIRST` 또는 `ROWNUM`을 사용한다.

```sql
SELECT *
FROM ANIMAL_INS
ORDER BY DATETIME
FETCH FIRST 3 ROWS ONLY;
```

### 15.4 ROWNUM 사용 시 정렬 주의

잘못된 예:

```sql
SELECT *
FROM ANIMAL_INS
WHERE ROWNUM <= 3
ORDER BY DATETIME;
```

올바른 예:

```sql
SELECT *
FROM (
    SELECT *
    FROM ANIMAL_INS
    ORDER BY DATETIME
)
WHERE ROWNUM <= 3;
```

`ROWNUM`은 정렬보다 먼저 붙기 때문에, 정렬 후 상위 N개가 필요하면 서브쿼리로 먼저 정렬해야 한다.

---

## 16. 코딩테스트 문제 풀이 순서

### 16.1 기본 풀이 흐름

1. 어떤 테이블을 사용할지 정한다.
2. 필요한 컬럼만 `SELECT`에 적는다.
3. 일반 조건은 `WHERE`에 적는다.
4. 그룹별 계산이 필요하면 `GROUP BY`를 사용한다.
5. 집계 결과 조건은 `HAVING`에 적는다.
6. 출력 순서를 `ORDER BY`로 맞춘다.
7. 상위 N개면 마지막에 `FETCH FIRST`를 붙인다.

### 16.2 자주 나오는 문제 유형

| 유형                 | 핵심 문법                              |
| -------------------- | -------------------------------------- |
| 상위 N개             | `ORDER BY`, `FETCH FIRST`              |
| NULL 대체            | `NVL`, `COALESCE`                      |
| 종류별 개수          | `GROUP BY`, `COUNT`                    |
| 중복 제거            | `DISTINCT`                             |
| 특정 문자열 포함     | `LIKE`, `UPPER`                        |
| 날짜 포맷            | `TO_CHAR`                              |
| 한쪽에만 있는 데이터 | `LEFT JOIN`, `IS NULL`                 |
| 그룹별 1등           | `ROW_NUMBER() OVER (PARTITION BY ...)` |
| 조건별 표시          | `CASE WHEN`                            |

### 16.3 기본 템플릿

```sql
SELECT 출력컬럼
FROM 테이블명
WHERE 일반조건
GROUP BY 그룹기준
HAVING 집계조건
ORDER BY 정렬기준;
```

필요 없는 절은 지우고 사용하면 된다.
