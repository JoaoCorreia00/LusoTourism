export interface Casino {
  denominacao: string;
  jogosBancados: string;
  salaEspetaculos: string;
  salaReunioesCongressos: string;
  restaurantes: string;
  bares: string;
  website: string;
  localidadeCP: string;
  concelho: string;
  distrito: string;
  codigoPostal: string;
}

export interface Bingo {
  denominacao: string;
  lotacao: string;
  salaEspetaculos: string;
  restaurantes: string;
  bares: string;
  website: string;
  localidadeCP: string;
  concelho: string;
  distrito: string;
  codigoPostal: string;
}

interface ApiResponse {
  features: Array<{
    attributes: {
      Denominacao: string;
      JogosBancados: string;
      SalaEspetaculos: string;
      SalaReunioesCongressos: string;
      Restaurantes: string;
      Bares: string;
      Website: string;
      LocalidadeCP: string;
      Concelho: string;
      Distrito: string;
      CodigoPostal: string;
    };
  }>;
}

interface ApiResponseBingo {
  features: Array<{
    attributes: {
      Denominacao: string;
      Lotacao: string;
      SalaEspetaculos: string;
      Restaurantes: string;
      Bares: string;
      Website: string;
      LocalidadeCP: string;
      Concelho: string;
      Distrito: string;
      CodigoPostal: string;
    };
  }>;
}

const API_BASE = location.hostname === "localhost"
    ? '/api'
    : 'https://cors-anywhere.com/https://servergeo.sgeconomia.gov.pt';

export async function fetchCasinos(): Promise<ApiResponse> {

  const BASE = `${API_BASE}/arcgis/rest/services/TDP/OpenData_Casinos/MapServer/10/query`;

  const outFields = 'Denominacao, JogosBancados, SalaEspetaculos, SalaReunioesCongressos, Restaurantes, Bares, Website, LocalidadeCP, Concelho, Distrito, CodigoPostal';

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

export async function fetchBingos(): Promise<ApiResponseBingo> {

  const BASE = `${API_BASE}/arcgis/rest/services/TDP/OpenData_Bingos/MapServer/11/query`;

  const outFields = 'Denominacao, Lotacao, SalaEspetaculos, Restaurantes, Bares, Website, LocalidadeCP, Concelho, Distrito, CodigoPostal';

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
  const data = json as ApiResponseBingo & { exceededTransferLimit?: boolean }
  return data
}
