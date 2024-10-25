import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Grid, Box, Button, MenuItem, Select, InputLabel } from '@mui/material';
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
            // Enviar fecha_salida y productos directamente
            const { data } = await ApiRequest().post('/guardar_products', { 
                productos, 
                fecha_salida: salida.fecha_salida // Se envía directamente sin formatear
            });

            const nuevaSalida = {
                ...salida,
                productos: [...productos]
            };

            // Actualizar lista de salidas
            setSalidasList([...salidasList, nuevaSalida]);

            setSalida({ id_proveedor: '', fecha_salida: '' });
            setProductos([initialProductState]); // Limpiar el estado de productos
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.message,
                type: 'error'
            });
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
                            value={salida.fecha_salida} // Mantener el valor sin formatear
                            onChange={handleSalidaChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Fecha de Salida'
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
                        <Grid item xs={12}>
                            {productos.length > 1 && (
                                <Button
                                    color='secondary'
                                    onClick={() => removeProduct(index)}
                                >
                                    Eliminar Producto
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                ))}

                <Grid container spacing={2}>
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
                            Registrar Salida
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Salidas;