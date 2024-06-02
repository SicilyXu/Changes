import os
import requests
import json

# Global Data
hotel_ids = [
    "crown_hotel",
    "ela_beach_hotel",
    "gateway_hotel",
    "grandpapua_hotel",
    "hilton_hotel",
    "holiday_express_hotel",
    "holiday_inn_hotel",
    "loloata_hotel",
    "stanely_hotel"
]
url_general = "http://54.253.155.231/GetAllItemsByHotelID/"  # +hotel_id
url_hotel = "http://54.253.155.231/GetHotelItemByID/"  # +hotel_id
url_advertisement = "http://54.253.155.231/GetAdvertisementByHotelId/"  # +hotel_id


# Download json
def download_json(url, path):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        print(f"Downloaded {path}")
    else:
        print(f"Failed to download {path}")


# Download links
def download_file(url, path):
    # Extract the filename from the URL
    filename = url.split('/')[-1]
    file_path = os.path.join(path, filename)

    # Check if the file already exists at the path
    if not os.path.exists(file_path):
        # Initiating a request to download the file
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"File {filename} has been downloaded and saved to {file_path}")
        else:
            print(f"Unable to download file {filename}.")
    else:
        print(f"File {filename} already exists, skipping download.")


# Create directories if they don't exist
def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)


# Extract urls from a json
def extract_links(json_file: dict) -> list[str]:
    download_list = []

    def find_links(struct):
        if isinstance(struct, dict):
            for key, value in struct.items():
                if "public_" in key:
                    if isinstance(value, str):
                        if value != "":
                            download_list.append(value)
                    elif isinstance(value, list):
                        if value[0] != "":
                            download_list.extend(value)
                else:
                    find_links(value)
        elif isinstance(struct, list):
            for item in struct:
                find_links(item)

    find_links(json_file)
    return download_list


# Function to load and return the content of a JSON file
def load_json_file(file_path):
    with open(file_path, 'r', encoding='UTF-8') as file:
        return json.load(file)


def main():
    # download json files
    # TO Do: select hotel!!!!
    create_directory("data")
    download_json(url_general + hotel_ids[0], 'data/general.json')
    download_json(url_hotel + hotel_ids[0], 'data/hotel.json')
    download_json(url_advertisement + hotel_ids[0], 'data/advertisement.json')

    # mkdir
    create_directory("images/general")
    create_directory("images/hotel")
    create_directory("images/advertisement")
    create_directory("videos")

    # get file lists
    files_general = extract_links(load_json_file("data/general.json"))
    files_hotel = extract_links(load_json_file("data/hotel.json"))
    files_advertisement = extract_links(load_json_file("data/advertisement.json"))

    # download files
    for path in files_general:
        download_file(path, 'images/general')
    for path in files_advertisement:
        download_file(path, 'images/advertisement')
    for path in files_hotel:
        if path.find('.mp4') == -1:
            download_file(path, 'images/hotel')
        else:
            download_file(path, 'videos')


if __name__ == '__main__':
    main()
