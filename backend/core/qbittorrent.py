import requests, time
from qbittorrentapi import Client
from io import BytesIO


class QB:
    def __init__(self, host, port, username, password, tags="Ecchi"):
        """
        初始化 QBittorrent 客户端并配置。

        :param host: qbittorrent 主机地址
        :param port: qbittorrent 端口
        :param username: qbittorrent 用户名
        :param password: qbittorrent 密码
        :param tags: 可选，默认标签
        """
        self.qb = Client(host=host, port=port, username=username, password=password)
        self.tags = tags

    def delete_torrent(self, torrent_hash, delete_files=True):
        """
        删除种子（可选是否删除本地文件）

        :param torrent_hash: 种子的哈希 (str 或 list)
        :param delete_files: 是否同时删除下载文件
        """
        return self.qb.torrents_delete(
            delete_files=delete_files, torrent_hashes=torrent_hash
        )

    def get_downloading_torrents(self):
        """
        获取正在下载的种子列表。

        :return: 下载中的种子信息列表，每个为字典
        """
        if not self.qb:
            return []

        try:
            torrents = self.qb.torrents_info(status_filter="downloading")
            downloading_list = [
                {
                    "name": t.name,
                    "progress": t.progress,
                    "size": t.size,
                    "download_speed": t.dlspeed,
                    "eta": t.eta,
                    "tags": t.tags,
                    "hash": t.hash,
                }
                for t in torrents
            ]
            return downloading_list
        except Exception as e:
            print("Failed to fetch downloading torrents:", e)
            return []

    def add_torrent_url(self, download_link, save_path, tags=None):
        """
        使用 torrent URL 添加种子到 qbittorrent。

        :param download_link: 种子文件 URL
        :param save_path: 种子保存路径
        :param tags: 可选，添加的标签，默认使用初始化时提供的 tags
        :return: 成功与否
        """
        try:
            if tags is None:
                tags = self.tags
            torrent_options = {
                "urls": download_link,
                "tags": tags,
                "save_path": save_path,
            }
            return self.qb.torrents_add(**torrent_options) == "Ok."
        except Exception as e:
            print(f"Error adding torrent: {e}")
            return False

    def add_torrent_file(self, torrent_name, torrent_data, save_path, tags=None):
        """
        使用 torrent 文件添加种子到 qbittorrent。

        :param torrent_name: 种子名称
        :param torrent_data: 种子文件内容 (BytesIO)
        :param save_path: 种子保存路径
        :param tags: 可选，添加的标签，默认使用初始化时提供的 tags
        :return: 成功与否
        """
        try:
            if tags is None:
                tags = self.tags
            torrent_bytes = torrent_data.getvalue()
            torrent_options = {
                "torrent_files": torrent_bytes,
                "tags": tags,
                "save_path": save_path,
                "rename": torrent_name,
            }
            return self.qb.torrents_add(**torrent_options) == "Ok."

        except Exception as e:
            print(f"Error adding torrent: {e}")
            return False

    def download_torrent_file(self, torrent_url):
        """
        从 URL 下载种子文件。

        :param torrent_url: 种子文件的 URL
        :return: 下载的种子数据（BytesIO），或者如果失败则返回 None
        """
        try:
            response = requests.get(torrent_url, timeout=10)
            torrent_data = BytesIO(response.content)
            return torrent_data
        except Exception as e:
            print(f"Error downloading torrent: {e}")
            return None

    def get_torrents_list(self):
        try:
            return self.qb.torrents_info()
        except Exception as e:
            return None

    def get_torrent_file_by_hash(self, hash):
        try:
            return self.qb.torrents.files(hash)
        except Exception as e:
            print(e)

    def set_file_priority(self, torrent_hash, file_ids, priority):
        try:
            self.qb.torrents.file_priority(
                torrent_hash=torrent_hash, file_ids=file_ids, priority=priority
            )
        except Exception as e:
            print(e)

    def file_filter_by_keywords(self, QB_KEYWORD_FILTER):
        try:

            deselect_map = {}

            torrent_list = self.get_torrents_list()

            for torrent in torrent_list:
                torrent_hash = torrent.get("hash")
                files = self.get_torrent_file_by_hash(hash=torrent_hash)

                deselect_ids = [
                    f.get("index")
                    for f in files
                    if any(kw in f.get("name", "") for kw in QB_KEYWORD_FILTER)
                ]

                if deselect_ids:
                    deselect_map[torrent_hash] = deselect_ids

            for torrent_hash, file_ids in deselect_map.items():
                self.set_file_priority(
                    torrent_hash=torrent_hash, file_ids=file_ids, priority=0
                )

        except Exception as e:
            print(e)

    def filter_after_add_by_tag(self, random_tag, keyword_filter, max_wait=30):
        torrent_hash = None

        try:
            for _ in range(max_wait):
                torrent_list = self.get_torrents_list()
                for t in torrent_list:
                    tags = t.get("tags", "")
                    if random_tag in tags.split(","):
                        torrent_hash = t.get("hash")
                        files = self.get_torrent_file_by_hash(hash=torrent_hash)
                        if files:
                            self.file_filter_by_keywords(
                                QB_KEYWORD_FILTER=keyword_filter
                            )
                            return
                time.sleep(1)
        finally:
            if torrent_hash:
                self.qb.torrents_remove_tags(
                    tags=random_tag,
                    torrent_hashes=torrent_hash,
                )
