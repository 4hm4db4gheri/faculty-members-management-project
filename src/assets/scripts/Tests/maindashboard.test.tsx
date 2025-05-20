import { render, screen} from "@testing-library/react";
import MainDashboardPanel from "../Panels/MainDashboardPanel";
import "@testing-library/jest-dom";

describe("MainDashboardPanel", () => {
  beforeEach(() => {
    render(<MainDashboardPanel />);
  });

  test("should render search input", () => {
    const searchInput = screen.getByPlaceholderText("جستجو");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute("type", "text");
  });

  test("should render advanced search button", () => {
    const advancedSearchButton = screen.getByText("جستجو پ");
    expect(advancedSearchButton).toBeInTheDocument();
  });

  test("should render charts section", () => {
    const chartElements = screen.getAllByText("نمودار");
    expect(chartElements).toHaveLength(2);
  });

  test("should have correct styles for search input", () => {
    const searchInput = screen.getByPlaceholderText("جستجو");
    expect(searchInput).toHaveClass(
      "col-span-9",
      "box-border",
      "h-full",
      "w-full",
      "rounded-[25px]",
      "border-none",
      "bg-transparent",
      "text-xl",
      "text-black"
    );
  });
});