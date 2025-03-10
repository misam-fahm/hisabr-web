import { NextRequest, NextResponse } from 'next/server';
import nodemailer, { TransportOptions } from 'nodemailer';

interface CustomTransportOptions extends TransportOptions {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { to, subject, message } = await req.json();
        const transporterOptions: CustomTransportOptions = ({
            host: process.env.SMTP_HOST as string,
            port: Number(process.env.SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER as string, // Your email address
                pass: process.env.SMTP_PASS as string // Your password
            }
        });

        const transporter = nodemailer.createTransport(transporterOptions);
        const mailOptions = {
            from: `"Hisabr" <${process.env.SMTP_EMAIL}>`,
            to: to, // The email to send to
            subject: subject,
            text: message,
        };
    
        // Send email
        const info = await transporter.sendMail(mailOptions);
        return new NextResponse(
            JSON.stringify({ status: 200, message: 'Email sent successfully!', info}),
            { status: 200 }
          );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ status: 500, message: 'Error sending email', error: error.message }),
            { status: 500 }
        );
    }
}
