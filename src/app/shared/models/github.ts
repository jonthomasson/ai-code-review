export interface GitHubRepository {
  id: number;
  name: string;
  owner: { login: string };
}

export interface GitHubPullRequest {
  id: number;
  title: string;
  user: { login: string };
}

export interface GitHubPullRequestFile {
  filename: string;
  patch: string;
}
