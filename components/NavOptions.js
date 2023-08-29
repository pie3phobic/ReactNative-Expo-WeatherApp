import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import tw from "twrnc";
import { Icon } from "react-native-elements/dist/icons/Icon";
const date = new Date();
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekday = weekdays[date.getDay()];
import cloudyImage from "../cloud-with-no-bg.png";
import sunnyImage from "../sun-with-no-bg.png";
import rainyImage from "../rain-with-no-bg.png";
import overcastImage from "../overcast-with-no-bg.png";
import thunderstormImage from "../thunderstorm-with-no-bg.png";
import { useSelector } from "react-redux";
const NavOptions = () => {
  const [data, setData] = useState([]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const today = new Date();
  const startDate = formatDate(today);
  const next15Days = new Date(today);
  next15Days.setDate(next15Days.getDate() + 15);
  const endDate = formatDate(next15Days);
  const city = useSelector((state) => state.nav.origin) || "Kyiv";
  console.log(startDate, endDate, city.location);
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (city && city.location) {
      fetchData();
    }
  }, [city.location]);
  const fetchData = () => {
    fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city.location}/${startDate}/${endDate}?unitGroup=metric&include=days&key=${process.env.API_KEY}&contentType=json`
    )
      .then((response) => response.json())
      .then((responseData) => setData(responseData))
      .catch((error) => console.error(error));
  };
  return (
    <View style={tw`mx-6`}>
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-gray-400 text-base font-semibold pt-2`}>
          2 Weeks
        </Text>
        <Icon
          style={tw`h-6 mx-0 mt-2`}
          name="right"
          color="gray"
          type="antdesign"
        />
      </View>
      <FlatList
        data={data.days}
        horizontal
        renderItem={({ item, index }) => {
          let imageSource;
          if (item.icon.includes("cloudy")) {
            imageSource = cloudyImage;
          } else if (item.icon.includes("sunny")) {
            imageSource = sunnyImage;
          } else if (item.icon.includes("rain")) {
            imageSource = rainyImage;
          } else if (item.icon.includes("overcast")) {
            imageSource = overcastImage;
          } else if (item.icon.includes("tstorm")) {
            imageSource = thunderstormImage;
          } else {
          }
          return (
            <TouchableOpacity
              style={[
                tw`mt-2 border border-gray-700 mr-4 rounded-3xl bg-gray-900`,
              ]}
            >
              <View style={tw`items-center`}>
                <Text style={tw`text-gray-400 pt-2 text-sm font-light`}>
                  {item.temp}°C
                </Text>
                <Image style={{ width: 75, height: 75 }} source={imageSource} />
                <Text style={tw`mt-2 text-gray-400 text-sm pb-2 font-light`}>
                  {weekdays[(weekdays.indexOf(weekday) + index) % 7]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default NavOptions;
