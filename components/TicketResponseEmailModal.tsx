import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

interface TicketResponseEmailProps {
  closeModal: () => void;
  email: string;
}
const TicketResponseEmailModal: React.FC<TicketResponseEmailProps> = ({
  closeModal,
  email,
}) => {
  const [responseEmail, onChangeResponseEmail] = useState("");
  const sendEmail = () => {
    console.log(
      `Would normally send email here mailto:${email} body:${responseEmail}`
    );
     closeModal();
  };

  return (
    <ScrollView contentContainerStyle={styles.centeredView}>
      <View style={styles.modalView}>
      <Pressable onPress={closeModal}   style={styles.button}>
            <Text>Close Modal</Text>
          </Pressable>
      
        <TextInput
          style={styles.input}
          onChangeText={onChangeResponseEmail}
          value={responseEmail}
          placeholder={`Send a response email to ${email}`}
          multiline
        />
        <Pressable
          style={styles.button}
          onPress={sendEmail}
        >
          <Text>Submit</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default TicketResponseEmailModal;

const styles = StyleSheet.create({
  centeredView: {
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    padding: 35,
    width: '100%', 
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
  input: {
    height: 400,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#808080"
  },

  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
  },
});
