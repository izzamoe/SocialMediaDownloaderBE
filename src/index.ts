import {Context, Hono} from 'hono'
import {getListVideo as FacebookList} from './Controllers/Facebook'
import { cors } from 'hono/cors'
import {downloadIG} from "./Controllers/ig";

type Bindings = {
    KV: KVNamespace
}


const app = new Hono<{ Bindings: Bindings }>()
app.use(cors({
    origin: '*'
}));

const saveCache = async (c: Context, url: string, data: any) => {
    await c.env.KV.put(url, JSON.stringify(data), {expirationTtl: 60 * 60})
}


app.post('/', async (c: Context) => {
    const body = await c.req.json()
    const url = body.url
    try {

        const cacheRespons = await c.env.KV.get(url);

        if (cacheRespons) {
            return c.json(JSON.parse(cacheRespons))
        }

        const data = await downloadIG(url)
        c.executionCtx.waitUntil(saveCache(c, url, data));
        return c.json(data)


    }
    catch (e: unknown) {
        if (e instanceof Error) {
            if (e.message.includes('Unexpected end of JSON input')) {
                return c.json({message: 'field kosong'})
            }
            console.log(e)
            return c.json({message: e.message})

        }
    }
});




export default app
