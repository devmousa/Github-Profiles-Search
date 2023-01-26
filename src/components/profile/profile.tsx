import { component$, useContext } from "@builder.io/qwik"
import { profileContext } from "~/context/context"
import type { Repo, User } from "~/types/types"
import Swal from "sweetalert2"

export const defaultUser: User = {
  avatar_url: "",
  bio: "",
  followers: 0,
  html_url: "",
  location: "",
  login: "",
  name: "",
  public_repos: 0
}

export const api_url = 'https://api.github.com/users/'

export const getUserData = async (username: string) => {
  let user: User = defaultUser
  const gh_user_url = api_url + username
  await fetch(gh_user_url)
        .then(response => {
          if (!response.ok) {
            if(response.status === 404){
              throw new Error("User does not exist")
            }
            throw new Error(`HTTP error: ${response.status}`)
          }
          return response.json()
        })
        .then((result: User) => {
            console.log(result)
            user = result
        })
        .catch(error => Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        }))

  return user
}

export const getUserRepos = async (username: string) => {
  let repos: Array<Repo> = []
  const repo_url = api_url + username + '/repos?sort=created'
  await fetch(repo_url)
        .then(response => {
          if(!response.ok){
            throw new Error(`HTTP error: ${response.status}`)
          }
          return response.json()
        })
        .then((result: Array<Repo>) => {
          repos = result.filter((repo: Repo) => repo.fork === false) as []
        })
        .catch(error => console.error(error))

  return repos
}

export const getData = async (username: string): Promise<{
  repos: Array<Repo>, user: User
}> => {
  
  let user: User = defaultUser
  await getUserData(username)
        .then(data => user = data)

  let repos: Array<Repo> = []
  await getUserRepos(username)
        .then(data => repos = data)

  return {
    repos,
    user
  }
}

export const ProfileComponent = component$(() => {
  const state = useContext(profileContext)
  return (
    <>
      {state.user.login !== '' ?
          (<div class="md:w-5/6 bg-blue-300 mx-8 md:mx-auto my-2 p-4 rounded
                        flex flex-col md:flex-row justify-center items-center bg-opacity-20 backdrop-blur">
            <img class="basis-full mb-4 md:mb-0 md:basis-1/6 w-1/2 md:w-1/6 rounded" src={state.user.avatar_url} alt={`${state.user.name}'s github image`} />
            <div class="basis-full md:basis-5/6 flex flex-col text-center">
              <h2 class="font-bold text-lg">{state.user.name}</h2>
              <h3 class="font-semibold text-lg">{state.user.login} - Followers: <em>{state.user.followers}</em></h3>
              <p>{state.user.bio}</p>
              <p class="text-sm">Location: {state.user.location}</p>
              <p>Public repositories: <b>{state.user.public_repos}</b></p>
              <a class="w-fit mx-auto text-xs py-1 px-2 my-1 rounded opacity-60 hover:opacity-100 bg-emerald-300 hover:bg-emerald-100"
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
        </a>
      })}
      </div>
    </>
  )
})