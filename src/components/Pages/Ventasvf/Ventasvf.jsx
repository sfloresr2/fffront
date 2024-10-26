import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Grid, Box, Button, MenuItem, Select, InputLabel, Autocomplete } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';

const Ventasvf = () => {
    const initialState = {
        id: "",	
        codigo: "",
        placa: "",
        tipo_vehiculo: "",
        marca: "",	
        modelo: "",	
        color: "",
        uso: "",
        linea: "",
        chasis: "",
        serie: "",
        numero_asientos: "",
        ejes: "",
        numero_vin: "",
        motor: "",
        cilindros: "",
        c_c: "",	
        id_clientes: "",
        fecha_venta: "",	
        precio_compra: "",	
        precio_venta: ""	
    };

    const [roles, setRoles] = useState([]);
    const [body, setBody] = useState(initialState);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [vehiculosInventario, setVehiculosInventario] = useState([]);

    const fetchRoles = async () => {
        try {
            const response = await ApiRequest().get('/clientesvvv');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    };

    const fetchVehiculosInventario = async () => {
        try {
            const response = await ApiRequest().get('/vehiculos');
            setVehiculosInventario(response.data);
        } catch (error) {
            console.error('Error fetching vehicles data:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchVehiculosInventario();
    }, []);

    const onChange = ({ target }) => {
        const { name, value } = target;
        setBody({
            ...body,
            [name]: value
        });
    };

    const onSelectVehiculo = (vehiculoSeleccionado) => {
        setBody({
            ...body,
            codigo: vehiculoSeleccionado.codigo,
            placa: vehiculoSeleccionado.placa,
            tipo_vehiculo: vehiculoSeleccionado.tipo_vehiculo,
            marca: vehiculoSeleccionado.marca,
            modelo: vehiculoSeleccionado.modelo,
            color: vehiculoSeleccionado.color,
            uso: vehiculoSeleccionado.uso,
            linea: vehiculoSeleccionado.linea,
            chasis: vehiculoSeleccionado.chasis,
            serie: vehiculoSeleccionado.serie,
            numero_asientos: vehiculoSeleccionado.numero_asientos,
            ejes: vehiculoSeleccionado.ejes,
            numero_vin: vehiculoSeleccionado.numero_vin,
            motor: vehiculoSeleccionado.motor,
            cilindros: vehiculoSeleccionado.cilindros,
            c_c: vehiculoSeleccionado.c_c,
            precio_compra: vehiculoSeleccionado.precio_compra
        });
    };

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_vehicv', body);
            setMensaje({ ident: new Date().getTime(), message: data.message, type: 'success' });
            setBody(initialState);
            setIsEdit(false);
        } catch ({ response }) {
            setMensaje({ ident: new Date().getTime(), message: response.data.sqlMessage, type: 'error' });
        }
    };

    const onEdit = async () => {
        try {
            const { data } = await ApiRequest().post('/editar_vehicv', body);
            setMensaje({ ident: new Date().getTime(), message: data.message, type: 'success' });
            setBody(initialState);
            setIsEdit(false);
        } catch ({ response }) {
            setMensaje({ ident: new Date().getTime(), message: response.data.sqlMessage, type: 'error' });
        }
    };

    return (
        <Page title="FF | Ventas Vehiculos">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h5">Módulo de Registro de Información de {isEdit ? 'Editar Vehiculo' : 'Ventas de Vehiculo'}</Typography>
                </Box>
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={6}>
                        <Autocomplete
                            options={vehiculosInventario}
                            getOptionLabel={(option) => option.placa || ""}
                            onChange={(event, newValue) => {
                                if (newValue && typeof newValue === 'object') {
                                    onSelectVehiculo(newValue);
                                } else {
                                    setBody({ ...body, placa: newValue });
                                }
                            }}
                            renderInput={(params) => <TextField {...params} label="Buscar o Agregar Vehículo" />}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin='normal'
                            name='codigo'
                            value={body.codigo}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Código'
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
                            label='Tipo de Vehículo'
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
                            label='Número de Asientos'
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
                            label='Número de VIN'
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
                            label='C.C.'
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="id_clientes">Cliente Vehículo</InputLabel>
                        <Select
                            name="id_clientes"
                            value={body.id_clientes || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {roles.map((id_clie) => (
                                <MenuItem key={id_clie.id} value={id_clie.id}>
                                    {id_clie.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            type='date'
                            margin='normal'
                            name='fecha_venta'
                            value={body.fecha_venta}
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

                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='precio_compra'
                            value={body.precio_compra}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Precio Compra'
                            InputProps={{
                                startAdornment: <Typography>Q.</Typography>
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='precio_venta'
                            value={body.precio_venta}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Precio Venta'
                            InputProps={{
                                startAdornment: <Typography>Q.</Typography>
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>
                            {isEdit ? 'Editar Venta' : 'Registrar Venta de Vehículo'}
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Ventasvf;
