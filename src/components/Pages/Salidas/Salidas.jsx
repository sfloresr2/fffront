import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Grid, Box, Button, MenuItem, Select, InputLabel, Autocomplete } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';

const Salidas = () => {
    const initialProductState = {
        codigo: "",
        nombre: "",
        descripcion: "",
        id_proveedor: "",
        cantidad: "",
        precio: ""
    };

    const [productos, setProductos] = useState([initialProductState]);
    const [salida, setSalida] = useState({ id_proveedor: '', fecha_salida: '' });
    const [roles, setRoles] = useState([]);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [salidasList, setSalidasList] = useState([]);
    const [productosInventario, setProductosInventario] = useState([]);

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

    const handleSalidaChange = ({ target }) => {
        const { name, value } = target;
        setSalida({ ...salida, [name]: value });
    };

    const addProduct = () => {
        setProductos([...productos, initialProductState]);
    };

    const removeProduct = (index) => {
        const updatedProductos = productos.filter((_, i) => i !== index);
        setProductos(updatedProductos);
    };

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_products', { 
                productos, 
                fecha_salida: salida.fecha_salida 
            });
            const nuevaSalida = {
                ...salida,
                productos: [...productos]
            };
            setSalidasList([...salidasList, nuevaSalida]);
            setSalida({ id_proveedor: '', fecha_salida: '' });
            setProductos([initialProductState]);
            setMensaje({ ident: new Date().getTime(), message: data.message, type: 'success' });
        } catch ({ response }) {
            setMensaje({ ident: new Date().getTime(), message: response.data.message, type: 'error' });
        }
    };

    return (
        <Page title="FF | Salida de Productos">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h5">Registrar Salida de Productos</Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="id_proveedor">Proveedor</InputLabel>
                        <Select
                            name="id_proveedor"
                            value={salida.id_proveedor || ''}
                            onChange={handleSalidaChange}
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
                            name='fecha_salida'
                            value={salida.fecha_salida}
                            onChange={handleSalidaChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Fecha de Salida'
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
                                freeSolo
                                onChange={(event, newValue) => {
                                    if (newValue && typeof newValue === 'object') {
                                        onSelectProducto(index, newValue);
                                    } else {
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
                        <Button variant='contained' color='primary' onClick={addProduct}>
                            Agregar Producto
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' onClick={onSubmit}>
                            Registrar Salida
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Salidas;
