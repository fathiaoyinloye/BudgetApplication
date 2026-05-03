package budgeting_application.services.implementations;


import budgeting_application.config.ApplicationConfig;
import budgeting_application.data.models.User;
import budgeting_application.data.repositories.UserRepository;
import budgeting_application.dtos.requests.SignUpRequest;

import budgeting_application.dtos.requests.LoginRequest;
import budgeting_application.dtos.responses.LoginResponse;
import budgeting_application.dtos.responses.SignUpResponse;
import budgeting_application.dtos.responses.UserDetailsResponse;
import budgeting_application.exceptions.BudgetException;
import budgeting_application.exceptions.UserDoesNotExistException;
import budgeting_application.mappers.Mappers;
import budgeting_application.services.interfaces.UserService;
import budgeting_application.services.security.jwtService.JWTService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ApplicationConfig applicationConfig;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;


    @Override
    public SignUpResponse signUp(SignUpRequest signUpRequest){
        validateNewUsername(signUpRequest.getUsername());
        User user = Mappers.mapSignUpRequest(signUpRequest, applicationConfig);
        userRepository.save(user);
        return Mappers.mapSignUpResponse(user, jwtService);

    }


    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )

        );
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow(() -> new UserDoesNotExistException("Invalid Username or Password"));
        return new LoginResponse(jwtService.generateToken(user), user.getFirstName(), user.getLastName(), "Login Successful");
    }

    @Override
    public UserDetailsResponse getUserDetails(){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user =  userRepository.findByUsername(username)
                .orElseThrow(() -> new UserDoesNotExistException("User not found"));

        return modelMapper.map(user, UserDetailsResponse.class);
    }


    private User getUser( ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new BudgetException("No authenticated user found");
        }

        return (User) authentication.getPrincipal();

    }

    private void validateNewUsername(String username){
        if(userRepository.findByUsername(username).isPresent())
                throw new UserDoesNotExistException("Username not available");

    }
}
