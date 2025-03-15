#!/usr/bin/env node
const { flipFuses, FuseVersion, FuseV1Options } = require("@electron/fuses");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

yargs(hideBin(process.argv))
	.command(
		"$0 <pathToPackagedApp>",
		"Configure Electron fuses for an application (turns off fuses by default)",
		(yargs) => {
			return yargs
				.positional("pathToPackagedApp", {
					describe: "Path to the packaged Electron application",
					type: "string",
					demandOption: true,
				})
				.option("enableEmbeddedAsarIntegrityValidation", {
					describe: "Enable embedded ASAR integrity validation",
					type: "boolean",
					default: false,
				})
				.option("onlyLoadAppFromAsar", {
					describe: "Only load app from ASAR",
					type: "boolean",
					default: false,
				});
		},
		(argv) => {
			try {
				flipFuses(argv.pathToPackagedApp, {
					version: FuseVersion.V1,
					[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]:
						argv.enableEmbeddedAsarIntegrityValidation,
					[FuseV1Options.OnlyLoadAppFromAsar]: argv.onlyLoadAppFromAsar,
				});

				console.log("Fuses configuration applied successfully!");
				console.log(
					`- EnableEmbeddedAsarIntegrityValidation: ${argv.enableEmbeddedAsarIntegrityValidation}`,
				);
				console.log(`- OnlyLoadAppFromAsar: ${argv.onlyLoadAppFromAsar}`);
			} catch (error) {
				console.error("Failed to configure fuses:", error.message);
				process.exit(1);
			}
		},
	)
	.example("$0 /path/to/MyApp.app", "Turn off all fuses (default behavior)")
	.example(
		"$0 /path/to/MyApp.app --enableEmbeddedAsarIntegrityValidation",
		"Enable ASAR integrity validation",
	)
	.example(
		"$0 /path/to/MyApp.app --onlyLoadAppFromAsar",
		"Enable loading only from ASAR",
	)
	.example(
		"$0 /path/to/MyApp.app --enableEmbeddedAsarIntegrityValidation --onlyLoadAppFromAsar",
		"Enable both fuses",
	)
	.help()
	.epilogue("For more information, visit https://github.com/electron/fuses")
	.strict()
	.parse();
