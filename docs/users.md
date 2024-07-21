# User API Specification

Full documentation for user API specification

| Endpoint         | HTTP     | Description       |
| ---------------- | -------- | ----------------- |
| `/api/users`     | `GET`    | Get all users     |
| `/api/users/:id` | `GET`    | Get specific user |
| `/api/users/:id` | `PUT`    | Update user       |
| `/api/users`     | `DELETE` | Delete all user   |
| `/api/users/:id` | `DELETE` | Delete user by id |

## Authentication Header

| Parameter       | Description  | Type   | Required |
| --------------- | ------------ | ------ | -------- |
| `Authorization` | Bearer token | string | `Yes`    |

## Get All Users

Endpoint:

```http request
GET /api/users
```

### Response Body (Success)

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "admin",
      "createdAt": "2021-01-01T00:00:00Z",
      "updatedAt": "2021-01-01T00:00:00Z"
    },
    {
      "id": "9876543-210-abcd-efgh-ijklmnopqrst",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "role": "user",
      "createdAt": "2022-03-15T12:30:00Z",
      "updatedAt": "2022-03-15T12:30:00Z"
    }
  ]
}
```

### Response Body (Failed)

```json
{
  "success": false,
  "message": "Failed to fetch users"
}
```

## Get Specific User

Endpoint:

```http request
GET /api/users/:id
```

### Response Body (Success)

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "address": "Jl. T.B Simatupang, Jakarta",
    "role": "admin",
    "createdAt": "2021-01-01T00:00:00Z",
    "updatedAt": "2021-01-01T00:00:00Z"
  }
}
```

### Response Body (Failed)

```json
{
  "success": false,
  "message": "Failed to fetch user"
}
```

## Update User

Endpoint:

```http request
PUT /api/users/:id
```

### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe13@example.com",
  "address": "Jl. T.B Simatupang, Jakarta"
}
```

### Response Body (Success)

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe13@example.com",
    "address": "Jl. T.B Simatupang, Jakarta",
    "createdAt": "2024-07-13T12:30:00Z",
    "updatedAt": "2024-07-16T12:30:00Z"
  }
}
```

### Response Body (Failed)

```json
{
  "success": false,
  "message": "Failed to update user"
}
```

## Delete User

Endpoint:

```http request
DElETE /api/users/:id
```

### Response Body (Success)

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Response Body (Failed)

```json
{
  "success": false,
  "message": "Failed to delete user"
}
```

## Delete All Users

Endpoint:

```http request
DELETE /api/users
```

### Response Body (Success)

```json
{
  "success": true,
  "message": "All users deleted successfully"
}
```

### Response Body (Failed)

```json
{
  "success": false,
  "message": "Failed to delete all users"
}
```
