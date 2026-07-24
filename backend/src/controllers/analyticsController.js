import { randomUUID } from "node:crypto";
import { sendGA4Event } from "../ga4.js";

function getClientId(req) {
  return req.query.client_id || req.body?.client_id || req.get("x-ga-client-id") || `${randomUUID()}.1`;
}

export async function registerVisit(req, res) {
  try {
    const clientId = getClientId(req);
    const result = await sendGA4Event("page_view", {
      client_id: clientId,
      page_location: req.query.page_location || req.get("referer") || "aqua-sun",
      page_title: req.query.page_title || "AQUA SUN",
      engagement_time_msec: 1
    });

    res.status(202).json({ message: "Visita registrada", client_id: result.clientId });
  } catch (error) {
    console.error("No fue posible registrar la visita:", error.message);
    res.status(502).json({ error: "No fue posible registrar la visita en GA4" });
  }
}

export async function registerPurchase(req, res) {
  const { transaction_id: transactionId, value, currency = "CLP", items = [] } = req.body || {};

  if (!transactionId || !Number.isFinite(Number(value))) {
    return res.status(400).json({
      error: "transaction_id y value numérico son obligatorios"
    });
  }

  try {
    const result = await sendGA4Event("purchase", {
      client_id: getClientId(req),
      transaction_id: String(transactionId),
      value: Number(value),
      currency: String(currency).toUpperCase(),
      items: Array.isArray(items) ? items : [],
      engagement_time_msec: 1
    });

    res.status(202).json({ message: "Compra registrada", client_id: result.clientId });
  } catch (error) {
    console.error("No fue posible registrar la compra:", error.message);
    res.status(502).json({ error: "No fue posible registrar la compra en GA4" });
  }
}
