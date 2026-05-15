package budgeting_application.indexingData;

import java.math.BigDecimal;

public interface ExpensesTotal {
    BigDecimal getBudgetedExpenses();
    BigDecimal getActualExpenses();
}
