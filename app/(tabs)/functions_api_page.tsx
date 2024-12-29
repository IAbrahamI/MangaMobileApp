import React, { useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { addManga } from "@/api/api";

export default function ManageMangas() {
  const [mangaName, setMangaName] = useState("");
  const [message, setMessage] = useState("");

  const handleAddManga = async () => {
    try {
      if (!mangaName || typeof mangaName !== "string") {
        setMessage("Please enter a valid manga name.");
        return;
      }

      // Pass the mangaName directly as a string
      await addManga(mangaName);
      setMessage("Manga added successfully!");
      setMangaName(""); // Clear the input after adding
    } catch (error) {
      setMessage("Failed to add manga.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Manga</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.instructions}>Enter manga name to add</Text>
        <View style={styles.actionContainer}>
          <TextInput
            style={styles.input}
            placeholder="Manga Name"
            placeholderTextColor="#aaa"
            value={mangaName}
            onChangeText={setMangaName}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddManga}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {message && <Text style={styles.message}>{message}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center", // Center everything vertically
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    marginTop: -60, // Moves the title slightly up relative to the center
  },
  contentContainer: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderColor: "#333333",
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  instructions: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: "#fff",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "green",
    textAlign: "center",
    marginTop: 16,
  },
});
