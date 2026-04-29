# BalancePro
Aplicación web de gestión de finanzas personales desarrollada en Angular 20. Permite a los usuarios registrar, visualizar y analizar sus ingresos y gastos mediante una interfaz moderna e intuitiva.

## Tecnologías

Angular 20
TypeScript
ng-apexcharts — gráficas interactivas
HTML5 / CSS3
Nginx — servidor web en producción
Docker


## Requisitos previos

Node.js 20+
Angular CLI
Docker (opcional)


## Instalación y configuración
1. Clona el repositorio:
bashgit clone https://github.com/jpmfranco/BalancePro.git
cd BalancePro/AppEcono
2. Instala las dependencias:
bashnpm install
3. Configura las URLs del backend en src/enviroment/enviroment.ts:
typescriptexport const environment = {
  production: false,
  apiGasto: 'http://localhost:7252/api/Gastoes/',
  apiIngreso: 'http://localhost:7252/api/Ingresoes/',
  apiUsuario: 'http://localhost:7252/api/Usuarios/'
};
4. Corre el proyecto en desarrollo:
bashng serve
5. Accede en el navegador:
http://localhost:4200

## Correr con Docker
1. Construye la imagen:
bashdocker build -t balancepro-frontend .
2. O usa Docker Compose desde la raíz del proyecto:
bashdocker-compose up --build
3. Accede en el navegador:
http://localhost:4200


##  Módulos de la aplicación
Overview
Panel principal del sistema. Muestra el balance financiero actualizado del usuario, una gráfica de líneas interactiva con los movimientos de los últimos 7 días diferenciando ingresos y egresos, accesos rápidos a los demás módulos y botones para registrar nuevos ingresos y gastos mediante modales con validación reactiva.
Búsqueda
Módulo de consulta y filtrado de transacciones. Permite buscar movimientos por nombre, filtrar por tipo (ingreso o egreso) y ver los detalles de cada transacción mediante un modal. Muestra un contador con el total de resultados encontrados.
Proyección
Módulo de predicción financiera. Consume el microservicio de inteligencia artificial en Python para mostrar la proyección estimada de ingresos y gastos para los próximos tres meses basada en los datos históricos del usuario.
Perfil
Panel de información personal del usuario. Muestra el nombre, correo, edad, género, celular y fecha de registro. Incluye estadísticas financieras personalizadas: total de ingresos, total de gastos, balance actual y número de transacciones. Permite editar la información personal y cambiar la contraseña.

##  Autenticación
El sistema utiliza sessionStorage para gestionar la sesión del usuario. Al iniciar sesión se almacena el correo del usuario y se verifica en cada componente mediante el guard de rutas. Si no existe sesión activa, el usuario es redirigido automáticamente al login.

##  Configuración de Nginx (producción)
El archivo nginx.conf configura el servidor web para redirigir todas las rutas al index.html de Angular, habilitando el routing del lado del cliente:
nginxserver {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

##  Comandos útiles
bash# Instalar dependencias:
npm install

 -Servidor de desarrollo:
ng serve

-Build de producción:
ng build --configuration production

-Ejecutar tests:
ng test

-Verificar versión de Angular:
ng version

##  Autores

### Juan Pablo Mayagoitia Franco
### Luis Angel Reyes Valdivia

### Asesor: Jose Juan Meza Espinosa
CUCEI, Universidad de Guadalajara

##  Licencia
Propietario del código — Todos los derechos reservados © 2026
