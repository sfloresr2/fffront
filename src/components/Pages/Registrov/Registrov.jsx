import React, { useState, useEffect } from 'react';// Importa React y los hooks useState y useEffect, que permiten manejar estados y efectos secundarios en componentes funcionales.
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Grid, Box, Button, Stack, IconButton, Divider, MenuItem, Select, InputLabel } from '@mui/material';// Importa varios componentes de la librería @mui/material (Material-UI), que son utilizados para construir la interfaz de usuario.
import ApiRequest from '../../../helpers/axiosInstances';// Importa la instancia de axios personalizada para realizar solicitudes HTTP.
import { AddOutlined, EditOutlined, DeleteOutline, PictureAsPdfOutlined } from '@mui/icons-material'; // Importa varios íconos de la librería @mui/icons-material, que se usan para representar acciones visualmente.
import Page from '../../common/Page';// Componente común de página para estructurar el layout
import ToastAutoHide from '../../common/ToastAutoHide';// Componente que muestra notificaciones que se ocultan automáticamente
import CommonTable from '../../common/CommonTable';// Componente de tabla reutilizable para mostrar datos
import jsPDF from 'jspdf'; // Importa la librería jsPDF, que permite generar archivos PDF desde JavaScript.
import 'jspdf-autotable'; // Importa el plugin "autotable" de jsPDF, que facilita la creación de tablas dentro de un PDF.



