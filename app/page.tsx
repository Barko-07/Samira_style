import { cookies } from "next/headers";
import StoreFront from "@/components/StoreFront";
import LandingPage from "@/components/LandingPage";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("user_session")?.value;

  if (!sessionToken) {
    return <LandingPage />;
  }

  return <StoreFront />;
}
