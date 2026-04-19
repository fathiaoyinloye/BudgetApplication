package com.budgeting_application.services.interfaces;

import com.budgeting_application.dtos.requests.AddItemRequest;
import com.budgeting_application.dtos.requests.CreateBudgetRequest;
import com.budgeting_application.dtos.requests.SignUpRequest;
import com.budgeting_application.dtos.responses.AddBudgetResponse;
import com.budgeting_application.dtos.responses.BudgetItemResponse;
import com.budgeting_application.dtos.responses.SignUpResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {
    SignUpResponse signUp(SignUpRequest signUpRequest);
    void login();
    AddBudgetResponse addBudget(UUID userID, CreateBudgetRequest request);
    List<BudgetItemResponse> getAllItems(UUID budgetId);
    void addItem(UUID budgetId, List<AddItemRequest> request);



}
