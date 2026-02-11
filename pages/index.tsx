'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface RequestHistory {
  id: number;
  method: string;
  url: string;
  headers?: Record<string, any>;
  body?: object;
  status: number;
  response?: object;
  createdAt: string;
}

export default function Home() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const loadHistory = async (page = 1) => {
    try {
      const res = await fetch(`/api/request/history?page=${page}&limit=5`);
      const data = await res.json();
      setHistory(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setHistoryPage(page);
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const sendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      if (!url) {
        setError('URL is required');
        setLoading(false);
        return;
      }

      const parsedHeaders = headers ? JSON.parse(headers) : {};
      const parsedBody = body ? JSON.parse(body) : undefined;

      const res = await fetch('/api/request/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          url,
          headers: parsedHeaders,
          body: parsedBody,
        }),
      });

      const data = await res.json();
      setResponse(data);
      
      // Reload history after successful request
      loadHistory(1);
    } catch (err: any) {
      setError(err.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-600">
          REST Client
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Builder */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-semibold mb-4">Request Builder</h2>

              <form onSubmit={sendRequest} className="space-y-4">
                {/* Method & URL */}
                <div className="flex gap-2">
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white font-semibold w-32 focus:outline-none focus:border-blue-400"
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                    <option>PATCH</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Enter URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  />
                </div>

                {/* Headers */}
                <div>
                  <label className="block text-sm font-medium mb-2">Headers (JSON)</label>
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    placeholder='{"Content-Type": "application/json"}'
                    className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 font-mono text-sm h-24 resize-none"
                  />
                </div>

                {/* Body */}
                {['POST', 'PUT', 'PATCH'].includes(method) && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Body (JSON)</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder='{}'
                      className="w-full bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 font-mono text-sm h-32 resize-none"
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/30 border border-red-600 rounded px-3 py-2 text-red-200">
                    {error}
                  </div>
                )}

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-2 px-4 rounded transition"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </form>

              {/* Response */}
              {response && (
                <div className="mt-6 pt-6 border-t border-slate-600">
                  <h3 className="text-lg font-semibold mb-3">Response</h3>
                  <div className="bg-slate-800 rounded p-3 overflow-auto max-h-96">
                    <div className="mb-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        response.status >= 200 && response.status < 300
                          ? 'bg-green-900/50 text-green-300'
                          : response.status >= 400
                          ? 'bg-red-900/50 text-red-300'
                          : 'bg-yellow-900/50 text-yellow-300'
                      }`}>
                        Status: {response.status}
                      </span>
                    </div>
                    <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* History Sidebar */}
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl h-fit">
            <h2 className="text-xl font-semibold mb-4">History</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-slate-400 text-sm">No requests yet</p>
              ) : (
                history.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-600 rounded p-3 text-xs cursor-pointer hover:bg-slate-500 transition"
                    onClick={() => {
                      setMethod(req.method);
                      setUrl(req.url);
                      setHeaders(req.headers ? JSON.stringify(req.headers) : '');
                      setBody(req.body ? JSON.stringify(req.body) : '');
                      setResponse({ status: req.status, data: req.response });
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${
                        req.method === 'GET' ? 'text-blue-300' :
                        req.method === 'POST' ? 'text-green-300' :
                        req.method === 'PUT' ? 'text-yellow-300' :
                        'text-red-300'
                      }`}>
                        {req.method}
                      </span>
                      <span className={`text-xs ${
                        req.status >= 200 && req.status < 300
                          ? 'text-green-300'
                          : req.status >= 400
                          ? 'text-red-300'
                          : 'text-yellow-300'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="text-slate-300 truncate mt-1">{req.url}</div>
                    <div className="text-slate-400 mt-1">
                      {new Date(req.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => loadHistory(Math.max(1, historyPage - 1))}
                  disabled={historyPage === 1}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-1 rounded transition"
                >
                  Prev
                </button>
                <span className="text-sm text-slate-300 flex items-center justify-center">
                  {historyPage}/{totalPages}
                </span>
                <button
                  onClick={() => loadHistory(Math.min(totalPages, historyPage + 1))}
                  disabled={historyPage === totalPages}
                  className="flex-1 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm py-1 rounded transition"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
