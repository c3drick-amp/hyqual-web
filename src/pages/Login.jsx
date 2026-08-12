import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import logoIcon from "../assets/hyqual-logo-icon.png";
import logoText from "../assets/hyqual-logo-text.png";
import "./Login.css";

// TEMPORARY hardcoded accounts — replace with real Firebase Authentication later
const ACCOUNTS = [
  {
    email: "juandelacruz@gmail.com",
    password: "password123",
    firstName: "Juan",
    middleName: "Santos",
    lastName: "Dela Cruz",
    mobile: "+63 900 000 0000",
    street: "",
    barangay: "",
    city: "Calapan",
    role: "BFAR Administrator",
  },
  {
    email: "antoniocruz@gmail.com",
    password: "password123",
    firstName: "Antonio",
    middleName: "Ramon",
    lastName: "Cruz",
    mobile: "+63 908 724 1567",
    street: "XYZ St.",
    barangay: "Libis",
    city: "Calapan",
    role: "Superadmin",
  },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const matchedAccount = ACCOUNTS.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (matchedAccount) {
      const { password, ...userWithoutPassword } = matchedAccount;
      localStorage.setItem("hyqual_user", JSON.stringify(userWithoutPassword));

      if (matchedAccount.role === "Superadmin") {
        navigate("/superadmin/overview");
      } else {
        navigate("/dashboard");
      }
    } else {
      setError("Invalid email or password.");
    }
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src={logoIcon} alt="HyQual icon" className="logo-icon" />
          <img src={logoText} alt="HyQual" className="logo-text-img" />
        </div>

        <h1>Sign in to your portal</h1>
        <p className="subtext">Select the portal that matches your account.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="sign-in-btn">
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <a href="#" className="forgot-password">
          Forgot Password?
        </a>
      </div>
    </div>
  );
}

export default Login;