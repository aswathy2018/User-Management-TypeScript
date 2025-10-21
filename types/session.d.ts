//it helps us to extend or modify the types or behavior of an already existing module

import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: string;
  }
}
