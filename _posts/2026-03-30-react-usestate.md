---
title: React - 객체 상태를 활용한 조건부 렌더링 구현 (09-1)
date: 2026-03-30
categories: [React]
tags: [React]
image: https://coursework.vschool.io/content/images/size/w2000/2017/08/react-banner.png
layout: post
math: true
toc: true
---


새로운 프로젝트를 생성하거나 목록을 보여주는 등의 복잡한 UI 전환을 효과적으로 관리하기 위해서는 **상태(State) 설계**가 매우 중요하다. 이번 포스팅에서는 `useState`를 사용해 여러 상태를 하나의 객체로 관리하고, 이를 바탕으로 화면을 조건부로 렌더링하는 방법을 정리한다.

## 1. useState의 핵심 개념

### useState란 무엇인가?
`useState`는 함수형 컴포넌트에서 **상태(State)**를 관리할 수 있게 해주는 React Hook이다. 상태가 변하면 React는 해당 컴포넌트를 **리렌더링(Re-rendering)**하여 변경된 UI를 화면에 즉시 반영한다.



```javascript
const [state, setState] = useState(initialValue);
```
* **`state`**: 현재 상태 값.
* **`setState`**: 상태를 업데이트하는 함수.
* **`initialValue`**: 상태의 초기값.

### 🧐 왜 상태를 '객체'로 관리할까?
단순히 `boolean` 값을 여러 개 만드는 대신, 하나의 상위 컴포넌트(`App`)에서 객체 형태의 상태를 관리하면 데이터의 흐름을 파악하기 훨씬 수월하다.

* **연관 데이터의 그룹화**: 프로젝트 목록(`projects`)과 현재 선택된 프로젝트(`selectedProjectId`)는 논리적으로 연결된 데이터이다. 이를 하나로 묶으면 상태 관리의 흐름이 명확해진다.
* **상태 업데이트의 효율성**: 여러 개의 `useState`를 개별적으로 쓰는 대신, 하나의 객체만 업데이트하여 관련 데이터를 한 번에 제어할 수 있다.

---

## 2. 상태 설계: undefined vs null 전략

이번 구현에서는 `selectedProjectId`의 상태값에 따라 앱의 현재 "모드"를 결정한다.

```javascript
const [projectsState, setProjectsState] = useState({
  selectedProjectId: undefined, 
  projects: [] 
});
```

* **`undefined`**: 초기 상태. 아무 프로젝트도 선택되지 않았고, 추가 중도 아닌 대기 화면(Fallback) 상태를 의미한다.
* **`null`**: 'Add Project' 버튼을 눌러 새로운 프로젝트를 생성하려는 입력 폼 상태를 의미한다.
* **`ID (string/number)`**: 특정 프로젝트를 클릭하여 상세 내용을 보고 있는 상태를 의미한다.

단순히 `true/false`만 사용했다면 세 가지 이상의 상태를 표현하기 어려웠겠지만, 이처럼 값의 타입을 다르게 가져감으로써 화면 제어를 깔끔하게 처리할 수 있다.

---

## 3. 상태 변경과 함수형 업데이트

상태를 업데이트할 때는 이전 상태(`prevState`)를 보존하는 것이 핵심이다.

### '함수형 업데이트'가 필요한 이유
React에서 상태 업데이트는 **비동기적**으로 일어날 수 있다. 따라서 최신 상태를 안전하게 가져와 다음 상태를 계산하기 위해서는 `prevState`를 인자로 받는 콜백 함수를 사용하는 것이 가장 안전하다.

```javascript
function handleStartAddProject() {
  setProjectsState(prevState => {
    return {
      ...prevState, // 기존의 projects 배열 등 이전 상태 복사
      selectedProjectId: null, // 새 프로젝트 작성 모드로 전환
    };
  });
}
```

---

## 4. 컴포넌트 간 통신과 조건부 렌더링

### Props를 통한 함수 전달
상태를 변경하는 함수(`handleStartAddProject`)를 하위 컴포넌트로 전달하여 버튼 클릭 시 상위 컴포넌트의 상태가 바뀌도록 연결한다.

```javascript
// App.jsx 내부
<ProjectSidebar onStartAddProject={handleStartAddProject} />
<NoProjectSelected onStartAddProject={handleStartAddProject} />
```

### 조건부 렌더링 로직
상태값에 따라 어떤 컴포넌트를 변수에 담을지 결정한다. `if-else` 문을 사용하여 가독성을 높인다.

```javascript
let content;

if (projectsState.selectedProjectId === null) {
  content = <NewProject />;
} else if (projectsState.selectedProjectId === undefined) {
  content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
}

return (
  <main className="h-screen my-8 flex gap-8">
    <ProjectSidebar onStartAddProject={handleStartAddProject} />
    {content}
  </main>
);
```

---

## 5. 핵심 요약

1. **상태의 의미 분화**: `undefined`와 `null`을 구분하여 앱의 다중 모드(대기, 생성, 상세)를 효과적으로 제어한다.
2. **함수형 업데이트와 전개 연산자**: 객체 상태를 변경할 때는 `...prevState`를 통해 기존 데이터를 유지해야 한다.
3. **컴포넌트 구조화**: 부모의 상태 변경 함수를 자식에게 전달함으로써 UI의 일관성을 유지한다.

## 6. 코드

### App.jsx

```js
import { useState } from "react";
import NewProject from "./component/NewProject";
import ProjectSidebar from "./component/ProjectSidebar";
import NoProjectSelected from "./component/NoProjectSelected.jsx";
function App() {
  const [projectsState, setProjectsState] = useState({
    selectedProjectId: undefined, // neither adding a new project nor have a project selected
    project: [],
  });

  function handleStartAddProject() {
    setProjectsState((prevState) => {
      return {
        ...prevState,
        selectedProjectId: null,
      };
    });
  }

  let content;

  if (projectsState.selectedProjectId === null) {
    content = <NewProject />;
  } else if (projectsState.selectedProjectId === undefined) {
    content = <NoProjectSelected onStartAddProject={handleStartAddProject} />;
  }

  return (
    <main className="flex flex-row h-screen gap-8 my-8">
      {/* <h1 className="my-8 text-5xl font-bold text-center">Hello World</h1>
       */}
      <ProjectSidebar onStartAddProject={handleStartAddProject} />
      {/* <NoProjectSelected onStartAddProject={handleStartAddProject} /> */}
      {content}
    </main>
  );
}

export default App;

```

### 데모

![데모](/assets/img/react/state/1.gif)
- Project가 Selected 되지 않은 상태면 
  - NoProjectSelected 화면
- 'Create new project' 버튼을 클릭
  -  selectedProjectId가 null : 새프로젝트 추가
  -  selectedProjectId가 {어떤 값} : {어떤 값} 프로젝트 상세 보기