import { component$, useContext } from "@builder.io/qwik"
import { profileContext } from "~/context/context"
import type { Repo, User } from "~/types/types"
import Swal from "sweetalert2"

import star from "~/svg/star-outline.svg"

export const api_url: string = 'https://api.github.com/users/'

export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if(response.status === 404){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "User does not exist",
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `HTTP error: ${response.status}`,
      })
    }
  } else {
    const data = await response.json()
    return data
  }
}

export const getUser = async (username: string) => {
  const gh_user_url = api_url + username
  const response = await fetch(gh_user_url)
  const user: User = await handleResponse(response)

  return user
}

export const getRepos = async (username: string, page: number = 1) => {
  const repo_url = api_url + username + `/repos?sort=updated&page=${page}`
  const response = await fetch(repo_url)
  const result: Repo[] = await handleResponse(response)
  const repos: Repo[] = result.filter((repo: Repo) => repo.fork === false)

  return repos
}

export const infiniteScrollToGetRepos = async (username: string, page: number) => {
  console.log(1)
  const repos: Repo[] = await getRepos(username, page + 1)
  console.log(page)
  console.log(repos)
  return repos
}


export const getUserData = async (username: string): Promise<{
  repos: Repo[], user: User
}> => {
  const user: User = await getUser(username)
  const repos: Repo[] = await getRepos(username)

  return {
    repos,
    user
  }
}

export const ProfileComponent = component$(() => {
  const state = useContext(profileContext)
  return (
    <>
      {state.user&&state.user.login !== "" ?
          (<div class="md:w-5/6 bg-blue-300 mx-8 md:mx-auto my-2 p-4 rounded
                        flex flex-col md:flex-row justify-center items-center bg-opacity-20 backdrop-blur">
            <img class="basis-full mb-4 md:mb-0 md:basis-1/6 w-1/2 md:w-1/6 rounded bg-transparent" src={state.user.avatar_url} alt={`${state.user.name}'s github image`} />
            <div class="basis-full md:basis-5/6 flex flex-col text-center">
              <h2 class="font-bold text-lg">{state.user.name}</h2>
              <h3 class="font-semibold text-lg">{state.user.login} - Followers: <em>{state.user.followers}</em></h3>
              <p class="md:mx-4">{state.user.bio}</p>
              <p class="text-sm">{state.user.location ? `Location: ${state.user.location}` : ''}</p>
              <p>Public repositories: <b>{state.user.public_repos}</b></p>
              <a class="w-fit mx-auto text-xs py-1 px-2 my-1 rounded bg-opacity-30 hover:bg-opacity-90 bg-cyan-200 hover:bg-cyan-100"
                  target="_blank" href={state.user.html_url}>Jump to the profile</a>
            </div>
          </div>)
        :
          ''
      }
      <div class="flex flex-wrap flex-row justify-around box-border">
      {state.repos.map(
        ( repo: Repo,
          index: number ) => {
        return <a href={repo.html_url} 
                  target="_blank"
                  class="basis-full h-24 w-4/5 md:basis-1/4 md:w-1/4 m-4 bg-blue-200 hover:bg-blue-400 hover:bg-opacity-20 bg-opacity-20
                          backdrop-blur-sm rounded flex flex-row items-center justify-around py-4"
                  key={index}>
              <p class="basis-2/4 text-center overflow-hidden">{repo.name}</p>
              <div class="flex items-center">
                <b>{repo.stargazers_count}</b>
                <img class="ml-1" width={20} height={20} src={star} alt="stars" />
              </div>
        </a>
      })}
      </div>
    </>
  )
})