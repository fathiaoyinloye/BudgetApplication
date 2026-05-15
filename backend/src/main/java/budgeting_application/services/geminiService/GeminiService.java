package budgeting_application.services.geminiService;

import budgeting_application.dtos.responses.budgetReport.BudgetReportResponse;
import budgeting_application.services.geminiService.geminiRequests.Content;
import budgeting_application.services.geminiService.geminiRequests.GeminiRequest;
import budgeting_application.services.geminiService.geminiRequests.Part;
import budgeting_application.services.geminiService.geminiResponse.GeminiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;


@Service
@RequiredArgsConstructor
public class GeminiService {
    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String endpoint;

    private final RestClient restClient;


    public String getBudgetInsight(BudgetReportResponse response) {
        String url = endpoint + "?key=" + apiKey;
        //models=models/gemini-2.0-flash
        String prompt = generatePrompt(response);
        GeminiRequest request = new GeminiRequest(
                List.of(new Content(
                        List.of(new Part(prompt))
                ))
        );


        try {
            GeminiResponse geminiResponse = restClient.post()
                    .uri(url)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON) // Add this!
                    .body(request)
                    .retrieve()
                    .body(GeminiResponse.class);

            assert geminiResponse != null;
            if (geminiResponse.candidates() != null && !geminiResponse.candidates().isEmpty()) {
                return geminiResponse.candidates().getFirst() // Get first candidate
                        .content()
                        .parts().getFirst()
                        .text();
            }

        }catch(Exception e){
            System.err.println("Gemini Insight failed: " + e.getMessage());

            return "Our AI Advisor is currently taking a break, but your calculated budget report is ready above! Please check back later for deep insights.";
        }


        return "No insights generated.";
    }



    private String generatePrompt(BudgetReportResponse response){
        return """
            You are an intelligent financial advisor AI.
            Analyze the following financial report and provide:
            A concise financial summary
            Key concerns (if any)
            Practical recommendations
            Guidelines:
            - Keep the response short and professional
            - Use simple financial language
            - Avoid repeating the raw numbers excessively
            - Focus on spending behavior and financial health
            - If the status is unhealthy, emphasize caution
            - If the status is healthy, encourage sustainability
        
            Financial Report:
            Budget Name: %s
            Budgeted Balance: ₦%,.2f
            Actual Balance: ₦%,.2f
            Remaining Balance: ₦%,.2f
            Budget Performance: %.2f%%
            Budget Usage: %.2f%%
            Status: %s
    
            Insights:
            %s
        """.formatted(
                response.getBudgetName(),
                response.getBudgetedAmount(),
                response.getActualAmount(),
                response.getRemainingAmount(),
                response.getBudgetPerformancePercentage(),
                response.getPercentageUsed(),
                response.getStatus(),
                String.join("\n- ", response.getInsights())
        );
    }



    }





