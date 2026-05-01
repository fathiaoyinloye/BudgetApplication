package budgeting_application.controller;

import budgeting_application.dtos.requests.SignUpRequest;
import budgeting_application.dtos.requests.LoginRequest;
import budgeting_application.services.interfaces.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/v1")
public class UserController {

        private final UserService userService;
        public UserController(UserService userService) {
            this.userService = userService;
        }


        @PostMapping("/auth/new_user")
        public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
            return ResponseEntity.status(CREATED).body(userService.signUp(signUpRequest));
        }

        @PostMapping("/auth/login")
        public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest){
            return ResponseEntity.status(OK).body(userService.login(loginRequest));
        }

    @GetMapping("/user-details")
    public ResponseEntity<?> getUserDetails(){
        return ResponseEntity.status(OK).body(userService.getUserDetails());
    }

}
