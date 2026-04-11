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

interface PasswordResetProps {
  resetLink: string;
}

export const PasswordReset = ({ resetLink }: PasswordResetProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your Lumina Candles password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Reset your password</Heading>
          <Text style={text}>
            Someone requested that the password be reset for your Lumina account.
            If this was a mistake, just ignore this email and nothing will happen.
          </Text>
          <Section style={btnContainer}>
            <Link href={resetLink} style={btn}>
              Reset Password
            </Link>
          </Section>
          <Text style={text}>
            This link will expire in 1 hour.
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

export default PasswordReset;

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
