import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface OrderEmailData {
  orderNumber: string;
  total: string;
  customerEmail: string;
  items: { productName: string; variantName: string; quantity: number; lineTotal: string }[];
}

export async function sendAdminOrderEmail(order: OrderEmailData) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping order notification email");
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("[email] ADMIN_EMAIL not set — skipping order notification email");
    return;
  }

  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #2a2a2e;">${item.productName} — ${item.variantName}</td>
          <td style="padding:8px 0;border-bottom:1px solid #2a2a2e;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #2a2a2e;text-align:right;">₹${item.lineTotal}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0f0f10;color:#e8e8e8;padding:32px;border-radius:12px;">
      <h2 style="color:#f59e0b;margin-top:0;">New Order Confirmed 🔔</h2>
      <p style="color:#8b8b8b;margin-bottom:24px;">A new order has been confirmed on your store.</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="color:#8b8b8b;padding:6px 0;">Order Number</td>
          <td style="text-align:right;font-family:monospace;color:#f59e0b;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="color:#8b8b8b;padding:6px 0;">Customer Email</td>
          <td style="text-align:right;">${order.customerEmail}</td>
        </tr>
        <tr>
          <td style="color:#8b8b8b;padding:6px 0;">Order Total</td>
          <td style="text-align:right;font-weight:600;color:#34d399;">₹${order.total}</td>
        </tr>
      </table>

      <h3 style="font-size:14px;color:#8b8b8b;margin-bottom:12px;">ITEMS</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr style="color:#8b8b8b;font-size:12px;">
            <th style="text-align:left;padding-bottom:8px;">Product</th>
            <th style="text-align:center;padding-bottom:8px;">Qty</th>
            <th style="text-align:right;padding-bottom:8px;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div style="margin-top:28px;">
        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/admin/orders"
           style="display:inline-block;background:#f59e0b;color:#0f0f10;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          View in Admin Dashboard →
        </a>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Lumina Store <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Order Confirmed: #${order.orderNumber}`,
      html,
    });
  } catch (e) {
    console.error("[email] Failed to send admin order email:", e);
  }
}
