package budgeting_application.dtos.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpResponse {
    private String token;
    private String firstName;
    private String lastName;

}
