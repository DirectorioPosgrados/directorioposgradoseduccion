"use server";

import { cookies } from "next/headers";

const USUARIO = "admin";
const PASSWORD = "admin@2026";
const COOKIE_NAME = "ctl_panel_auth";

export async function loginPanel(
    usuario: string,
    password: string
): Promise<{ ok: boolean; message?: string }> {
    if (usuario !== USUARIO || password !== PASSWORD) {
        return { ok: false, message: "Usuario o contraseña incorrectos." };
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 horas
        path: "/",
    });

    return { ok: true };
}

export async function logoutPanel(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function verificarSesionPanel(): Promise<boolean> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value === "1";
}