package budgeting_application.services.interfaces;

import budgeting_application.dtos.requests.SignUpRequest;

import budgeting_application.dtos.requests.LoginRequest;
import budgeting_application.dtos.responses.LoginResponse;
import budgeting_application.dtos.responses.SignUpResponse;
import budgeting_application.dtos.responses.UserDetailsResponse;

public interface UserService {
    SignUpResponse signUp(SignUpRequest signUpRequest);
    LoginResponse login(LoginRequest loginRequest);
    UserDetailsResponse getUserDetails();



}
