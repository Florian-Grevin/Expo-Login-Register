import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TabTwoScreen() {
  const {user, logout} = useAuth();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={48} color={"#118397ff"}/>
        </View>
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
  avatarPlaceholder : {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#dce9ebff',
    justifyContent: 'center',
    alignItems: 'center',
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