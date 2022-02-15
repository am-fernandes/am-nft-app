import { NextApiResponse, NextApiRequest } from 'next'
import { create } from 'ipfs-http-client'
import formidable from 'formidable'


export const config = {
  api: {
    bodyParser: false
  }

}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve) => {
    if (req.method !== 'POST') {
      res.status(405).send('Only POST requests allowed')
      return resolve()
    }

    const { data } = req.body

    if (!data) {
      res.status(500).send('no data')
    }

    const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })
    const added = await client.add(data)


    return res.status(200).send(`https://ipfs.infura.io/ipfs/${added.path}`)
  })
}
