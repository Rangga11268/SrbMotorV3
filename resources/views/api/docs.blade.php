<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SRB Motor API Documentation</title>
    <link rel="icon" type="image/png" href="/favicon.png">
    
    <!-- Google Fonts: Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background-color: #f7f9fc;
        }

        /* Top Header Bar */
        .api-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #041627;
            color: #ffffff;
            padding: 0 24px;
            height: 60px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }

        .brand-section {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .brand-logo {
            font-weight: 700;
            font-size: 1.25rem;
            letter-spacing: 0.5px;
            background: linear-gradient(135deg, #ffffff, #a0aec0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .api-badge {
            background-color: #3182ce;
            color: white;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }

        .actions-section {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .btn-postman {
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: #ff6c37; /* Postman orange */
            color: white;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(255, 108, 55, 0.2);
        }

        .btn-postman:hover {
            background-color: #e05320;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(255, 108, 55, 0.3);
        }

        .btn-postman svg {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        /* Redoc Container Offset */
        #redoc-container {
            margin-top: 60px;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
        }
    </style>
</head>
<body>

    <!-- Header Portal -->
    <header class="api-header">
        <div class="brand-section">
            <span class="brand-logo">SRB Motor</span>
            <span class="api-badge">API Portal v1.0</span>
        </div>
        <div class="actions-section">
            <a href="/SrbMotor.postman_collection.json" download="SrbMotor.postman_collection.json" class="btn-postman">
                <!-- Postman Logo SVG -->
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.01 19.34a7.33 7.33 0 01-7.33-7.33c0-.68.1-1.34.28-1.97l2.45 1.41a4.87 4.87 0 004.6 7.89l-2.43-1.4a4.93 4.93 0 002.43 1.4zm0-3.34a4.004 4.004 0 01-4-4c0-.37.05-.72.15-1.06l1.34.77a2.66 2.66 0 002.51 4.29L12.01 16zm4.89-6.6l-2.45-1.41a4.87 4.87 0 00-4.6-7.89l2.43 1.4a4.93 4.93 0 00-2.43-1.4c4.05 0 7.33 3.28 7.33 7.33a7.27 7.27 0 01-.28 1.97l-.27.6zm-1.89 3.26l-1.34-.77a2.66 2.66 0 00-2.51-4.29l1.34.77a2.67 2.67 0 002.51 4.29z"/>
                </svg>
                Unduh Postman Collection
            </a>
        </div>
    </header>

    <!-- Redoc Interactive Documentation -->
    <div id="redoc-container"></div>

    <!-- Redoc JS CDN -->
    <script src="https://cdn.jsdelivr.net/npm/redoc@2.0.0-rc.76/bundles/redoc.standalone.js"></script>
    <script>
        Redoc.init('/openapi.json', {
            scrollYOffset: 60,
            hideDownloadButton: true,
            theme: {
                colors: {
                    primary: {
                        main: '#3182ce'
                    },
                    text: {
                        primary: '#2d3748',
                        secondary: '#718096'
                    }
                },
                typography: {
                    fontFamily: 'Inter, sans-serif',
                    headings: {
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '600'
                    }
                },
                rightPanel: {
                    backgroundColor: '#1a202c'
                }
            }
        }, document.getElementById('redoc-container'));
    </script>
</body>
</html>
