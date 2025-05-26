type FetchAddressParams = {
  uf: string;
  cidade: string;
  logradouro: string;
};

class ViaCep {
  private readonly BASE_URL = "https://viacep.com.br/ws";

  async fetchAddress({ uf, cidade, logradouro }: FetchAddressParams) {
    const url = `${this.BASE_URL}/${uf}/${cidade}/${logradouro}/json/`;

    const response = await fetch(url);
    const data = await response.json();

    return data;
  }

  async fetchAddressByCEP(cep: string) {
    const url = `${this.BASE_URL}/${cep}/json/`;

    const response = await fetch(url);
    const data = response.json();

    return data;
  }
}

export default new ViaCep();
