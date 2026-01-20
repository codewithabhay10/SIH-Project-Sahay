"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { getDashboardRoute } from "@/lib/auth"
import { getTranslation } from "@/lib/translations"

const roles = [
  { value: "ministry", label: "Ministry" },
  { value: "pacc", label: "PACC" },
  { value: "state", label: "State" },
  { value: "sna", label: "SNA" },
  { value: "ia", label: "IA" },
  { value: "beneficiary", label: "Beneficiary" },
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "ministry",
  })

  useEffect(() => {
    const savedLang = localStorage.getItem('selectedLanguage') || 'en'
    setLanguage(savedLang)

    const handleLanguageChange = (event: Event) => {
      try {
        const ce = event as CustomEvent<{ language: string }>
        const newLang = ce?.detail?.language || localStorage.getItem('selectedLanguage') || 'en'
        setLanguage(newLang)
      } catch (err) {
        console.error('[Login] failed to handle languageChange', err)
      }
    }

    window.addEventListener('languageChange', handleLanguageChange as EventListener)
    return () => window.removeEventListener('languageChange', handleLanguageChange as EventListener)
  }, [])

  const t = (path: string) => getTranslation(language, path)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const user = await login(formData.email, formData.password)
      const dashboardRoute = getDashboardRoute(user)
      router.push(dashboardRoute)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen" style={{ width: "100%", background: "#FFFFFF" }}>
      {/* Left Panel - Orange Section */}
      <div
        className="relative hidden lg:flex lg:w-[588px] flex-col"
        style={{ background: "#EA9000", height: "100vh" }}
      >
        {/* Content Container */}
        <div
          className="flex flex-col gap-[58px] absolute"
          style={{ width: "493px", left: "32px", top: "46px" }}
        >
          {/* Logo */}
          <h1
            style={{
              fontFamily: "Onest, sans-serif",
              fontWeight: 900,
              fontSize: "48px",
              lineHeight: "61px",
              color: "#FFFFFF",
            }}
          >
            {t('login.brand')}
          </h1>

          {/* Text Content */}
          <div className="flex flex-col gap-7">
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "48px",
                lineHeight: "62px",
                color: "#FFFFFF",
              }}
            >
              {t('login.title')}
            </h2>
            <p
              style={{
                fontFamily: "Libre Franklin, sans-serif",
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: "140%",
                letterSpacing: "0.01em",
                color: "#FFFFFF",
              }}
            >
              {t('login.subtitle')}
            </p>
          </div>
        </div>

        {/* Bottom Image */}
        <div
          className="absolute"
          style={{
            width: "588px",
            height: "380px",
            left: "0px",
            bottom: "0px",
            overflow: "hidden",
          }}
        >
          <img
            src="/sign-up-image.png"
            alt="Construction Illustration"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "bottom center",
            }}
          />
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute"
          style={{
            width: "588px",
            height: "250px",
            left: "0px",
            bottom: "0px",
            background: "linear-gradient(180deg, rgba(234, 144, 0, 0) 0%, rgba(234, 144, 0, 0.6) 50%, #EA9000 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Right Panel - Form Section */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
        <div
          className="w-full flex flex-col gap-[30px]"
          style={{ maxWidth: "623px" }}
        >
          {/* Header */}
          <div className="flex flex-col gap-3.5">
            <h2
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "28px",
                lineHeight: "34px",
                color: "#333333",
              }}
            >
              {t('login.welcome')}
            </h2>
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "18px",
                lineHeight: "22px",
                letterSpacing: "-0.01em",
                color: "#565E6C",
              }}
            >
              {t('login.noAccount')}{" "}
              <Link href="/signup" style={{ color: "#EA9000", fontWeight: 500 }}>
                {t('login.signup')}
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                  color: "#535567",
                }}
              >
                {t('login.email')}<span style={{ color: "#EA9000" }}>*</span>
              </label>
              <input
                type="email"
                placeholder="Ex: ministry@gov.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  padding: "9px 12px",
                  background: "#FFFFFF",
                  border: "1px solid #E9E9F0",
                  borderRadius: "6px",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "12px",
                  lineHeight: "15px",
                  color: "#737373",
                }}
                required
                disabled={isLoading}
              />
            </div>

            {/* Role Selector - Removed for simplicity, role determined by email */}
            
            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "17px",
                  color: "#535567",
                }}
              >
                {t('login.password')}<span style={{ color: "#EA9000" }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t('login.passwordPlaceholder')}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "9px 40px 9px 12px",
                    background: "#FFFFFF",
                    border: "1px solid #E9E9F0",
                    borderRadius: "6px",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "12px",
                    lineHeight: "15px",
                    color: "#737373",
                  }}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ width: "18px", height: "18px" }}
                  disabled={isLoading}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 3.75C5.25 3.75 2.0475 6.0375 0.75 9.375C2.0475 12.7125 5.25 15 9 15C12.75 15 15.9525 12.7125 17.25 9.375C15.9525 6.0375 12.75 3.75 9 3.75ZM9 13.125C6.93 13.125 5.25 11.445 5.25 9.375C5.25 7.305 6.93 5.625 9 5.625C11.07 5.625 12.75 7.305 12.75 9.375C12.75 11.445 11.07 13.125 9 13.125ZM9 7.125C7.7575 7.125 6.75 8.1325 6.75 9.375C6.75 10.6175 7.7575 11.625 9 11.625C10.2425 11.625 11.25 10.6175 11.25 9.375C11.25 8.1325 10.2425 7.125 9 7.125Z"
                      fill="#8D90AA"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "12px 24px",
                gap: "6px",
                width: "100%",
                height: "50px",
                background: isLoading ? "#d68000" : "#EA9000",
                borderRadius: "12px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: "150%",
                textAlign: "center",
                color: "#FFFFFF",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.background = "#d68000"
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.background = "#EA9000"
              }}
            >
              {isLoading ? t('login.submitting') : t('login.submit')}
            </button>

            {/* Forgot Password */}
            <div className="text-center">
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  color: "#565E6C",
                }}
              >
                {t('login.forgotPassword')}{" "}
                <Link href="/forgot-password" style={{ color: "#EA9000", fontWeight: 500 }}>
                  {t('login.clickHere')}
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p
              className="text-center"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: "14px",
                color: "#737373",
              }}
            >
              {t('login.terms')}{" "}
              <Link href="/terms" style={{ color: "#EA9000", fontWeight: 500 }}>
                {t('login.termsLink')}
              </Link>{" "}
              |{" "}
              <Link href="/privacy" style={{ color: "#EA9000", fontWeight: 500 }}>
                {t('login.privacyLink')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
