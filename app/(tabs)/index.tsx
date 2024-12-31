import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Linking,
  Image,
  RefreshControl,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  View,
  TextInput,
  Dimensions,
  ActivityIndicator, // Make sure to import ActivityIndicator
} from "react-native";
import { format } from "date-fns";
import { fetchMangas, addManga, removeManga, updateMangas } from "@/api/api"; // Add removeManga to API
import Icon from "react-native-vector-icons/MaterialIcons"; // Import trash can icon

const { height } = Dimensions.get("window");

export default function MangaList() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [mangaName, setMangaName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMangasData();
  }, []);

  const fetchMangasData = async () => {
    setLoading(true);
    try {
      const fetchedMangas = await fetchMangas();
      setMangas(fetchedMangas);
      setError(null);
    } catch (error) {
      setError("Failed to fetch mangas");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handles the scroll down refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchMangasData();
  };

  const handleReload = async () => {
    try {
      console.log("Reload started...");
      setLoading(true);
      await updateMangas();
      fetchMangasData();
      setMessage("Mangas updated successfully!");
      console.log("Reload successful!");
    } catch (error) {
      console.log("Reload failed:", error);
      setMessage("Failed to update mangas.");
    } finally {
      setLoading(false);
      console.log("Reload finished.");
    }
  };

  const handleAddButtonPress = () => {
    setModalVisible(true);
  };

  const handleAddManga = async () => {
    try {
      if (!mangaName || typeof mangaName !== "string") {
        setMessage("Please enter a valid manga name.");
        return;
      }
      await addManga(mangaName);
      setMessage("Manga added successfully!");
      setMangaName("");
    } catch (error) {
      setMessage("Failed to add manga.");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setMessage(""); // Reset message when closing the modal
  };

  const handleRemoveManga = async (mangaName: string) => {
    try {
      await removeManga(mangaName);
      setMangas((prevMangas) =>
        prevMangas.filter((manga) => manga[2] !== mangaName)
      );
    } catch (error) {
      setMessage("Failed to remove manga.");
    }
  };

  if (error) {
    return <Text>{error}</Text>;
  }

  // Sort mangas by latest update date (descending order)
  const sortedMangas = [...mangas].sort((a, b) => {
    const dateA = new Date(a[12]).getTime();
    const dateB = new Date(b[12]).getTime();
    return dateB - dateA;
  });

  return (
    <View style={styles.container}>
      {/* Modal for Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal_main_view_container}>
            <Text style={styles.modal_title}>Add Manga</Text>
            <View style={styles.modal_contentContainer}>
              <Text style={styles.modal_instructions}>
                Enter manga name to add
              </Text>
              <View style={styles.modal_actionContainer}>
                <TextInput
                  style={styles.modal_input}
                  placeholder="Manga Name"
                  placeholderTextColor="#aaa"
                  value={mangaName}
                  onChangeText={setMangaName}
                />
                <TouchableOpacity
                  style={styles.modal_addButton}
                  onPress={handleAddManga}
                >
                  <Text style={styles.modal_buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
              {message && <Text style={styles.modal_message}>{message}</Text>}
            </View>
            <Pressable style={styles.modalButton} onPress={handleCloseModal}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Top Container */}
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.reloadButton} onPress={handleReload}>
          <Icon name="refresh" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Manga List</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddButtonPress} 
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      {/* Loader Container with transparent background */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor="black"
            colors={["white"]}
          />
        }
      >
        {sortedMangas.map((manga) => {
          const dateStr = manga[12];
          const date = new Date(dateStr);
          const readableDate = format(date, "MM/dd/yyyy HH:mm");
          return (
            <View key={manga[0]} style={styles.mangaItem}>
              <View style={styles.mangaContent}>
                <Image
                  source={{ uri: String(manga[3]) }}
                  style={styles.mangaImage}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{manga[2]}</Text>
                  <Text style={styles.mangaStatus}>Status: {manga[5]}</Text>
                  <Text style={styles.latestChapters}>
                    Latest chapter: {manga[10]}
                  </Text>
                  <Text style={styles.latestReleaseDate}>
                    Latest Update: {readableDate}
                  </Text>
                  <Text
                    style={styles.mangaLink}
                    onPress={() => Linking.openURL(String(manga[1]))}
                  >
                    <Text style={styles.mangaLinkText}>Read Now</Text>
                  </Text>
                </View>
              </View>
              {/* Trash Can Icon Below the Image */}
              <TouchableOpacity
                style={styles.trashCanButton}
                onPress={() => handleRemoveManga(manga[2])}
              >
                <Icon name="delete" size={24} color="white" />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
  },
  topContainer: {
    flexDirection: "row",
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    height: 2,
    marginVertical: 10,
    backgroundColor: "#333333",
  },
  scrollContainer: {
    width: "100%",
    paddingTop: 10,
  },
  mangaItem: {
    backgroundColor: "#1e1e1e",
    borderColor: "#333333",
    borderWidth: 1,
    borderRadius: 25,
    marginBottom: 10,
    padding: 15,
  },
  mangaContent: {
    backgroundColor: "#1e1e1e",
    flexDirection: "row",
    alignItems: "center",
  },
  mangaImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    backgroundColor: "#1e1e1e",
    flex: 1,
  },
  mangaName: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 5,
  },
  mangaStatus: {
    color: "#66ff66",
    marginBottom: 5,
  },
  latestChapters: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 5,
  },
  latestReleaseDate: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 10,
  },
  mangaLink: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#8A2BE2",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  mangaLinkText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
  trashButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalButton: {
    backgroundColor: "#8A2BE2",
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 50,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modal_main_view_container: {
    height: height * 0.5,
    backgroundColor: "#121212",
    borderWidth: 2,
    borderColor: "#333333",
    width: "90%",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modal_title: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  modal_contentContainer: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    borderColor: "#333333",
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modal_instructions: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
  },
  modal_actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  modal_input: {
    height: 40,
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 8,
    color: "#fff",
    marginRight: 10,
  },
  modal_addButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  modal_buttonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
  modal_message: {
    fontSize: 16,
    color: "green",
    textAlign: "center",
    marginTop: 16,
  },
  trashCanButton: {
    position: "absolute",
    bottom: 10,
    left: 10,
    padding: 5,
  },
  reloadButton: {
    padding: 10,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    zIndex: 999, // Ensure it appears on top of the content
  },
});
