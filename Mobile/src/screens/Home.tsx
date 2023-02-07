import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { Center, FlatList, Heading, HStack, Text, VStack } from "native-base";
import { useState } from "react";

export function Home() {
  const [groupSelected, setGroupSelected] = useState('costas')
  const [groups, setGroups] = useState(['Alguma coisa', 'costas'])
  const [exercises, setExercises] = useState(['Alguma coisa', 'costas'])

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails(){
    navigation.navigate('Exercise')
  }

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />

      <VStack px={8}>
        <HStack justifyContent='space-between'>
          <Heading color="gray.200" fontSize='md' fontFamily='heading' >Exercícios</Heading>
          <Text color='gray.200' fontSize='sm'>{exercises.length}</Text>
        </HStack>
        <FlatList 
        data={exercises}
        keyExtractor={item => item}
        renderItem={({item})=>(
          <ExerciseCard onPress={handleOpenExerciseDetails} />
        )}
        showsVerticalScrollIndicator={false}
        _contentContainerStyle={{
          paddingBottom: 20
        }}
        />
      </VStack>
    </VStack>
  )
}