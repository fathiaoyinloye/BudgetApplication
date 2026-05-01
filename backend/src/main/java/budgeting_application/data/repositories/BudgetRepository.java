package budgeting_application.data.repositories;

import budgeting_application.data.models.Budget;
import budgeting_application.data.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    List<Budget> findAllByUser(User user);
    Optional<Budget> findByIdAndUser(UUID id, User user);

}
