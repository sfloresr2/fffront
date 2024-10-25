import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Grid, Box, Button, MenuItem, Select, InputLabel, Autocomplete } from '@mui/material';
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

    const [productos, setProductos] = useState([initialProductState]);
    const [compra, setCompra] = useState({ id_proveedor: '', fecha_compra: '', total: 0 });
    const [roles, setRoles] = useState([]);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [compraRealizada, setCompraRealizada] = useState(null);
    const [comprasList, setComprasList] = useState([]);
    const [productosInventario, setProductosInventario] = useState([]);

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

    const fetchProductosInventario = async () => {
        try {
            const response = await ApiRequest().get('/productos');
            setProductosInventario(response.data);
        } catch (error) {
            console.error('Error fetching inventory products:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchProductosInventario();
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

    const onSelectProducto = (index, productoSeleccionado) => {
        const updatedProductos = [...productos];
        updatedProductos[index] = {
            ...updatedProductos[index],
            codigo: productoSeleccionado.codigo,
            nombre: productoSeleccionado.nombre,
            descripcion: productoSeleccionado.descripcion,
            cantidad: 1, // Cantidad predeterminada
            precio: productoSeleccionado.precio
        };
        setProductos(updatedProductos);
    };

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_compra', { compra, productos });
            const nuevaCompra = { ...compra, productos: [...productos] };
            setComprasList([...comprasList, nuevaCompra]);
            setCompraRealizada(nuevaCompra);
            setProductos([initialProductState]);
            setMensaje({ ident: new Date().getTime(), message: data.message, type: 'success' });
        } catch ({ response }) {
            setMensaje({ ident: new Date().getTime(), message: response.data.sqlMessage, type: 'error' });
        }
    };

    return (
        <Page title="FF | Entrada de Productos">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h5">Registrar Productos de Car Wash</Typography>
                </Box>

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
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>

                {productos.map((producto, index) => (
                    <Grid container spacing={2} key={index}>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={productosInventario}
                                getOptionLabel={(option) => option.nombre || ""}
                                freeSolo // Permite ingresar un producto nuevo
                                onChange={(event, newValue) => {
                                    if (newValue && typeof newValue === 'object') {
                                        onSelectProducto(index, newValue);
                                    } else {
                                        // Si el producto es nuevo, solo establece el nombre
                                        handleProductChange(index, { target: { name: 'nombre', value: newValue } });
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Buscar o Agregar Producto" />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin='normal'
                                name='codigo'
                                value={producto.codigo}
                                onChange={(e) => handleProductChange(index, e)}
                                variant='outlined'
                                size='small'
                                fullWidth
                                label='Código Producto'
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
                                InputProps={{ startAdornment: <Typography>Q.</Typography> }}
                            />
                        </Grid>
                        {productos.length > 1 && (
                            <Grid item xs={12}>
                                <Button color='secondary' onClick={() => removeProduct(index)}>
                                    Eliminar Producto
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                ))}

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Total de la compra: Q. {compra.total}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' onClick={addProduct}>
                            Agregar Producto a la compra
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' onClick={onSubmit}>
                            Registrar Compra
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Productos;
