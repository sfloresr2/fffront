import React, { useState, useContext, useEffect } from 'react'// Importa la biblioteca React para crear componentes y utilizar hooks
import { Grid, CssBaseline, Paper, Avatar, Typography, TextField, Button, InputAdornment, IconButton, LinearProgress, Box, Link } from '@mui/material'// Importa varios componentes y utilidades de la biblioteca Material UI para el diseño de la interfaz de usuario
import { Visibility, VisibilityOff, DirectionsCar } from '@mui/icons-material' // Importa íconos específicos de Material UI para su uso en la interfaz (Visibilidad, Visibilidad Off, y el ícono de carro)
import { useHistory } from 'react-router-dom'// Importa el hook 'useHistory' de 'react-router-dom' para manejar la navegación entre rutas
import ApiRequest from '../../../helpers/axiosInstances'// Importa una instancia de Axios configurada para realizar peticiones API
import { MainContext, APP_STATE, AUTH_TYPES } from '../../../Context/MainContext'// Importa el contexto principal de la aplicación y constantes relacionadas al estado y autenticación
import ToastAutoHide from '../../common/ToastAutoHide'// Importa un componente personalizado para mostrar notificaciones (Toasts) que desaparecen automáticamente
import Page from '../../common/Page'// Importa el componente 'Page' que probablemente envuelve el contenido en una estructura común a todas las páginas
import loginImage from './logo.png';// Importa una imagen llamada 'logo.png' desde la misma carpeta y la asigna a la variable 'loginImage',Esta imagen probablemente será utilizada en el componente para mostrar un logotipo o una imagen relacionada con el login



