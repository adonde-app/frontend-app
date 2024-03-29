import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import SimpleCard from "../component/SimpleCard";
import axios from "axios";
import { BASE_URL } from "../api";
import { FontAwesome } from "@expo/vector-icons";
import { Button } from "react-native-paper";
//redux
import { connect } from "react-redux";
import { SET_STORED_CITIES } from "../redux/userSlice";

function Mypage({
  navigation,
  USER_DATA,
  USER_SOTRED_CITIES,
  SET_STORED_CITIES,
}) {
  const [user, setUser] = useState();
  //자식 comp로 전달하는 함수
  function storedCitiesChange(storedCities) {
    console.log("storedCitiesChange!!", storedCities);
    SET_STORED_CITIES(storedCities);
  }

  useEffect(() => {
    const getUserStoredCities = async () => {
      try {
        const res = await axios.post(`${BASE_URL}/user/findOneById`, {
          id: USER_DATA.id,
        });
        console.log("getUserStoredCities in mypage main", res.data);
        setUser(res.data);
        SET_STORED_CITIES(res.data.storedCities);
      } catch (error) {
        console.log(error);
      }
    };
    getUserStoredCities();
  }, [USER_DATA]);
  return user ? (
    <View style={styles.block}>
      <View style={styles.user_block}>
        {user.profile_image == "" ? (
          <FontAwesome name="user-circle-o" size={60} color="black" />
        ) : (
          <Image
            style={styles.profile_img}
            source={{
              uri: user.profile_image,
            }}
          />
        )}
        <Text style={styles.user_name_text}>{user.nickname}님</Text>
        <Text style={styles.user_email_text}>{user.email}</Text>
      </View>
      <ScrollView>
        {USER_SOTRED_CITIES.map((city_name) => (
          <SimpleCard name={city_name} key={city_name} />
        ))}
      </ScrollView>
    </View>
  ) : (
    <View style={styles.block}>
      <View style={styles.user_block}>
        <FontAwesome
          name="user-circle-o"
          style={{ fontSize: 60 }}
          color="black"
        />
        <Text style={{ margin: 20, fontWeight: "500" }}>
          로그인 후 사용해주세요!
        </Text>
        <Button
          textColor="#FFFFFF"
          buttonColor="#44AD5E"
          mode="contained-tonal"
          onPress={() => {
            navigation.push("Login");
          }}
          style={styles.login_btn}
        >
          로그인
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: "white",
  },
  user_block: {
    alignItems: "center",
    paddingVertical: 30,
    marginBottom: 10,
    backgroundColor: "#CEF6CE",
  },

  profile_img: {
    width: 100,
    height: 100,
    borderRadius: 30,
    marginBottom: 10,
  },
  user_name_text: {
    fontWeight: "700",
    fontSize: 18,
    margin: 7,
  },
  user_email_text: { fontWeight: "600" },
  login_btn: {
    marginBottom: 20,
  },
});

const mapStateToProps = (state, myOwnProps) => {
  console.log("mypage main get user", state.user.user_obj.user);
  console.log(
    "mypage main get user storedcities",
    state.user.user_storedCities
  );
  return {
    USER_DATA: state.user.user_obj.user,
    USER_SOTRED_CITIES: state.user.user_storedCities,
  };
};

const mapDispatchToProps = {
  SET_STORED_CITIES,
};

export default connect(mapStateToProps, mapDispatchToProps)(Mypage);
