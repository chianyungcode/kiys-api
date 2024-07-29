# Product API Documentation

Full documentation for product API specification

| Endpoint            | HTTP     | Description           |
| ------------------- | -------- | --------------------- |
| `/api/products`     | `GET`    | Get all products      |
| `/api/products/:id` | `GET`    | Get specific products |
| `/api/products`     | `POST`   | Create new products   |
| `/api/products`     | `DELETE` | Delete all products   |
| `/api/products/:id` | `DELETE` | Delete products by id |
| `/api/products/:id` | `PUT`    | Update products by id |

## Authentication Header

| Parameter       | Description  | Type   | Required |
| --------------- | ------------ | ------ | -------- |
| `Authorization` | Bearer token | string | `Yes`    |

## Create Product

Endpoint:

```http request
POST /api/products
```

### Request body

```json
{
  "name": "Kiys Mechanical Keyboard",
  "slug": "kiys-mechanical-keyboard",
  "sku": "123456789",
  "description": "Kiys Mechanical Keyboard",
  "price": 10000,
  "isArchived": false,
  "isFeatured": false,
  "categoryId": "40739dc7-726e-4b8a-babe-6a0e51f36ce6"
}
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "name": "Kiys Mechanical Keyboard",
    "slug": "kiys-mechanical-keyboard",
    "sku": "123456789",
    "description": "Kiys Mechanical Keyboard",
    "price": 10000,
    "isArchived": false,
    "isFeatured": false,
    "categoryId": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z",
    "images": [],
    "orderItems": [],
    "reviews": []
  }
}
```

### Response body (Failed)

```json
{
  "errors": "Name is required"
}
```

## Get Product

Endpoint:

```http request
GET /api/products/:id
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "name": "Kiys Mechanical Keyboard",
    "slug": "kiys-mechanical-keyboard",
    "sku": "123456789",
    "description": "Kiys Mechanical Keyboard",
    "price": 10000,
    "isArchived": false,
    "isFeatured": false,
    "categoryId": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z",
    "images": [],
    "orderItems": [],
    "reviews": []
  }
}
```

### Response body (Failed)

```json
{
  "errors": "Data not found"
}
```

## Get Products

Endpoint:

```http request
GET /api/products
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "name": "Kiys Mechanical Keyboard",
      "slug": "kiys-mechanical-keyboard",
      "sku": "123456789",
      "description": "Kiys Mechanical Keyboard",
      "price": 10000,
      "isArchived": false,
      "isFeatured": false,
      "categoryId": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z",
      "images": [],
      "orderItems": [],
      "reviews": []
    },
    {
      "id": "50739dc7-726e-4b8a-babe-dada51f36ce6",
      "name": "Kiys Mechanical Keyboard S-Pro",
      "slug": "kiys-mechanical-keyboard-s-pro",
      "sku": "311321312",
      "description": "Kiys Mechanical Keyboard S-Pro",
      "price": 40000,
      "isArchived": false,
      "isFeatured": true,
      "categoryId": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "createdAt": "2024-03-02T00:00:00.000Z",
      "updatedAt": "2024-03-02T00:00:00.000Z",
      "images": [],
      "orderItems": [],
      "reviews": []
    }
  ]
}
```

### Response body (Failed)

```json
{
  "errors": "Failed to get data"
}
```

## Delete Product

Endpoint:

```http request
DELETE /api/products/:id
```

### Response body (Success)

```json
{
  "message": "Product deleted"
}
```

### Response body (Failed)

```json
{
  "errors": "Failed to delete product"
}
```

## Delete Products

Endpoint:

```http request
DELETE /api/products
```

### Response body (Success)

```json
{
  "message": "All product deleted"
}
```

### Response body (Failed)

```json
{
  "message": "Failed to delete all product"
}
```

## Update Product

Endpoint:

```http request
PUT /api/products/:id
```

### Request body

```json
{
  "name": "Kiys Mechanical Keyboard S-Pro",
  "slug": "kiys-mechanical-keyboard-s-pro",
  "sku": "311321312",
  "description": "Kiys Mechanical Keyboard S-Pro",
  "price": 500000,
  "isArchived": false,
  "isFeatured": true
}
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "name": "Kiys Mechanical Keyboard",
    "slug": "kiys-mechanical-keyboard",
    "sku": "123456789",
    "description": "Kiys Mechanical Keyboard",
    "price": 10000,
    "isArchived": false,
    "isFeatured": false,
    "categoryId": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z",
    "images": [],
    "orderItems": [],
    "reviews": []
  }
}
```

### Response body (Failed)

```json
{
  "errors": "Failed to update product"
}
```
