import { google } from 'googleapis';
import nodemailer, { Transporter , SendMailOptions } from 'nodemailer';

const OAuth2 = google.auth.OAuth2;

const createTransporter = async (): Promise<Transporter> => {
  const oauth2Client = new OAuth2(
    "YOUR_CLIENT_ID", // Müşteri Kimliği
    "YOUR_CLIENT_SECRET", // Müşteri Sırrı
    "https://developers.google.com/oauthplayground" // Yönlendirme URI'si
  );

  oauth2Client.setCredentials({
    refresh_token: "YOUR_REFRESH_TOKEN"
  });

  const accessToken = await new Promise<string>((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject(new Error("Failed to create access token :("));
      } else if (token) { // Burada token'ın null veya undefined olmadığından emin olun
        resolve(token); // token değeri kesinlikle string olmalı
      } else {
        reject(new Error("Received token is undefined or null"));
      }
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "your-email@gmail.com",
      accessToken, // AccessToken burada kullanılıyor
      clientId: "YOUR_CLIENT_ID",
      clientSecret: "YOUR_CLIENT_SECRET",
      refreshToken: "YOUR_REFRESH_TOKEN"
    }
  });

  return transporter;
};

const sendEmail = async (emailOptions: SendMailOptions) => {
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};
