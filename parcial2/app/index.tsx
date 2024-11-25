import { Text, View, ScrollView, Image, Modal, TextInput, Button, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getInfo, addTeam, deleteTeam } from "./api";
import { Stack, Link } from "expo-router";

const Index = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    goals: "",
    points: "",
    image: "",
  });

  useEffect(() => {
    fetchInfo();
  }, []);

  // Obtiene los equipos
  const fetchInfo = async () => {
    try {
      const response = await getInfo();
      setTeams(response);
      fetchInfo()
    } catch (error) {
      console.error("Error al cargar los equipos:", error.message);
    }
  };

  // Agrega un nuevo equipo a la colección
  const handleAddTeam = async () => {
    if (!newTeam.name || !newTeam.description || !newTeam.goals || !newTeam.points) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    try {
      const response = await addTeam(newTeam);
      if (response) {
        alert("Equipo agregado con éxito.");
        fetchInfo(); // Actualiza la lista
        setShowModal(false); // Cierra el modal
        setNewTeam({ name: "", description: "", goals: "", points: "", image: "" }); // Limpia los campos
      }
    } catch (error) {
      console.error("Error al agregar el equipo:", error.message);
      alert("Error al agregar el equipo. Por favor, inténtalo de nuevo.");
    }
  };

  // Elimina un equipo de la colección
  const handleDeleteTeam = async (id) => {
    try {
      const isDeleted = await deleteTeam(id);
      if (isDeleted) {
        alert("Equipo eliminado con éxito.");
        fetchInfo(); // Recarga la lista de equipos
      }
    } catch (error) {
      alert(error.message); 
    }
  };
  

  return (
    <ScrollView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Home",
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Button title="Agregar Equipo" onPress={() => setShowModal(true)} />
      {teams.length > 0 ? (
        teams.map((team) => (
          <View key={team.id} style={styles.card}>
            <Link
              href={{
                pathname: "/details",
                params: { id: team.id },
              }}
            >
              <Text style={styles.title}>{team.name}: </Text>
              <Text style={styles.description}>{team.description}</Text>

              {team.image && (
                <Image
                  source={{ uri: team.image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            </Link>
            <Button
              title="Eliminar"
              onPress={() => handleDeleteTeam(team.id)}
              color="red"
            />
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Cargando equipos...</Text>
      )}


      {/* Modal para agregar equipo */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar nuevo equipo</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del Equipo"
              value={newTeam.name}
              onChangeText={(text) => setNewTeam({ ...newTeam, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={newTeam.description}
              onChangeText={(text) => setNewTeam({ ...newTeam, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Cantidad de goles"
              value={newTeam.goals}
              keyboardType="numeric" // Solo permite números en el teclado
              onChangeText={(text) =>
                setNewTeam({ ...newTeam, goals: Number(text) }) // Convierte a número directamente
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Cantidad de puntos"
              value={newTeam.points}
              keyboardType="numeric" // Solo permite números en el teclado
              onChangeText={(text) =>
                setNewTeam({ ...newTeam, points: Number(text) }) // Convierte a número directamente
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Imagen en URL"
              value={newTeam.image}
              onChangeText={(text) => setNewTeam({ ...newTeam, image: text })}
            />
            <View style={styles.modalButtons}>
              <Button title="Agregar" onPress={handleAddTeam} />
              <Button title="Cancelar" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    margin: 16,
    padding: 16,
    alignSelf: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  description: {
    fontSize: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default Index;
