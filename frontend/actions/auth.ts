"use server";

import { registerUserService } from "@/lib/strapi";
import { type FormState, SignupFormSchema } from "@/validations/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const cookieConfig = {
    maxAgwe: 60 * 60 * 24 * 7, // 1 week
    httpOnly: true,
    path: '/',
    domain: process.env.HOST ?? 'localhost',
    secure: process.env.NODE_ENV === 'production',
}

export async function registerUserAction(prevState: FormState , formData: FormData): Promise<FormState> {
    const fields = {
        username: formData.get("username") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const validatedFields = SignupFormSchema.safeParse(fields);

    if (!validatedFields.success) {
        const flattenedErrors = z.flattenError(validatedFields.error);
        console.log("Validation Errors: ", flattenedErrors.fieldErrors);

        return {
            success: false,
            message: "Validation errors occurred.",
            strapiErrors: null,
            zodErrors: flattenedErrors.fieldErrors,
            data: {
                ...prevState.data,
                ...fields
            }
        };
    }

    const response = await registerUserService(validatedFields.data);

    if (!response || response.error) {
        console.log("Strapi Errors: ", response?.error?.message || "Unknown error");
        return {
            success: false,
            message: "Error registering user.",
            strapiErrors: response?.error?.message || "Unknown error",
            zodErrors: null,
            data: fields
        };
    }

    const cookieStore = await cookies();
    cookieStore.set('jwt', response.jwt, cookieConfig);
    redirect('/dashboard');

}