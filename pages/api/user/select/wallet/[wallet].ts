import { createClient } from '@supabase/supabase-js'
import { NextApiResponse, NextApiRequest } from 'next'
import * as dotenv from "dotenv";

dotenv.config();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>(async (resolve) => {
    if (req.method !== 'GET') {
      res.status(405).send('Only GET requests allowed')
      return resolve()
    }

    const { wallet } = req.query

    if (!wallet) {
      res.status(500).send('no data')
      return resolve()
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('wallet', wallet)

    if (error) {
      res.status(500).send(error)

      return resolve()
    }

    return res.status(200).send(data)
  })
}
