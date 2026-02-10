import React, { useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { login, register } from "./api";

export default function AuthScreen() {
  const [mode, setMode] = useState("login"); // "login" ou "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    const action = mode === "login" ? login : register;
    const data = await action(email, password);

    if (data.error) {
      setError(data.error);
      return;
    }

    console.log(mode === "login" ? "Logged in:" : "Registered:", data);
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        {mode === "login" ? "Login" : "Register"}
      </Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Button
        title={mode === "login" ? "Login" : "Register"}
        onPress={handleSubmit}
      />

      {error && (
        <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
      )}

      <TouchableOpacity
        onPress={() => setMode(mode === "login" ? "register" : "login")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "blue" }}>
          {mode === "login"
            ? "Pas de compte ? Crée un compte"
            : "Déjà un compte ? Connecte-toi"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
