'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ApiTestPage() {
  const [url, setUrl] = useState('/api/demo');
  const [method, setMethod] = useState('GET');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [requestBody, setRequestBody] = useState('{\n  "name": "Test User"\n}');

  const handleRequest = async () => {
    setLoading(true);
    setResponse(null);
    try {
      let data = undefined;
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        try {
          data = JSON.parse(requestBody);
        } catch (e) {
          throw new Error('Invalid JSON in request body');
        }
      }

      const res = await axios({
        method,
        url,
        data,
      });
      setResponse({
        status: res.status,
        data: res.data,
      });
    } catch (err: any) {
      setResponse({
        error: err.message,
        response: err.response ? { status: err.response.status, data: err.response.data } : null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">API Tester</h1>
      
      <div className="flex flex-col gap-4 max-w-2xl">
        <div className="flex gap-2">
          <select 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
            className="border p-2 rounded bg-white text-black"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
          
          <input 
            type="text" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 rounded flex-grow text-black"
            placeholder="https://api.example.com/endpoint"
          />
        </div>

        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="border p-2 rounded w-full h-32 font-mono text-sm text-black"
            placeholder='{ "key": "value" }'
          />
        )}

        <div className="flex">
          
          <button 
            onClick={handleRequest}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {response && (
          <div className="border rounded p-4 bg-gray-50 mt-4">
            <h2 className="font-bold mb-2 text-black">Response:</h2>
            <pre className="whitespace-pre-wrap break-words text-sm text-gray-800 font-mono overflow-auto max-h-96">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}