import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../../components/UI/Input";
import { Button } from "../../components/UI/Button";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Endereco } from "../../@types/Address";
import StorageService from "../../services/StorageService";
import { useNavigate, useParams } from "react-router";
import useStorage from "../../hooks/useStorage";
import { debounce, merge } from "lodash";
import Geocode from "../../services/Geocode";
import { validarCPF } from "../../utils/validador-cpf";
import { Box, Container } from "@mui/material";
import AddressAutocomplete from "./components/Autocomplete";
import ViaCep from "../../services/ViaCep";
import FullScreenLoader from "../../components/FullScreenLoader";

const contactSchema = z.object({
  id: z.string().optional(),
  nome: z.string().nonempty("Por favor, informe o nome.").trim(),
  cpf: z.string().nonempty("Por favor, informe o CPF.").trim(),
  userId: z.string().optional(),
  telefone: z.string().nonempty("Por favor, informe o telefone").trim(),
  cep: z.string().nonempty("Por favor, informe o CEP.").trim(),
  uf: z.string().nonempty("Por favor, informe o estado.").trim(),
  cidade: z.string().nonempty("Por favor, informe a cidade.").trim(),
  bairro: z.string().nonempty("Por favor, informe o bairro.").trim(),
  endereco: z.string().nonempty("Por favor, informe o endereço.").trim(),
  numero: z.string().nonempty("Por favor, informe o número.").trim(),
  complemento: z.string().trim().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export type Contact = z.infer<typeof contactSchema>;

const createSchema = (contacts: Contact[], loggedUserId: string | null) =>
  contactSchema.superRefine(({ cpf, id }, context) => {
    if (!validarCPF(cpf)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CPF inválido.",
        path: ["cpf"],
      });
    }

    const cpfExists = contacts
      .filter((contact) => contact.userId === loggedUserId)
      .some((contact) => contact.cpf === cpf && contact.id !== id);

    if (cpfExists) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CPF informado já está cadastrado.",
        path: ["cpf"],
      });
    }
  });

