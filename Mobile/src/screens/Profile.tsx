import { Button } from "@components/Button";
import Input from "@components/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, ScrollView, Skeleton, Text, useToast, VStack } from "native-base";
import { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

const PHOTO_SIZE = 33

type FormDataProps = {
  name: string,
  password: string,
  oldPassword: string,
  confirmPassword: string,
  email: string,
}

const profileSchema = yup.object({
  name: yup
    .string()
    .required('Informe o nome'),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 digitos")
    .nullable()
    .transform((value) => !!value ? value : null),
  confirmPassword: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), null], "A confirmação de senha não confere")
    .when('password', {
      is: (Field: any) => Field, // se não for nulo, obrigar a preencher o campo 
      then: yup
        .string()
        .nullable()
        .required('Infome a confirmação da senha')
        .transform((value) => !!value ? value : null)
    }),

})

export function Profile() {
  const [ isUpdating, setIsUpdating ] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema)
  })

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true)
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }
      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)
        console.log(photoInfo.size)
        // if (photoInfo.size && (photoInfo.size / 2048) > 100) {
        //   return toast.show({
        //     title: 'Essa imagem é muito grande. Escolha uma de até 5MB',
        //     placement: 'top',
        //     bgColor: 'red.500'
        //   })
        // }
        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        }as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        updateUserProfile(userUpdated)

        toast.show({
          title: 'Foto atualizada',
          placement: 'top',
          bgColor: 'green.500'
        })
      }

    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try{
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data);

      await updateUserProfile(userUpdated)

      toast.show({
        title: "Prefil atualizado com sucesso",
        placement: 'top',
        bgColor: 'green.500'
      })
    }catch(error){
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possivel atualizar dados, Tente novamente mais tarde'
    
      toast.show({
        title: "Prefil atualizado com sucesso",
        placement: 'top',
        bgColor: 'red.500'
      })
    }finally{
      setIsUpdating(true)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 56 }}>
        <Center mt={6} px={10}>
          {photoIsLoading
            ?
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor='gray.500'
              endColor='gray.400'
            />
            :
            <UserPhoto size={PHOTO_SIZE}
            source={user.avatar ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : defaultUserPhotoImg}
            alt="Imagem do usuário"
            />
          }
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight='bold' fontSize='md' mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                placeholder="Nome"
                bg="gray.600"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                bg="gray.600"
                isDisabled
                onChangeText={onChange}
                placeholder="E-mail"
              />
            )}
          />



        </Center>
        <VStack px={10} mt={12} mb={9}>
          <Heading fontFamily='heading' color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12}>Alterar senha</Heading>
          <Controller
            name="oldPassword"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg='gray.600'
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg='gray.600'
                placeholder="Nova Senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                bg='gray.600'
                placeholder="Confirme a nova Senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.confirmPassword?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  )
}