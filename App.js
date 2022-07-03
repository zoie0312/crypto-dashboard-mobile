import * as React from "react";
import RootNavigation from "./navigation";
import { NativeBaseProvider, Box } from "native-base";
import { LinearGradient } from 'expo-linear-gradient';

const config = {
  dependencies: {
    "linear-gradient": LinearGradient
  }
};

export default function App() {
  return (
    <NativeBaseProvider config={config}>
      <RootNavigation />
      </NativeBaseProvider>
    );
}


