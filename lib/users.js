export async function getLatestUsers() {
    const url = "http://172.16.1.154:8000/api/sci/users";
    // const url = "http://192.168.68.114:8000/api/sci/users";
    const rawData = await fetch(url);
    const json = await rawData.json();
  
    return json.map((user) => {
      const { id, nombre, email, organo_id, rediee_foto_ri } =
        user;
  
      return {
        id,
        nombre,
        email,
        organo: organo_id,
        image: rediee_foto_ri,
      };
    });
  }

  export async function getUserDetails(userID) {
    // const url = `https://www.freetogame.com/api/game?id=${id}`;
    const url = `http://172.16.1.154:8000/api/sci/users/${userID}`;
    // const url = `http://192.168.68.114:8000/api/sci/users/${userID}`;
    const rawData = await fetch(url);
    const json = await rawData.json();
    // console.log("Respuesta completa del usuario:", json);

    // return json.map((inventario) => ({
    //   id: inventario.id,
    //   id_usuario: inventario.id_usuario,
    //   descripcion: inventario.descripcion,
    //   inventario: inventario.inventario2015,
    // }));
    return {
      user: json.user, // Aquí está el nombre, email, etc.
      inventarios: json.inventarios // Aquí está el listado de inventarios
    };
  }