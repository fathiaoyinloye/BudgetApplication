package com.budgeting_application.dtos.requests;

import com.budgeting_application.data.models.BudgetPeriod;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class CreateBudgetRequest {
    private String name;
    private BudgetPeriod period;
    private BigDecimal amount;
}
