---
title: "[알고리즘] 구간합 / 누적합"
date: 2026-03-09
categories: [Algorithm]
tags: [Algorithm]
image: https://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/images/boj-og.png
layout: post
math: true
---
# 1. 1차원 구간합

## 1) 합 배열 정의

$$
S[i] = A[0] + A[1] + ... + A[i-1] + A[i]
$$

## 2) 합 배열 구하기

$$
S[i] = S[i-1] + A[i]
$$

## 3) 구간합 구하기

> 예: i ~ j 까지의 구간합?

$$
S[j] - S[i-1]
$$

## 백준 11659 – 구간합 구하기 4
> 수 N개가 주어졌을 때, i번째 수부터 j번째 수까지 합을 구하는 프로그램을 작성하시오.

```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
arr = list(map(int, input().split()))
arr.insert(0, 0)

# 구간합 배열
prefix_s = []
prefix_s.append(arr[0])

for i in range(1, n+1):
    sum = prefix_s[i-1] + arr[i]
    prefix_s.append(sum)

for _ in range(m):
    result = 0
    i, j = map(int, input().split())

    result = prefix_s[j] - prefix_s[i-1]

    print(result)    

```

---

# 2. 2차원 구간합
![alt text](/assets/img/prefix_sum.png)

## 백준 2167 – 2차원 배열의 합

```python
n, m = map(int, input().split())

arr = [[0]*(m+1)]  # 0번째 행 추가

for _ in range(n):
    row = [0] + list(map(int, input().split()))
    arr.append(row)

# prefix_sum 초기화 
prefix_sum = [[0] * (m+1) for _ in range(n+1)]

# prefix_sum[1][1] 시작 추가
prefix_sum[1][1] = arr[1][1]

# prefix_sum 순회하면서 각각의 값 채워넣기 
for i in range(1, n+1):
    for j in range(1, m+1):
        if i == 1 and j > 1:
            prefix_sum[i][j] = prefix_sum[1][j-1] + arr[1][j]
        elif i > 1 and j == 1:
            prefix_sum[i][j] = prefix_sum[i-1][1] + arr[i][1]
        else:
            prefix_sum[i][j] = prefix_sum[i-1][j] + prefix_sum[i][j-1] - prefix_sum[i-1][j-1] + arr[i][j]

k = int(input())

for _ in range(k):
    i, j, x, y = map(int, input().split())

    result = prefix_sum[x][y] - prefix_sum[i-1][y] - prefix_sum[x][j-1] + prefix_sum[i-1][j-1]

    print(result)
```