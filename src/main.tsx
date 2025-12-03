
  import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { PaymentCallback } from "./components/payment/PaymentCallback";
import { PaymentCancelled } from "./components/payment/PaymentCancelled";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/payment/callback" element={<PaymentCallback />} />
      <Route path="/payment/cancelled" element={<PaymentCancelled />} />
    </Routes>
  </BrowserRouter>
);
  