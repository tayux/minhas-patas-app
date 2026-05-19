import { createContext, useContext, useState, useEffect } from 'react';

const AuthCtx = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('mp_google_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = async (googleTokenResponse) => {
    const info = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleTokenResponse.access_token}` },
    }).then(r => r.json());

    // Cria ou recupera usuário no banco
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        google_id: info.sub,
        email: info.email,
        name: info.name,
        picture_url: info.picture,
        avatar_hue: 28,
      }),
    });

    const dbUser = res.ok ? await res.json() : null;
    const userData = {
      id: dbUser?.id ?? info.sub,
      name: info.name,
      email: info.email,
      picture: info.picture,
      google_id: info.sub,
    };

    localStorage.setItem('mp_google_user', JSON.stringify(userData));
    if (dbUser?.id) localStorage.setItem('mp_user_id', dbUser.id);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('mp_google_user');
    localStorage.removeItem('mp_user_id');
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
