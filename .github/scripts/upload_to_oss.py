import oss2
import os
import hashlib

# ========= OSS Client =========
auth = oss2.Auth(
    os.getenv("ACCESS_KEY_ID"),
    os.getenv("ACCESS_KEY_SECRET")
)
bucket = oss2.Bucket(
    auth,
    os.getenv("OSS_ENDPOINT"),
    os.getenv("OSS_BUCKET"),
    region=os.getenv("OSS_REGION")
)

# ========= Utils =========
def md5sum(path: str) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

def normalize_etag(etag: str) -> str:
    return etag.strip('"').lower()

# ========= Config =========
PUBLIC_DIR = "public"
OSS_DIRS = {"assets", "css", "js", "img"}

# ========= Upload Logic =========
for root, _, files in os.walk(PUBLIC_DIR):
    for filename in files:
        local_path = os.path.join(root, filename)
        rel_path = os.path.relpath(local_path, PUBLIC_DIR)

        top_dir = rel_path.split(os.sep, 1)[0]
        if top_dir not in OSS_DIRS:
            continue

        oss_path = rel_path.replace(os.sep, "/")
        local_md5 = md5sum(local_path)

        action = "UPLOAD"
        suffix = ""

        try:
            head = bucket.head_object(oss_path)
            oss_md5 = normalize_etag(head.headers["etag"])

            if oss_md5 == local_md5:
                action = "SKIP"
        except oss2.exceptions.NoSuchKey:
            suffix = " (new)"

        # === 单条日志输出 ===
        print(f"[{action}] {oss_path}{suffix}")

        if action == "UPLOAD":
            bucket.put_object_from_file(oss_path, local_path)
