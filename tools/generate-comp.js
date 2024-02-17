const { generateTemplateFiles } = require("generate-template-files");

generateTemplateFiles([
  {
    option: "Minimal Component",
    defaultCase: "(pascalCase)",
    entry: {
      folderPath: "./tools/templates/component-minimal/",
    },
    stringReplacers: ["_name_"],
    output: {
      path: "./src/app/components/_name_(pascalCase)",
      pathAndFileNameDefaultCase: "(pascalCase)",
    },
    onComplete: (results) => {
      console.log(results, results);
    },
  },
]);
