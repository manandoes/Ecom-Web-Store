import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  userName: string;
}

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Lumina Candles!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Lumina, {userName}</Heading>
          <Text style={text}>
            We&apos;re thrilled to have you here. Step into a world of curated, hand-poured scents designed to elevate your everyday rituals.
          </Text>
          <Section style={btnContainer}>
            <Link href="https://lumina-candles.com/candles" style={btn}>
              Explore the Collection
            </Link>
          </Section>
          <Text style={text}>
            If you have any questions or need recommendations, just reply to this email. We&apos;re always here to help.
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

export default WelcomeEmail;

const main = {
  backgroundColor: "#f6f4f0", /* Lumina Cream */
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
  color: "#0f0f10", /* Lumina Dark */
  fontSize: "24px",
  fontWeight: "500",
  lineHeight: "40px",
  margin: "0 0 20px",
};

const text = {
  color: "#3d3d40", /* Lumina Text Secondary */
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const btn = {
  backgroundColor: "#d4af37", /* Lumina Gold */
  borderRadius: "30px",
  color: "#0f0f10",
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
