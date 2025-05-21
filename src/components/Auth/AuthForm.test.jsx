import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthForm from "./AuthForm";

describe("AuthForm Component", () => {
  test("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText("Confirm Password")).toBeNull();

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /forgot password\?/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create new account/i })).toBeInTheDocument();
  });

  test("renders signup form correctly after toggle", () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /create new account/i }));

    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /forgot password\?/i })).toBeNull();
    expect(screen.getByRole("button", { name: /already have an account\? login/i })).toBeInTheDocument();
  });

  test("toggles between login and signup modes correctly", () => {
    render(
      <MemoryRouter>
        <AuthForm />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /create new account/i }));
    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /already have an account\? login/i }));
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });
});