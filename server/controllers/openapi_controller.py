import os
from flask import Response, send_from_directory

SPEC_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SWAGGER_HTML = """<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>API Docs</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/openapi.json',
          dom_id: '#swagger-ui',
        });
      };
    </script>
  </body>
</html>"""


def get_spec():
    return send_from_directory(SPEC_DIR, "openapi.json", mimetype="application/json")


def get_docs():
    return Response(SWAGGER_HTML, mimetype="text/html")
