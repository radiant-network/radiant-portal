import { createContext, useContext } from 'react';

type LoginContext = {
  sub: string;
  email: string;
  name: string;
};

export const LoginContext = createContext<LoginContext>({
  sub: '',
  email: '',
  name: '',
});

export function useLoginContext() {
  return useContext(LoginContext);
}
