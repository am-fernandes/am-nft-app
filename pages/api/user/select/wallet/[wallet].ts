import { createClient } from '@supabase/supabase-js'
import { NextApiResponse, NextApiRequest } from 'next'
import * as dotenv from "dotenv";
// import * as redis from 'redis'
import Redis from 'ioredis'

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

    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    })

    //@ts-ignore
    const value = await redis.get(wallet)

    if (value) {
      return res.status(200).send(JSON.parse(value))
    }

    // await client.disconnect()

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('wallet', wallet)

    if (error) {
      res.status(500).send(error)

      return resolve()
    }

    // await client.connect();
    // //@ts-ignore
    await redis.set(wallet, JSON.stringify(data));
    // await client.disconnect()

    await redis.disconnect();

    return res.status(200).send(data)
  })
}
