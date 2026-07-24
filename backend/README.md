# AQUA SUN Backend

## Ejecutar localmente

1. Copia los valores de `.env.example` a `.env` y completa las credenciales de GA4.
2. Ejecuta `npm install`.
3. Ejecuta `npm start`.

El servicio queda disponible en `http://localhost:3000`.

## Endpoints

- `GET /` — estado del backend.
- `GET /api/visit?client_id=123.456&page_location=https://example.com` — registra `page_view` en GA4.
- `POST /api/purchase` — registra `purchase` en GA4.

Ejemplo de compra:

```json
{
  "client_id": "123.456",
  "transaction_id": "AQUA-1001",
  "value": 5990,
  "currency": "CLP",
  "items": [{ "item_id": "aqua-sun", "item_name": "AQUA SUN", "quantity": 1, "price": 5990 }]
}
```

## Render

Configura el servicio desde la carpeta `backend` con:

- Build Command: `npm install`
- Start Command: `npm start`

Define `GA4_MEASUREMENT_ID` y `GA4_API_SECRET` como variables de entorno en Render. No subas secretos al repositorio.
