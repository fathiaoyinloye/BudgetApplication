package budgeting_application.dtos.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDetailsResponse {

    private String firstName;
    private String lastName;
    private String email;
}
