---
title: "[알고리즘] Python BFS 템플릿 정리"
description: "코딩테스트에서 자주 사용하는 Python BFS 템플릿을 그래프 탐색, 격자 최단거리, 연결 요소, 다중 시작점, 상태 BFS, 경로 복원, 0-1 BFS로 나누어 정리합니다."
date: 2026-07-24
slug: "/bfs/"
tags: ["Algorithm", "Python"]
heroImageUrl: "https://onlinejudgeimages.s3-ap-northeast-1.amazonaws.com/images/boj-og.png"
heroImageAlt: "Python BFS 템플릿 정리"
---

# Python BFS 템플릿 정리

BFS(Breadth-First Search, 너비 우선 탐색)는 시작점에서 가까운 정점부터 차례로 탐색하는 알고리즘이다.

간선의 가중치가 모두 같다면 BFS로 최단거리를 구할 수 있다. 그래프뿐만 아니라 미로 탐색, 영역 개수 세기, 토마토나 불의 확산, 벽 부수기처럼 상태가 추가된 문제에서도 자주 사용된다.

## 핵심 구조

```python
from collections import deque

queue = deque([start])
visited[start] = True

while queue:
    current = queue.popleft()

    for next_node in graph[current]:
        if not visited[next_node]:
            visited[next_node] = True
            queue.append(next_node)
```

BFS를 구현할 때 기억할 점은 다음과 같다.

- Python에서는 `list.pop(0)` 대신 `deque.popleft()`를 사용한다.
- 방문 처리는 큐에서 꺼낼 때가 아니라 **큐에 넣을 때** 한다.
- 최단거리는 최초로 방문했을 때 확정된다.
- 위치 이외의 조건이 있다면 방문 배열에도 상태를 포함한다.

---

## 1. 그래프 BFS와 최단거리

가중치가 없는 그래프에서 시작 정점으로부터 각 정점까지의 최단거리를 구하는 기본 템플릿이다.

`distance[node] == -1`을 아직 방문하지 않았다는 의미로 사용하면 별도의 `visited` 배열이 필요 없다.

```python
from collections import deque


def bfs(start, graph):
    distance = [-1] * len(graph)
    distance[start] = 0

    queue = deque([start])

    while queue:
        current = queue.popleft()

        for next_node in graph[current]:
            if distance[next_node] != -1:
                continue

            distance[next_node] = distance[current] + 1
            queue.append(next_node)

    return distance
```

### 사용 예시

```python
graph = [
    [1, 2],       # 0
    [0, 3],       # 1
    [0, 3],       # 2
    [1, 2, 4],    # 3
    [3],          # 4
]

print(bfs(0, graph))
# [0, 1, 1, 2, 3]
```

그래프 BFS의 시간 복잡도는 정점 수를 `V`, 간선 수를 `E`라고 할 때 `O(V + E)`이다.

---

## 2. 2차원 격자 BFS

미로에서 최단거리를 구하는 문제에 사용하는 템플릿이다. 아래 예시에서는 `1`을 이동할 수 있는 칸, `0`을 벽으로 가정한다.

```python
from collections import deque


def shortest_path(grid, start, end):
    rows = len(grid)
    cols = len(grid[0])
    start_row, start_col = start
    end_row, end_col = end

    distance = [[-1] * cols for _ in range(rows)]
    distance[start_row][start_col] = 0

    queue = deque([(start_row, start_col)])
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while queue:
        row, col = queue.popleft()

        if (row, col) == (end_row, end_col):
            return distance[row][col]

        for dr, dc in directions:
            next_row = row + dr
            next_col = col + dc

            if not (0 <= next_row < rows and 0 <= next_col < cols):
                continue

            if grid[next_row][next_col] == 0:
                continue

            if distance[next_row][next_col] != -1:
                continue

            distance[next_row][next_col] = distance[row][col] + 1
            queue.append((next_row, next_col))

    return -1
```

