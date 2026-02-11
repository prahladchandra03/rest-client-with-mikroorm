import { useEffect, useState } from 'react';

export default function History() {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch(`/api/request/history?page=${page}`)
      .then(res => res.json())
      .then(res => setData(res.data));
  }, [page]);

  return (
    <div>
      <h2>Request History</h2>
      {data.map(item => (
        <div key={item.id}>
          {item.method} - {item.url}
        </div>
      ))}
      <button onClick={() => setPage(p => p + 1)}>Next</button>
    </div>
  );
}
