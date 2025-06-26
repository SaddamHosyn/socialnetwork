import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import Header from "./components/Header";
import PanelLeft from "./components/PanelLeft";
import PanelRight from "./components/PanelRight";
import PanelMiddle from "./components/PanelMiddle";
import UserProfile from "./components/UserProfile";
import UserLogin from "./components/UserLogin";
import UserRegister from "./components/UserRegister";
import PostSingle from "./components/PostSingle";

const AppRouter: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // TODO: Call logout API if needed
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      {/* Header stays at top */}
      <div style={{ color: "red" }}>Hello World</div>
      <Header onLogout={handleLogout} isLoggedIn={isLoggedIn} />
      <div style={{ flex: 1, display: "flex" }}>
        <PanelLeft
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/"
              element={<PanelMiddle selectedCategoryId={selectedCategoryId} />}
            />
            <Route path="/profile" element={<UserProfile />} />
            <Route
              path="/login"
              element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/register"
              element={<RegisterPage setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/post/:postId" element={<PostSingleWrapper />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
        <PanelRight />
      </div>
    </BrowserRouter>
  );
};

// Helper pages for login/register to handle state changes
function LoginPage({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
  const navigate = useNavigate();
  return (
    <UserLogin
      onSuccess={() => {
        setIsLoggedIn(true);
        navigate("/");
      }}
      onCancel={() => navigate("/")}
    />
  );
}
function RegisterPage({
  setIsLoggedIn,
}: {
  setIsLoggedIn: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  return (
    <UserRegister
      onSuccess={() => {
        setIsLoggedIn(true);
        navigate("/");
      }}
      onCancel={() => navigate("/")}
    />
  );
}
// Single post wrapper to read postId from URL
function PostSingleWrapper() {
  const { postId } = useParams();
  if (!postId) return <div>No post found.</div>;
  return <PostSingle postId={Number(postId)} onClose={() => {}} />;
}

export default AppRouter;
