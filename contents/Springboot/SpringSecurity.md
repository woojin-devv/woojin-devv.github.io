---
title: "[Spring Boot] 스프링 시큐리티(Spring Security) 정리"
description: ""
date: 2026-06-24
slug: "/Springboot-security/"
tags: [SpringBoot]
heroImage: ./heroImage.png
heroImageAlt: "[Spring Boot]"
---


## 스프링 시큐리티 동작 방식 
> ![alt](/static/assets/img/springboot/springsecurity/1.png)
1. 인증이 필요한 화면 접근 시 로그인 화면을 보여주고 username과 password를 입력 받음 
  - 이때, HTTPServletRequest에 username, password가 전달됨. 
  - AuthenticationFilter가 넘어온 username과 password의 validation check를 진행함.
   
2. 유효성 검사 후 실제 구현체인 UsernamePasswordAuthenticationToken을 생성 

3. 2번에서 만든 Token을 AuthenticationManager에게 전달

4. AuthenticationManager가 해당 Token을 AuthenticationProvider에게 전달
   
5. 사용자 아이디를 UserDetailsService로 보냄
    - UserDetailService는 사용자 아이디로 찾은 사용자의 정보를 UserDetails 객체로 만들어 AuthenticationProvider에게 전달
  
6. DB에 있는 사용자의 정보를 가져옴 

7. 입력 정보와 UserDetails의 정보를 비교해 실제 인증 처리를 진행 

8. 8~10까지 인증이 완료되면, SecurityContextHolder에 Authentication을 저장함. 
    - 인증 성공 여부에 따라, 
      - 성공시 
        -  AuthenticationSuccessHandler
       - 실패시    
         -  AuthenticationFailureHandler
  
## 인가(Authorization) 주요 방식 

1. URL 기반 접근 제어 
    - `http.authorizeHttpRequests().requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")`
2. 메서드 기반 접근 제어 
   `@PreAuthorize("hasAuthority('ROLE_ADMIN')")`

### 인가 동작 방식 
1. 사용자가 특정 URL에 접근 시도 
2. 스프링 시큐리티의 필터체인이 요청을 가로챔
3. 인증한 정보(UserDetails)에 포함된 권한(Authority) 확인
4. 접근 허용 또는 AccessDeniedException(403) 발생