export default function ContactForm() {
  const navigate = useNavigate();
  const params = useParams();
  const [contacts] = useStorage("contacts");
  const [loggedUserId] = useStorage("loggedUserId");
  const isEditing = !!params.id;
  const [addressSugestion, setAddressSugestion] = useState<Endereco[]>([]);
  const schema = createSchema(contacts || [], loggedUserId);
  const autocompleteRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Contact>({
    resolver: zodResolver(schema),
  });

  const [uf, cidade] = watch(["uf", "cidade"]);

  const fetchAddress = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      if (!uf || !cidade || !event.target.value) return;

      try {
        setLoading(true);
        const data = await ViaCep.fetchAddress({
          uf,
          cidade,
          logradouro: event.target.value,
        });
        setAddressSugestion(data);
      } catch (error) {
        console.error("Não foi possível consultar o endereço", error);
      } finally {
        setLoading(false);
      }
    },
    [uf, cidade]
  );

  const debouncedFetchAddress = debounce(fetchAddress, 250);

  const fetchAddressByCEP = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      if (errors.cep?.message) return;
      try {
        setLoading(true);

        const data = await ViaCep.fetchAddressByCEP(event.target.value);

        setValue("cidade", data.localidade);
        setValue("bairro", data.bairro);
        setValue("endereco", data.logradouro);
        setValue("uf", data.uf);
      } catch (error) {
        console.error("Não foi possível consultar o endereço", error);
      } finally {
        setLoading(false);
      }
    },
    [errors.cep?.message, setValue]
  );

  useEffect(() => {
    const contact = contacts?.find(({ id }) => id === params.id);

    if (!contact) return;

    reset(contact);
  }, [params.id, contacts, reset]);

  const acceptAddressSugestion = (endereco: Endereco | null) => {
    if (!endereco) return;
    setValue("cep", endereco.cep);
    setValue("bairro", endereco.bairro);
    setValue("endereco", endereco.logradouro);
    setAddressSugestion([]);
  };

  const saveContact = useCallback(
    async (data: Contact) => {
      const { uf, cidade, bairro, endereco, numero } = data;
      const location = await Geocode.getLatLngByAddress(
        `${uf} ${cidade} ${bairro} ${endereco} ${numero}`
      );

      if (isEditing && contacts?.length) {
        const updatedContacts = contacts.map((contact) => {
          const updatedContact = { ...data, ...location };
          return contact.id === params.id
            ? merge({}, contact, updatedContact)
            : contact;
        });

        StorageService.setItem("contacts", updatedContacts);
      } else {
        const currentContacts = contacts || [];
        const newContact = {
          ...data,
          ...location,
          id: crypto.randomUUID(),
          userId: loggedUserId,
        } as Contact;

        StorageService.setItem("contacts", [...currentContacts, newContact]);
      }
      navigate("/home");
    },
    [contacts, params.id, isEditing, loggedUserId, navigate]
  );

  return (
    <Container>
      <Box
        component="form"
        onSubmit={handleSubmit(saveContact)}
        sx={{
          display: "flex",
          fled: 1,
          flexDirection: "column",
          gap: 2,
          padding: 5,
        }}
      >
        <Input
          label="Nome:"
          {...register("nome")}
          type="text"
          showError={!!errors.nome?.message}
          errorMessage={errors.nome?.message}
          shoulShrink
        />
        <Input
          label="CPF:"
          {...register("cpf")}
          type="text"
          showError={!!errors.cpf?.message}
          errorMessage={errors.cpf?.message}
          maskType="cpf"
          shoulShrink
        />
        <Input
          label="Telefone:"
          {...register("telefone")}
          type="text"
          showError={!!errors.telefone?.message}
          errorMessage={errors.telefone?.message}
          maskType="phone"
          shoulShrink
        />
        <Input
          label="CEP:"
          {...register("cep")}
          type="text"
          showError={!!errors.cep?.message}
          errorMessage={errors.cep?.message}
          onBlur={fetchAddressByCEP}
          maskType="cep"
          shoulShrink
        />
        <Input
          label="UF:"
          {...register("uf")}
          type="text"
          showError={!!errors.uf?.message}
          errorMessage={errors.uf?.message}
          shoulShrink
        />
        <Input
          label="Cidade:"
          {...register("cidade")}
          type="text"
          showError={!!errors.cidade?.message}
          errorMessage={errors.cidade?.message}
          shoulShrink
        />
        <Input
          label="Endereço:"
          {...register("endereco")}
          type="text"
          showError={!!errors.endereco?.message}
          errorMessage={errors.endereco?.message}
          onChange={debouncedFetchAddress}
          shoulShrink
          inputRef={autocompleteRef}
        />
        <AddressAutocomplete
          suggestions={addressSugestion}
          anchorElement={autocompleteRef.current}
          onSelect={acceptAddressSugestion}
        />
        <Input
          label="Bairro:"
          {...register("bairro")}
          type="text"
          showError={!!errors.bairro?.message}
          errorMessage={errors.bairro?.message}
          shoulShrink
        />
        <Input
          label="Número:"
          {...register("numero")}
          type="number"
          showError={!!errors.numero?.message}
          errorMessage={errors.numero?.message}
          shoulShrink
        />
        <Input
          label="Complemento:"
          {...register("complemento")}
          type="text"
          showError={!!errors.complemento?.message}
          errorMessage={errors.complemento?.message}
          shoulShrink
        />

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            type="button"
            title="Cancelar"
            color="secondary"
            onClick={() => navigate(-1)}
          />
          <Button type="submit" title={isEditing ? "Atualizar" : "Cadastrar"} />
        </Box>
      </Box>
      {loading && <FullScreenLoader />}
    </Container>
  );
}
