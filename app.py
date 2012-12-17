import SimpleHTTPServer
import SocketServer
import os

_port = os.environ.get("PORT")

PORT = _port if _port else 5000

Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer(("", PORT), Handler)

print "serving at port", PORT
httpd.serve_forever()
