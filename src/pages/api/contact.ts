import type { APIRoute } from 'astro';
import { db } from '../../db';
import { contactMessages } from '../../db/schema';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const bodyText = await request.text();

        if (!bodyText) {
            return new Response(JSON.stringify({ message: "Empty request body" }), { status: 400 });
        }

        let data;
        try {
            data = JSON.parse(bodyText);
        } catch (e: any) {
            return new Response(JSON.stringify({ message: "Invalid JSON", error: e.message }), { status: 400 });
        }

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
        const databaseUrl = import.meta.env.DATABASE_URL || (typeof process !== 'undefined' ? process.env.DATABASE_URL : null);
        if (databaseUrl && databaseUrl.trim() !== "") {
            try {
                await db.insert(contactMessages).values({
                    name,
                    email,
                    projectType: projectType || "Not specified",
                    message,
                });
            } catch (dbError: any) {
                console.error("Database error:", dbError.message);
            }
        }

        // 4. Send Email via Resend
        const resendKey = import.meta.env.RESEND_API_KEY || (typeof process !== 'undefined' ? process.env.RESEND_API_KEY : null);

        if (resendKey) {
            try {
                const resend = new Resend(resendKey);
                const { error: emailError } = await resend.emails.send({
                    from: 'Contact Form <onboarding@resend.dev>',
                    to: 'sandra.rg85@gmail.com',
                    subject: `Nuevo mensaje de ${name} - Portafolio`,
                    html: `
                        <h2>Nuevo mensaje de contacto</h2>
                        <p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
                        <p><strong>Tipo de Proyecto:</strong> ${projectType || 'No especificada'}</p>
                        <p><strong>Mensaje:</strong></p>
                        <p>${message}</p>
                    `
                });

                if (emailError) {
                    console.error("Resend API Error:", emailError);
                    return new Response(JSON.stringify({ message: "Email delivery failed", error: emailError }), { status: 500 });
                }
            } catch (resendException: any) {
                console.error("Resend exception:", resendException.message);
                return new Response(JSON.stringify({ message: "Resend exception", error: resendException.message }), { status: 500 });
            }
        } else {
            console.warn("RESEND_API_KEY not found in import.meta.env or process.env");
            return new Response(JSON.stringify({ message: "Server configuration error: Email key missing" }), { status: 500 });
        }

        return new Response(
            JSON.stringify({ message: "Success" }),
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Global API Error:", error);
        return new Response(
            JSON.stringify({
                message: "Internal Server Error",
                error: error.message,
                stack: error.stack
            }),
            { status: 500 }
        );
    }
};
