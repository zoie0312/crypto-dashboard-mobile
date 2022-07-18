import { View, StyleSheet, Alert } from 'react-native'
import React, {useState, useEffect, useReducer, useContext} from 'react'
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
    ArrowBackIcon,
    Select
} from 'native-base'    
import { AntDesign } from '@expo/vector-icons'
import {Camera, CameraType} from 'expo-camera'
import BottomTabs from '../components/home/BottomTabs'
import { PortfolioContext } from '../context/PortfolioContext' 
import {CryptoPriceContext} from '../context/CryptoPriceContext'
import { addressData } from '../DummyData'

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

const Setting = ({ navigation }) => {
    const [newAddress, setNewAddress] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [chain, setChain] = useState('ethereum');
    const {wallets, dispatch} = useContext(PortfolioContext);
    const walletAddresses = wallets.map(wallet => ({
        address: wallet.address,
        chain: wallet.chain
    }));

    //console.log('Setting: cryptoPrices= ', cryptoPrices);
    //console.log('Setting: wallet addresses= ', walletAddresses);

    const goBack = () => {setIsScanning(false)}

    const onAddButtonPress = () => {
        dispatch({
            type: 'ADD_ADDRESS', 
            payload: {
                chain,
                address: newAddress.toString()
            } 
        });
        setNewAddress(null);
        console.log('new address addes')
    }
    
    useEffect(() => {
        (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        })();
      }, []);
     
    return (
        <SafeAreaView style={{ backgroundColor: '#e6f7ff', flex: 1 }}>
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
                                        onPress={onAddButtonPress}
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
                                <Heading fontSize="xl" my="1">
                                    Wallet Addresses:{' '}
                                </Heading>
                                <Select
                                    selectedValue={chain}
                                    my='1'
                                    fontSize='xl'
                                    onValueChange={itemValue => setChain(itemValue)}
                                    _selectedItem={{
                                        fontSize: 'xl'
                                    }}
                                >
                                    <Select.Item label="Ethereum" value="ethereum" />
                                </Select>
                                
                                <ScrollView
                                    h="150"
                                    borderRadius="2"
                                    borderWidth="1"
                                    w='100%'
                                >
                                    {walletAddresses.map((addressData, idx) => (
                                        <Center
                                            key={addressData.address}    
                                            bg="gray.300"
                                            p="2"
                                            m="1"
                                            borderRadius="5"
                                        >
                                            {addressData.address}
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
