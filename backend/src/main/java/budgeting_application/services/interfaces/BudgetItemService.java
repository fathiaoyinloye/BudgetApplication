package budgeting_application.services.interfaces;

import budgeting_application.data.models.Budget;
import budgeting_application.dtos.requests.AddItemRequest;
import budgeting_application.dtos.responses.BudgetItemResponse;

import java.util.List;
import java.util.UUID;

public interface BudgetItemService {
    List<BudgetItemResponse> addItems(UUID budgetId, List<AddItemRequest> requests);
    void deleteItem();
    void editItem();
    List<BudgetItemResponse> getAllItems(UUID budgetID);
    BudgetItemResponse addItem(Budget budget,AddItemRequest request);




    }
