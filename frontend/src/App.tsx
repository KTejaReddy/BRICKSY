import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Background from './components/ui/Background';
import Skeleton from './components/ui/Skeleton';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import WorkerProfile from './pages/WorkerProfile';
import PostJob from './pages/PostJob';
import AIRecommendations from './pages/AIRecommendations';
import Payment from './pages/Payment';
import ProgressUpload from './pages/ProgressUpload';
import ProjectMonitoring from './pages/ProjectMonitoring';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Database from './pages/Database';
import WorkerJobAcceptance from './pages/WorkerJobAcceptance';
import EmployerApproval from './pages/EmployerApproval';
import ReviewRating from './pages/ReviewRating';
import InsuranceBenefits from './pages/InsuranceBenefits';

function ProtectedRoute({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  const getDashboardRedirect = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'owner': return '/owner/dashboard';
      case 'contractor': return '/employer/dashboard';
      case 'skilled_worker': return '/worker/dashboard';
      default: return '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14]">
      <Background />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={user ? <Navigate to={getDashboardRedirect()} /> : <Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/owner/dashboard" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/owner/analytics" element={<ProtectedRoute roles={['owner']}><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/owner/database" element={<ProtectedRoute roles={['owner']}><Database /></ProtectedRoute>} />
          <Route path="/owner/projects" element={<ProtectedRoute roles={['owner']}><ProjectMonitoring /></ProtectedRoute>} />
          <Route path="/worker/dashboard" element={<ProtectedRoute roles={['skilled_worker']}><WorkerDashboard /></ProtectedRoute>} />
          <Route path="/worker/profile" element={<ProtectedRoute roles={['skilled_worker']}><WorkerProfile /></ProtectedRoute>} />
          <Route path="/worker/progress" element={<ProtectedRoute roles={['skilled_worker']}><ProgressUpload /></ProtectedRoute>} />
          <Route path="/worker/jobs" element={<ProtectedRoute roles={['skilled_worker']}><WorkerJobAcceptance /></ProtectedRoute>} />
          <Route path="/worker/insurance" element={<ProtectedRoute roles={['skilled_worker']}><InsuranceBenefits /></ProtectedRoute>} />
          <Route path="/employer/dashboard" element={<ProtectedRoute roles={['contractor']}><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/employer/post-job" element={<ProtectedRoute roles={['contractor']}><PostJob /></ProtectedRoute>} />
          <Route path="/employer/recommendations/:jobId" element={<ProtectedRoute roles={['contractor']}><AIRecommendations /></ProtectedRoute>} />
          <Route path="/employer/payment" element={<ProtectedRoute roles={['contractor']}><Payment /></ProtectedRoute>} />
          <Route path="/employer/approve/:jobId" element={<ProtectedRoute roles={['contractor']}><EmployerApproval /></ProtectedRoute>} />
          <Route path="/employer/review/:jobId" element={<ProtectedRoute roles={['contractor']}><ReviewRating /></ProtectedRoute>} />
          <Route path="/employer/projects" element={<ProtectedRoute roles={['contractor']}><ProjectMonitoring /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
