---
title: "[Python] zfill, rjust, ljust로 문자열 채우기"
description: "Python에서 zfill, rjust, ljust를 사용해 문자열 길이를 맞추고 원하는 문자를 채우는 방법과 차이점을 정리합니다."
date: 2026-09-21
slug: "/python-string-padding/"
tags: ["Python"]
heroImageAlt: "Python 문자열 채우기 메서드 정리"
---

# Python 문자열 채우기

숫자나 문자열의 길이를 일정하게 맞춰야 할 때 `zfill()`, `rjust()`, `ljust()`를 사용할 수 있다.

세 메서드 모두 원본 문자열을 변경하지 않고 새로운 문자열을 반환한다. 지정한 길이에는 기존 문자열의 길이도 포함된다.

## 1. zfill()

`zfill(width)`은 문자열의 전체 길이가 `width`가 되도록 왼쪽에 `0`을 채운다.

```python
ex = "1234"

print(ex.zfill(5))  # 01234
print(ex.zfill(6))  # 001234
print(ex.zfill(7))  # 0001234
```

이미 문자열의 길이가 지정한 길이보다 크거나 같으면 원본과 동일한 문자열을 반환한다.

```python
ex = "1234"

print(ex.zfill(3))  # 1234
print(ex.zfill(4))  # 1234
```

부호가 있는 문자열은 부호 뒤에 `0`이 채워진다.

```python
print("-42".zfill(5))  # -0042
print("+42".zfill(5))  # +0042
```

날짜, 번호, 코드처럼 숫자 형태의 문자열 길이를 `0`으로 맞출 때 유용하다.

### zfill()은 언제 사용할까?

`zfill()`은 숫자처럼 보이는 문자열의 자릿수를 일정하게 맞출 때 주로 사용한다.

#### 날짜와 시간 형식 맞추기

월, 일, 시, 분이 한 자리일 때 앞에 `0`을 붙이면 일정한 형식으로 출력할 수 있다.

```python
month = "9"
day = "3"

date = f"2026-{month.zfill(2)}-{day.zfill(2)}"
print(date)  # 2026-09-03
```

#### 순번과 파일명 정렬하기

번호를 그대로 파일명에 사용하면 문자열 정렬 결과가 의도와 달라질 수 있다.

```python
numbers = [1, 2, 10, 20]

file_names = [f"image_{str(number).zfill(3)}.png" for number in numbers]
print(file_names)
# ['image_001.png', 'image_002.png', 'image_010.png', 'image_020.png']
```

자릿수를 동일하게 만들면 운영체제나 프로그램에서 파일을 문자열 기준으로 정렬해도 숫자 순서가 유지된다.

#### 고정 길이 식별자 만들기

주문 번호나 회원 번호처럼 표시 형식을 일정하게 맞추는 데도 사용할 수 있다.

```python
order_id = 527

display_id = f"ORDER-{str(order_id).zfill(6)}"
print(display_id)  # ORDER-000527
```

단, 이것은 화면에 표시할 문자열을 만드는 방법이다. 데이터베이스의 실제 기본 키를 문자열로 변경할 필요는 없다.

## 2. rjust()

`rjust(width, fillchar)`는 원본 문자열을 오른쪽에 배치하고, 남은 왼쪽 공간을 지정한 문자로 채운다.

```python
ex = "333"

print(ex.rjust(5, "a"))  # aa333
print(ex.rjust(5, "7"))  # 77333
print(ex.rjust(8, "a"))  # aaaaa333
print(ex.rjust(8, "7"))  # 77777333
```

두 번째 인자를 생략하면 공백으로 채운다.

```python
print("333".rjust(5))  # "  333"
```

채움 문자는 길이가 1인 문자만 사용할 수 있다.

```python
print("333".rjust(5, "ab"))
# TypeError: The fill character must be exactly one character long
```

### rjust()는 언제 사용할까?

`rjust()`는 숫자나 결과값을 오른쪽으로 정렬해 자릿수가 서로 다른 값을 비교하기 쉽게 만들 때 유용하다.

#### 콘솔에서 숫자 열 맞추기

```python
scores = [8, 120, 45]

for score in scores:
    print(str(score).rjust(5))
```

결과:

```text
    8
  120
   45
```

