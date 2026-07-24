import { randomUUID } from "node:crypto";
import fetch from "node-fetch";

const GA4_ENDPOINT = "https://www.google-analytics.com/mp/collect";

/**
 * Envía un evento al Measurement Protocol de Google Analytics 4.
 * params puede incluir client_id. Si no se entrega, se crea uno válido para el evento.
 */
export async function sendGA4Event(eventName, params = {}) {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    throw new Error("GA4 no está configurado: faltan GA4_MEASUREMENT_ID o GA4_API_SECRET");
  }

  const { client_id: suppliedClientId, ...eventParams } = params;
  const clientId = String(suppliedClientId || `${randomUUID()}.1`);
  const url = new URL(GA4_ENDPOINT);
  url.searchParams.set("measurement_id", measurementId);
  url.searchParams.set("api_secret", apiSecret);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      events: [{ name: eventName, params: eventParams }]
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`GA4 respondió ${response.status}: ${details || "sin detalle"}`);
  }

  return { clientId, status: response.status };
}
