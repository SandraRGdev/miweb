import type { APIRoute } from 'astro';
import { db } from '../../db';
import { contactMessages } from '../../db/schema';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { name, email, projectType, message, website, timestamp, company } = data;

        // 1. Honeypot check
        if (website) {
            return new Response(JSON.stringify({ message: "Bot detected" }), { status: 403 });
        }

        // 2. Timestamp check
        const timeTaken = Date.now() - parseInt(timestamp || "0");
        if (timeTaken < 2000) {
            return new Response(JSON.stringify({ message: "Too fast! Bot detected" }), { status: 403 });
        }

        if (!name || !email || !message) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
        }

        // 3. Save to database (optional)
        if (import.meta.env.DATABASE_URL) {
            await db.insert(contactMessages).values({
                name,
                email,
                projectType,
                message,
            });
        }

        // 4. Send Email via Resend
        if (import.meta.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Contact Form <onboarding@resend.dev>',
                to: 'sandra.rg85@gmail.com',
                subject: `Nuevo mensaje de ${name} - Portafolio`,
                html: `
                    <h2>Nuevo mensaje de contacto</h2>
                    <p><strong>Nombre:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
                    <p><strong>Tipo de Proyecto:</strong> ${projectType || 'No especificado'}</p>
                    <p><strong>Mensaje:</strong></p>
                    <p>${message}</p>
                `
            });
        } else {
            console.warn("RESEND_API_KEY not found. Email not sent.");
        }

        return new Response(
            JSON.stringify({ message: "Success" }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        );
    }
};
