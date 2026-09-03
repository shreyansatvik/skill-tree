#!/usr/bin/env python3
"""Serve the Skill Tree app and open it in a browser.

The cross-platform launcher — Windows, macOS and Linux, Python 3.6+, no
dependencies:

    python3 run.py      (macOS / Linux)
    py run.py           (Windows)

The app needs to be served over http:// rather than opened as a file://
page, because browsers refuse localStorage on file:// origins and the app
would silently forget your profile and progress every time you reload.
"""

import http.server
import os
import socket
import socketserver
import sys
import threading
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
FIRST_PORT = 8765
PORT_TRIES = 50


def find_port(start, tries):
    """First free port at or after `start`, so a second copy still runs."""
    for port in range(start, start + tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            try:
                probe.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    sys.exit("No free port between {} and {}.".format(start, start + tries - 1))


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serves the project directory, quietly."""

    def log_message(self, *args):
        pass


def main():
    if not os.path.isfile(os.path.join(ROOT, "index.html")):
        sys.exit("index.html is not next to run.py — run this from the project folder.")

    os.chdir(ROOT)
    port = find_port(FIRST_PORT, PORT_TRIES)
    url = "http://127.0.0.1:{}/index.html".format(port)

    # The socket is bound and listening by the time TCPServer() returns, so a
    # browser opening immediately will connect rather than be refused.
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", port), Handler)

    print("Skill Tree running at " + url)
    print("Press Ctrl-C to stop.")
    threading.Timer(0.3, webbrowser.open, [url]).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
