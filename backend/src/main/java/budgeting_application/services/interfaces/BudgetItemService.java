package budgeting_application.services.interfaces;

import budgeting_application.dtos.requests.AddItemRequest;
import budgeting_application.dtos.requests.EditItemRequest;
import budgeting_application.dtos.responses.BudgetItemResponse;

import java.util.List;
import java.util.UUID;

public interface BudgetItemService {
    List<BudgetItemResponse> addItems(UUID budgetId, List<AddItemRequest> requests);
    void deleteItem(UUID budgetId, UUID itemId);
    BudgetItemResponse editItem(UUID budgetId, UUID itemId, EditItemRequest request);
    List<BudgetItemResponse> getAllItems(UUID budgetID);




    }
