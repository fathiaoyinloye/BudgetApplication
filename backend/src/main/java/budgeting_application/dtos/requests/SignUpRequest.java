package budgeting_application.dtos.requests;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignUpRequest {

    @Email(message ="Input must be a valid email")
    private String email;

    @NotNull(message = "Firstname must be inputted")
    @NotBlank(message = "Firstname cannot be blank")
    private String firstName;

    @NotNull(message = "Firstname must be inputted")
    @NotBlank(message = "Firstname cannot be blank")
    private String lastName;

    @NotNull(message = "password is required")
    @NotBlank(message = "password cannot be blank")
//    @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
    private String password;

    @NotNull(message = "username is required")
    @NotBlank(message = "username cannot be blank")
//    @Size(min = 8, max = 20, message = "Username must be between 8 and 20 characters")
    private String username;

}
