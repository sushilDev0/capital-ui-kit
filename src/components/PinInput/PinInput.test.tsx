import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { PinInput } from "./PinInput";

describe("PinInput", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the correct number of visual boxes", () => {
    const { container } = render(<PinInput length={6} />);
    // Assuming your visual boxes have the class .pin-box
    expect(container.querySelectorAll(".pin-box")).toHaveLength(6);
  });

  it("fires onChange on every keystroke", () => {
    const onChange = vi.fn();
    render(<PinInput onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1" } });
    expect(onChange).toHaveBeenCalledWith("1");

    fireEvent.change(input, { target: { value: "12" } });
    expect(onChange).toHaveBeenCalledWith("12");
  });

  it("fires onComplete only when the full length is reached", () => {
    const onComplete = vi.fn();
    render(<PinInput length={4} onComplete={onComplete} />);

    const input = screen.getByRole("textbox");
    
    // 3 digits should not trigger onComplete
    fireEvent.change(input, { target: { value: "123" } });
    expect(onComplete).not.toHaveBeenCalled();

    // 4 digits should trigger onComplete
    fireEvent.change(input, { target: { value: "1234" } });
    expect(onComplete).toHaveBeenCalledWith("1234");
  });

  it("filters out non-numeric characters when type='numeric'", () => {
    const onChange = vi.fn();
    render(<PinInput type="numeric" onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1a2b3c" } });

    // The component should strip letters before firing onChange
    expect(onChange).toHaveBeenCalledWith("123");
  });

  it("masks digits when mask=true", () => {
    const { container } = render(<PinInput value="1234" mask />);
    const boxes = container.querySelectorAll(".pin-box");
    
    // Check that boxes show the mask character (•) instead of numbers
    boxes.forEach((box) => {
      expect(box.textContent).toBe("•");
    });
  });
});