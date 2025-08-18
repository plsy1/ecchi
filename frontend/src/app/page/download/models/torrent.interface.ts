export interface DownloadingTorrent {
  hash: string,
  name: string;
  progress: number;
  size: number;
  download_speed: number;
  eta: number;
  tags: string;
}