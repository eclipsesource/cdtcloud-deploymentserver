import { Command } from "https://cdn.deno.land/cmd/versions/v1.2.0/raw/mod.ts";
import * as ink from "https://deno.land/x/ink/mod.ts";
import {
  Input,
  Select,
} from "https://deno.land/x/cliffy@v0.18.2/prompt/mod.ts";

const program = new Command();

const env = {
  COMPOSE_DOCKER_CLI_BUILD: "1",
  DOCKER_BUILDKIT: "1",
  BUILDKIT_INLINE_CACHE: "1",
};

program
  .name("cdtcloud docker")
  .description("Shell scripts for docker")
  .version("1.0.0");

shellCommandFactory(
  "start:deployment",
  "Startup the deployment-server",
  ["docker-compose up deployment-server"],
  env,
);

shellCommandFactory(
  "start:deployment:d",
  "Startup the deployment-server in detached mode",
  ["docker-compose up -d deployment-server"],
  env,
);

shellCommandFactory(
  "start:connector",
  "Startup the device-connector",
  ["docker-compose up device-connector"],
  env,
);

shellCommandFactory(
  "start:connector:d",
  "Startup the device-connector in detached mode",
  ["docker-compose up -d device-connector"],
  env,
);

shellCommandFactory(
  "start:theia",
  "Startup theia",
  ["docker-compose up theia"],
  env,
);

shellCommandFactory(
  "start:theia:d",
  "Startup theia in detached mode",
  ["docker-compose up -d theia"],
  env,
);

shellCommandFactory(
  "start:arduino",
  "Startup the arduino-cli - docker arduino-cli not supported on windows",
  ["docker-compose up arduino-cli"],
  env,
);

shellCommandFactory(
  "start:arduino:d",
  "Startup the arduino-cli in detached mode - docker arduino-cli not supported on windows",
  ["docker-compose up -d arduino-cli"],
  env,
);

shellCommandFactory(
  "start:demo",
  "Startup the cdtcloud demo",
  ["docker-compose up demo"],
  env,
);

shellCommandFactory(
  "start:demo:d",
  "Startup the cdtcloud demo in detached mode",
  ["docker-compose up -d demo"],
  env,
);

shellCommandFactory(
  "build",
  "Build the docker images",
  [
  "docker-compose build --parallel",
  "docker image prune -f",
], env);

shellCommandFactory(
  "build:nocache",
  "Build the docker images without cache",
  [
    "docker-compose build --no-cache --parallel",
    "docker image prune -f",
  ],
  env,
);

shellCommandFactory(
  "db-import",
  "Create and upgrade the database with latest updates",
  ["docker-compose run deployment-server yarn update:db"],
  env,
);

program
  .command("attach [service]")
  .description("attach to a service")
  .action(async (service: string | undefined) => {
    const { run } = Deno;

    let command = `docker-compose ps`;

    if (service) {
      command = `${command} ${service}`;
    }

    console.log(ink.colorize(`<green>>>>>> Running: ${command}</green>`));

    let cmd = command.split(" ");
    const res = Deno.run({
      cmd,
      cwd: process.cwd(),
      stdout: "piped",
      stderr: "piped",
    });

    const output = await res.output(); // "piped" must be set

    let services = new TextDecoder().decode(output).split("\n");

    if (!services) {
      console.error("No services available!");
      return;
    }

    services.pop();
    services = services.slice(2);

    res.close(); // Don't forget to close it

    let selService: string;
    if (services.length > 1) {
      selService = await Select.prompt({
        message: `Select a service`,
        options: services,
      });
    } else {
      selService = services[0];
    }

    if (!selService) {
      console.log(`Service ${service} is not available`);
      return;
    }

    command = `docker attach ${selService.split(" ")[0]}`;

    console.log(ink.colorize(`<green>>>>>> Running: ${command}</green>`));

    console.log(
      ink.colorize(
        "<yellow>NOTE: you can detach from a container and leave it running using the CTRL-p CTRL-q key sequence.</yellow>",
      ),
    );

    cmd = command.split(" ");

    const shellCmd = run({
      cmd,
      cwd: process.cwd(),
    });

    await shellCmd.status();

    shellCmd.close();
  });

program
  .command("kill [service]")
  .description("kill a service")
  .action(async (service: string | undefined) => {
    const { run } = Deno;

    let command = `docker-compose ps`;

    if (service) {
      command = `${command} ${service}`;
    }

    console.log(ink.colorize(`<green>>>>>> Running: ${command}</green>`));

    let cmd = command.split(" ");
    const res = Deno.run({
      cmd,
      cwd: process.cwd(),
      stdout: "piped",
      stderr: "piped",
    });

    const output = await res.output(); // "piped" must be set

    let services = new TextDecoder().decode(output).split("\n");

    if (!services) {
      console.error("No services available!");
      return;
    }

    services.pop();
    services = services.slice(2);

    res.close(); // Don't forget to close it

    let selService: string;
    if (services.length > 1) {
      selService = await Select.prompt({
        message: `Select a service`,
        options: services,
      });
    } else {
      selService = services[0];
    }

    if (!selService) {
      console.log(`Service ${service} is not available`);
      return;
    }

    command = `docker kill ${selService.split(" ")[0]}`;

    console.log(ink.colorize(`<green>>>>>> Running: ${command}</green>`));

    cmd = command.split(" ");

    const shellCmd = run({
      cmd,
      cwd: process.cwd(),
    });

    await shellCmd.status();

    shellCmd.close();
  });

program
  .command("quit")
  .description("Close docker command")
  .action(() => {
    process.exit(0);
  });

// Handle it however you like
// e.g. display usage
while (true) {
  if (Deno.args.length === 0) {
    program.outputHelp();
    const command = await Input.prompt({
      message: "Enter the command:",
    });
    console.log(command);
    await program.parseAsync(command.split(" "));
  } else {
    await program.parseAsync(Deno.args);
    process.exit(0);
  }
}

/**
 *
 * @param name
 * @param description
 * @param commands you can pass one or more commands, they will be executed sequentially
 * @returns
 */
function shellCommandFactory(
  name: string,
  description: string,
  commands: string[],
  env?: { [key: string]: string },
): Command {
  return program
    .command(name)
    .description(
      `${description}. Command: \n"${
        ink.colorize(
          `<green>${commands.join(" && ")}</green>`,
        )
      }"\n`,
    )
    .action(async (args: string[] | undefined) => {
      const { run } = Deno;

      for (const command of commands) {
        console.log(
          ink.colorize(`<green>>>>>> Running: ${command}</green>`),
        );

        const cmd = command.split(" ");

        if (Array.isArray(args)) {
          cmd.push(...args);
        }

        const shellCmd = run({
          cmd,
          cwd: process.cwd(),
          env: { ...process.env, ...env },
        });

        const status = await shellCmd.status();

        if (!status.success) {
          throw new Error(`Failed with error: ${status.code}, however,
            it's not related to this Deno script directly. An error occurred within
            the script called by the command itself`);
        }

        shellCmd.close();
      }
    });
}