
import React, { useState } from "react";


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

  return (
    <div style={{ minHeight: "100vh"}}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <header style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#2563eb", marginBottom: 4 }}>Universidad</h1>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Portal Académico</p>
        </header>

        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 4px 16px rgba(223, 44, 44, 0.1)", padding: 32, border: "1px solid #e0e7ff" }}>
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label htmlFor="email" style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#1e293b", fontSize: 14 }}>Correo institucional</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                style={{ width: "100%", fontSize: 14, padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box", transition: "border-color 0.2s" }}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="pedro@example.com"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label htmlFor="password" style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#1e293b", fontSize: 14 }}>Contraseña</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  style={{ flex: 1, fontSize: 14, padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box" }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="tu contraseña"
                />
                <button
                  type="button"
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 0, color: "#6b7280" }}
                  tabIndex={-1}
                  onClick={() => setShowPassword(s => !s)}
                  aria-label="Mostrar/Ocultar contraseña"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" style={{ width: "100%", padding: "10px 0", fontSize: 15, fontWeight: "600", color: "#fff", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "none", borderRadius: 6, cursor: "pointer", transition: "transform 0.2s" }}>
              Iniciar Sesión
            </button>

            {status && (
              <div style={{ 
                marginTop: 16, 
                padding: 12, 
                borderRadius: 6, 
                fontSize: 13,
                textAlign: "center",
                background: status.type === "success" ? "#dcfce7" : status.type === "error" ? "#fee2e2" : "#dbeafe",
                color: status.type === "success" ? "#15803d" : status.type === "error" ? "#b91c1c" : "#0c4a6e"
              }}>
                {status.message}
              </div>
            )}
          </form>
        </div>

        <div style={{ textAlign: "center", fontSize: 12, color: "#6b7280", marginTop: 20 }}>
          <p style={{ margin: 0 }}>¿Olvidaste tu contraseña? <a href="#" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>Recuperar acceso</a></p>
          <p style={{ margin: "8px 0 0 0", fontSize: 11 }}>&copy; 2025 Universidad. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;