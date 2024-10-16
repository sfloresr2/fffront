import React, { useState, useEffect } from 'react';// Importa React y los hooks useState y useEffect desde la librería 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Grid, Box, Button, Stack, IconButton, Divider, MenuItem, Select, InputLabel } from '@mui/material';// Importa varios componentes de la librería Material-UI para la interfaz de usuario (inputs, diálogos, tipografía, botones, etc.)
import ApiRequest from '../../../helpers/axiosInstances';// Importa una instancia personalizada de Axios, llamada 'ApiRequest', para manejar solicitudes HTTP
import { AddOutlined, EditOutlined, DeleteOutline, PictureAsPdfOutlined } from '@mui/icons-material'; // Importa íconos específicos de Material-UI, como los de añadir, editar, eliminar y un ícono de PDF
import Page from '../../common/Page';// Importa un componente de página común, probablemente para estructurar la página o configurar algunas propiedades generales
import ToastAutoHide from '../../common/ToastAutoHide';// Importa un componente de notificaciones automáticas para mostrar mensajes temporales, posiblemente con estilos y opciones comunes
import CommonTable from '../../common/CommonTable';// Importa una tabla común, lo que sugiere que es un componente reutilizable para mostrar datos en forma tabular
import jsPDF from 'jspdf'; // Importa la librería jsPDF, que permite generar archivos PDF en el lado del cliente
import 'jspdf-autotable'; // Importa el plugin 'autotable' de jsPDF, que facilita la creación de tablas dentro de los PDF



