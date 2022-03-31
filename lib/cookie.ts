import { parse, serialize } from "cookie";
import { IncomingMessage, OutgoingMessage } from "http";

export function parseCookies(req: IncomingMessage | undefined) {
    const cookies = parse(req ? req.headers.cookie || "" : document.cookie, {
        decode: (val: string) => Buffer.from(val, 'base64').toString()
    })
    return cookies.session ? JSON.parse(cookies.session) : undefined
}

export function setSession(res: OutgoingMessage, cookies: Record<string, string>) {
    res.removeHeader('Set-Cookie')
    res.setHeader('Set-Cookie', serialize('session', JSON.stringify(cookies), {
        encode: (val: string) => Buffer.from(val).toString('base64'),
        maxAge: 60 * 60 * 90,
        path: '/map'
    }))
    return
}
