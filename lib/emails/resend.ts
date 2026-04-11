import { Resend } from "resend";
import WelcomeEmail from "@/components/emails/WelcomeEmail";
import OrderConfirmation from "@/components/emails/OrderConfirmation";
import OrderDispatched from "@/components/emails/OrderDispatched";
import PasswordReset from "@/components/emails/PasswordReset";

const resend = new Resend(process.env.RESEND_API_KEY || "re_test_placeholder");
const FROM_EMAIL = "Lumina Candles <hello@lumina-candles.com>";

export const sendWelcomeEmail = async (to: string, userName: string) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to Lumina Candles",
      react: WelcomeEmail({ userName }),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send welcome email", error);
    return { success: false, error };
  }
};

export const sendOrderConfirmationEmail = async (
  to: string,
  props: { orderNumber: string; customerName: string; total: string; items: any[] }
) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Order Confirmation #${props.orderNumber}`,
      react: OrderConfirmation(props),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send order confirmation email", error);
    return { success: false, error };
  }
};

export const sendOrderDispatchedEmail = async (
  to: string,
  props: { orderNumber: string; customerName: string; trackingLink: string }
) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Your order #${props.orderNumber} is on the way!`,
      react: OrderDispatched(props),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send order dispatched email", error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your password",
      react: PasswordReset({ resetLink }),
    });
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send password reset email", error);
    return { success: false, error };
  }
};
