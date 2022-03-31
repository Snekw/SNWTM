// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserModel } from '../../../../../db/models/user'
import { textParse } from '../../../../../lib/textParser'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'GET') {
        return
    }
    const viewToken = req.query.token
    const query = req.query.string

    if (!viewToken || !query) {
        return res.status(400).end()
    }

    const user = await UserModel.findOne({ viewToken: viewToken })

    if (!user) {
        return res.status(400).end()
    }

    const index = user.texts.findIndex((text: any) => {
        const t = JSON.parse(Buffer.from(text, 'base64').toString())
        return t.id === query
    })

    if (index < 0) {
        return res.status(400).end()
    }

    const text = JSON.parse(Buffer.from(user.texts[index], 'base64').toString())
    const map = JSON.parse(Buffer.from(user.map, 'base64').toString())

    const result = textParse(text.text, map)

    console.log(result)

    res.status(200).end(result)
}
