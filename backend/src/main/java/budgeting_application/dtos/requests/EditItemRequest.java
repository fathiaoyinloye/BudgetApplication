package budgeting_application.dtos.requests;

import budgeting_application.data.models.BudgetItemType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class EditItemRequest {
    private String name;
    private BigDecimal budgetedAmount;
    private BigDecimal actualAmount;
    private BudgetItemType budgetItemType;
}
