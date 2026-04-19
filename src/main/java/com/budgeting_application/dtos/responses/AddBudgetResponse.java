package com.budgeting_application.dtos.responses;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class AddBudgetResponse {
    private UUID budgetID;
    private String name;
    private String timeFrame;

}