const Registrov = () => {


    const initialState = {// Define el estado inicial del componente Predios
        id: "",	// Identificador único del vehículo (probablemente una clave primaria).
        codigo: "",
        placa: "",// Número de placa del vehículo.
        tipo_vehiculo:"",// Tipo de vehículo (automóvil, motocicleta, etc.).
        marca: "",	// Marca del vehículo (por ejemplo, Toyota, Ford).
        modelo: "",	// Modelo del vehículo (por ejemplo, Corolla, Mustang).
        color: "",// Color del vehículo.
        uso:"",// Tipo de uso del vehículo (particular, comercial, etc.).
        linea:"",// Línea o submodelo del vehículo.
        chasis:"",// Número de chasis del vehículo.
        serie:"",// Número de serie del vehículo (similar al VIN en algunos casos).
        numero_asientos: "",// Cantidad de asientos del vehículo.
        ejes:"",// Número de ejes del vehículo.
        numero_vin: "",// Número de Identificación Vehicular (VIN), único para cada vehículo.
        motor:"",// Número o identificación del motor del vehículo.
        cilindros:"",// Número de cilindros del motor.
        c_c:"",	// Cilindrada o capacidad cúbica del motor.
        id_proveedor_vehiculo: "",// Identificación del proveedor o vendedor del vehículo.
        fecha_venta: "",	// Fecha en que el vehículo fue adquirido.
        precio_compra: "",	// Precio de compra del vehículo.
        precio_venta: ""// Valor estimado o actual del vehículo.
    };



    const formatDate = (date) => {
        if (!date) return '';// Si no se proporciona una fecha (o la fecha es inválida), devuelve una cadena vacía.
        const d = new Date(date);// Convierte la fecha proporcionada en un objeto de tipo Date.
        // Obtiene el mes de la fecha, sumándole 1 (porque los meses en JavaScript se indexan desde 0, es decir, enero = 0).
        // Se añade un '0' al inicio para asegurarse de que siempre tenga dos dígitos (por ejemplo, '03' para marzo).
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);// Obtiene el día del mes y le añade un '0' al inicio para formatearlo con dos dígitos.
        return d.getFullYear() + '-' + month + '-' + day;// Devuelve la fecha formateada en el formato 'YYYY-MM-DD', que es el formato de fecha estándar ISO 8601.
    };



    const [roles, setRoles] = useState([]); 
    // Define un estado llamado 'roles' con un array vacío como valor inicial.
    // 'roles' probablemente contendrá una lista de roles (por ejemplo, roles de usuario o proveedores).
    // 'setRoles' es la función que permite actualizar el estado 'roles'.   
    const [usuariosList, setUsuariosList] = useState([]);
    // Define un estado llamado 'usuariosList' que inicialmente es un array vacío.
    // 'usuariosList' contendrá una lista de usuarios. 
    // 'setUsuariosList' permite actualizar la lista de usuarios cuando sea necesario.
    const [body, setBody] = useState(initialState);
    // 'body' es el estado que guarda los datos del formulario, inicializado con 'initialState'.
    // 'initialState' es el objeto previamente definido que contiene la estructura de un vehículo con valores iniciales vacíos.
    // 'setBody' se utiliza para actualizar el estado 'body', generalmente cuando el usuario llena o edita el formulario.
    const [openDialog, setOpenDialog] = useState(false);
    // 'openDialog' es un booleano que controla si un diálogo (modal) está abierto o cerrado.
    // Inicialmente está en 'false' (cerrado). Se usa 'setOpenDialog' para abrir o cerrar el diálogo.
    const [isEdit, setIsEdit] = useState(false);
    // 'isEdit' es un booleano que indica si el formulario está en modo de edición o creación.
    // Si es 'true', el formulario se encuentra en modo edición; si es 'false', está en modo de creación de un nuevo elemento.
    // 'setIsEdit' cambia este valor, dependiendo de la acción que se esté realizando.
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    // 'mensaje' es un estado que almacena los detalles de un mensaje o notificación.
    // Está inicializado con un objeto que contiene:
    // - 'ident': posiblemente un identificador para el mensaje.
    // - 'message': el contenido o texto del mensaje.
    // - 'type': el tipo de mensaje (por ejemplo, error, éxito, advertencia).
    // 'setMensaje' permite actualizar estos valores, por ejemplo, después de una operación exitosa o fallida
    const [idDelete, setIdDelete] = useState(null);
    // 'idDelete' almacena el ID del elemento que se quiere eliminar.
    // Se inicializa como 'null' y se actualiza con el ID correspondiente cuando se quiere eliminar un elemento.
    // 'setIdDelete' se usa para asignar el ID del elemento que se desea eliminar.
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    // 'openDialogDelete' es un booleano que controla si se abre o cierra un diálogo de confirmación de eliminación.
    // Inicialmente está en 'false' (cerrado). Se usa 'setOpenDialogDelete' para abrir o cerrar el diálogo de eliminación.



    // Función que obtiene la lista de productos
    const init = async () => {
        // Realiza una solicitud GET a la API para obtener la lista de vehículos.
        // Usa la instancia personalizada de axios (`ApiRequest()`) para hacer la solicitud al endpoint '/vehiculos'.
        const { data } = await ApiRequest().get('/vehiculosventas');
        // Una vez que se obtiene la respuesta, se extrae la propiedad `data` (que contiene la lista de vehículos).
        // Se actualiza el estado 'usuariosList' con los datos obtenidos de la API.
        setUsuariosList(data);
    };



    // Función que obtiene la lista de proveedores
    const fetchProveedores = async () => {
        try {  
            const { data } = await ApiRequest().get('/proveedoresv'); // Realiza una solicitud GET a la API para obtener la lista de proveedores
            setRoles(data); // Actualiza el estado 'roles' con la lista de proveedores obtenida de la API
        } catch (error) {
            console.error('Error al obtener la lista de proveedores:', error); // Si ocurre un error durante la solicitud, se captura aquí y se muestra un mensaje en la consola
        }
    };



    const columns = [
        { field: 'id', headerName: 'ID', width: 120 }, // Columna que muestra el ID (código único) del vehículo. Tiene un ancho de 120 píxeles.
        { field: 'Codigo', headerName: 'Codigo', width: 120 },
        { field: 'placa', headerName: 'Placa', width: 220 }, // Columna que muestra la placa del vehículo. El ancho de la columna es de 220 píxeles.
        { field: 'tipo_vehiculo', headerName: 'Tipo vehiculo', width: 220 }, // Columna que muestra el tipo de vehículo (por ejemplo, auto, moto, camión). Ancho de 220 píxeles.
        { field: 'marca', headerName: 'Marca', width: 220 }, // Columna que muestra la marca del vehículo. Tiene un ancho de 220 píxeles.
        { field: 'modelo', headerName: 'Modelo', width: 220 },// Columna que muestra el modelo del vehículo. Ancho de 220 píxeles.
        { field: 'color', headerName: 'Color', width: 220 },// Columna que muestra el color del vehículo. Ancho de 220 píxeles.
        { field: 'uso', headerName: 'Uso', width: 220 }, // Columna que muestra el tipo de uso del vehículo (por ejemplo, particular, comercial). Ancho de 220 píxeles.
        { field: 'linea', headerName: 'Linea', width: 220 },// Columna que muestra la línea del vehículo (submodelo o categoría). Ancho de 220 píxeles.
        { field: 'chasis', headerName: 'Chasis', width: 220 },// Columna que muestra el número de chasis del vehículo. Ancho de 220 píxeles.
        { field: 'serie', headerName: 'Serie', width: 220 }, // Columna que muestra el número de serie del vehículo. Ancho de 220 píxeles.
        { field: 'numero_asientos', headerName: 'Numero de Asientos', width: 220 },// Columna que muestra el número de asientos del vehículo. Ancho de 220 píxeles.
        { field: 'ejes', headerName: 'Ejes', width: 220 },// Columna que muestra el número de ejes del vehículo. Ancho de 220 píxeles.
        { field: 'numero_vin', headerName: 'Numero de VIN', width: 220 },// Columna que muestra el número de identificación del vehículo (VIN). Ancho de 220 píxeles.
        { field: 'motor', headerName: 'Motor', width: 220 },// Columna que muestra el número del motor del vehículo. Ancho de 220 píxeles.
        { field: 'cilindros', headerName: 'Cilindros', width: 220 },// Columna que muestra el número de cilindros del motor del vehículo. Ancho de 220 píxeles.
        { field: 'c_c', headerName: 'C_C', width: 220 },// Columna que muestra la cilindrada (capacidad cúbica) del motor del vehículo. Ancho de 220 píxeles.
        { field: 'nombre_proveedor_vehiculo', headerName: 'Proveedor de Vehiculos', width: 220 },// Columna que muestra el nombre del proveedor del vehículo. Ancho de 220 píxeles.
        // Columna que muestra la fecha de compra del vehículo.
        // - 'field': 'fecha_compra' hace referencia al campo 'fecha_compra' en los datos del vehículo.
        // - 'headerName': 'Fecha Compra' es el encabezado que se verá en la tabla.
        // - 'valueFormatter': es una función que formatea la fecha de compra a un formato de fecha local en español (dd/mm/aaaa).
        //   Usa el método `toLocaleDateString` para mostrar la fecha con formato numérico para día, mes y año.
        {
            field: 'fecha_venta',
            headerName: 'Fecha Venta',
            width: 220,
            valueFormatter: (params) => {
                const fecha = new Date(params.value);
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return fecha.toLocaleDateString('es-ES', options);
            }
        },
        // Columna que muestra el precio de compra del vehículo.
        // - 'field': 'precio_compra' hace referencia al campo que almacena el precio de compra.
        // - 'headerName': 'Precio de Compra' es el nombre que se mostrará en la tabla como encabezado de la columna.
        // - 'width': Define el ancho de la columna en píxeles (220px).
        { field: 'precio_compra', headerName: 'Precio de Compra', width: 220 },
        // Columna que muestra el precio del vehículo.
        // - 'field': 'precio_vehiculo' se refiere al campo que contiene el precio del vehículo.
        // - 'headerName': 'Precio de Vehículo' es el título que aparecerá en la columna.
        // - 'width': Establece el ancho de la columna en 220px.
        { field: 'precio_venta', headerName: 'Precio de Venta', width: 220 },
        // Columna especial que renderiza acciones (botones de edición y eliminación).
        // - 'field': Se deja vacío porque no se asocia a un campo específico de los datos.
        // - 'headerName': 'Acciones' es el título que aparece en la columna, indicando que aquí se muestran las acciones.
        // - 'renderCell': Es una función que define el contenido personalizado de las celdas en esta columna.
        //   - Dentro del `renderCell`, se utiliza un `Stack` (de Material UI) para alinear los botones de edición y eliminación en fila, con un separador vertical entre ellos.
        //   - El `IconButton` de edición (`<EditOutlined />`) permite editar el vehículo cuando se hace clic. Cambia el estado `isEdit` a `true`, establece los datos del vehículo en `body` y abre el diálogo de edición.
        //   - El `IconButton` de eliminación (`<DeleteOutline />`) abre el diálogo de confirmación de eliminación y asigna el ID del vehículo a eliminar en el estado `idDelete`.
        {
            field: '',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params) => (
                <Stack direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
                    <IconButton size='small' onClick={() => {
                        setIsEdit(true);
                        setBody(params.row);
                        handleDialog();
                    }}>
                        <EditOutlined />
                    </IconButton>
                    <IconButton size='small' onClick={() => {
                        handleDialogDelete();
                        setIdDelete(params.id);
                    }}>
                        <DeleteOutline />
                    </IconButton>
                </Stack>
            )
        }
    ];



    const onDelete = async () => {
        try {
            const { data } = await ApiRequest().post('/eliminar_vehicv', { id: idDelete });// Se realiza una solicitud POST a la API para eliminar un vehículo, enviando el ID del vehículo a eliminar.
            setMensaje({// Si la eliminación es exitosa, se muestra un mensaje de éxito en una notificación.
                ident: new Date().getTime(),// Genera un identificador único basado en la fecha actual.
                message: data.message,// Mensaje que llega desde el servidor, probablemente indicando que el vehículo fue eliminado exitosamente.
                type: 'success'// Tipo de mensaje es 'success', lo que indica que es una notificación de éxito.
            });
            handleDialogDelete();// Cierra el diálogo de confirmación de eliminación.
            init();// Refresca la lista de vehículos, llamando nuevamente a la función init.
        } catch ({ response }) { // Si ocurre un error en la solicitud, se captura el mensaje de error desde la respuesta del servidor.
            setMensaje({
                ident: new Date().getTime(),// Identificador único para el mensaje de error.
                message: response.data.sqlMessage,// Mensaje de error específico que llega del servidor (posiblemente un error de SQL).
                type: 'error'// Tipo de mensaje es 'error', lo que indica que es una notificación de error.
            });
        }
    };



    const handleDialog = () => {
    // Cambia el estado de 'openDialog' entre verdadero y falso, 
    // lo que controla la visibilidad del diálogo en la interfaz de usuario.
        setOpenDialog(prev => !prev);
    };



    const handleDialogDelete = () => {
    // Cambia el estado de 'openDialogDelete' entre verdadero y falso,
    // lo que controla la visibilidad del diálogo de confirmación de eliminación en la interfaz de usuario.
        setOpenDialogDelete(prev => !prev);
    };



    const onChange = ({ target }) => {
        const { name, value } = target;// Desestructura 'target' del evento, que contiene información sobre el input que ha cambiado.
        setBody({// Actualiza el estado 'body' al agregar o modificar el campo correspondiente.
            ...body,// Mantiene las propiedades actuales del estado 'body'.
            [name]: value// Actualiza el campo específico basado en el nombre del input.
        });
    };



    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_vehicv', body);  // Realiza una solicitud POST a la API para guardar un nuevo vehículo, enviando el objeto 'body' como datos.
            handleDialog();// Cierra el diálogo de formulario después de la operación.
            setBody(initialState);// Reinicia el estado 'body' a su valor inicial para limpiar el formulario.
            setMensaje({ // Muestra un mensaje de éxito al usuario, indicando que el vehículo fue guardado correctamente.
                ident: new Date().getTime(),// Genera un identificador único basado en la fecha actual.
                message: data.message,// Mensaje de éxito proporcionado por la respuesta de la API.
                type: 'success'// Tipo de mensaje es 'success', indicando una operación exitosa.
            });
            init();// Refresca la lista de vehículos llamando a la función init.
            setIsEdit(false);// Resetea el estado 'isEdit' a 'false', indicando que no se está editando un vehículo.
        } catch ({ response }) {
            setMensaje({// Si ocurre un error durante la solicitud, se captura y se muestra un mensaje de error.
                ident: new Date().getTime(),// Genera un identificador único para el mensaje de error.
                message: response.data.sqlMessage,// Mensaje de error desde la respuesta del servidor.
                type: 'error'// Tipo de mensaje es 'error', indicando una operación fallida.
            });
        }
    };



    const onEdit = async () => {
        try {
            const { data } = await ApiRequest().post('/editar_vehicv', body); // Realiza una solicitud POST a la API para editar un vehículo existente, enviando el objeto 'body' como datos.
            handleDialog();// Cierra el diálogo de formulario después de la operación.
            setBody(initialState); // Reinicia el estado 'body' a su valor inicial para limpiar el formulario.
            setMensaje({// Muestra un mensaje de éxito al usuario, indicando que el vehículo fue editado correctamente.
                ident: new Date().getTime(),// Genera un identificador único basado en la fecha actual.
                message: data.message,// Mensaje de éxito proporcionado por la respuesta de la API.
                type: 'success'// Tipo de mensaje es 'success', indicando una operación exitosa.
            });
            init();// Refresca la lista de vehículos llamando a la función init.
        } catch ({ response }) {
            setMensaje({// Si ocurre un error durante la solicitud, se captura y se muestra un mensaje de error.
                ident: new Date().getTime(),// Genera un identificador único para el mensaje de error.
                message: response.data.sqlMessage,// Mensaje de error desde la respuesta del servidor.
                type: 'error'// Tipo de mensaje es 'error', indicando una operación fallida.
            });
        }
    };



    // Función para generar el reporte PDF con todos los vehiculos
    const generatePDF = () => {
        const doc = new jsPDF();// Crea una nueva instancia de jsPDF, que se usará para generar el PDF.
        doc.text("Reporte de Inventario Vehiculo", 20, 10);// Añade un título al PDF en la posición (20, 10).
        doc.autoTable({// Utiliza el plugin autotable para agregar una tabla al PDF.
             // Define la cabecera de la tabla con los nombres de los campos.
            head: [['id', 'placa', 'tipo_vehiculo', 'marca', 'modelo', 'color', 'uso', 'linea', 'chasis', 'serie', 'numero_asientos', 'ejes', 'numero_vin', 'motor', 'cilindros', 'c_c', 'id_proveedor_vehiculo', 'fecha_compra', 'precio_compra', 'precio_vehiculo']],
           // El cuerpo de la tabla se llena con los datos de la lista de vehículos (usuariosList).
            body: usuariosList.map(product => [
                product.id,
                product.placa,
                product.tipo_vehiculo, 
                product.marca, 
                product.modelo,
                product.color,
                product.uso,
                product.linea,
                product.chasis,
                product.serie, 
                product.numero_asientos,
                product.ejes,
                product.numero_vin, 
                product.motor,
                product.cilindros,
                product.c_c,
                product.nombre_proveedor_vehiculo,
                formatDate(product.fecha_venta), // Formatea la fecha de compra antes de agregarla a la tabla.
                product.precio_compra, 
                product.precio_venta,     
            ])
        });
        doc.save('reporte_inventario_vehiculos.pdf');// Guarda el PDF generado con el nombre 'reporte_inventario_vehiculos.pdf'.
    };
    


  //REPORTES QUE NO SE UTILIZARON
  // Función para generar el reporte de productos de "QuimicosDeLaEra"
  const generatePDFQuimicosDeLaEra = () => {
    const doc = new jsPDF();
    const productosQuimicosDeLaEra = usuariosList.filter(product => product.nombre_proveedor === 'QuimicosDeLaEra');
    doc.text("Reporte de Productos - IAA", 20, 10);
    doc.autoTable({
        head: [['ID', 'Nombre', 'Descripción', 'Cantidad', 'Precio', 'Proveedor', 'Fecha Compra', 'Fecha Vencimiento', 'Numero Factura']],
        body: productosQuimicosDeLaEra.map(product => [
            product.id, 
            product.nombre, 
            product.descripcion, 
            product.cantidad, 
            product.precio, 
            product.nombre_proveedor, 
            formatDate(product.fecha_compra), 
            formatDate(product.fecha_vencimiento), 
            product.numero_factura
        ])
    });
    doc.save('reporte_quimicosdelaera.pdf');
};



    // Función para generar el reporte de productos de "Quimicos FERKICA"
    const generatePDFFerkica = () => {
        const doc = new jsPDF();
        const productosFerkica = usuariosList.filter(product => product.nombre_proveedor === 'Quimicos FERKICA');
        doc.text("Reporte de Productos - Quimicos FERKICA", 20, 10);
        doc.autoTable({
            head: [['ID', 'Nombre', 'Descripción', 'Cantidad', 'Precio', 'Proveedor', 'Fecha Compra', 'Fecha Vencimiento', 'Numero Factura']],
            body: productosFerkica.map(product => [
                product.id, 
                product.nombre, 
                product.descripcion, 
                product.cantidad, 
                product.precio, 
                product.nombre_proveedor, 
                formatDate(product.fecha_compra), 
                formatDate(product.fecha_vencimiento), 
                product.numero_factura
            ])
        });
        doc.save('reporte_quimicos_ferkica.pdf');
    };



    // Función para generar el reporte de productos del proveedor IAA
