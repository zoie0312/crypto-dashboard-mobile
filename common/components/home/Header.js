import { Entypo } from "@expo/vector-icons";
import { HStack, Center, Text } from "native-base";
import React from "react";

const Header = ({ navigation, ...props }) => {
    return (
        <HStack
            alignItems="center"
            justifyContent="space-between"
            pr="5"
            pl="3"
            my="3"
        >
            <Text fontSize="3xl" fontWeight="500">
                My Portfolio
            </Text>

            <Center size="8" bg="trueGray.200" borderRadius="20">
                <Entypo
                    name="dots-three-horizontal"
                    size={16}
                    color="black"
                    onPress={() => navigation.navigate("Setting")}
                />
            </Center>
        </HStack>
    );
};

export default Header;
