import { getCurrentSession, loginUser } from "@/actions/auth";
import SignIn from "@/components/auth/SignIn";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { z } from "zod";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function SignUpPage() {
  const { user } = await getCurrentSession();

  if (user) return redirect("/");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const action = async (prevState: any, formData: FormData) => {
    "use server";

    const parsed = SignInSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
      return { message: "Invalid form data" };
    }

    const { email, password } = parsed.data;
    const { user, error } = await loginUser(email, password);
    if (error) {
      return { message: error };
    } else if (user) {
      return redirect("/");
    }
  };

  return <SignIn action={action} />;
}
