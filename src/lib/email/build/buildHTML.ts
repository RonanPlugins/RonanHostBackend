import fs from "fs";
import * as path from "path";
import sendGrid from "@sendgrid/mail";
import dotenv from "dotenv"
dotenv.config()

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

interface eTyp {
    [key: string]: string;
}
export default function buildHTML(htmlPath: string, values: eTyp): Promise<string> {
    const html = path.resolve(process.cwd(), htmlPath);

    return new Promise((resolve, reject) => {
        fs.readFile(html, "utf-8", (err, data) => {
            if (err) return reject(err);

            let emailContent = data;
            for (const key in values) {
                const regex = new RegExp(`{{${key}}}`, "g");
                emailContent = emailContent.replace(regex, values[key]);
            }
            resolve(emailContent);
        });
    });
}

export async function send(to: string, from: string = "noreply@ronanhost.com", subject: string, html: string) {
    const msg = {
        to: to,
        from: from, // Use the email address or domain you verified above
        subject: subject,
        html: html,
    };
    try {
        await sendGrid.send(msg)
    } catch (e) {
        console.error(e)
        if (e.response) {
            console.error(e.response.body)
        }
    }
}
export async function sendDynamic(to: string, from: string = "noreply@ronanhost.com", subject: string, templateId: string, dynamicTemplateData: any) {
    const msg = {
        to: to,
        from: from,
        subject: subject,
        templateId: templateId,
        dynamicTemplateData: dynamicTemplateData,
    };
    try {
        // @ts-ignore
        await sendGrid.send(msg)
    } catch (e) {
        console.error(e)
        if (e.response) {
            throw e
        }
    }
}