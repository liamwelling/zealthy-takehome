import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { Image } from "expo-image";

import { supabase } from "../config/initSupabase";

export default function Index() {
  const [name, onChangeName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [description, onChangeDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onPressSend = async () => {
    // uploads file to supabase storage bucket then
    // returns "fullPath" (the stored photo's URL) value from upload that is then
    // passed to the insertRow function, sending name, email, description,
    // and the file url to the "ticket-table" in the database
    if (!selectedFile) return;
    setUploading(true);
    const filePath = `photos/${selectedFile.name}`;
    const { data, error } = await supabase.storage
      .from("ticket")
      .upload(filePath, selectedFile);
    if (error) {
      console.error("Error uploading photo:", error.message);
      setUploading(false);
    } else {
      console.log("Photo uploaded successfully:", data);
      insertRow(data.fullPath);
      setSelectedFile(null);
      setUploading(false);
    }
  };

  const insertRow = async (photoURL: string) => {
    const { data, error } = await supabase.from("ticket-table").insert([
      {
        name: `${name}`,
        email: `${email}`,
        description: `${description}`,
        photoURL: photoURL,
      },
    ]);
    if (error) {
      console.error("Error inserting row:", error.message);
    } else {
      console.log("Success:", data);
      Alert.alert("Ticket Submitted Successfully");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.headerText}>Submit A Ticket</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Enter your Name."
      />

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={onChangeEmail}
        placeholder="Enter your Email."
      />

      <TextInput
        style={styles.inputDescription}
        onChangeText={onChangeDescription}
        value={description}
        placeholder="Describe your issue."
        multiline
      />
      <input
        style={{ marginBottom: 10 }}
        type="file"
        id="photoInput"
        accept="image/*"
        onChange={handleFileChange}
      />

      {selectedFile && (
        <Image
          style={styles.image}
          source={URL.createObjectURL(selectedFile)}
          alt="Selected"
        />
      )}
      <Pressable
        style={[styles.button, { marginBottom: 10 }]}
        onPress={onPressSend}
      >
        <Text>Submit</Text>
      </Pressable>
      {uploading ? <ActivityIndicator /> : <></>}
      {success && <Text>Ticket successfully submitted.</Text>}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputDescription: {
    height: 80,
    width: 250,
    margin: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#cfcfcf",
  },
});
