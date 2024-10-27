import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Grid, Box, Button, Stack, IconButton, Divider, MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { EditOutlined, DeleteOutline, PictureAsPdfOutlined, InfoOutlined  } from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';

// Componente para mostrar los detalles de la compra
const ProductDetailsDialog = ({ open, onClose, details }) => {
    return (
        <Dialog maxWidth='md' open={open} onClose={onClose}>
            <DialogTitle>Detalles de Compra</DialogTitle>
            <DialogContent>
                {details.length > 0 ? (
                    details.map((detail, index) => (
                        <Typography key={index}>
                            Producto: {detail.nombre_producto} - Cantidad: {detail.cantidad} - Precio: {detail.precio}
                        </Typography>
                    ))
                ) : (
                    <Typography>No se encontraron detalles para esta compra.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};

const Detalles = () => {
    const initialState = {
        id_compra: "",
        id_proveedor: "",
        fecha_compra: "",
        nombre_proveedor: "",
        total: "",
    };

    const [roles, setRoles] = useState([]);
    const [usuariosList, setUsuariosList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [productDetails, setProductDetails] = useState([]); // Estado para los detalles del producto
    const [openProductDetails, setOpenProductDetails] = useState(false); // Control del diálogo de detalles

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return d.getFullYear() + '-' + month + '-' + day;
    };

    const init = async () => {
        const { data } = await ApiRequest().get('/comprasdet');
        const usuariosListConId = data.map(compra => ({
            ...compra,
            id: compra.id_compra
        }));
        
        setUsuariosList(usuariosListConId);
    };

    const fetchProveedores = async () => {
        try {
            const { data } = await ApiRequest().get('/proveedores');
            setRoles(data);
        } catch (error) {
            console.error('Error al obtener la lista de proveedores:', error);
        }
    };

    // Función para obtener los detalles del producto de la compra
    const fetchProductDetails = async (id_compra) => {
        try {
            const { data } = await ApiRequest().get(`/productos_compra/${id_compra}`);
            setProductDetails(data);
            setOpenProductDetails(true);
        } catch (error) {
            console.error('Error al obtener los detalles del producto:', error);
        }
    };

    const columns = [
        { field: 'id_compra', headerName: 'ID', width: 120 },
        { field: 'nombre_proveedor', headerName: 'Proveedor', width: 220 },
        {
            field: 'fecha_compra',
            headerName: 'Fecha Compra',
            width: 220,
            valueFormatter: (params) => {
                const fecha = new Date(params.value);
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return fecha.toLocaleDateString('es-ES', options);
            }
        },
        { field: 'total', headerName: 'Total', width: 220 },
        {
            field: '',
            headerName: 'Detalles',
            width: 200,
            renderCell: (params) => (
                <Stack direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
                    
                    {/*
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
                    */}

                    <IconButton size='small' onClick={() => fetchProductDetails(params.row.id_compra)}>
                        <InfoOutlined  />
                    </IconButton>
                </Stack>
            )
        }
    ];

    const onDelete = async () => {
        try {
            const { data } = await ApiRequest().post('/eliminar_product', { id: idDelete });
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            handleDialogDelete();
            init();
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    const handleDialog = () => {
        setOpenDialog(prev => !prev);
    };

    const handleDialogDelete = () => {
        setOpenDialogDelete(prev => !prev);
    };

    const onChange = ({ target }) => {
        const { name, value } = target;
        setBody({
            ...body,
            [name]: value
        });
    };

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_compra', body);
            handleDialog();
            setBody(initialState);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            init();
            setIsEdit(false);
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    const onEdit = async () => {
        try {
            const { data } = await ApiRequest().post('/editar_product', body);
            handleDialog();
            setBody(initialState);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            init();
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    useEffect(() => {
        init();
        fetchProveedores();
    }, []);

    return (
        <>
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>¿Está seguro de que desea eliminar el producto?</DialogTitle>
                <DialogContent>
                    <Typography variant='h5'>Esta acción no se puede deshacer</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Anular Eliminacion</Button>
                    <Button variant='contained' color='primary' onClick={onDelete}>Confirmar Eliminacion</Button>
                </DialogActions>
            </Dialog>

            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                <DialogTitle>{isEdit ? 'Formulario de Edición de Compra' : 'Formulario de Registro de Compra'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='id_compra'
                                value={body.id_compra}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='ID'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel htmlFor="id_proveedor">Proveedor</InputLabel>
                            <Select
                                name="id_proveedor"
                                value={body.id_proveedor || ''}
                                onChange={onChange}
                                variant="outlined"
                                size="small"
                                fullWidth
                            >
                                {roles.map((id_pro) => (
                                    <MenuItem key={id_pro.id} value={id_pro.id}>
                                        {id_pro.nombre}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='date'
                                margin='normal'
                                name='fecha_compra'
                                value={formatDate(body.fecha_compra)}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Fecha de Compra'
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='total'
                                value={body.total}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Total'
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialog}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>
                        {isEdit ? 'Editar Compra' : 'Registrar Compra'}
                    </Button>
                </DialogActions>
            </Dialog>

            <ProductDetailsDialog open={openProductDetails} onClose={() => setOpenProductDetails(false)} details={productDetails} />

            <Page title="FF| Inventario Compras">
                <ToastAutoHide message={mensaje} />
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h5">Detalles Compras de Productos de Car Wash</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <CommonTable data={usuariosList} columns={columns} />
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
}

export default Detalles;