import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Grid, Box, Button, IconButton, Stack, Divider, MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, PictureAsPdfOutlined } from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



const Facturas = () => {
    const initialState = {
        id: "",
        id_proveedor: "",
        numero_factura: "",
        fecha_factura: "",
        producto: "",
        precio: "",
        cantidad: "",
        total: "",
    };



    const [usuariosList, setUsuariosList] = useState([]);
    const [roles, setRoles] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);



    const fetchRoles = async () => {
        try {
            const response = await ApiRequest().get('/proveedores');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    };



    const init = async () => {
        const { data } = await ApiRequest().get('/facturasp');
        setUsuariosList(data);
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
            const { data } = await ApiRequest().post('/guardar_facturasp', body);
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
            const { data } = await ApiRequest().post('/editar_facturasp', body);
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



    const onDelete = async () => {
        try {
            const { data } = await ApiRequest().post('/eliminar_facturasp', { id: idDelete });
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



    // Función para agrupar las facturas por número de factura
    const agruparFacturas = (facturas) => {
        return facturas.reduce((acc, factura) => {
            const { numero_factura } = factura;
            if (!acc[numero_factura]) {
                acc[numero_factura] = [];
            }
            acc[numero_factura].push(factura);
            return acc;
        }, {});
    };

    // Función para generar PDF de cada grupo de facturas
    const generarPDFPorFacturas = (facturasAgrupadas) => {
        Object.keys(facturasAgrupadas).forEach(numeroFactura => {
            const facturas = facturasAgrupadas[numeroFactura];
            const doc = new jsPDF();
            doc.text(`Factura No: ${numeroFactura}`, 20, 10);

            // Generar tabla de productos
            doc.autoTable({
                head: [['ID', 'Producto', 'Cantidad', 'Precio', 'Total']],
                body: facturas.map(factura => [
                    factura.id,
                    factura.producto,
                    factura.cantidad,
                    factura.precio,
                    factura.total
                ])
            });

            // Calcular el total general de la factura
            const totalGeneral = facturas.reduce((sum, factura) => sum + parseFloat(factura.total), 0);

            // Agregar el total general al final de la tabla
            doc.autoTable({
                body: [
                    [{ content: 'Total General', colSpan: 4, styles: { halign: 'right' } }, totalGeneral]
                ],
                theme: 'plain'
            });

            // Guardar el PDF con el número de factura en el nombre
            doc.save(`factura_${numeroFactura}.pdf`);
        });
    };



    // Función principal para generar los reportes
    const handleGenerateFacturasReport = () => {
        const facturasAgrupadas = agruparFacturas(usuariosList);
        generarPDFPorFacturas(facturasAgrupadas);
    };



    useEffect(() => {
        fetchRoles();
        init();
    }, []);



    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'nombre_proveedor', headerName: 'Proveedor', width: 220 },
        { field: 'numero_factura', headerName: 'Numero de Factura', width: 220 },
        { field: 'fecha_factura', headerName: 'Fecha', width: 220 },
        { field: 'producto', headerName: 'Producto', width: 220 },
        { field: 'cantidad', headerName: 'Cantidad', width: 220 },
        { field: 'precio', headerName: 'Precio', width: 220 },
        { field: 'total', headerName: 'Total', width: 220 },
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



    return (
        <>
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>
                    ¿Está seguro de que desea eliminar esta factura?
                </DialogTitle>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Anular Eliminacion</Button>
                    <Button variant='contained' color='primary' onClick={onDelete}>Confirmar Eliminación</Button>
                </DialogActions>
            </Dialog>

            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                <DialogTitle>
                    {isEdit ? 'Editar Factura' : 'Registrar Factura'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
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
                                margin='normal'
                                name='numero_factura'
                                value={body.numero_factura}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Numero de Factura'
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                type='date'
                                margin='normal'
                                name='fecha_factura'
                                value={body.fecha_factura}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Fecha Factura'
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='producto'
                                value={body.producto}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Producto'
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='cantidad'
                                value={body.cantidad}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Cantidad'
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                margin='normal'
                                name='precio'
                                value={body.precio}
                                onChange={onChange}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Precio'
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialog}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>
                        {isEdit ? 'Guardar Cambios' : 'Registrar'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Page title="FF | Facturas Car Wash">
                <ToastAutoHide message={mensaje} />
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h5">Panel de Control de Facturas</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={() => { setIsEdit(false); handleDialog(); setBody(initialState); }} startIcon={<AddOutlined />} variant='contained' color='primary'>
                                Registrar Factura
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateFacturasReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}>
                                Generar Facturas
                            </Button>
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

export default Facturas;
