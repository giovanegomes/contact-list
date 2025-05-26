import type { Contact } from "../features/contatos";
import type { User } from "../features/user/Register";

type StorageValues = {
  loggedUserId: string;
  users: User[];
  contacts: Contact[];
};
