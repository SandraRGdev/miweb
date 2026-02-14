import type { APIRoute } from 'astro';
import { db } from '../../db';
import { contactMessages } from '../../db/schema';

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { name, email, projectType, message, website, timestamp } = data;

        // 1. Honeypot check (website field should be empty)
        if (website) {
            return new Response(JSON.stringify({ message: "Bot detected" }), { status: 403 });
        }

        // 2. Timestamp check (should take at least 2 seconds to fill)
        const timeTaken = Date.now() - parseInt(timestamp || "0");
        if (timeTaken < 2000) {
            return new Response(JSON.stringify({ message: "Too fast! Bot detected" }), { status: 403 });
        }

        if (!name || !email || !message) {
            return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
        }

        // Attempt to save to database (will fail if no DATABASE_URL is set, but structure is correct)
        if (import.meta.env.DATABASE_URL) {
            await db.insert(contactMessages).values({
                name,
                email,
                projectType,
                message,
            });
        } else {
            console.warn("DATABASE_URL not found. Skipping DB insertion but returning success for demo purposes.");
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
