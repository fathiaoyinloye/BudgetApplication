package com.budgeting_application.dtos.requests;


import com.budgeting_application.data.models.BudgetItemType;
import com.budgeting_application.data.models.BudgetPeriod;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AddItemRequest {
    private String name;
    private BudgetPeriod period;
    private BigDecimal amount;
    private String timeFrame;
    private BudgetItemType budgetItemType;
}
