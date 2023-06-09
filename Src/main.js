import { IgApiClient } from 'instagram-private-api';
import * as dotenv from 'dotenv'
dotenv.config()
const ig = new IgApiClient();
// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
ig.state.generateDevice(process.env.IG_USERNAME);
// Optionally you can setup proxy url
ig.state.proxyUrl = process.env.IG_PROXY;
(async () => {
  // Execute all requests prior to authorization in the real Android application
  // Not required but recommended
  await ig.simulate.preLoginFlow();
  const loggedInUser = await ig.account.login(`${process.env.IG_USERNAME}`, `${process.env.IG_PASSWORD}`);
  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  process.nextTick(async () => await ig.simulate.postLoginFlow());
  await ig.media.like({
    moduleInfo: {
      module_name: 'profile',
      user_id: loggedInUser.pk,
      username: loggedInUser.username,
    }
  });
})();