// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // rtpsServiceUrl: 'http://192.168.1.200/Rtps',
  // configServiceUrl:'http://192.168.1.200/applicationconfiguration',
  // courtCaseServiceUrl:'http://192.168.1.200/courtcase'

    rtpsServiceUrl: 'http://13.232.154.36/rtps_qa',
    configServiceUrl: 'http://13.232.154.36/CovidCandiateTracker', //  'https://localhost:5001' , //
    courtCaseServiceUrl:'http://13.232.154.36/ccm_qa'
};
