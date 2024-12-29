import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  Linking,
  Image,
  RefreshControl,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { format } from "date-fns";

// Import the manga data from the JSON file
import { fetchMangas } from "@/api/api"; // Adjust the path based on your folder structure

// Render the manga list
export default function MangaList() {
  const [mangas, setMangas] = useState([]); // State to store the fetched manga data
  const [loading, setLoading] = useState(true); // Loading state for the API request
  const [error, setError] = useState<string | null>(null); // Error state, with type `string | null`
  const [refreshing, setRefreshing] = useState(false); // State to manage refreshing (pull-to-refresh)

  // Fetch manga data from FastAPI when the component mounts
  useEffect(() => {
    fetchMangasData();
  }, []); // Empty dependency array to run only once after the initial render

  // Function to fetch manga data and update state
  const fetchMangasData = async () => {
    setLoading(true);
    try {
      const fetchedMangas = await fetchMangas(); // Use the fetchMangas function from api.js
      setMangas(fetchedMangas); // Set fetched data to state
      setError(null); // Reset error state
    } catch (error) {
      setError("Failed to fetch mangas"); // Set error message
    } finally {
      setLoading(false); // Stop loading state
      setRefreshing(false); // Stop refreshing state
    }
  };

  // Handle pull-to-refresh action
  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true
    fetchMangasData(); // Re-fetch manga data
  };

  if (loading) {
    return <Text>Loading...</Text>; // Display loading message while fetching data
  }

  if (error) {
    return <Text>{error}</Text>; // Display error message if the request fails
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manga List</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor="black" // This changes the color of the spinner (circle) to black
            colors={["white"]} // This changes the color of the refresh indicator arc to black
          />
        }
      >
        {mangas.map((manga, index) => {
          // Convert the date string (manga[12]) to a Date object
          const dateStr = manga[12]; // Assuming the date is in manga[12]
          const date = new Date(dateStr);

          // Use date-fns to format the date
          const readableDate = format(date, "mm, dd, yyyy HH:MM");
          return (
            <View key={manga[0]} style={styles.mangaItem}>
              <View style={styles.mangaContent}>
                {/* Image on the left */}
                <Image
                  source={{ uri: String(manga[3]) }}
                  style={styles.mangaImage}
                />

                {/* Text content on the right */}
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
    padding: 20,
  },
  separator: {
    marginVertical: 1,
    height: 2,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 10,
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
    flexDirection: "row", // Align image and text side by side
    alignItems: "center", // Center vertically
  },
  mangaImage: {
    width: 80, // Set the width of the image
    height: 120, // Set the height of the image
    borderRadius: 10, // Optional: for rounded corners on the image
    marginRight: 15, // Space between image and text
  },
  textContainer: {
    backgroundColor: "#1e1e1e",
    flex: 1, // Makes sure text takes remaining space
  },
  mangaName: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 5,
  },
  mangaDescription: {
    fontSize: 14,
    color: "#cccccc",
    marginBottom: 5,
  },
  mangaStatus: {
    color: "#66ff66",
    marginBottom: 5,
  },
  mangaRating: {
    color: "#ffcc00",
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
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  mangaLinkText: {
    color: "white", // Ensures the text color is white
    textAlign: "center", // Center text horizontally within the button
    fontSize: 14, // Adjust font size if needed
  },
});
