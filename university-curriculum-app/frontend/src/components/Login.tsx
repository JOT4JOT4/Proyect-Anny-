import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ type: "info" | "success" | "error"; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "info", message: "Verificando credenciales..." });

    setTimeout(() => {
      if (email.includes("@universidad.edu") && password.length >= 6) {
        setStatus({ type: "success", message: "✅ Acceso exitoso. Redirigiendo..." });
        setTimeout(() => {
          setStatus({
            type: "info",
            message: "🎓 Bienvenido al portal académico. En un sistema real, serías redirigido a la malla curricular.",
          });
        }, 1500);
      } else {
        setStatus({
          type: "error",
          message: "❌ Credenciales incorrectas. Verifica tu correo institucional y contraseña.",
        });
      }
    }, 1500);
  };

  const getStatusClass = () => {
    if (!status) return "hidden";
    if (status.type === "info") return "p-3 rounded-lg text-sm text-center bg-blue-50 text-blue-700";
    if (status.type === "success") return "p-3 rounded-lg text-sm text-center bg-green-50 text-green-700";
    if (status.type === "error") return "p-3 rounded-lg text-sm text-center bg-red-50 text-red-700";
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 university-pattern">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <header className="bg-white shadow-sm border-b-2 border-blue-100 rounded-xl mb-4">
          <div className="flex justify-between items-center h-16 px-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-600">Universidad</h1>
                <p className="text-xs text-gray-500">Portal Académico</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">Ayuda</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Soporte Técnico</a>
              <a href="#" className="hover:text-blue-600 transition-colors">Contacto</a>
            </div>
          </div>
        </header>

        {/* Logo y Título */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Acceso al Portal</h2>
          <p className="text-gray-600">Ingresa con tu correo institucional</p>
        </div>

        {/* Formulario de Login */}
        <div className="login-card rounded-2xl shadow-2xl p-8 border border-white/20 bg-white/95 backdrop-blur">
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            {/* Campo de Email */}
            <div className="input-group relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder=" "
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 peer"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={e => {
                  if (e.target.value && !e.target.value.includes("@universidad.edu")) {
                    e.target.style.borderColor = "#ef4444";
                    e.target.style.backgroundColor = "#fef2f2";
                  } else {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.backgroundColor = "rgba(255,255,255,0.8)";
                  }
                }}
              />
              <label htmlFor="email" className="floating-label absolute left-3 top-3 transition-all pointer-events-none text-gray-400 peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-blue-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400">
                Correo Institucional
              </label>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
            </div>

            {/* Campo de Contraseña */}
            <div className="input-group relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder=" "
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 peer"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <label htmlFor="password" className="floating-label absolute left-3 top-3 transition-all pointer-events-none text-gray-400 peer-focus:-translate-y-6 peer-focus:scale-90 peer-focus:text-blue-600 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400">
                Contraseña
              </label>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Recordar sesión */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Recordar sesión
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>

            {/* Botón de Iniciar Sesión */}
            <div>
              <button
                type="submit"
                className="btn-primary w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Iniciar Sesión
              </button>
            </div>

            {/* Mensaje de estado */}
            <div className={getStatusClass()}>{status?.message}</div>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿Problemas para acceder?{" "}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Contacta al administrador
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Para estudiantes nuevos: Tu usuario es tu RUT y tu contraseña inicial es tu fecha de nacimiento (DDMMAAAA)
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Acceso Rápido</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#" className="flex items-center justify-center p-2 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                📚 Biblioteca Virtual
              </a>
              <a href="#" className="flex items-center justify-center p-2 bg-green-50 rounded-md hover:bg-green-100 transition-colors">
                💳 Portal de Pagos
              </a>
              <a href="#" className="flex items-center justify-center p-2 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors">
                📧 Correo Estudiantil
              </a>
              <a href="#" className="flex items-center justify-center p-2 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors">
                📅 Calendario Académico
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 rounded-xl mt-4">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2024 Universidad. Todos los derechos reservados.</p>
            <p className="mt-1">Sistema Académico v2.1 | Soporte: soporte@universidad.edu</p>
          </div>
        </footer>
      </div>
      {/* Tailwind pattern */}
      <style>{`
        .university-pattern {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%);
        }
        .login-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }
        .floating-label {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Login;