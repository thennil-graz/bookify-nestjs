## Description

Bookify is a simple CRUD project using [Nest](https://github.com/nestjs/nest) framework TypeScript and Elasticsearch .

## Project setup
To get started with Bookify, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/bookify-nestjs.git
    ```
2. Navigate to the project directory:
    ```bash
    cd bookify
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Install Elasticsearch. Make sure you have docker installed in your system
    ```bash
    docker compose up
    ```
5. Ensure Elasticsearch is running at `http://localhost:9201`
    ```bash
    curl --location 'http://localhost:9201'
    ```
6. Initialize index and populate book data.
    ```bash
    curl --location --request POST 'http://localhost:3002/books/populate'
    ```

## Usage

To start the application, run:
```bash
npm run start
```

To start the server in development mode, run:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3002` to see the application in action.

## Upcoming features

- **Book Discovery**: Find books based user recommendations.
- **Reviews and Ratings**: Read and write reviews for books.
- **Book recommendations**: Create book collections and recommend books based on search history.


## Contributing

We welcome contributions! Please read our [contributing guidelines](CONTRIBUTING.md) for more details.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
