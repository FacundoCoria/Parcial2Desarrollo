import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Image, Button, TextInput, Modal, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getInfoById, updateTeam } from "./api"; 

const Details = () => {
  const params = useLocalSearchParams();
  const [team, setTeam] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedTeam, setEditedTeam] = useState<any>({});

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await getInfoById(params.id as string);
      console.log(response); // Verifica la respuesta de la API
      setTeam(response);
      setEditedTeam(response); // Inicializa el estado con los datos actuales del equipo
    };

    fetchInfo();
  }, [params.id]);

  const handleEditChange = (field: string , value: string) => {
    setEditedTeam((prevState: any) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedTeam = await updateTeam(team.id, editedTeam);
      setTeam(updatedTeam); // Actualiza el estado con los datos del equipo actualizado
      setIsEditing(false); // Cierra el modal de edición
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false); // Cierra el modal sin hacer cambios
    setEditedTeam(team); // Restaura el estado al valor original
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Details",
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      {team && (
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 10,
            width: "90%",
            margin: 16,
            padding: 16,
          }}
        >
          <Text style={styles.title}>{team.name}</Text>
          
          {/* Verificar si la imagen está disponible antes de cargarla */}
          {team.image ? (
            <Image
              source={{ uri: team.image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Text>No hay imagen disponible.</Text>
          )}

          {/* Mostrar información del equipo */}
          <Text style={{ fontWeight: "normal" }}>{team.description}</Text>
          <Text style={{ fontWeight: "normal" }}>{team.goals}</Text>
          <Text style={{ fontWeight: "normal" }}>{team.points}</Text>

          {/* Botón para editar */}
          <Button title="Editar" onPress={() => setIsEditing(true)} />
        </View>
      )}

      {/* Modal de edición */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Equipo</Text>
            
            {/* Formulario de edición */}
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={editedTeam.name}
              onChangeText={(text) => handleEditChange("name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={editedTeam.description}
              onChangeText={(text) => handleEditChange("description", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Cantidad de goles"
              keyboardType="numeric"  // Solo números
              onChangeText={(text) => handleEditChange( "goals", Number(text) )} // Convierte a número directamente
            />
              <TextInput
              style={styles.input}
              placeholder="Cantidad de puntos"
              keyboardType="numeric"  // Solo números
              onChangeText={(text) => handleEditChange( "points", Number(text) )} // Convierte a número directamente
            />

            <TextInput
              style={styles.input}
              placeholder="Imagen (URL)"
              value={editedTeam.image}
              onChangeText={(text) => handleEditChange("image", text)}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Guardar cambios</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: 400,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24, 
    textAlign: "center", 
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#f4511e",
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Details;
