---
title: "[008] 자바 인터페이스 정리"
date: 2026-04-13
categories: [JAVA]
tags: [JAVA, OOP]
image: https://cdn.shopaccino.com/igmguru/products/java-oop-training-course-1579280444136756_l.jpg?v=547
layout: post
math: true
toc: true
---

## 개선된 for문



```java

for (타입 변수명 : 배열이나컬렉션) {
    // 반복 실행할 코드
}

// 1차원 배열 
int[] scores = {90, 80, 70, 100};
int sum = 0;

for (int score : scores) {
    sum += score;
}

// 다차원 배열 
int[][] matrix = { {1, 2}, {3, 4} };

for (int[] row : matrix) {     // 1. matrix에서 1차원 배열(행)을 꺼냄
    for (int value : row) {    // 2. 꺼낸 행에서 실제 값(int)을 꺼냄
        System.out.print(value);
    }
}

```

## 인터페이스

---

- 인터페이스는 소프트웨어 설계 최상위 단계
- 인터페이스는 무에서 유를 창조

**인터페이스란?**

**약속, 규칙, 규약, 표준**을 만드는 행위를 말함

**표준이란?**

- 아이폰의 C타입 충전
- 볼트를 조일 때 오른쪽
- 엘리베이터의 상승 버튼 (삼각형)등

**ISO(International Organization for Standardization) 표준 : 국가** 

- 인터페이스는 약속(규약)만 존재하며, 구현부는 존재하지 않는다.

### 추상클래스와 인터페이스의 공통점

1. **스스로 객체를 만들 수 없다. (구현부가 존재하지 않는다.  - new 연산자 사용 불가 )**
    - 차이점 ?
        
        추상 (완성 + 미완성의 결합) , 인터페이스 (미완성 자원)  
        
2. **추상클래스 `extends`** 
    
    **인터페이스 `implements`**
    
    ```java
    class Car extends AbClass{}  //상속
    class Car extends Object implemenets Ia {}  // 구현
    // Car는 Object를 상속하고, Ia를 구현한다. 
    ```
    
    둘 다 추상자원 (실행 블럭이 없다) → 미완성 자원
    
    ***⇒ 강제적 구현*** 이 목적이다.  → 재정의 (override) 해야 함. 
    
3. **다른점** 
    
    다중상속 : 인터페이스는 다중 상속(구현) 
    
    약속의 범위는 작게 하는 것이 좋다 . (재사용성 높게 하기 위함)
    
    - 인터페이스끼리는 서로 상속이 가능 ⇒ 약속을 더 크게(?)
    - 인터페이스 구현하는 입장에서 보면 다중 구현
    
    ```java
    // Ia, Ib, Ic
    class Text extends Object implements Ia, Ib, Ic {
    	
    }
    ```
    
4. **인터페이스는 (상수를 제외한 나머지는 추상함수 ) > JDK8 (default, static)**  
    - 초급 개발자의 시선에서 바라보면,
        1. **인터페이스는 [다형성] 입장으로 접근 (70 ~ 80 % 해결) ; 인터페이스는 부모 타입** 
        2. **서로 연관성이 없는 클래스를 하나로 묶어주는 역할⭐️⭐️⭐️**
            - 같은 부모를 가지므로..
        3. **자바 만든 아저씨 >> JAVA API 당신이 설계한 왠만한 것들을 만들어줄게 >> 수많은 인터페이스 활용**
        4. **인터페이스의 해석은 (~able ; ~할 수 있는)으로 해석됨.**
            - 날 수 있는
            - 수리할 수 있는
            - 먹을 수 있는
        5. **객체간 연결 고리 (객체간 소통의 역할 ) : 다형성의 원리로 접근** 
        

### interface summary

1. 실제 구현부를 가지고 있지 않다. > 실행 블럭이 없다. 
2. `Interfacte Iable { void move(int x, int y); }` 
3. JAVA API → Collection > List, Set, Map을 이해해야 함

### #1 Interface 생성

```java
interface Ia {
	// 상수 구현 
	// public static final int VERSION = 1; -> 컴파일러는 인터페이스가 가지고 있는 모든 자원을 상수로 취급함
	int VERSION = 1; // 앞에 public static final이 생략됨. 
	
	// 추상 함수 
	// public abstract void run();
	void run(); // 앞에 public abstract 컴파일러가 자동으로 붙임 
	
}
```

### #2 Ia와 Ib는 같음

```java
interface Ia {
	public static final int AGE = 100;
	public static final String GENDER = "남";

	public abstract String print();

	public abstract void message(String str);
}

interface Ib {
	int AGE = 100;
	String Gender = "남";

	String print();

	void message(String str);
}
```

### #3 Interface 구현부 > 상속 & Override

```java
class Test2 extends Object implements Ib, Ic {

	@Override
	public String print() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void message(String str) {
		// TODO Auto-generated method stub

	}

}
```

```java
public class Ex03_Interface {

	public static void main(String[] args) {
		Test2 test2 = new Test2();

		Ib ib = test2;

		System.out.println(ib.AGE);
		System.out.println(ib.Gender);
		System.out.println(ib.toString());
	}

}
```

> 
> 
> 
> ![alt text](/assets/img/java-study/08/1.png)
> 

### Quiz.  인터페이스에서

- 정답
    - 
    
    ---
    
    해설 : 모든 참조 타입은 Object 메서드를 사용할 수 있도록 허용한다. 
    
    인터페이스 타입도 자바의 참조 타입이기 때문에, Object의 자원을 사용할 수 있다.