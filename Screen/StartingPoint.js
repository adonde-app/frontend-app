import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Alert,
  Modal,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { Button } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

//출발지 data 불러오기
import { START_POINT_DATA, current_location_formatting } from "../utils/cities";
function StartingPoint({ navigation }) {
  //지도 state
  const [ok, setOk] = useState(true);
  const [address, SetAddress] = useState("loading...");
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  //출발지 설정 state
  const [modalVisible, setModalVisible] = useState(false);
  const [sido, setSido] = useState("");
  const [sido_sgg, setSido_sgg] = useState("");
  const [location, setLocation] = useState(null);

  //지도, 현재위치, 주소
  const getAddress = async () => {
    //허가 요청
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    //유저 위치 요청
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    //address 요청
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    updateRegion(latitude, longitude);

    console.log("location", location);
    setLocation(location[0]);

    SetAddress(location[0].region + ", " + location[0].city);
  };
  const updateRegion = (lat, long) => {
    const newRegion = { ...region };
    newRegion.latitude = lat;
    newRegion.longitude = long;
    setRegion(newRegion);
  };
  const checkMetropolitanCity = (sidoSigg) => {
    //특별시일 경우 *2 해서 return
    var pattern = /\s/g;
    if (sidoSigg.match(pattern)) {
      //특별시가 아님
      setSido_sgg(sidoSigg);
    } else {
      //특별시
      const tempCity = sidoSigg + " " + sidoSigg;
      setSido_sgg(tempCity);
    }
  };

  //현위치를 출발지로
  const CurrentLocationAsStart = async () => {
    console.log("현위치를 출발지로!");

    if (location.isoCountryCode == "KR") {
      // setSido_sgg("서울 서울");
      //현위치를 포멧팅 해줌

      setSido_sgg(
        current_location_formatting(
          location.city,
          location.region,
          location.subregion
        )
      );
    } else {
      alert("사용 가능한 범위를 벗어났습니다 :(");
      // formatting test
      // current_location_formatting("의정부시", "경기도", "null");
    }

    //주소 test
    const add = await Location.reverseGeocodeAsync(
      { latitude: 33.4996213, longitude: 126.5311884 },
      { useGoogleMaps: false }
    );
    // console.log("주소 test", add);
  };

  useEffect(() => {
    getAddress();
    // setSido("");
    // setSido_sgg("");
    checkMetropolitanCity(sido_sgg);
  }, [sido_sgg]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>
          <Entypo name="location-pin" style={{ fontSize: 20 }} color="black" />
          출발지 설정
        </Text>
        <MapView style={styles.map} region={region}>
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
          />
        </MapView>
        <View style={styles.current_location_box}>
          <View style={styles.location_arrow_back}>
            <FontAwesome5
              name="location-arrow"
              style={{ fontSize: 10 }}
              color="white"
            />
          </View>
          <Text style={styles.current_text}> {address}</Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>출발지를 선택하세요!</Text>
              <SelectList
                setSelected={(val) => setSido(val)}
                data={START_POINT_DATA}
                save="value"
                boxStyles={styles.select_box_style}
                dropdownStyles={styles.select_box_style}
              />
              {START_POINT_DATA.map((name, index) => {
                if (name["key"] == sido) {
                  return (
                    <View style={styles.select_sgg_view} key={index}>
                      <SelectList
                        key={index}
                        setSelected={(val) => {
                          setSido_sgg(val);
                          setModalVisible(!modalVisible);
                        }}
                        data={name["options"]}
                        save="value"
                        boxStyles={styles.select_box_style}
                        dropdownStyles={styles.select_box_style}
                      />
                    </View>
                  );
                }
              })}
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <AntDesign name="close" style={styles.modal_close_icon} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          {region.latitude != 0 ? (
            <Pressable
              onPress={() => CurrentLocationAsStart()}
              style={styles.current_btn}
            >
              <Text style={styles.textStyle}>현위치를 출발지로</Text>
            </Pressable>
          ) : null}
          <TouchableOpacity
            style={styles.select_location_btn}
            onPress={() => [
              setModalVisible(true),
              setSido(""),
              setSido_sgg(""),
            ]}
          >
            <Text style={styles.select_location_text}>출발지 선택</Text>
          </TouchableOpacity>
        </View>

        {sido_sgg != " " ? (
          <Text style={{ alignSelf: "center", fontSize: 17 }}>
            출발지 : {sido_sgg}
          </Text>
        ) : null}
      </View>

      <View style={styles.next_btn_view}>
        <Button
          textColor="#FFFFFF"
          buttonColor="#44AD5E"
          mode="contained-tonal"
          onPress={() =>
            sido_sgg == " "
              ? Alert.alert("출발지를 선택하세요")
              : navigation.push("Filter", { origin: sido_sgg })
          }
        >
          Next
        </Button>
      </View>
    </SafeAreaView>
  );
}
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
//green
// const MODAL_BACK_COLOR = "#7C8257";
// const MODAL_SELECT_BACK_COLOR = "#EBECE2";
//blue
const MODAL_BACK_COLOR = "#145D6F";
const MODAL_SELECT_BACK_COLOR = "#E9EFFF";

// const MODAL_BACK_COLOR = "#F2FCF3";
// const MODAL_SELECT_BACK_COLOR = "#E9EFFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  box: {
    paddingHorizontal: 20,
    // paddingVertical: 20,
  },
  text: {
    alignSelf: "center",
    padding: 16,
    fontSize: 18,
  },
  map: {
    width: screenWidth - 40,
    height: 300,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: MODAL_BACK_COLOR,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  current_location_box: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  location_arrow_back: {
    backgroundColor: "#2E64FE",
    padding: 7,
    borderRadius: 20,
    width: 25,
    height: 25,
  },
  current_text: {
    fontSize: 20,
    margin: 5,
    alignSelf: "center",
  },
  current_btn: {
    borderRadius: 10,
    padding: 20,
    backgroundColor: "#44AD5E",
  },

  select_location_btn: {
    borderRadius: 10,
    padding: 20,
    marginLeft: 10,

    backgroundColor: "#44AD5E",
  },
  select_location_text: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  select_sgg_view: {
    marginTop: 10,
  },
  select_box_style: {
    backgroundColor: MODAL_SELECT_BACK_COLOR,
    borderColor: MODAL_SELECT_BACK_COLOR,
    width: screenWidth / 2,
  },

  modal_close_icon: {
    color: "#E9EFFF",
    fontSize: 20,
    alignSelf: "center",
    marginTop: 15,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#E9EFFF",
  },
  next_btn_view: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
  },
  loading: { fontSize: 10, marginLeft: 10 },
});

export default StartingPoint;
