package budgeting_application.dtos.responses.budgetReport;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class BudgetReportResponse {
    private UUID budgetId;
    private String budgetName;
    private BigDecimal budgetedAmount;
    private BigDecimal actualAmount;
    private BigDecimal remainingAmount;
    private double percentageUsed;
    private String status;
    private List<String> insights;
}
