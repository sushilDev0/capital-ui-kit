import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { DebouncedSearch } from "./DebouncedSearch";

describe("DebouncedSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 🚀 THE FIX: Restore real timers FIRST, then cleanup
    vi.useRealTimers(); 
    cleanup(); 
    vi.restoreAllMocks();
  });

  it("does not fire onSearch before the delay", () => {
    const onSearch = vi.fn();
    render(<DebouncedSearch onSearch={onSearch} delay={400} minChars={2} />);
    
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "ab" } });
    
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("fires onSearch after the delay", () => {
    const onSearch = vi.fn();
    render(<DebouncedSearch onSearch={onSearch} delay={400} minChars={2} />);
    
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "ab" } });
    
    act(() => {
      vi.advanceTimersByTime(400);
    });
    
    expect(onSearch).toHaveBeenCalledWith("ab");
  });

  it("does not fire if below minChars", () => {
    const onSearch = vi.fn();
    render(<DebouncedSearch onSearch={onSearch} delay={400} minChars={3} />);
    
    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "ab" } });
    
    act(() => {
      vi.advanceTimersByTime(400);
    });
    
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("focuses input on Cmd/Ctrl+K", () => {
    render(<DebouncedSearch onSearch={vi.fn()} />);
    
    const input = screen.getByRole("searchbox");
    
    expect(document.activeElement === input).toBe(false);

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    
    expect(document.activeElement === input).toBe(true);
  });
});