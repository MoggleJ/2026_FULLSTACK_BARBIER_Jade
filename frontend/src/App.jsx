import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LangProvider } from './context/LangContext.jsx';
import { ClockFormatProvider } from './context/ClockFormatContext.jsx';
import { ModeProvider } from './context/ModeContext.jsx';
import { IconSizeProvider } from './context/IconSizeContext.jsx';
import { LayoutProvider } from './context/LayoutContext.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import Layout from './components/Layout/Layout.jsx';

const Login        = lazy(() => import('./pages/Auth/Login.jsx'));
const Register     = lazy(() => import('./pages/Auth/Register.jsx'));
const OAuthCallback = lazy(() => import('./pages/Auth/OAuthCallback.jsx'));
const Home         = lazy(() => import('./pages/Home/Home.jsx'));
const AllApps      = lazy(() => import('./pages/AllApps/AllApps.jsx'));
const Search       = lazy(() => import('./pages/Search/Search.jsx'));
const Settings     = lazy(() => import('./pages/Settings/Settings.jsx'));
const AppViewer    = lazy(() => import('./pages/AppViewer/AppViewer.jsx'));
const AdminApps    = lazy(() => import('./pages/Admin/AdminApps.jsx'));
const AdminUsers   = lazy(() => import('./pages/Admin/AdminUsers.jsx'));
const Profile      = lazy(() => import('./pages/Profile/Profile.jsx'));
const NotFound     = lazy(() => import('./pages/NotFound/NotFound.jsx'));

function PageSpinner() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LangProvider>
            <ClockFormatProvider>
              <Suspense fallback={<PageSpinner />}>
                <Routes>
                  <Route path="/login"          element={<Login />} />
                  <Route path="/register"        element={<Register />} />
                  <Route path="/oauth/callback"  element={<OAuthCallback />} />
                  <Route
                    element={
                      <ProtectedRoute>
                        <ModeProvider>
                          <IconSizeProvider>
                            <LayoutProvider>
                              <Layout />
                            </LayoutProvider>
                          </IconSizeProvider>
                        </ModeProvider>
                      </ProtectedRoute>
                    }
                  >
                    <Route index              element={<Home />} />
                    <Route path="/apps"       element={<AllApps />} />
                    <Route path="/search"     element={<Search />} />
                    <Route path="/settings"   element={<Settings />} />
                    <Route path="/profile"    element={<Profile />} />
                    <Route path="/viewer/:id" element={<AppViewer />} />
                    <Route path="/admin"       element={<AdminApps />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="*"           element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </ClockFormatProvider>
          </LangProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
