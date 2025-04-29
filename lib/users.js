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
      id_usuario: userId
    });

    // Manejar diferentes tipos de respuestas exitosas
    if (response.success) {
      return {
        ...response,
        status: 'success',
        action: response.message.includes('reactivado') ? 'reactivated' : 'reassigned'
      };
    }

    throw new Error(response.message || 'Error al procesar la solicitud');
  } catch (error) {
    // Manejar errores que en realidad son exitosos (reactivación)
    if (error.message.includes('reactivado')) {
      return {
        ...JSON.parse(error.config.data), // Recupera los datos originales
        status: 'success',
        success: true,
        action: 'reactivated',
        message: error.message
      };
    }
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