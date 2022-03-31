// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserModel } from '../../../db/models/user'
import { setSession } from '../../../lib/cookie'

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
    const body = req.body

    if (!req.body || !req.body.token) {
        return res.status(400).end()
    }

    const user = await UserModel.findOne({ token: body.token })

    if (!user) {
        return res.status(400).end()
    }

    setSession(res, {
        token: body.token
    })

    res.redirect(307, '/map')
}
