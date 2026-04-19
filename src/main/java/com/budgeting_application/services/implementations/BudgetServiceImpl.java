package com.budgeting_application.services.implementations;

import com.budgeting_application.data.models.Budget;
import com.budgeting_application.data.models.User;
import com.budgeting_application.data.repositories.BudgetRepository;
import com.budgeting_application.dtos.requests.AddItemRequest;
import com.budgeting_application.dtos.requests.CreateBudgetRequest;
import com.budgeting_application.dtos.responses.BudgetItemResponse;
import com.budgeting_application.services.interfaces.BudgetItemService;
import com.budgeting_application.services.interfaces.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import  java.util.List;
import java.util.UUID;

@Service
public class BudgetServiceImpl implements BudgetService {


    @Autowired
    private BudgetRepository repository;

    @Autowired
    private BudgetItemService budgetItemService;

    @Override
    public Budget addBudget(CreateBudgetRequest request, User user) {
        Budget budget = new Budget();
        budget.setUser(user);
        budget.setAmount(request.getAmount());
        budget.setName(request.getName());
        budget.setPeriod(request.getPeriod());
        repository.save(budget);
        return budget;

    }

    @Override
    public void addItems(UUID budgetId, List <AddItemRequest> request){
        Budget budget = findBudget(budgetId);
        budgetItemService.addItem( budget, request);

    }

//    @Override
    public void addItem(UUID budgetId, AddItemRequest request){
        Budget budget = findBudget(budgetId);
        budgetItemService.addItem( budget, request);

    }

    @Override
    public List<BudgetItemResponse> getAllItems(UUID budgetId) {
        return budgetItemService.getAllItems(findBudget(budgetId));
    }


    @Override
    public void editBudget() {

    }

    @Override
    public void getBudgetSummary() {

    }

    private  Budget findBudget(UUID id){
        return repository.findById(id)
                .orElseThrow(()-> new RuntimeException("Budget Does Not Exist"));
    }
}

