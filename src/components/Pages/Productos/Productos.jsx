import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Grid, Box, Button, MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';

const Productos = () => {
    const initialProductState = {
        codigo: "",
        nombre: "",
        descripcion: "",
        id_proveedor: "",
        cantidad: "",
        precio: ""
    };

    const [productos, setProductos] = useState([initialProductState]); // Array de productos
    const [compra, setCompra] = useState({ id_proveedor: '', fecha_compra: '', total: 0 }); // Información de la compra
    const [roles, setRoles] = useState([]); // Lista de proveedores
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [compraRealizada, setCompraRealizada] = useState(null); // Detalles de la compra realizada
    const [comprasList, setComprasList] = useState([]); // Lista de compras realizadas

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        d.setHours(d.getHours() + 12);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return d.getFullYear() + '-' + month + '-' + day;
    };

    const fetchRoles = async () => {
        try {
            const response = await ApiRequest().get('/proveedores');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleProductChange = (index, { target }) => {
        const { name, value } = target;
        const updatedProductos = [...productos];
        updatedProductos[index] = { ...updatedProductos[index], [name]: value };
        setProductos(updatedProductos);
    };

    const handleCompraChange = ({ target }) => {
        const { name, value } = target;
        setCompra({ ...compra, [name]: value });
    };

    const addProduct = () => {
        setProductos([...productos, initialProductState]);
    };

    const removeProduct = (index) => {
        const updatedProductos = productos.filter((_, i) => i !== index);
        setProductos(updatedProductos);
    };

    const calcularTotal = () => {
        const total = productos.reduce((acc, producto) => acc + (Number(producto.precio) * Number(producto.cantidad)), 0);
        setCompra({ ...compra, total });
    };

    useEffect(() => {
        calcularTotal();
    }, [productos]);

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_compra', { compra, productos });
            
            const nuevaCompra = {
                ...compra,
                productos: [...productos]
            };

            // Actualizar lista de compras
            setComprasList([...comprasList, nuevaCompra]);

            setCompraRealizada(nuevaCompra);
            setProductos([initialProductState]); // Limpiar el estado de productos
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    return (
        <Page title="FF | Entrada de Productos">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h5">Registrar Productos de Car Wash</Typography>
                </Box>

                {/* Información general de la compra */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="id_proveedor">Proveedor</InputLabel>
                        <Select
                            name="id_proveedor"
                            value={compra.id_proveedor || ''}
                            onChange={handleCompraChange}
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type='date'
                            margin='normal'
                            name='fecha_compra'
                            value={formatDate(compra.fecha_compra)}
                            onChange={handleCompraChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Fecha de Compra'
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                </Grid>

                {productos.map((producto, index) => (
                    <Grid container spacing={2} key={index}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin='normal'
                                name='codigo'
                                value={producto.codigo}
                                onChange={(e) => handleProductChange(index, e)}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Código'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin='normal'
                                name='nombre'
                                value={producto.nombre}
                                onChange={(e) => handleProductChange(index, e)}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Nombre Producto'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin='normal'
                                name='descripcion'
                                value={producto.descripcion}
                                onChange={(e) => handleProductChange(index, e)}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Descripción Producto'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin='normal'
                                name='cantidad'
                                value={producto.cantidad}
                                onChange={(e) => handleProductChange(index, e)}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Cantidad'
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin='normal'
                                name='precio'
                                value={producto.precio}
                                onChange={(e) => handleProductChange(index, e)}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Precio'
                                InputProps={{
                                    startAdornment: <Typography>Q.</Typography>
                                }}
                            />
                        </Grid>
                        {productos.length > 1 && (
                            <Grid item xs={12}>
                                <Button
                                    color='secondary'
                                    onClick={() => removeProduct(index)}
                                >
                                    Eliminar Producto
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                ))}

                {/* Mostrar el total calculado */}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Total de la compra: Q. {compra.total}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' onClick={addProduct}>
                            Agregar Producto
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={onSubmit}
                        >
                            Registrar Compra
                        </Button>
                    </Grid>
                </Grid>

                {/* Mostrar lista de compras registradas */}
                {comprasList.length > 0 && (
                    <Box mt={5}>
                        <Typography variant="h6">Lista de Compras Realizadas</Typography>
                        {comprasList.map((compra, index) => (
                            <Box key={index} mb={4} p={2} border={1}>
                                <Typography variant="h6">Compra {index + 1}</Typography>
                                <Typography>Proveedor: {roles.find(rol => rol.id === compra.id_proveedor)?.nombre}</Typography>
                                <Typography>Fecha de Compra: {compra.fecha_compra}</Typography>
                                <Typography>Total: Q. {compra.total}</Typography>

                                <Typography variant="h6" mt={2}>Productos Comprados:</Typography>
                                {compra.productos.map((producto, i) => (
                                    <Box key={i} ml={2} mb={2}>
                                        <Typography>Código: {producto.codigo}</Typography>
                                        <Typography>Nombre: {producto.nombre}</Typography>
                                        <Typography>Cantidad: {producto.cantidad}</Typography>
                                        <Typography>Precio: Q. {producto.precio}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>
        </Page>
    );
};

export default Productos;
