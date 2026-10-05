import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { CONTACT_COLLECTION, firebaseConfigured, getDb } from "./firebase";

export type Enquiry = { name: string; email: string; company?: string | undefined; service: string; message: string };

export const backendReady = firebaseConfigured;

/** Stores the enquiry in Firestore, then sends an email notification via EmailJS (if configured). */
export async function submitEnquiry(v: Enquiry) {
  await addDoc(collection(getDb(), CONTACT_COLLECTION), {
    name: v.name,
    email: v.email,
    company: v.company || "",
    service: v.service,
    message: v.message,
    status: "new",
    createdAt: serverTimestamp(),
  });

  const serviceId = import.meta.env['VITE_EMAILJS_SERVICE_ID'] as string | undefined;
  const templateId = import.meta.env['VITE_EMAILJS_TEMPLATE_ID'] as string | undefined;
  const publicKey = import.meta.env['VITE_EMAILJS_PUBLIC_KEY'] as string | undefined;
  if (serviceId && templateId && publicKey) {
    try {
      await emailjs.send(serviceId, templateId, { ...v, company: v.company || "-" }, { publicKey });
    } catch (e) {
      console.error("Email notification failed; enquiry was still saved.", e);
    }
  }
}
