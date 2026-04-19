package com.budgeting_application.services.implementations;

import com.budgeting_application.config.SecurityConfig;
import com.budgeting_application.data.models.Budget;
import com.budgeting_application.data.models.User;
import com.budgeting_application.data.repositories.UserRepository;
import com.budgeting_application.dtos.requests.AddItemRequest;
import com.budgeting_application.dtos.requests.CreateBudgetRequest;
import com.budgeting_application.dtos.requests.SignUpRequest;
import com.budgeting_application.dtos.responses.AddBudgetResponse;
import com.budgeting_application.dtos.responses.BudgetItemResponse;
import com.budgeting_application.dtos.responses.SignUpResponse;
import com.budgeting_application.exceptions.UserDoesNotExistException;
import com.budgeting_application.mappers.Mappers;
import com.budgeting_application.services.interfaces.BudgetService;
import com.budgeting_application.services.interfaces.UserService;
import com.budgeting_application.services.jwtService.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SecurityConfig securityConfig;
    private final BudgetService budgetService;
    private final JWTService jwtService;

    public UserServiceImpl(UserRepository userRepository, SecurityConfig securityConfig, BudgetService budgetService, JWTService jwtService) {
        this.userRepository = userRepository;
        this.securityConfig = securityConfig;
        this.budgetService = budgetService;
        this.jwtService = jwtService;
    }

    @Override
    public SignUpResponse signUp(SignUpRequest signUpRequest){
        validateNewUsername(signUpRequest.getUsername());
        User user = Mappers.mapSignUpRequest(signUpRequest, securityConfig);
        userRepository.save(user);
        return Mappers.mapSignUpResponse(user, jwtService);

    }
    @Override
    public AddBudgetResponse addBudget(UUID userID, CreateBudgetRequest request) {
        Budget budget = budgetService.addBudget(request, findUser(userID));
        AddBudgetResponse addBudgetResponse = new AddBudgetResponse();
        addBudgetResponse.setBudgetID(budget.getId());
        addBudgetResponse.setName(budget.getName());
        return addBudgetResponse;

    }

    @Override
    public List<BudgetItemResponse> getAllItems(UUID budgetId) {
        return budgetService.getAllItems(budgetId);
    }

    @Override
    public void addItem(UUID budgetId, List<AddItemRequest> request) {
        budgetService.addItems(budgetId,request);
    }

    @Override
    public void login() {

    }


    private User findUser(UUID id){
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User does not exist"));

    }


    private void validateNewUsername(String username){
        if(userRepository.findByUsername(username).isPresent())
                throw new UserDoesNotExistException("Username not available");

    }
}
