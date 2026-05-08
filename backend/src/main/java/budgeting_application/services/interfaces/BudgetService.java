package budgeting_application.services.interfaces;

import budgeting_application.dtos.requests.CreateBudgetRequest;
import budgeting_application.dtos.requests.EditBudgetRequest;
import budgeting_application.dtos.responses.BudgetResponse;
import budgeting_application.dtos.responses.budgetReport.BudgetReportResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface BudgetService {
    BudgetResponse createBudget(CreateBudgetRequest request);
    List<BudgetResponse> getAllBudgets();
    BudgetResponse editBudget(UUID id,EditBudgetRequest request);
    BudgetResponse getBudget(UUID id);
    void deleteBudget(UUID id);

    BudgetReportResponse getBudgetReport(UUID budgetId);
}
