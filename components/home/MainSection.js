//import { View, Text } from 'react-native'
import React from 'react'
import { 
    HStack, 
    Text, 
    Center, 
    ChevronRightIcon, 
    VStack,
    Box
 } from 'native-base';
import SectionHeader from './SectionHeader' 

const MainSection = () => {
  return (
    <VStack  mt="5">
        <SectionHeader
            title='Total Value'
            value='3,500'
        />
        <Box  bg="primary.400" p="12" rounded="lg" h="56">
            Chart Area
        </Box>
            
    </VStack>
    
    
    
  )
}

export default MainSection