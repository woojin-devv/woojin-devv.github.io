---
title: Operating System | Computer System Overview
date: 2025-09-25 00:34:00 +0800
categories: [cs study]
tags: [os]
image: https://media.geeksforgeeks.org/wp-content/uploads/20250723191540166280/examples_of_os.webp
---

## ch 1 학습목표
- 시스템의 기본 요소와 그 사이 관계 설명
- 프로세서에 의해 **명령어가 수행**되는 처리 단계를 설명
- **인터럽트의 개념** 이해 및 프로세서가 인터럽트를 사용하는 이유를 설명
- 컴퓨터 메모리 계층 구조 나열 및 설명층 구조 나열 
- 멀티프로세서의 기본 특성과 멀티코어의 구조에 대해 설명
- 스택 연산과 프로시저 호출 및 리턴 지원

## 1.1 컴퓨터 기본 구성 요소(HW)
>### **처리기(CPU; Central Processing Unit)**
> - 컴퓨터의 두뇌: 데이터 연산, 논리 연산(ALU), 제어(control Unit)
> - 레지스터 (register)
> - x86, ARM, PPC, Sparc, Alpha, MIPS, SH4, Xscale

> ### **주기억장치(main memory) | 휘발성(volatile)**
> - 메모리 셀: 메모리 내의 개별적인 저장 공간
> - 데이터와 프로그램 저장 (실 메모리라고도 불림)

> ### **저장 장치(storage device) | 비휘발성(non-volatile)**
> - 디스크, CD-ROM, 플로피, Flash Memory(NOR, NAND 등)

> ### **입출력 장치**
> - 입력 장치: 키보드, 마우스, Key Pad, Touch Screen
> - 출력 장치: 모니터, 프린터, LCD

> ### **통신 장치**
> - 모뎀(modem), 이더넷(Ethernet), IrDA, CDMA, Bluetooth
> - CPU의 비트 수가 커질수록 한 번에 전송 가능한 데이터의 양(버스 폭)이 커져 병렬 처리량이 많아진다
> - 시스템 전체 성능은 CPU, 메모리, I/O 장치 중 가장 느린 구성 요소의 영향을 크게 받는다
> - CPU와 I/O 모듈은 시스템 버스를 통해 데이터를 교환하며, 필요에 따라 메모리 매핑 I/O나 DMA 방식이 활용된다

### **1.1.1 CPU 레지스터**

1. 메모리 주소 레지스터 (MAR)
    1. 다음 번에 읽거나 쓸 주소를 명시
2. 메모리 버퍼 레지스터 (MBR)
    1. 메모리에 쓸 데이터, 수신된 데이터 포함
3. I/O 주소 레지스터(I/O AR)
4. I/O 버퍼 레지스터(I/O BR)

### **1.1.2 마이크로 프로세서**

> 과거) 단일 칩에 하나의 프로세서를 직접 (CPU)
> → 하나의 칩에 코어라고 불리는 여러 개의 프로세서 포함

### 1.1.3 주요 처리기 레지스터 (Processor Registers)

> CPU 내부에 있고, 프로그램 실행에 필요한 정보를 저장하는 레지스터이다.
크게 두 그룹으로 나눌 수 있다.

