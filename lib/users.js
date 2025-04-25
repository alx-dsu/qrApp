// export async function getLatestUsers() {
//     const url = "http://172.16.1.154:8000/api/sci/users";
//     // const url = "http://192.168.68.105:8000/api/sci/users";
//     const rawData = await fetch(url);
//     const json = await rawData.json();
  
//     return json.map((user) => {
//       const { id, nombre, email, organo_id, rediee_foto_ri } =
//         user;
  
//       return {
//         id,
//         nombre,
//         email,
//         organo: organo_id,
//         image: rediee_foto_ri,
//       };
//     });
//   }

//   export async function getUserDetails(userID) {
//     const url = `http://172.16.1.154:8000/api/sci/users/${userID}`;
//     // const url = `http://192.168.68.105:8000/api/sci/users/${userID}`;
//     const rawData = await fetch(url);
//     const json = await rawData.json();
//     // console.log("Respuesta completa del usuario:", json);

//     // return json.map((inventario) => ({
//     //   id: inventario.id,
//     //   id_usuario: inventario.id_usuario,
//     //   descripcion: inventario.descripcion,
//     //   inventario: inventario.inventario2015,
//     // }));
//     return {
//       user: json.user, // Aquí está el nombre, email, etc.
//       inventarios: json.inventarios // Aquí está el listado de inventarios
//     };
//   }
import { api } from './api';

export async function getLatestUsers() {
  try {
    // console.log('Obteniendo usuarios...');
    const users = await api.get('api/sci/users');
    // console.log('Usuarios recibidos:', users.length);
    
    return users.map((user) => ({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      organo: user.organo_id,
      image: user.rediee_foto_ri,
    }));
  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      status: error.status,
      data: error.data,
    });
    throw new Error('No se pudieron obtener los usuarios. Intente más tarde.');
  }
}

export async function getUserDetails(userID) {
  try {
    const data = await api.get(`api/sci/users/${userID}`);
    return {
      user: data.user,
      inventarios: data.inventarios || [],
    };
  } catch (error) {
    console.error(`Error al obtener detalles del usuario ${userID}:`, {
      message: error.message,
      status: error.status,
    });
    
    throw new Error(error.status === 404 
      ? 'Usuario no encontrado' 
      : 'Error al cargar los detalles del usuario');
  }
}

export async function reasignarInventario({ qr, userId }) {
  try {
    const response = await api.put('api/sci/inventario/reasignar', {
      inventario: qr.trim(),
      id_usuario: userId,
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al reasignar');
    }

    return response.inventario;
  } catch (error) {
    console.error('Error en reasignación:', error);
    throw error;
  }
}

export async function deleteInventario(id) {
  try {
    await api.delete(`api/sci/inventario/${id}`);
    return id; // Devolvemos el ID para actualizar el cache
  } catch (error) {
    console.error('Error eliminando inventario:', error);
    throw error;
  }
}