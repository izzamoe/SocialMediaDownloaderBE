import {Context, Hono} from 'hono'
import {getListVideo as FacebookList} from './Controllers/Facebook'
import { cors } from 'hono/cors'
import {downloadIG} from "./Controllers/ig";

const app = new Hono()
app.use(cors({
    origin: '*'
}));

app.post('/', async (c: Context) => {
    // @ts-ignore
    try {
        const body = await c.req.json()
        const url = body.url
            const data = await downloadIG(url)
            return c.json(data)


    }
    catch (e: unknown) {
        if (e instanceof Error) {
            if (e.message.includes('Unexpected end of JSON input')) {
                return c.json({message: 'field kosong'})
            }
            return c.json({message: e.message})

        }
    }
});




export default app
