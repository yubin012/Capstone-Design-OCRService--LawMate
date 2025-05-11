package com.lawmate.lawmate.Config;

// SecurityFilterChain에서 URL별 보안 정책 정의
// JWT 필터를 UsernamePasswordAuthenticationFilter 앞에 배치
import com.lawmate.lawmate.Config.JWT.JwtAuthenticationEntryPoint;
import com.lawmate.lawmate.Config.JWT.JwtAuthenticationFilter;
import com.lawmate.lawmate.Config.JWT.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationEntryPoint entryPoint;

    public SecurityConfig(JwtTokenProvider jwtTokenProvider, JwtAuthenticationEntryPoint entryPoint) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.entryPoint = entryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .exceptionHandling().authenticationEntryPoint(entryPoint)
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests()
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
