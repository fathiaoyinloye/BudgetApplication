package budgeting_application.dtos.responses;

import jakarta.persistence.Column;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class BudgetResponse {
    private UUID budgetID;
    private String name;
    private String period;
    private BigDecimal budgetedAmount;
    private BigDecimal actualAmount;
    private LocalDateTime createdAt;


}
