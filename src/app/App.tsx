import { AuthProvider } from "./context/AuthContext";
import { AppRouter } from "./AppRouter";
import { Pruthvi } from "./components/Pruthvi";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Pruthvi />
    </AuthProvider>
  );
}