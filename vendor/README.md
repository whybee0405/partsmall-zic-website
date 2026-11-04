# Vendored packages

`whybee0405-cloudia-cms-client-1.7.0.tgz` is the CloudIA CMS client (`@whybee0405/cloudia-cms-client`,
installed as `@cloudia-cms/client`), packed from github.com/whybee0405/cloudia-cms at tag v1.7.0
(`cd sdk && npm pack --ignore-scripts` after `npm run build`). It is vendored because the package is
published to GitHub Packages, which needs a token this server and the Docker build do not have.

To upgrade: pack the new version the same way, replace the file, update the `file:` path in
package.json and run `npm install --package-lock-only`.