목적지를 큐에서 꺼낸 순간 해당 위치까지의 최단거리는 확정되어 있으므로 즉시 반환할 수 있다.

`N × M` 크기의 격자에서 각 칸을 최대 한 번씩 방문하므로 시간 복잡도는 `O(NM)`이다.

---

## 3. 연결 요소의 개수와 크기

섬의 개수, 단지 번호 붙이기, 그림의 영역처럼 서로 연결된 영역의 개수와 각 영역의 크기를 구할 때 사용한다.

```python
from collections import deque


def count_areas(grid):
    rows = len(grid)
    cols = len(grid[0])
    visited = [[False] * cols for _ in range(rows)]
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    def bfs(start_row, start_col):
        queue = deque([(start_row, start_col)])
        visited[start_row][start_col] = True
        size = 0

        while queue:
            row, col = queue.popleft()
            size += 1

            for dr, dc in directions:
                next_row = row + dr
                next_col = col + dc

                if not (0 <= next_row < rows and 0 <= next_col < cols):
                    continue

                if grid[next_row][next_col] == 0:
                    continue

                if visited[next_row][next_col]:
                    continue

                visited[next_row][next_col] = True
                queue.append((next_row, next_col))

        return size

    sizes = []

    for row in range(rows):
        for col in range(cols):
            if grid[row][col] == 1 and not visited[row][col]:
                sizes.append(bfs(row, col))

    return len(sizes), sizes
```

필요하다면 마지막에 `sizes.sort()`를 호출해 영역의 크기를 오름차순으로 정렬한다.

---

## 4. 다중 시작점 BFS

토마토, 불, 바이러스처럼 여러 위치에서 동시에 탐색이 시작되는 문제에 사용한다.

핵심은 **모든 시작점을 거리 0으로 설정하고 큐에 먼저 넣는 것**이다. 이후에는 일반 BFS와 동일하게 탐색한다.

```python
from collections import deque


def multi_source_bfs(grid, starts):
    rows = len(grid)
    cols = len(grid[0])
    distance = [[-1] * cols for _ in range(rows)]
    queue = deque()

    for row, col in starts:
        distance[row][col] = 0
        queue.append((row, col))

    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while queue:
        row, col = queue.popleft()

        for dr, dc in directions:
            next_row = row + dr
            next_col = col + dc

            if not (0 <= next_row < rows and 0 <= next_col < cols):
                continue

            # -1은 이동할 수 없는 칸이라고 가정
            if grid[next_row][next_col] == -1:
                continue

            if distance[next_row][next_col] != -1:
                continue

            distance[next_row][next_col] = distance[row][col] + 1
            queue.append((next_row, next_col))

    return distance
```

각 칸의 `distance`에는 가장 가까운 시작점으로부터의 최단거리가 저장된다.

---

## 5. 상태가 포함된 BFS

벽을 부쉈는지, 열쇠를 가지고 있는지, 특정 이동을 몇 번 사용했는지처럼 위치 외의 정보가 결과에 영향을 주는 문제에서는 상태까지 방문 여부에 포함해야 한다.

다음은 벽을 최대 한 번 부술 수 있는 격자 탐색 예시이다.

```python
from collections import deque


def shortest_path_with_break(grid):
    rows = len(grid)
    cols = len(grid[0])

    # visited[row][col][broken]
    visited = [[[False] * 2 for _ in range(cols)] for _ in range(rows)]
    visited[0][0][0] = True

    # row, col, 벽을 부쉈는지, 이동 거리
    queue = deque([(0, 0, 0, 0)])
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    while queue:
        row, col, broken, distance = queue.popleft()

        if (row, col) == (rows - 1, cols - 1):
            return distance

        for dr, dc in directions:
            next_row = row + dr
            next_col = col + dc

            if not (0 <= next_row < rows and 0 <= next_col < cols):
                continue

            # 빈 칸으로 이동
            if grid[next_row][next_col] == 0:
                if not visited[next_row][next_col][broken]:
                    visited[next_row][next_col][broken] = True
                    queue.append(
                        (next_row, next_col, broken, distance + 1)
                    )

            # 아직 벽을 부수지 않았다면 벽을 부수고 이동
            elif broken == 0:
                if not visited[next_row][next_col][1]:
                    visited[next_row][next_col][1] = True
                    queue.append(
                        (next_row, next_col, 1, distance + 1)
                    )

    return -1
```

