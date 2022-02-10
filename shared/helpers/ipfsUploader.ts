import { create } from 'ipfs-http-client'

export default async function ipfsUploader(data): Promise<string> {
  if (!data) throw new Error("no data")

  const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })
  const added = await client.add(data)

  return `https://ipfs.infura.io/ipfs/${added.path}`
}