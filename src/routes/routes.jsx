import React, { lazy } from 'react'
import { APP_VALUES } from '../constants/app'
import { HomeRedirect } from './RouteUtils'
const RouteController = lazy(() => import('./RouteController'))
const NotFound = lazy(() => import('../components/Pages/NotFound'))
const Login = lazy(() => import('../components/Pages/Login'))
const Home = lazy(() => import('../components/Pages/Home'))
const Dashboard = lazy(() => import('../components/Pages/Dashboard'))
const Usuarios = lazy(() => import('../components/Pages/Usuarios'))
const Productos = lazy(() => import('../components/Pages/Productos'))
const Inventario = lazy(() => import('../components/Pages/Inventario'))
const Vehiculos = lazy(() => import('../components/Pages/Vehiculos'))
const Predios = lazy(() => import('../components/Pages/Predios'))
const Proveedores = lazy(() => import('../components/Pages/Proveedores'))
const Proimpo = lazy(() => import('../components/Pages/Proimpo'))
const Ventasvf = lazy(() => import('../components/Pages/Ventasvf'))
const Registrov = lazy(() => import('../components/Pages/Registrov'))
const Clientes = lazy(() => import('../components/Pages/Clientes'))

const routes = [
	{
		path: "/",
		exact: true,
		component: HomeRedirect
	},
	{
		path: "/login",
		exact: true,
		render: props => <Login {...props} />
	},
	{
		path: `/${APP_VALUES.ROOT_ROUTE}`,
		render: props => <RouteController component={Home} {...props} />,
		routes: [
			{
				path: `/${APP_VALUES.ROOT_ROUTE}`,
				exact: true,
				render: props => <RouteController component={Dashboard} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/usuarios`,
				exact: true,
				render: props => <RouteController component={Usuarios} {...props} />
			},


			{
				path: `/${APP_VALUES.ROOT_ROUTE}/productos`,
				exact: true,
				render: props => <RouteController component={Productos} {...props} />
			},

			{
				path: `/${APP_VALUES.ROOT_ROUTE}/inventario`,
				exact: true,
				render: props => <RouteController component={Inventario} {...props} />
			},

			{
				path: `/${APP_VALUES.ROOT_ROUTE}/vehiculos`,
				exact: true,
				render: props => <RouteController component={Vehiculos} {...props} />
			},

			{
				path: `/${APP_VALUES.ROOT_ROUTE}/predios`,
				exact: true,
				render: props => <RouteController component={Predios} {...props} />
			},
			

			{
				path: `/${APP_VALUES.ROOT_ROUTE}/proveedores`,
				exact: true,
				render: props => <RouteController component={Proveedores} {...props} />
			},

			{
				path: `/${APP_VALUES.ROOT_ROUTE}/proimpo`,
				exact: true,
				render: props => <RouteController component={Proimpo} {...props} />
			},

			{
				path: `/${APP_VALUES.ROOT_ROUTE}/ventasvf`,
				exact: true,
				render: props => <RouteController component={Ventasvf} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/ventassf`,
				exact: true,
				render: props => <RouteController component={Proimpo} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/registrov`,
				exact: true,
				render: props => <RouteController component={Registrov} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/registros`,
				exact: true,
				render: props => <RouteController component={Proimpo} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/clientes`,
				exact: true,
				render: props => <RouteController component={Clientes} {...props} />
			},
			



			{
				path: `/${APP_VALUES.ROOT_ROUTE}/*`,
				exact: true,
				render: props => <NotFound {...props} />
			},
		]
	},
	{
		path: '*',
		render: props => <NotFound {...props} />
	}







]

export default routes