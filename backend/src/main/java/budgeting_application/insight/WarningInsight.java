package budgeting_application.insight;

import budgeting_application.services.interfaces.InsightStrategy;
import org.springframework.stereotype.Component;

import java.util.List;
@Component
public class WarningInsight implements InsightStrategy {
    private final List<String> insights = List.of(
            "You are within a safe spending range.",
            "Your spending is well managed so far.",
            "You still have a comfortable amount remaining.",
            "Your current spending pattern is sustainable. ",
            "You are on track to stay within your budget.",
            "Your expenses are currently under control.",
            "You have maintained a healthy budget balance.",
            "Your spending pace is moderate.",
            "You are managing your finances responsibly.",
            "Your remaining balance is sufficient for the rest of this period."

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
