<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SRB Motor API - Swagger UI</title>
    <!-- CSS Swagger UI -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui.css">
    <style>
        html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }
        body {
            margin: 0;
            background: #fafafa;
            font-family: sans-serif;
        }
        /* Top Navigation Header */
        .api-header {
            background-color: #041627;
            padding: 10px 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .api-header h1 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 600;
        }
        .api-header a {
            color: #3182ce;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: color 0.2s;
        }
        .api-header a:hover {
            color: #63b3ed;
        }
    </style>
</head>
<body>

    <header class="api-header">
        <h1>SRB Motor API Documentation</h1>
        <a href="/api-docs">← Gunakan Tampilan Redoc</a>
    </header>

    <div id="swagger-ui"></div>

    <!-- JS Swagger UI CDN -->
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            // Initialize Swagger UI pointing to the generated openapi.json
            const ui = SwaggerUIBundle({
                url: "/openapi.json",
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "BaseLayout",
                persistAuthorization: true
            });
            window.ui = ui;
        };
    </script>
</body>
</html>
