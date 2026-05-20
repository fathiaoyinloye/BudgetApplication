package budgeting_application.controller;

import budgeting_application.dtos.requests.SignUpRequest;
import budgeting_application.dtos.requests.LoginRequest;
import budgeting_application.services.interfaces.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;



import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/v1")
@Slf4j
public class UserController {

        private final UserService userService;
        public UserController(UserService userService) {
            this.userService = userService;
        }


        @PostMapping("/auth/new_user")
        public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
            log.info("Received request to add user with username : {} ",
                    signUpRequest.getUsername());
            var response = userService.signUp(signUpRequest);
            log.info("User added successfully with firstName: {}",response.getFirstName());
            return ResponseEntity.status(CREATED).body(response);
        }

        @PostMapping("/auth/login")
        public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest){
            log.info("Received request to Login by user with username : {} ",
                    loginRequest.getUsername());
            var response = userService.login(loginRequest);
            log.info("User  successfully logged in with firstName: {}",
                    response.getFirstName());
            return ResponseEntity.status(OK).body(response);
        }

    @GetMapping("/user-details")
    public ResponseEntity<?> getUserDetails(){
        return ResponseEntity.status(OK).body(userService.getUserDetails());
    }

}
