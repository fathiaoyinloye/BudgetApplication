package com.budgeting_application.mappers;

import com.budgeting_application.config.SecurityConfig;
import com.budgeting_application.data.models.Budget;
import com.budgeting_application.data.models.BudgetItem;
import com.budgeting_application.data.models.User;
import com.budgeting_application.data.repositories.BudgetItemRepository;
import com.budgeting_application.dtos.requests.AddItemRequest;
import com.budgeting_application.dtos.requests.SignUpRequest;
import com.budgeting_application.dtos.responses.AddBudgetResponse;
import com.budgeting_application.dtos.responses.BudgetItemResponse;
import com.budgeting_application.dtos.responses.SignUpResponse;
import com.budgeting_application.services.jwtService.JWTService;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Mappers {
    public  static User mapSignUpRequest(SignUpRequest signUpRequest, SecurityConfig securityConfig){
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(securityConfig.passwordEncoder().encode(signUpRequest.getPassword()));
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

    public static void mapAddBudgetItem(List<AddItemRequest> request, Budget budget, BudgetItemRepository budgetItemRepository){
        for (AddItemRequest addItemRequest: request){
            BudgetItem budgetItem = new BudgetItem();
            budgetItem.setName(addItemRequest.getName());
            budgetItem.setAmount(addItemRequest.getAmount());
            budgetItem.setTimeFrame(addItemRequest.getTimeFrame());
            budgetItem.setBudgetItemType(addItemRequest.getBudgetItemType());
            budgetItem.setBudget(budget);
            budgetItemRepository.save(budgetItem);
        }
    }

    public static  List<BudgetItemResponse> mapBudgetItem(Budget budget, BudgetItemRepository repository){
        List<BudgetItemResponse> responses = new ArrayList<>();
        for(BudgetItem budgetItem : repository.findAllByBudget(budget)){
            BudgetItemResponse response = new BudgetItemResponse();
            response.setAmount(budgetItem.getAmount());
            response.setTimeFrame(budgetItem.getTimeFrame());
            response.setName(budgetItem.getName());
            responses.add(response);
        }
       return responses;
    }
}
