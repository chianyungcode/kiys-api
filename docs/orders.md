Here's the updated API specification with HTTP status codes added:

# Order API Specification

Full documentation for order API Specification

| Endpoint               | Method   | Description              | Success Status Code |
| ---------------------- | -------- | ------------------------ | ------------------- |
| `/api/orders`          | `POST`   | Create order             | 201 Created         |
| `/api/orders`          | `GET`    | Get all list order       | 200 OK              |
| `/api/orders/:orderId` | `GET`    | Get order by order id    | 200 OK              |
| `/api/orders/:orderId` | `PUT`    | Update order by order id | 200 OK              |
| `/api/orders`          | `DELETE` | Delete all orders        | 204 No Content      |
| `/api/orders/:orderId` | `DELETE` | Delete order by order id | 204 No Content      |

## Endpoint Detail

### Create Order

Endpoint:

```http request
POST /api/orders
```

#### Request Body

```json
{
  "userId": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
  "isPaid": false
}
```

#### Response Body (Success - 201 Created)

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
    "isPaid": false,
    "userId": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
    "createdAt": "2023-03-01T12:00:00.000Z",
    "updatedAt": "2023-03-01T12:00:00.000Z",
    "orderItems": [
      {
        "id": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
        "productId": "92056449-943e-4bf5-b29f-8e2ffd9f454d"
      }
    ]
  }
}
```

#### Response Body (Error - 400 Bad Request)

```json
{
  "success": false,
  "message": "Invalid request body"
}
```

### Get All Orders

Endpoint:

```http request
GET /api/orders
```

#### Response Body (Success - 200 OK)

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
      "isPaid": false,
      "userId": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
      "createdAt": "2023-03-01T12:00:00.000Z",
      "updatedAt": "2023-03-01T12:00:00.000Z",
      "orderItems": [
        {
          "id": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
          "productId": "92056449-943e-4bf5-b29f-8e2ffd9f454d"
        }
      ]
    }
  ]
}
```

#### Response Body (Error - 500 Internal Server Error)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Get Order By Order Id

Endpoint:

```http request
GET /api/orders/:orderId
```

#### Response Body (Success - 200 OK)

```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": "e7b3c1f0-5c3e-4b8e-9c1e-1f2e3d4c5b6a",
    "isPaid": false,
    "userId": "f6e7d8c9-0b1a-4c2b-8d3e-4f5e6d7c8b9a",
    "createdAt": "2023-03-01T12:00:00.000Z",
    "updatedAt": "2023-03-01T12:00:00.000Z",
    "orderItems": [
      {
        "id": "a1b2c3d4-e5f6-7a8b-9c0d-e1f2g3h4i5j6",
        "productId": "b1c2d3e4-f5g6-7h8i-9j0k-l1m2n3o4p5q6"
      }
    ]
  }
}
```

#### Response Body (Error - 404 Not Found)

```json
{
  "success": false,
  "message": "Order not found"
}
```

### Update Order By Order Id

Endpoint:

```http request
PUT /api/orders/:orderId
```

#### Request Body

```json
{
  "isPaid": true
}
```

#### Response Body (Success - 200 OK)

```json
{
  "id": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
  "isPaid": true,
  "userId": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
  "createdAt": "2023-03-01T12:00:00.000Z",
  "updatedAt": "2023-03-01T18:00:00.000Z",
  "orderItems": [
    {
      "id": "92056449-943e-4bf5-b29f-8e2ffd9f454d",
      "productId": "92056449-943e-4bf5-b29f-8e2ffd9f454d"
    }
  ]
}
```

#### Response Body (Error - 500 Internal Server Error)

```json
{
  "success": false,
  "message": "Internal server error"
}
```

### Delete All Orders

Endpoint:

```http request
DELETE /api/orders
```

#### Response Body (Success - 204 No Content)

No response body

### Delete Order By Order Id

Endpoint:

```http request
DELETE /api/orders/:orderId
```

#### Response Body (Success - 204 No Content)

No response body
