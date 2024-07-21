# Kiys API

API for Kiys E-Commerce Platform. A website that selling peripheral like keyboard, mouse and TWS.

## API Spesification

- [Authentication API Spesification](/docs/auth.md)
- [User API Spesification](/docs/user.md)
- [Product API Spesification](/docs/product.md)
- [Category API Spesification](/docs/category.md)

To install dependencies:

```sh
bun install
```

To run in local:

```sh
bun run dev
```

open http://localhost:3000

## How to seed data

> Make sure you have been register snaplet in https://snaplet.dev. Because this project using snaplet for seeding data

> This command will seed data in your local database
>
> ```sh
> bunx prisma db seed
> ```
