package tests;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import servlets.EventServlet;

public class EventServletTest {

    public static void main(String[] args) throws Exception {
        // Create an instance of the servlet to test
        EventServlet servlet = new EventServlet();

        // Create mock implementations of HttpServletRequest and HttpServletResponse
        HttpServletRequest request = createMockRequest();
        HttpServletResponse response = createMockResponse();

        // Test doPost (Creating a New Event)
        setRequestParameter(request, "name", "Test Event");
        setRequestParameter(request, "description", "This is a test event.");
        setRequestParameter(request, "createdBy", "user123"); // Replace user123 with a real user ID
        servlet.doPost(request, response);
        System.out.println("doPost Response: " + getResponseOutput(response));

        // Test doGet (Fetching Event Details)
        setRequestParameter(request, "eventId", "event123"); // Replace event123 with a real event ID
        servlet.doGet(request, response);
        System.out.println("doGet Response: " + getResponseOutput(response));
    }

    private static HttpServletRequest createMockRequest() {
        return (HttpServletRequest) Proxy.newProxyInstance(
                EventServletTest.class.getClassLoader(),
                new Class[]{HttpServletRequest.class},
                new InvocationHandler() {
                    private final Map<String, String> parameters = new HashMap<>();

                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        if (method.getName().equals("getParameter")) {
                            return parameters.get(args[0]);
                        }
                        return null;
                    }

                    private void setParameter(String name, String value) {
                        parameters.put(name, value);
                    }
                }
        );
    }

    private static HttpServletResponse createMockResponse() {
        return (HttpServletResponse) Proxy.newProxyInstance(
                EventServletTest.class.getClassLoader(),
                new Class[]{HttpServletResponse.class},
                new InvocationHandler() {
                    private final ByteArrayOutputStream content = new ByteArrayOutputStream();
                    private final PrintWriter writer = new PrintWriter(content);

                    @Override
                    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                        if (method.getName().equals("getWriter")) {
                            return writer;
                        }
                        return null;
                    }

                    private String getOutput() {
                        writer.flush();
                        return content.toString();
                    }
                }
        );
    }

    private static void setRequestParameter(HttpServletRequest request, String name, String value) {
        try {
            Method setParameterMethod = request.getClass().getMethod("setParameter", String.class, String.class);
            setParameterMethod.invoke(request, name, value);
        } catch (Exception e) {
            throw new RuntimeException("Error setting request parameter", e);
        }
    }

    private static String getResponseOutput(HttpServletResponse response) {
        try {
            Method getOutputMethod = response.getClass().getMethod("getOutput");
            return (String) getOutputMethod.invoke(response);
        } catch (Exception e) {
            throw new RuntimeException("Error getting response output", e);
        }
    }
}
