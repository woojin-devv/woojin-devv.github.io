---
title: "[Spring] MVC 파일 업로드 처리 흐름 정리"
date: 2026-06-16
categories: [java, spring]
tags: [java, spring, spring-mvc, file-upload, multipart]
layout: post
math: true
toc: true
mermaid: true
---

## 1. 개요
> 게시판 기능을 구현하다 보면 글 작성과 함께 이미지를 업로드해야 하는 경우가 있다. 예를 들어, 
> 사용자가 게시글을 작성하면서 사진을 첨부하면, 서버는 사용자가 입력한 내용, 작성자 정보뿐만 아니라 첨부한 파일도
> 함께 처리해야 한다. 
> - **주의할 점: DB에 직접 저장하지 않을 것**

### 1.1 일반적인 파일 업로드 처리 
- 실제 파일 -> 웹 서버의 특정 폴더 혹은 AWS s3와 같은 파일 저장소에 저장 
- 파일 관련 정보 -> DB에 저장

> 예를 들어, 사용자가 1.jpg 파일을 업로드했다고 가정한다. 
> 실제 이미지 파일은 서버의 `/upload` 폴더에 저장하고, DB에는 다음과 같은 정보만 저장한다. 
```java
파일명: 1.jpg
파일 크기: 12500 byte
파일 타입: image/jpeg
저장 경로: /upload/1.jpg
```
- 즉, DB에는 파일 자체가 아니라 파일을 찾기 위한 정보를 저장한다. 

### 1.2 파일 업로드 처리 구조 
> 파일 업로드 기능은 두 가지로 나눌 수 있다. 

1. I/O 작업 
   - 업로드된 파일을 서버의 특정 경로에 저장
2. DB 작업
    - 저장된 파일의 이름, 경로, 크기, 타입 등을 DB에 저장

이때 파일이 서버에 정상적으로 저장되어야 하고, 그 후에 DB에 파일 정보를 insert 해야 한다. 


### 1.3 파일 업로드 처리 흐름 
```mermaid
flowchart LR
    A[사용자 파일 업로드] --> B[Spring MVC Controller에서<br>파일 객체 받기]
    B --> C[파일명, 크기, 타입 등<br>파일 정보 추출]
    C --> D[웹 서버의 upload 폴더에<br>실제 파일 저장]
    D --> E[DB에 파일 정보 저장]
    E --> F[결과 페이지 이동]
```

### 1.4 파일에 직접 저장하지 않는 이유 
- 파일을 DB에 직접 저장할 수 있다. 예를 들어 BLOB 타입을 사용하면 이미지나 파일 데이터를 DB에 저장할 수 있다. 
- 하지만, 일반적인 게시판에서는 파일 자체를 DB에 저장하기보다는, 파일은 별도의 저장소에 저장하고 DB에는 파일 정보만 저장하는 방식을 많이 사용한다. 

## 2. Spring MVC에서 파일 업로드를 위한 DTO
- Spring MVC에서는 일반 form 데이터뿐만 아니라 파일 객체도 DTO로 받을 수 있다.
- 예를 들어 다음과 같은 Photo DTO를 만들 수 있다.

```java
package com.model;

import org.springframework.web.multipart.commons.CommonsMultipartFile;

@Data
public class Photo {

    private String name;
    private int age;

    // DB에 저장할 파일명
    private String image;

    // 실제 업로드된 파일 객체
    private CommonsMultipartFile file;
}
```
### 2.1  file 멤버 필드의 역할
```java
private CommonsMultipartFile file;
```
- file은 사용자가 업로드한 실제 파일 데이터를 받기 위한 필드이다. 
  - JSP form에 다음과 같은 input이 존재한다고 가정하자.  
    ```jsp
      private CommonsMultipartFile file;
    ```
  - 이때, name = "file"과 DTO의 필드명 file이 동일하기 때문에 Spring이 자동으로 파일 객체를 바인딩해준다.

### 2.2 Controller 자동 바인딩 

```java
@PostMapping
public String submit(Photo photo) {
    CommonsMultipartFile file = photo.getFile();
    return "";
}
```
- 컨트롤러에서 다음과 같이 받을 수 있다. 

### 2.3 JSP form 작성 
> 파일 업로드를 하기 위해서는 form 태그에 반드시 enctype="multipart/form-data"를 설정해야한다. 

```jsp
<form action="${pageContext.request.contextPath}/image/upload.do"
      method="post"
      enctype="multipart/form-data">

    이름: <input type="text" name="name"><br>
    나이: <input type="text" name="age"><br>
    이미지: <input type="file" name="file"><br>

    <button type="submit">업로드</button>
</form>
```

## 전체 흐름 

1. 사용자가 form에서 파일 선택
  
2. multipart/form-data 방식으로 서버에 전송
  
3. Spring이 DTO의 CommonsMultipartFile 필드에 파일 객체 자동 바인딩
  
4. Controller에서 파일 객체 추출
  
5. 서버의 upload 폴더에 실제 파일 저장
  
6. 저장된 파일명을 DTO의 image 필드에 세팅
  
7. DB에는 파일명, 경로, 크기, 타입 등 메타데이터 저장
