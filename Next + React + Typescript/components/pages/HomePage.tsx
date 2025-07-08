"use client";

type HomePageProps = {
  onLogin: () => void;
  onRegister: () => void;
};

const HomePage = ({ onLogin, onRegister }: HomePageProps) => (
  <div className="home-page">
    <div className="hero-section">
      <h1>Welcome to Gritlab Gossiper</h1>
      <p>
        Join our community to share posts, connect with others, and stay
        updated!
      </p>
      <div className="cta-buttons">
        <button className="cta-button primary" onClick={onLogin}>
          Login
        </button>
        <button className="cta-button secondary" onClick={onRegister}>
          Sign Up
        </button>
      </div>
    </div>
    <div className="features">
      <div className="feature">
        <h3>📝 Share Posts</h3>
        <p>
          Create and share posts with the community across different categories
        </p>
      </div>
      <div className="feature">
        <h3>👥 Join Groups</h3>
        <p>Connect with like-minded people in specialized groups</p>
      </div>
      <div className="feature">
        <h3>🔔 Stay Connected</h3>
        <p>Keep up with the latest discussions and community updates</p>
      </div>
    </div>
  </div>
);

export default HomePage;
