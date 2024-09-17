export interface GitHubRepository {
  id: number;
  name: string;
  owner: { login: string };
}

export interface GitHubPullRequest {
  id: number;
  title: string;
  user: { login: string };
  number: number;
  html_url: string;
  changed_files: string;
  commits: string;
  state: string;
  updated_at: string;
  created_at: string;
  body: string;
  url: string;
  base: {
    user: { login: string };
    repo: { name: string };
  };
}

export interface GitHubPullRequestFile {
  filename: string;
  patch: string;
}
