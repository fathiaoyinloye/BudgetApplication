package com.budgeting_application.data.models;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Getter
@Setter
public class BudgetItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private BigDecimal amount;

    @Column(nullable = false)
    private String timeFrame;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private BudgetItemType budgetItemType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;
}
