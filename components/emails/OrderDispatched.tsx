import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Link,
} from "@react-email/components";
import * as React from "react";

interface OrderDispatchedProps {
  orderNumber: string;
  customerName: string;
  trackingLink: string;
}

export const OrderDispatched = ({
  orderNumber,
  customerName,
  trackingLink,
}: OrderDispatchedProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Lumina Candles Order {orderNumber} has been dispatched!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Great news, {customerName}!</Heading>
          <Text style={text}>
            Your order <strong>{orderNumber}</strong> has been carefully packed and is now on its way to you.
          </Text>
          <Section style={btnContainer}>
            <Link href={trackingLink} style={btn}>
              Track Your Package
            </Link>
          </Section>
          <Text style={text}>
            Please note that it may take up to 24 hours for tracking information to update.
          </Text>
          <Text style={footer}>
            Light & Love,<br />
            The Lumina Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderDispatched;

const main = {
  backgroundColor: "#f6f4f0",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  maxWidth: "600px",
};

const h1 = {
  color: "#0f0f10",
  fontSize: "24px",
  fontWeight: "500",
  margin: "0 0 20px",
};

const text = {
  color: "#3d3d40",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const btn = {
  backgroundColor: "#0f0f10",
  borderRadius: "30px",
  color: "#f6f4f0",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 28px",
};

const footer = {
  color: "#8b8b8b",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "48px",
};
