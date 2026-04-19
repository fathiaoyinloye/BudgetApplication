package com.budgeting_application.services.interfaces;

import com.budgeting_application.data.models.Budget;
import com.budgeting_application.data.models.User;
import com.budgeting_application.dtos.requests.AddItemRequest;
import com.budgeting_application.dtos.requests.CreateBudgetRequest;
import com.budgeting_application.dtos.responses.BudgetItemResponse;

import java.util.List;
import java.util.UUID;

public interface BudgetService {
    Budget addBudget(CreateBudgetRequest request, User user);
    void addItems(UUID budgetId, List<AddItemRequest> request);
    List<BudgetItemResponse> getAllItems(UUID budgetId);
    void editBudget();
    void getBudgetSummary();
}
