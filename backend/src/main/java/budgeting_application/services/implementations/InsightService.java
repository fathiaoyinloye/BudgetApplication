package budgeting_application.services.implementations;

import budgeting_application.services.interfaces.InsightStrategy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class InsightService {
    private final List<InsightStrategy> strategies;

    public InsightService(List<InsightStrategy> strategies) {
        this.strategies = strategies;
    }

    public List<String> generateInsights(Double percentage) {
        if (percentage == 0) return List.of("Set a budget to see insights.");
        return strategies.stream()
                .filter(s -> s.appliesTo(percentage))
                .findFirst()
                .map(s -> selectTwoRandom(s.getInsights()))
                .orElse(List.of("Keep tracking your spending!"));
    }


    private List<String> selectTwoRandom(List<String> allInsights) {
        List<String> copy = new ArrayList<>(allInsights);
        Collections.shuffle(copy);
        return copy.stream()
                .limit(2)
                .toList();
    }
}
