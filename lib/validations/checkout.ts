import { z } from "zod";

export const checkoutAddressSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(80),
  lastName: z.string().min(1, "Last name is required").max(80),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required").max(20),
  line1: z.string().min(1, "Address is required").max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  pinCode: z
    .string()
    .min(6, "Valid PIN code required")
    .max(10)
    .regex(/^\d{6}$/, "PIN code must be 6 digits"),
  saveAddress: z.boolean().default(false),
});

export const checkoutDeliverySchema = z.object({
  shippingMethod: z.enum(["standard", "express"]),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().max(2000).optional(),
});

export type CheckoutAddress = z.infer<typeof checkoutAddressSchema>;
export type CheckoutDelivery = z.infer<typeof checkoutDeliverySchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
