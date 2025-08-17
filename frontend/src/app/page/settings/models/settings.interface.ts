export interface EnvironmentConfig {
  PROWLARR_URL: string;
  PROWLARR_KEY: string;
  DOWNLOAD_PATH: string;

  QB_HOST: string;
  QB_PORT: string;
  QB_USERNAME: string;
  QB_PASSWORD: string;
  QB_KEYWORD_FILTER: string[];

  TELEGRAM_TOKEN: string;
  TELEGRAM_CHAT_ID: string;

  EMBY_URL: string;
  EMBY_API_KEY: string;
}
