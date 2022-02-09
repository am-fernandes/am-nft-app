/* eslint-disable @next/next/no-img-element */
import { useState, useContext, useEffect } from 'react';
import { WalletContext } from 'context/WalletContext'
import Grid from '@mui/material/Grid'
import { useForm } from 'react-hook-form';
import { InputEdit } from 'components/Form/FormComponents'
import { DefaultButton } from 'components/Button'
import Typography from '@mui/material/Typography';
import { TextField } from '@mui/material';
import styled from '@emotion/styled'
import ipfsUploader from 'helpers/ipfsUploader';

const toBase64 = (file: File) => new Promise((resolve, reject) => {
  if (!file) return reject("NO FILE")
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

interface Profile {
  photo: string
  username: string
  bio: string
  email: string
  wallet: string
  file: any
}


export const Frame = styled.div`
  margin: 1rem 0;
  background-color: #ddd;
  width: 20vw;
  height: 20vw;
  border-radius: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`

export const ProfilePhoto = styled.img`
  background-color: #fff;
  width: 20vw;
  height: 20vw;
  border-radius: 100%;
`

const imageUpload = async (files: FileList): Promise<string> => {
  const file = files[0];

  if (!file) throw new Error('no file')

  return ipfsUploader(file)
}




export default function Profile() {
  const { handleSubmit, control, register, watch } = useForm<Profile>({});
  const { wallet } = useContext(WalletContext)

  const [imagePreview, setImagePreview] = useState<string>()

  const watchNFTFile = watch('file')

  useEffect(() => {
    if (watchNFTFile) {
      console.log(typeof watchNFTFile)
      const file = watchNFTFile[0]

      if (file) {
        toBase64(file).then((res) => {
          setImagePreview(res as unknown as string)
        }).catch((error) => {
          throw new Error(error)
        })
      }
    }
  }, [watchNFTFile])



  const onSubmit = async ({ bio, email, username, file }: Profile) => {
    if (!file.length) throw new Error("no file");

    const photoURL = await imageUpload(file)

    fetch("http://localhost:3000/api/user/create", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        email,
        username,
        bio,
        wallet: wallet.address,
        photo: photoURL
      })
    })
      .then(response => {
        console.log(response);
        alert('criado com sucesso!')
      })
      .catch(err => {
        console.error(err);
      });

  };

  return (
    <>
      <Typography variant='h3' component="h1" className="text-center mb-4">Edite seu perfil</Typography>

      <Grid container spacing={10}>
        <Grid item md={4}>
          <label htmlFor="nftFile" className='block mb-4 font-bold text-lg text-black'>Faça o upload do arquivo PNG/JPG/GIF</label>
          <input id="nftFile" type="file" accept="image/x-png,image/gif,image/jpeg" {...register('file', { required: true })} />
          <Frame>
            {imagePreview && (
              <ProfilePhoto className="border shadow" alt="Imagem do NFT" src={imagePreview} />
            )}
          </Frame>

        </Grid>

        <Grid item md={8}>
          <TextField className="w-full" label="Endereço da carteira" disabled value={wallet?.address} />
          <InputEdit grid={12} name="username" control={control} label="Username" />
          <InputEdit grid={12} name="email" control={control} label="Email" type="email" />
          <InputEdit grid={12} control={control} label="Biografia" multiline rows={3} name="bio" />
          <DefaultButton variant="contained" onClick={() => handleSubmit(onSubmit)()}>
            Salvar perfil
          </DefaultButton>
        </Grid>
      </Grid>

    </>
  )
}