package budgeting_application.data.repositories;

import budgeting_application.data.models.Budget;
import budgeting_application.data.models.BudgetItem;
import budgeting_application.data.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetItemRepository extends JpaRepository<BudgetItem, UUID> {
    List<BudgetItem> findAllByBudget(Budget budget);
    void deleteByBudget(Budget budget);
    Optional<BudgetItem> findByIdAndBudget_User(UUID itemId, User user);

    @Query("SELECT bi FROM BudgetItem bi WHERE bi.id = :itemId AND bi.budget.id = :budgetId AND bi.budget.user = :user")
    Optional<BudgetItem> findItemSecurely(UUID itemId, UUID budgetId, User user);
}
