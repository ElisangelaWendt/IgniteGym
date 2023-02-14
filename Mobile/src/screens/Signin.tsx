import { Center, Heading, Image, ScrollView, Text, useToast, VStack } from "native-base";

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import Input from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const signUpSchema = yup.object({
  email: yup.string().required('Informe o email').email("E-mail inválido"),
  password: yup.string().required('Informe a senha').min(6, "A senha deve ter pelo menos 6 digitos"),
})

export default function Signin() {
  const [isLoading, setIsLoading] = useState(false)
  const {SignIn} = useAuth()

  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const toast = useToast()

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })

  function handleNewAccount() {
    navigation.navigate('Signup')
  }

  async function handleSignin({email, password}: FormDataProps){
    try{
      await SignIn(email, password)
      setIsLoading(true)

    }catch(error){
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : "Não foi possível entrar. Tente novamente"
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
      setIsLoading(false)
    }

  }


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10}>
        <Image
          source={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
          defaultSource={BackgroundImg}
        />
        <Center my={24} >
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">Treine sua mente e o seu corpo</Text>
        </Center>
        <Center>
          <Heading color="green.100" fontSize='xl' mb={6} fontFamily='heading' >Acesse sua conta</Heading>
          <Controller
          control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )
            }
          />
          <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
            placeholder="Senha"
            secureTextEntry
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password?.message}
            onSubmitEditing={handleSubmit(handleSignin)}
            returnKeyType='send'
          />
          )
          }
          />
          <Button title="Acessar" onPress={handleSubmit(handleSignin)} isLoading={isLoading}/>
        </Center>
        <Center mt={24}>
          <Text
            color="gray.100"
            fontSize='sm'
            mb={3}
            fontFamily="body"
          >Ainda não tem acesso?</Text>
          <Button title="Criar conta" variant="outline" onPress={handleNewAccount} />
        </Center>
      </VStack>
    </ScrollView>
  )
}