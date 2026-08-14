"use client";

import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { LoginForm, loginSchema } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_LOGIN_FORM } from "@/constants/auth-constant";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/form-input";

export default function Login() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const onSubmit = form.handleSubmit(async () => {
    console.log("Form submitted successfully");
  });

  return (
    <Card>
      <CardHeader className="text-center text-2xl font-bold">
        Welcome to Realtime POS
      </CardHeader>
      <CardDescription className="text-center text-sm">
        Please login to access all features
      </CardDescription>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput
              form={form}
              name="email"
              label="Email"
              placeholder="Enter your email"
              type="email"
            />
            <FormInput
              form={form}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />
            <Button type="submit">Login</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
