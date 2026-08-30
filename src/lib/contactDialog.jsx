import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Une seule fenêtre de contact pour tout le site.
 *
 * Les coordonnées vivaient à quatre endroits - page contact, pied de page,
 * barre de navigation, barre d'action mobile - chacun avec sa sélection. Elles
 * vivent maintenant à un seul : n'importe quel appel à contact ouvre la même
 * fenêtre, avec la même information complète.
 */
const ContactDialogContext = createContext(null);

export function ContactDialogProvider({ children }) {
  const [open, setOpen] = useState(false);
  // La source sert au suivi : savoir d'où l'on demande à nous joindre.
  const [source, setSource] = useState('');

  const openDialog = useCallback((from = 'unknown') => {
    setSource(from);
    setOpen(true);
  }, []);
  const closeDialog = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, source, openDialog, closeDialog }), [open, source, openDialog, closeDialog]);

  return <ContactDialogContext.Provider value={value}>{children}</ContactDialogContext.Provider>;
}

export function useContactDialog() {
  const ctx = useContext(ContactDialogContext);
  if (!ctx) throw new Error('useContactDialog doit être utilisé dans <ContactDialogProvider>');
  return ctx;
}
