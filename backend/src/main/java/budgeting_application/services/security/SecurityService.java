package budgeting_application.services.security;

import budgeting_application.data.models.User;
import budgeting_application.data.repositories.UserRepository;
import budgeting_application.exceptions.UserDoesNotExistException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {
    private final UserRepository userRepository;

    public SecurityService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserDoesNotExistException("User not found"));
    }
}