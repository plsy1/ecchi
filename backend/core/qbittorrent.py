import requests
from qbittorrentapi import Client
from io import BytesIO


class QB:
    def __init__(self, host, port, username, password, tags=None):
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
                tags = self.tags  # 如果没有传入 tags，则使用默认 tags
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
                tags = self.tags  # 如果没有传入 tags，则使用默认 tags
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
