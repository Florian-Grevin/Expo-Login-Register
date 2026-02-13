import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TabTwoScreen() {
  const {user, logout} = useAuth();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handlePickImage = () => {
    Alert.alert(
      'Photo de profil',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: () => console.log('photo'),
        },
        {
          text: 'Prendre depuis la galerie',
          onPress: pickFromGallery,
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if ( status !== 'granted' ) {
      Alert.alert('Permissions refusée', 'Nous avons besoin de la permission galerie');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes : ['images'],
      allowsEditing :  true,
      aspect : [1, 1],
      quality : 0.8,
    })
    if(!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
    }
    
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage}>
          {avatarUri? (
            <Image source={{uri : avatarUri}} style={styles.avatarImage}/>
          ) : (
            <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color={"#118397ff"}/>
          </View>
        )}
          
          <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color={"#fff"}/>
          </View>
        </TouchableOpacity>
       <Text style={styles.email}>{user?.email}</Text>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#bf1414ff"/>
          <Text style={styles.logoutText}>Se Déconnecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    backgroundColor: "#f5f5f5",
  },
  header : {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",

  },
  avatarContainer : {
    position: "relative",
    marginTop: 16,
    marginBottom: 16,
  },
  avatarImage : {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder : {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#dce9ebff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge : {
    position: "absolute",
    bottom:0,
    right:0,
    backgroundColor: "#118397ff",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  section : {
    backgroundColor: "#fff",
    marginTop: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  logoutButton : {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8
  },
  logoutText : {
    color: "#bf1414ff",
    fontSize: 16,
    fontWeight: 600,
  },
  email : {
    fontSize: 18,
    color: '#333',
    fontWeight: 500,
  },

});