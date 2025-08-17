// JobApplicantDashboard.test.tsx
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import JobApplicantDashboard from "../JobApplicantDashboard";

// Mock dependencies
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    logout: vi.fn(),
  }),
}));

vi.mock("@/components/AuthMonitor", () => ({
  AuthMonitor: () => <div data-testid="auth-monitor">AuthMonitor</div>,
}));

vi.mock("../admin-dashboard/component", () => ({
  Header: ({ handleLogout }: { handleLogout: () => void }) => (
    <div data-testid="header" onClick={handleLogout}>
      Header
    </div>
  ),
}));

describe("JobApplicantDashboard", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(<JobApplicantDashboard />);
    expect(container).toMatchSnapshot();
  });
});
