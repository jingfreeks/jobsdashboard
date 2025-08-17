// __tests__/Onboarding.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Onboarding from "../Onboarding";
import { apiSlice } from "@/config/apiSplice";
import authReducer from "@/features/auth";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
const renderWithProvider = (component) => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
        api: apiSlice.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ["persist/PERSIST"],
          },
        }).concat(apiSlice.middleware),
    });
  };
  const store = createTestStore();
  return render(<Provider store={store}>{component}</Provider>);
};

describe("Onboarding Component", () => {
  it("renders correctly and matches snapshot", () => {
    const { asFragment } = renderWithProvider(<Onboarding />, {
      preloadedState: {
        auth: {
          user: { roles: ["user"] }, // mock role
          onboardingComplete: false,
        },
      },
    });

    expect(asFragment()).toMatchSnapshot();
  });

  it("shows validation errors when clicking Next with empty fields", () => {
    renderWithProvider(<Onboarding />, {
      preloadedState: {
        auth: {
          user: { roles: ["user"] },
          onboardingComplete: false,
        },
      },
    });

    // Click the Next button
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    // Expect validation errors to appear
    expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
  });

  it("goes to Step 2 when valid inputs are filled and Next is clicked", () => {
    renderWithProvider(<Onboarding />);

    // Fill in required fields
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: "1234567890" },
    });

    // Click Next
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);

    // ✅ Should now show Step 2 heading
    expect(screen.getByText(/Address Information/i)).toBeInTheDocument();

    // ✅ Validation errors from Step 1 should not be visible
    expect(
      screen.queryByText(/First name is required/i)
    ).not.toBeInTheDocument();
  });

  it("completes Step 2 and moves to Step 3 (success)", () => {
    renderWithProvider(<Onboarding />);

    // Step 1
    fireEvent.change(screen.getByPlaceholderText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.click(screen.getByRole("button", { name: /next/i }));

    // ✅ Step 2 inputs (assuming placeholders exist in your form)
    fireEvent.change(screen.getByTestId("dob-input"), {
      target: { value: "1990-01-01" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Address/i), {
      target: { value: "123 Main St" },
    });
    fireEvent.change(screen.getByPlaceholderText(/City/i), {
      target: { value: "New York" },
    });
    fireEvent.change(screen.getByPlaceholderText(/State/i), {
      target: { value: "NY" },
    });
    fireEvent.change(screen.getByPlaceholderText(/ZIP Code/i), {
      target: { value: "10001" },
    });

    // Click Next → should move to Step 3 (success screen)
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText(/Professional Information/i)).toBeInTheDocument();
    // ✅ Success condition (adjust depending on your Step 3 heading/message)
  });
});
