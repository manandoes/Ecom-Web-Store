import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationProps {
  orderNumber: string;
  customerName: string;
  total: string;
  items: {
    name: string;
    quantity: number;
    price: string;
  }[];
}

export const OrderConfirmation = ({
  orderNumber,
  customerName,
  total,
  items,
}: OrderConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Lumina Candles Order {orderNumber} is Confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your order, {customerName}!</Heading>
          <Text style={text}>
            We&apos;ve received your order and are currently processing it. We&apos;ll notify you again when your candles are on their way.
          </Text>

          <Section style={orderSection}>
            <Text style={orderInfo}>Order #: <strong>{orderNumber}</strong></Text>
            
            <Hr style={hr} />
            
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemColName}>
                  <Text style={itemText}>{item.name} × {item.quantity}</Text>
                </Column>
                <Column style={itemColPrice}>
                  <Text style={itemPriceText}>₹{item.price}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />
            
            <Row style={totalRow}>
              <Column style={itemColName}>
                <Text style={totalTextLabel}>Total</Text>
              </Column>
              <Column style={itemColPrice}>
                <Text style={totalTextValue}>₹{total}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={btnContainer}>
            <Link href={`https://lumina-candles.com/account/orders`} style={btn}>
              View Order Status
            </Link>
          </Section>

          <Text style={footer}>
            Light & Love,<br />
            The Lumina Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmation;

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

const orderSection = {
  backgroundColor: "#fcfcfc",
  padding: "24px",
  borderRadius: "8px",
  border: "1px solid #e2ddce",
  margin: "24px 0",
};

const orderInfo = {
  fontSize: "14px",
  color: "#0f0f10",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e2ddce",
  margin: "16px 0",
};

const itemRow = {
  width: "100%",
  margin: "8px 0",
};

const itemColName = {
  width: "70%",
};

const itemColPrice = {
  width: "30%",
  textAlign: "right" as const,
};

const itemText = {
  fontSize: "14px",
  color: "#3d3d40",
  margin: 0,
};

const itemPriceText = {
  fontSize: "14px",
  color: "#0f0f10",
  margin: 0,
  fontWeight: "500",
};

const totalRow = {
  width: "100%",
  marginTop: "16px",
};

const totalTextLabel = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#0f0f10",
  margin: 0,
};

const totalTextValue = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#0f0f10",
  margin: 0,
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
