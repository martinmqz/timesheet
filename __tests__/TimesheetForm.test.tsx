import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TimesheetForm from "../components/TimesheetForm"; 

describe("TimesheetForm", () => {
  it("updates totals when minutes and rate are entered", () => {
    render(<TimesheetForm />);

    // Enter rate
    fireEvent.change(screen.getByLabelText(/Rate/), { target: { value: "60" } });

    // Enter minutes
    fireEvent.change(screen.getByPlaceholderText(/Minutes/), { target: { value: "120" } });

    // Totals should update
    expect(screen.getByText(/Total Time: 120 minutes/)).toBeInTheDocument();
    expect(screen.getByText(/Total Cost: \$120\.00/)).toBeInTheDocument();
  });

  it("adds and removes line items", () => {
    render(<TimesheetForm />);

    // Add a second line item
    fireEvent.click(screen.getByText("+ Add Line Item"));
    expect(screen.getAllByPlaceholderText(/Description/)).toHaveLength(2);

    // Remove the first line item
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[0]);

    // Should be back to one line item
    expect(screen.getAllByPlaceholderText(/Description/)).toHaveLength(1);
  });

  it("updates totals after removing a line item", () => {
    render(<TimesheetForm />);

    // Enter rate
    fireEvent.change(screen.getByLabelText(/Rate/), { target: { value: "100" } });

    // First line item: 60 minutes
    fireEvent.change(screen.getByPlaceholderText(/Minutes/), { target: { value: "60" } });

    // Add another line item
    fireEvent.click(screen.getByText("+ Add Line Item"));
    const minutesInputs = screen.getAllByPlaceholderText(/Minutes/);

    // Second line item: 120 minutes
    fireEvent.change(minutesInputs[1], { target: { value: "120" } });

    // Totals should reflect both
    expect(screen.getByText(/Total Time: 180 minutes/)).toBeInTheDocument();
    expect(screen.getByText(/Total Cost: \$300\.00/)).toBeInTheDocument();

    // Remove the second line item
    const removeButtons = screen.getAllByText("Remove");
    fireEvent.click(removeButtons[1]);

    // Totals should update back to 60 minutes
    expect(screen.getByText(/Total Time: 60 minutes/)).toBeInTheDocument();
    expect(screen.getByText(/Total Cost: \$100\.00/)).toBeInTheDocument();
  });
});