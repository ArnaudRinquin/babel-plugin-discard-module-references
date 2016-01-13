export default function (babel) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const droppedModules = state.opts.for;
        const {
          source,
          specifiers,
        } = path.node;

        const moduleSource = source.value;

        if (droppedModules.indexOf(source.value) < 0) {
          return;
        }

        specifiers.forEach(function(specifier) {
          const importedIdentifierName = specifier.local.name;
          const { referencePaths } = path.scope.getBinding(importedIdentifierName);

          referencePaths.forEach(function removeExpression(referencePath){
            let pathToRemove = referencePath;
            do {
              if (pathToRemove.type === 'ExpressionStatement') {
                break;
              }
            } while(pathToRemove = pathToRemove.parentPath);

            pathToRemove.remove();
          });
        });

        path.remove();
      }
    }
  };
}
