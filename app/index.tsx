import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from '../../provider/AuthProvider'
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "../config/initSupabase";
import { FileObject } from "@supabase/storage-js";

export default function Index() {
  const [image, setImage] = useState<any>(null);
  const [name, onChangeName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [description, onChangeDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [bucketURL, setBucketURL] = useState("");
  // const [files, setFiles] = useState<FileObject[]>([])
  const [imageType, setImageType] = useState<any>("");
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     console.log(result.assets[0].base64);
  //     setImage(result.assets[0].uri);
  //     setImageType(result.assets[0].type);
  //   }
  // };
  const onPressSend = async () => {
    // ///upload uri to supabase
    // console.log(formData,image)
    // // const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
    // // const arrayBuffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;

    // // const response = await fetch(image);
    // // const blob = await response.blob();
    // const filePath = `${email}/${new Date().getTime()}.${imageType === 'image' ? 'png' : 'mp4'}`;
    // const contentType = imageType === 'image' ? 'image/png' : 'video/mp4';
    // await supabase.storage.from('files').upload(filePath, image, { contentType });
    // // Perform actions with the validated form data
    if (!selectedFile) return;
    setUploading(true);
    const filePath = `photos/${selectedFile.name}`;
    const { data, error } = await supabase.storage
      .from("ticket")
      .upload(filePath, selectedFile);
    if (error) {
      console.error("Error uploading photo:", error.message);
    } else {
      console.log("Photo uploaded successfully:", data);
      // set data.fullPath to photoURL value, then submit that, with the other entered values to
      // a table
      // setBucketURL(data)
      insertRow(data.fullPath);
      setSelectedFile(null);
      setUploading(false);
    }
  };

  const insertRow = async (photoURL: string) => {
    const { data, error } = await supabase
      .from("ticket-table")
      .insert([{ 
        name: `${name}`, 
        email: `${email}`,
        description: `${description}`,
        photoURL: photoURL,
      }]); 
      if (error) {
        console.error("Error inserting row:", error.message)
      } else {
        console.log("Success:", data)
      }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView contentContainerStyle={styles.container}>
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
          type="file"
          id="photoInput"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* <Button  title="Pick an image from camera roll" onPress={pickImage} /> */}
        {selectedFile && (
          <img
            style={{
              objectFit: "contain",
              width: 300,
              marginTop: 10,
              marginBottom: 10,
            }}
            src={URL.createObjectURL(selectedFile)}
            alt="Selected"
          />
        )}
        {/* <img src='https://sakovsazciadirzdbahs.supabase.co/storage/v1/object/public/ticket/photos/carved_logo.jpg'/> */}
        {/* {image && <Image source={{ uri: image }} style={styles.image} />} */}
        <Pressable style={styles.button} onPress={onPressSend}>
          <Text>Submit</Text>
        </Pressable>
        {uploading ? <Text>UPLOADING</Text> : <Text></Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
    // justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
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
  inputDescription: {
    height: 80,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#cfcfcf"
  },

});
