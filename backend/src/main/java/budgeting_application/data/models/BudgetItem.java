package budgeting_application.data.models;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "budget_items", indexes = {
        @Index(name = "idx_budget_id", columnList = "budget_id")
})
public class BudgetItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    
    @Column(nullable = false)
    private BigDecimal budgetedAmount;

    private BigDecimal actualAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private BudgetItemType budgetItemType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;
}
