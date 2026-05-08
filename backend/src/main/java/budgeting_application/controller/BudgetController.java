package budgeting_application.controller;

import budgeting_application.dtos.requests.CreateBudgetRequest;
import budgeting_application.dtos.requests.EditBudgetRequest;
import budgeting_application.services.interfaces.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("/api/v1")
public class BudgetController {
    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }


    @PostMapping("/budget")
    public ResponseEntity<?> createBudget(@Valid @RequestBody CreateBudgetRequest request) {
        return ResponseEntity.status(CREATED).body(budgetService.createBudget(request));
    }


    @GetMapping("/budgets")
    public ResponseEntity<?> getBudgets() {
        return ResponseEntity.status(OK).body(budgetService.getAllBudgets());
    }

    @PutMapping("/{budgetId}")
    public ResponseEntity<?> editBudget(@PathVariable UUID budgetId, @RequestBody EditBudgetRequest request) {
        return ResponseEntity.status(OK).body(budgetService.editBudget(budgetId, request));
    }


    @GetMapping("/budget/{budgetId}")
    public ResponseEntity<?> getBudget(@PathVariable UUID budgetId) {
        return ResponseEntity.status(OK).body(budgetService.getBudget(budgetId));
    }

    @DeleteMapping("/budget/{budgetId}")
    public ResponseEntity<?> deleteBudget(@PathVariable UUID budgetId) {
        budgetService.deleteBudget(budgetId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{budgetId}/report")
    public ResponseEntity<?> getBudgetReport(@PathVariable UUID budgetId) {
        return ResponseEntity.status(OK).body(budgetService.getBudgetReport(budgetId));
    }
}

