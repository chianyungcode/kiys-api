# Category API Specification

Full documentation for category API specification

| Endpoint              | HTTP     | Description           |
| --------------------- | -------- | --------------------- |
| `/api/categories`     | `GET`    | Get all category      |
| `/api/categories/:id` | `GET`    | Get specific category |
| `/api/categories`     | `POST`   | Create new category   |
| `/api/categories`     | `DELETE` | Delete all category   |
| `/api/categories/:id` | `DELETE` | Delete category by id |
| `/api/categories/:id` | `PUT`    | Update category by id |

## Authentication Header

| Parameter   | Description | Type   | Required |
| ----------- | ----------- | ------ | -------- |
| `X-API-KEY` | API key     | string | `Yes`    |

## Create Category

Endpoint:

```http request
POST /api/categories
```

### Request body

```json
{
  "name": "Keyboard",
  "slug": "keyboard",
  "description": "Make your feel typing on keyboard"
}
```

### Response body (Success)

```json
{
  "success": true,
  "message": "success",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "name": "Keyboard",
    "slug": "keyboard",
    "description": "Make your feel typing on keyboard",
    "createdAt": "2022-12-31T23:59:59Z",
    "updatedAt": "2022-12-31T23:59:59Z",
    "products": []
  }
}
```

### Response body (Failed)

```json
{
  "success": false,
  "message": "Failed to create category"
}
```

## Get Category

Endpoint:

```http request
GET /api/categories/:id
```

### Response body (Success)

```json
{
  "success": true,
  "message": "Category found",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "name": "Keyboard",
    "slug": "keyboard",
    "description": "Make your feel typing on keyboard",
    "createdAt": "2022-12-31T23:59:59Z",
    "updatedAt": "2022-12-31T23:59:59Z",
    "products": []
  }
}
```

### Response body (Failed)

```json
{
  "success": false,
  "message": "Category not found"
}
```

## Get Categories

Endpoint:

```http request
GET /api/categories
```

### Response body (Success)

```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "name": "Keyboard",
      "slug": "keyboard",
      "description": "Make your feel typing on keyboard",
      "createdAt": "2022-12-31T23:59:59Z",
      "updatedAt": "2022-12-31T23:59:59Z",
      "products": []
    },
    {
      "id": "50739dc7-726e-4b8a-davd-hd7h3kaf36ce6",
      "name": "Mouse",
      "slug": "mouse",
      "description": "Pointing and clicking with mouse",
      "createdAt": "2022-12-31T23:59:59Z",
      "updatedAt": "2022-12-31T23:59:59Z",
      "products": []
    }
  ]
}
```

### Response body (Failed)

```json
{
  "success": false,
  "message": "Failed to fetch categories",
  "errors": "Data not found"
}
```

## Delete Category

Endpoint:

```http request
DELETE /api/categories/:id
```

### Response body (Success)

```json
{
  "success": true,
  "message": "Category deleted"
}
```

### Response body (Failed)

```json
{
  "success": false,
  "mesage": "Failed to delete category",
  "errors": "Failed to delete category"
}
```

## Delete Categories

Endpoint:

```http request
DELETE /api/categories
```

### Response body (Success)

```json
{
  "success": true,
  "message": "All category deleted"
}
```

### Response body (Failed)

```json
{
  "success": false,
  "mesage": "Failed to delete all category",
  "errors": "Failed to delete all category"
}
```

## Update Category

Endpoint:

```http request
PUT /api/categories/:id
```

### Request body

```json
{
  "name": "Mouse",
  "slug": "mouse",
  "description": "Pointing and clicking with mouse"
}
```

### Response body (Success)

```json
{
  "success": true,
  "message": "Category have been updated",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "name": "Surfing",
    "description": "Aktivitas menyenangkan di pantai dengan menunggangi ombak",
    "createdAt": "2022-12-31T23:59:59Z",
    "updatedAt": "2022-12-31T23:59:59Z",
    "products": []
  }
}
```

### Response body (Failed)

```json
{
  "success": false,
  "mesage": "Failed to update category",
  "errors": "Failed to update category"
}
```
