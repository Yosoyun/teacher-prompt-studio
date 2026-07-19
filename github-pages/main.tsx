import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PromptStudio from "../app/PromptStudio";
import "../app/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Teacher Prompt Studio root element was not found.");
}

createRoot(root).render(
  <StrictMode>
    <PromptStudio />
  </StrictMode>,
);
