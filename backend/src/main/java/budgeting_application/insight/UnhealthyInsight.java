package budgeting_application.insight;

import budgeting_application.services.interfaces.InsightStrategy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UnhealthyInsight implements InsightStrategy {
    private final List<String> insights = List.of(
//            "Your planned expenses exceed your planned income.",
//            "Your budget is projected to operate at a deficit.",
//            "Your current financial plan may not be sustainable.",
//            "You are budgeting to spend more than you expect to earn.",
//            "Your planned cash flow is negative.",
//            "Your expected expenses are higher than your expected income.",
//            "Consider adjusting your planned expenses to achieve balance.",
//            "Your budget allocation currently exceeds your projected earnings.",
//            "Your financial plan may require expense reduction or increased income.",
//            "Your planned spending exceeds your available financial capacity.",

            "Your current expenses exceed your income.",
            "Your financial balance is currently negative.",
            "You are spending more than you are earning.",
            "Your financial position is currently unstable.",
            "Your current spending pattern is not sustainable.",
            "Immediate financial adjustments are recommended.",
            "Your expenses are outpacing your earnings.",
            "Your budget is currently operating at a deficit."


    );
    @Override
    public boolean appliesTo(double percentage) {
        return percentage  > 100;
    }

    @Override
    public List<String> getInsights() {
        return insights;
    }
}

