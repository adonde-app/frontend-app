import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Linking, Dimensions, ScrollView } from "react-native";
import axios from "axios";
import { OPEN_WEARHER_API_KEY, TEMP_BASE_URL } from "../api";
import { Ionicons } from "@expo/vector-icons";

function WeatherWidget({ lat, long }) {
  const [weatherResult, SetWeatherResult] = useState({
    temp: 10,
    hum: 50,
    icon: 1,
  });
  const route = useRoute();

  const getTemp = async (lat, long) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${OPEN_WEARHER_API_KEY}&units=metric&lang=kr`;
    // console.log("getTemp var xy value --------------------", x, y);
    axios
      .get(url)
      .then((responseData) => {
        console.log(responseData.data.weather[0].icon);
        SetWeatherResult({
          temp: Math.round(responseData.data.main.temp),
          hum: responseData.data.main.humidity,
          icon: responseData.data.weather[0],
        });
      })
      .catch((error) => console.log(error));
    // const iconURL = `http://openweathermap.org/img/wn/${responseData.data.weather[0].icon}@2x.png`;
    console.log(weatherResult);
  };

  useEffect(() => {
    console.log("component------", lat, long);
    getTemp(lat, long);
  }, []);

  return (
    <View style={styles.block}>
      <Text style={styles.text_weather}>온도 {weatherResult["temp"]}°C</Text>
      <Text style={styles.text_weather}>습도 {weatherResult["hum"]}%</Text>
      <Image
        style={styles.text_weather_icon}
        source={{
          url: `http://openweathermap.org/img/wn/${weatherResult["icon"]}@2x.png`,
        }}
      />
    </View>
  );
}
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  block: {
    // paddingHorizontal: 40,
    // paddingVertical: 40,
    // width: screenWidth - 80,
    backgroundColor: "blue",
    flexDirection: "row",
    borderRadius: 10,
    justifyContent: "space-evenly",
  },
  text_weather: {
    color: "white",
    margin: 5,
    padding: 5,
    fontSize: 16,
  },
  text_weather_icon: {
    width: 30,
    height: 30,
  },
});

export default WeatherWidget;
