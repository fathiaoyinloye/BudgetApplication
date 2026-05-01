package budgeting_application.exceptions;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class BudgetException extends RuntimeException {

    public BudgetException(String message) {
        super(message);
    }
}
