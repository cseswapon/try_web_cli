import { render, screen, waitFor } from "@testing-library/react";
import PostPage, { add } from "../posts/page"; // Make sure the import path is correct
import "@testing-library/jest-dom";

// Mock Posts Data
const mockPosts = [
  {
    userId: 1,
    id: 1,
    title: "Test Post 1",
    body: "This is a test body 1",
  },
  {
    userId: 1,
    id: 2,
    title: "Test Post 2",
    body: "This is a test body 2",
  },
];

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockPosts),
  })
) as jest.Mock;

// PostPage component tests
describe("PostPage Component", () => {
  it("renders the loading state initially", () => {
    render(<PostPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays posts", async () => {
    render(<PostPage />);

    // Wait for posts to load and check for display
    await waitFor(() => expect(screen.getByText("Posts")).toBeInTheDocument());

    // Check if the posts are displayed correctly
    expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    expect(screen.getByText("Test Post 2")).toBeInTheDocument();
  });
});

// Tests for the add function
describe("add function", () => {
  it("adds two positive numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("adds a positive and a negative number correctly", () => {
    expect(add(5, -3)).toBe(2);
  });

  it("adds two negative numbers correctly", () => {
    expect(add(-4, -6)).toBe(-10);
  });

  it("adds zero correctly", () => {
    expect(add(0, 5)).toBe(5);
    expect(add(5, 0)).toBe(5);
  });
});
