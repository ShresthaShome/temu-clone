import { getCurrentSession } from "@/actions/auth";

export default async function Home() {
  const { user } = await getCurrentSession();

  return (
    <div>
      Home
      {JSON.stringify(user)}
    </div>
  );
}
