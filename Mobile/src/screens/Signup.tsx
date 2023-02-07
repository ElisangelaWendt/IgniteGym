import { Center, Heading, Image, ScrollView, Text, VStack } from "native-base";

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import Input from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

//usado para validar o formulário
const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o email').email("E-mail inválido"),
  password: yup.string().required('Informe a senha').min(6, "A senha deve ter pelo menos 6 digitos"),
  passwordConfirm: yup.string().required('Confirme a senha').oneOf([yup.ref("password"), null], "A confirmação de senha deve ser igual a senha")
})

export default function Signup() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleSignUp({name, email,password}: FormDataProps) {
    await fetch('http://192.168.254.3:3333/users',{
      method:'POST',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name,email,password})
    }).then(response => response.json())
    .then(data => console.log(data))
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
          <Heading color="green.100" fontSize='xl' mb={6} fontFamily='heading' >Crie sua conta</Heading>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message} //necessário para exibir a mensagem de erro
              />
            )}
          />

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
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="password"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, value } }) => (

              <Input
                placeholder="Confirmar senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType='send'
                errorMessage={errors.passwordConfirm?.message}
              />
            )}
          />
          <Button title="Criar e acessar" onPress={handleSubmit(handleSignUp)} />
        </Center>

        <Button mt={12} title="Voltar para o login" variant="outline" onPress={handleGoBack} />
      </VStack>
    </ScrollView>
  )
}