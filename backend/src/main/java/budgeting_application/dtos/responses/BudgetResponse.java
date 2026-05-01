package budgeting_application.dtos.responses;

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
    private String message;
    private BigDecimal amount;
    private LocalDateTime createdAt;


}
