import { Box, Center, Heading, HStack, Icon, Image, ScrollView, Text, VStack } from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button";

export function Exercise() {
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleGoBack() {
    navigation.goBack()
  }

  return (
    <VStack flex={1}>
      <VStack px={8} bg='gray.600' pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color='green.500' size={6} />
        </TouchableOpacity>
        <HStack justifyContent='space-between' mt={4} mb={8} alignItems='center' >
          <Heading color='gray.100' fontSize='lg' flexShrink={1} fontFamily='heading'>
            Puxada frontal
          </Heading>
          <HStack alignItems='center'>
            <BodySvg />
            <Text color='gray.200' ml={1} textTransform='capitalize'>
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>
      <ScrollView>
      <VStack p={8}>
        <Image
          w='full'
          h={80}
          source={{ uri: 'data:image/jpeg;base64,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' }}
          alt="imagem do Execício"
          mb={3}
          resizeMode='cover'
          rounded='lg'
        />
        <Box bg='gray.600' rounded='md' pb={4} px={4}>
          <HStack alignItems='center' justifyContent='space-around' mb={6} mt={5}>
          <HStack>
            <SeriesSvg/>
            <Text color='gray.200' ml={2}>3 séries</Text>
          </HStack>
          <HStack>
            <RepetitionsSvg/>
            <Text color='gray.200' ml={2}>12 repetições</Text>
          </HStack>
          </HStack>
          <Button
          title="Marcar como realizado"
          />
        </Box>
      </VStack>
      </ScrollView>
    </VStack>
  )
}