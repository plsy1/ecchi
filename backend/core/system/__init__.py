from fastapi import HTTPException
from io import IOBase
from datetime import datetime, timedelta
import os
import httpx
from urllib.parse import urlparse, quote
from typing import Any, List
from core.config import _config
import aiofiles

CACHE_EXPIRE_HOURS = _config.get("CACHE_EXPIRE_HOURS")
CACHE_DIR = _config.get("CACHE_DIR")

os.makedirs(CACHE_DIR, exist_ok=True)


def replace_domain_in_value(value: Any, prefix: str, exclude: List[str] = None) -> Any:
    """
    递归替换 dict/list 结构中的所有 URL 为 prefix + urlencode(原URL)
    排除域名列表中的 URL 不做替换
    """
    if exclude is None:
        exclude = ["www.mgstage.com", "al.dmm.co.jp"]

    if isinstance(value, dict):
        return {
            k: replace_domain_in_value(v, prefix, exclude) for k, v in value.items()
        }
    elif isinstance(value, list):
        return [replace_domain_in_value(v, prefix, exclude) for v in value]
    elif isinstance(value, str):
        if value.startswith("http://") or value.startswith("https://"):
            try:
                parsed = urlparse(value)
                if parsed.netloc in exclude:
                    return value
                return f"{prefix}{quote(value, safe='')}"
            except Exception:
                return value
        else:
            return value
    else:
        return value


def get_cache_path(url: str) -> str:
    import hashlib

    hash_name = hashlib.md5(url.encode("utf-8")).hexdigest()
    return os.path.join(CACHE_DIR, f"{hash_name}")


async def fetch_and_cache_image(url: str) -> tuple[IOBase, dict]:
    cache_path = get_cache_path(url)

    if os.path.exists(cache_path):
        last_modified = datetime.fromtimestamp(os.path.getmtime(cache_path))
        if datetime.now() - last_modified < timedelta(hours=CACHE_EXPIRE_HOURS):
            etag = str(os.path.getmtime(cache_path))
            headers = {
                "Cache-Control": f"public, max-age={CACHE_EXPIRE_HOURS*3600}",
                "ETag": etag,
            }
            return open(cache_path, "rb"), headers
        else:
            os.remove(cache_path)

    os.makedirs(os.path.dirname(cache_path), exist_ok=True)

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
    if resp.status_code != 200:
        raise HTTPException(resp.status_code, "Failed to fetch image")

    async with aiofiles.open(cache_path, "wb") as f:
        await f.write(resp.content)

    etag = str(os.path.getmtime(cache_path))
    headers = {
        "Cache-Control": f"public, max-age={CACHE_EXPIRE_HOURS*3600}",
        "ETag": etag,
    }
    return open(cache_path, "rb"), headers
