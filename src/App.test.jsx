import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Mock fetch API
global.fetch = jest.fn();

const mockProjects = [
  {
    "s.no": 0,
    "percentage.funded": 186,
    "amt.pledged": 15283,
  },
  {
    "s.no": 1,
    "percentage.funded": 150,
    "amt.pledged": 12000,
  },
];

describe("App Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  // Test 1: Initial Loading State
  it("shows loading state initially", () => {
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // Test 2: Data Display
  it("displays project data after loading", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProjects),
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("186")).toBeInTheDocument();
    expect(screen.getByText("15,283")).toBeInTheDocument();
  });

  // Test 3: Basic Pagination
  it("handles basic pagination", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockProjects),
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const nextButton = screen.getByRole("button", { name: /go to next page/i });
    await userEvent.click(nextButton);

    const prevButton = screen.getByRole("button", { name: /go to previous page/i });
    await userEvent.click(prevButton);
  });

  // Test 4: Basic Error Handling
  it("handles API errors", async () => {
    fetch.mockImplementationOnce(() => Promise.reject("API Error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