const generatePDFIAA = () => {
    const doc = new jsPDF();// Crea una nueva instancia de jsPDF para generar el PDF.
    const vehiculosIAA = usuariosList.filter(product => product.nombre_proveedor_vehiculo === 'IAA');// Filtra la lista de usuarios para obtener solo los vehículos del proveedor 'IAA'.
    doc.text("Reporte de Vehículos - IAA", 20, 10);// Añade un título al PDF en la posición (20, 10).
    doc.autoTable({// Utiliza el plugin autotable para agregar una tabla al PDF.
        // Define la cabecera de la tabla con los nombres de los campos relevantes.
        head: [['ID', 'Placa', 'Tipo vehiculo', 'Marca', 'Modelo', 'Color', 'Uso', 'Linea', 'Chasis', 'Serie', 'Numero asientos', 'Ejes', 'Numero vin', 'Motor', 'Cilindros', 'c_c', 'Proveedor', 'Fecha venta', 'Precio compra', 'Precio venta']],
        // El cuerpo de la tabla se llena con los datos de los vehículos filtrados de IAA.
        body: vehiculosIAA.map(vehicle => [
            vehicle.id, 
            vehicle.placa,
            vehicle.marca, 
            vehicle.modelo,
            vehicle.color,
            vehicle.uso,
            vehicle.linea,
            vehicle.chasis,
            vehicle.serie,
            vehicle.numero_asientos,
            vehicle.ejes,
            vehicle.numero_vin, 
            vehicle.motor,
            vehicle.cilindros,
            vehicle.c_c, 
            vehicle.nombre_proveedor_vehiculo,
            formatDate(vehicle.fecha_venta),// Formatea la fecha de compra antes de agregarla a la tabla.
            vehicle.precio_compra, 
            vehicle.precio_venta
        ])
    });
    doc.save('reporte_vehiculos_IAA.pdf');// Guarda el PDF generado con el nombre 'reporte_vehiculos_IAA.pdf'.
};



