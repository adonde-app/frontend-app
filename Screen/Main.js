import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home";
import StartingPoint from "./StartingPoint";
import Filter from "./Filter";
import Result from "./Result";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Details from "./Details";
//redux
import { connect } from "react-redux";
import { SET_MAP_ICON } from "../redux/userSlice";

const Stack = createNativeStackNavigator();

function Main({ MAP_ICON_DATA, SET_MAP_ICON }) {
  const navigation = useNavigation();
  const [mapIcon, setMapIcon] = useState(true);

  const clickMapIcon = () => {
    SET_MAP_ICON(!MAP_ICON_DATA);
  };
  useEffect(() => {}, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="Start"
        component={StartingPoint}
        options={{
          headerTitle: "출발지 설정",
          // headerBackTitle: "home",
          headerBackTitleVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      /> */}
      {/* <Stack.Screen
        name="Filter"
        component={Filter}
        options={{
          // headerShown: false,
          headerTitle: "",
          headerBackTitle: "start",
          // headerBackTitleVisible: false,
          headerLargeTitleShadowVisible: false,
        }}
      /> */}
      {/* <Stack.Screen
        name="Result"
        component={Result}
        options={({ navigation }) => ({
          headerTitle: "",
          headerBackTitle: "filter",
          // headerBackTitleVisible: false,
          headerLargeTitleShadowVisible: false,
          headerRight: () => (
            <Entypo
              name={MAP_ICON_DATA ? "map" : "list"}
              style={{ fontSize: 23 }}
              color="black"
              onPress={clickMapIcon}
            />
          ),
        })}
      /> */}
      <Stack.Screen name="Detail" component={Details} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  block: {},
  text: {
    padding: 16,
    fontSize: 24,
  },
});

const mapStateToProps = (state, myOwnProps) => {
  return {
    MAP_ICON_DATA: state.user.mapIcon,
  };
};

const mapDispatchToProps = {
  SET_MAP_ICON,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
