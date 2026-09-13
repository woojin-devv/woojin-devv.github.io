---
title: "[python] heapq 내장 모듈로 힙 자료구조 사용하기 "
description: ""
date: 2026-07-16
slug: "/python-heapq/"
tags: ["python", "algorithm"]
---

## 파이썬의 heapq 모듈로 힙 자료구조 사용하기 

### 1. 모듈 불러오기 
```python 
from heapq import heappush, heappop
```

### 2. 힙 생성
> 일반적으로 다른 언어에서는 힙 객체를 생성하기 위한 별도의 클래스를 제공하는 경우가 많음. 
> BUT python 에서는 리스트로 사용가능

### 3. 힙 생성 
```python
heap = []
```

### 4. 힙에 원소 추가 
```python
from heapq import heappush

heap = []
heappush(heap, 4)
heappush(heap, 1)
heappush(heap, 7)
heappush(heap, 3)
heappush(heap, 8)
heappush(heap, 5)

print(heap)
```
> `[1, 3, 5, 4, 8, 7]`

> - 기본적으로 heap은 이진트리의 자료구조를 하고 있음. 

### 5. heap에서 원소 삭제 

```python 
from heapq import heappop
heappop(heap)
print(heap)
```
> - 가장 작은 원소를 pop(root)함. 

### 6. 기존 리스트를 힙으로 변환 
```python 
from heapq import heapify

heap = [4, 1, 7, 3, 8, 5]
heapify(heap)

print(heap)
```
> `[1, 3, 5, 4, 8, 7]`

- `heapify()` 함수를 통해 일반 list를 heap 자료구조로 변환 가능 

### 7. [응용] 최대힙

```python
from heapq import heappush, heappop

nums = [4, 1, 7, 3, 8, 5]
heap = []

for num in nums:
    heappush(heap, (-num, num))
```
#### 왜 음수를 넣는가 
> `heapq`는 가장 작은 값을 먼저 꺼내는 최소 힙임. 
