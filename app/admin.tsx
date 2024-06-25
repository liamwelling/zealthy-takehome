import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  TextInput 
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import { supabase } from "../config/initSupabase";
import { useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import TicketResponseEmailModal from "@/components/TicketResponseEmailModal";

const admin = () => {
  const itemsRef = useRef<{ [key: string]: Item }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [password, onChangePassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [responseData, setResponseData] = useState<Item[]>([]);
  const [responseEmail, setResponseEmail] = useState<string>("");
  const closeModal = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    if (password.toLowerCase() == "admin" ) {
      setAuthenticated(true);
    }
  }, [password]);

  useFocusEffect(
    useCallback(() => {
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
    }, [])
  );
  type Item = {
    id: string; 
    name: string;
    email: string;
    description: string;
    photoURL: string;
    status: number;
  };
  const updateItemStatus = async (itemId: string, newStatus: number) => {
    setResponseData((prevItem: Item[]) =>
      prevItem.map((item: Item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
    const { data, error } = await supabase
      .from("ticket-table")
      .update({ status: newStatus })
      .eq("id", itemId);

    if (error) {
      console.error("Error updating status in Supabase:", error);
    } else {
      console.log(data);
    }
  };

  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.inlineRow}>
        <Text style={styles.containerText}>
          Status:
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
        style={styles.image}
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
      
    </View>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
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
      <Text style={styles.headerText}>Admin</Text>
 
      {!authenticated ? (
       
          <TextInput
            style={styles.input}
            placeholder="Enter Password!"
            onChangeText={onChangePassword}
            value={password}
        
          />
  
      ) : (
        <>
      <FlatList
      
        data={responseData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

        </>
      )}
    </ScrollView>
  );
};

export default admin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  headerText: {
    fontSize: 30,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
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
    flexDirection: 'column',
    flexWrap: 'wrap',
    maxWidth: "auto"
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
    backgroundColor: "#cfcfcf",
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 200,
    padding: 20,
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
  }
});
