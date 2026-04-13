# Backend

Este directorio contiene el backend de la aplicación MediCitas, desarrollado con Laravel.

## Estructura principal

- `app/` - Código fuente de la aplicación (modelos, controladores, middleware, etc.).
- `routes/` - Definición de rutas (API, web, consola).
- `database/` - Migraciones, seeders y factories.
- `public/` - Punto de entrada público (`index.php`).
- `config/` - Archivos de configuración.
- `tests/` - Pruebas unitarias y funcionales.
- `composer.json` - Dependencias de PHP.
- `Dockerfile` - Configuración para contenedor Docker.

## Comandos útiles

- `composer install` - Instala dependencias de PHP.
- `php artisan migrate` - Ejecuta migraciones de base de datos.
- `php artisan serve` - Inicia el servidor de desarrollo.
- `npm install && npm run build` - Instala y compila assets frontend (si aplica).

## Notas

- Requiere PHP, Composer y una base de datos compatible (MySQL, MariaDB, etc.).
- Para desarrollo local, puedes usar Docker o instalar los requisitos manualmente.
- ¡Haz copia de seguridad antes de ejecutar comandos que modifiquen la base de datos!

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
