package com.budgeting_application.services.implementations;

import com.budgeting_application.data.models.Budget;
import com.budgeting_application.data.models.BudgetItem;
import com.budgeting_application.data.models.User;
import com.budgeting_application.data.repositories.BudgetItemRepository;
import com.budgeting_application.dtos.requests.AddItemRequest;
import com.budgeting_application.dtos.requests.CreateBudgetRequest;
import com.budgeting_application.dtos.responses.BudgetItemResponse;
import com.budgeting_application.mappers.Mappers;
import com.budgeting_application.services.interfaces.BudgetItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BudgetItemServiceImpl implements BudgetItemService {

    @Autowired
    private BudgetItemRepository budgetItemRepository;


    @Override
    public List<BudgetItemResponse> addItem(Budget budget, List<AddItemRequest> request) {
        Mappers.mapAddBudgetItem(request, budget, budgetItemRepository);
        return null;

    }

    @Override
    public BudgetItemResponse addItem(Budget budget,AddItemRequest request) {
//        Mappers.mapAddBudgetItem(request, budget, budgetItemRepository);
        return null;

    }

    @Override
    public void deleteItem() {

    }

    @Override
    public void editItem() {

    }



    @Override
    public List<BudgetItemResponse> getAllItems(Budget budget){
        return Mappers.mapBudgetItem(budget,budgetItemRepository);
    }
}
