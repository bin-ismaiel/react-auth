import AuthForm from "../components/AuthForm";
import { redirect, json } from "react-router-dom";
function AuthenticationPage() {
  return <AuthForm />;
}
export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";
  const data = await request.formData();

  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (!response.ok) {
    throw json({ message: "could not authenticate" }, { status: 500 });
  }

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem("token", token);

  const expiration = new Date();
  expiration.setMilliseconds(expiration.getMilliseconds() + 5000);
  localStorage.setItem("expiration", expiration.toISOString());

  return redirect("/");
}
export default AuthenticationPage;
