# Authentication API Spesification

Full documentation for authentication API Spesification

| Endpoint                  | Method | Description          |
| ------------------------- | ------ | -------------------- |
| `/api/auth/register`      | `POST` | Register new user    |
| `/api/auth/login`         | `POST` | Login user           |
| `/api/auth/refresh-token` | `POST` | Refresh access token |

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
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      "tokenType": "Bearer",
      "expiresIn": 3600
    }
  }
}
```

### Response body (Failed)

```json
{
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

## Login User

Endpoint:

```http request
POST /api/auth/login
```

### Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Response Body (Success)

```json
{
  "success": true,
  "message": "Login success",
  "data": {
    "user": {
      "id": "40739dc7-726e-4b8a-babe-6a0e51f36ce6",
      "email": "john.doe@example.com",
      "role": "USER"
    },
    "auth": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      "tokenType": "Bearer",
      "expiresIn": 3600
    }
  }
}
```

### Response Body (Failed)

```json
{
  "success": false,
  "message": "Invalid email or password",
  "errors": "Invalid email or password"
}
```

## Refresh Access Token

Notes: Refresh Token stored in Cookie HTTP-Only: true

Endpoint:

```http request
POST /api/auth/refresh-token
```

### Response Body (Success)

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "auth": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      "tokenType": "Bearer",
      "expiresIn": 3600
    }
  }
}
```

### Response Body (Failed)

```json
{
  "success": false,
  "message": "Invalid token",
  "errors": "Invalid email or password"
}
```
