//package org.revature.RevTaskManagement.controller;
//
//import jakarta.servlet.http.HttpSession;
//import org.revature.RevTaskManagement.models.LoginRequest;
//import org.revature.RevTaskManagement.models.User;
//import org.revature.RevTaskManagement.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/session")
//public class SessionController {
//
//    @Autowired
//    private UserService userService;
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
//        User user = userService.validateUser(loginRequest.getEmail(), loginRequest.getPassword());
//
//        if (user != null) {
//            session.setAttribute("userId", user.getUserid());
//            session.setAttribute("role", user.getRole());
//            return ResponseEntity.ok().header("X-Auth-Token", session.getId()).body(user);
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//        }
//    }
//
//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(HttpSession session) {
//        session.invalidate();
//        return ResponseEntity.ok("Logged out successfully");
//    }
//
//    @GetMapping("/current")
//    public ResponseEntity<?> getCurrentUser(HttpSession session) {
//        Integer userId = (Integer) session.getAttribute("userId");
//        if (userId != null && userId != 0) {
//            User user = userService.getUserById(userId);
//            return ResponseEntity.ok(user);
//        } else {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not logged in");
//        }
//    }
//}
