import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function BottomTabs({navigation, ...props}) {
  return (
    <View
      style={{
        flexDirection: "row",
        margin: 10,
        marginHorizontal: 30,
        justifyContent: "space-between",
      }}
    >
      <Icon icon="chart-pie" text="Portfolio" onPress={() => navigation.navigate('Home')}/>
      <Icon icon="bitcoin" text="Market" />
      <Icon icon="search" text="NFT" />
      <Icon icon="user" text="Setting" onPress={() => navigation.navigate('Setting')}/>
    </View>
  );
}

const Icon = (props) => (
  <TouchableOpacity
    onPress={props.onPress}
  >
    <View>
      <FontAwesome5
        name={props.icon}
        size={25}
        style={{
          marginBottom: 3,
          alignSelf: "center",
        }}
      />
      <Text>{props.text}</Text>
    </View>
  </TouchableOpacity>
);
