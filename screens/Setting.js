import { View, } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { HStack, Center, Text, ThreeDotsIcon, Divider, VStack } from 'native-base'
import BottomTabs from "../components/home/BottomTabs";

const Setting = ({ navigation }) => {
  return (
    <SafeAreaView style={{ backgroundColor: "#eee", flex: 1 }}>
      <View >
        <HStack  alignItems="center" justifyContent="space-between" pr="5" pl="3" my="3">
            <Text fontSize="3xl" fontWeight='500'>Setting</Text>
        </HStack>
      </View>
      <VStack  space="5" flex='1'>
        <Center bg="primary.400" size="16"></Center>
        <Center bg="secondary.400" size="16"></Center>
        <Center bg="emerald.400" size="16"></Center>
      </VStack>
      
      <Divider width={1} />
      <BottomTabs navigation={navigation}/>
    </SafeAreaView>
  )
}

export default Setting