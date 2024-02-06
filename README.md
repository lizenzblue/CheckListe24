# Project Setup

Follow these steps to set up and run the project seamlessly.

## API Setup

1. Navigate to the API Folder.
2. Create a `.env` file inside the API folder.
3. Run the following command to build the Docker containers:
   ```bash
   docker-compose build
   ```
4. Execute the Docker container named `php-apache`:
   ```bash
    docker exec -it api-php-apache-1 
   ```
5. Inside the container, run the following commands:
   ```bash
   composer install
   php bin/console doctrine:database:create
   php bin/console doctrine:migration:migrate
   ```

## Frontend Setup

6. Move to the `fe` (Frontend) folder.
7. Run the following command to install dependencies:
   ```bash
   npm install
   ```
8. Finally, compile the frontend assets:
   ```bash
   npm run dev
   ```

Your project is now set up and ready to roll! Feel free to make any necessary adjustments based on your specific environment and requirements.
