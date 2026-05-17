import { createContext, useContext } from 'react';

export const NavCtx = createContext({
  nav: () => {},
  back: () => {},
  screen: 'onboarding',
  direction: 'forward',
});

export const useNav = () => useContext(NavCtx);
