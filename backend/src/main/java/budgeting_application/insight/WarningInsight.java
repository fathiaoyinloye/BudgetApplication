package budgeting_application.insight;

import budgeting_application.services.interfaces.InsightStrategy;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class WarningInsight implements InsightStrategy {
    private final List<String> insights = List.of(
            "You are close to exceeding your budget.",
            "You have exceeded your budget.",
            "Your remaining balance is critically low.",
            "Your spending rate is unsustainable.",
            "At your current pace, you are likely to overspend.",
            "Immediate spending adjustments are recommended.",
            "Your expenses are significantly higher than planned.",
            "Your budget has entered a high-risk state.",
            "You are spending beyond your planned limit.",
            "Your current financial pattern may lead to overspending.",
            "Your available balance has nearly been exhausted.",
            "You should reduce non-essential spending immediately.",
            "Your projected spending exceeds your planned budget.",
            "Your financial stability for this period is at risk."

    );
    @Override
    public boolean appliesTo(double percentage) {
        return percentage >= 80;
    }

    @Override
    public List<String> getInsights() {
        return insights;
    }
}
