import './App.css';
import NotificationsMenu from './components/NotificationsMenu';

function App() {
  return (
    <>
      <header className="main-header">
        <div className="header-left">
          <h1>GritLab Gossiper</h1>
        </div>
        <div className="header-right">
          <NotificationsMenu />
          {/* Add other header buttons here if needed */}
        </div>
      </header>
      <main>
        {/* ...rest of your app... */}
        <div>
          {/* Example content */}
          <h1>Vite + React</h1>
        </div>
      </main>
    </>
  );
}

export default App;
