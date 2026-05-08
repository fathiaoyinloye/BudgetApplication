package budgeting_application.dtos.requests;

import budgeting_application.data.models.BudgetPeriod;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateBudgetRequest {
    private BudgetPeriod period;
    private String name;

}
