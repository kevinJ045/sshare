import base64
import socketio
import mss
import time
import sys

# Initialize the Socket.IO client
sio = socketio.Client()
room = 'home'

if len(sys.argv) > 1:
	room = sys.argv[1]

def send_screenshot():
	try:
		with mss.mss() as sct:
			screenshot = sct.shot(output='screenshot.png')

		with open('screenshot.png', 'rb') as image_file:
			image_data = image_file.read()
			base64_image = base64.b64encode(image_data).decode('utf-8')

		sio.emit('screenshot', {'room': room, 'imageData': base64_image})
		time.sleep(0.016)
		send_screenshot()
	except Exception as e:
		print('Error')
		time.sleep(0.016)
		send_screenshot()

@sio.event
def connect():
	print('Connected to the server')
	send_screenshot()

@sio.event
def disconnect():
  print('Disconnected from the server')

sio.connect('http://localhost:3000')

print('Room '+room)

sio.wait()
