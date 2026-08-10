import { Resend } from "resend";
import { env } from "@/lib/env";
import * as Sentry from "@sentry/nextjs";

const resend = new Resend(env.RESEND_API_KEY);

export const sendSystemEmail = async (to: string, subject: string, html: string) => {
  try {
    const data = await resend.emails.send({
      from: "Vistara Connect <noreply@vistaraconnect.com>",
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    Sentry.captureException(error);
    console.error("[EmailService Error]", error);
    throw new Error("Failed to send email");
  }
};
