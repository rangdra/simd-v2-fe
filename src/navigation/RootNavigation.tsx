import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "../context/GlobalContext";
import LoginScreen from "../screens/Auth/LoginScreen";
import PrivateRoute from "./PrivateRoute";
import Gejala from "../screens/Gejala";
import KategoriDO from "../screens/Kategori";
import RuleDO from "../screens/Rule";
import Pertanyaan from "../screens/Pertanyaan";
import Identifikasi from "../screens/Identifikasi";
import History from "../screens/History";
import DetailHistory from "../screens/History/Detail";
import MahasiswaDO from "../screens/Mahasiswa";
import Dashboard from "../screens/Dashboard";
import Users from "../screens/Users";
import LoginLog from "../screens/LoginLog";
import ChangePassword from "../screens/Auth/ChangePassword";
import AdminLoginScreen from "../screens/Auth/AdminLoginScreen";
import DetailIdentMhs from "../screens/History/DetailIdentMhs";

export default function RootNavigation() {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/admin-do" element={<AdminLoginScreen />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/kriteria"
            element={
              <PrivateRoute>
                <Gejala />
              </PrivateRoute>
            }
          />
          <Route
            path="/kategori"
            element={
              <PrivateRoute>
                <KategoriDO />
              </PrivateRoute>
            }
          />
          <Route
            path="/rules"
            element={
              <PrivateRoute>
                <RuleDO />
              </PrivateRoute>
            }
          />
          <Route
            path="/pertanyaan"
            element={
              <PrivateRoute>
                <Pertanyaan />
              </PrivateRoute>
            }
          />
          <Route
            path="/identifikasi"
            element={
              <PrivateRoute>
                <Identifikasi />
              </PrivateRoute>
            }
          />
          <Route
            path="/hasil"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
          <Route
            path="/hasil/:historyId"
            element={
              <PrivateRoute>
                <DetailHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/hasil-potensi"
            element={
              <PrivateRoute>
                <DetailIdentMhs />
              </PrivateRoute>
            }
          />
          <Route
            path="/mahasiswa"
            element={
              <PrivateRoute>
                <MahasiswaDO />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute>
                <ChangePassword />
              </PrivateRoute>
            }
          />
          <Route
            path="/log"
            element={
              <PrivateRoute>
                <LoginLog />
              </PrivateRoute>
            }
          />
          <Route
            path="/data-admin"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
}
