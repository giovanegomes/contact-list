const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})(\d)/, "$1-$2");
};

const maskCEP = (value: string) => {
  return value.replace(/\D/g, "").replace(/^(\d{5})(\d{3})+?$/, "$1-$2");
};

const MASKS = {
  cpf: maskCPF,
  cep: maskCEP,
  phone: maskPhone,
};

export type MaskType = keyof typeof MASKS;

type ApplyMaskParams = {
  maskType: MaskType;
  value: string;
};

export const applyMask = ({ maskType, value }: ApplyMaskParams) =>
  MASKS[maskType](value);
