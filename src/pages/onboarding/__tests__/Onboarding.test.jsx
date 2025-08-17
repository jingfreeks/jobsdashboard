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


  it("complete step 3", async() => {
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
    const file = new File(["hello"], "test.png", { type: "image/png" });

    //upload profile picture
    expect(screen.getByText(/Professional Information/i)).toBeInTheDocument();
    fireEvent.change(screen.getByTestId("profile-picture-input-testId"), {
      target: { files: [file] },
    })
    const preview = await screen.findByTestId("profile-picture-preview");
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute(
      "src",
      "data:image/png;base64,aGVsbG8="
    );

    // Select Education Level
    expect(screen.getByText("Education Level")).toBeInTheDocument();
    expect(screen.getByText("Select Education Level")).toBeInTheDocument();

    const select = screen.getByTestId("education-level-select-testId");

    // default should be empty
    expect(select.value).toBe("");

    // change to High School
    fireEvent.change(select, { target: { value: "High School" } });
    expect(select.value).toBe("High School");

    // change to College
    fireEvent.change(select, { target: { value: "College" } });
    expect(select.value).toBe("College");

    // School Name
    expect(screen.getByText("School Name")).toBeInTheDocument();
    const shoolNameInput = screen.getByTestId("school-name-input-testId");
    expect(shoolNameInput).toBeInTheDocument();
    expect(shoolNameInput.value).toBe("");

    // Enter school name
    fireEvent.change(shoolNameInput, { target: { value: "Test School" } });
    expect(shoolNameInput.value).toBe("Test School");
    // year graduated
    const yearGraduatedInput = screen.getByTestId("graduation-year-input-testId");
    expect(yearGraduatedInput).toBeInTheDocument();
    expect(yearGraduatedInput.value).toBe("");

    // Enter year graduated
    fireEvent.change(yearGraduatedInput, { target: { value: "2020" } });
    expect(yearGraduatedInput.value).toBe("2020");

    // add education button
    const addEducationButton = screen.getByRole("button", { name: /add education/i });
    expect(addEducationButton).toBeInTheDocument();
    fireEvent.click(addEducationButton);

  // edit education
    const editEducationButton = screen.getByRole("button", { name: /edit/i });
    expect(editEducationButton).toBeInTheDocument();
    fireEvent.click(editEducationButton);

    // check if the education form is populated with the values
    expect(select.value).toBe("College");
    expect(shoolNameInput.value).toBe("Test School");
    expect(yearGraduatedInput.value).toBe("2020");

    // save education
    const saveEducationButton = screen.getByRole("button", { name: /update education/i });
    expect(saveEducationButton).toBeInTheDocument();
    fireEvent.click(saveEducationButton);

    // check if the education is added to the list
    const educationList = screen.getByTestId("education-list");
    expect(educationList).toBeInTheDocument();
    expect(educationList.children.length).toBe(1);

    // check if the education is displayed correctly
    const educationItem = educationList.children[0];
    expect(educationItem).toHaveTextContent("College");
    expect(educationItem).toHaveTextContent("Test School");
    expect(educationItem).toHaveTextContent("2020");

    //delete education
    const deleteEducationButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteEducationButton).toBeInTheDocument();
    fireEvent.click(deleteEducationButton);
    console.log(educationList);
    // check if the education is removed from the list
    expect(screen.queryByText("Test School")).not.toBeInTheDocument();
  });
});
