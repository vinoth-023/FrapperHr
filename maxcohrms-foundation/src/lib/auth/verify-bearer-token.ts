import "server-only";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function verifyBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    throw new Error("UNAUTHENTICATED");
  }

  const token = header.slice("Bearer ".length).trim();
  if (!token) throw new Error("UNAUTHENTICATED");

  try {
    return await getAdminAuth().verifyIdToken(token, true);
  } catch {
    throw new Error("UNAUTHENTICATED");
  }
}
