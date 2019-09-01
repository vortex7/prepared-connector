define({ "api": [
  {
    "type": "get",
    "url": "/status/",
    "title": "Get Status",
    "name": "status",
    "group": "app",
    "version": "0.1.0",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"OK\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/routes/app-routes.js",
    "groupTitle": "app"
  }
] });
