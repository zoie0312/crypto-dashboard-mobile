import React from 'react'
import { HStack, Center, Avatar, Text } from 'native-base'

const Header = () => {
  return (
    <HStack  alignItems="center" justifyContent="space-between" px="3" >
        <Text fontSize="xl" fontWeight="semibold">My Portfolio</Text>
        
        <Center size="12">
            <Avatar
                size="md" 
                source={{
                    uri: 'https://cdn.pixabay.com/photo/2019/11/03/20/11/portrait-4599553__340.jpg'
                }}
                key={'https://cdn.pixabay.com/photo/2019/11/03/20/11/portrait-4599553__340.jpg'}
            >
                SS
            </Avatar>
            
        </Center>
        
    </HStack>
  )
}

   

export default Header