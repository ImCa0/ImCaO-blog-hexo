import oss2
import os
import hashlib
from pathlib import Path

# 获取阿里云 OSS 客户端
auth = oss2.Auth(os.getenv('ACCESS_KEY_ID'), os.getenv('ACCESS_KEY_SECRET'))
bucket = oss2.Bucket(auth, os.getenv('OSS_ENDPOINT'), os.getenv('OSS_BUCKET'), region=os.getenv('OSS_REGION'))

def calculate_md5(file_path):
    md5 = hashlib.md5()
    with open(file_path, 'rb') as f:
        while chunk := f.read(8192):
            md5.update(chunk)
    return md5.hexdigest()

def normalize_and_lower(etag):
    return etag.strip('"').lower()

# 遍历资源文件并上传，检查是否已存在或是否更新
resource_path = 'source/assets'  # 需要上传的本地文件路径
for root, dirs, files in os.walk(resource_path):
    for file in files:
        local_path = os.path.join(root, file)
        remote_path = 'assets/' + os.path.relpath(local_path, resource_path)

        # 判断 OSS 上是否已经有该文件
        try:
            result = bucket.head_object(remote_path)
            oss_etag = result.headers.get('etag')  # 获取 OSS 文件的 ETag（哈希值）
            normalized_etag = normalize_and_lower(oss_etag)
            
            # 如果文件内容未变化，跳过上传
            if normalized_etag:
                with open(local_path, 'rb') as f:
                    local_md5 = calculate_md5(local_path)  # 计算本地文件的 MD5
                    print(f'local_md5: {local_md5}')
                    print(f'normalized_etag: {normalized_etag}')
                    if normalized_etag == local_md5:
                        print(f'{remote_path} is up-to-date, skipping upload.')
                        continue
        except oss2.exceptions.NoSuchKey:
            # 文件不存在，执行上传
            pass
        
        # 上传文件
        print(f'Uploading {local_path} to OSS as {remote_path}')
        bucket.put_object_from_file(remote_path, local_path)
