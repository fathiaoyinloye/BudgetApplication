package budgeting_application.exceptions;

public class BudgetDoesNotExistException extends BudgetException {
    public BudgetDoesNotExistException(String budgetDoesNotExist) {
        super(budgetDoesNotExist);
    }
}