같은 좌표라도 벽을 부수지 않고 도착한 경우와 이미 벽을 부수고 도착한 경우는 이후 선택지가 다르다. 따라서 두 경우를 서로 다른 상태로 방문 처리해야 한다.

---

## 6. 최단경로 복원

최단거리뿐만 아니라 실제로 어떤 정점을 거쳐 갔는지 필요하다면 각 정점의 이전 정점을 `parent` 배열에 기록한다.

```python
from collections import deque


def shortest_path_with_route(start, end, graph):
    parent = [-1] * len(graph)
    visited = [False] * len(graph)

    queue = deque([start])
    visited[start] = True

    while queue:
        current = queue.popleft()

        if current == end:
            break

        for next_node in graph[current]:
            if visited[next_node]:
                continue

            visited[next_node] = True
            parent[next_node] = current
            queue.append(next_node)

    if not visited[end]:
        return []

    path = []
    current = end

    while current != -1:
        path.append(current)
        current = parent[current]

    path.reverse()
    return path
```

목적지부터 `parent`를 따라 시작점까지 거슬러 올라간 뒤 결과를 뒤집으면 시작점에서 목적지까지의 경로가 된다.

---

## 7. 0-1 BFS

간선의 가중치가 `0` 또는 `1`로만 구성된 그래프에서는 덱을 이용한 0-1 BFS를 사용할 수 있다.

- 가중치가 `0`인 간선은 덱의 앞쪽에 삽입한다.
- 가중치가 `1`인 간선은 덱의 뒤쪽에 삽입한다.

```python
from collections import deque


def zero_one_bfs(start, graph):
    INF = float("inf")
    distance = [INF] * len(graph)
    distance[start] = 0

    queue = deque([start])

    while queue:
        current = queue.popleft()

        for next_node, weight in graph[current]:
            next_distance = distance[current] + weight

            if next_distance >= distance[next_node]:
                continue

            distance[next_node] = next_distance

            if weight == 0:
                queue.appendleft(next_node)
            else:
                queue.append(next_node)

    return distance
```

0-1 BFS의 시간 복잡도는 `O(V + E)`이다.

---

## 어떤 알고리즘을 선택해야 할까?

| 간선 가중치 | 사용할 알고리즘 |
| --- | --- |
| 모든 가중치가 동일 | BFS |
| 가중치가 0 또는 1 | 0-1 BFS |
| 음수가 아닌 다양한 가중치 | 다익스트라 |
| 음수 가중치가 존재 | 벨만-포드 등 다른 알고리즘 검토 |

## 실전 체크리스트

- 시작점을 방문 처리하고 큐에 넣었는가?
- 방문 처리를 큐에 넣는 순간 하고 있는가?
- 행과 열의 범위 검사를 빠뜨리지 않았는가?
- 벽이나 이동 불가능한 조건을 확인했는가?
- 다중 시작점이라면 모든 시작점을 먼저 큐에 넣었는가?
- 위치 외의 조건이 있다면 방문 배열에 상태 차원을 추가했는가?
- 최단경로가 필요하다면 부모 정점을 기록했는가?

입력이 문자열 격자라면 다음과 같이 읽을 수 있다.

```python
grid = [list(input().strip()) for _ in range(n)]
```

숫자가 공백 없이 붙어 있는 격자라면 각 문자를 정수로 변환한다.

```python
grid = [list(map(int, input().strip())) for _ in range(n)]
```
