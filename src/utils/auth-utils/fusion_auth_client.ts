import FusionAuthClient from '@fusionauth/typescript-client';
import { server } from 'src/configs';
import { fusionAuth } from '../constants';

class FusionAuthClientConfigs {
  private applicationId = server
    ? fusionAuth.FUSIONAUTH_APPLICATION_ID
    : process.env.FUSIONAUTH_APPLICATION_ID;

  private clientSecret = server
    ? fusionAuth.CLIENT_SECRET
    : process.env.CLIENT_SECRET;

  private fusionAuthURL = process.env.FUSION_AUTH_URL_DOCKER
    ? process.env.FUSION_AUTH_URL_DOCKER
    : server
    ? fusionAuth.FUSION_AUTH_URL
    : process.env.FUSION_AUTH_URL;

  private fusionAuthJwtPublicKey = server
    ? fusionAuth.FUSION_AUTH_JWT_PUBLIC_KEY
    : process.env.FUSION_AUTH_JWT_PUBLIC_KEY;

  private client: FusionAuthClient;

  constructor() {
    this.client = new FusionAuthClient(
      fusionAuth.FUSION_AUTH_API_KEY,
      this.fusionAuthURL,
    );
  }
  getFusionAuthApplicationId() {
    return this.applicationId;
  }

  getFusionClientSecret() {
    return this.clientSecret;
  }

  getFusionAuthClient() {
    return this.client;
  }

  getFusionAuthJwtPublicKey() {
    return this.fusionAuthJwtPublicKey;
  }
}

const fusionAuthClientConfig = new FusionAuthClientConfigs();

export default fusionAuthClientConfig;