const Login = () => {// Define un componente funcional llamado 'Login'
    const { globalDispatch } = useContext(MainContext) // Utiliza el contexto global de la aplicación para acceder a funciones de dispatch (enviar acciones)
    const [bodyLogin, setBodyLogin] = useState({ usuario: '', contrasena: '' })// Define el estado inicial para el formulario de login, con 'usuario' y 'contrasena' vacíos
    const [showPass, setShowPass] = useState(false)// Estado para controlar si la contraseña se muestra o no
    const [isLoading, setIsLoading] = useState(false)// Estado para indicar si la petición de inicio de sesión está en curso (loading)
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null })// Estado para almacenar los mensajes de error o éxito del login
    const { push } = useHistory()// Hook para la navegación entre rutas


    const onChange = e => {// Función que se ejecuta cuando hay un cambio en los campos del formulario
        const { name, value } = e.target
        setBodyLogin({
            ...bodyLogin,// Copia el estado actual
            [name]: value// Actualiza el campo correspondiente (usuario o contrasena)
        })
    }


    const handleSubmit = () => {// Función para manejar el envío del formulario de inicio de sesión
        setIsLoading(true)// Activa el indicador de carga
        ApiRequest().post('/login', bodyLogin)// Envía una solicitud POST al endpoint '/login' con los datos de inicio de sesión
            .then(({ data }) => {// Si la solicitud es exitosa:
                globalDispatch({
                    type: AUTH_TYPES.LOGIN_OK,// Envía una acción de éxito de inicio de sesión
                    payload: data// Pasa los datos recibidos como parte del payload
                })
                setIsLoading(false)// Desactiva el indicador de carga
                push('/app')// Redirige al usuario a la página principal de la aplicación
            })
            .catch(({ response }) => {// Si la solicitud falla:
                globalDispatch({ type: AUTH_TYPES.LOGIN_FAIL })// Envía una acción de fallo de inicio de sesión
                setMensaje({
                    ident: new Date().getTime(),// Asigna un identificador único al mensaje
                    message: response.data,// Asigna el mensaje de error recibido
                    type: 'error'// Define el tipo de mensaje como error
                })
                setIsLoading(false)// Desactiva el indicador de carga
            })
    }


    const init = () => {// Función para inicializar el estado y limpiar el almacenamiento local
        globalDispatch({
            type: APP_STATE.CLEAR_APP_STATE// Envía una acción para limpiar el estado global de la aplicación
        })
        localStorage.clear()// Limpia el almacenamiento local del navegador
    }


    useEffect(init, [])// Ejecuta la función init cuando el componente se monta


    return ( // Renderiza el contenido del componente
        <Page title="FF | Inicio de sesión"> 
         {/* Componente que envuelve la página de inicio de sesión y establece el título de la página */}
            <ToastAutoHide message={mensaje} />
            {/* Muestra notificaciones automáticas. Recibe el mensaje almacenado en el estado 'mensaje' */}
            <Grid container component="main" sx={{ height: '100vh' }}>
                {/* Crea una cuadrícula contenedora que ocupa el 100% de la altura de la ventana */}
                <CssBaseline />
                 {/* Componente para normalizar los estilos CSS del navegador, asegurando que la presentación sea consistente */}

                <Grid item xs={false} sm={4} md={7}
                    sx={{
                        backgroundImage: `url(${loginImage})`, // Establece la imagen de fondo usando la variable 'loginImage'
                        backgroundRepeat: 'no-repeat',// No repetir la imagen de fondo
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? "#27aae1" : "#27aae1",// Establece el color de fondo basado en el modo de la paleta (oscuro o claro)
                        backgroundSize: 'cover',// Ajusta la imagen de fondo para que cubra todo el contenedor
                        backgroundPosition: 'center',// Posiciona la imagen en el centro
                    }}
                />
                {/* Primera columna del grid que contiene la imagen de fondo del lado izquierdo */}


                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={10} square>
                    {/* Segunda columna del grid que contiene el formulario de inicio de sesión. 
            Se renderiza dentro de un Paper con sombra y bordes cuadrados */}
                    <Box
                        sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        {/* Contenedor que centra el contenido dentro de la columna con margenes y alineación flexbox */}
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <DirectionsCar />  {/* Muestra un avatar con el ícono de un carro en lugar del tradicional candado */}
                        </Avatar>
                        <Typography component="h1" variant="h5">
						Inicio de sesión{/* Título que aparece encima del formulario */}
                        </Typography>
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            {/* Componente Box que actúa como el formulario de inicio de sesión. 
                    'noValidate' deshabilita la validación HTML por defecto */}
                            <TextField
                                required
                                fullWidth
                                autoFocus
                                value={bodyLogin.usuario}// Valor del campo usuario tomado del estado 'bodyLogin'
                                onChange={onChange}// Función que maneja los cambios en el campo
                                variant="outlined"
                                margin="normal"
                                label="Usuario"
                                name="usuario"// Nombre del campo que se enlaza con 'onChange'
                            />
                            {/* Campo de texto para el usuario, marcado como obligatorio */}
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                value={bodyLogin.contrasena}// Valor del campo contraseña tomado del estado 'bodyLogin'
                                onChange={onChange}// Función que maneja los cambios en el campo
                                margin="normal"
                                name="contrasena"
                                label="Contraseña"
                                type={showPass ? "text" : "password"}// Alterna entre mostrar el texto o el campo como contraseña
                                autoComplete="current-password"
                                onKeyDown={e => { if (e.keyCode === 13) { handleSubmit() } }}
                                // Si el usuario presiona "Enter", envía el formulario
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPass(!showPass)}
                                                onMouseDown={(event) => {
                                                    event.preventDefault()// Previene el comportamiento por defecto del botón
                                                }}
                                            >
                                                {showPass ? <Visibility /> : <VisibilityOff />}
                                                {/* Ícono que cambia dependiendo si la contraseña está visible o no */}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                             {/* Campo de texto para la contraseña, con la opción de mostrar/ocultar la contraseña */}
                            {isLoading ? <LinearProgress color='secondary' /> : null}
                            {/* Muestra una barra de progreso si 'isLoading' es verdadero, indicando que el login está en proceso */}
                            <Button
                                startIcon={<DirectionsCar />} 
                                 // Ícono del botón que muestra un carro en lugar del tradicional candado
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit}// Función que se ejecuta cuando se presiona el botón
                            >
                                Iniciar sesión 
                                {/* Texto del botón */}
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/login" variant="body2">
                                        FF Importadora de vehiculos & Car Wash
                                        {/* Enlace debajo del botón que lleva a la página principal de la empresa */}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
                 {/* Segunda columna del grid con el formulario de inicio de sesión */}

                
            </Grid>
            {/* Contenedor Grid principal que define la estructura de la página */}
        </Page>
        
    )
}

export default Login// Exporta el componente 'Login' como la exportación por defecto de este archivo
