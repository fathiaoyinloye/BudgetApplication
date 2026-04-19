package com.budgeting_application.services.implementations;

import com.budgeting_application.data.models.BudgetPeriod;
import com.budgeting_application.data.models.User;
import com.budgeting_application.data.repositories.BudgetItemRepository;
import com.budgeting_application.data.repositories.BudgetRepository;
import com.budgeting_application.data.repositories.UserRepository;
import com.budgeting_application.dtos.requests.CreateBudgetRequest;
import com.budgeting_application.dtos.requests.SignUpRequest;
import com.budgeting_application.dtos.responses.SignUpResponse;
import com.budgeting_application.services.interfaces.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserServiceImplTest {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;


    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private BudgetItemRepository budgetItemRepository;

    @BeforeEach
    void SetUp(){
        budgetItemRepository.deleteAll();
        budgetRepository.deleteAll();
        userRepository.deleteAll();

    }

    @Test
    void testThatUserCanSignUp(){
        assertEquals(0,userRepository.count());
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setFirstName("Fathia");
        signUpRequest.setPassword("fathia");
        signUpRequest.setLastName("Oyinloye");
        signUpRequest.setEmail("fathiaoyinloye@gmail.com");
        SignUpResponse response= userService.signUp(signUpRequest);
        assertNotNull(response.getId());
        assertEquals(1,userRepository.count());

    }


    @Test
    void testThatUserCanOneAddBudget(){
        assertEquals(0,userRepository.count());
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setFirstName("Fathia");
        signUpRequest.setPassword("fathia");
        signUpRequest.setLastName("Oyinloye");
        signUpRequest.setEmail("fathiaoyinloye@gmail.com");
        SignUpResponse response= userService.signUp(signUpRequest);
        assertNotNull(response.getId());
        assertEquals(1,userRepository.count());

        CreateBudgetRequest request = new CreateBudgetRequest();
        request.setAmount(BigDecimal.valueOf(5000));
        request.setPeriod(BudgetPeriod.MONTHLY);
        request.setName("Bakery");
        userService.addBudget(response.getId(),request);
        assertEquals(1,budgetRepository.count());
        assertEquals(response.getId(), budgetRepository.findAll().getFirst().getUser().getId());


    }

}