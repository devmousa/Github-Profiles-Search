import { createContext } from "@builder.io/qwik";
import type { Repo, User } from "~/types/types";

export interface Profile {
    repos: Array<Repo>,
    user: User
}

export const profileContext = createContext<Profile>("profile")