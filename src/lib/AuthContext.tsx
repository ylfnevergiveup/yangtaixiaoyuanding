"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getCurrentUser,
  loginUser as apiLogin,
  register as apiRegister,
  clearUserToken,
  getUserToken,
} from "./api";

interface User {
  username: string;
  nickname: string;
  bio: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false, message: "" }),
  register: async () => ({ success: false, message: "" }),
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化时检查登录状态
  useEffect(() => {
    const token = getUserToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getCurrentUser().then((u) => {
      if (u) {
        setUser({
          username: u.username,
          nickname: u.nickname || u.username,
          bio: u.bio || '',
          createdAt: u.createdAt || '',
        });
      } else {
        // token 无效，清理 cookie
        clearUserToken();
      }
      setLoading(false);
    });
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const result = await apiLogin(username, password);
      if (result.success) {
        // 登录成功后拉取完整用户资料
        const fullUser = await getCurrentUser();
        if (fullUser) {
          setUser({
            username: fullUser.username,
            nickname: fullUser.nickname || fullUser.username,
            bio: fullUser.bio || '',
            createdAt: fullUser.createdAt || '',
          });
        }
      }
      return result;
    },
    []
  );

  const registerUser = useCallback(
    async (username: string, password: string) => {
      const result = await apiRegister(username, password);
      return result;
    },
    []
  );

  const logout = useCallback(() => {
    clearUserToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register: registerUser, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
