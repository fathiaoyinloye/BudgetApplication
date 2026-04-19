package com.budgeting_application.dtos.responses;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BudgetItemResponse {
    private String name;
    private BigDecimal amount;
    private String timeFrame;


}
