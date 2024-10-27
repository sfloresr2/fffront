import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Grid, Box, Button, MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';

const Vehiculos = () => {
    const initialState = {
        id: "",    
        codigo: "",
        placa:"",
        tipo_vehiculo:"",
        marca: "",    
        modelo: "",    
        color: "",
        uso:"",
        linea:"",
        chasis:"",
        serie:"",
        numero_asientos: "",
        ejes:"",
        numero_vin: "",
        motor:"",
        cilindros:"",
        c_c:"",    
        id_proveedor_vehiculo: "",
        fecha_compra: "",    
        precio_compra: "",    
        precio_vehiculo: ""    
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        d.setHours(d.getHours() + 12);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return d.getFullYear() + '-' + month + '-' + day;
    };

    const [roles, setRoles] = useState([]);
    const [body, setBody] = useState(initialState);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });

    // Lista de años desde 1900 hasta 2024
    const years = Array.from({ length: 2024 - 1900 + 1 }, (_, i) => 1900 + i);

    const vehicleTypes = [
        "Cuatrimoto",
        "Moto",
        "Camioneta",
        "Automovil",
        "Microbus",
        "Pick-up"
    ];

    const usos = [
        "MOTOCICLETA",
        "PARTICULAR",
        "COMERCIAL",
        "TRANSPORTE PUBLICO",
        "INDUSTRIAL",
        "GUBERNAMENTAL",
        "ESCOLAR"
    ];

    const asientos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 42];

    const ejes = [1, 2, 3, 4, 5, 6];

    const cilindros = [2, 3, 4, 5, 6, 8, 10, 12, 16];

    const ccOptions = [
        200, 250, 999, 1200, 1300, 1400, 1500, 1600, 1800, 1781,
        2000, 2200, 2400, 2500, 2497, 2800, 3000, 3500, 3700, 4000,
        4500, 5000, 5700, 6000
    ];

    const fetchRoles = async () => {
        try {
            const response = await ApiRequest().get('/proveedoresvvv');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
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
            const { data } = await ApiRequest().post('/guardar_vehic', body);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            setBody(initialState);
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
            const { data } = await ApiRequest().post('/editar_vehic', body);
            setMensaje({
                ident: new Date().getTime(),
                message: data.message,
                type: 'success'
            });
            setBody(initialState);
            setIsEdit(false);
        } catch ({ response }) {
            setMensaje({
                ident: new Date().getTime(),
                message: response.data.sqlMessage,
                type: 'error'
            });
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <Page title="FF | Compras Vehiculos">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h5">Módulo de Registro de Información de {isEdit ? 'Editar Vehiculo' : 'Compras de Vehiculos'}</Typography>
                </Box>
                <Grid container spacing={2}>
                    {/* Código */}
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
                    {/* Placa */}
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
                    {/* Tipo de vehículo */}
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="tipo_vehiculo">Tipo de Vehículo</InputLabel>
                        <Select
                            name="tipo_vehiculo"
                            value={body.tipo_vehiculo || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {vehicleTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* Marca */}
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="marca">Marca</InputLabel>
                        <Select
                            name="marca"
                            value={body.marca || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {[
                                "Italika",
                                "Kia",
                                "Chevrolet",
                                "Hyundai",
                                "Mazda",
                                "Honda",
                                "Ford",
                                "Toyota",
                                "Mitsubishi",
                                "Nissan",
                                "Volkswagen",
                                "Suzuki",
                                "Jeep",
                                "Mercedes-Benz",
                                "BMW",
                                "AUDI",
                                "Isuzu",
                                "Subaru"
                            ].map((marca) => (
                                <MenuItem key={marca} value={marca}>
                                    {marca}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* Modelo (Año) */}
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="modelo">Modelo</InputLabel>
                        <Select
                            name="modelo"
                            value={body.modelo || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* Color */}
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
                    {/* Uso */}
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="uso">Uso</InputLabel>
                        <Select
                            name="uso"
                            value={body.uso || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {usos.map((uso) => (
                                <MenuItem key={uso} value={uso}>
                                    {uso}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* Línea */}
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
                    {/* Chasis */}
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
                    {/* Serie */}
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
                    {/* Asientos */}
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="numero_asientos">Número de Asientos</InputLabel>
                        <Select
                            name="numero_asientos"
                            value={body.numero_asientos || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {asientos.map((asiento) => (
                                <MenuItem key={asiento} value={asiento}>
                                    {asiento}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* Ejes */}
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="ejes">Ejes</InputLabel>
                        <Select
                            name="ejes"
                            value={body.ejes || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {ejes.map((eje) => (
                                <MenuItem key={eje} value={eje}>
                                    {eje}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* VIN */}
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
                    {/* Motor */}
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
                    {/* Cilindros */}
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="cilindros">Cilindros</InputLabel>
                        <Select
                            name="cilindros"
                            value={body.cilindros || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {cilindros.map((cilindro) => (
                                <MenuItem key={cilindro} value={cilindro}>
                                    {cilindro}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* C.C */}
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="c_c">C.C</InputLabel>
                        <Select
                            name="c_c"
                            value={body.c_c || ''}
                            onChange={onChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {ccOptions.map((cc) => (
                                <MenuItem key={cc} value={cc}>
                                    {cc}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    {/* Proveedor */}
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
                    {/* Fecha de Compra */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            type='date'
                            margin='normal'
                            name='fecha_compra'
                            value={formatDate(body.fecha_compra)}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Fecha Compra'
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    {/* Precio Compra */}
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
                    {/* Precio Vehiculo */}
                    <Grid item xs={12}>
                        <TextField
                            margin='normal'
                            name='precio_vehiculo'
                            value={body.precio_vehiculo}
                            onChange={onChange}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Precio Vehiculo'
                            InputProps={{
                                startAdornment: <Typography>Q.</Typography>
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>
                            {isEdit ? 'Editar Vehiculo' : 'Registrar Vehiculo'}
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Vehiculos;