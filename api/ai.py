import json
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse


class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path in ('/api/ai/health', '/api/ai', '/health', '/'):
            self._json(200, {'status': 'ok', 'service': 'bricksy-ai'})
        else:
            self._json(404, {'error': 'not found'})

    def do_POST(self):
        path = urlparse(self.path).path
        if path not in ('/api/ai/recommend', '/api/ai', '/recommend', '/'):
            return self._json(404, {'error': 'not found'})

        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = json.loads(self.rfile.read(content_length)) if content_length > 0 else {}
        except Exception:
            return self._json(400, {'error': 'invalid JSON'})

        workers = body.get('workers', [])
        job = body.get('job', {})

        results = []
        for w in workers:
            if w.get('trade') != job.get('trade_required'):
                continue
            norm_exp = min(float(w.get('experience', 0)) / 30.0, 1.0)
            norm_ten = min(float(w.get('tenure', 0)) / 20.0, 1.0)
            norm_rat = float(w.get('rating', 0)) / 5.0
            norm_prj = min(float(w.get('previous_projects', 0)) / 50.0, 1.0)
            norm_cst = 1.0 - min(float(w.get('estimated_cost', 0)) / 10000.0, 1.0)
            avail = float(w.get('availability_score', 0))
            trust = float(w.get('trust_score', 0))
            score = (norm_exp * 0.20 + norm_ten * 0.10 + norm_rat * 0.30
                     + norm_prj * 0.10 + norm_cst * 0.00 + avail * 0.15 + trust * 0.15)
            results.append({**w, 'score': round(float(score), 4)})

        results.sort(key=lambda x: x['score'], reverse=True)
        self._json(200, {'recommendations': results})

    def _json(self, status, data):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
