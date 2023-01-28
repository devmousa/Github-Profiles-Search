import { createContext } from "@builder.io/qwik";
import type { Repo, User } from "~/types/types";

export interface Profile {
    user?: User,
    repos: Repo[],
    page: number
}

export const profileContext = createContext<Profile>("profile")