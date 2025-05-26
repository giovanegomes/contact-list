import { removeSpecialCharacters } from "./remove-special-characters";

const CPFS_INVALIDOS = [
  '00000000000',
  '11111111111',
  '22222222222',
  '33333333333',
  '44444444444',
  '55555555555',
  '66666666666',
  '77777777777',
  '88888888888',
  '99999999999',
];

export const validarCPF = (cpf: string) => {
  let soma = 0;
  let resto;
  const cleanedCpf = removeSpecialCharacters(cpf);

  if (CPFS_INVALIDOS.indexOf(cleanedCpf) !== -1) return false;

  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cleanedCpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cleanedCpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cleanedCpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cleanedCpf.substring(10, 11))) return false;

  return true;
}
