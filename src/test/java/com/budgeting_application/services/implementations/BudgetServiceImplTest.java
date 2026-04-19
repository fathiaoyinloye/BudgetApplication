package com.budgeting_application.services.implementations;

import com.budgeting_application.data.models.Budget;
import com.budgeting_application.data.models.BudgetItemType;
import com.budgeting_application.data.models.BudgetPeriod;
import com.budgeting_application.data.models.User;
import com.budgeting_application.data.repositories.BudgetItemRepository;
import com.budgeting_application.data.repositories.BudgetRepository;
import com.budgeting_application.data.repositories.UserRepository;
import com.budgeting_application.dtos.requests.AddItemRequest;
import com.budgeting_application.dtos.requests.CreateBudgetRequest;
import com.budgeting_application.services.interfaces.BudgetService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static com.budgeting_application.data.models.BudgetItemType.EXPENSE;
import static com.budgeting_application.data.models.BudgetPeriod.ANNUAL;
import static com.budgeting_application.data.models.BudgetPeriod.MONTHLY;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BudgetServiceImplTest {

    @Autowired
    BudgetRepository repository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BudgetService budgetService;


    @Autowired
    BudgetItemRepository itemRepository;


    User user;

    @BeforeEach
    void SetUp(){
        itemRepository.deleteAll();
        repository.deleteAll();
        userRepository.deleteAll();

        user = new User();
        user.setLastName("Tope");
        user.setFirstName("Fathia");
        user.setPassword("fathia");
        user.setEmail("fathiaoyinoye20@gmail.com");
        userRepository.save(user);


    }


    private Budget createBudget(String name, BudgetPeriod period, BigDecimal amount){
        CreateBudgetRequest createBudgetRequest = new CreateBudgetRequest();
        createBudgetRequest.setName(name);
        createBudgetRequest.setPeriod(period);
        createBudgetRequest.setAmount(amount);
       return budgetService.addBudget(createBudgetRequest, user);
    }

    private  AddItemRequest addItemRequest(BigDecimal amount,String name, BudgetPeriod period, String timeFrame, BudgetItemType type ){
        AddItemRequest request =new AddItemRequest();
        request.setAmount(amount);
        request.setPeriod(period);
        request.setName(name);
        request.setTimeFrame(timeFrame);
        request.setBudgetItemType(type);
        return  request;
    }

    @Test
    void testThatBudgetCanBeAdded(){
        assertEquals(0, repository.count());
        createBudget("School Fees", ANNUAL, BigDecimal.valueOf(400));
        assertEquals(1, repository.count());
    }


    @Test
    void  testThatItemsCanBeAddedToBudget() {
        assertEquals(0,itemRepository.count());
        assertEquals(0, repository.count());
        Budget budget = createBudget("Hair", MONTHLY,BigDecimal.valueOf(400));
        assertEquals(1, repository.count());

        List<AddItemRequest> requests = new ArrayList<>();
        AddItemRequest request1 = addItemRequest(BigDecimal.valueOf(2000), "Hair cream",MONTHLY, "January",EXPENSE);
        AddItemRequest request2 = addItemRequest(BigDecimal.valueOf(1000), "Shampoo",MONTHLY, "February",EXPENSE);
        requests.add(request2);
        requests.add(request1);


        budgetService.addItems(budget.getId(), requests);
        assertEquals(2,itemRepository.count());
        assertEquals(budget.getId(), itemRepository.findAll().getFirst().getBudget().getId());

    }


    @Test
    void  testThatItemsCanBeAddedToBudget_AllItemsCanBeGet() {
        assertEquals(0,itemRepository.count());
        assertEquals(0, repository.count());
        Budget budget = createBudget("School Fees",ANNUAL, BigDecimal.valueOf(5000));
        assertEquals(1, repository.count());

        List<AddItemRequest> requests = new ArrayList<>();
        AddItemRequest request1 = addItemRequest(BigDecimal.valueOf(2000), "Hair cream",MONTHLY, "January",EXPENSE);
        AddItemRequest request2 = addItemRequest(BigDecimal.valueOf(1000), "Shampoo",MONTHLY, "February",EXPENSE);
        requests.add(request2);
        requests.add(request1);


        budgetService.addItems(budget.getId(), requests);
        assertEquals(2,itemRepository.count());
        assertEquals(budget.getId(), itemRepository.findAll().getFirst().getBudget().getId());

        assertEquals(2,itemRepository.count());
        assertEquals(budget.getId(), itemRepository.findAll().getFirst().getBudget().getId());
        assertEquals(2, budgetService.getAllItems(budget.getId()).size());

    }


    @Test
    void  testThatTwoBudgetCanBeAddedItemsCanBeAddedToBudgets_AllItemsCanBeGet() {
        assertEquals(0,itemRepository.count());
        assertEquals(0, repository.count());
        Budget budget = createBudget("School Fees",ANNUAL, BigDecimal.valueOf(5000));
        Budget budgetTwo = createBudget("School Fees",ANNUAL, BigDecimal.valueOf(5000));
        assertEquals(2, repository.count());

        List<AddItemRequest> requests = new ArrayList<>();
        AddItemRequest request1 = addItemRequest(BigDecimal.valueOf(2000), "Hair cream",MONTHLY, "January",EXPENSE);
        AddItemRequest request2 = addItemRequest(BigDecimal.valueOf(1000), "Shampoo",MONTHLY, "February",EXPENSE);
        requests.add(request2);
        requests.add(request1);


        budgetService.addItems(budget.getId(), requests);
        assertEquals(2,itemRepository.count());
        assertEquals(budget.getId(), itemRepository.findAll().getFirst().getBudget().getId());

        assertEquals(2,itemRepository.count());
        assertEquals(budget.getId(), itemRepository.findAll().getFirst().getBudget().getId());
        assertEquals(2, budgetService.getAllItems(budget.getId()).size());

        budgetService.addItems(budgetTwo.getId(), requests);
        assertEquals(4,itemRepository.count());
        assertEquals(budgetTwo.getId(), itemRepository.findAllByBudget(budgetTwo).getFirst().getBudget().getId());
        assertEquals(2, budgetService.getAllItems(budgetTwo.getId()).size());

    }
}