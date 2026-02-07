import { ClientSecretCredential } from "@azure/identity";
import { Client } from "@microsoft/microsoft-graph-client";
import {
  TokenCredentialAuthenticationProvider,
} from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";
import { APP_NAME, OTP_EXPIRY_MINUTES } from "./constants";

let mailClient: Client | null = null;

function getMailClient(): Client {
  if (mailClient) return mailClient;

  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID!,
    process.env.AZURE_CLIENT_ID!,
    process.env.AZURE_CLIENT_SECRET!
  );

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"],
  });

  mailClient = Client.initWithMiddleware({ authProvider });
  return mailClient;
}

/**
 * Send an OTP PIN to the specified email address via Microsoft Graph Mail API
 */
export async function sendOtpEmail(
  email: string,
  pin: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const senderEmail = process.env.FROM_EMAIL!;

    const message = {
      message: {
        subject: `${APP_NAME} — Your Login PIN`,
        body: {
          contentType: "HTML",
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #1a1a1a; margin-bottom: 8px;">${APP_NAME}</h2>
              <p style="color: #555; font-size: 15px;">
                Your login PIN is:
              </p>
              <div style="
                background: #f4f4f5;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 20px 0;
              ">
                <span style="
                  font-size: 32px;
                  font-weight: bold;
                  letter-spacing: 8px;
                  color: #1a1a1a;
                ">${pin}</span>
              </div>
              <p style="color: #555; font-size: 14px;">
                This PIN expires in ${OTP_EXPIRY_MINUTES} minutes. Do not share it with anyone.
              </p>
              <p style="color: #999; font-size: 12px; margin-top: 24px;">
                If you did not request this PIN, please ignore this email.
              </p>
            </div>
          `,
        },
        toRecipients: [
          {
            emailAddress: { address: email },
          },
        ],
      },
      saveToSentItems: false,
    };

    await getMailClient()
      .api(`/users/${senderEmail}/sendMail`)
      .post(message);

    return { success: true };
  } catch (err) {
    console.error("Email send exception:", err);
    return { success: false, error: "Failed to send email. Please try again." };
  }
}
