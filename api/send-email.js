import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailText = `
📩 NEW CONTACT MESSAGE – PHOTON-SHAPER

Name:
${name}

Email:
${email}

Message:
${message}
    `;

    await transporter.sendMail({
      from: `"Photon-Shaper Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: email,
      subject: "[Photon-Shaper] New Contact Message",
      text: mailText
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    res.status(500).json({ error: "Send failed" });
  }
}
