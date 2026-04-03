---
title: "[알고리즘] 투포인터 정리"
date: 2026-04-03
categories: [Algorithm]
tags: [Algorithm]
image: https://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/images/boj-og.png
layout: post
math: true
---

# 투포인터(Two Pointers) 패턴 정리

---

### 참고자료
<div>
{% include bookmark.html 
   url="https://www.youtube.com/watch?v=QzZ7nmouLTI" 
   title="Two Pointers in 7 minutes | LeetCode Pattern" 
   description="알고리즘" 
   image="https://img.youtube.com/vi/QzZ7nmouLTI/maxresdefault.jpg" %}
</div>
<div>
{% include bookmark.html 
   url="https://www.youtube.com/watch?v=y2d0VHdvfd" 
   title="Sliding Window in 7 minutes | LeetCode Pattern" 
   description="알고리즘" 
   image="https://img.youtube.com/vi/y2d0VHdvfdc/maxresdefault.jpg" %}
</div>


## 1. 투포인터란 무엇인가?

투 포인터는 데이터 구조(주로 배열이나 연결 리스트)에서 두 개의 변수(포인터)를 사용하여 데이터의 위치를 가리키고, 특정 조건에 따라 이 포인터를 이동시키며 문제를 해결하는 기법

## 2. 투포인터의 3가지 주요 전략

### 1) 수렴형 포인터(Converging Pointers)

![1.gif](/assets/img/algorithm/two-pointers/1.gif)

- 방향 : 양 끝에서 시작하여 가운데로 이동
- 용도 : 양 끝 요소를 비교해야할 때 유용
- 대표 예
    - 회문(Palindrome) 체크, 양 끝 문자를 비교하며 같으면 안으로 이동, 다르면 즉시 종료

### 수렴형 포인터 템플릿

```python
def converging_pointers(arr, target):
    # 1. 배열 정렬 (원본 배열을 변경하거나 sorted(arr) 사용)
    arr.sort()

    # 2. 포인터 초기화
    left = 0
    right = len(arr) - 1

    # 3. 두 포인터가 만날 때까지 반복
    while left < right:
        current_sum = arr[left] + arr[right]

        if current_sum == target:
            # 정답을 찾은 경우
            print(f"Found: {arr[left]}, {arr[right]}")
            return (arr[left], arr[right])
        
        elif current_sum < target:
            # 합이 타겟보다 작으면 값을 키우기 위해 left를 오른쪽으로 이동
            left += 1
        else:
            # 합이 타겟보다 크면 값을 줄이기 위해 right를 왼쪽으로 이동
            right -= 1
            
    print("No pair found.")
    return None
```

### 백준 - 3273 두 수의 합

```python
n = int(input())
arr = list(map(int, input().split()))
x = int(input())

arr.sort()

# print(arr)

left = 0
right = n - 1
count = 0

while (left < right):
    # print("left", left, "right", right)
    currentSum = arr[left] + arr[right]
    # print("currentSum", currentSum)
    if (currentSum == x):
        count += 1
        left += 1
        right -= 1
    elif currentSum < x:
        left += 1
    else:
        right -= 1

print(count)
```

### 2) 평행 포인터(Parallel Pointers)

![2.gif](/assets/img/algorithm/two-pointers/2.gif)

- 방향 : 같은 시점에서 같은 방향으로 이동
- 용도 : **슬라이딩 윈도우**가 대표적 예시
    - 포인터 중 하나는 탐색(Right)
    - 다른 하나는 제약 조건 유지(Left)의 역할
        
        ⇒ 하위 배열이나 하위 문자열을 찾을 때 사용
        

### 3) 트리거 기반 포인터 (Trigger-based Pointers)

- 방향 : 한 포인터가 먼저 움직이고, 특정 조건이 충족되면 두 번째 포인터가 움직이기 시작
- 대표 예시 : 연결 리스트에서 ‘뒤에서 n번째 노드’ 찾기
    - 첫 번째 포인터를 n만큼 먼저 보낸 후, 두 포인터를 이동시키면 첫 포인터가 끝에 도달했을 때 두 번째 포인터가 목표 지점에 있게 됨

## 3. 슬라이딩 윈도우

두 개의 포인터를 사용하여 데이터 구조 위에서 윈도우를 정의하고 이 윈도우를 옆으로 밀어가며 하위 배열이나 하위 문자열을 효율적으로 탐색하는 기법

### 1) Fixed Sliding Window

- 특징 : 윈도우의 크기 (`K`)가 미리 정해져 있으며 탐색 내내 일정하게 유지됨
- 작동 방식
    1. 처음 K 개의 요소로 초기 윈도우 설정
    2. 한 칸씩 이동하며 새로운 요소는 추가하고, 윈도우를 벗어나는 옛날 요소는 제거
    3. 결과를 업데이트

### 백준 - 2559 수열

```python
n, k = map(int, input().split())
arr = list(map(int, input().split()))

curret_val = sum(arr[:k])
max_val = curret_val

for i in range(k, n):
    curret_val += arr[i] - arr[i-k]
    max_val = max(max_val, curret_val)
print(max_val)
```

### 2) Dynamic Sliding Window

- 문제의 조건에 따라 윈도우의 크기가 늘어나거나 줄어듦
- 작동 방식
    1. `right` 포인터를 이동하며 윈도우를 확장
    2. 만약 조건을 위반할 경우,
        1. `left` 포인터를 이동시켜 조건이 만족될 때까지 윈도우를 축소시킴
    3. 윈도우 내에서 최대/최소 길이등을 계산함