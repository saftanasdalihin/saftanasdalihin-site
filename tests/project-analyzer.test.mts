import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeRepositorySnapshot,
  classifyRepository,
} from "../lib/projects/analyzer.ts";
import type { GitHubRepository } from "../lib/github/client.ts";

const repository: GitHubRepository = {
  id: 1,
  name: "minidao-treasury",
  full_name: "saftanasdalihin/minidao-treasury",
  html_url: "https://github.com/saftanasdalihin/minidao-treasury",
  description: "Community treasury proposal system",
  default_branch: "main",
  fork: false,
  archived: false,
  private: false,
  language: "Solidity",
  topics: ["solidity", "treasury"],
  pushed_at: "2026-10-08T10:00:00Z",
  updated_at: "2026-10-08T10:00:00Z",
  stargazers_count: 0,
  size: 20,
  owner: { login: "saftanasdalihin" },
};

test("classification excludes forks, archived repositories, and portfolio website", () => {
  assert.equal(classifyRepository({ name: "example", fork: true, archived: false }), "fork");
  assert.equal(classifyRepository({ name: "example", fork: false, archived: true }), "archived");
  assert.equal(classifyRepository({ name: "saftanasdalihin-site", fork: false, archived: false }), "portfolio-website");
  assert.equal(classifyRepository({ name: "minidao-treasury", fork: false, archived: false }), "portfolio-candidate");
});

test("analysis produces bounded score, evidence, and no false test-pass claim", () => {
  const analysis = analyzeRepositorySnapshot({
    repository,
    commitSha: "0123456789abcdef0123456789abcdef01234567",
    treeSha: "abcdef0123456789abcdef0123456789abcdef01",
    treePaths: [
      "README.md",
      "foundry.toml",
      "src/Treasury.sol",
      "test/Treasury.t.sol",
      ".github/workflows/solidity.yml",
    ],
    files: [
      {
        path: "README.md",
        url: "https://github.com/saftanasdalihin/minidao-treasury/blob/0123456789abcdef0123456789abcdef01234567/README.md",
        content: "# MiniDAO Treasury\n\nArchitecture and design notes. Install with Foundry and run forge test. The tests cover an access-control edge case and error behavior.",
      },
      {
        path: "src/Treasury.sol",
        url: "https://github.com/saftanasdalihin/minidao-treasury/blob/0123456789abcdef0123456789abcdef01234567/src/Treasury.sol",
        content: "error Unauthorized(); event ProposalCreated(uint256 id); contract Treasury { function withdraw() external onlyOwner {} }",
      },
    ],
  });

  assert.ok(analysis.totalScore >= 0 && analysis.totalScore <= 100);
  assert.equal(analysis.testStatus, "found-not-executed");
  assert.match(analysis.scoreDisclaimer, /not a security audit/i);
  assert.ok(analysis.evidence.some((entry) => entry.path === "src/Treasury.sol"));
  assert.match(analysis.commitSha, /^[a-f0-9]{40}$/);
});

test("truncated GitHub tree is reported as an analysis limitation", () => {
  const analysis = analyzeRepositorySnapshot({
    repository,
    commitSha: "0123456789abcdef0123456789abcdef01234567",
    treeSha: "abcdef0123456789abcdef0123456789abcdef01",
    treePaths: ["README.md"],
    treeTruncated: true,
    files: [{
      path: "README.md",
      url: "https://github.com/saftanasdalihin/minidao-treasury/blob/0123456789abcdef0123456789abcdef01234567/README.md",
      content: "# MiniDAO Treasury\n",
    }],
  });
  assert.ok(analysis.limitations.some((item) => /truncated repository tree/i.test(item)));
});
