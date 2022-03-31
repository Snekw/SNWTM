// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserModel } from '../../../db/models/user'

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
  console.log(req.body, req.headers.authorization)
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
  console.log(`Token: ${token} - Body: ${body}`)

  const user = await UserModel.findOne({ token: token })

  console.log(user)

  if (!req.body || !req.body) {
    return res.status(400).end()
  }

  const mapData = req.body

  try {
    const extraInfoRes = await (await fetch(`https://trackmania.exchange/api/maps/get_map_info/uid/${mapData.mapUid}`)).json()
    mapData.tmx = extraInfoRes
  } catch (e) {
    console.error(`Failed to get extra info for map: ${mapData.mapUid}`)
  }

  console.log(mapData)

  const mapInfo = Buffer.from(JSON.stringify(mapData)).toString('base64')

  user.map = mapInfo

  user.expireAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)

  await user.save()

  res.status(200).end(req.body.mapUid)
}
