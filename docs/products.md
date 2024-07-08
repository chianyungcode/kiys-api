# Product API Documentation

Full documentation for products API specification

| Endpoint            | HTTP     | Description           |
| ------------------- | -------- | --------------------- |
| `/api/products`     | `GET`    | Get all products      |
| `/api/products/:id` | `GET`    | Get specific products |
| `/api/products`     | `POST`   | Create new products   |
| `/api/products`     | `DELETE` | Delete all products   |
| `/api/products/:id` | `DELETE` | Delete products by id |
| `/api/products/:id` | `PUT`    | Update products by id |

## Authentication Header

| Parameter   | Description | Type   | Required |
| ----------- | ----------- | ------ | -------- |
| `X-API-KEY` | API key     | string | `Yes`    |

## Create Category

Endpoint:

```http request
POST /api/products
```

### Request body

```json
{
  "name": "Surfing",
  "description": "Aktivitas menyenangkan di pantai dengan menunggangi ombak"
}
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "name": "Surfing",
    "description": "Aktivitas menyenangkan di pantai dengan menunggangi ombak",
    "createdAt": "2022-12-31T23:59:59Z",
    "updatedAt": "2022-12-31T23:59:59Z",
    "destinations": []
  }
}
```

### Response body (Failed)

```json
{
  "errors": "name is required"
}
```

## Get Category

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
    "name": "Surfing",
    "description": "Aktivitas menyenangkan di pantai dengan menunggangi ombak",
    "createdAt": "2022-12-31T23:59:59Z",
    "updatedAt": "2022-12-31T23:59:59Z",
    "destinations": []
  }
}
```

### Response body (Failed)

```json
{
  "errors": "data not found"
}
```

## Get Categories

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
      "name": "Surfing",
      "description": "Aktivitas menyenangkan di pantai dengan menunggangi ombak",
      "createdAt": "2022-12-31T23:59:59Z",
      "updatedAt": "2022-12-31T23:59:59Z",
      "destinations": []
    },
    {
      "id": "50739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "name": "Diving",
      "description": "Menyelam di dasar laut untuk menikmati keindahan bawah air",
      "createdAt": "2022-12-31T23:59:59Z",
      "updatedAt": "2022-12-31T23:59:59Z",
      "destinations": []
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

## Delete Category

Endpoint:

```http request
DELETE /api/products/:id
```

### Response body (Success)

```json
{
  "message": "Category deleted"
}
```

### Response body (Failed)

```json
{
  "errors": "Failed to delete products"
}
```

## Delete Categories

Endpoint:

```http request
DELETE /api/products
```

### Response body (Success)

```json
{
  "message": "All products deleted"
}
```

### Response body (Failed)

```json
{
  "message": "Failed to delete all products"
}
```

## Update Category

Endpoint:

```http request
PUT /api/products/:id
```

### Request body (Success)

```json
{
  "name": "Hiking",
  "description": "Aktivitas menyenangkan di pegunungan"
}
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "name": "Surfing",
    "description": "Aktivitas menyenangkan di pantai dengan menunggangi ombak",
    "createdAt": "2022-12-31T23:59:59Z",
    "updatedAt": "2022-12-31T23:59:59Z",
    "destinations": []
  }
}
```

### Response body (Failed)

```json
{
  "errors": "Failed to update products"
}
```
