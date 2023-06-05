let base = "http://localhost:8080";

// Brands URIs
export function getBrands(): string {
  return `${base}/brand`;
}

export function createBrand(): string {
  return `${base}/brand`;
}

// Phones table URIs

export function getPhoneById(id: string): string {
  return `${base}/phones/${id}`;
}

export function getAllPhones(): string {
  return `${base}/phones`;
}

export function createPhone(): string {
  return `${base}/phones`;
}

export function updatePhoneById(phoneId: string): string {
  return `${base}/phones/${phoneId}`;
}

export function deletePhoneById(phoneId: string): string {
  return `${base}/phones/${phoneId}`;
}

// Prices table URIsw

export function getAllPrices(): string {
  return `${base}/prices`;
}
export function getAllPricesById(id: string): string {
  return `${base}/prices/${id}`;
}

export function getAllPriceById(id: string): string {
  return `${base}/prices/${id}`;
}

export function createPrice(): string {
  return `${base}/prices/store`;
}

export function deletePriceById(id: string): string {
  return `${base}/prices/delete/${id}`;
}

export function updatePriceById(id: string, model: string): string {
  return `${base}/prices/${model}/${id}`;
}

// News

export function newsApi(topis: string): string {
  return `https://newsapi.org/v2/everything?q=${topis}&pageSize=20&sortBy=popularity&apiKey=cd0ed60d4c7141eca5ec4a1e8a198b47`;
}
