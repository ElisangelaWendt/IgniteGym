import { Center, Heading, Image, ScrollView, Text, VStack } from "native-base";

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'
import Input from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import {AuthNavigatorRoutesProps} from '@routes/auth.routes'

export default function Signin() {
  
  const navigation = useNavigation<AuthNavigatorRoutesProps>();

  function handleNewAccount(){
    navigation.navigate('Signup')
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
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
        <Input
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          placeholder="Senha"
          secureTextEntry
        />
        <Button title="Acessar" />
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