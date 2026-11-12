import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // 🚀 Import user-event
import { DebouncedSearch } from "./DebouncedSearch";

describe("DebouncedSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("does not fire onSearch before the delay", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime }); // 🚀 Setup user-event for fake timers
    const onSearch = vi.fn();
    render(<DebouncedSearch onSearch={onSearch} delay={400} minChars={2} />);
    
    const input = screen.getByRole("searchbox"); // 🚀 See note below
    await user.type(input, "ab");
    
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("fires onSearch after the delay", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onSearch = vi.fn();
    render(<DebouncedSearch onSearch={onSearch} delay={400} minChars={2} />);
    
    const input = screen.getByRole("searchbox");
    await user.type(input, "ab");
    
    // Advance timer inside act
    act(() => {
      vi.advanceTimersByTime(400);
    });
    
    expect(onSearch).toHaveBeenCalledWith("ab");
  });

  it("does not fire if below minChars", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onSearch = vi.fn();
    render(<DebouncedSearch onSearch={onSearch} delay={400} minChars={3} />);
    
    const input = screen.getByRole("searchbox");
    await user.type(input, "ab");
    
    act(() => {
      vi.advanceTimersByTime(400);
    });
    
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("focuses input on Cmd/Ctrl+K", async () => {
    const onSearch = vi.fn();
    render(<DebouncedSearch onSearch={onSearch} />);
    
    const input = screen.getByRole("searchbox");
    
    // Ensure it starts unfocused
    expect(document.activeElement).not.toBe(input);

    // 🚀 Fire on document instead of window (most React shortcuts listen here)
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    
    expect(document.activeElement).toBe(input);
  });
});