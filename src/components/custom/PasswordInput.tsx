import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface SignupPasswordInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SignupPasswordInput({
  value,
  onChange,
}: SignupPasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  // Password strength logic
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ]
    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }
  const strength = checkStrength(value)
  const strengthScore = strength.filter((req) => req.met).length
  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-neutral-200 dark:bg-neutral-800"
    if (score <= 1) return "bg-red-500"
    if (score <= 2) return "bg-orange-500"
    if (score === 3) return "bg-amber-500"
    return "bg-emerald-500"
  }
  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password"
    if (score <= 2) return "Weak password"
    if (score === 3) return "Medium password"
    return "Strong password"
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="password">Password</Label>
      <div className="relative mb-0">
        <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="pl-10 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="absolute right-0 top-0 h-full px-3 text-gray-500"
          style={{ top: 0, bottom: 0, height: "auto" }}
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {/* Password strength indicator */}
      <div
        className="bg-neutral-200 mt-3 mb-2 h-1 w-full overflow-hidden rounded-full dark:bg-neutral-800"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label="Password strength"
      >
        <div
          className={`h-full ${getStrengthColor(
            strengthScore
          )} transition-all duration-500 ease-out`}
          style={{ width: `${(strengthScore / 4) * 100}%` }}
        ></div>
      </div>
      <p className="text-neutral-950 mb-2 text-sm font-medium dark:text-neutral-50">
        {getStrengthText(strengthScore)}. Must contain:
      </p>
      <ul className="space-y-1.5" aria-label="Password requirements">
        {strength.map((req, index) => (
          <li key={index} className="flex items-center gap-2">
            {req.met ? (
              <span className="text-emerald-500">✔</span>
            ) : (
              <span className="text-neutral-500/80 dark:text-neutral-400/80">✖</span>
            )}
            <span
              className={`text-xs ${req.met ? "text-emerald-600" : "text-neutral-500 dark:text-neutral-400"}`}
            >
              {req.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
