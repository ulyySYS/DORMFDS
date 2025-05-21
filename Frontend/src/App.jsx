
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import AdminDashboard from './components/admin/AdminDashboard'
import StudentDashboard from './components/student/StudentDashboard'
import './App.css'

// Main App Content with authentication check
const AppContent = () => {
  const { currentUser } = useAuth();
  
  // Render different components based on authentication status and role
  const renderContent = () => {
    if (!currentUser) {
      return <Login />;
    } else if (currentUser.Role === "admin") {
      return <AdminDashboard />;
    } else if (currentUser.Role === "student") {
      return <StudentDashboard />;
    } else {
      // Fallback for unknown roles
      return <Login />;
    }
  };

  return renderContent();
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <div className="app">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;