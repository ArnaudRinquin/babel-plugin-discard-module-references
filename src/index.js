export default function (babel) {
  return {
    visitor: {
      Program: {
        exit(path, state) {
          path.traverse(removeTargetModuleReferences, state);
          path.scope.crawl();
          path.traverse(removeUnusedModulesReferences, state);
        }
      }
    }
  };
}

const removeTargetModuleReferences = {
  ImportDeclaration(path, state) {

    const { targets } = state.opts;
    const {
      source,
      specifiers,
    } = path.node;

    const moduleSource = source.value;

    if (targets.indexOf(source.value) < 0) {
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
};

const removeUnusedModulesReferences = {
  ImportDeclaration(path, state) {

    const unusedWhitelist = state.opts.unusedWhitelist || [];
    const {
      source,
      specifiers,
    } = path.node;

    const moduleSource = source.value;

    if (unusedWhitelist.indexOf(source.value) > -1) {
      return;
    }

    // don't remove imports with no specifiers as they certainly have side effects
    if (specifiers.length === 0) {
      return;
    }

    const usedSpecifiers = specifiers.reduce(function(usedSpecifiers, specifier) {

      const importedIdentifierName = specifier.local.name;
      const { referencePaths } = path.scope.getBinding(importedIdentifierName);

      if (referencePaths.length > 0) {
        return [...usedSpecifiers, specifier];
      }
      return usedSpecifiers;
    }, []);

    if (usedSpecifiers.length === 0) {
      path.remove();
    } else {
      // only keep used specifiers
      // path.node.specifiers = usedSpecifiers;
    }
  }
}
