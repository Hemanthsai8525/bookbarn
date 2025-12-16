package com.example.book.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.book.service.JwtFilter;

@Configuration
public class SecurityConfig {

	private final JwtFilter jwtFilter;

	public SecurityConfig(JwtFilter jwtFilter) {
		System.out.println("SecurityConfig loaded! Admin updates permitted.");
		this.jwtFilter = jwtFilter;
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable());
		http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		http.authorizeHttpRequests(auth -> auth

				// ---------- PUBLIC ----------
				.requestMatchers("/user/login", "/user/register", "/user/refresh", "/user/forgot-password",
						"/user/reset-password",
						"/delivery/login", "/delivery/register", "/delivery/refresh", "/delivery/forgot-password",
						"/delivery/reset-password",
						"/vendors/register", "/vendors/login", "/vendors/forgot-password", "/vendors/reset-password",
						"/otp/**")
				.permitAll()
				.requestMatchers(HttpMethod.GET, "/books").permitAll()
				.requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
				.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow preflight checks
				// ---------- ADMIN ----------
				.requestMatchers("/admin/**").hasRole("ADMIN")
				.requestMatchers(HttpMethod.POST, "/books/**").hasAnyRole("ADMIN", "VENDOR")
				.requestMatchers(HttpMethod.PUT, "/books/**").hasAnyRole("ADMIN", "VENDOR")
				.requestMatchers(HttpMethod.DELETE, "/books/**").hasAnyRole("ADMIN", "VENDOR")

				.requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
				.requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
				.requestMatchers(HttpMethod.DELETE, "/user/**", "/delivery/**").hasRole("ADMIN")

				.requestMatchers("/admin/vendors/**").hasRole("ADMIN")

				// ---------- AUTHENTICATED USERS ----------
				.requestMatchers("/user/me").hasAnyRole("USER", "ADMIN")
				.requestMatchers(HttpMethod.PUT, "/user/*/update-profile").hasAnyRole("USER", "ADMIN")

				// agent endpoints -> require DELIVERY_AGENT role
				.requestMatchers("/delivery/login", "/delivery/register").permitAll()
				.requestMatchers("/delivery/**").hasRole("DELIVERY_AGENT")

				// ---------- ORDERS / CART ----------
				.requestMatchers("/orders", "/orders/**").hasAnyRole("USER", "ADMIN")
				.requestMatchers("/cart", "/cart/**").hasAnyRole("USER", "ADMIN")

				// ---------- EVERYTHING ELSE ----------
				.anyRequest().authenticated());

		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

		// CORS Configuration
		http.cors(cors -> cors.configurationSource(request -> {
			var corsConfig = new org.springframework.web.cors.CorsConfiguration();
			corsConfig.setAllowedOrigins(java.util.List.of("http://localhost:5173", "http://localhost:3000",
					"https://bookbarnkhs.netlify.app"));
			corsConfig.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
			corsConfig.setAllowedHeaders(java.util.List.of("*"));
			corsConfig.setAllowCredentials(true);
			return corsConfig;
		}));

		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
