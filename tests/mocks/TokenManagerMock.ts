import { USER_ROLES } from "../../src/models/User";
import { TokenPayload } from "../../src/services/TokenManager";

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "id-mock") {
      // signup de nova conta
      return "token-mock";
    } else if (payload.id === "id-mock-normal") {
      // login de fulano (conta normal)
      return "token-mock-normal";
    } else {
      // login de astrodev (conta admin)
      return "token-mock-admin";
    }
  };

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-normal") {
      return {
        id: "id-mock-normal",
        name: "Normal-User",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-normal2") {
      return {
        id: "id-mock-normal2",
        name: "Normal-User2",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-admin") {
      return {
        id: "id-mock-admin",
        name: "Admin-User",
        role: USER_ROLES.ADMIN,
      };
    } else {
      return null;
    }
  };
}
