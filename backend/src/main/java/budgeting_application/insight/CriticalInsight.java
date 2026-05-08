package budgeting_application.insight;

import budgeting_application.services.interfaces.InsightStrategy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CriticalInsight implements InsightStrategy {

    private final List<String> insights = List.of(
            "You are approaching your budget limit.",
            "Your spending is increasing steadily.",
            "Your remaining balance is becoming limited.",
            "You should monitor your spending more closely.",
            "Your current spending pace may become risky.",
            "You have already used a significant portion of your budget.",
            "You are spending faster than expected.",
            "Your budget flexibility is reducing.",
            "Your spending trend should be monitored.",
            "You are still within budget, but caution is advised.",
            "Your daily spending average is relatively high.",
            "You may need to reduce unnecessary expenses.",
            "Your remaining balance may not last through the entire period.",
            "Your financial margin is getting smaller."
    );

    @Override
    public boolean appliesTo(double percentage) {
        return percentage >= 50 && percentage < 80;
    }

    @Override
    public List<String> getInsights() {
        return insights;
    }
}
