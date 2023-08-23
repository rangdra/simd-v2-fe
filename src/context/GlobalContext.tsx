import axios from '../configs/axios';
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from 'react';
import { message } from 'antd';
import { ERoleType, IUser } from '../types';

const GlobalContext = createContext<
  | {
      currentUser: IUser | null;
      loading: boolean;
      setLoading: React.Dispatch<React.SetStateAction<boolean>>;
      register: (data: {
        fullname: string;
        username: string;
        email: string;
        password: string;
      }) => void;
      login: (data: { username: string; password: string }) => void;
      loginWithGoogle: () => void;
      logout: () => void;
      isAdmin: boolean | undefined;
      isMhs: boolean | undefined;
      isSuperAdmin: boolean | undefined;
    }
  | undefined
>(undefined);

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const token = Cookies.get('token');
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUserLogin = async () => {
      const res = await axios.get('/auth/current-user');
      setCurrentUser(res.data);
    };
    if (
      location.pathname !== '/login' &&
      location.pathname !== '/register' &&
      token
    ) {
      getUserLogin();
    }
  }, [token, location.pathname]);

  const register = async (data: {
    fullname?: string;
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/register?isRecord=true', data);
      // setLoading(false);
      // navigate('/login');
      // message.success(res.data.message);

      const tokenBase64 = btoa(res.data.token);
      Cookies.set('token', tokenBase64, { expires: 7 });
      const user: IUser = jwtDecode(res.data.token);
      setCurrentUser(user);
      message.success(
        `Hai ${user.fullname || ''}, selamat datang di akun Anda!`
      );
      setLoading(false);
      navigate('/dashboard');
    } catch (error: any) {
      setLoading(false);
      message.error(error.response.data.message);
    }
  };

  const login = async (data: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', data);
      const user: IUser = jwtDecode(res.data.token);
      console.log(user);

      if (location.pathname === '/admin-do') {
        if (user.role === ERoleType.mahasiswa) {
          message.error('Unauthorized');
          return;
        } else {
          const tokenBase64 = btoa(res.data.token);
          Cookies.set('token', tokenBase64, { expires: 7 });
          setCurrentUser(user);
          message.success(`Hai ${user.fullname}, selamat datang di akun Anda!`);
          navigate('/dashboard');
        }
      } else {
        if (
          user.role === ERoleType.admin ||
          user.role === ERoleType.super_admin
        ) {
          message.error('Unauthorized');
          return;
        } else {
          const tokenBase64 = btoa(res.data.token);
          Cookies.set('token', tokenBase64, { expires: 7 });
          setCurrentUser(user);
          message.success(`Hai ${user.fullname}, selamat datang di akun Anda!`);
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const resGoogle = await signInWithPopup(auth, provider);
      const res = await axios.post('/auth/google', {
        fullname: resGoogle.user.displayName,
        username: resGoogle.user.displayName,
        email: resGoogle.user.email,
        avatar: resGoogle.user.photoURL,
      });

      const tokenBase64 = btoa(res.data.token);
      Cookies.set('token', tokenBase64, { expires: 7 });
      const user: IUser = jwtDecode(res.data.token);
      setCurrentUser(user);
      message.success(
        `Hai ${resGoogle.user.displayName}, selamat datang di akun Anda!`
      );
      setLoading(false);
      navigate('/dashboard');
    } catch (error: any) {
      setLoading(false);
      message.error(error.response.data.message);
      console.log(error);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setCurrentUser(null);

    if (
      currentUser?.role === ERoleType.admin ||
      currentUser?.role === ERoleType.super_admin
    ) {
      navigate('/admin-do');
    } else {
      navigate('/');
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        loading,
        setLoading,
        register,
        login,
        loginWithGoogle,
        logout,
        isAdmin: currentUser?.role === ERoleType.admin,
        isMhs: currentUser?.role === ERoleType.mahasiswa,
        isSuperAdmin: currentUser?.role === ERoleType.super_admin,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};

export { GlobalProvider, useGlobalContext };
