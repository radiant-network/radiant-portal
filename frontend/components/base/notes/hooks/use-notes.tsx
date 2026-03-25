import { createContext, useContext } from 'react';

interface INotesContext {
  listFetcher: () => void;
}

export const NotesProvider = createContext<INotesContext>({
  listFetcher: () => {},
});

export function useNotesContext(): INotesContext {
  const context = useContext(NotesProvider);
  return context;
}
