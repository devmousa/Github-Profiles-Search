import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { getData, getUserData, getUserRepos } from './profile';

test('Get user repositories with username', async () => {
  let username = 'MasterMousa'
  let repos = await getUserRepos(username)
  expect(repos.length).greaterThan(7)
})

test('Get user information with username', async () => {
  let username = 'MasterMousa'
  let user_data = await getUserData(username)
  expect(user_data.login).eq('MasterMousa')
  expect(user_data.name).eq('Mousa Aboubaker')
  expect(user_data.followers).greaterThan(10)
})

test('Get the whole data with username', async () => {
  let username = 'MasterMousa'
  let data = await getData(username)
  expect(data.repos.length).greaterThan(7)
  expect(data.user.login).eq('MasterMousa')
  expect(data.user.name).eq('Mousa Aboubaker')
  expect(data.user.followers).greaterThan(10)
})