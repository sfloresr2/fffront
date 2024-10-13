import React, { useState, useEffect } from 'react';// Importación de dependencias de React
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, MenuItem, Select, InputLabel } from '@mui/material';// Importación de componentes y utilidades de Material-UI
import ApiRequest from '../../../helpers/axiosInstances';// Importación de la instancia configurada de Axios para hacer solicitudes HTTP
import { AddOutlined, EditOutlined, DeleteOutline, PictureAsPdfOutlined } from '@mui/icons-material'; // Importación de iconos de Material-UI para agregar, editar, eliminar, y exportar en PDF
import Page from '../../common/Page';// Importación de un componente de página común
import ToastAutoHide from '../../common/ToastAutoHide';// Componente para mostrar notificaciones que se ocultan automáticamente
import CommonTable from '../../common/CommonTable';// Importación de una tabla común para la visualización de datos
import jsPDF from 'jspdf'; // Importación de la biblioteca jsPDF para generar archivos PDF
import 'jspdf-autotable'; // Importación del plugin 'autotable' para generar tablas dentro de archivos PDF



const Proveedores = () => { // Definición del estado inicial para un proveedor



    const initialState = {
        id: "", // Identificador único del proveedor
        nombre: "", // Nombre del proveedor
        correo: "", // Correo electrónico del proveedor
        telefono: "", // Número de teléfono del proveedor
        direccion: "", // Dirección física del proveedor
    };



    // Definición de los diferentes estados que manejará el componente
    const [roles, setRoles] = useState([]);// Estado para almacenar la lista de roles
    const [usuariosList, setUsuariosList] = useState([]);// Estado para almacenar la lista de usuarios (proveedores)
    const [body, setBody] = useState(initialState);// Estado que almacena los datos del proveedor actual, inicializado con 'initialState'
    const [openDialog, setOpenDialog] = useState(false);// Estado para controlar la visibilidad del diálogo (modal) para agregar/editar proveedores
    const [isEdit, setIsEdit] = useState(false);// Estado booleano que indica si se está editando un proveedor existente o creando uno nuevo
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });// Estado para mostrar mensajes de éxito o error en la UI
    const [idDelete, setIdDelete] = useState(null);// Estado que almacena el ID del proveedor a eliminar
    const [openDialogDelete, setOpenDialogDelete] = useState(false);// Estado para controlar la visibilidad del diálogo de confirmación para eliminar proveedores


    
    const init = async () => {
        const { data } = await ApiRequest().get('/proveedoresp');// Llama a la API para obtener la lista de proveedores
        setUsuariosList(data);// Actualiza el estado 'usuariosList' con los datos obtenidos de la API
    };



    const columns = [
        { field: 'id', headerName: 'Codigo', width: 120 },// Columna para el ID del proveedor, con un ancho de 120px
        { field: 'nombre', headerName: 'Nombre', width: 220 },// Columna para el nombre del proveedor, con un ancho de 220px
        { field: 'correo', headerName: 'Correo', width: 220 },// Columna para el correo del proveedor, con un ancho de 220px
        { field: 'telefono', headerName: 'Telefono', width: 220 },// Columna para el teléfono del proveedor, con un ancho de 220px
        { field: 'direccion', headerName: 'Direccion', width: 220 },// Columna para la dirección del proveedor, con un ancho de 220px
        // Columna para las acciones, como editar y eliminar, con un ancho de 200px
        {
            field: '',
            headerName: 'Acciones',
            width: 200,
            renderCell: (params) => (
                // Contenedor de las acciones en forma de Stack para disponer los íconos horizontalmente
                <Stack direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
                    {/* Botón para editar un proveedor */}
                    <IconButton size='small' onClick={() => {
                        setIsEdit(true);// Activa el modo de edición
                        setBody(params.row); // Pasa los datos del proveedor seleccionado al formulario (body)
                        handleDialog();// Abre el diálogo para editar
                    }}>
                        <EditOutlined />{/* Ícono de edición */}
                    </IconButton>
                    {/* Botón para eliminar un proveedor */}
                    <IconButton size='small' onClick={() => {
                        handleDialogDelete();// Abre el diálogo de confirmación para eliminar
                        setIdDelete(params.id);// Almacena el ID del proveedor seleccionado para eliminarlo
                    }}>
                        <DeleteOutline />{/* Ícono de eliminación */}
                    </IconButton>
                </Stack>
            )
        }
    ];



    const onDelete = async () => {
        try {
            const { data } = await ApiRequest().post('/eliminar_proveedorp', { id: idDelete });// Llama a la API para eliminar el proveedor usando el ID almacenado en 'idDelete'
            setMensaje({ // Actualiza el mensaje de éxito con los datos de la respuesta de la API
                ident: new Date().getTime(),// Identificador único para forzar la actualización del mensaje
                message: data.message,// Mensaje de éxito devuelto por la API
                type: 'success'// Tipo de mensaje: éxito
            });
            handleDialogDelete();// Cierra el diálogo de confirmación de eliminación
            init();// Vuelve a cargar la lista de proveedores
        } catch ({ response }) {
            setMensaje({// Si ocurre un error, actualiza el mensaje con el error devuelto por la API
                ident: new Date().getTime(),// Identificador único para forzar la actualización del mensaje
                message: response.data.sqlMessage,// Mensaje de error devuelto por la API
                type: 'error'// Tipo de mensaje: error
            });
        }
    };



    const handleDialog = () => {// Función para abrir/cerrar el diálogo de creación/edición de proveedor
        setOpenDialog(prev => !prev);// Cambia el estado de `openDialog` a su valor opuesto (abrir/cerrar)
    };



    const handleDialogDelete = () => {// Función para abrir/cerrar el diálogo de confirmación de eliminación de proveedor
        setOpenDialogDelete(prev => !prev);// Cambia el estado de `openDialogDelete` a su valor opuesto (abrir/cerrar)
    };



    const onChange = ({ target }) => {// Función que actualiza los campos del formulario de proveedor cuando se cambian
        const { name, value } = target;// Extrae el nombre y el valor del campo modificado
        setBody({
            ...body,// Mantiene el estado actual de `body`
            [name]: value// Actualiza el campo con el nuevo valor
        });
    };



    const onSubmit = async () => {// Función para enviar los datos del formulario de creación de proveedor
        try {
            const { data } = await ApiRequest().post('/guardar_proveedorp', body);// Realiza una solicitud POST para guardar el nuevo proveedor
            handleDialog();// Cierra el diálogo de creación/edición
            setBody(initialState);// Reinicia el formulario con el estado inicial vacío
            setMensaje({
                ident: new Date().getTime(),// Identificador único para el mensaje
                message: data.message,// Mensaje de éxito recibido del servidor
                type: 'success'// Tipo de mensaje (éxito)
            });
            init();// Refresca la lista de proveedores para mostrar los cambios
            setIsEdit(false);// Asegura que no esté en modo edición
        } catch ({ response }) {
            setMensaje({// En caso de error, muestra un mensaje de error
                ident: new Date().getTime(),
                message: response.data.sqlMessage,// Mensaje de error recibido del servidor
                type: 'error'// Tipo de mensaje (error)
            });
        }
    };



    const onEdit = async () => {    // Función para enviar los datos del formulario de edición de proveedor
        try {
            const { data } = await ApiRequest().post('/editar_proveedorp', body);// Realiza una solicitud POST para actualizar el proveedor existente
            handleDialog();// Cierra el diálogo de creación/edición
            setBody(initialState);// Reinicia el formulario con el estado inicial vacío
            setMensaje({
                ident: new Date().getTime(),// Identificador único para el mensaje
                message: data.message,// Mensaje de éxito recibido del servidor
                type: 'success'// Tipo de mensaje (éxito)
            });
            init();// Refresca la lista de proveedores para mostrar los cambios
        } catch ({ response }) {
            setMensaje({// En caso de error, muestra un mensaje de error
                ident: new Date().getTime(),
                message: response.data.sqlMessage,// Mensaje de error recibido del servidor
                type: 'error'// Tipo de mensaje (error)
            });
        }
    };



    //REPORTES QUE NO SE UTILIZARON
    // Función para generar el reporte PDF con todos los usuarios
    const generatePDF = (usuarios, title) => {
        const doc = new jsPDF();
        doc.text(title, 20, 10);
        doc.autoTable({
            head: [['ID', 'Correo', 'Nombre', 'Usuario', 'Rol', 'Estado']],
            body: usuarios.map(user => [user.id, user.correo, user.nombre, user.usuario, user.rol, user.estado])
        });
        doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

    // Generar reporte de todos los usuarios
    const handleGenerateAllUsersReport = () => {
        generatePDF(usuariosList, 'Reporte de Todos los Usuarios');
    };

    // Generar reporte de usuarios activos
    const handleGenerateActiveUsersReport = () => {
        const activeUsers = usuariosList.filter(user => user.estado === 'Activo');
        generatePDF(activeUsers, 'Reporte de Usuarios Activos');
    };

    // Generar reporte de usuarios inactivos
    const handleGenerateInactiveUsersReport = () => {
        const inactiveUsers = usuariosList.filter(user => user.estado === 'Inactivo');
        generatePDF(inactiveUsers, 'Reporte de Usuarios Inactivos');
    };

    // Generar reporte de usuarios con rol ADMIN
    const handleGenerateAdminUsersReport = () => {
        const adminUsers = usuariosList.filter(user => user.rol === '1');
        generatePDF(adminUsers, 'Reporte de Usuarios ADMIN');
    };

    // Generar reporte de usuarios con rol User
    const handleGenerateUserUsersReport = () => {
        const userUsers = usuariosList.filter(user => user.rol === '2');
        generatePDF(userUsers, 'Reporte de Usuarios User');
    };

    const fetchRoles = async () => {
        try {
        const response = await ApiRequest().get('/roles'); 
        setRoles(response.data);
        } catch (error) {
        console.error('Error fetching roles data:', error);
        }
    };


   
    useEffect(() => {// useEffect es un hook de React que se ejecuta después de que el componente se monte
        fetchRoles(); // Llama a la función fetchRoles para obtener la lista de roles cuando el componente se monta.
        init();// Llama a la función init para cargar la lista de proveedores cuando el componente se monta.
    }, []);// El arreglo vacío [] indica que este efecto solo se ejecutará una vez, al montar el componente.

    

    return (// Componente JSX que define la estructura de la UI y las interacciones del módulo Proveedores de Productos
        <>
         {/* Diálogo para confirmar la eliminación de un proveedor */}
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>
                    ¿Está seguro de que desea eliminar al proveedor de productos?
                </DialogTitle>
                <DialogContent>
                    <Typography variant='h5'>Esta acción no se puede deshacer</Typography>{/* Mensaje de advertencia */}
                </DialogContent>
                <DialogActions>
                    {/* Botón para cancelar la acción de eliminación */}
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Anular Eliminacion</Button>
                    {/* Botón para confirmar la eliminación */}
                    <Button variant='contained' color='primary' onClick={onDelete}>Confirmar Eliminacion</Button>
                </DialogActions>
            </Dialog>
            {/* Diálogo para crear o editar un proveedor */}
            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                <DialogTitle>
                     {/* Título dinámico dependiendo de si se está editando o creando un proveedor */}
                    {isEdit ? 'Formulario de Edicion de Proveedor de Productos' : 'Formulario de Registro de Proveedor de Productos'}
                </DialogTitle>
                
                <DialogContent>
                    <Grid container spacing={2}>
                        
                         {/* Campo de texto para el nombre del proveedor */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='nombre'
                                value={body.nombre}// Valor actual del campo
                                onChange={onChange}// Manejador para actualizar el estado
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Nombre'
                            />
                        </Grid>
                        
                        {/* Campo de texto para el correo electrónico del proveedor */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='correo'
                                value={body.correo}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Correo Electronico'
                            />
                        </Grid>
                        
                        {/* Campo de texto para el teléfono del proveedor */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='telefono'
                                value={body.telefono}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Telefono'
                            />
                        </Grid>
                        
                        {/* Campo de texto para la dirección del proveedor */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='direccion'
                                value={body.direccion}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Direccion'
                            />
                        </Grid>
    
                    </Grid>
                </DialogContent>
                {/* Acciones del diálogo */}
                <DialogActions>
                    {/* Botón para cancelar la creación/edición */}
                    <Button variant='text' color='primary' onClick={handleDialog}>Anular Registro</Button>
                    {/* Botón para guardar el proveedor (editado o nuevo) */}
                    <Button variant='contained' color='primary' onClick={isEdit ? () => onEdit() : () => onSubmit()}>Registrar Proveedor de Productos</Button>
                </DialogActions>
            </Dialog>
            
            {/* Página principal del módulo Proveedores de Productos */}
            <Page title="FF| Proveedor Productos Car Wash">
                {/* Componente para mostrar mensajes emergentes (toasts) */}
                <ToastAutoHide message={mensaje} />
                {/* Contenedor principal */}
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        {/* Título del módulo */}
                        <Typography variant="h5">Panel de Control de Proveedores Productos de Car Wash</Typography>
                    </Box>
                    {/* Botón para agregar un nuevo proveedor */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={() => {setIsEdit(false); handleDialog(); setBody(initialState);}} startIcon={<AddOutlined />} variant='contained' color='primary'> Registrar Proveedor de Productos</Button>
                        </Grid>




                        {/* Botones de reporte de PDF con color azul más oscuro */}

                        {/*


                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateAllUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (Todos)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateActiveUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (Activos)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateInactiveUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (Inactivos)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateAdminUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (ADMIN)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateUserUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (User)</Button>
                        </Grid>
                        */}




                        {/* Componente que muestra la tabla de proveedores */}
                        <Grid item xs={12} sm={12}>
                            <CommonTable data={usuariosList} columns={columns} />{/* Tabla que recibe datos y columnas */}
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
}

export default Proveedores;// Exportación del componente Proveedores para que pueda ser utilizado en otras partes de la aplicación
