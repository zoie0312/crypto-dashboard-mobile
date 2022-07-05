import React from 'react'
import { HStack, Center, Text, ThreeDotsIcon } from 'native-base'

const Header = () => {
  return (
    <HStack  alignItems="center" justifyContent="space-between" pr="5" pl="3" my="3">
        <Text fontSize="3xl" fontWeight='500'>My Portfolio</Text>
        
        <Center size="8" bg='trueGray.200' borderRadius="20">
            <ThreeDotsIcon  size='sm' />
        </Center>
        
    </HStack>
  )
}

export default Header