#!/usr/bin/env node

import meow from "meow";
import { globby } from "globby";
import sharp from "sharp";
import path from "path";

function replaceExt(pathString, ext = "png") {
	const dir = path.dirname(pathString);
	const filename =
		path.basename(pathString, path.extname(pathString)) + "." + ext;

	return path.join(dir, filename);
}

const cli = meow(
	`
	Usage
		$ svgs2pngs <directory>

	Options:
		-w, --width 		Width of PNGs (default: 5120)
		--version	Show 	version
`,
	{
		importMeta: import.meta,
		inferType: true,
		flags: {
			width: {
				type: "number",
				alias: "w",
				default: 5120,
			},
		},
	}
);

(async () => {
	if (!cli.input[0]) {
		cli.showHelp();
	}

	const { width } = cli.flags;

	const inputPath = cli.input[0];
	const paths = await globby([`${inputPath}/*.svg`]);

	const promises = paths.map((p) => {
		const destPath = replaceExt(p, "png");
		console.log(`Resizing: ${p} -> ${destPath}`);
		return sharp(p).resize({ width }).png().toFile(destPath);
	});
})();
