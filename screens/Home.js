import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider } from "native-base";
import BottomTabs from "../components/home/BottomTabs";
import Categories from "../components/home/Categories";
import HeaderTabs from "../components/home/HeaderTabs";
import Header from '../components/home/Header';
import RestaurantItems, {
  localRestaurants,
} from "../components/home/RestaurantItems";
import SearchBar from "../components/home/SearchBar";
import MainSection from "../components/home/MainSection";
import NFTSection from "../components/home/NFTSection";
import WalletSection from "../components/home/WalletSection";

const YELP_API_KEY =
  "bdRJutLhFAQJ36t7b89CWjHFBU4OKzjt9wvZzcY-nkgmvTqlNMjZWV1eG7iBQ9R74SyfxRg9LWnBAkZY06BtAZAe4d2dfX-2vuX8a1l5V7foctHfX9UKEyoM5ts3YXYx";

export default function Home({ navigation }) {
  const [restaurantData, setRestaurantData] = useState(localRestaurants);
  const [city, setCity] = useState("San Francisco");
  const [activeTab, setActiveTab] = useState("Delivery");

  const getRestaurantsFromYelp = () => {
    const yelpUrl = `https://api.yelp.com/v3/businesses/search?term=restaurants&location=${city}`;

    const apiOptions = {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      },
    };

    return fetch(yelpUrl, apiOptions)
      .then((res) => res.json())
      .then((json) => {
        console.log('json ', json);
        console.log(json.businesses);
        json.businesses && setRestaurantData(
             json.businesses.filter((business) =>
            business.transactions.includes(activeTab.toLowerCase())
          )
        )
      });
  };

  useEffect(() => {
    getRestaurantsFromYelp();
  }, [city, activeTab]);

  return (
    <SafeAreaView style={{ backgroundColor: "#eee", flex: 1 }}>
      <View >
        {/* <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <SearchBar cityHandler={setCity} /> */}
        <Header/>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MainSection/>
        <NFTSection/>
        <WalletSection/>
        {/* <Categories />
        <RestaurantItems
          restaurantData={restaurantData}
          navigation={navigation}
        /> */}
      </ScrollView>
      <Divider width={1} />
      <BottomTabs />
    </SafeAreaView>
  );
}
