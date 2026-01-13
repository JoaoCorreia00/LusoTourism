export interface Casino {
  denominacao: string;
  jogosBancados: string;
  salaEspetaculos: boolean;
  salaReunioesCongressos: boolean;
  restaurantes: number;
  bares: number;
  website: string;
  localidadeCP: string;
  concelho: string;
  distrito: string;
}

interface ApiResponse {
  features: Array<{
    attributes: {
      Denominacao: string;
      JogosBancados: string;
      SalaEspetaculos: boolean;
      SalaReunioesCongressos: boolean;
      Restaurantes: number;
      Bares: number;
      Website: string;
      LocalidadeCP: string;
      Concelho: string;
      Distrito: string;
    };
  }>;
}

const API_BASE = location.hostname === "localhost"
    ? '/api'
    : 'https://cors-anywhere.com/https://servergeo.sgeconomia.gov.pt';

export async function fetchCasinos(): Promise<ApiResponse> {

  const BASE = `${API_BASE}/arcgis/rest/services/TDP/OpenData_Casinos/MapServer/10/query`;

  const outFields = 'Denominacao, JogosBancados, SalaEspetaculos, SalaReunioesCongressos, Restaurantes, Bares, Website, LocalidadeCP, Concelho, Distrito';

  let where = '1=1';

  const params = new URLSearchParams({
    where,
    outFields: outFields,
    returnGeometry: 'false',
    outSR: '4326',
    f: 'json',
  })

  const url = `${BASE}?${params.toString()}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const data = json as ApiResponse & { exceededTransferLimit?: boolean }
  return data
}
