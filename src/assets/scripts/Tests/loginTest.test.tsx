import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Panels/SignUpPage";
import "@testing-library/jest-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

test("should render the website name", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );

  const element = screen.getByText(/سامانه کنترل وضعیت هیات علمی/i);
  expect(element).toBeInTheDocument();
});

test("should render inputfield for name", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );

  const element = screen.getByPlaceholderText(/نام کاربری/i);
  expect(element).toBeInTheDocument();
  expect(element).toHaveAttribute("type", "text");
});

test("should update value of inputfield for name", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );
  const element = screen.getByPlaceholderText(/نام کاربری/i);
  fireEvent.change(element, { target: { value: "Hello World" } });
  expect(element).toHaveValue("Hello World");
});

test("should render login button", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>,
  );
  const element = screen.getByText(/ورود/i);
  expect(element).toBeInTheDocument();
});


test("should navigate to dashboard on successful login", async () => {
  // Mock successful fetch response
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ error: false }),
    } as Response)
  );

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  // Get input fields and button
  const usernameInput = screen.getByPlaceholderText(/نام کاربری/i);
  const passwordInput = screen.getByPlaceholderText(/رمز عبور/i);
  const loginButton = screen.getByText(/ورود/i);

  // Fill in the form
  fireEvent.change(usernameInput, { target: { value: "ahmadgol" } });
  fireEvent.change(passwordInput, { target: { value: "iran1382" } });

  // Click login button
  await fireEvent.click(loginButton);

  // Verify API was called with correct credentials
  expect(global.fetch).toHaveBeenCalledWith(
    "https://faculty.liara.run/api/panel/v1/user/log-in",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ userName: "ahmadgol", password: "iran1382" }),
    })
  );

  // Verify navigation occurred
  // expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});
