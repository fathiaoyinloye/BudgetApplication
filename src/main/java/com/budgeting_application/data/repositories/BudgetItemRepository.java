package com.budgeting_application.data.repositories;

import com.budgeting_application.data.models.Budget;
import com.budgeting_application.data.models.BudgetItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BudgetItemRepository extends JpaRepository<BudgetItem, UUID> {
    List<BudgetItem> findAllByBudget(Budget budget);
}
