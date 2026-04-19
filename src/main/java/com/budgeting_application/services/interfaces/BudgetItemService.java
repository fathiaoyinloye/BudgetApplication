package com.budgeting_application.services.interfaces;

import com.budgeting_application.data.models.Budget;
import com.budgeting_application.dtos.requests.AddItemRequest;
import com.budgeting_application.dtos.responses.BudgetItemResponse;
import com.budgeting_application.mappers.Mappers;

import java.util.List;
import java.util.UUID;

public interface BudgetItemService {
    List<BudgetItemResponse> addItem(Budget budget, List<AddItemRequest> request);
    void deleteItem();
    void editItem();
    List<BudgetItemResponse> getAllItems(Budget budget);
    BudgetItemResponse addItem(Budget budget,AddItemRequest request);




    }
