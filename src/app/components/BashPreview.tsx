import type { Service } from "@/hooks/use-services";
import { CodeHighlightTabs } from "@mantine/code-highlight";
import { SiGnubash } from "react-icons/si";

const installDocker = [
  "# Install Docker",
  "curl -fsSL https://get.docker.com -o get-docker.sh",
  "sudo sh get-docker.sh",
  "sudo usermod -aG docker $USER",
  "su - $USER",
];

const installPodman = ["# Install Podman", "sudo apt-get install -y podman"];

const baseBashCommands = (installContainerSoftware: string[]) => [
  "sudo apt-get update && sudo apt-get upgrade -y",
  "sudo apt-get install -y ufw curl",
  "",
  installContainerSoftware,
  "",
  "# Deny all non-explicitly allowed ports",
  "sudo ufw default deny incoming",
  "sudo ufw default allow outgoing",
  "",
  "# Allow SSH access",
  "sudo ufw allow ssh",
];

const finalBashCommands = (isDocker: boolean) => [
  "# Enable UFW",
  "sudo ufw enable",
  "",
  "# change directory to where the docker-compose.yml file is located",
  "cd ~/monero-suite",
  "# finally, start the containers with:",
  isDocker ? "docker-compose up -d" : "podman-compose up -d",
];

interface BashPreviewProps {
  isDocker: boolean;
  services: Service[];
}

const BashPreview = ({ isDocker, services }: BashPreviewProps) => {
  // replace two or more newlines with one newline
  const serviceBashCommands = services
    .filter((service) => service.bash)
    .map((service) => service.bash)
    .join("\n")
    .replace(/\n{2,}/g, "\n\n");

  const bashCommands = [
    ...baseBashCommands(isDocker ? installDocker : installPodman),
    serviceBashCommands,
    ...finalBashCommands,
  ].join("\n");

  return (
    <CodeHighlightTabs
      code={{
        code: bashCommands,
        language: "bash",
        fileName: "bash",
        icon: <SiGnubash />,
      }}
      styles={{
        root: {
          maxHeight: "calc(100vh - 150px)",
          overflow: "auto",
          borderRadius: "4px",
        },
      }}
    />
  );
};

export default BashPreview;
