const BASE_URL = "http://161.35.143.238:8000/fcoria"; 

// Función para obtener todos los equipos
export const getInfo = async () => {
  const URL = `${BASE_URL}`;
  try {
    const response = await fetch(URL);
    if (response.ok) {
      return await response.json(); // Devuelve todos los equipos
    } else {
      console.error("Error obteniendo la información.");
      return [];
    }
  } catch (error) {
    console.error("Error en la solicitud:", error.message);
    return [];
  }
};

// Función para obtener un equipo por su ID
export const getInfoById = async (id: string) => {
  const URL = `${BASE_URL}/${id}`;
  try {
    const response = await fetch(URL);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data; // Devuelve la información completa del equipo
    } else {
      console.error(`Error obteniendo el equipo con id: ${id}`);
      return null;
    }
  } catch (error) {
    console.error("Error en la solicitud:", error.message);
    return null;
  }
};

// Función para agregar un nuevo equipo
export const addTeam = async (newTeam) => {
  const URL = `${BASE_URL}`;
  
  if (!newTeam.name || !newTeam.description || !newTeam.goals || !newTeam.points) {
    throw new Error("Todos los campos obligatorios deben ser proporcionados.");
  }

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newTeam.name,
        description: newTeam.description,
        goals: newTeam.goals, 
        points: newTeam.points, 
        image: newTeam.image || "", // Si no hay imagen se da un string vacio.
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al agregar equipo: ${errorData.message}`);
    }

    return await response.json(); // Devuelve el equipo agregado
  } catch (error) {
    console.error("Error al agregar el equipo:", error.message);
    throw new Error("No se pudo agregar el equipo.");
  }
};

// Función para actualizar un equipo existente
export const updateTeam = async (id, updatedData) => {
  const URL = `${BASE_URL}/${id}`;

  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al actualizar equipo: ${errorData.message}`);
    }

    return await response.json(); // Devuelve el equipo actualizado
  } catch (error) {
    console.error(`Error al actualizar el equipo con id: ${id}`, error.message);
    throw new Error("No se pudo actualizar el equipo.");
  }
};

// Función para eliminar un equipo
export const deleteTeam = async (id) => {
  const URL = `${BASE_URL}/${id}`;

  try {
    const response = await fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json", 
      },
    });

    if (!response.ok) {
      const errorData = await response.json(); 
      console.error("Detalles del error del servidor:", errorData);
      throw new Error(`Error al eliminar el equipo: ${response.statusText}`);
    }

    console.log(`Equipo con id: ${id} eliminado exitosamente.`);
    return true; // Retorna true para confirmar que se eliminó correctamente
  } catch (error) {
    console.error(`Error al eliminar el equipo con id: ${id}`, error.message);
    throw new Error("No se pudo eliminar el equipo. Verifica el ID o intenta nuevamente.");
  }
};
