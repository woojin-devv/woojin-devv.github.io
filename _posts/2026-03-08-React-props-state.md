---
title: React – props와 state의 차이
date: 2026-03-08
categories: [React]
tags: [React]
image: https://coursework.vschool.io/content/images/size/w2000/2017/08/react-banner.png
---

# props vs state
> props와 state의 정확한 차이는 무엇인가요?

## Context
> 컴포넌트의 주요 책임은 원시 데이터(raw data)를 풍부한 HTML로 변환하는 것이다. 해당 관점에서 보면 props와 state는 HTML출력이 생성되는 원시데이터를 구성한다. 

즉, props와 state는 컴포넌트의 render()함수에 들어가는 입력 데이터다. 따라서 각 데이터가 무엇을 의미하는지 그리고 어디에서 오는지 자세히 살펴봐야 한다.
또한 우리는 React Cosmos를 사용하고 있는데, 해당 환경에서 props는 초기 state를 포함할 수 있기 때문에 해당 개념을 이해하는 것이 중요하다. 

## 💬 공통점
- props와 state는 모두 일반적인 JavaScript 객체
- props와 state는 변경되면 컴포넌트는 다시 렌더링 됨.
- props와 state는 결정적임.

## 🧐 예시를 고려해보자.
### Q) 어떤 컴포넌트가 시간이 지나면서 자신의 속성을 변경해야 한다면? props? state? 어디에?
- 어떤 컴포넌트가 시간이 지나면서 자신의 속성을 변경해야한다면 state에 있어야함.

### props
- props는 properties의 줄임말이다. 
    - props는 컴포넌트의 설정이라고 볼 수 있다. 
    - 즉, 컴포넌트에 전달되는 옵션이다. 

### state
- state는 컴포넌트가 마운트될 때 기본값으로 시작한다.
    - 그리고 시간이 지나면서 값이 변경될 수 있음
    - 해당 변화(변경)는 사용자 이벤트로 인해 발생함
    - state는 특정 시점의 상태를 나타내는 스냅샷이라고 볼 수 있음
    - 컴포넌트는 자신의 state를 내부적으로 관리

## props와 state 변경 가능 여부

|                         | props | state |
| ----------------------- | ----- | ----- |
| 부모 컴포넌트로부터 초기값 받을 수 있는가 | Yes   | Yes   |
| 부모 컴포넌트가 값을 변경할 수 있는가   | Yes   | No    |
| 컴포넌트 내부에서 기본값 설정 가능     | Yes   | Yes   |
| 컴포넌트 내부에서 변경 가능         | No    | Yes   |
| 자식 컴포넌트 초기값 설정 가능       | Yes   | Yes   |
| 자식 컴포넌트에서 변경 가능         | Yes   | No    |

## 그렇다면 State는 다다익선인가?
- state는 선택사항이다. 
    - 결국 상태의 변화는 컴포넌트의 복잡도를 증가시키고 예측 가능성을 낮출 수 있기 때문에 가능하면 state가 없는 정적 컴포넌트가 낫긴 하다. 
    - 물론 인터랙티브한 애플리케이션에서는 state 없이 구현한다는 것은 말이 안된다. 
    - 하지만 stateful한 컴포넌트를 너무 많이 만드는 것은 피하는 것이 좋다. 

# 레퍼런스 
- [github – uberVU/react-guide](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
- [React공식문서 - 컴포넌트 State](https://ko.legacy.reactjs.org/docs/faq-state.html)