1. **제어 및 상태 레지스터 (Control and status registers)**
    - 처리기의 작동을 제어하기 위해 사용
    - 프로그램의 실행을 제어하기 위한 특권 모드의 운영체제 루틴에 의해 사용
    
    **종류**
    - Program Counter
        - [**반입***](#반입fetch-cpu가-메모리에서-명령어를-읽어오는-과정)할 명령어의 주소 포함
    - Instruction Register
        - 최근에 반입된 명령어 포함
    - Program Status Word (PSW)
        - interrupt enable / disable
        - supervisor / user mode
        - condition codes or flags
            - positive result, negative result, zero, overflow

### 1.1.4 명령어 실행 (instruction cycle)
> 처리기가 메모리로부터 명령어를 읽거나(fetch) 수행(execution)
```
fetch → execution → store → fetch (loop)
```
1. CPU는 Main Memory로부터 Instruction을 Fetch 한다. 
2. Program Counter가 다음에 fetch할 명령어의 주소를 저장한다. 
3. fetch이후, Program Counter의 증가

### 1.1.5 Instruction Register
> Fetched instruction은 IR에 적재된다.
- 범주
    - 처리기 ~ 메모리
        - CPU와 메모리간 데이터 전달
    - CPU ~ I/O
        - 주변장치로 데이터 전달
    - 데이터 처리
        - 데이터 산술 또는 논리연산
    - 제어
        - 실행 순서의 변경

### 1.1.6 Instruction Register의 구조 (가상)

> - 16bit라고 가정
> - 통상적으로 왼쪽을 상위 비트, 오른쪽을 하위 비트라고 한다.
> - opcode(4bit) : 연산코드 → 연산자로 16개의 연산 가능
>     - 0001 = 메모리에 저장된 값을 [AC*](#누산기accumulator-산술-논리-연산의-중간-결과값을-임시로-저장하는-레지스터로-계산-과정에서-데이터를-누적하고-처리하는-역할을-담당한다-cpu-내부에-위치하며-연산-속도를-높이기-위해-사용된다)에 적재
    - 0010 = AC에 저장된 값을 메모리에 저장
    - 0101 = 메모리에 저장된 값을 AC에 더함
> - address (12bit): 2^12 -1 = 4096 -1

---
## 프로그램 실행 예시
![alt text](/assets/img/os/program_execution.png)
### 1단계 (fetch)
> - PC에 저장된 값 = [300](다음에 실행할 명령어의 메모리주소 )
> - **MAR ← PC** : 300번지를 MAR에 적재
> - **메모리[300] → MBR** : 300번지 메모리에서 명령어 0x1940을 읽어 MBR에 저장
> - **MBR → IR** : 명령어 0x1940을 IR에 저장
> - PC++ : 다음 명령어(301번지)를 가리키도록 증가

### 2단계 (execution)
> - IR에 저장된 값 0x1940를 실행
> - 상위비트 0001(2), 하위비트 0x940
>    - [940] 메모리에 저장된 값을 AC에 적재
>    - **[0 0 0 3] AC**
### 3단계 (fetch)
> - PC에 저장된 값 = 다음에 실행할 명령어의 메모리주소 [301]
> - `0x5941`을 IR에 적재 
> - PC++

### 4단계 (execution)
> - 상위비트 0101(2), 하위비트 0x941
>   - [941] 메모리에 저장된 값을 AC에 누적
>   - [0 0 0 3] + [0 0 0 2] = [0 0 0 5] AC

### 5단계 (fetch)
> - PC에 저장된 값 = 다음에 실행할 명령어의 메모리주소 [302]
>   - `0x2941`을 IR에 적재 
>   - PC++

### 6단계 (execution)
> - 상위비트 0010(2), 하위비트 0x941
>   [941] AC에 저장된 값을 메모리에 저장
>   941번지 >> [0 0 0 5] 

---
## 미주

### **반입(fetch)**: CPU가 **메모리에서 명령어를 읽어오는 과정**
- **PC(Program Counter)** 에 저장된 값 = “다음에 실행할 명령어의 메모리 주소”
- 이 주소가 **MAR(Memory Address Register)** 로 전달됨
- 해당 메모리에서 명령어를 읽어와서 **MBR(Memory Buffer Register)** 에 저장
- 그 명령어가 **IR(Instruction Register)** 로 옮겨짐 → 해석/실행

### **누산기(Accumulator)** 
산술 논리 연산의 중간 결과값을 임시로 저장하는 레지스터로, 계산 과정에서 데이터를 누적하고 처리하는 역할을 담당한다. CPU 내부에 위치하며 연산 속도를 높이기 위해 사용된다.