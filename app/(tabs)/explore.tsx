import { useAuth } from "@/contexts/AuthContext";
import { registerAndSavePushToken } from "@/services/notifications";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AVATAR_STORAGE_KEY = 'user_avatar';

export default function TabTwoScreen() {
  const {user, logout} = useAuth();
  const [isEnablingNotifications, setIsEnablingNotifications] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    loadAvatar();
  })

  const loadAvatar = async () => {
    try {
      const savedAvatar = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
      if(savedAvatar) {
        setAvatarUri(savedAvatar);
      }
    }
    catch (error) {
      console.error('Erreur de chargement avatar : ', error);
    }
  }

  const saveAvatar = async (uri : string) => {
    try {
      await AsyncStorage.setItem(AVATAR_STORAGE_KEY, uri);
    }
    catch (error) {
      console.error("Erreur sauvegarde avatar : ", error)
    }
  }


  const handlePickImage = () => {
    Alert.alert(
      'Photo de profil',
      'Choisissez une option',
      [
        {
          text: 'Prendre une photo',
          onPress: pickFromCamera,
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

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if ( status !== 'granted' ) {
      Alert.alert('Permissions refusée', 'Nous avons besoin de la permission photo');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing :  true,
      aspect : [1, 1],
      quality : 0.8,
    })
    if(!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setAvatarUri(uri);
      saveAvatar(uri);
    }
    
  }

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
      saveAvatar(uri);
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion','Êtes-vous sûr de vouloir vous déconnecter ?', [
      {text: 'Annuler', style:"cancel"},
      {text: 'Déconnexion', style:"destructive", onPress: logout},
    ])
  }


  const handleEnableNotifications = async () => {
    setIsEnablingNotifications(true);
    try{
      const success = await registerAndSavePushToken();
      if(success) {
        Alert.alert("Succès", "notifications activées !")
      } else {
        Alert.alert(
          "Permission requise",
          "Veuillez autoriser les notifications dans les paramètres de votre appareil."
        )
      }
    }
    catch (error) {
      Alert.alert("Erreur", "Impossible d'activer les notifications")
    }
    finally {
      setIsEnablingNotifications(false);      
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
        <Text style={styles.sectionTitle}>Paramètres</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={handleEnableNotifications}
          disabled={isEnablingNotifications}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="notifications-outline" size={24} color={"#333"}/>
            <Text style={styles.menuItemText}>Activer les notifications</Text>
          </View>
          {isEnablingNotifications ? (
            <ActivityIndicator size={"small"} color={"#118397ff"}/>
          ) : (
            <Ionicons name="chevron-forward" size={20} color={"#999"}/>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
  sectionTitle : {
    fontSize: 14,
    color : "#666",
    fontWeight : 600,
    textTransform: "uppercase",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuItem : {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  menuItemLeft : {
    flexDirection: "row",
    alignItems: "center",
    gap:12,
  },
  menuItemText : {
    fontSize: 16,
    color: "#333",
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