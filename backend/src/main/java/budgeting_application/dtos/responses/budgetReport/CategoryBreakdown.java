package budgeting_application.dtos.responses.budgetReport;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


@Getter
@Setter
public class CategoryBreakdown {
    private String category;
    private BigDecimal amount;
    private double percentage;
}
