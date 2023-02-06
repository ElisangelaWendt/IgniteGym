import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import {  Heading,  SectionList,  Text,  VStack } from "native-base";
import { useState } from "react";

export function History() {

  const [exercises, setExercises] = useState([{
    title: "title",
    data: ["", "2"]
  }])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios"/>
      <SectionList
      sections={exercises}
      keyExtractor={item => item}
      renderItem={({item}) => (
      <HistoryCard/>
      )}
      renderSectionHeader={({section}) => (
        <Heading color="gray.100" fontSize='md' mt={10} mb={3} fontFamily='heading'>
          {section.title}
        </Heading>
      )}
      px={8}
      contentContainerStyle={[].length === 0 && {flex:1, justifyContent: 'center'}}
      ListEmptyComponent={() => (
        <Text color="gray.100" textAlign='center' >
          Não há exercícios registrados ainda.{'\n'}
          Vamos fazer exercício hoje? 
        </Text>
      )}
      showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}