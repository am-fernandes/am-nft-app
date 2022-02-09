import { createClient } from '@supabase/supabase-js'
import { NextApiResponse, NextApiRequest } from 'next'
import * as dotenv from "dotenv";

dotenv.config();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve) => {
    if (req.method !== 'POST') {
      res.status(405).send('Only POST requests allowed')
      return resolve()
    }

    const { wallet, username, email, bio, photo } = req.body

    if (!wallet || !username) {
      res.status(500).send('no data')
      return resolve()
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

    const { data, error } = await supabase
      .from('users')
      .insert([
        { wallet, username, email, bio, photo }
      ])

    if (error) {
      res.status(500).send(error)

      return resolve()
    }

    return res.status(200).send(data)
  })
}
