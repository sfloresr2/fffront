import React, { useState, useEffect } from 'react'; // Importa React y los hooks useState y useEffect. useState se utiliza para manejar el estado de los componentes, mientras que useEffect permite manejar efectos secundarios, como cargar datos al renderizar.
import { TextField, Container, Typography, Grid, Box, Button, MenuItem, Select, InputLabel } from '@mui/material'; // Importa varios componentes de Material-UI para la interfaz de usuario: TextField: Campo de texto para la entrada de datos. Container: Componente que centra y da estructura al contenido. Typography: Se usa para mostrar texto con diferentes estilos. Grid: Sistema de cuadrícula para organizar elementos. Box: Un contenedor flexible para manejar layout y estilo. Button: Componente de botón para interacciones del usuario. MenuItem: Elemento de menú usado dentro de un Select. Select: Desplegable de opciones. InputLabel: Etiqueta asociada a un input como un Select.
import ApiRequest from '../../../helpers/axiosInstances'; // Importa una instancia de axios que posiblemente configura las solicitudes HTTP para hacer peticiones a la API.
import Page from '../../common/Page'; // Importa un componente común llamado "Page", que podría ser un layout o estructura base para la página.
import ToastAutoHide from '../../common/ToastAutoHide'; // Importa un componente para mostrar notificaciones o mensajes emergentes que se oculten automáticamente después de un tiempo.



