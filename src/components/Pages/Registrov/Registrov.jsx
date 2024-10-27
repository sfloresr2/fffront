import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Grid, Box, Button, Stack, IconButton, Divider, MenuItem, Select, InputLabel } from '@mui/material';
import ApiRequest from '../../../helpers/axiosInstances';
import { AddOutlined, EditOutlined, DeleteOutline, PictureAsPdfOutlined } from '@mui/icons-material';
import Page from '../../common/Page';
import ToastAutoHide from '../../common/ToastAutoHide';
import CommonTable from '../../common/CommonTable';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Registrov = () => {
    const initialState = {
        id: "",
        codigo: "",
        placa: "",
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
        id_clientes: "",
        fecha_venta: "",
        precio_compra: "",
        precio_venta: ""
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);
        return d.getFullYear() + '-' + month + '-' + day;
    };

    const [roles, setRoles] = useState([]); 
    const [usuariosList, setUsuariosList] = useState([]);
    const [body, setBody] = useState(initialState);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });
    const [idDelete, setIdDelete] = useState(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    const init = async () => {
        const { data } = await ApiRequest().get('/vehiculosventas');
        setUsuariosList(data);
    };

    const fetchProveedores = async () => {
        try {  
            const { data } = await ApiRequest().get('/clientesvvv');
            setRoles(data);
        } catch (error) {
            console.error('Error al obtener la lista de proveedores:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 120 },
        { field: 'codigo', headerName: 'Codigo', width: 120 },
        { field: 'placa', headerName: 'Placa', width: 220 },
        { field: 'tipo_vehiculo', headerName: 'Tipo vehiculo', width: 220 },
        { field: 'marca', headerName: 'Marca', width: 220 },
        { field: 'modelo', headerName: 'Modelo', width: 220 },
        { field: 'color', headerName: 'Color', width: 220 },
        { field: 'uso', headerName: 'Uso', width: 220 },
        { field: 'linea', headerName: 'Linea', width: 220 },
        { field: 'chasis', headerName: 'Chasis', width: 220 },
        { field: 'serie', headerName: 'Serie', width: 220 },
        { field: 'numero_asientos', headerName: 'Numero de Asientos', width: 220 },
        { field: 'ejes', headerName: 'Ejes', width: 220 },
        { field: 'numero_vin', headerName: 'Numero de VIN', width: 220 },
        { field: 'motor', headerName: 'Motor', width: 220 },
        { field: 'cilindros', headerName: 'Cilindros', width: 220 },
        { field: 'c_c', headerName: 'C_C', width: 220 },
        { field: 'nombre_clientes', headerName: 'Clientes de Vehiculos', width: 220 },
        {
            field: 'fecha_venta',
            headerName: 'Fecha Venta',
            width: 220,
            valueFormatter: (params) => {
                const fecha = new Date(params.value);
                const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
                return fecha.toLocaleDateString('es-ES', options);
            }
        },
        {
            field: 'precio_compra',
            headerName: 'Precio Compra',
            width: 220,
            renderCell: (params) => `Q. ${parseFloat(params.value).toFixed(2)}`
        },
        {
            field: 'precio_venta',
            headerName: 'Precio Venta',
            width: 220,
            renderCell: (params) => `Q. ${parseFloat(params.value).toFixed(2)}`
        }
    ];

    const onDelete = async () => {
        try {
            const { data } = await ApiRequest().post('/eliminar_vehicv', { id: idDelete });
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

    const handleDialog = () => setOpenDialog(prev => !prev);
    const handleDialogDelete = () => setOpenDialogDelete(prev => !prev);

    const onChange = ({ target }) => {
        const { name, value } = target;
        setBody({
            ...body,
            [name]: value
        });
    };

    const onSubmit = async () => {
        try {
            const { data } = await ApiRequest().post('/guardar_vehicv', body);
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
            const { data } = await ApiRequest().post('/editar_vehicv', body);
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

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Reporte de Vehiculos vendidos", 20, 10);
        doc.autoTable({
            head: [['id', 'placa', 'marca', 'modelo', 'color', 'linea', 'id_clientes', 'fecha_venta', 'precio_compra', 'precio_venta']],
            body: usuariosList.map(product => [
                product.id,
                product.placa,
                product.marca, 
                product.modelo,
                product.color,
                product.linea,
                product.nombre_clientes,
                formatDate(product.fecha_venta),
                product.precio_compra, 
                product.precio_venta,
            ])
        });
        doc.save('reporte_inventario_vehiculos_vendidos.pdf');
    };

    const generateContractPDF = (vehicle) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Contrato de Compra-Venta de Vehículo", 20, 20);
        doc.setFontSize(12);
        doc.text(`IMPORTADORA FF`, 20, 30);
        doc.text(`Vendedor: Francisco Flores`, 20, 40);
        doc.text(`Comprador: ${vehicle.nombre_clientes}`, 20, 50);
        doc.text(`Fecha de Venta: ${formatDate(vehicle.fecha_venta)}`, 20, 60);
        doc.text("Detalles del Vehículo:", 20, 80);
        doc.autoTable({
            startY: 90,
            head: [['Placa', 'Marca', 'Modelo', 'Color', 'Tipo de Vehículo', 'Número de VIN']],
            body: [[
                vehicle.placa, 
                vehicle.marca, 
                vehicle.modelo, 
                vehicle.color, 
                vehicle.tipo_vehiculo, 
                vehicle.numero_vin
            ]]
        });
        doc.text("Información Financiera:", 20, doc.lastAutoTable.finalY + 20);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 30,
            head: [[ 'Precio Venta']],
            body: [[
                 
                `Q. ${parseFloat(vehicle.precio_venta).toFixed(2)}`
            ]]
        });

        doc.text("Reunidos vendedor y comprador en la fecha del encabezamiento, manifiestan haber acordado", 20, 160);
        doc.text("formalizar en este documento CONTRATO DE COMPRAVENTA del vehículo automóvil que se", 20, 165);
        doc.text("especifica, en las siguientes condiciones:", 20, 170);
        doc.text("1) El vendedor vende al comprador el vehículo de su propiedad anteriormente ", 20, 180);
        doc.text("especificado por la cantidad especificada anteriormente, sin incluir los ", 20, 185);
        doc.text("impuestos correspondientes, que serán a cargo del comprador.", 20, 190);
        doc.text("2) El vendedor declara que no pesa sobre el vehículo ninguna carga o gravamen ", 20, 200);
        doc.text("ni impuesto, deuda o sanción pendientes de abono en la fecha de la firma de ", 20, 205);
        doc.text("este contrato, comprometiéndose en caso contrario a regularizar tal situación ", 20, 210);
        doc.text("a su exclusivo cargo.", 20, 215);
        doc.text("3) El vendedor se compromete a facilitar los distintos documentos relativos ", 20, 225);
        doc.text("al vehículo, así como a firmar cuantos documentos aparte de éste sean necesarios ", 20, 230);
        doc.text("para que el vehículo quede correctamente inscrito a nombre del comprador en los", 20, 235);
        doc.text("correspondientes organismos públicos, siendo todos los gastos a cargo del comprador.", 20, 240);
        doc.text("4) Una vez realizada la correspondiente transferencia en Tráfico, el vendedor entregará ", 20, 250);
        doc.text("materialmente al comprador la posesión del vehículo, haciéndose el comprador cargo de ", 20, 255);
        doc.text("cuantas responsabilidades puedan contraerse por la propiedad del vehículo y su tenencia y ", 20, 260);
        doc.text("uso a partir de dicho momento de la entrega.", 20, 265);
      
        doc.text("Firma Vendedor                                                          Firma Comprador", 20, 295);
        
        doc.save(`contrato_vehiculo_${vehicle.placa}.pdf`);
    };

    useEffect(() => {
        init();
        fetchProveedores();
    }, []);

    return (
        <>
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>¿Está seguro de que desea eliminar al usuario?</DialogTitle>
                <DialogContent>
                    <Typography variant='h5'>Esta acción no se puede deshacer</Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Anular Eliminacion</Button>
                    <Button variant='contained' color='primary' onClick={onDelete}>Confirmar Eliminacion</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                <DialogTitle>{isEdit ? 'Formulario de Edicion Vehiculo Vendido' : 'Formulario de Registro de Venta de Vehiculo'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Campos de formulario */}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='text' color='primary' onClick={handleDialog}>Cancelar</Button>
                    <Button variant='contained' color='primary' onClick={isEdit ? onEdit : onSubmit}>
                        {isEdit ? 'Editar Vehiculo' : 'Agregar Vehiculo'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Page title="FF| Registro Vehiculos Vendidos">
                <ToastAutoHide message={mensaje} />
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h5">Registro Vehiculos Vendidos</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={generatePDF} startIcon={<PictureAsPdfOutlined />} variant='contained' color='primary'>
                                Informe General de Vehiculos Vendidos
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button 
                                onClick={() => usuariosList.forEach(vehicle => generateContractPDF(vehicle))}
                                startIcon={<PictureAsPdfOutlined />} 
                                variant='contained' 
                                color='primary'>
                                Generar Contrato de Compra-Venta
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
};

export default Registrov;