// Función para generar el reporte de productos del proveedor Autowini
const generatePDFAutowini = () => {
    const doc = new jsPDF();// Crea una nueva instancia de jsPDF para generar el PDF.
    const vehiculosAutowini = usuariosList.filter(product => product.nombre_proveedor_vehiculo === 'Autowini');// Filtra la lista de usuarios para obtener solo los vehículos del proveedor 'Autowini'.
    doc.text("Reporte de Vehículos - Autowini", 20, 10);// Añade un título al PDF en la posición (20, 10).
    doc.autoTable({// Utiliza el plugin autotable para agregar una tabla al PDF.
       // Define la cabecera de la tabla con los nombres de los campos relevantes.
        head: [['ID', 'Placa', 'Tipo vehiculo', 'Marca', 'Modelo', 'Color', 'Uso', 'Linea', 'Chasis', 'Serie', 'Numero asientos', 'Ejes', 'Numero vin', 'Motor', 'Cilindros', 'c_c', 'Proveedor', 'Fecha venta', 'Precio compra', 'Precio venta']],
         // El cuerpo de la tabla se llena con los datos de los vehículos filtrados de Autowini.
        body: vehiculosAutowini.map(vehicle => [
            vehicle.id, 
            vehicle.placa,
            vehicle.marca, 
            vehicle.modelo,
            vehicle.color,
            vehicle.uso,
            vehicle.linea,
            vehicle.chasis,
            vehicle.serie,
            vehicle.numero_asientos,
            vehicle.ejes,
            vehicle.numero_vin, 
            vehicle.motor,
            vehicle.cilindros,
            vehicle.c_c,   
            vehicle.nombre_proveedor_vehiculo,
            formatDate(vehicle.fecha_venta),// Formatea la fecha de compra antes de agregarla a la tabla.
            vehicle.precio_compra, 
            vehicle.precio_venta
        ])
    });
    doc.save('reporte_vehiculos_Autowini.pdf');// Guarda el PDF generado con el nombre 'reporte_vehiculos_Autowini.pdf'.
};



    // Al cargar el componente, obtenemos los productos y proveedores
    useEffect(() => {
        init();// Llama a la función init para obtener la lista de vehículos.
        fetchProveedores(); // Carga los proveedores a través de la función fetchProveedores.
    }, []);// La lista vacía [] como segundo argumento asegura que esto solo se ejecute una vez al montar el componente.



    return (
        <>
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>¿Eliminar Vehiculo?</DialogTitle>
                <DialogContent>
                    <Typography variant='h5'>Esta acción no se puede deshacer</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={onDelete}>Aceptar</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                <DialogTitle>{isEdit ? 'Formulario Editar Vehiculo' : 'Formulario Crear Vehiculo'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='codigo'
                            value={body.codigo}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Codigo'
                        />
                    </Grid>

                    
                    
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='placa'
                            value={body.placa}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Placa'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='tipo_vehiculo'
                            value={body.tipo_vehiculo}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Tipo vehiculo'
                        />
                    </Grid>


                    
                    
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='marca'
                            value={body.marca}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Marca'
                        />
                    </Grid>



                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='modelo'
                            value={body.modelo}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Modelo'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='color'
                            value={body.color}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Color'
                        />
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='uso'
                            value={body.uso}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Uso'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='linea'
                            value={body.linea}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Linea'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='chasis'
                            value={body.chasis}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Chasis'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='serie'
                            value={body.serie}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Serie'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='numero_asientos'
                            value={body.numero_asientos}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Numero de Asientos'
                        />
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='ejes'
                            value={body.ejes}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Ejes'
                        />
                    </Grid>



                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='numero_vin'
                            value={body.numero_vin}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Numero de VIN'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='motor'
                            value={body.motor}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Motor'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='cilindros'
                            value={body.cilindros}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Cilindros'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='c_c'
                            value={body.c_c}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='c_c'
                        />
                    </Grid>



                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="id_proveedor_vehiculo">Proveedor Vehiculo</InputLabel>
                        <Select
                            name="id_proveedor_vehiculo"
                            value={body.id_proveedor_vehiculo || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {roles.map((id_prov) => (
                                <MenuItem key={id_prov.id} value={id_prov.id}>
                                    {id_prov.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>


                    <Grid item xs={12} sm={6}>
                        <TextField
                            type='date'
                            margin='normal'
                            name='fecha_venta'
                            value={formatDate(body.fecha_venta)}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Fecha Venta'
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>




                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='precio_compra'
                            value={body.precio_compra}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Precio Compra'
                        />
                    </Grid>



                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='precio_venta'
                            value={body.precio_venta}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Precio Venta'
                        />
                    </Grid>

                    
                        
                        
                        
                        
                        
                        







                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialog}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>
                        {isEdit ? 'Editar Vehiculo' : 'Agregar Vehiculo'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Page title="FF| Registro Vehiculos Vendidos">
                <ToastAutoHide message={mensaje} />
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h5">Registro Vehiculos Vendidos</Typography>
                    </Box>
                    <Grid container spacing={2}>

                        {
                        /*

                        <Grid item xs={12} sm={3}>
                           <Button onClick={() => {setIsEdit(false); handleDialog(); setBody(initialState);}} startIcon={<AddOutlined />} variant='contained' color='primary'> Agregar Producto</Button>
                        </Grid> 

                        */

}



                        <Grid item xs={12} sm={3}>
                            <Button onClick={generatePDF} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'> Reporte Todos Los Vehiculos</Button>
                        </Grid>
                        {/*
                        <Grid item xs={12} sm={3}>
                            <Button onClick={generatePDFQuimicosDeLaEra} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'> Reporte IAA</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={generatePDFFerkica} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'> Reporte Autowini</Button>
                        </Grid>
*/
}

<Grid item xs={12} sm={3}>
    <Button onClick={generatePDFIAA} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'>Reporte IAA</Button>
</Grid>
<Grid item xs={12} sm={3}>
    <Button onClick={generatePDFAutowini} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'>Reporte Autowini</Button>
</Grid>




                        <Grid item xs={12} sm={12}>
                            <CommonTable data={usuariosList} columns={columns} />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
}

export default Registrov;
