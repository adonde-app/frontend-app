import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Button,
  Linking,
} from "react-native";
import { Overlay } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../api";

function AdCard({ data }) {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(false);
  const adClick = async () => {
    console.log(data.name, data.id, "click");
    setVisible(true);
    //조회수++
    try {
      const res = await axios.put(`${BASE_URL}/ad/updateView`, {
        id: data.id,
      });
      console.log("update views :", res.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TouchableOpacity onPress={adClick}>
      <View style={styles.container}>
        <View style={styles.card_template}>
          <View style={styles.card_flex_direction}>
            <Text style={styles.card_title_text}>
              <Entypo name="info-with-circle" style={styles.card_title_icon} />
            </Text>
            <Text style={styles.card_title_text}>{data.name}</Text>
          </View>
          <View style={styles.card_info_container}>
            <Image
              style={styles.card_image}
              source={data.img ? { uri: data.img } : null}
            />

            <View style={styles.card_des_container}>
              <Text style={styles.card_des_text}>{data.subject}</Text>
              <Text numberOfLines={2} style={styles.card_des_text}>
                {data.description}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <Overlay visible={visible}>
        <View style={styles.ad_overlay_container}>
          <Text style={styles.ad_overlay_title}>{data.name}</Text>
          <Text>{data.subject}</Text>
          <Image
            style={styles.ad_overlay_img}
            source={data.img ? { uri: data.img } : null}
          />

          <Text style={styles.ad_overlay_description}>{data.description}</Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(data.url);
            }}
          >
            <Text style={styles.ad_overlay_url}>{data.url}</Text>
          </TouchableOpacity>

          <Text style={styles.ad_overlay_company_name}>{data.comp_name}</Text>
          <Text style={styles.ad_overlay_company_email}>{data.comp_email}</Text>

          <Button title="x" onPress={() => setVisible(false)}></Button>
        </View>
      </Overlay>
    </TouchableOpacity>
  );
}
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  card_template: {
    width: screenWidth,
    height: 170,
    backgroundColor: "#E0F2F7",
    //그림자...
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.84,
    elevation: 1,
  },

  card_flex_direction: {
    flexDirection: "row",
  },

  card_title_text: {
    color: "black",
    padding: 8,
    fontSize: 20,
  },
  card_title_icon: { fontSize: 20 },
  card_info_container: {
    flexDirection: "row",
    marginLeft: 30,
    width: screenWidth - 40,
  },
  card_image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    flexShrink: 0,
  },
  card_des_container: {
    flexShrink: 1,
  },
  card_des_text: {
    margin: 15,
    fontSize: 15,
  },
  ad_overlay_container: {
    width: screenWidth - 20,
    padding: 15,
    paddingBottom: 0,
    alignItems: "center",
  },
  ad_overlay_title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 15,
  },
  ad_overlay_img: {
    width: 150,
    height: 150,
    margin: 10,
  },
  ad_overlay_description: {
    fontSize: 20,
  },
  ad_overlay_url: { color: "blue" },
  ad_overlay_company_name: {
    marginTop: 30,
    color: "grey",
    alignItems: "center",
  },
  ad_overlay_company_email: {
    color: "grey",
  },
});

export default AdCard;
