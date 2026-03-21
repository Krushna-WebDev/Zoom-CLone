import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const createBugReport = async (req, res) => {
  const { title, steps, expected, actual, email, browser, device } = req.body;
  console.log("got data", req.body);
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Bug Report: ${title}`,
      // plain text if html is disable
      text: `
        Bug Report Details
        ==================
        Title: ${title}
        User Email: ${email || "No email provided"}
        Device: ${device || "Not mentioned"}
        Browser: ${browser || "Not mentioned"}
  
        Steps to Reproduce:
        ${steps || "Not provided"}
  
        Expected:
        ${expected || "Not provided"}
  
        Actual:
        ${actual || "Not provided"}
          `.trim(),

      // 2. Beautiful HTML format
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 30px 15px; color: #1f2937;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
  
            <div style="background: linear-gradient(135deg, #ef4444, #f97316); padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">New Bug Report</h1>
              <p style="color: #fee2e2; margin: 5px 0 0 0; font-size: 14px;">Submitted from Chattique App</p>
            </div>
  
            <div style="padding: 30px;">
  
              <h2 style="margin-top: 0; color: #111827; font-size: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
                ${title}
              </h2>
  
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
                <table style="width: 100%; font-size: 14px; text-align: left; border-collapse: collapse;">
                  <tr>
                    <th style="padding: 6px 0; color: #64748b; width: 100px;">User Email:</th>
                    <td style="padding: 6px 0; font-weight: 500; color: #0f172a;">${email || "<span style='color: #94a3b8; font-style: italic;'>Not provided</span>"}</td>
                  </tr>
                  <tr>
                    <th style="padding: 6px 0; color: #64748b;">Device:</th>
                    <td style="padding: 6px 0; font-weight: 500; color: #0f172a;">${device || "<span style='color: #94a3b8; font-style: italic;'>Not mentioned</span>"}</td>
                  </tr>
                  <tr>
                    <th style="padding: 6px 0; color: #64748b;">Browser:</th>
                    <td style="padding: 6px 0; font-weight: 500; color: #0f172a;">${browser || "<span style='color: #94a3b8; font-style: italic;'>Not mentioned</span>"}</td>
                  </tr>
                </table>
              </div>
  
              <div style="margin-bottom: 20px;">
                <h3 style="color: #475569; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Steps to Reproduce</h3>
                <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; font-size: 15px; line-height: 1.5; color: #374151;">
                  ${steps ? steps.replace(/\n/g, "<br>") : "<span style='color: #9ca3af; font-style: italic;'>Not provided</span>"}
                </div>
              </div>
  
              <div style="margin-bottom: 20px;">
                <h3 style="color: #475569; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Expected Behavior</h3>
                <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; border-radius: 0 8px 8px 0; font-size: 15px; line-height: 1.5; color: #374151;">
                  ${expected ? expected.replace(/\n/g, "<br>") : "<span style='color: #9ca3af; font-style: italic;'>Not provided</span>"}
                </div>
              </div>
  
              <div>
                <h3 style="color: #475569; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Actual Behavior</h3>
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 0 8px 8px 0; font-size: 15px; line-height: 1.5; color: #374151;">
                  ${actual ? actual.replace(/\n/g, "<br>") : "<span style='color: #9ca3af; font-style: italic;'>Not provided</span>"}
                </div>
              </div>
  
            </div>
  
            <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">This is an automated message from your application.</p>
            </div>
  
          </div>
        </div>
      `.trim(),
    };

    if (req.file) {
      mailOptions.attachments = [
        {
          filename: req.file.originalname,
          path: req.file.path,
        },
      ];
    }
    const info = await transporter.sendMail(mailOptions);

    if (info.accepted?.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Bug report submitted successfully",
      });
    }

    if (info.rejected?.length > 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to submit bug report",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending bug report",
    });
  }
};
