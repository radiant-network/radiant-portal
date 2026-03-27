import { createContext, useContext } from 'react';

interface INotesContext {
  onChangeCallback: () => void;
}

export const NotesProvider = createContext<INotesContext>({
  onChangeCallback: () => {},
});

export function useNotesContext(): INotesContext {
  const context = useContext(NotesProvider);
  return context;
}
