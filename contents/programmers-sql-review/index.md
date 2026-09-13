---
title: "[SQL] 프로그래머스 오답 노트 - GROUP BY, JOIN"
description: "프로그래머스에서 다시 풀어볼 SQL 문제를 GROUP BY와 JOIN 중심으로 정리하고, 틀린 이유와 수정 과정, 핵심 쿼리 패턴을 기록하는 오답 노트입니다."
date: 2026-09-13
slug: "/programmers-sql-review/"
tags: ["SQL", "Programmers", "Coding Test"]
heroImageAlt: "프로그래머스 SQL 오답 노트"
---

# 프로그래머스 SQL 오답 노트

문제를 맞혔는지보다 **어떤 조건을 놓쳤고, 다음에는 어떻게 알아챌지**를 남기기 위한 기록이다.

각 문제는 다음 순서로 복습한다.

1. 문제의 요구사항을 한 문장으로 요약한다.
2. 처음 작성한 쿼리와 실패 원인을 기록한다.
3. 수정한 쿼리에서 달라진 부분을 설명한다.
4. 같은 실수를 막기 위한 체크 포인트를 한 줄로 남긴다.

> 정답률은 문제를 선별한 시점의 화면을 기준으로 작성했다.

## 문제 목록

| 번호 | 문제                                                                                                                                  | 난이도 | 유형     | 정답률 | 복습 상태 |
| ---: | ------------------------------------------------------------------------------------------------------------------------------------- | :----: | -------- | -----: | :-------: |
|    1 | [입양 시각 구하기(1)](https://school.programmers.co.kr/learn/courses/30/lessons/59412)                                                | Lv. 2  | GROUP BY |    89% |     ⬜     |
|    2 | [즐겨찾기가 가장 많은 식당 정보 출력하기](https://school.programmers.co.kr/learn/courses/30/lessons/131123)                           | Lv. 3  | GROUP BY |    85% |     ⬜     |
|    3 | [자동차 대여 기록에서 대여중 / 대여 가능 여부 구분하기](https://school.programmers.co.kr/learn/courses/30/lessons/157340)             | Lv. 3  | GROUP BY |    79% |     ⬜     |
|    4 | [노선별 평균 역 사이 거리 조회하기](https://school.programmers.co.kr/learn/courses/30/lessons/284531)                                 | Lv. 2  | GROUP BY |    78% |     ⬜     |
|    5 | [대여 횟수가 많은 자동차들의 월별 대여 횟수 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/151139?language=oracle) | Lv. 3  | GROUP BY |    75% |     ⬜     |
|    6 | [카펫](https://school.programmers.co.kr/learn/courses/30/lessons/42842)                                                               | Lv. 2  | 완전탐색 |    74% |     ⬜     |
|    7 | [특정 기간동안 대여 가능한 자동차들의 대여비용 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/157339)              | Lv. 4  | JOIN     |    53% |     ⬜     |
|    8 | [상품을 구매한 회원 비율 구하기](https://school.programmers.co.kr/learn/courses/30/lessons/131534?language=oracle)                    | Lv. 5  | JOIN     |    48% |     ⬜     |

---

## 1. 입양 시각 구하기(1)

- 난이도: `Lv. 2`
- 유형: `GROUP BY`
- 핵심 키워드: 시간 추출, 시간대별 집계, 정렬

### 문제 요약

09시부터 19시까지 각 시간대에 발생한 입양 건수를 집계하고, 시간순으로 출력하는 문제다.

- 조회 대상: 09시부터 19시까지의 입양 기록
- 집계 기준: 입양 시간대
- 출력 순서: 시간 오름차순

```sql
SELECT TO_NUMBER(TO_CHAR(DATETIME, 'HH24')) AS HOUR, 
       COUNT(*) AS COUNT
FROM ANIMAL_OUTS
GROUP BY TO_NUMBER(TO_CHAR(DATETIME, 'HH24'))
HAVING TO_NUMBER(TO_CHAR(DATETIME, 'HH24')) BETWEEN 9 AND 19
ORDER BY TO_NUMBER(TO_CHAR(DATETIME, 'HH24')) ASC
```

### 풀이 포인트

- `DATETIME`은 날짜형이므로 `TO_CHAR(DATETIME, 'HH24')`를 사용해 24시간 기준의 시간만 추출한다.
- `TO_CHAR()`의 결과는 `'09'`와 같은 문자열이다. 문제에서 요구하는 `HOUR`는 숫자이므로 `TO_NUMBER()`로 변환한다.
- 변환한 시간을 기준으로 그룹화하고, `HAVING`에서 9시부터 19시까지의 결과만 조회한다.

### 핵심 정리

- 시간 단위 집계에는 날짜 컬럼에서 **시간만 추출한 값**을 그룹 기준으로 사용한다.
- Oracle에서 24시간 형식의 시간을 추출할 때는 `TO_CHAR(날짜, 'HH24')`를 사용한다.
- 출력 범위와 정렬 조건을 마지막에 확인한다.

## 2. 즐겨찾기가 가장 많은 식당 정보 출력하기

- 난이도: `Lv. 3`
- 유형: `GROUP BY`
- 핵심 키워드: 그룹별 최댓값, 원본 행 조회, 서브쿼리

### 문제 요약
- 서브쿼리에서 FOOD_TYPE 별로 MAX FAVORITES를 구한 다음, 해당 쿼리랑 조인해서 나머지 컬럼 값들을 붙임. 

### 수정한 쿼리

```sql
SELECT RI.FOOD_TYPE, 
       RI.REST_ID, 
       RI.REST_NAME,
       RI.FAVORITES
       
FROM REST_INFO RI
JOIN (
    SELECT FOOD_TYPE, 
       MAX(FAVORITES) AS FAVORITES
    FROM REST_INFO
    GROUP BY FOOD_TYPE
     ) A

ON RI.FOOD_TYPE = A.FOOD_TYPE 
WHERE RI.FAVORITES = A.FAVORITES
ORDER BY RI.FOOD_TYPE DESC;


```

### 핵심 정리

- 그룹별 최댓값만 구하는 것과 **최댓값을 가진 원본 행 전체를 조회하는 것**은 다르다.
- 집계 결과를 서브쿼리로 만든 뒤 원본 테이블과 연결하는 방식을 고려한다.
- 다시 풀 날짜: `YYYY-MM-DD`


## 3. 자동차 대여 기록에서 대여중 / 대여 가능 여부 구분하기

- 난이도: `Lv. 3`
- 유형: `GROUP BY`
- 핵심 키워드: 조건부 집계, CASE, 날짜 구간

### 문제 요약

자동차별로 2022년 10월 16일에 대여 중인지 확인하고, 그 결과를 `대여중` 또는 `대여 가능`으로 표시하는 문제다.

- 조회 대상: 모든 자동차의 대여 기록
- 판단 기준: 2022년 10월 16일이 대여 시작일과 종료일 사이에 포함되는지 여부
- 출력 순서: 자동차 ID 내림차순

### 작성한 쿼리

```sql
SELECT CAR_ID,
       CASE
           WHEN MAX(
               CASE
                   WHEN DATE '2022-10-16' BETWEEN START_DATE AND END_DATE THEN 1
                   ELSE 0
               END
           ) = 1 THEN '대여중'
           ELSE '대여 가능'
       END AS AVAILABILITY
FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
GROUP BY CAR_ID
ORDER BY CAR_ID DESC
```

### 풀이 포인트

- 하나의 `CAR_ID`에는 여러 대여 기록이 존재할 수 있으므로, 개별 행이 아닌 자동차 단위로 상태를 판단해야 한다.
- 내부 `CASE`에서 기준일이 대여 기간에 포함되면 `1`, 포함되지 않으면 `0`으로 변환한다.
- 자동차별 최댓값이 `1`이면 여러 기록 중 기준일과 겹치는 대여가 하나 이상 있다는 의미이므로 `대여중`으로 표시한다.
- `BETWEEN`은 시작일과 종료일을 모두 포함한다.

### 핵심 정리

- 여러 행 중 하나라도 조건을 만족하는지 확인할 때는 `CASE`와 집계 함수의 조합을 고려한다.
- `MAX(CASE WHEN 조건 THEN 1 ELSE 0 END)` 패턴으로 그룹 내 조건 충족 여부를 판별할 수 있다.
- 행별 조건과 그룹별 최종 상태를 구분해서 생각한다.

## 4. 노선별 평균 역 사이 거리 조회하기

* 난이도: `Lv. 2`
* 유형: `GROUP BY`
* 핵심 키워드: `SUM`, `AVG`, `ROUND`, `CONCAT`

### 문제 요약

노선별로 총 누계 거리와 평균 역 사이 거리를 구하고 각각 `km` 단위를 붙여 출력한다.
총 누계 거리가 큰 순서대로 정렬한다.

### 처음 작성한 쿼리

```sql
SELECT ROUTE, 
       CONCAT(ROUND(SUM(D_BETWEEN_DIST), 1), 'km') AS TOTAL_DISTANCE, 
       CONCAT(ROUND(AVG(D_BETWEEN_DIST), 2), 'km') AS AVERAGE_DISTANCE
FROM SUBWAY_DISTANCE
GROUP BY ROUTE
ORDER BY TOTAL_DISTANCE DESC;
```

### 틀린 이유

* 놓친 조건: 총 누계 거리를 **숫자 기준으로 내림차순 정렬**해야 한다.
* 잘못 이해한 부분: `TOTAL_DISTANCE`는 `km`를 붙인 문자열이므로 이를 기준으로 정렬하면 문자열 정렬이 될 수 있다.
* 실행 결과와 기대 결과의 차이: 거리의 실제 숫자 크기와 다른 순서로 정렬될 수 있다.

### 수정한 쿼리

```sql
SELECT ROUTE, 
       CONCAT(ROUND(SUM(D_BETWEEN_DIST), 1), 'km') AS TOTAL_DISTANCE, 
       CONCAT(ROUND(AVG(D_BETWEEN_DIST), 2), 'km') AS AVERAGE_DISTANCE
FROM SUBWAY_DISTANCE
GROUP BY ROUTE
ORDER BY SUM(D_BETWEEN_DIST) DESC;
```

### 핵심 정리

* `CONCAT()`으로 단위를 붙이면 출력값은 문자열이 된다.
* **출력용 문자열과 계산·정렬용 숫자를 구분**한다.
* 정렬할 때는 `TOTAL_DISTANCE`가 아니라 실제 집계값인 `SUM(D_BETWEEN_DIST)`를 사용한다.
* 다시 풀 날짜: `YYYY-MM-DD`

## 5. 대여 횟수가 많은 자동차들의 월별 대여 횟수 구하기

- 난이도: `Lv. 3`
- 유형: `GROUP BY`
- 핵심 키워드: 기간 필터, HAVING, 서브쿼리, 월별 집계

### 문제 요약

<!-- 먼저 선별할 자동차의 조건과 최종 집계 기준을 분리해서 적는다. -->

### 처음 작성한 쿼리

```sql
-- 오답 쿼리

```

### 틀린 이유

<!-- 기간 내 총 대여 횟수 조건과 월별 대여 횟수 집계를 한 단계로 처리하려 했는지 확인한다. -->

- 놓친 조건:
- 잘못 이해한 부분:
- 실행 결과와 기대 결과의 차이:

### 수정한 쿼리

```sql
-- 정답 쿼리

```

### 핵심 정리

- 전체 기간 기준으로 대상을 먼저 선별하고, 그 결과를 월별로 다시 집계한다.
- 행 조건은 `WHERE`, 그룹 집계 결과 조건은 `HAVING`에 작성한다.
- 결과에 대여 횟수가 0인 행을 포함해야 하는지 확인한다.
- 다시 풀 날짜: `YYYY-MM-DD`

---

## 6. 카펫

- 난이도: `Lv. 2`
- 유형: `완전탐색`
- 핵심 키워드: 약수, 가로·세로 조건, 탐색 범위

> 이 문제는 SQL 문제가 아니지만, 같은 복습 목록에 포함되어 있어 함께 기록한다.

### 문제 요약

<!-- 갈색 격자와 노란색 격자의 수로부터 어떤 값을 찾아야 하는지 적는다. -->

### 처음 작성한 코드

```python
# 오답 코드

```

### 틀린 이유

<!-- 전체 넓이, 테두리를 제외한 내부 넓이, 가로 >= 세로 조건을 모두 확인했는지 적는다. -->

- 놓친 조건:
- 잘못 이해한 부분:
- 실행 결과와 기대 결과의 차이:

### 수정한 코드

```python
# 정답 코드

```

### 핵심 정리

- 전체 넓이는 `brown + yellow`이고, 가로와 세로는 그 값의 약수 쌍이다.
- 후보마다 테두리를 한 칸씩 제외한 내부 넓이가 `yellow`와 같은지 검사한다.
- 다시 풀 날짜: `YYYY-MM-DD`

---

## 7. 특정 기간동안 대여 가능한 자동차들의 대여비용 구하기

- 난이도: `Lv. 4`
- 유형: `JOIN`
- 핵심 키워드: NOT EXISTS, 날짜 구간 겹침, 할인율, 다중 JOIN

### 문제 요약

<!-- 대상 차종, 대여 가능 기간, 할인 조건, 최종 금액 범위를 나누어 적는다. -->

### 처음 작성한 쿼리

```sql
-- 오답 쿼리

```

### 틀린 이유

<!-- 예약이 없는 자동차와 지정 기간에 겹치는 예약이 없는 자동차를 구분했는지 확인한다. -->

- 놓친 조건:
- 잘못 이해한 부분:
- 실행 결과와 기대 결과의 차이:

### 수정한 쿼리

```sql
-- 정답 쿼리

```

### 핵심 정리

- 두 날짜 구간이 겹치지 않는 조건을 먼저 정의한 뒤, 반대 조건으로 겹침을 판별한다.
- 특정 기간과 겹치는 대여 이력이 **존재하지 않아야** 하므로 `NOT EXISTS`를 고려한다.
- 할인 정책의 기간 구분 문자열과 실제 대여 일수가 정확히 대응하는지 확인한다.
- 할인 적용 후 반올림 또는 버림 시점을 확인한다.
- 다시 풀 날짜: `YYYY-MM-DD`

---

## 8. 상품을 구매한 회원 비율 구하기

- 난이도: `Lv. 5`
- 유형: `JOIN`
- 핵심 키워드: 코호트, COUNT DISTINCT, 비율, 연·월 집계

### 문제 요약

<!-- 분모가 되는 회원 집단과 분자가 되는 구매 회원 집단을 각각 적는다. -->

### 처음 작성한 쿼리

```sql
-- 오답 쿼리

```

### 틀린 이유

<!-- 한 회원의 여러 구매 행이 중복 집계되지 않는지, 분모가 전체 회원이 아닌 특정 가입 연도 회원인지 확인한다. -->

- 놓친 조건:
- 잘못 이해한 부분:
- 실행 결과와 기대 결과의 차이:

### 수정한 쿼리

```sql
-- 정답 쿼리

```

### 핵심 정리

- 비율 문제는 먼저 **분모와 분자의 집합**을 명확히 정의한다.
- 구매 건수가 아니라 구매한 회원 수이므로 중복 제거가 필요한지 확인한다.
- 정수 나눗셈을 피하고, 문제에서 요구한 자릿수로 반올림한다.
- 연도와 월을 각각 그룹화하고 정렬 조건까지 검토한다.
- 다시 풀 날짜: `YYYY-MM-DD`

---

## 복습 체크리스트

- [ ] `WHERE`와 `HAVING`의 역할을 구분했는가?
- [ ] `GROUP BY` 이후 조회 가능한 컬럼을 확인했는가?
- [ ] 그룹별 최댓값과 해당 원본 행을 혼동하지 않았는가?
- [ ] 조인으로 행이 늘어나 중복 집계되지 않는가?
- [ ] 날짜 구간의 양 끝값과 겹침 조건을 확인했는가?
- [ ] `COUNT(*)`와 `COUNT(DISTINCT ...)` 중 알맞은 것을 사용했는가?
- [ ] 나눗셈의 자료형과 반올림 시점을 확인했는가?
- [ ] 출력 컬럼명과 정렬 순서가 문제의 요구사항과 같은가?

## 한 줄 회고

<!-- 다음 SQL 문제를 풀 때 가장 먼저 확인할 습관을 한 문장으로 적는다. -->

> 예: 집계 문제를 만나면 행 필터링, 그룹화, 그룹 필터링의 순서부터 나눈다.
