package budgeting_application.services.implementations;

import budgeting_application.data.models.Budget;
import budgeting_application.data.models.User;
import budgeting_application.data.repositories.BudgetItemRepository;
import budgeting_application.data.repositories.BudgetRepository;
import budgeting_application.data.repositories.UserRepository;
import budgeting_application.dtos.requests.CreateBudgetRequest;
import budgeting_application.dtos.requests.EditBudgetRequest;
import budgeting_application.dtos.responses.BudgetResponse;
import budgeting_application.dtos.responses.budgetReport.BudgetReportResponse;
import budgeting_application.exceptions.BudgetDoesNotExistException;
import budgeting_application.indexingData.BudgetTotals;
import budgeting_application.indexingData.ExpensesTotal;
import budgeting_application.services.geminiService.GeminiService;
import budgeting_application.services.interfaces.BudgetService;
import budgeting_application.services.security.SecurityService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import  java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {


    private final BudgetRepository budgetRepository;
    private final BudgetItemRepository budgetItemRepository;
    private final GeminiService geminiService;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final SecurityService securityService;
    private final InsightService insightService;


    @Override
    public BudgetResponse createBudget(CreateBudgetRequest request) {
        User user = securityService.getAuthenticatedUser();
        Budget budget = new Budget();
        budget.setUser(user);
        modelMapper.map(request, budget);
        return getBudgetResponse(budget);
    }



    @Override
    public List<BudgetResponse> getAllBudgets() {
        User user = securityService.getAuthenticatedUser();
        List<Budget> budgets = budgetRepository.findAllByUser(user);

        return budgets.stream()
                .map(this::getBudgetResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BudgetResponse editBudget(UUID id,EditBudgetRequest editBudgetRequest) {
        User user = securityService.getAuthenticatedUser();
        Budget budget = findBudget(id, user);
        if(!editBudgetRequest.getName().isBlank()) budget.setName(editBudgetRequest.getName());
        if(editBudgetRequest.getPeriod() != null) budget.setPeriod(editBudgetRequest.getPeriod());
        return getBudgetResponse(budget);
    }

    @NonNull
    private BudgetResponse getBudgetResponse(Budget budget) {
        Budget savedBudget = budgetRepository.save(budget);
        BudgetTotals totals = budgetItemRepository.getBudgetTotals(savedBudget.getId());
        BudgetResponse response = modelMapper.map(savedBudget, BudgetResponse.class);
        response.setBudgetedAmount(totals.getBudgetedTotal());
        response.setActualAmount(totals.getActualTotal());
        return response;
    }

    @Override
    public BudgetResponse getBudget(UUID id) {
        User user = securityService.getAuthenticatedUser();
        Budget budget = findBudget(id, user);
        return getBudgetResponse(budget);
    }

    @Override
    @Transactional
    public void deleteBudget(UUID id) {
        User user = securityService.getAuthenticatedUser();
        Budget budget = findBudget(id, user);
        budgetItemRepository.deleteByBudget(budget);
        budgetRepository.delete(budget);
    }

    @Override
    public BudgetReportResponse getBudgetReport(UUID budgetId) {
        Budget budget = findBudget(budgetId, securityService.getAuthenticatedUser());
        BudgetTotals totals = budgetItemRepository.getBudgetTotals(budgetId);
        ExpensesTotal expensesTotal = budgetItemRepository.findExpenseTotals(budgetId);
        double performancePercentage =  getPerformancePercentage(totals);
        double percentageUsed = getPercentageUsed(expensesTotal);
        BudgetReportResponse response = new BudgetReportResponse();
        response.setBudgetedAmount(totals.getBudgetedTotal());
        response.setActualAmount(totals.getActualTotal());
        response.setBudgetId(budgetId);
        response.setBudgetName(budget.getName());
        response.setRemainingAmount(totals.getBudgetedTotal().subtract(totals.getActualTotal()));
        response.setBudgetPerformancePercentage(performancePercentage);
        response.setPercentageUsed(percentageUsed);
        response.setStatus(getStatus(percentageUsed));
        response.setInsights(insightService.generateInsights(percentageUsed));
        response.setAiResponse(geminiService.getBudgetInsight(response));
        return response;
    }

    private  double getPerformancePercentage(BudgetTotals totals) {
        return totals.getActualTotal()
                .divide(totals.getBudgetedTotal(), 2, RoundingMode.HALF_UP)
                .multiply(new BigDecimal(100))
                .doubleValue();
    }

    private  double getPercentageUsed(ExpensesTotal totals) {
        return totals.getActualExpenses()
                .divide(totals.getBudgetedExpenses(), 2, RoundingMode.HALF_UP)
                .multiply(new BigDecimal(100))
                .doubleValue();
    }

    private  Budget findBudget(UUID id, User user){
        return budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(()-> new BudgetDoesNotExistException("Budget Does Not Exist"));
    }

    private String getStatus(double percentageUsed){
        if(percentageUsed < 0)
            return "Unhealthy";

        if(percentageUsed < 60)
            return "Healthy";
        else if(percentageUsed < 80)
            return "Warning";
        else
            return "Critical";

    }



}

