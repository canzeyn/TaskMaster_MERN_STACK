import nodemailer from "nodemailer"

// Global olarak e-posta gönderme fonksiyonunu tanımla
const  sendEmail = async(to:string, subject:string, text:string) => {
    // İlk olarak test hesabını oluştur
    let testAccount = await nodemailer.createTestAccount();

    // Test hesabı bilgileri ile transporter objesini oluştur
    let transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure, // true for 465, false for other ports
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let mailOptions = {
        from: '"Test Sender" <example@ethereal.email>',
        to: to,
        subject: subject,
        text: text,
        // html: "<b>Hello world?</b>", // Opsiyonel HTML gövde
    };

    // E-posta gönder ve bilgiyi logla
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

// Fonksiyonu dışa aktar
export default sendEmail;
