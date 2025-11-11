
import React, { useState } from "react";
import "../styles/Login.css";

interface UserData {
  rut: string;
  carreras: Array<{
    codigo: string;
    nombre: string;
    catalogo: string;
  }>;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<{ type: "info" | "success" | "error"; message: string } | null>(null);

  // Email validation on blur
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const el = e.target;
    if (el.value && !el.value.includes("@universidad.edu")) {
      el.style.borderColor = "#ef4444";
      el.style.backgroundColor = "#fef2f2";
    } else {
      el.style.borderColor = "#d1d5db";
      el.style.backgroundColor = "rgba(255,255,255,0.8)";
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "info", message: "Verificando credenciales..." });

    // Note: If the external endpoint blocks CORS, use the backend proxy (/auth/login) instead.
    const requestOptions: RequestInit = {
      method: 'GET',
      redirect: 'follow',
    };

    const url = `https://puclaro.ucn.cl/eross/avance/login.php?email=${encodeURIComponent(
      email,
    )}&password=${encodeURIComponent(password)}`;

    try {
      const response = await fetch(url, requestOptions);

      // Try to parse JSON. The external endpoint should return JSON; if not, handle gracefully.
      let data: any = null;
      try {
        data = await response.json();
      } catch (parseErr) {
        // fallback to text for debugging
        const text = await response.text();
        console.error('Login response not JSON:', text);
        throw new Error('Respuesta inválida del servidor de autenticación');
      }

      // Successful login heuristic: endpoint returns an object with `rut` and `carreras` array
      if (data && data.rut && Array.isArray(data.carreras)) {
        // Save the full user data to localStorage
        localStorage.setItem('userData', JSON.stringify({ rut: data.rut, carreras: data.carreras }));

        setStatus({ type: 'success', message: '✅ Acceso exitoso. Redirigiendo...' });
        setTimeout(() => {
          setStatus({ type: 'info', message: `🎓 Bienvenido al portal académico` });
          setTimeout(() => window.location.reload(), 700);
        }, 900);
      } else {
        const msg = (data && (data.message || data.error)) || '❌ Credenciales incorrectas. Verifica usuario y contraseña.';
        setStatus({ type: 'error', message: msg });
      }
    } catch (error) {
      console.error('Error en la autenticación directa:', error);
      setStatus({ type: 'error', message: '❌ Error de conexión o CORS. Si ves este error, prueba usar el proxy del backend.' });
    }
  };

  // Status message class
  const getStatusClass = () => {
    if (!status) return "status-message hidden";
    if (status.type === "info") return "status-message";
    if (status.type === "success") return "status-message status-success";
    if (status.type === "error") return "status-message status-error";
    return "status-message";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f5f5f5" }}>
      <div style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: "bold", color: "#2563eb", marginBottom: 8 }}>Universidad</h1>
          <p style={{ fontSize: 18, color: "#555" }}>Portal Académico</p>
        </header>
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", padding: 40 }}>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="email" style={{ display: "block", fontWeight: 500, marginBottom: 8, color: "#2563eb" }}>Correo institucional</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                style={{ width: "100%", fontSize: 18, color: "#2563eb", padding: "12px 16px", borderRadius: 8, border: "1px solid #d1d5db" }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="pedro@example.com"
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="password" style={{ display: "block", fontWeight: 500, marginBottom: 8, color: "#2563eb" }}>Contraseña</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  style={{ flex: 1, fontSize: 18, color: "#2563eb", padding: "12px 16px", borderRadius: 8, border: "1px solid #d1d5db" }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="qwerty"
                />
                <button
                  type="button"
                  style={{ marginLeft: 8, background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 20 }}
                  tabIndex={-1}
                  onClick={() => setShowPassword(s => !s)}
                  aria-label="Mostrar/Ocultar contraseña"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
              <input id="remember" name="remember" type="checkbox" style={{ marginRight: 8 }} />
              <label htmlFor="remember" style={{ fontSize: 16, color: "#2563eb"}}>Recordar sesión</label>
              <div style={{ marginLeft: "auto" }}>
                <a href="#" style={{ fontSize: 15, color: "#2563eb", textDecoration: "none" }}>¿Olvidaste tu contraseña?</a>
              </div>
            </div>
            <button type="submit" style={{ width: "100%", padding: "14px 0", fontSize: 20, fontWeight: "bold", color: "#fff", background: "#2563eb", border: "none", borderRadius: 8, cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.12)" }}>
              Iniciar Sesión
            </button>
            <div style={{ marginTop: 24 }} className={getStatusClass()}>{status?.message}</div>
          </form>
          <div style={{ marginTop: 32, textAlign: "center", fontSize: 15, color: "#555" }}>
            <p>¿Problemas para acceder? <a href="#" style={{ color: "#2563eb" }}>Contacta al administrador</a></p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Para estudiantes nuevos: Tu usuario es tu RUT y tu contraseña inicial es tu fecha de nacimiento (DDMMAAAA)</p>
          </div>
        </div>
      </div>
      <footer style={{ textAlign: "center", marginTop: 32, color: "#888", fontSize: 14 }}>
        <p>&copy; 2024 Universidad. Todos los derechos reservados.</p>
        <p>Sistema Académico v2.1 | Soporte: soporte@universidad.edu</p>
      </footer>
    </div>
  );
};

export default Login;