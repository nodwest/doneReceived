const { withAppBuildGradle } = require('expo/config-plugins');

const marker = '// doneReceived: shorten Windows CMake object paths';

module.exports = function withWindowsCMakePaths(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      throw new Error(
        'with-windows-cmake-paths requires a Groovy app/build.gradle',
      );
    }
    if (!config.modResults.contents.includes(marker)) {
      config.modResults.contents += `
${marker}
if (System.getProperty("os.name").toLowerCase().contains("windows")) {
    android {
        externalNativeBuild {
            cmake {
                buildStagingDirectory file("$rootDir/../.c")
            }
        }
        defaultConfig {
            externalNativeBuild {
                cmake {
                    arguments "-DCMAKE_OBJECT_PATH_MAX=260"
                }
            }
        }
    }
}
`;
    }
    return config;
  });
};
