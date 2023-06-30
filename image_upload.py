import base64
import requests
import sys

# Get the file path from command line arguments
file_path = sys.argv[1]

# Extract the file name from the file path
file_name = file_path.split('/')[-1]

file_encoded = None
# Open the file in binary mode and encode it as base64
with open(file_path, "rb") as image_file:
    file_encoded = base64.b64encode(image_file.read()).decode('utf-8')

# Prepare the JSON payload for the request
r_json = {
    'name': file_name,
    'type': 'image',
    'isPublic': True,
    'data': file_encoded,
    'parentId': sys.argv[3]
}

# Prepare the headers for the request
r_headers = {
    'X-Token': sys.argv[2]
}

# Send a POST request to the specified URL with the JSON payload and headers
r = requests.post("http://0.0.0.0:5000/files", json=r_json, headers=r_headers)

# Print the JSON response from the server
print(r.json())
