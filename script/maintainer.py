import json
import content_loader
import random
import time


def load_json_file():
    try:
        with open('status.json', 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


status = load_json_file()
refresh_time = status.get("maintainer_duration", 1)
hotel_id = status.get("hotel_ids")[status.get("current_hotel_index")]
path = status.get("assets_path")

while True:
    content_loader.main(hotel_id, path + "/")
    wait_time = refresh_time * 3600 + random.randint(0, 1000) - 500
    print(f"Next queries will start in {wait_time//60} minutes")
    # 等待指定的小时数
    time.sleep(wait_time)  # 将小时转换为秒
