package com.budgeting_application.controller;

import com.budgeting_application.dtos.requests.SignUpRequest;
import com.budgeting_application.services.interfaces.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;
@RestController
@RequestMapping("/api/v1/")
public class UserController {

        private final UserService userService;
        public UserController(UserService userService) {
            this.userService = userService;
        }


        @PostMapping("/new_user")
        public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
            return ResponseEntity.status(CREATED).body(userService.signUp(signUpRequest));
        }



}
