import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { OmniInput } from "./OmniInput";

describe("OmniInput", () => {
  afterEach(() => {
    cleanup();
  });

  it("fires onChange with the parsed number", () => {
    const onChange = vi.fn();
    render(<OmniInput format="currency" currency="USD" onChange={onChange} />);
    
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1000" } });
    
    // Should pass a number, not a string
    expect(onChange).toHaveBeenCalledWith(1000);
  });

  it("formats the value with the currency symbol in the input", () => {
    render(<OmniInput format="currency" currency="USD" value={100} onChange={vi.fn()} />);
    
    // 🚀 Cast to HTMLInputElement and use standard JS .value
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("$100.00"); 
  });

  it("formats a custom symbol in suffix position (e.g., BTC)", () => {
    render(<OmniInput format="decimal" symbol="BTC" symbolPosition="suffix" value={1.5} onChange={vi.fn()} />);
    
    // 🚀 Cast to HTMLInputElement and use standard JS .value
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("1.50 BTC");
  });
});