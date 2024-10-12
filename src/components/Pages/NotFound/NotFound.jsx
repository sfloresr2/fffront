import React from 'react'// Importa React, ya que necesitamos crear componentes con JSX
import { Container, Typography } from '@mui/material'// Importa los componentes 'Container' y 'Typography' del paquete '@mui/material' para usar estilos predefinidos de Material UI
import imagesList from '../../../assets'// Importa una lista de imágenes que está en la ruta especificada dentro de tu proyecto
import Page from '../../common/Page'// Importa el componente 'Page' que probablemente maneja la estructura básica de una página común en la aplicación
import { Link } from 'react-router-dom'// Importa el componente 'Link' de 'react-router-dom' para manejar la navegación interna de la aplicación



const NotFound = () => {// Define el componente 'NotFound', que será mostrado cuando un usuario intente acceder a una página no existente



	return (// Retorna el contenido del componente con JSX
		<Page title="Error | 404">
			{/* Define un div que tendrá un fondo con una imagen, estilos CSS en línea para ajustar el tamaño y posición */}
			<div style={{
				backgroundImage: 'url(https://pa1.narvii.com/7243/d15ff24b7642ca9deedc8ca7947185c0926718b0r1-600-600_hq.gif)',// URL de la imagen de fondo
				backgroundPosition: 'center',// Centra la imagen de fondo
				backgroundSize: '100%',// La imagen cubre el 100% del área visible
				width: '100%',// Ancho del div es del 100% de la pantalla
				height: '100vh',// Alto del div es del 100% de la altura de la ventana del navegador
				position: 'absolute'// El div se posiciona absolutamente respecto a su contenedor
			}}>
				{/* El contenedor para los elementos hijos con un ancho máximo pequeño (sm) */}
				<Container maxWidth='sm'>
					{/* Imagen importada desde 'imagesList' con estilo en línea para su posición y tamaño */}
					<img src={imagesList.image404} alt='...' style={{
						position: 'fixed',// Fija la posición de la imagen en relación con la ventana del navegador
						width: '50%',// La imagen ocupa el 50% del ancho de su contenedor
						right: '23%',// La imagen está a 23% de la derecha
						top: '10%'// La imagen comienza desde el 10% de la parte superior
					}} />
					 {/* Enlace a la página de inicio de la aplicación con estilo en línea (sin subrayado y color blanco) */}	
					<Link to='/app' style={{ textDecoration: 'none', color: "#ffffff" }}><Typography variant='h4' align='center'>Home</Typography></Link>
				{/* Texto "Home" que está centrado y con una variante de tipografía 'h4' */}
				</Container>
			</div>
		</Page>
	)
}



export default NotFound// Exporta el componente 'NotFound' como la exportación por defecto de este archivo, lo que permite importarlo en otros lugares
