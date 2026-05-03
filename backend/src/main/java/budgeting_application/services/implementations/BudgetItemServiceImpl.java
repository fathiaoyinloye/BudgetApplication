package budgeting_application.services.implementations;

import budgeting_application.data.models.Budget;
import budgeting_application.data.models.BudgetItem;
import budgeting_application.data.models.User;
import budgeting_application.data.repositories.BudgetItemRepository;
import budgeting_application.data.repositories.BudgetRepository;
import budgeting_application.dtos.requests.AddItemRequest;
import budgeting_application.dtos.requests.EditItemRequest;
import budgeting_application.dtos.responses.BudgetItemResponse;
import budgeting_application.exceptions.BudgetException;
import budgeting_application.services.interfaces.BudgetItemService;
import budgeting_application.services.security.SecurityService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetItemServiceImpl implements BudgetItemService {


    private final BudgetItemRepository budgetItemRepository;
    private final BudgetRepository budgetRepository;
    private final ModelMapper modelMapper;
    private final SecurityService securityService;


    @Override
    @Transactional
    public List<BudgetItemResponse> addItems(UUID budgetId, List<AddItemRequest> requests) {
        Budget budget = findBudget(budgetId);
        List<BudgetItem> itemsToSave = requests.stream()
                .map(request -> {
                    BudgetItem item = modelMapper.map(request, BudgetItem.class);
                    item.setActualAmount(BigDecimal.ZERO);
                    item.setBudget(budget);
                    budget.setBudgetedAmount(budget.getBudgetedAmount().add(item.getBudgetedAmount()));
                    return item;
                })
                .collect(Collectors.toList());

        List<BudgetItem> savedItems = budgetItemRepository.saveAll(itemsToSave);
        return savedItems.stream()
                .map(item -> modelMapper.map(item, BudgetItemResponse.class))
                .collect(Collectors.toList());
    }



    @Override
    public void deleteItem(UUID itemId, UUID budgetId) {
        User user = securityService.getAuthenticatedUser();
        BudgetItem item = findItem(itemId, budgetId, user);
        Budget budget = findBudget(budgetId);
        budget.setBudgetedAmount(budget.getBudgetedAmount().subtract(item.getBudgetedAmount()));
        budgetItemRepository.delete(item);



    }

    @Override
    @Transactional
    public BudgetItemResponse editItem(UUID budgetId, UUID itemId, EditItemRequest request) {
        User user = securityService.getAuthenticatedUser();
        BudgetItem item = findItem(itemId, budgetId, user);
        Budget budget = findBudget(budgetId);

        if (request.getName() != null && !request.getName().isBlank()) {
            item.setName(request.getName());
        }
        if (request.getBudgetedAmount() != null) {
            BigDecimal difference = request.getBudgetedAmount().subtract(item.getBudgetedAmount());
            item.setBudgetedAmount(request.getBudgetedAmount());
            budget.setBudgetedAmount(budget.getBudgetedAmount().add(difference));
        }

        if (request.getActualAmount() != null) {
            BigDecimal difference = request.getActualAmount().subtract(item.getActualAmount());
            item.setActualAmount(request.getActualAmount());
            budget.setActualAmount(budget.getActualAmount().add(difference));
        }
        if (request.getBudgetItemType() != null) {
            item.setBudgetItemType(request.getBudgetItemType());
        }
        BudgetItem savedItem = budgetItemRepository.save(item);
        return modelMapper.map(savedItem, BudgetItemResponse.class);
    }


    @Override
    public List<BudgetItemResponse> getAllItems(UUID budgetID){
        return getAllBudgetItems(budgetID);

    }


    private Budget findBudget(UUID id){
        return budgetRepository.findById(id)
                .orElseThrow(()-> new BudgetException("Budget Does Not Exist"));
    }

    private BudgetItem findItem(UUID itemId, UUID budgetId, User user) {
        return budgetItemRepository.findItemSecurely(itemId, budgetId, user).orElseThrow(() -> new BudgetException("Item Does Not Exist"));
    }


        private List<BudgetItemResponse> getAllBudgetItems(UUID id){
        var savedItems = budgetItemRepository.findAllByBudget(findBudget(id));
        return savedItems.stream()
                .map(item -> modelMapper.map(item, BudgetItemResponse.class))
                .collect(Collectors.toList());
    }
}
