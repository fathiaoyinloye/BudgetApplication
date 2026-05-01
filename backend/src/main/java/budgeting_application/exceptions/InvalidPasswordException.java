package budgeting_application.exceptions;

import org.springframework.http.HttpStatus;

public class InvalidPasswordException extends BudgetException {
    public InvalidPasswordException(String message, HttpStatus status) {
        super(message);
    }
}
