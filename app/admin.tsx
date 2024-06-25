import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { TextInput } from "react-native-gesture-handler";
import { supabase } from "../config/initSupabase";
import { useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import TicketResponseEmailModal from "@/components/TicketResponseEmailModal";

type Item = {
  id: string;
  name: string;
  email: string;
  description: string;
  photoURL: string;
  status: number;
};

// const ItemComponent = React.memo(({ item, updateItemStatus }: { item: Item; updateItemStatus: (id: string, status: number) => void }) => (
//   <View style={styles.itemContainer}>
//     <View>
//       <Text>
//         Status:
//         {item.status === 1 && <Text> New</Text>}
//         {item.status === 2 && <Text> In Progress</Text>}
//         {item.status === 3 && <Text> Resolved</Text>}
//       </Text>
//     </View>
//     <Picker
//       selectedValue={item.status}
//       onValueChange={(itemValue) => updateItemStatus(item.id, itemValue)}
//     >
//       <Picker.Item label="New" value={1} />
//       <Picker.Item label="In Progress" value={2} />
//       <Picker.Item label="Resolved" value={3} />
//     </Picker>
//     <Text>Name: {item.name}</Text>
//     <Text>Email: {item.email}</Text>
//     <Text>Description: {item.description}</Text>
//     <Image
//       source={{
//         uri: `https://sakovsazciadirzdbahs.supabase.co/storage/v1/object/public/${item.photoURL}`,
//       }}
//       style={{ width: 400, height: 400 }}
//     />
//   </View>
// ));

const admin = () => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const itemsRef = useRef<{ [key: string]: Item }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [password, onChangePassword] = useState<string>("");
  const [authenticated, setAuthenticated] = useState(false);
  const [responseData, setResponseData] = useState<Item[]>([]);
  const [responseEmail, setResponseEmail] = useState<string>("");
  const closeModal = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    if (password == "admin") {
      setAuthenticated(true);
    }
  }, [password]);

  useFocusEffect(
    useCallback(() => {
      // Your fetch data function
      const fetchData = async () => {
        const { data, error } = await supabase.from("ticket-table").select();
        if (error) {
          console.error(error);
        } else {
          const sortedData = data.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          setResponseData(sortedData);
          data.forEach((item) => {
            itemsRef.current[item.id] = item;
          });
        }
      };

      fetchData();

      // Optional: Return a cleanup function if needed
      return () => {
        // Any cleanup code
      };
    }, [])
  );
  type Item = {
    id: string; // or number
    name: string;
    email: string;
    description: string;
    photoURL: string;
    status: number;
  };
  const updateItemStatus = async (itemId: string, newStatus: number) => {
    // Update local state
    setResponseData((prevItem: any) =>
      prevItem.map((item: any) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );

    // Update Supabase
    const { data, error } = await supabase
      .from("ticket-table")
      .update({ status: newStatus })
      .eq("id", itemId);

    if (error) {
      console.error("Error updating status in Supabase:", error);
      // Optionally, revert the local state change if the update failed
    } else {
      console.log(data);
    }
  };

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.inlineRow}>
        <Text style={styles.containerText}>
          Status:
          {/* {item.status === 1 && <Text> New</Text>}
          {item.status === 2 && <Text> In Progress</Text>}
          {item.status === 3 && <Text> Resolved</Text>} */}
        </Text>
        <Picker
          selectedValue={item.status}
          onValueChange={(itemValue) => updateItemStatus(item.id, itemValue)}
        >
          <Picker.Item label="New" value={1} />
          <Picker.Item label="In Progress" value={2} />
          <Picker.Item label="Resolved" value={3} />
        </Picker>
      </View>

      <Text style={styles.containerText}>Name: {item.name}</Text>
      <Text style={styles.containerText}>Email: {item.email}</Text>
      <Text style={styles.containerText}>Description: {item.description}</Text>
      <Image
        source={{
          uri: `https://sakovsazciadirzdbahs.supabase.co/storage/v1/object/public/${item.photoURL}`,
        }}
        style={{ width: 300, height: 300, padding: 20, marginBottom: 20 }}
      />
      <Pressable
        style={styles.button}
        onPress={() => {
          setResponseEmail(item.email);
          setModalVisible(true);
        }}
      >
        <Text style={styles.textStyle}>Respond</Text>
      </Pressable>
      <TextInput />
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TicketResponseEmailModal
          email={responseEmail}
          closeModal={closeModal}
        />
      </Modal>
      {/* <ScrollView contentContainerStyle={styles.container}> */}
      <Text style={styles.headerText}>Admin Pannel</Text>
      {/* <ActivityIndicator /> */}
      <FlatList
        data={responseData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      {/* {!authenticated ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Password!"
            onChangeText={(newText) => onChangePassword(newText)}
            defaultValue={password}
          />
        </>
      ) : (
        <>
            <FlatList
      data={responseData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />

        </>
      )} */}
      {/* </ScrollView> */}
    </ScrollView>
  );
};

export default admin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
    // justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerText: {
    fontSize: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#cfcfcf"
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
