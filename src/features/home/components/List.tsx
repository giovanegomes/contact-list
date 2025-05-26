import React, { useEffect, useState } from "react";
import StorageService from "../../../services/StorageService";
import useStorage from "../../../hooks/useStorage";
import type { Contact } from "../../contatos";
import { useNavigate } from "react-router";
import { useSelectedContactStore } from "../../../hooks/useSelectedContactStore";
import { Input } from "../../../components/UI/Input";
import { Box, Divider, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import ConfirmDialog from "../../../components/ConfirmDialog";

export function ContactList() {
  const navigate = useNavigate();
  const [contacts] = useStorage("contacts");
  const [loggedUserId] = useStorage("loggedUserId");
  const [userContacts, setUserContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const { selectedContact, setSelectedContact, clearSelectedContact } =
    useSelectedContactStore();

  useEffect(() => {
    if (!loggedUserId) return;

    const userContacts = contacts?.filter(
      ({ userId }) => userId === loggedUserId
    );

    setUserContacts(userContacts || []);
    setFilteredContacts(userContacts || []);
  }, [loggedUserId, contacts]);

  const removeContact = (id?: string) => {
    const allContacts =
      contacts?.filter(({ userId }) => userId !== loggedUserId) || [];
    const filteredContacts =
      userContacts?.filter((contact) => contact.id !== id) || [];

    StorageService.setItem("contacts", [...allContacts, ...filteredContacts]);
  };

  const selectContact = (id?: string) => {
    const selectedContact = contacts?.find((contact) => contact.id === id);

    if (!selectedContact) return;

    setSelectedContact(selectedContact);
  };

  const handleDestroy = (id?: string) => {
    if (!id) return false;

    removeContact(id);
    clearSelectedContact();

    return true;
  };

  const filter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyWords = event.target.value.toLowerCase().split(" ");
    const filteredData = userContacts.filter(({ nome, cpf }) =>
      keyWords.some((word) => {
        return (
          nome.toLowerCase().includes(word) || cpf.toLowerCase().includes(word)
        );
      })
    );

    setFilteredContacts(filteredData);
  };

  return (
    <Box>
      <Input
        id="filtro"
        label="Filtro"
        type="text"
        onChange={filter}
        placeholder="Pesquise pelo nome ou cpf"
      />
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          maxHeight: "65vh",
        }}
      >
        {filteredContacts.map(({ id, telefone, cpf, nome }, index) => (
          <React.Fragment key={id}>
            {index > 0 && <Divider />}
            <Box
              sx={{
                mt: 2,
                mb: 2,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 2,
                backgroundColor:
                  selectedContact?.id === id ? "#b4babb" : "none",
                borderRadius: "10px",
                padding: 1,
              }}
              onClick={() => selectContact(id)}
            >
              <Box
                sx={{
                  gap: 1,
                }}
              >
                <Typography variant="subtitle2">Nome: {nome}</Typography>
                <Typography variant="subtitle2">
                  Telefone: {telefone}
                </Typography>
                <Typography variant="subtitle2">CPF: {cpf}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ConfirmDialog
                  title="Atenção"
                  onConfirm={() => handleDestroy(id)}
                  content={`Tem certeza que deseja excluir o contato ${nome}?`}
                  component={
                    <Delete
                      sx={{
                        cursor: "pointer",
                      }}
                      color="error"
                    />
                  }
                />
                <Edit
                  onClick={() => navigate(`/contact/${id}`)}
                  sx={{
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}
