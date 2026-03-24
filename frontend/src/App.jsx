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
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import Home from './pages/Home/Home.jsx';
import AllApps from './pages/AllApps/AllApps.jsx';
import Search from './pages/Search/Search.jsx';
import Settings from './pages/Settings/Settings.jsx';
import AppViewer from './pages/AppViewer/AppViewer.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import AdminApps from './pages/Admin/AdminApps.jsx';
import OAuthCallback from './pages/Auth/OAuthCallback.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LangProvider>
            <ClockFormatProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />
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
                  <Route index element={<Home />} />
                  <Route path="/apps" element={<AllApps />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/viewer/:id" element={<AppViewer />} />
                  <Route path="/admin" element={<AdminApps />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </ClockFormatProvider>
          </LangProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
