// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserModel } from '../../../../db/models/user'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Token ')) {
        return res.status(401).end()
    }

    const split = auth.split(' ')
    if (split.length !== 2) {
        return res.status(401).end()
    }
    const token = split[1]
    const body = req.body

    if (!token || !body) {
        return res.status(400).end()
    }

    if (req.method === 'PUT') {
        const user = await UserModel.findOne({ token: token })

        if (!user) {
            return res.status(400).end()
        }

        const index = user.texts.findIndex((text: any) => {
            const t = JSON.parse(Buffer.from(text, 'base64').toString())
            return t.id === body.id
        })
        if (index > -1) {
            user.texts[index] = Buffer.from(JSON.stringify({ text: body.text, id: body.id })).toString('base64')
        } else {
            return res.status(400).end()
        }

        await user.save()

        return res.status(200).end()
    } else if (req.method === 'POST') {
        const user = await UserModel.findOne({ token: token })

        if (!user) {
            return res.status(400).end()
        }

        const index = user.texts.findIndex((text: any) => {
            const t = JSON.parse(Buffer.from(text, 'base64').toString())
            return t.id === body.id
        })
        if (index > -1) {
            return res.status(400).end()
        } else {
            user.texts.push(Buffer.from(JSON.stringify({ text: body.text, id: body.id })).toString('base64'))
        }

        await user.save()

        return res.status(200).end()
    } else if (req.method === 'DELETE') {
        const user = await UserModel.findOne({ token: token })

        if (!user) {
            return res.status(400).end()
        }

        const index = user.texts.findIndex((text: any) => {
            const t = JSON.parse(Buffer.from(text, 'base64').toString())
            return t.id === body.id
        })
        if (index > -1) {
            user.texts.splice(index, 1)
        }

        await user.save()

        return res.status(200).end()
    }
}
