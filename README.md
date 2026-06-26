# BalancePro
A personal finance management web application built with Angular 20. It allows users to track, visualize, and analyze their income and expenses through a modern and intuitive user interface.

## Technologies

* Angular 20
* TypeScript
* ng-apexcharts — interactive charts
* HTML5 / CSS3
* Nginx — production web server
* Docker

## Prerequisites

* Node.js 20+
* Angular CLI
* Docker (optional)

## Installation and Setup

1. Clone the repository:
git clone [https://github.com/jpmfranco/BalancePro.git](https://github.com/jpmfranco/BalancePro.git)
cd BalancePro/AppEcono
Install the dependencies:

Bash
npm install
Configure the backend URLs in src/enviroment/enviroment.ts:

TypeScript
export const environment = {
  production: false,
  apiGasto: 'http://localhost:7252/api/Gastoes/',
  apiIngreso: 'http://localhost:7252/api/Ingresoes/',
  apiUsuario: 'http://localhost:7252/api/Usuarios/'
};
Run the project in development mode:

Bash
ng serve
Access it in your browser:
http://localhost:4200

Running with Docker
Build the Docker image:

Bash
docker build -t balancepro-frontend .
Or use Docker Compose from the project root:

Bash
docker-compose up --build
Access it in your browser:
http://localhost:4200

Application Modules
Overview
The main system dashboard. It displays the user's updated financial balance, an interactive line chart tracking transactions from the last 7 days (differentiating income and expenses), quick access shortcuts to other modules, and action buttons to log new income and expenses via modals with reactive validation.

Search
The transaction query and filtering module. It allows users to search for financial records by name, filter by type (income or expense), and view specific transaction details through a modal. It also includes a counter displaying the total number of results found.

Projection
The financial forecasting module. It consumes a Python-based Artificial Intelligence microservice to display the estimated income and expense projections for the next three months, based on the user's historical data.

Profile
The user's personal information panel. It displays their name, email, age, gender, phone number, and registration date. It includes custom financial statistics: total income, total expenses, current balance, and transaction count. It also allows users to edit their personal information and change their password.

Authentication
The system utilizes sessionStorage to manage user sessions. Upon logging in, the user's email is stored and verified within each component using route guards. If no active session is detected, the user is automatically redirected to the login page.

Nginx Configuration (Production)
The nginx.conf file configures the web server to redirect all routes to Angular's index.html, enabling seamless client-side routing:

Nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
Useful Commands
Bash
# Install dependencies
npm install

# Development server
ng serve

# Production build
ng build --configuration production

# Run tests
ng test

# Check Angular version
ng version
Authors
Juan Pablo Mayagoitia Franco
Luis Angel Reyes Valdivia
Advisor: Jose Juan Meza Espinosa
CUCEI, Universidad de Guadalajara

License
Proprietary Code — All rights reserved © 2026
