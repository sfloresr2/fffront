import React from 'react'
import { PersonOutlined, HomeOutlined, ShoppingCartOutlined, Inventory2Outlined, DirectionsCarOutlined, LocalCarWashOutlined, RvHookupOutlined, DriveEtaOutlined, CarRepairOutlined, CommuteOutlined, CleaningServicesOutlined, SanitizerOutlined, SoapOutlined, PeopleOutlined, AddShoppingCartOutlined, BusinessOutlined, ContactPhoneOutlined, ContactsOutlined, BarChartOutlined, AssessmentOutlined, MonetizationOnOutlined, AttachMoneyOutlined, ReceiptOutlined, DescriptionOutlined, ExitToAppOutlined, ImportContactsOutlined, PlaylistAddCheckOutlined} from '@mui/icons-material' // Importa los nuevos iconos

const sidebarConfig = [
	{
		title: 'inicio',
		path: '/app',
		icon: <DirectionsCarOutlined />
	},

	{
		title: 'usuarios',
		path: '/app/usuarios',
		icon: <PeopleOutlined />
	},

	{
		title: 'Proveedores Productos',
		path: '/app/proveedores',
		icon: <BusinessOutlined /> // Cambiado a un icono de inventario
	},

	

	{
		title: 'Entrada Productos',
		path: '/app/productos',
		icon: <ImportContactsOutlined /> // Cambiado a un icono de compras
	},


	{
		title: 'Detalles Compras',
		path: '/app/detalles',
		icon: <DescriptionOutlined /> // Cambiado a un icono de compras
	},

	
	{
		title: 'Inventario Car Wash',
		path: '/app/inventario',
		icon: <SanitizerOutlined /> // Cambiado a un icono de inventario
	},
	{
		title: 'Salida Productos',
		path: '/app/salidas',
		icon: <ExitToAppOutlined /> // Cambiado a un icono de compras dd
	},
	{
		title: 'Registro Salidas',
		path: '/app/salidasre',
		icon: <PlaylistAddCheckOutlined /> // Cambiado a un icono de compras
	},

	{
		title: 'Servicios de Car Wash',
		path: '/app/servicios',
		icon: <LocalCarWashOutlined /> // Cambiado a un icono de inventario
	},

	{
		title: 'Venta de Servicios',
		path: '/app/ventassf',
		icon: <MonetizationOnOutlined /> // Cambiado a un icono de inventario
	},

	{
		title: 'Registro Servicios vendidos',
		path: '/app/registros',
		icon: <BarChartOutlined /> // Cambiado a un icono de inventario
	},

	{
		title: 'Proveedores Vehiculos',
		path: '/app/proimpo',
		icon: <ContactPhoneOutlined /> // Cambiado a un icono de inventario
	},

	{
		title: 'Compras Vehiculos',
		path: '/app/vehiculos',
		icon: <AddShoppingCartOutlined /> // Cambiado a un icono de inventario
	},
	{
		title: 'Inventario Vehiculos',
		path: '/app/predios',
		icon: <CommuteOutlined /> // Cambiado a un icono de inventario
	},

	{
		title: 'Clientes',
		path: '/app/clientes',
		icon: <ContactsOutlined /> // Cambiado a un icono de inventario
	},

	{
		title: 'Venta de Vehiculos',
		path: '/app/ventasvf',
		icon: <AttachMoneyOutlined /> // Cambiado a un icono de inventario
	},

	{
		title: 'Registro Vehiculos vendidos',
		path: '/app/registrov',
		icon: <AssessmentOutlined /> // Cambiado a un icono de inventario
	}


	

	




]

export default sidebarConfig
