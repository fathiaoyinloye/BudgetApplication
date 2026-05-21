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
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ApplicationConfig applicationConfig;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ModelMapper modelMapper;


    @Override
    public SignUpResponse signUp(SignUpRequest signUpRequest){
        log.info("Received sign up request from: {}", signUpRequest.getUsername());
        validateNewUsername(signUpRequest.getUsername());
        validateMail(signUpRequest.getEmail());
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
        log.info("Fetching user details for username: {}", username);

        User user =  userRepository.findByUsername(username)
                .orElseThrow(() -> {
            log.warn("User details requested but user not found for username: {}",
                    username);

            return new UserDoesNotExistException("User not found");
        });

        log.info("User details fetched successfully for userId: {}",
                user.getId());


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
        if(userRepository.findByUsername(username).isPresent()){
            log.warn("Username already exists: {}", username) ;
            throw new UserDoesNotExistException("Username not available");
        }

    }

    private void validateMail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            log.warn("Email already exists: {}", email);
            throw new UserDoesNotExistException("Email not available");
        }

    }
}
