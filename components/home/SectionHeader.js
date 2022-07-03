import React from 'react'
import { 
    HStack, 
    Text, 
    Center, 
    ChevronRightIcon,
    Pressable
 } from 'native-base';

const SectionHeader = (props) => {
    const {title, value} = props;
    return (
        <HStack  justifyContent="space-between" px="4" alignItems="center">
            <Text fontSize="lg" >{title}: {value} USD</Text>
            <Pressable onPress={() => console.log('expand icon pressed')}>
                <ChevronRightIcon size='lg'/>
            </Pressable>
        </HStack>
    )
}

export default SectionHeader