const Salidas = () => { // Definición del componente funcional "Productos".
    const initialState = { // Estado inicial para un producto, probablemente usado para manejar formularios de creación o edición.
        id: "", // ID del producto (vacío por defecto).
        codigo: "",
        nombre: "", // Nombre del producto.
        descripcion: "", // Descripción del producto.
        id_proveedor: "", // ID del proveedor del producto.
        fecha_salida: "", // Fecha de compra (inicialmente vacía, sin una fecha predefinida). 
        
        cantidad: "", // Cantidad de productos.
        precio: "" // Precio del producto.   
    }; // Fin del const, Este estado inicial probablemente se usará para controlar los inputs del formulario o para resetear valores.


    
    const formatDate = (date) => {  // Esta función toma una fecha y la formatea al estilo 'YYYY-MM-DD'.
        if (!date) return '';  // Si no se proporciona una fecha (date es null, undefined, etc.), retorna una cadena vacía.
        const d = new Date(date);  // Crea un nuevo objeto Date basado en la fecha proporcionada.
        d.setHours(d.getHours() + 12);  // Ajusta la hora sumando 12 horas para corregir posibles desfasajes por la zona horaria. Esto ayuda a asegurar que se capture correctamente la fecha, evitando saltos de día
        const month = ('0' + (d.getMonth() + 1)).slice(-2); // Obtiene el mes de la fecha. En JavaScript, los meses van de 0 a 11, por eso se suma 1.Luego, añade un '0' al inicio y utiliza slice(-2) para asegurar que siempre tenga dos dígitos. Ejemplo: si es enero (mes 1), se convierte en '01'.
        const day = ('0' + d.getDate()).slice(-2); // Obtiene el día de la fecha, añade un '0' al inicio y usa slice(-2) para asegurarse de que tenga dos dígitos. Ejemplo: si el día es 5, se convierte en '05'.
        return d.getFullYear() + '-' + month + '-' + day; // Devuelve la fecha en el formato 'YYYY-MM-DD', concatenando el año, mes y día.
    };//Fin del const



    const [roles, setRoles] = useState([]); // "roles" es una variable de estado que almacena una lista (array) de roles, posiblemente los proveedores en este caso. Inicialmente se establece como un array vacío []. "setRoles" es la función que se usa para actualizar "roles".
    const [body, setBody] = useState(initialState); // "body" es un objeto que almacena los datos del formulario o del producto actual que se está creando/editando. Inicialmente se establece con "initialState", que es un objeto con los campos iniciales de un producto."setBody" es la función que se usa para actualizar el estado de "body".
    const [isEdit, setIsEdit] = useState(false); // "isEdit" es una variable booleana que indica si el formulario está en modo edición (true) o creación (false). Inicialmente está en "false", lo que significa que el formulario está en modo creación. "setIsEdit" es la función que se usa para cambiar este estado.
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null }); // "mensaje" es un objeto que almacena información relacionada con notificaciones o alertas que se mostrarán al usuario.El objeto tiene tres propiedades:- "ident": puede ser un identificador de la notificación (inicialmente null).- "message": el mensaje que se va a mostrar (inicialmente null).- "type": el tipo de mensaje (por ejemplo, éxito, error, advertencia), también inicialmente null."setMensaje" es la función que se usa para actualizar este estado con nuevos valores cuando sea necesario.



    const fetchRoles = async () => { // Definición de una función asíncrona llamada "fetchRoles". Esta función se encargará de obtener la lista de proveedores (roles) desde el servidor.
        try { // Intentará ejecutar el bloque de código en el "try". Si ocurre algún error, lo capturará en el "catch".
            const response = await ApiRequest().get('/proveedores'); // Hace una solicitud HTTP GET al endpoint '/proveedores' usando "ApiRequest", que es una instancia de axios configurada para hacer peticiones a la API.El resultado de la solicitud se almacena en la variable "response".
            setRoles(response.data); // Actualiza el estado "roles" con los datos que vienen en la respuesta (response.data).Presumiblemente, "response.data" es un array de proveedores que se mostrará en la interfaz de usuario.
        } catch (error) {  // Si ocurre un error durante la solicitud (por ejemplo, si el servidor no está disponible),se ejecutará el código dentro del "catch"
            console.error('Error fetching roles data:', error);  // Muestra en la consola un mensaje de error junto con el detalle del error que ocurrió. Esto es útil para depuración (debugging) y saber si hubo algún problema al hacer la petición a la API.
        } //Fin del catch
    }; //Fin del const



    const onChange = ({ target }) => { // Función "onChange" que se ejecuta cuando un campo de entrada del formulario cambia.Recibe un evento como argumento, y se desestructura para obtener "target", que es el input que activó el evento.
        const { name, value } = target; // Desestructura el "target" del evento para obtener el "name" (el nombre del campo) y el "value" (el valor ingresado)."name" se refiere al atributo 'name' del input HTML, que indica qué campo se está editando."value" es el valor actual que tiene ese campo de entrada.
        setBody({ // Actualiza el estado "body" utilizando "setBody".
            ...body, // Se utiliza el operador "spread" (`...body`) para copiar el contenido actual de "body".
            [name]: value // Luego, se sobrescribe el campo correspondiente (indicado por "name") con el nuevo valor ingresado ("value"). Esto permite que el campo específico del formulario que se cambió se actualice en el estado "body",manteniendo el resto de los campos intactos.
        });//Fin del Set
    };//Fin del Const



    const onSubmit = async () => { // "onSubmit" es una función asíncrona que se ejecuta cuando el formulario es enviado.Se encargará de enviar los datos del formulario (almacenados en "body") al servidor.
        try { // Intenta ejecutar el bloque de código en el "try". Si ocurre algún error, se manejará en el "catch".
            const { data } = await ApiRequest().post('/guardar_products', body); // Realiza una solicitud HTTP POST a la API en el endpoint '/guardar_product' utilizando "ApiRequest".Se envía el contenido de "body" (que contiene los datos del producto) como el cuerpo de la solicitud.La respuesta se desestructura para obtener "data", que contiene el resultado de la operación en la API.
            setMensaje({   // Establece un mensaje en el estado "mensaje", indicando que la operación fue exitosa,mostrando al usuario un mensaje que viene desde la API.
                ident: new Date().getTime(),// Genera un identificador único para el mensaje (en este caso, la marca de tiempo actual).
                message: data.message,// Toma el mensaje de éxito que retorna la API en la respuesta y lo almacena.
                type: 'success'// Define el tipo de mensaje como "success" para indicar que fue exitoso.
            });//Fin del Set
            setBody(initialState); // Resetea el estado "body" al "initialState" para limpiar los campos del formulario.
            setIsEdit(false); // Establece "isEdit" en "false", indicando que se ha terminado la edición y que el formulario vuelve al modo creación.
        } catch ({ response }) { // Si ocurre un error en la solicitud POST, entra en el bloque "catch". Desestructura el objeto de error para obtener la "response" (respuesta de la API).
            setMensaje({ // Establece un mensaje en el estado "mensaje" para notificar al usuario que hubo un error en la operación.
                ident: new Date().getTime(),// Genera un identificador único para el mensaje.
                message: response.data.sqlMessage,// Toma el mensaje de error específico que retorna la API (posiblemente un error SQL).
                type: 'error'  // Define el tipo de mensaje como "error" para mostrar una alerta de fallo.
            });//Fin del Set
        }//Fin del catch
    };//Fin del const


 
    const onEdit = async () => { //"onEdit" es una función asíncrona que se ejecuta cuando se desea editar un producto existente.Envía los datos del formulario (almacenados en "body") al servidor para actualizar el producto.
        try { // Intenta ejecutar el código dentro del bloque "try". Si ocurre algún error, se manejará en el "catch".
            const { data } = await ApiRequest().post('/editar_products', body);  // Hace una solicitud HTTP POST a la API en el endpoint '/editar_product' utilizando "ApiRequest".Se envía el contenido de "body" (que contiene los datos del producto editado) como el cuerpo de la solicitud.La respuesta de la solicitud se desestructura para obtener "data", que contiene el resultado de la operación.
            setMensaje({  // Establece un mensaje en el estado "mensaje" para mostrar que la operación de edición fue exitosa.
                ident: new Date().getTime(), // Genera un identificador único para el mensaje (basado en la marca de tiempo actual).
                message: data.message, // Usa el mensaje de éxito que retorna la API en la respuesta.
                type: 'success' // Define el tipo de mensaje como "success" para indicar que la edición fue exitosa.
            });//Fin del Set
            setBody(initialState); // Restablece el estado "body" a su estado inicial (initialState), lo que limpia los campos del formulario.
            setIsEdit(false);// Cambia "isEdit" a "false", lo que indica que ya no estamos en modo de edición.
        } catch ({ response }) {  // Si ocurre un error en la solicitud POST, entra en el bloque "catch". Desestructura el objeto de error para obtener la "response" (respuesta de la API).
            setMensaje({ // Establece un mensaje en el estado "mensaje" para indicar que hubo un error durante la edición.
                ident: new Date().getTime(), // Genera un identificador único para el mensaje de error.
                message: response.data.sqlMessage, // Utiliza el mensaje de error retornado por la API, probablemente un error SQL.
                type: 'error' // Define el tipo de mensaje como "error" para mostrar una alerta de fallo.
            });//Fin del set
        }//Fin del Catch
    };//Fin del Const



    useEffect(() => { // Llama a la función "fetchRoles" cuando el componente se monta por primera vez.
        fetchRoles(); // "fetchRoles" obtiene la lista de roles (probablemente proveedores) desde la API y actualiza el estado "roles".
    }, []); // El segundo argumento es un array vacío ([]), lo que significa que este efecto solo se ejecutará una vez, justo después de que el componente se haya montado (similar a componentDidMount en clases).



    return ( // El retorno del componente, que define la estructura de la interfaz de usuario.
        <Page title="FF | Salidas de Producto"> {/* Componente "Page" que envuelve todo y establece el título de la página en la pestaña del navegador. */}
            <ToastAutoHide message={mensaje} /> {/* Componente que muestra un mensaje de notificación (toast) que se oculta automáticamente.Recibe el estado "mensaje" que contiene la información sobre el mensaje a mostrar. */}
            <Container maxWidth='lg'> {/* Componente "Container" que limita el ancho máximo del contenido a 'lg' (grande) para un diseño responsivo. */}
                <Box sx={{ pb: 5 }}>  {/* Componente "Box" que aplica un margen inferior (padding bottom) de 5 unidades. */}
                    <Typography variant="h5">Módulo de Registro de Información de {isEdit ? 'Editar Producto' : 'Compras de Producto'}</Typography> {/* Componente "Typography" que se utiliza para mostrar texto con estilos tipográficos. */}  {/* Texto que indica si el formulario está en modo de edición o en modo de compras. Utiliza un operador ternario para mostrar "Editar Producto" si "isEdit" es true, de lo contrario, muestra "Compras de Producto". */}
                </Box>{/* Fin del Box*/}
                <Grid container spacing={2}>  {/* Componente "Grid" que actúa como un contenedor para organizar los elementos en una cuadrícula."spacing={2}" añade espacio entre los elementos de la cuadrícula. */}

                <Grid item xs={12} sm={6}>  {/* Un elemento de la cuadrícula que ocupa todo el ancho en pantallas pequeñas (xs) y la mitad en pantallas medianas (sm). */}
                        {/* Componente "TextField" para capturar la entrada del usuario. Se configura de la siguiente manera:
                        - margin='normal': Aplica un margen normal al campo.
                        - name='id': Nombre del campo, utilizado para identificar el dato.
                        - value={body.id}: El valor actual del campo, que proviene del estado "body".
                        - onChange={onChange}: Maneja el evento de cambio del campo, llamando a la función "onChange".
                        - variant='outlined': Estilo del campo con borde.
                        - size='small': Tamaño del campo, que es pequeño.
                        - fullWidth: Hace que el campo ocupe todo el ancho disponible del contenedor.
                        - label='ID': Etiqueta que se muestra en el campo. */}
                        <TextField 
                            margin='normal'
                            name='codigo'
                            value={body.codigo}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Codigo'
                        />{/* Fin del Textfield */}
                    </Grid>{/* Fin del Grid */}

                    <Grid item xs={12} sm={6}> {/* Un elemento de la cuadrícula que ocupa todo el ancho (12 columnas) en pantallas pequeñas (xs)  y la mitad del ancho (6 columnas) en pantallas medianas (sm). */}
                        {/* Componente "TextField" para capturar la entrada del usuario. Se configura de la siguiente manera:
                        - margin='normal': Aplica un margen normal al campo.
                        - name='nombre': Nombre del campo, utilizado para identificar el dato (en este caso, el nombre del producto).
                        - value={body.nombre}: El valor actual del campo, que proviene del estado "body".Esto permite que el campo muestre el nombre del producto que está siendo editado o creado.
                        - onChange={onChange}: Maneja el evento de cambio del campo, llamando a la función "onChange" para actualizar el estado "body" cada vez que el usuario modifica el valor del campo.
                        - variant='outlined': Estilo del campo con borde, proporcionando una apariencia más definida.
                        - size='small': Tamaño del campo, que es pequeño, haciéndolo más compacto.
                        - fullWidth: Hace que el campo ocupe todo el ancho disponible del contenedor, asegurando que se vea bien en diferentes tamaños de pantalla.
                        - label='Nombre Producto': Etiqueta que se muestra en el campo, indicando al usuario que debe ingresar el nombre del producto. */}
                        <TextField
                            margin='normal'
                            name='nombre'
                            value={body.nombre}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Nombre Producto'
                        />{/* Fin del Textfield */}
                    </Grid>{/* Fin del Textfield */}

                    <Grid item xs={12} sm={6}> {/* Un elemento de la cuadrícula que ocupa todo el ancho (12 columnas) en pantallas pequeñas (xs) y la mitad del ancho (6 columnas) en pantallas medianas (sm). */}
                        {/* Componente "TextField" para capturar la entrada del usuario. Se configura de la siguiente manera:
                        - margin='normal': Aplica un margen normal al campo.
                        - name='descripcion': Nombre del campo, utilizado para identificar el dato (en este caso, la descripción del producto).
                        - value={body.descripcion}: El valor actual del campo, que proviene del estado "body". Esto permite que el campo muestre la descripción del producto que está siendo editado o creado.
                        - onChange={onChange}: Maneja el evento de cambio del campo, llamando a la función "onChange" para actualizar el estado "body" cada vez que el usuario modifica el valor del campo.
                        - variant='outlined': Estilo del campo con borde, proporcionando una apariencia más definida.
                        - size='small': Tamaño del campo, que es pequeño, haciéndolo más compacto.
                        - fullWidth: Hace que el campo ocupe todo el ancho disponible del contenedor, asegurando que se vea bien en diferentes tamaños de pantalla.
                        - label='Descripción Producto': Etiqueta que se muestra en el campo, indicando al usuario que debe ingresar la descripción del producto. */}
                        <TextField
                            margin='normal'
                            name='descripcion'
                            value={body.descripcion}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Descripción Producto'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}> {/* Un elemento de la cuadrícula que ocupa todo el ancho (12 columnas) en pantallas pequeñas (xs) y la mitad del ancho (6 columnas) en pantallas medianas (sm). */}
                        <InputLabel htmlFor="id_proveedor">Proveedor</InputLabel> {/* Componente "InputLabel" que proporciona una etiqueta para el campo de selección.Se asocia al campo "Select" mediante el atributo "htmlFor", que debe coincidir con el nombre del campo. */}
                        <Select //inicio select
                            name="id_proveedor" //* Asigna un nombre al campo para identificar el dato que se está seleccionando. 
                            value={body.id_proveedor || ''} // Utiliza el valor del estado "body.id_proveedor" o una cadena vacía si es undefined.
                            onChange={onChange} // Maneja el evento de cambio, llamando a "onChange" para actualizar el estado.
                            variant="outlined" // Estilo del campo con borde, dando una apariencia definida.
                            size="small" // Tamaño del campo, que es pequeño, haciéndolo más compacto.
                            fullWidth // Hace que el campo ocupe todo el ancho disponible del contenedor.
                        > {/* Fin del select */}
                            {roles.map((id_pro) => (  // Mapea a través del array "roles", que contiene los proveedores, para generar una lista de opciones en el menú.
                                <MenuItem key={id_pro.id} value={id_pro.id}> {/* Componente "MenuItem" representa una opción dentro del "Select".- key={id_pro.id}: Utiliza el ID del proveedor como clave única para cada elemento de la lista.- value={id_pro.id}: El valor que se enviará cuando se seleccione esta opción. */}
                                    {id_pro.nombre} {/* Muestra el nombre del proveedor como texto visible para el usuario. */}
                                </MenuItem> //Fin del menu
                            ))}{/* Fin del roles */}
                        </Select>{/* Fin del Select */}
                    </Grid>{/* Fin del Grid */}

                    <Grid item xs={12} sm={6}>{/* Un elemento de la cuadrícula que ocupa todo el ancho (12 columnas) en pantallas pequeñas (xs) y la mitad del ancho (6 columnas) en pantallas medianas (sm). */}
                        {/* value={formatDate(body.fecha_compra)}, Utiliza la función "formatDate" para formatear la fecha almacenada en el estado "body.fecha_compra".Esto asegura que la fecha se muestre en el formato adecuado para un campo de tipo 'date'. */}
                        {/*onChange={onChange}, Maneja el evento de cambio del campo, llamando a la función "onChange" para actualizar el estado cuando el usuario selecciona una nueva fecha. */}
                        {/* variant='outlined' Estilo del campo con borde, proporcionando una apariencia más definida y agradable visualmente. */}
                        {/* size='small', Tamaño del campo, que es pequeño, haciéndolo más compacto para una mejor experiencia de usuario. */}
                        {/* fullWidth,  Hace que el campo ocupe todo el ancho disponible del contenedor, asegurando una mejor adaptación en diferentes dispositivos. */}
                        {/*label='Fecha Compra',  Etiqueta que se muestra en el campo, indicando al usuario que debe ingresar la fecha de compra. */}
                        <TextField
                            type='date' // Define que este campo es un selector de fecha, permitiendo al usuario elegir una fecha desde un calendario.
                            margin='normal'// Aplica un margen normal al campo, mejorando el espaciado visual.
                            name='fecha_salida'// Asigna un nombre al campo, utilizado para identificar la fecha de compra en el estado.
                            value={formatDate(body.fecha_salida)} 
                            onChange={onChange} 
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Fecha Salida'
                            InputLabelProps={{
                                shrink: true, /* Propiedad que indica que la etiqueta debe mantenerse encogida incluso cuando el campo tiene un valor, para que el diseño sea más limpio y legible. */
                            }}
                        />{/* Fin del Textfield */}
                    </Grid>{/* Fin del Grid */}



                    <Grid item xs={12} sm={6}>{/* Un elemento de la cuadrícula que ocupa todo el ancho (12 columnas) en pantallas pequeñas (xs) y la mitad del ancho (6 columnas) en pantallas medianas (sm). */}
                        <TextField
                            margin='normal' // Aplica un margen normal al campo, mejorando el espaciado visual.
                            name='cantidad' // Asigna un nombre al campo, que será utilizado para identificar la cantidad en el estado.
                            value={body.cantidad} // Vincula el campo al valor "cantidad" en el estado "body", permitiendo que el campo muestre la cantidad actual de producto.
                            onChange={onChange} // Maneja el evento de cambio del campo, llamando a la función "onChange" para actualizar el estado cuando el usuario modifica la cantidad.
                            variant='outlined' // Estilo del campo con borde, proporcionando una apariencia más definida y agradable visualmente.
                            size='small' // Tamaño del campo, que es pequeño, haciéndolo más compacto y fácil de usar.
                            fullWidth // Hace que el campo ocupe todo el ancho disponible del contenedor, asegurando una mejor experiencia de usuario.
                            label='Cantidad de Producto' // Etiqueta que se muestra en el campo, indicando al usuario que debe ingresar la cantidad del producto.
                        />{/* Fin del Textfield */}
                    </Grid>{/* Fin del Grid */}

                    <Grid item xs={12} sm={6}>{/* Un elemento de la cuadrícula que ocupa todo el ancho (12 columnas) en pantallas pequeñas (xs) y la mitad del ancho (6 columnas) en pantallas medianas (sm). */}
                        <TextField
                            margin='normal' // Aplica un margen normal al campo, mejorando el espaciado visual.
                            name='precio' // Asigna un nombre al campo, que será utilizado para identificar el precio en el estado.
                            value={body.precio} // Vincula el campo al valor "precio" en el estado "body", permitiendo que el campo muestre el precio actual.
                            onChange={onChange}// Maneja el evento de cambio del campo, llamando a la función "onChange" para actualizar el estado cuando el usuario modifica el precio.
                            variant='outlined'// Estilo del campo con borde, proporcionando una apariencia más definida y agradable visualmente.
                            size='small' // Tamaño del campo, que es pequeño, haciéndolo más compacto y fácil de usar.
                            fullWidth // Hace que el campo ocupe todo el ancho disponible del contenedor, asegurando una mejor experiencia de usuario.
                            label='Precio' // Etiqueta que se muestra en el campo, indicando al usuario que debe ingresar el precio del producto.
                        />{/* Fin del Textfield */}
                    </Grid> {/* Fin del Grid */}
                    
                    <Grid item xs={12}> {/* Un elemento de la cuadrícula que ocupa todo el ancho (12 columnas) en pantallas pequeñas y medianas. */}
                        <Button 
                        variant='contained' // Estilo del botón con un fondo sólido, dándole un aspecto prominente.
                        color='primary' // Color del botón, utilizando el esquema de colores primarios definido en el tema de Material-UI. 
                        // Establece la función a llamar en el evento de clic; si "isEdit" es verdadero, llama a "onEdit", de lo contrario llama a "onSubmit".
                        onClick={isEdit ? onEdit : onSubmit}> 
                            {isEdit ? 'Editar Producto' : 'Registrar Producto de Car Wash'}
                         {/* Cambia el texto del botón dependiendo del estado de "isEdit"; muestra 'Editar Producto' si está en modo edición, o 'Crear Producto' si está en modo creación. */}    
                        </Button>
                    </Grid>{/* Fin del Grid */}
                </Grid>{/* Fin del Grid Principal */}
            </Container>{/* Fin del contenedor */}
        </Page>//Fin de pagina
    );// Fin del Return
};// Fin del Cost Productos

export default Salidas; // Exporta el componente "Productos" para que pueda ser utilizado en otros archivos.
