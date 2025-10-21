package com.test.service;

import com.test.models.User;
import com.test.repository.UserRepository;
import com.test.security.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User createUser(User user) {
        System.out.println("=== CREATE USER START ===");
        System.out.println("Username: " + user.getUsername());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Raw password: " + user.getPassword());

        User existingUserByUsername = userRepository.findByUsername(user.getUsername());
        if (existingUserByUsername != null) {
            System.out.println("=== USERNAME ALREADY EXISTS ===");
            throw new RuntimeException("Username already exists");
        }

        User existingUserByEmail = userRepository.findByEmail(user.getEmail());
        if (existingUserByEmail != null) {
            System.out.println("=== EMAIL ALREADY EXISTS ===");
            throw new RuntimeException("Email already exists");
        }

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        System.out.println("Encoded password: " + encodedPassword);

        try {
            User savedUser = userRepository.save(user);
            System.out.println("=== USER SAVED SUCCESSFULLY ===");
            System.out.println("Saved user ID: " + savedUser.getId());
            System.out.println("Saved user username: " + savedUser.getUsername());
            return savedUser;
        } catch (Exception e) {
            System.out.println("=== ERROR SAVING USER: " + e.getMessage() + " ===");
            e.printStackTrace();
            throw new RuntimeException("Failed to save user: " + e.getMessage());
        }
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}