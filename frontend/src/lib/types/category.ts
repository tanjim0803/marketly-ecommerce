import { UUID } from "crypto";

export interface Category {
  id: UUID;
  name: string;
  slug: string;
}