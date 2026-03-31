---
title: React - useRef와 상태 끌어올리기 (09-2)
date: 2026-03-31
categories: [React]
tags: [React]
image: https://coursework.vschool.io/content/images/size/w2000/2017/08/react-banner.png
layout: post
math: true
toc: true
---

입력 폼에서 데이터를 가져올 때, 모든 키 입력마다 상태를 업데이트하는 대신 "저장" 버튼을 누르는 시점에만 값을 읽어오고 싶다면 Ref 사용하자

-> 왜냐면 상태 변화를 계속 팔로업할 필요가 없으니까..

사실 useState로도 구현 가능하지만 왜 useRef를 사용해야할까?

### useState 와 useRef의 차이 

| 비교 항목 | useState (제어 컴포넌트) | useRef (비제어 컴포넌트) |
| :--- | :--- | :--- |
| **리렌더링** | 값이 바뀔 때마다 발생 (매 키입력 시) | 발생하지 않음 |
| **실시간 검사** | 가능 (글자 수 제한, 입력 즉시 경고 등) | 불가능 (버튼을 누르는 시점에만 확인 가능) |
| **UI 동기화** | 입력값에 따라 UI가 즉시 변함 | 저장 전까지 UI 변화 없음 |
| **추천 상황** | 복잡한 유효성 검사, 실시간 피드백 필요 시 | 단순한 데이터 수집, 성능 최적화 필요 시 |

## 1. useRef를 이용한 입력값 수집
`useState`를 쓰면 코드가 복잡해질 수 있는 상황에서 `useRef`를 사용하면 DOM 요소에 직접 접근하여 필요할 때만 값을 가져올 수 있다.

```js
import { useRef } from 'react';

const title = useRef();
const description = useRef();
const dueDate = useRef();

function handleSave() {
  const enteredTitle = title.current.value;
  const enteredDescription = description.current.value;
  const enteredDueDate = dueDate.current.value;
  
  // 수집된 데이터를 상위 컴포넌트로 전달
  onAdd({
    title: enteredTitle,
    description: enteredDescription,
    dueDate: enteredDueDate
  });
}
```

### 2. 커스텀 컴포넌트에 Ref 전달하기 (`forwardRef`)
내장 HTML 태그(`input`, `textarea`)가 아닌 **커스텀 컴포넌트**에 `ref` 속성을 넘기려면 React의 `forwardRef`를 사용해야 한다. 

```js
import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, textarea, ...props }, ref) {
  return (
    <p>
      <label>{label}</label>
      {textarea ? (
        <textarea ref={ref} {...props} />
      ) : (
        <input ref={ref} {...props} />
      )}
    </p>
  );
});
```
* `forwardRef`로 감싼 컴포넌트는 두 번째 인자로 `ref`를 전달받으며, 이를 내부의 실제 DOM 요소에 연결할 수 있다.

### 3. 상태 끌어올리기: App에서 데이터 관리
생성된 프로젝트 데이터는 사이드바와 상세 화면 모두에서 필요하므로, 가장 공통 분모인 `App` 컴포넌트에서 상태를 관리한다.


```js
// App.jsx
function handleAddProject(projectData) {
  setProjectsState(prevState => {
    const newProject = {
      ...projectData,
      id: Math.random() // 간단한 ID 생성
    };

    return {
      ...prevState,
      projects: [...prevState.projects, newProject] // 기존 배열 복사 후 새 프로젝트 추가
    };
  });
}

// ...렌더링 부분
<NewProject onAdd={handleAddProject} />
```

### 4. 입력 타입 최적화 (Date Picker)
사용자로부터 정확한 날짜 형식을 받기 위해 `input`의 `type` 속성을 활용한다.

```javascript
<Input type="text" ref={title} label="Title" />
<Input textarea ref={description} label="Description" />
<Input type="date" ref={dueDate} label="Due Date" />
```
* `type="date"`를 설정하면 브라우저 내장 데이트 피커(Date Picker)가 활성화되어 편리하게 날짜를 선택할 수 있다.

---

## 💡 요약 및 핵심 포인트

1.  **Ref vs State**: 실시간 유효성 검사가 필요 없다면 `useRef`가 렌더링 최적화와 코드 간결성 면에서 유리하다.
2.  **forwardRef**: 커스텀 컴포넌트를 설계할 때 외부에서 제어할 수 있도록 `forwardRef`를 적용하는 습관을 들이자.
3.  **불변성 유지**: 상태 배열을 업데이트할 때는 `[...prevState.projects, newProject]`와 같이 기존 데이터를 복사하여 불변성을 지켜야 한다.

## 데모
![데모](/assets/img/react/state/2.gif)
---

**다음 단계:**
데이터 저장 로직은 완성되었다. 다음에는 입력값이 비어있을 때 경고를 띄우는 **유효성 검사(Validation)**와 **모달(Modal)** 창 구현 방법을 알아보자.

