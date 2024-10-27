import React, { useState, useEffect } from 'react';
import { TextField, Container, Typography, Grid, Box, Button, MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';

const Ventassf = () => {
    const initialServiceState = {
        id_servicios: "",
        marca: "",
        modelo: "",
        color: "",
        linea: "",
        precio: "",
    };

    const marcas = [
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
    ];

    const modelos = Array.from({ length: 125 }, (_, i) => (1900 + i).toString());
    
    const [roles, setRoles] = useState([]);
    const [roless, setRoless] = useState([]);
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
    const [body, setBody] = useState({ id_clientes: "", fecha_servicio: "", servicios: [] });
    const [servicios, setServicios] = useState([initialServiceState]);
    const [total, setTotal] = useState(0);  
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });

    const fetchRoles = async () => {
        try {
            const response = await ApiRequest().get('/serviciosvvv');
            setRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    };

    const fetchRoless = async () => {
        try {
            const response = await ApiRequest().get('/clientesvvv');
            setRoless(response.data);
        } catch (error) {
            console.error('Error fetching roles data:', error);
        }
    };

    const fetchServiciosDisponibles = async () => {
        try {
            const response = await ApiRequest().get('/serviciosc');
            setServiciosDisponibles(response.data);
        } catch (error) {
            console.error('Error fetching available services:', error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchRoless();
        fetchServiciosDisponibles();
    }, []);

    const onChangeClient = ({ target }) => {
        const { name, value } = target;
        setBody(prevBody => ({
            ...prevBody,
            [name]: value
        }));
    };

    const onChangeService = (index, event) => {
        const { name, value } = event.target;
        const newServicios = [...servicios];
        newServicios[index][name] = value;

        if (name === 'id_servicios') {
            const selectedService = serviciosDisponibles.find(service => service.id === value);
            if (selectedService) {
                newServicios[index].precio = selectedService.precio;
            }
        }

        setServicios(newServicios);
        calculateTotal(newServicios);
    };

    const calculateTotal = (services) => {
        const total = services.reduce((acc, service) => {
            const price = parseFloat(service.precio) || 0;
            return acc + price;
        }, 0);
        setTotal(total);
    };

    const addService = () => {
        setServicios([...servicios, initialServiceState]);
    };

    const removeService = (index) => {
        const newServicios = servicios.filter((_, i) => i !== index);
        setServicios(newServicios);
        calculateTotal(newServicios);
    };

    const onSubmit = async () => {
        try {
            const dataToSend = { ...body, servicios };
            const { data } = await ApiRequest().post('/guardar_serviciosvvv', dataToSend);
            setMensaje({ ident: new Date().getTime(), message: data.message, type: 'success' });
            setBody({ id_clientes: "", fecha_servicio: "", servicios: [] });
            setServicios([initialServiceState]);
            setTotal(0);
        } catch ({ response }) {
            setMensaje({ ident: new Date().getTime(), message: response.data.sqlMessage, type: 'error' });
        }
    };

    return (
        <Page title="FF | Registro de Servicios">
            <ToastAutoHide message={mensaje} />
            <Container maxWidth='lg'>
                <Box sx={{ pb: 5 }}>
                    <Typography variant="h5">Registro de Servicios de Car Wash</Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <InputLabel htmlFor="id_clientes">Cliente Vehiculo</InputLabel>
                        <Select
                            name="id_clientes"
                            value={body.id_clientes || ''}
                            onChange={onChangeClient}
                            variant="outlined"
                            size="small"
                            fullWidth
                        >
                            {roless.map((id_clie) => (
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
                            name='fecha_servicio'
                            value={body.fecha_servicio}
                            onChange={onChangeClient}
                            variant='outlined'
                            size='small'
                            fullWidth
                            label='Fecha Servicio'
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    {servicios.map((service, index) => (
                        <React.Fragment key={index}>
                            <Grid item xs={12} sm={6}>
                                <InputLabel htmlFor={`id_servicios_${index}`}>Servicios</InputLabel>
                                <Select
                                    name="id_servicios"
                                    value={service.id_servicios || ''}
                                    onChange={(e) => onChangeService(index, e)}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                >
                                    {roles.map((id_ser) => (
                                        <MenuItem key={id_ser.id} value={id_ser.id}>
                                            {id_ser.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <InputLabel htmlFor={`marca_${index}`}>Marca</InputLabel>
                                <Select
                                    name='marca'
                                    value={service.marca}
                                    onChange={(e) => onChangeService(index, e)}
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                >
                                    {marcas.map((marca) => (
                                        <MenuItem key={marca} value={marca}>
                                            {marca}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <InputLabel htmlFor={`modelo_${index}`}>Modelo</InputLabel>
                                <Select
                                    name='modelo'
                                    value={service.modelo}
                                    onChange={(e) => onChangeService(index, e)}
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                >
                                    {modelos.map((modelo) => (
                                        <MenuItem key={modelo} value={modelo}>
                                            {modelo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin='normal'
                                    name='color'
                                    value={service.color}
                                    onChange={(e) => onChangeService(index, e)}
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                    label='Color'
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    margin='normal'
                                    name='linea'
                                    value={service.linea}
                                    onChange={(e) => onChangeService(index, e)}
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                    label='Linea'
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    margin='normal'
                                    name='precio'
                                    value={service.precio}
                                    onChange={(e) => onChangeService(index, e)}
                                    variant='outlined'
                                    size='small'
                                    fullWidth
                                    label='Precio'
                                    InputProps={{
                                        startAdornment: <span>Q.</span>
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button 
                                    variant='contained' 
                                    color='secondary' 
                                    onClick={() => removeService(index)}
                                >
                                    Eliminar Producto
                                </Button>
                            </Grid>
                        </React.Fragment>
                    ))}

                    <Grid item xs={12}>
                        <Button 
                            variant='contained' 
                            color='primary' 
                            onClick={addService}
                        >
                            Agregar Servicio
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6">Total de la compra: Q. {total}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Button 
                            variant='contained' 
                            color='primary' 
                            onClick={onSubmit}
                        >
                            Registrar Servicios
                        </Button>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
};

export default Ventassf;