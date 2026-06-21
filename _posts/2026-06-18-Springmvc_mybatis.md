---
title: "[Spring] Maven 기반 Spring MVC 프로젝트에 MyBatis 연동하기"
date: 2026-06-18
categories: [java, spring]
tags: [java, spring, spring-mvc, file-upload, multipart]
image: "/assets/img/spring/logo.png"
layout: post
math: true
toc: true
mermaid: true
---

## 1. 개요 
> 이번 글에서는 Maven 원형 기반의 Spring MVC 프로젝트에 Mybatis를 연동하는 과정을 정리한다. 
> - Spring MVC 프로젝트에서 DB 접근 코드를 직접 JDBC로 작성하면 Connection, PreparedStatement, ResultSet과 같은
> 처리 관련 BoilerPlate가 생긴다. MyBatis를 활용하면 SQL의 경우 직접 XML Mapper에 분리할 수 있다. 

### 1.1 프로젝트 구조 
> Maven 기반 Spring MVC 프로젝트의 기본 구조는 다음과 같다. 
```
SpringMVC_Basic05_Maven
├── pom.xml
└── src
    └── main
        ├── java
        │   ├── controller
        │   ├── service
        │   ├── dao
        │   │   └── NoticeDao.java
        │   └── vo
        │       └── Notice.java
        ├── resources
        │   └── mapper
        │       └── NoticeDao.xml
        └── webapp
            └── WEB-INF
                ├── web.xml
                ├── views
                └── spring
                    ├── root-context.xml
                    └── servlet-context.xml
```
- MyBatis Mapper XML 파일은 일반적으로 src/main/resources/mapper 아래에 둔다.

## 2. pom.xml에 의존성 추가 
> Spring MVC 프로젝트에서 MyBatis를 사용하려면 다음과 같은 의존성이 필요하다. 

```xml
<dependencies>
    <!-- Spring MVC -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.3.39</version>
    </dependency>

    <!-- MyBatis -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.16</version>
    </dependency>

    <!-- MyBatis Spring 연동 -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>2.1.2</version>
    </dependency>

    <!-- Spring JDBC -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>5.3.39</version>
    </dependency>

    <!-- Oracle JDBC Driver -->
    <dependency>
        <groupId>com.oracle.database.jdbc</groupId>
        <artifactId>ojdbc11</artifactId>
        <version>23.3.0.23.09</version>
    </dependency>

    <!-- Servlet API: Tomcat이 제공하므로 provided -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>4.0.1</version>
        <scope>provided</scope>
    </dependency>

    <!-- JSTL -->
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>jstl</artifactId>
        <version>1.2</version>
    </dependency>
</dependencies>
```

- Tomcat 9버전과 Spring 5 기반의 프로젝트의 경우 javax.servlet 계열을 사용해야한다.
  - Tomcat 10 이상은 jakarta.servlet 계열을 사용하므로 기존 Spring MVC Legacy 프로젝트와 충돌할 수 있다. 

### 2.1 DB 연결 설정 
- [Spring 설정 파일](#spring-설정파일)에 DataSource를 등록해야한다.
  - 아래 예시는 Oracle DB 기준이다. 
    ```xml
      <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
      <property name="driverClassName" value="oracle.jdbc.OracleDriver"/>
      <property name="url" value="jdbc:oracle:thin:@//localhost:1521/FREEPDB1"/>
      <property name="username" value="username"/>
      <property name="password" value="password"/>
      </bean>
    ```

### 2.2 SqlSessionFactoryBean 설정
- MyBatis는 SqlSessionFactory를 통해 SQL 실행 객체를 생성한다. 
- Spring 에서는 SqlSessionFactoryBean을 등록하여 MyBatis와 Spring을 연결한다.


```xml
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
  <property name="dataSource" ref="dataSource"/>
  <property name="mapperLocations" value="classpath:/mapper/*.xml"/>
</bean>
```

### Spring 설정파일
> 일반적인 Spring 설정파일은 아래와 같다. 
- src/main/webapp/WEB-INF/spring/root-context.xml
- src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml

