// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { generate as shortUUID } from "short-uuid";
import { UserModel } from '../../../../db/models/user'
import { DEFAULT_TEXT_TEMPLATE } from '../../../../lib/constants'
import { setSession } from '../../../../lib/cookie'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method !== 'POST') {
        return
    }
    const user = await UserModel.create({
        texts: [Buffer.from(JSON.stringify({ text: DEFAULT_TEXT_TEMPLATE, id: shortUUID().toString() })).toString('base64')]
    })

    if (!user) {
        return res.status(400).end()
    }

    setSession(res, {
        token: user.token
    })
    res.status(200).end()
}
