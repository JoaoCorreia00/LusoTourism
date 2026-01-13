// Types for the API response
export interface Accommodation {
    attributes: {
        Denominacao: string;    // Name of the establishment
        NrRNET?: string;        // Registration number for ET
        NrRNAL?: string;        // Registration number for EA
        TipologiaET?: string;   // Type of establishment for ET
        Modalidade?: string;    // Type of establishment for EA
        Concelho: string;      // Municipality
        Distrito: string;      // District
    }
}

interface ApiResponse {
    features: Accommodation[];
}

//const BASE = '/api/arcgis/rest/services/TDP/OpenData_ETExistentes/MapServer/0/query'
const API_BASE = location.hostname === "localhost"
    ? '/api'
    : 'https://cors-anywhere.com/https://servergeo.sgeconomia.gov.pt';

const API_CONFIGS = {
    et: { base: `${API_BASE}/arcgis/rest/services/TDP/OpenData_ETExistentes/MapServer/0/query`,
        fields: {
            id: 'NrRNET', name: 'Denominacao', type: 'TipologiaET',
            municipality: 'Concelho', district: 'Distrito', address: 'Endereco',
            email: 'Email', selo: 'SeloCleanSafe', dateOpening: 'DataTituloValAbert',
            category: 'Categoria', NumUni: 'NrUnidAloj', NumBed: 'NrCamasFixas',
            NumRoom: 'NrQuartos', NumSuits: 'NrSuites', NumApa: 'NrApart',
            NumResidences: 'NrMoradias', NumCamp: 'NrCampistas', CT: 'IntegraCT',
            DesignationCT: 'DesignacaoCT', Golf: 'CampoGolfe', Meeting: 'SalasReunioes',
            NumMeeting: 'CapacSalasReunioes', Spa: 'SPA', Other: 'OutrosEquip', Web: 'Website'} },
    ea: { base: `${API_BASE}/arcgis/rest/services/TDP/OpenData_AL/MapServer/6/query`,
        fields: {
            id: 'NrRNAL', name: 'Denominacao', type: 'Modalidade',
            municipality: 'Concelho', district: 'Distrito', address: 'Endereco',
            email: 'Email', selo: 'SeloCleanSafe', dateOpening: 'DataAberturaPublico',
            Utents: 'NrUtentes'} }
};

/* Fetch a page of accommodations using ArcGIS pagination parameters
 resultOffset = offset (0-based), resultRecordCount = limit */
export async function getAccommodationsPage(api: 'et' | 'ea' = 'et', offset = 0, limit = 20, filters: { district?: string; type?: string } = {}, sortBy?: string) {
    
    const config = API_CONFIGS[api];
    const BASE = config.base;
    const outFields = ""+config.fields.name+","+config.fields.id+","+config.fields.type+","+config.fields.municipality+","+config.fields.district+"";

    let where = '1=1';
    const conditions: string[] = [];
    if (filters.district) conditions.push(`${config.fields.district} = '${filters.district.replace(/'/g, "''")}'`);
    if (filters.type) conditions.push(`${config.fields.type} = '${filters.type.replace(/'/g, "''")}'`);
    if (conditions.length) where = conditions.join(' AND ');

    const params = new URLSearchParams({
        where,
        outFields: outFields, 
        returnGeometry: 'false',
        outSR: '4326',
        f: 'json',
        resultOffset: String(offset),
        resultRecordCount: String(limit),
    })

    if (sortBy) {
        params.append('orderByFields', sortBy);
    }

    const url = `${BASE}?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json as ApiResponse & { exceededTransferLimit?: boolean }
}

/* Return only the total count of records (server-side) */
export async function getAccommodationsCount(api: 'et' | 'ea' = 'et', filters: { district?: string; type?: string } = {}): Promise<number> {
    
    const config = API_CONFIGS[api];
    const BASE = config.base;

    let where = '1=1';
    const conditions: string[] = [];
    if (filters.district) conditions.push(`${config.fields.district} = '${filters.district.replace(/'/g, "''")}'`);
    if (filters.type) conditions.push(`${config.fields.type} = '${filters.type.replace(/'/g, "''")}'`);
    if (conditions.length) where = conditions.join(' AND ');

    const params = new URLSearchParams({
        where,
        returnCountOnly: 'true',
        f: 'json',
    })
    const url = `${BASE}?${params.toString()}`
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    return json.count as number
}

// Backwards-compatible helper (fetch all)
export async function getAccommodations(api: 'et' | 'ea' = 'et'): Promise<Accommodation[]> {
    const r = await getAccommodationsPage(api, 0, 10000);
    return r.features;
}

/* Fetch unique districts */
export async function getUniqueDistricts(api: 'et' | 'ea' = 'et'): Promise<string[]> {

    const config = API_CONFIGS[api];
    const BASE = config.base;

    const params = new URLSearchParams({
        where: '1=1',
        outFields: config.fields.district,
        returnGeometry: 'false',
        outSR: '4326',
        f: 'json',
        returnDistinctValues: 'true',
    });
    const url = `${BASE}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.features.map((f: any) => f.attributes[config.fields.district]).sort();
}

/* Fetch unique types */
export async function getUniqueTypes(api: 'et' | 'ea' = 'et'): Promise<string[]> {

    const config = API_CONFIGS[api];
    const BASE = config.base;

    const params = new URLSearchParams({
        where: '1=1',
        outFields: config.fields.type,
        returnGeometry: 'false',
        outSR: '4326',
        f: 'json',
        returnDistinctValues: 'true',
    });
    const url = `${BASE}?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.features.map((f: any) => f.attributes[config.fields.type]).sort();
}

export async function getAccommodationsDetails(api: 'et' | 'ea' = 'et', id: string) {

    const config = API_CONFIGS[api];
    const BASE = config.base;
    let outFields =
    ""+config.fields.name+
    ","+config.fields.id+
    ","+config.fields.type+
    ","+config.fields.municipality+
    ","+config.fields.district+
    ","+config.fields.address+
    ","+config.fields.email+
    ","+config.fields.selo+
    ","+config.fields.dateOpening;

    if(api === "et"){
        outFields += ","+API_CONFIGS.et.fields.category+","+API_CONFIGS.et.fields.NumUni
        +","+API_CONFIGS.et.fields.NumBed+","+API_CONFIGS.et.fields.NumRoom
        +","+API_CONFIGS.et.fields.NumSuits+","+API_CONFIGS.et.fields.NumApa
        +","+API_CONFIGS.et.fields.NumResidences+","+API_CONFIGS.et.fields.NumCamp
        +","+API_CONFIGS.et.fields.CT+","+API_CONFIGS.et.fields.DesignationCT
        +","+API_CONFIGS.et.fields.Golf+","+API_CONFIGS.et.fields.Meeting
        +","+API_CONFIGS.et.fields.NumMeeting+","+API_CONFIGS.et.fields.Spa
        +","+API_CONFIGS.et.fields.Other+","+API_CONFIGS.et.fields.Web;
    }
    else{
        outFields += ","+API_CONFIGS.ea.fields.Utents;
    }

    let where = '1=1';
    const conditions: string[] = [];
    
    if (api === 'et') {
        conditions.push(`${config.fields.id} = '${id}'`);
    } else {
        conditions.push(`${config.fields.id} = ${id}`);
    }
    if (conditions.length) where = conditions.join(' AND ');

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
    return json as ApiResponse & { exceededTransferLimit?: boolean }
}
