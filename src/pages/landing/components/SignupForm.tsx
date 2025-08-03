import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import api from "@/api/api"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { useCookie } from "@/hooks/Cookies";
import SignupPasswordInput from "@/components/custom/PasswordInput"
import { AxiosError } from "axios"

// Password requirements for validation
const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
];

// Zod schema for password requirements
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type SignupFormValues = z.infer<typeof signupSchema>

function checkPasswordRequirements(password: string) {
  return passwordRequirements.every((req) => req.regex.test(password));
}

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "" }
  })
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { set: setCookie } = useCookie();

  const registerMutation = useMutation({
    mutationFn: async ({ email, name, password }: { email: string; name: string; password: string }) => {
      const res = await api.post("/auth/register", { email, name, password });
      return res.data;
    },
    onSuccess: (data) => {
      setCookie('authUser', JSON.stringify(data.user));
      setCookie('access_token_cookie', data.token); // if you use a token
      queryClient.setQueryData(['authUser'], data.user);
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 400:
            setError("Invalid input. Please check your details and try again.");
            break;
          case 409:
            setError("Email already exists. Please use a different email.");
            break;
          default:
            setError("An unexpected error occurred. Please try again later.");
            break;
        }
      }
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true)
    setError(null)
    // Check password requirements before proceeding
    if (!checkPasswordRequirements(password)) {
      setIsLoading(false)
      return;
    }
    try {
      await registerMutation.mutateAsync({ email: data.email, name: data.name, password: password });
    } catch {
      // error handled in onError
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative mb-0">
          <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            className="pl-10"
            {...register("name")}
          />
        </div>
        {errors.name && (
          <span className="text-xs text-red-500 ml-2">{errors.name.message as string}</span>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative mb-0">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <span className="text-xs text-red-500 ml-2">{errors.email.message as string}</span>
        )}
      </div>
      <div className="space-y-2">
        <SignupPasswordInput
          value={password}
          onChange={setPassword}
        />
      </div>
      {error && (
        <Alert variant="authError">
          <AlertCircle />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={isLoading || !checkPasswordRequirements(password)}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating account...
          </div>
        ) : "Create Account"}
      </Button>
    </form>
  )
}