import { render, screen, fireEvent } from "@testing-library/react";
import DashboardComponent from "../DashboardComponent";
import "@testing-library/jest-dom";

describe("DashboardComponent Tab Navigation", () => {
  beforeEach(() => {
    render(<DashboardComponent />);
  });

  test("should show MainDashboardPanel by default", () => {
    const searchInput = screen.getByPlaceholderText("جستجو");
    const charts = screen.getAllByText("نمودار");
    
    expect(searchInput).toBeInTheDocument();
    expect(charts).toHaveLength(2);
  });

  test("should switch to HistoryPanel when سوابق button is clicked", () => {
    const historyButton = screen.getByText("سوابق");
    fireEvent.click(historyButton);

    const historySearchInput = screen.getByPlaceholderText("جستجو...");
    const facultyHeader = screen.getByText("دانشکده");
    const rankHeader = screen.getByText("رتبه علمی");

    expect(historySearchInput).toBeInTheDocument();
    expect(facultyHeader).toBeInTheDocument();
    expect(rankHeader).toBeInTheDocument();
  });

//   test("should switch to RoleManagementPanel when مدیریت نقش ها button is clicked", () => {
//     const rolesButton = screen.getByText("مدیریت نقش ها");
//     fireEvent.click(rolesButton);

//     const roleSearchInput = screen.getByPlaceholderText("بعدی");
//     const roleDropdown = screen.getByText("نقش");

//     expect(roleSearchInput).toBeInTheDocument();
//     expect(roleDropdown).toBeInTheDocument();
//   });

  test("should maintain selected tab color while hovering another tab", () => {
    const historyButton = screen.getByText("سوابق");
    fireEvent.click(historyButton);

    const rolesButton = screen.getByText("مدیریت نقش ها");
    fireEvent.mouseEnter(rolesButton);

    expect(historyButton).toHaveClass("bg-[#3388BC]");
    
    expect(rolesButton).toHaveClass("bg-transparent", "hover:bg-[#3388BC33]");
    expect(rolesButton).not.toHaveClass("bg-[#3388BC]");

    const facultyHeader = screen.getByText("دانشکده");
    expect(facultyHeader).toBeInTheDocument();
  });
});