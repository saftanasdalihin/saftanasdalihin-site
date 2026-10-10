// components/sections/SkillsGrid.tsx
import {
  SiSolidity,
  SiEthereum,
  SiGithub,
  SiGit,
} from "react-icons/si";
import {
  FaTools,
  FaShieldAlt,
  FaFlask,
  FaKey,
  FaCoins,
  FaProjectDiagram,
  FaFingerprint,
} from "react-icons/fa";

const SKILLS = [
  {
    name: "Solidity",
    icon: SiSolidity,
    color: "text-foreground/70",
  },
  {
    name: "EVM & Ethereum",
    icon: SiEthereum,
    color: "text-foreground/70",
  },
  {
    name: "Foundry",
    icon: FaTools,
    color: "text-foreground/70",
  },
  {
    name: "OpenZeppelin",
    icon: FaShieldAlt,
    color: "text-foreground/70",
  },
  {
    name: "Smart Contract Testing",
    icon: FaFlask,
    color: "text-foreground/70",
  },
  {
    name: "Access Control",
    icon: FaKey,
    color: "text-foreground/70",
  },
  {
    name: "ERC-20 Token Standard",
    icon: FaCoins,
    color: "text-foreground/70",
  },
  {
    name: "DAO Governance & Treasury",
    icon: FaProjectDiagram,
    color: "text-foreground/70",
  },
  {
    name: "Merkle Proofs",
    icon: FaFingerprint,
    color: "text-foreground/70",
  },
  {
    name: "Git & GitHub",
    icon: SiGithub,
    color: "text-foreground/70",
  },
  {
    name: "Git Version Control",
    icon: SiGit,
    color: "text-foreground/70",
  },
];

export const SkillsGrid = () => {
  return (
    <section className="mt-8" aria-labelledby="core-skills-heading">
      <h3 id="core-skills-heading" className="mb-6 text-3xl font-bold">
        Core Skills
      </h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {SKILLS.map((skill) => (
          <div
            key={skill.name}
            className="group flex min-h-32 flex-col items-center justify-center rounded-xl border border-border bg-background p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:bg-secondary/20"
          >
            <skill.icon
              size={36}
              aria-hidden="true"
              className={`${skill.color} transition-transform group-hover:-translate-y-1`}
            />
            <p className="mt-3 text-center text-sm font-semibold">
              {skill.name}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-foreground/60">
        Governance and Merkle-proof skills are represented through the MiniDAO Treasury project, which is still in development.
      </p>
    </section>
  );
};
