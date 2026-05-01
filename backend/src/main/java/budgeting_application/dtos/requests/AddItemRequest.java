package budgeting_application.dtos.requests;


import budgeting_application.data.models.BudgetItemType;
import budgeting_application.data.models.BudgetPeriod;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AddItemRequest {
    private String name;
    private BigDecimal budgetedAmount;
    private BudgetItemType budgetItemType;
}
