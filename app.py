import SimpleHTTPServer
import SocketServer
import os

PORT = int(os.environ.get('PORT', 5000))

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
