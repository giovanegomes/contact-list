import { create } from "zustand";
import type { Contact } from "../features/contatos";

type SelectedContact = {
  selectedContact?: Contact;
};

type SelectedContactActions = {
  setSelectedContact: (location: Contact) => void;
  clearSelectedContact: () => void;
};

const initialState: SelectedContact = {
  selectedContact: undefined,
};

export const useSelectedContactStore = create<
  SelectedContact & SelectedContactActions
>()((set) => ({
  ...initialState,
  setSelectedContact: (contact) => set(() => ({ selectedContact: contact })),
  clearSelectedContact: () => set(initialState),
}));
