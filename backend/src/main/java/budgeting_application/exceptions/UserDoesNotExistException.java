package budgeting_application.exceptions;

import org.springframework.http.HttpStatus;

public class UserDoesNotExistException extends BudgetException {
    public UserDoesNotExistException(String message) {
        super(message);
    }
}
