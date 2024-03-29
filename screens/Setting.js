import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera, CameraType } from "expo-camera";
import {
    HStack,
    Text,
    VStack,
    Heading,
    ScrollView,
    AddIcon,
    TextArea,
    Button,
    IconButton,
    Icon,
    ArrowBackIcon,
    Select,
} from "native-base";
import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";

import { api } from "../app/services/api";
import BottomTabs from "../common/components/home/BottomTabs";
import { addWallet, removeWallet } from "../features/portfolio/portfolioSlice";
//import { addressData } from '../common/utils/DummyData'

const QRCodeScanComponent = (props) => {
    return (
        <VStack flex="1" space="5">
            <ArrowBackIcon size="7" m="5" onPress={props.goBack} />
            <Camera
                style={{ flex: 2 }}
                type={CameraType.back}
                barCodeScannerSettings={{
                    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
                }}
                onBarCodeScanned={(...args) => {
                    Alert.alert("Aaddress scanned", args[0].data, [
                        {
                            text: "Ok",
                            onPress: () => props.goBack(),
                            style: "ok",
                        },
                    ]);
                    props.setNewAddress(args[0].data);
                }}
            />
            <VStack flex="1" />
        </VStack>
    );
};

const Setting = ({ navigation }) => {
    const [newAddress, setNewAddress] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [chain, setChain] = useState("ethereum");
    const wallets = useSelector((state) => state.portfolio.wallets);
    const dispatch = useDispatch();
    const walletAddresses = wallets.map((wallet) => ({
        address: wallet.address,
        chain: wallet.chain,
    }));

    const goBack = () => {
        setIsScanning(false);
    };

    const onAddButtonPress = () => {
        dispatch(addWallet({ chain, address: newAddress.toString() }));
        setNewAddress(null);
    };

    const removeAddress = (address) => {
        const addressText = address.toString();
        dispatch(removeWallet({ chain, address: addressText }));
        dispatch(
            api.util.updateQueryData(
                "getNfts",
                addressText,
                (draftNfts) => (draftNfts = null)
            )
        );
        dispatch(
            api.util.updateQueryData(
                "getTokenBalance",
                addressText,
                (draftTokenBalance) => (draftTokenBalance = null)
            )
        );
        dispatch(
            api.util.updateQueryData(
                "getNativeTokenBalance",
                addressText,
                (draftNativeTokenBalance) => (draftNativeTokenBalance = null)
            )
        );
    };

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: "#e6f7ff", flex: 1 }}>
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
            {isScanning && hasPermission ? (
                <QRCodeScanComponent
                    goBack={goBack}
                    setNewAddress={setNewAddress}
                />
            ) : (
                <VStack flex="1" justifyContent="space-between">
                    <VStack flex="7">
                        <VStack p="3">
                            <Text fontSize="lg">New address,</Text>
                            <TextArea
                                placeholder="長按以貼上"
                                h="16"
                                value={newAddress}
                                onChangeText={(msg) => {
                                    setNewAddress(msg);
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

                        <VStack p="3">
                            <Heading fontSize="xl" my="1">
                                Wallet Addresses:{" "}
                            </Heading>
                            <Select
                                selectedValue={chain}
                                my="1"
                                fontSize="xl"
                                onValueChange={(itemValue) =>
                                    setChain(itemValue)
                                }
                                _selectedItem={{
                                    fontSize: "xl",
                                }}
                            >
                                <Select.Item
                                    label="Ethereum"
                                    value="ethereum"
                                />
                            </Select>

                            <ScrollView
                                h="150"
                                borderRadius="2"
                                borderWidth="1"
                                w="100%"
                            >
                                {walletAddresses.map((addressData, idx) => (
                                    <HStack
                                        key={addressData.address}
                                        p="1"
                                        m="1"
                                        bg="gray.300"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        borderRadius="10"
                                    >
                                        <Text fontSize="xs">
                                            {addressData.address}
                                        </Text>
                                        <IconButton
                                            icon={
                                                <Icon
                                                    size="sm"
                                                    as={FontAwesome5}
                                                    name="trash-alt"
                                                    color="white"
                                                />
                                            }
                                            onPress={() => {
                                                removeAddress(
                                                    addressData.address
                                                );
                                            }}
                                        />
                                    </HStack>
                                ))}
                            </ScrollView>
                        </VStack>
                    </VStack>
                    <VStack flex="1">
                        <BottomTabs navigation={navigation} />
                    </VStack>
                </VStack>
            )}
        </SafeAreaView>
    );
};

export default Setting;
