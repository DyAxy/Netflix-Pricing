import axios from "axios";
import { buildMemoryStorage, setupCache } from "axios-cache-interceptor";

function response200(content: any): Response {
    return new Response(
        JSON.stringify({ success: true, content: content }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}
function response403(content: any): Response {
    return new Response(
        JSON.stringify({ success: false, content: content }),
        {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        }
    );
}

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    const req = axios.create({
        baseURL: 'https://raw.githubusercontent.com/DyAxy'
    })
    const cached = setupCache(req, {
        storage: buildMemoryStorage(true, 23 * 60 * 60 * 1000)
    });
    let result: any
    switch (params.slug) {
        case 'getRate':
            result = await cached.get('/ExchangeRatesTable/main/data.json')
            if (result.status === 200) {
                return response200(result.data)
            }
        case 'getPrice':
            result = await cached.get('/NetflixPricingTable/main/changelog.json')
            if (result.status === 200) {
                return response200(result.data)
            }
        default:
            return response403('No Data')
    }
}