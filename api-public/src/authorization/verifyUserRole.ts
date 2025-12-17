import { HttpRequestUser } from "@azure/functions";

export type AzureUserAppRole = "Administrator";

export function verifyUserRole(user: HttpRequestUser, role: AzureUserAppRole) {
  const claims: any = user.claimsPrincipalData.claims;
  const rolesClaim = claims.find(x => x.typ === "roles")?.val;

  return rolesClaim === role;
}