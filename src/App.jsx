import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Header } from "./Pages/Common/Header";
import Footer from "./Pages/Common/Footer";
import Banner from "./Pages/Common/Banner";
import AuthPage from "./Pages/Auth/AuthPage";
import InputPage from "./Pages/InputPage/InputPage";
import { useEffect } from "react";
import QuizPage from "./Pages/QuizPage/QuizPage";
import { Question } from "./Pages/QuizPage/Question";
import Response from "./Pages/ResponsePage/Response";
import ErrorPage from "./Pages/ErrorPage/ErrorPage";
import { ToastContainer } from "react-toastify";
import QuizHistory from "./Pages/HistoryPage/QuizHistory";
import Questions from "./Pages/HistoryPage/Questions";

export function App() {
  const location = useLocation();

  useEffect(() => {
    // Set the theme on initial load
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  return (
    <div className="app h-svh w-svw bg-red-200">
      {/* Conditionally render the Header based on the route */}
      <ToastContainer limit={1} />
      {location.pathname !== "/quiz" &&
        location.pathname !== "/quiz-history" && <Header />}

      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="*" element={<InputPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage isLoginPage={false} />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/response-history" element={<Response />} />
        <Route path="/quiz-history" element={<QuizHistory />} />
        <Route path="/questions-history" element={<Questions />} />
      </Routes>
    </div>
  );
}
