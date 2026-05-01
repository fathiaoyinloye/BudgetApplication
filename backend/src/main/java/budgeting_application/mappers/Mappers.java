package budgeting_application.mappers;

import budgeting_application.config.ApplicationConfig;
import budgeting_application.data.models.Budget;
import budgeting_application.data.models.BudgetItem;
import budgeting_application.data.models.User;
import budgeting_application.data.repositories.BudgetItemRepository;
import budgeting_application.dtos.requests.AddItemRequest;
import budgeting_application.dtos.requests.SignUpRequest;
import budgeting_application.dtos.responses.BudgetItemResponse;
import budgeting_application.dtos.responses.SignUpResponse;
import budgeting_application.services.jwtService.JWTService;

import java.util.ArrayList;
import java.util.List;

public class Mappers {
    public  static User mapSignUpRequest(SignUpRequest signUpRequest, ApplicationConfig applicationConfig){
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(applicationConfig.passwordEncoder().encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setUsername(signUpRequest.getUsername());
        return user;


    }
    public static SignUpResponse mapSignUpResponse(User user, JWTService jwtService){
        SignUpResponse signUpResponse = new SignUpResponse();
        signUpResponse.setToken(jwtService.generateToken(user));
        signUpResponse.setLastName(user.getLastName());
        signUpResponse.setFirstName(user.getFirstName());
        return signUpResponse;
    }




}
