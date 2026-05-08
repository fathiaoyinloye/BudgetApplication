package budgeting_application.indexingData;

import java.math.BigDecimal;

public interface BudgetTotals {
    BigDecimal getBudgetedTotal();
    BigDecimal getActualTotal();
}
