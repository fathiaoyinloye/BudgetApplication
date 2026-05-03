package budgeting_application.controller;

import budgeting_application.data.repositories.BudgetItemRepository;
import budgeting_application.dtos.requests.AddItemRequest;
import budgeting_application.dtos.requests.EditItemRequest;
import budgeting_application.dtos.responses.BudgetItemResponse;
import budgeting_application.services.interfaces.BudgetItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RequestMapping("/api/v1")
@RestController
@RequiredArgsConstructor
public class BudgetItemController {
        private final BudgetItemService budgetItemService;

        @PostMapping("addItems/{budgetId}")
        public ResponseEntity<?> addItemsToBudget(@PathVariable UUID budgetId, @RequestBody List<AddItemRequest> requests) {
            return ResponseEntity.status(CREATED).body(budgetItemService.addItems(budgetId,requests));}

    @GetMapping("/{budgetId}/items")
    public ResponseEntity<?> getBudgetItems(@PathVariable UUID budgetId) {
        return ResponseEntity.status(OK).body(budgetItemService.getAllItems(budgetId));
    }

    @PatchMapping("/{budgetId}/items/{itemId}")
    public ResponseEntity<BudgetItemResponse> editItem(
            @PathVariable UUID budgetId,
            @PathVariable UUID itemId,
            @RequestBody EditItemRequest request) {

        return ResponseEntity.ok(budgetItemService.editItem(budgetId, itemId, request));
    }
    @DeleteMapping("/{budgetId}/items/{itemId}")
    public ResponseEntity<BudgetItemResponse> deleteItem(
            @PathVariable UUID budgetId,
            @PathVariable UUID itemId) {
        budgetItemService.deleteItem(itemId, budgetId);

        return ResponseEntity.noContent().build();
    }

    }
