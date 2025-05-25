import { redirect } from "next/navigation";

export default function Home() {
  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  redirect("/login");
}
