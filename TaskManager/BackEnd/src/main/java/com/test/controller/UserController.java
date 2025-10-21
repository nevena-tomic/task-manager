package com.test.controller;

import com.test.dto.auth.AuthResponse;
import com.test.models.User;
import com.test.security.JwtUtil;
import com.test.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {

            User createdUser = userService.createUser(user);
            String token = jwtUtil.generateToken(createdUser.getUsername());
            AuthResponse response = new AuthResponse(
                    token,
                    createdUser.getUsername(),
                    createdUser.getEmail()
            );

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        User user = userService.findByUsername(username);

        if (user == null || !userService.validatePassword(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }

        String token = jwtUtil.generateToken(user.getUsername());

        AuthResponse response = new AuthResponse(
                token,
                user.getUsername(),
                user.getEmail()
        );

        return ResponseEntity.ok(response);
    }

}