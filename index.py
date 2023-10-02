import base64
import socketio
import mss
import time

# Initialize the Socket.IO client
sio = socketio.Client()

# Connect to the Socket.IO server
@sio.event
def connect():
    print('Connected to the server')

@sio.event
def disconnect():
    print('Disconnected from the server')

sio.connect('http://localhost:3000')


# Function to capture and send screenshot data
def send_screenshot():
    with mss.mss() as sct:
        screenshot = sct.shot(output='screenshot.png')

    with open('screenshot.png', 'rb') as image_file:
        image_data = image_file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')

    sio.emit('screenshot', {'imageData': base64_image})

# Continuously send screenshots every 16 ms
while True:
    send_screenshot()
    time.sleep(0.016)  # 16 milliseconds

# Run the Socket.IO client
sio.wait()
