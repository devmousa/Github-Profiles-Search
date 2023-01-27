export type User = {
  avatar_url: string,
  bio: string | null,
  followers: number,
  html_url: string,
  location: string | null,
  login: string,
  name: string,
  public_repos: number
}

export type Repo = {
  name: string,
  html_url: string,
  fork: boolean,
  stargazers_count: number
}