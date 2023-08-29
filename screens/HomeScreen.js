import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import NavOptions from "../components/NavOptions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setOrigin, setDestination } from "../slices/navSlice";
import { FlatList, VirtualizedList } from "react-native-web";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [dataToday, setDataToday] = useState([]);
  const dayOfWeekDigit = new Date().getDay();
  const dayOfWeekName = new Date().toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const city = useSelector((state) => state.nav.origin) || "Kyiv";
  useEffect(() => {
    fetchDataToday();
  }, []);
  useEffect(() => {
    if (city && city.location) {
      fetchDataToday();
    }
  }, [city.location]);
  const fetchDataToday = () => {
    fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city.location}/today?unitGroup=metric&include=days&key=${process.env.API_KEY}&contentType=json`
    )
      .then((response) => response.json())
      .then((responseData) => setDataToday(responseData))
      .catch((error) => console.error(error));
  };
  console.log("DataToday");
  console.log(dataToday);
  return (
    <SafeAreaView style={[tw`h-full w-full`, { backgroundColor: "#000B19" }]}>
      {/* <ScrollView> */}
      <View
        style={[
          tw`p-5 items-center rounded-b-3xl`,
          ,
          { backgroundColor: "#3EABE4" },
        ]}
      >
        <View
          style={[
            tw`py-12 h-[300px] w-full z-100`,
            { backgroundColor: "#3EABE4" },
          ]}
        >
          <GooglePlacesAutocomplete
            placeholder="Kyiv"
            styles={{
              container: {
                zIndex: 100,
              },
              textInput: {
                fontSize: 18,
              },
            }}
            onPress={(data, details = null) => {
              dispatch(
                setOrigin({
                  location: data.structured_formatting.main_text,
                })
              );
              console.log(data.structured_formatting.main_text);
            }}
            fetchDetails={true}
            enablePoweredByContainer={false}
            minLength={2}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
          />
        </View>
        <View style={tw`items-center border-b border-gray-200`}>
          {/* <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
            }}
            source={require("../3d-rain.png")}
          /> */}
          <Text style={tw`text-7xl text-white`}>
            {dataToday.days[0].temp}°C
          </Text>
          <Text style={tw`text-3xl font-semibold text-white`}>
            {dataToday.days[0].conditions.toLowerCase()}
          </Text>
          <Text style={tw`text-white font-light pb-4`}>{dayOfWeekName}</Text>
        </View>
        <View style={tw`flex-row justify-between`}>
          <View style={tw`flex-1 items-center`}>
            <Image
              style={tw`w-6 h-6 mt-4`}
              source={require("../wind-icon-no-bg.png")}
            />
            <Text style={tw`text-white font-semibold`}>
              {dataToday.days[0].windspeed}km/h
            </Text>
            <Text style={tw`text-gray-300 font-light`}>Wind</Text>
          </View>
          <View style={tw`flex-1 items-center`}>
            <Icon
              style={tw`w-16 mt-4`}
              name="cloud"
              color="white"
              type="antdesign"
            />
            <Text style={tw`text-white font-semibold`}>
              {dataToday.days[0].humidity}%
            </Text>
            <Text style={tw`text-gray-300 font-light`}>Humidity</Text>
          </View>
          <View style={tw`flex-1 items-center`}>
            <Icon
              style={tw`w-10 mt-4`}
              name="dashboard"
              color="white"
              type="antdesign"
            />
            <Text style={tw`text-white font-semibold`}>
              {dataToday.days[0].pressure}kPa
            </Text>
            <Text style={tw`text-gray-300 font-light`}>Pressure</Text>
          </View>
        </View>
      </View>
      <NavOptions />
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  text: {
    color: "blue",
  },
});
