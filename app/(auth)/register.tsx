import { useAuth } from "@/contexts/AuthContext";
import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterScreen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleRegister = async () => {
        if(!email || !password || !confirmPassword) {
            Alert.alert("Erreur", "Veuillez remplir tout les champs.")
            return;
        }
        if(password !== confirmPassword) {
            Alert.alert("Erreur", "Les mots de passe ne correspondent pas.")
            return;
        }
        if(password.length < 6)  {
            Alert.alert("Erreur", "Le mot de passe doit contenir au moins 6 caractères.")
            return;
        }
        setIsLoading(true);
        try {
            await register(email, password);
            router.replace("/(tabs)")
        } catch (error : any) {
            Alert.alert("Erreur", error.message || "Connexion échouée")
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS == 'ios' ? 'padding' : "height"}
            style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Inscription</Text>
                <Text style={styles.subTitle}>Bienvenue! Inscrivez-vous pour continuer.</Text>
                <View style={styles.form}>
                    <TextInput 
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#777"
                        value={email}
                        onChangeText={setEmail}
                        autoCorrect={false}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput 
                        style={styles.input}
                        placeholder="Mot de passe"
                        placeholderTextColor="#777"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry

                    />
                    <TextInput 
                        style={styles.input}
                        placeholder="Confirmer le mot de passe"
                        placeholderTextColor="#777"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry

                    />
                    <TouchableOpacity 
                        style={[styles.button, isLoading && styles.buttonDisabled]} 
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                            {
                                isLoading ? (
                                    <ActivityIndicator color='#fff'/>
                                ) : (
                                   <Text style={styles.buttonText}>S'inscrire</Text> 
                                )
                            }
                        
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Déjà un compte?</Text>
                    <Link href="/(auth)/login" asChild>
                         <TouchableOpacity>
                            <Text style={styles.link}>Se connecter</Text>
                         </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor : "#F5F5F5",
    },
    content : {
        flex: 1,
        justifyContent : "center",
        paddingHorizontal : 24,
    },
    title : {
        fontSize: 32,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    subTitle : {
        fontSize: 16,
        color: "#666",
        marginBottom: 32,
    },
    form : {
        gap: 16,
    },
    input : {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor : '#E0E0E0',
    },
    button : {
        backgroundColor: "#118397ff",
        borderRadius: 500,
        padding: 16,
        alignItems: "center",
        marginTop: 8,
    },
    buttonDisabled : {
        opacity: 0.7,
    },
    buttonText : {
        color: "#fff",
        fontSize: 18,
        fontWeight: 600,
    },
    footer : {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        gap: 8,
    },
    footerText : {
        color: "#666",
        fontSize: 16,
    },
    link : {
        color: "#118397ff",
        fontSize: 16,
        fontWeight: "600",
    }
});