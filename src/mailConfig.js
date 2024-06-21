import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sistemadegestiondeincidentes@gmail.com", // Tu dirección de correo electrónico
    pass: "c c d n z k j t e d n h z n u r", // Tu contraseña de Gmail
  },
});

export function EmailAsignacion(
  correoUsuario,
  nombreUsuario,
  numeroIncidencia
) {
  const mailOptions = {
    from: "sistemadegestiondeincidentes@gmail.com",
    to: correoUsuario,
    subject: "Asignación de Incidencia",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: auto;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background-color: #4caf50;
          color: #fff;
          padding: 10px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .email-body {
          padding: 20px;
        }
        .email-footer {
          background-color: #f1f1f1;
          padding: 10px;
          border-radius: 0 0 8px 8px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h2>Sistema de Gestión de Incidencias</h2>
        </div>
        <div class="email-body">
          <p>Estimado/a <strong>${nombreUsuario}</strong>,</p>
          <p>Su incidencia <strong>${numeroIncidencia}</strong> ha sido asignada.</p>
          <p>Saludos cordiales.</p>
        </div>
        <div class="email-footer">
          <p>Sistema de Gestión de Incidencias</p>
        </div>
      </div>
    </body>
    </html>`,
  };

  transporter.sendMail(mailOptions);
}
