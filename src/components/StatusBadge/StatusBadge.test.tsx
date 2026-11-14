import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the default 'pending' state correctly", () => {
    const { container } = render(<StatusBadge />);
    
    // Default label should be "Pending"
    expect(screen.getByText("Pending")).toBeTruthy();
    
    // Check the root element's data attributes
    const rootBadge = container.querySelector(".sb-badge");
    expect(rootBadge?.getAttribute("data-status")).toBe("pending");
    expect(rootBadge?.getAttribute("data-theme")).toBe("dark");
    expect(rootBadge?.getAttribute("data-size")).toBe("md");
    
    // The icon should render by default
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders the correct labels for different valid statuses", () => {
    const { rerender } = render(<StatusBadge status="completed" />);
    expect(screen.getByText("Completed")).toBeTruthy();

    rerender(<StatusBadge status="paid" />);
    expect(screen.getByText("Paid")).toBeTruthy();

    rerender(<StatusBadge status="payout_sent" />);
    expect(screen.getByText("Payout Sent")).toBeTruthy();
  });

  it("falls back to 'Pending' if an unknown status is provided", () => {
    const { container } = render(<StatusBadge status="completed" />);
    
    // The label should fallback to Pending
    expect(screen.getByText("Pending")).toBeTruthy();
    
    // But the data attribute should still be the raw status
    const rootBadge = container.querySelector(".sb-badge");
    expect(rootBadge?.getAttribute("data-status")).toBe("unknown_hacker_status");
  });

  it("overrides the default label if a custom 'label' prop is passed", () => {
    render(<StatusBadge status="paid" label="Transaction Approved" />);
    expect(screen.getByText("Transaction Approved")).toBeTruthy();
  });

  it("hides the icon when showIcon={false}", () => {
    const { container } = render(<StatusBadge showIcon={false} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("applies custom sizes, themes, colors, and classNames", () => {
    const { container } = render(
      <StatusBadge 
        size="lg" 
        theme="light" 
        color="rose" 
        className="my-custom-badge" 
      />
    );
    
    const rootBadge = container.querySelector(".sb-badge");
    expect(rootBadge?.classList.contains("my-custom-badge")).toBe(true);
    expect(rootBadge?.getAttribute("data-size")).toBe("lg");
    expect(rootBadge?.getAttribute("data-theme")).toBe("light");
    expect(rootBadge?.getAttribute("data-color")).toBe("rose");
  });
});