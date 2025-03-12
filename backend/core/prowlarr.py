import requests

class Prowlarr:
    def __init__(self, base_url, api_key):
        """
        初始化Prowlarr实例，设置API URL和API Key。
        :param base_url: Prowlarr的基础URL，例如: 'http://localhost:9696'
        :param api_key: 你在Prowlarr中获取的API Key
        """
        self.base_url = base_url
        self.api_key = api_key
        self.headers = {
            'X-Api-Key': self.api_key
        }

    def search(self, query, page=1, page_size=10):
        """
        搜索方法，查询Prowlarr中的搜索结果。
        :param query: 搜索的关键词
        :param page: 页码 (默认为 1)
        :param page_size: 每页返回的结果数量 (默认为 10)
        :return: 搜索结果的JSON响应
        """
        url = f"{self.base_url}/api/v1/search"
        params = {
            'query': query,
            'categories': '6000'
        }

        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()  
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"请求失败: {e}")
            return None
