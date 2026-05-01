package budgeting_application.services.implementations;

import budgeting_application.data.models.Budget;
import budgeting_application.data.models.User;
import budgeting_application.data.repositories.BudgetItemRepository;
import budgeting_application.data.repositories.BudgetRepository;
import budgeting_application.data.repositories.UserRepository;
import budgeting_application.dtos.requests.AddItemRequest;
import budgeting_application.dtos.requests.EditBudgetRequest;
import budgeting_application.dtos.responses.BudgetResponse;
import budgeting_application.exceptions.BudgetDoesNotExistException;
import budgeting_application.exceptions.UserDoesNotExistException;
import budgeting_application.services.interfaces.BudgetItemService;
import budgeting_application.services.interfaces.BudgetService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import  java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static budgeting_application.data.models.BudgetPeriod.NONE;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {


    private final BudgetRepository budgetRepository;
    private final BudgetItemRepository budgetItemRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;


    @Override
    public BudgetResponse createBudget() {
        User user = getUser();
        Budget budget = new Budget();
        budget.setUser(user);
        budget.setName("untitled");
        budget.setPeriod(NONE);
        budget.setAmount(BigDecimal.ZERO);
        Budget savedBudget = budgetRepository.save(budget);
        BudgetResponse budgetResponse = new BudgetResponse();
        budgetResponse.setBudgetID(savedBudget.getId());
        budgetResponse.setName(savedBudget.getName());
        budgetResponse.setAmount(savedBudget.getAmount());
        budgetResponse.setCreatedAt(savedBudget.getCreatedAt());
        budgetResponse.setPeriod(savedBudget.getPeriod().toString());
        budgetResponse.setMessage("Budget Created Successfully");
        return budgetResponse;
    }



    @Override
    public List<BudgetResponse> getAllBudgets() {
        User user = getUser();
        List<Budget> budgets = budgetRepository.findAllByUser(user);
        return budgets.stream()
                .map(budget -> modelMapper.map(budget, BudgetResponse.class))
                .collect(Collectors.toList());
    }


    @Override
    public BudgetResponse editBudget(UUID id,EditBudgetRequest editBudgetRequest) {
        User user = getUser();
        Budget budget = findBudget(id, user);
        if(!editBudgetRequest.getName().isBlank()) budget.setName(editBudgetRequest.getName());
        if(editBudgetRequest.getPeriod() != null) budget.setPeriod(editBudgetRequest.getPeriod());
        Budget savedBudget = budgetRepository.save(budget);
        return modelMapper.map(savedBudget, BudgetResponse.class);
    }

    @Override
    public BudgetResponse getBudget(UUID id) {
        Budget budget = findBudget(id, getUser());
        return modelMapper.map(budget, BudgetResponse.class);
    }

    @Override
    public void deleteBudget(UUID id) {
        Budget budget = findBudget(id, getUser());
        budgetItemRepository.deleteByBudget(budget);
        budgetRepository.delete(budget);
    }

    @Override
    public void getBudgetSummary() {

    }

    private  Budget findBudget(UUID id, User user){
        return budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(()-> new BudgetDoesNotExistException("Budget Does Not Exist"));
    }


    private User getUser( ) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserDoesNotExistException("User not found"));

    }
}