const Salidasre = () => {// Definición del componente funcional 'Inventario'
    const initialState = {// Definición de un objeto 'initialState', que contiene el estado inicial del inventario
        id: "", // Campo para el identificador único del producto (probablemente generado automáticamente)
        codigo: "",
        nombre: "", // Campo para el nombre del producto
        descripcion: "", // Campo para la descripción del producto
        id_proveedor: "", // Campo para almacenar el ID del proveedor asociado al producto
        fecha_salida: "", // Campo para la fecha de compra del producto
       
        cantidad: "", // Campo para la cantidad comprada del producto
        precio: "", // Campo para el precio del producto
        nombre_proveedor: "", // Campo para almacenar el nombre del proveedor (probablemente traído desde otra tabla o fuente)
       
    };//Fin de la constante inventario



    const formatDate = (date) => { // Función 'formatDate' para formatear una fecha en el formato 'YYYY-MM-DD'
        if (!date) return ''; // Verifica si no se ha proporcionado una fecha, y en ese caso, devuelve una cadena vacía
        const d = new Date(date); // Crea un objeto de tipo 'Date' usando la fecha proporcionada
        const month = ('0' + (d.getMonth() + 1)).slice(-2);// Obtiene el mes de la fecha y le suma 1 (porque los meses en JavaScript van de 0 a 11) Luego, agrega un '0' delante para asegurar que siempre haya dos dígitos, y usa 'slice(-2)' para tomar solo los últimos dos caracteres (esto asegura que si el mes es un número de un dígito, tenga un '0' delante)
        const day = ('0' + d.getDate()).slice(-2);// De manera similar, obtiene el día del mes y agrega un '0' delante si es necesario
        return d.getFullYear() + '-' + month + '-' + day;// Retorna la fecha formateada en el formato 'YYYY-MM-DD'
    };//fin de la constante fecha



    const [roles, setRoles] = useState([]); // Estado para almacenar la lista de roles (parece que aquí se refiere a una lista de proveedores, aunque el nombre es 'roles')
    const [usuariosList, setUsuariosList] = useState([]);// Estado para almacenar una lista de usuarios, posiblemente relacionado con los proveedores o productos
    const [body, setBody] = useState(initialState);// Estado que contiene el cuerpo del formulario o los datos del producto/proveedor, inicializado con 'initialState'
    const [openDialog, setOpenDialog] = useState(false);// Estado para controlar la apertura o cierre de un diálogo (modal), por defecto está cerrado (false)
    const [isEdit, setIsEdit] = useState(false);// Estado para identificar si el formulario está en modo edición (true) o creación (false)
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });// Estado para manejar mensajes de retroalimentación, que incluyen un identificador (ident), un mensaje y un tipo (éxito, error, etc.)
    const [idDelete, setIdDelete] = useState(null);// Estado para almacenar el ID del elemento que se va a eliminar, por defecto es 'null'
    const [openDialogDelete, setOpenDialogDelete] = useState(false);// Estado para controlar la apertura o cierre de un diálogo de confirmación de eliminación, por defecto está cerrado (false)
   


    const init = async () => {// Función 'init' que obtiene la lista de productos desde la API
        const { data } = await ApiRequest().get('/productossa');// Realiza una petición GET a la API en la ruta '/productos' usando la instancia de Axios 'ApiRequest'
        setUsuariosList(data);// Una vez que los datos han sido obtenidos (productos), actualiza el estado 'usuariosList' con los datos recibidos
    };//Fin de la funcion init



    const fetchProveedores = async () => {// Función 'fetchProveedores' que obtiene la lista de proveedores desde la API
        try {// Realiza una petición GET a la API en la ruta '/proveedores' usando la instancia de Axios 'ApiRequest' Asegúrate de que la ruta de la API sea la correcta
            const { data } = await ApiRequest().get('/proveedores'); // Asegúrate que la ruta sea la correcta
            setRoles(data); // Actualiza el estado con la lista de proveedores
        } catch (error) {// Actualiza el estado 'roles' con los datos de proveedores obtenidos
            console.error('Error al obtener la lista de proveedores:', error);// En caso de que ocurra un error durante la solicitud, lo captura y muestra en la consola
        }//Fin del catch
    };//Fin del fetchproveedores



    const columns = [// Definición de las columnas para una tabla, probablemente usando un componente de tabla como DataGrid
        { field: 'id', headerName: 'ID', width: 120 },// Columna para mostrar el código del producto
        { field: 'codigo', headerName: 'Codigo', width: 120 },
        { field: 'nombre', headerName: 'Nombre Producto', width: 220 },// Columna para mostrar el nombre del producto
        { field: 'descripcion', headerName: 'Descripcion', width: 220 },// Columna para mostrar la descripción del producto
        { field: 'nombre_proveedor', headerName: 'Proveedor', width: 220 },// Columna para mostrar el nombre del proveedor del producto
        {
            // Columna para mostrar la fecha de compra del producto
            field: 'fecha_salida',
            headerName: 'Fecha Salida',
            width: 220,
            // Formato personalizado para la fecha, que transforma el valor recibido en una fecha con formato 'DD/MM/YYYY'
            valueFormatter: (params) => {
                const fecha = new Date(params.value);
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return fecha.toLocaleDateString('es-ES', options);// Convierte la fecha al formato español 'DD/MM/YYYY'
            }//Fin del valueFormatter
        },//Fin del field de fecha de compra
        
        { field: 'cantidad', headerName: 'Cantidad', width: 220 },// Columna para mostrar la cantidad de productos comprados
        { field: 'precio', headerName: 'Precio', width: 220 },// Columna para mostrar el precio del producto
        
        // Columna para mostrar las acciones (editar y eliminar) para cada fila de la tabla
        {
            field: '',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params) => (// Renderiza las acciones en una celda, usando 'renderCell' para definir el contenido personalizado
                 // Usa Stack para alinear los botones de acción en una fila, separados por un Divider
                <Stack direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
                    {/* Botón para editar el producto */}
                    <IconButton size='small' onClick={() => { 
                        setIsEdit(true);// Cambia el estado a modo de edición
                        setBody(params.row);// Coloca la fila actual en el estado 'body' para editar
                        handleDialog();// Abre el diálogo de edición
                    }}>
                        <EditOutlined />{/* Ícono de edición */}
                    </IconButton>
                    {/* Botón para eliminar el producto */}
                    <IconButton size='small' onClick={() => {
                        handleDialogDelete();// Abre el diálogo de confirmación de eliminación
                        setIdDelete(params.id); // Guarda el ID del producto a eliminar
                    }}>
                        <DeleteOutline /> {/* Ícono de eliminación */}
                    </IconButton>
                </Stack>
            )
        }
    ];



    const onDelete = async () => {// Función 'onDelete' que maneja la eliminación de un producto
        try {
            const { data } = await ApiRequest().post('/eliminar_products', { id: idDelete });// Realiza una solicitud POST a la API en la ruta '/eliminar_product' enviando el ID del producto a eliminar
            setMensaje({// Si la eliminación es exitosa, actualiza el estado 'mensaje' con un mensaje de éxito
                ident: new Date().getTime(),// Genera un identificador único basado en la hora actual
                message: data.message,// El mensaje de éxito recibido desde la API
                type: 'success'// Tipo de mensaje: éxito
            });//   Fin del setMensaje
            handleDialogDelete();// Cierra el diálogo de confirmación de eliminación
            init();// Llama a la función 'init' para volver a cargar la lista de productos después de la eliminación
        } catch ({ response }) { // Si ocurre un error, actualiza el estado 'mensaje' con el mensaje de error recibido desde la API
            setMensaje({
                ident: new Date().getTime(),// Genera un identificador único
                message: response.data.sqlMessage,// El mensaje de error recibido desde la respuesta de la API
                type: 'error'// Tipo de mensaje: error
            });//Fin del setMensaje
        }//Fin del catch
    };//Fin de la funcion Delete



    const handleDialog = () => {// Función 'handleDialog' que alterna la visibilidad del diálogo (modal)
        // Utiliza 'setOpenDialog' para invertir el valor actual del estado 'openDialog'
       // Si 'openDialog' es 'true', lo cambiará a 'false' (cerrando el diálogo), y viceversa
        setOpenDialog(prev => !prev);
    };



    const handleDialogDelete = () => {// Función 'handleDialogDelete' que alterna la visibilidad del diálogo de confirmación de eliminación
        // Utiliza 'setOpenDialogDelete' para invertir el valor actual del estado 'openDialogDelete'
       // Si 'openDialogDelete' es 'true', lo cambiará a 'false' (cerrando el diálogo de eliminación), y viceversa
        setOpenDialogDelete(prev => !prev);
    };



    const onChange = ({ target }) => {// Función 'onChange' que maneja los cambios en los campos del formulario
        const { name, value } = target; // Desestructura 'name' y 'value' del 'target', que es el elemento que disparó el cambio (por ejemplo, un input)
        setBody({// Actualiza el estado 'body' con el nuevo valor del campo correspondiente, manteniendo los demás campos igual
            ...body,// Copia los valores actuales de 'body'
            [name]: value // Actualiza el campo correspondiente con el nuevo valor
        });//Fin del setBody
    }; //Fin del const onChange



    const onSubmit = async () => {// Función 'onSubmit' que maneja el envío de los datos del formulario
        try {
            const { data } = await ApiRequest().post('/guardar_products', body);// Realiza una solicitud POST a la API en la ruta '/guardar_product' con los datos del producto en el cuerpo ('body')
            handleDialog();// Cierra el diálogo de edición (si estaba abierto)
            setBody(initialState);// Restablece el estado 'body' a su valor inicial después de enviar los datos
            setMensaje({ // Muestra un mensaje de éxito con la respuesta de la API
                ident: new Date().getTime(), // Genera un identificador único basado en la hora actual
                message: data.message,// El mensaje de éxito recibido desde la API
                type: 'success' // Tipo de mensaje: éxito
            });
            init();// Vuelve a cargar la lista de productos para reflejar el nuevo producto guardado
            setIsEdit(false);// Cambia el estado 'isEdit' a 'false' para salir del modo de edición
        } catch ({ response }) {// Si ocurre un error en la solicitud, muestra un mensaje de error
            setMensaje({
                ident: new Date().getTime(),// Genera un identificador único
                message: response.data.sqlMessage,// El mensaje de error recibido desde la respuesta de la API
                type: 'error'// Tipo de mensaje: error
            });//Fin del SetMensaje 
        }//Fin dle catch
    };//Fin del OnSubmit



    const onEdit = async () => {// Función 'onEdit' que maneja la edición de un producto existente
        try {
            const { data } = await ApiRequest().post('/editar_products', body);// Realiza una solicitud POST a la API en la ruta '/editar_product' con los datos del producto en el cuerpo ('body')
            handleDialog();// Cierra el diálogo de edición (si estaba abierto)
            setBody(initialState);// Restablece el estado 'body' a su valor inicial después de enviar los datos
            setMensaje({// Muestra un mensaje de éxito con la respuesta de la API
                ident: new Date().getTime(),// Genera un identificador único basado en la hora actual
                message: data.message,// El mensaje de éxito recibido desde la API
                type: 'success'// Tipo de mensaje: éxito
            });//Fin del setMensaje
            init();// Vuelve a cargar la lista de productos para reflejar la edición realizada
        } catch ({ response }) {// Si ocurre un error en la solicitud, muestra un mensaje de error
            setMensaje({
                ident: new Date().getTime(),// Genera un identificador único
                message: response.data.sqlMessage,// El mensaje de error recibido desde la respuesta de la API
                type: 'error'// Tipo de mensaje: error
            });//Fin del setMensaje
        }//Fin del catch
    };//Fin de la funcion onEdit



    const generatePDF = () => {// Función para generar el reporte PDF con todos los productos
        const doc = new jsPDF();// Crea una nueva instancia de jsPDF
        doc.text("Reporte de Inventario", 20, 10);// Añade un título en la posición (20, 10) en la página
        doc.autoTable({// Utiliza el plugin autoTable de jsPDF para crear una tabla en el PDF
            head: [['ID', 'Nombre', 'Descripción',  'Proveedor',  'Fecha Compra',  'Cantidad', 'Precio', 'Subtotal']],// Definición de la cabecera de la tabla con los nombres de las columnas
            body: usuariosList.map(product => [ // El cuerpo de la tabla contiene los datos de la lista de productos 'usuariosList'
                product.id, // ID del producto
                product.nombre, // Nombre del producto
                product.descripcion,// Descripción del producto
                product.nombre_proveedor,// Nombre del proveedor
                formatDate(product.fecha_compra),// Fecha de compra (formateada)
               
                product.cantidad, // Cantidad de productos
                product.precio,// Precio unitario
                product.subtotal// Subtotal (cantidad * precio)
            ]) // Fin del body
        }); //Fin del doc
        doc.save('reporte_inventario.pdf'); // Guarda el archivo PDF con el nombre 'reporte_inventario.pdf'
    };//Fin del reporte


    
    const generatePDFQuimicosDeLaEra = () => {// Función para generar el reporte de productos de "QuimicosDeLaEra"
        const doc = new jsPDF();// Crea una nueva instancia de jsPDF
        const productosQuimicosDeLaEra = usuariosList.filter(product => product.nombre_proveedor === 'QuimicosDeLaEra');// Filtra los productos que tienen como proveedor "QuimicosDeLaEra"
        doc.text("Reporte de Productos - QuimicosDeLaEra", 20, 10);// Añade el título del reporte en la posición (20, 10) en la página
        doc.autoTable({// Utiliza el plugin autoTable de jsPDF para crear la tabla en el PDF
            head: [['ID', 'Nombre', 'Descripción',  'Proveedor',  'Fecha Compra',  'Cantidad', 'Precio', 'Subtotal']],// Definición de la cabecera de la tabla con los nombres de las columnas
            body: productosQuimicosDeLaEra.map(product => [ // El cuerpo de la tabla contiene los datos filtrados de "QuimicosDeLaEra"
                product.id, // ID del producto
                product.nombre, // Nombre del producto
                product.descripcion,// Descripción del producto
                product.nombre_proveedor,// Nombre del proveedor
                formatDate(product.fecha_compra),// Fecha de compra (formateada)
                
                product.cantidad, // Cantidad de productos
                product.precio,// Precio unitario
                product.subtotal// Subtotal (cantidad * precio)
            ])//Fin del body
        });//Fin del autoTable
        doc.save('reporte_quimicosdelaera.pdf');// Guarda el archivo PDF con el nombre 'reporte_quimicosdelaera.pdf'
    };//Fin del reporte


    
    const generatePDFFerkica = () => {// Función para generar el reporte de productos de "Quimicos FERKICA"
        const doc = new jsPDF();// Crea una nueva instancia de jsPDF
        const productosFerkica = usuariosList.filter(product => product.nombre_proveedor === 'Quimicos FERKICA');// Filtra los productos que tienen como proveedor "Quimicos FERKICA"
        doc.text("Reporte de Productos - Quimicos FERKICA", 20, 10);// Añade el título del reporte en la posición (20, 10) en la página
        doc.autoTable({ // Utiliza el plugin autoTable de jsPDF para crear la tabla en el PDF
            head: [['ID', 'Nombre', 'Descripción',  'Proveedor',  'Fecha Compra', 'Cantidad', 'Precio', 'Subtotal']],// Definición de la cabecera de la tabla con los nombres de las columnas
            body: productosFerkica.map(product => [// El cuerpo de la tabla contiene los datos filtrados de "Quimicos FERKICA"
                product.id, // ID del producto
                product.nombre, // Nombre del producto
                product.descripcion,// Descripción del producto
                product.nombre_proveedor,// Nombre del proveedor
                formatDate(product.fecha_compra),// Fecha de compra (formateada)
                
                product.cantidad, // Cantidad de productos
                product.precio,// Precio unitario
                product.subtotal// Subtotal (cantidad * precio)
            ]) //Fin del body
        });//Fin del autotable
        doc.save('reporte_quimicos_ferkica.pdf');// Guarda el archivo PDF con el nombre 'reporte_quimicos_ferkica.pdf'
    };//Fin del reporte

    

    useEffect(() => {
        init();// Llama a la función init para obtener la lista de productos
        fetchProveedores();// Llama a la función fetchProveedores para obtener la lista de proveedores
        // Esta dependencia vacía significa que solo se ejecutará una vez al montar el componente
        // El efecto solo se ejecutará una vez, ya que el array de dependencias está vacío
    }, []);



    return (
        <>
            {/* Dialog para confirmar la eliminación de un producto */}
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                 {/* Título del diálogo */}
                <DialogTitle>¿Está seguro de que desea eliminar el producto?</DialogTitle>
                {/* Contenido del diálogo con un mensaje informativo */}
                <DialogContent>
                    <Typography variant='h5'>Esta acción no se puede deshacer</Typography>
                </DialogContent>
                {/* Botones para cancelar o aceptar la eliminación */}
                <DialogActions>
                    {/* Botón para cancelar la operación */}
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Anular Eliminacion</Button>
                    {/* Botón para confirmar la eliminación */}
                    <Button variant='contained' color='primary' onClick={onDelete}>Confirmar Eliminacion</Button>
                </DialogActions>
            </Dialog>

            
            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                {/* Título dinámico que cambia dependiendo de si es edición o creación */}
                <DialogTitle>{isEdit ? 'Formulario de Edicion de Producto' : 'Formulario de Registro de Productos'}</DialogTitle>


                <DialogContent>
                    <Grid container spacing={2}>
                    
                       {/* Grid item para el campo de nombre del producto */}
                       <Grid item xs={12}>
                            {/* Campo de texto para el nombre del producto */}
                            <TextField
                                margin='normal'// Espaciado normal alrededor del campo de texto
                                name='codigo'// Asocia el campo con el nombre "nombre" en el estado
                                value={body.codigo}// El valor actual del campo se obtiene del estado 'body.nombre'
                                onChange={onChange}// Llama a la función onChange para actualizar el estado cuando el usuario escribe
                                variant='outlined'// Estilo del campo de texto (borde contorneado)
                                size='small'// Tamaño del campo (pequeño)
                                color='primary'// Color del campo, usando el esquema de colores 'primary'
                                fullWidth// Hace que el campo ocupe todo el ancho disponible
                                label='Codigo'// Etiqueta que se muestra en el campo
                            />
                        </Grid>                 
                    
                    
                    
                    {/* Grid item para el campo de nombre del producto */}
                        <Grid item xs={12}>
                            {/* Campo de texto para el nombre del producto */}
                            <TextField
                                margin='normal'// Espaciado normal alrededor del campo de texto
                                name='nombre'// Asocia el campo con el nombre "nombre" en el estado
                                value={body.nombre}// El valor actual del campo se obtiene del estado 'body.nombre'
                                onChange={onChange}// Llama a la función onChange para actualizar el estado cuando el usuario escribe
                                variant='outlined'// Estilo del campo de texto (borde contorneado)
                                size='small'// Tamaño del campo (pequeño)
                                color='primary'// Color del campo, usando el esquema de colores 'primary'
                                fullWidth// Hace que el campo ocupe todo el ancho disponible
                                label='Nombre Producto'// Etiqueta que se muestra en el campo
                            />
                        </Grid>


                        <Grid item xs={12}>
                            {/* Grid item para el campo de descripción del producto */}
                            <TextField
                                margin='normal'// Espaciado normal alrededor del campo de texto
                                name='descripcion'// Asocia el campo con el nombre "descripcion" en el estado
                                value={body.descripcion}// El valor actual del campo se obtiene del estado 'body.descripcion'
                                onChange={onChange}// Llama a la función onChange para actualizar el estado cuando el usuario escribe
                                variant='outlined'// Estilo del campo de texto (borde contorneado)
                                size='small'// Tamaño del campo (pequeño)
                                color='primary'// Color del campo, usando el esquema de colores 'primary'
                                fullWidth// Hace que el campo ocupe todo el ancho disponible
                                label='Descripción Producto'// Etiqueta que se muestra en el campo
                            />
                        </Grid>


                        <Grid item xs={12}>
                            {/* Etiqueta para el campo de selección de proveedor */}
                            <InputLabel htmlFor="id_proveedor">Proveedor</InputLabel>
                            {/* Campo de selección (dropdown) para el proveedor */}
                            <Select
                                name="id_proveedor"// Asocia el campo con el nombre "id_proveedor" en el estado
                                value={body.id_proveedor || ''}// El valor actual del campo se obtiene del estado 'body.id_proveedor'
                                onChange={onChange}// Llama a la función onChange para actualizar el estado cuando el usuario selecciona un proveedor
                                variant="outlined"// Estilo del campo de selección con borde contorneado
                                size="small"// Tamaño del campo (pequeño)
                                fullWidth// Hace que el campo ocupe todo el ancho disponible
                            >
                                {/* Mapea los proveedores desde el estado 'roles' y los muestra en el menú desplegable */}
                                {roles.map((id_pro) => (
                                    <MenuItem key={id_pro.id} value={id_pro.id}>
                                        {/* Muestra el nombre del proveedor como texto en cada opción */}
                                        {id_pro.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>


                        <Grid item xs={12}>
                            {/* Grid item para el campo de fecha de compra */}
                            <TextField
                                type='date'// Define el tipo de campo como 'date', lo que muestra un selector de fecha en el navegador
                                margin='normal'// Aplica un margen estándar alrededor del campo de texto
                                name='fecha_salida'// Asocia el campo con el nombre "fecha_compra" en el estado
                                value={formatDate(body.fecha_compra)}// Muestra el valor formateado de la fecha desde el estado 'body.fecha_compra'
                                onChange={onChange}// Llama a la función onChange para actualizar el estado cuando el usuario selecciona o cambia la fecha
                                variant='outlined'// Estilo del campo de texto con borde contorneado
                                size='small'// Tamaño del campo (pequeño)
                                color='primary'// Color del campo utilizando el esquema de colores 'primary'
                                fullWidth// Hace que el campo ocupe todo el ancho disponible en su contenedor
                                label='Fecha de Salida'// Etiqueta que se muestra en el campo
                                InputLabelProps={{ shrink: true }}// Mantiene la etiqueta siempre visible aunque el campo esté vacío
                            />
                        </Grid>


                 


                        <Grid item xs={12}>
                            {/* Grid item para el campo de cantidad de producto */}
                            <TextField
                                margin='normal'// Aplica un margen estándar alrededor del campo de texto
                                name='cantidad'// Asocia el campo con el nombre "cantidad" en el estado
                                value={body.cantidad}// Muestra el valor actual de la cantidad desde el estado 'body.cantidad'
                                onChange={onChange}// Llama a la función onChange para actualizar el estado cuando el usuario introduce una cantidad
                                variant='outlined'// Estilo del campo con borde contorneado
                                size='small'// Tamaño del campo (pequeño)
                                color='primary'// Color del campo utilizando el esquema de colores 'primary'
                                fullWidth// Hace que el campo ocupe todo el ancho disponible en su contenedor
                                label='Cantidad de Producto'// Etiqueta que se muestra en el campo
                            />
                        </Grid>


                        <Grid item xs={12}>
                            {/* Grid item para el campo de precio */}
                            <TextField
                                margin='normal'// Aplica un margen estándar alrededor del campo de texto
                                name='precio'// Asocia el campo con el nombre "precio" en el estado
                                value={body.precio}// Muestra el valor actual del precio desde el estado 'body.precio'
                                onChange={onChange}// Llama a la función onChange para actualizar el estado cuando el usuario introduce un precio
                                variant='outlined'// Estilo del campo con borde contorneado
                                size='small' // Tamaño del campo (pequeño)
                                color='primary'// Color del campo utilizando el esquema de colores 'primary'
                                fullWidth// Hace que el campo ocupe todo el ancho disponible en su contenedor
                                label='Precio'// Etiqueta que se muestra en el campo
                            />
                        </Grid>
                    </Grid>
                </DialogContent>


                <DialogActions>
                    {/* Botón de cancelar */}
                    <Button variant='text' color='primary' onClick={handleDialog}>Cancelar</Button>
                    {/* Botón para enviar el formulario: edit o agregar dependiendo del estado */}
                    <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>
                        {/* Muestra el texto según el estado 'isEdit' */}
                        {isEdit ? 'Editar Producto' : 'Registrar Producto'}
                    </Button>
                </DialogActions>


            </Dialog>


        
            <Page title="FF| Registro Salidas Productos">
                 {/* Componente ToastAutoHide para mostrar mensajes de éxito o error */}
                <ToastAutoHide message={mensaje} />
                 {/* Contenedor principal con un ancho máximo de 'lg' (large) */}
                <Container maxWidth='lg'>
                    {/* Box que aplica un padding-bottom (pb) de 5 unidades */}
                    <Box sx={{ pb: 5 }}>
                        {/* Título principal del módulo de inventario */}
                        <Typography variant="h5">Inventario del Car Wash</Typography>
                    </Box>



                    {/* Grid container que contiene los elementos del formulario u otras partes de la UI */}
                    <Grid container spacing={2}>



                        {/*
                        <Grid item xs={12} sm={3}>
                           <Button onClick={() => {setIsEdit(false); handleDialog(); setBody(initialState);}} startIcon={<AddOutlined />} variant='contained' color='primary'> Agregar Producto</Button>
                        </Grid> 

                        */}



                        <Grid item xs={12} sm={3}>
                            {/* Botón para generar el reporte PDF general de inventario */}
                            <Button onClick={generatePDF} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'> Informe General de Productos</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            {/* Botón para generar el reporte PDF de productos "QuimicosDeLaEra" */}
                            <Button onClick={generatePDFQuimicosDeLaEra} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'> Informe General de Productos de QuimicosDeLaEra</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            {/* Botón para generar el reporte PDF de productos "Quimicos FERKICA" */}
                            <Button onClick={generatePDFFerkica} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'> Informe General de Productos de Quimicos FERKICA</Button>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            {/* Componente para mostrar la tabla con los datos de los productos */}
                            <CommonTable data={usuariosList} columns={columns} />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
}

export default Salidasre;// Exporta el componente 'Inventario' para que pueda ser utilizado en otras partes de la aplicación