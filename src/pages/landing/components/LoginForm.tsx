import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import api from "@/api/api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/hooks/AuthContext"
import { useCookie } from "@/hooks/Cookies";
import { AxiosError } from "axios"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const { loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string[] | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  })
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { set: setCookie } = useCookie();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await api.post("/auth/login", { email, password });
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
          case 401:
            setError(["Invalid email or password", "Please check your credentials and try again."]);
            break;
          case 403:
            setError(["Your account is not authorized to access this resource", "Please contact support if you believe this is an error."]);
            break;
          default:
            setError(["An Unexpected Error Occurred", "Please try again later or contact support if the issue persists."]);
            break;
        }
      } else {
        setError(["An Unexpected Error Occurred", "Please try again later or contact support if the issue persists."]);
      }
    }
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      await loginMutation.mutateAsync({ email: data.email, password: data.password })
    } catch {
      // error handled in onError
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative mb-0">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            autoComplete="email webauthn"
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
        <Label htmlFor="password">Password</Label>
        <div className="relative mb-0">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="password"
            autoComplete="current-password webauthn"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3"
            style={{ top: 0, bottom: 0, height: "auto" }}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-2 h-2" /> : <Eye className="w-2 h-2" />}
          </Button>
        </div>
        {errors.password && (
          <span className="text-xs text-red-500 ml-2">{errors.password.message as string}</span>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
          <span className="text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-blue-600 hover:underline">
          Forgot password?
        </a>
      </div>
      {error && (
        <Alert variant="authError">
          <AlertCircle />
          <AlertTitle style={{ whiteSpace: "pre-line" }}>{error[0]}</AlertTitle>
          {
            error.length > 1 && (
              <AlertDescription className="mt-2">
                {error[1]}
              </AlertDescription>
            )
          }
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={isLoading || loading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Signing in...
          </div>
        ) : "Sign In"}
      </Button>
    </form>
  )
}