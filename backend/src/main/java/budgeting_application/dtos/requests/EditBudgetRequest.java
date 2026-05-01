package budgeting_application.dtos.requests;

import budgeting_application.data.models.BudgetPeriod;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class EditBudgetRequest {
    private String name;
    private BudgetPeriod period;
}
