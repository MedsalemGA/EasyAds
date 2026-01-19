Configuration of DataBase
1️⃣ Requirements

PHP ≥ 8.1

Composer

MySQL (recommended)

Laragon / XAMPP / WAMP
2️⃣ Create the Database

Using phpMyAdmin or MySQL console:

  CREATE DATABASE easyads;
3️⃣ Environment Configuration

 In the backend (Laravel) folder:

 Copy the example environment file:

 cp .env.example .env


 Edit the .env file and configure the database:

 DB_CONNECTION=mysql
 DB_HOST=127.0.0.1
 DB_PORT=3306
 DB_DATABASE=my_database_name
 DB_USERNAME=root
 DB_PASSWORD=
4️⃣ Install Backend Dependencies
 cd backend
 composer install
5️⃣ Generate Application Key
php artisan key:generate
6️⃣ Run Database Migrations
php artisan migrate
7️⃣ Run the Backend Server
 php artisan serve


 Backend will be available at:

  http://127.0.0.1:8000

