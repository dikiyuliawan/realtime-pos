"use server";

import { INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constant";
import { createServerClient } from "@/lib/supabase/server";
import { AuthFromState } from "@/types/auth";
import { loginSchema } from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function login(
  prevState: AuthFromState,
  formData: FormData,
) {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }
  const validateFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: ["Invalid form data"],
      },
    };
  }

  const supabase = await createServerClient({});

  const { error, data } = await supabase.auth.signInWithPassword(
    validateFields.data,
  );

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Profile lookup failed", {
      userId: data.user.id,
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
    });

    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [profileError.message || "Profile lookup failed"],
      },
    };
  }

  if (!profile) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Profile not found for this user"],
      },
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("user_profile", JSON.stringify(profile), {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
  redirect("/");
}
