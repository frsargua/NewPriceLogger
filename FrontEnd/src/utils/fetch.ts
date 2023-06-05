export async function fetchData(apiUrl: string) {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}
