package budgeting_application.data.repositories;

import budgeting_application.data.models.Budget;
import budgeting_application.data.models.BudgetItem;
import budgeting_application.data.models.User;
import budgeting_application.indexingData.BudgetTotals;
import budgeting_application.indexingData.ExpensesTotal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetItemRepository extends JpaRepository<BudgetItem, UUID> {
    List<BudgetItem> findAllByBudget(Budget budget);
    void deleteByBudget(Budget budget);
    @Query("SELECT bi FROM BudgetItem bi WHERE bi.id = :itemId AND bi.budget.id = :budgetId AND bi.budget.user = :user")
    Optional<BudgetItem> findItemSecurely(UUID itemId, UUID budgetId, User user);

    @Query("""
    SELECT 
        SUM(CASE WHEN b.budgetItemType = 'INCOME' THEN b.budgetedAmount ELSE -b.budgetedAmount END) AS budgetedTotal, 
        SUM(CASE WHEN b.budgetItemType = 'INCOME' THEN COALESCE(b.actualAmount, 0) ELSE -COALESCE(b.actualAmount, 0) END) AS actualTotal 
    FROM BudgetItem b 
    WHERE b.budget.id = :budgetId
""")
    BudgetTotals getBudgetTotals(UUID budgetId);


    @Query("""
    SELECT 
        SUM(b.budgetedAmount) AS budgetedExpenses, 
        SUM(COALESCE(b.actualAmount, 0)) AS actualExpenses 
    FROM BudgetItem b 
    WHERE b.budget.id = :budgetId 
    AND b.budgetItemType = 'EXPENSE'
""")
    ExpensesTotal findExpenseTotals(UUID budgetId);
}
