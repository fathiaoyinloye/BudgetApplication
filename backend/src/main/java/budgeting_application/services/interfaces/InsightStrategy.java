package budgeting_application.services.interfaces;

import java.util.List;

public interface InsightStrategy {
    boolean appliesTo(double percentage);
    List<String> getInsights();
}