숫자는 일의 자리 위치가 맞아야 크기를 비교하기 쉽기 때문에 표나 리포트에서 보통 오른쪽 정렬한다.

#### 구분선이나 마스킹 문자 채우기

```python
chapter = "3"

print(chapter.rjust(4, "0"))  # 0003
print(chapter.rjust(4, "-"))  # ---3
```

단순히 `0`을 채우는 목적이라면 부호까지 자연스럽게 처리하는 `zfill()`이 더 적합하다. `rjust()`는 채움 문자를 직접 선택해야 할 때 사용한다.

## 3. ljust()

`ljust(width, fillchar)`는 원본 문자열을 왼쪽에 배치하고, 남은 오른쪽 공간을 지정한 문자로 채운다.

```python
ex = "333"

print(ex.ljust(5, "a"))  # 333aa
print(ex.ljust(5, "7"))  # 33377
print(ex.ljust(8, "a"))  # 333aaaaa
print(ex.ljust(8, "7"))  # 33377777
```

`rjust()`와 마찬가지로 두 번째 인자를 생략하면 공백을 사용한다.

```python
print("333".ljust(5))  # "333  "
```

### ljust()는 언제 사용할까?

`ljust()`는 이름이나 항목처럼 일반적으로 왼쪽에서 읽는 문자열의 출력 폭을 맞출 때 사용한다.

#### 콘솔 표 만들기

```python
products = [
    ("Keyboard", 79000),
    ("Mouse", 32000),
    ("Monitor", 249000),
]

for name, price in products:
    print(name.ljust(12), str(price).rjust(8))
```

결과:

```text
Keyboard       79000
Mouse          32000
Monitor       249000
```

문자열 항목은 `ljust()`로 왼쪽 정렬하고 숫자는 `rjust()`로 오른쪽 정렬하면 간단한 CLI 표를 만들 수 있다.

#### 로그 레이블의 폭 맞추기

```python
logs = [
    ("INFO", "서버가 시작되었습니다."),
    ("WARNING", "응답 시간이 느립니다."),
    ("ERROR", "요청 처리에 실패했습니다."),
]

for level, message in logs:
    print(f"[{level.ljust(7)}] {message}")
```

결과:

```text
[INFO   ] 서버가 시작되었습니다.
[WARNING] 응답 시간이 느립니다.
[ERROR  ] 요청 처리에 실패했습니다.
```

> 한글, 이모지처럼 화면에서 차지하는 폭이 문자 수와 다를 수 있는 값은 `ljust()`만으로 완벽하게 정렬되지 않을 수 있다. 터미널 표를 정교하게 출력해야 한다면 표시 폭을 계산하는 별도 라이브러리를 사용하는 편이 좋다.

## 메서드 비교

| 메서드 | 문자열 위치 | 채우는 방향 | 기본 채움 문자 |
| --- | --- | --- | --- |
| `zfill(width)` | 오른쪽 | 왼쪽 | `0` |
| `rjust(width, fillchar)` | 오른쪽 | 왼쪽 | 공백 |
| `ljust(width, fillchar)` | 왼쪽 | 오른쪽 | 공백 |

```python
value = "42"

print(value.zfill(5))       # 00042
print(value.rjust(5, "0")) # 00042
print(value.ljust(5, "0")) # 42000
```

`zfill()`과 `rjust(width, "0")`은 일반적인 숫자 문자열에서는 같은 결과를 만들지만, 부호를 처리하는 방식은 다르다.

```python
value = "-42"

print(value.zfill(5))        # -0042
print(value.rjust(5, "0"))  # 00-42
```

따라서 부호를 포함할 수 있는 숫자 문자열에 `0`을 채울 때는 `zfill()`을 사용하는 편이 안전하다.

## 정리

- 왼쪽을 `0`으로 채울 때는 `zfill()`을 사용한다.
- 문자열을 오른쪽 정렬하고 왼쪽을 채울 때는 `rjust()`를 사용한다.
- 문자열을 왼쪽 정렬하고 오른쪽을 채울 때는 `ljust()`를 사용한다.
- `rjust()`와 `ljust()`의 채움 문자는 정확히 한 글자여야 한다.
- 지정한 길이가 원본 문자열보다 짧으면 문자열은 잘리지 않는다.

## 참고

- [Python 문자열 채우기 정리](https://seokii.tistory.com/193#book-toc)
