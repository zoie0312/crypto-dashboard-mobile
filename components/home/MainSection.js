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
 import { LineChart } from "react-native-gifted-charts";
import SectionHeader from './SectionHeader' 

const chartData = [
  {value: 50000, label: 'Jan'}, 
  {value: 40000, }, 
  {value: 44000, label: 'Apr'}, 
  {value: 40000, }, 
  {value: 35000, label: 'June'}
];

const MainSection = () => {
  return (
    <VStack  mt="4">
        <SectionHeader
            title='Total Value'
            value='3,500'
        />
        <Box px="4" pt="3" rounded="lg" >
          
          <LineChart
            areaChart
            curved
            hideDataPoints
            spacing={74}
            width={300}
            initialSpacing={0}
            yAxisThickness={0}
            rulesType="solid"
            yAxisOffset={28000}
            noOfSections={4}
            maxValue={28000}
            stepValue={7000}
            data={chartData}
            startFillColor="rgb(46, 217, 255)"
            startOpacity={0.8}
            endFillColor="rgb(203, 241, 250)"
            endOpacity={0.3}
          />
        </Box> 
            
    </VStack>
    
    
    
  )
}

export default MainSection