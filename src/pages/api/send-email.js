import nodemailer from 'nodemailer';

export async function POST({ request }) {
  let data;

  try {
    // Intentamos obtener el cuerpo de la solicitud como JSON
    data = await request.json();
    console.log("Datos recibidos en el servidor:", data); // Imprime los datos para depuración
  } catch (error) {
    // Si no se puede parsear el JSON, enviamos un error
    return new Response(JSON.stringify({ success: false, error: "No se recibió JSON válido" }), { status: 400 });
  }

  // Verifica que los datos necesarios estén presentes
  if (!data.name || !data.email || !data.message) {
    return new Response(JSON.stringify({ success: false, error: "Todos los campos son obligatorios" }), { status: 400 });
  }

  // Configuración de Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    }
  });

  const mailOptions = {
    from: data.email,
    to: process.env.GMAIL_USER,
    subject: `Nuevo mensaje de ${data.name}`,
    text: data.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
