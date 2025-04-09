import requests

url = "http://127.0.0.1:8000/detect/"
image_path = "C:\\Users\\KESAVASUNDARAM\\Desktop\\FinalYear Project\\Datasets\\Split_Dataset\\test\\images\\4_img_711.jpg"

with open(image_path, "rb") as file:
    response = requests.post(url, files={"file": file})

with open("output.jpg", "wb") as out_file:
    out_file.write(response.content)

print("Detection completed. Check output.jpg")