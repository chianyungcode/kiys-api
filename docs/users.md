# User API Specification

Full documentation for user API specification

| Endpoint             | HTTP     | Description          |
| -------------------- | -------- | -------------------- |
| `/api/auth/register` | `POST`   | Register new user    |
| `/api/auth/login`    | `POST`   | Login user           |
| `/api/auth/refresh`  | `POST`   | Refresh access token |
| `/api/users`         | `GET`    | Get all users        |
| `/api/users/:id`     | `GET`    | Get specific user    |
| `/api/users`         | `PUT`    | Update user          |
| `/api/users`         | `DELETE` | Delete all user      |
| `/api/users/:id`     | `DELETE` | Delete user by id    |

## Register User

Endpoint:

```http request
POST /api/auth/register
```

### Request body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "address": "123 Main St, Anytown, USA",
  "password": "password123"
}
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "user": {
      "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "address": "123 Main St, Anytown, USA",
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z",
      "role": "USER"
    },
    "auth": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SARsBE5x_ua2ye823r2zKpQNaew3Daq8riKz5A4h3o4",
      "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o",
      "tokenType": "Bearer"
    }
  }
}
```

### Response body (Failed)

```json
{
  "errors": "Email is required"
}
```

## Login User

Endpoint:

```http request
POST /api/auth/login
```

### Request body

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "auth": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SARsBE5x_ua2ye823r2zKpQNaew3Daq8riKz5A4h3o4",
      "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o",
      "tokenType": "Bearer"
    }
  }
}
```

## Refresh Access Token

Endpoint:

```http request
POST /api/auth/refresh
```

### Request body

```json
{
  "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o"
}
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "auth": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SARsBE5x_ua2ye823r2zKpQNaew3Daq8riKz5A4h3o4",
      "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o",
      "tokenType": "Bearer"
    }
  }
}
```

### Response body (Failed)

```json
{
  "errors": "Refresh token is required"
}
```

## Get All Users

Endpoint:

```http request
GET /api/users
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "address": "123 Main St, Anytown, USA",
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z",
      "role": "USER"
    },
    {
      "id": "50739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane.doe@example.com",
      "password": "password123",
      "address": "123 Main St, Anytown, USA",
      "createdAt": "2023-01-02T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z",
      "role": "USER"
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

## Get Specific User

Endpoint:

```http request
GET /api/users/:id
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "address": "123 Main St, Anytown, USA",
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z",
    "role": "USER"
  }
}
```

### Response body (Failed)

```json
{
  "errors": "Data not found"
}
```

## Update User

```http request
PUT /api/users/:id
```

### Request body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "address": "123 Main St, Anytown, USA",
  "password": "password123"
}
```

### Response body (Success)

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "address": "123 Main St, Anytown, USA",
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z",
    "role": "USER"
  }
}
```

### Response body (Failed)

```json
{
  "errors": "Failed to update user"
}
```

## Delete User

Endpoint:

```http request
DELETE /api/users/:id
```

### Response body (Success)

```json
{
  "message": "User deleted"
}
```

### Response body (Failed)

```json
{
  "errors": "Failed to delete user"
}
```

## Delete Users

Endpoint:

```http request
DELETE /api/users
```

### Response body (Success)

```json
{
  "message": "All user deleted"
}
```

### Response body (Failed)

```json
{
  "message": "Failed to delete all user"
}
```
