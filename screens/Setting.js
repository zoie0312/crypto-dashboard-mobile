import { View, StyleSheet, Alert } from 'react-native'
import React, {useState, useEffect, useReducer} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
    HStack,
    Center,
    Text,
    ThreeDotsIcon,
    Divider,
    VStack,
    Heading,
    ScrollView,
    AddIcon,
    TextArea,
    Button,
    IconButton,
    Icon,
    ArrowBackIcon
} from 'native-base'    
import { AntDesign } from '@expo/vector-icons'
import {Camera, CameraType} from 'expo-camera'
import BottomTabs from '../components/home/BottomTabs'

const addressData = [
    '0x5436457568679dddaafh',
    '0x57675887568679dddaafh',
    '0x555567777768679dddaafh',
    '0x222222221118679dddaafh', 
]

const QRCodeScanComponent = (props) => {
    return (
        <VStack flex='1' space="5">
            <ArrowBackIcon m="5"
                onPress={props.goBack}
            />
            <Camera
                style={{flex: 2}}
                type={CameraType.back}
                barCodeScannerSettings={{
                    barCodeTypes: ['qr'],
                }}
                onBarCodeScanned={(...args) => {
                    Alert.alert(
                        'Aaddress scanned', 
                        args[0].data,
                        [
                            {
                              text: "Ok",
                              onPress: () => props.goBack(),
                              style: "ok",
                            },
                        ]
                    )
                    props.setNewAddress(args[0].data)
                }}
            />
            <VStack  flex='1'>
            </VStack>
        </VStack>
    )
}

const addressReducer = (addresses, action) =>{
    switch (action.type) {
        case 'ADD_ADDRESS':
            return [
                ...addresses,
                action.payload
            ];
    
        default:
            throw new Error();
    }
}

const Setting = ({ navigation }) => {
    const [newAddress, setNewAddress] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [walletAddresses, dispatch] = useReducer(addressReducer, addressData);

    const goBack = () => {setIsScanning(false)}

    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);
       
    console.log('walletAddresses= ', walletAddresses);
     
    return (
        <SafeAreaView style={{ backgroundColor: '#eee', flex: 1 }}>
            <View>
                <HStack
                    alignItems="center"
                    justifyContent="space-between"
                    pr="5"
                    pl="3"
                    my="3"
                >
                    <Text fontSize="3xl" fontWeight="500">
                        Setting
                    </Text>
                </HStack>
            </View>
            {
                (isScanning && hasPermission) ? 
                    <QRCodeScanComponent goBack={goBack} setNewAddress={setNewAddress}/> :
                    <VStack flex='1'>
                        <VStack flex="1">
                            <VStack p="5">
                                <Text fontSize="lg">New address,</Text>
                                <TextArea 
                                    placeholder="長按以貼上"
                                    value={newAddress}
                                    onChangeText={(msg) => {
                                        console.log(msg);
                                        setNewAddress(msg)
                                    }}
                                />

                                <HStack mt="2" space="3" alignItems="center">
                                    <Button
                                        colorScheme="primary"
                                        leftIcon={<AddIcon size="sm" />}
                                        isDisabled={!newAddress}
                                        onPress={() => {
                                            dispatch({type: 'ADD_ADDRESS', payload: newAddress.toString()});
                                            setNewAddress(null);
                                            console.log('hello')
                                        }}
                                    >
                                        Add
                                    </Button>
                                    <IconButton
                                        variant="solid"
                                        icon={
                                            <Icon
                                                size="md"
                                                as={AntDesign}
                                                name="camerao"
                                                color="white"
                                            />
                                        }
                                        onPress={() => {
                                            setIsScanning(true);
                                        }}
                                    />
                                </HStack>
                            </VStack>

                            <VStack p="5">
                                <Heading fontSize="xl" mb="3">
                                    Wallet Addresses:{' '}
                                </Heading>
                                <ScrollView
                                    maxW="300"
                                    h="150"
                                    borderRadius="2"
                                    borderWidth="1"
                                >
                                    {walletAddresses.map((address, idx) => (
                                        <Center
                                            key={address}    
                                            bg="primary.300"
                                            p="2"
                                            m="1"
                                            borderRadius="5"
                                        >
                                            {address}
                                        </Center>
                                    ))}
                                </ScrollView>
                            </VStack>
                        </VStack>
                        <Divider width={1} />
                        <BottomTabs navigation={navigation} />
                    </VStack>
                    
            }
            
        </SafeAreaView>
    )
}

export default Setting
