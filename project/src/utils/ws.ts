let socket: WebSocket | null = null;

export function connectWebSocket(url: string, onMessage: (data: any) => void) {
  if (socket) return socket;
  socket = new WebSocket(url);
  socket.onopen = () => console.log('WebSocket connected');
  socket.onmessage = (evt) => {
    try { onMessage(JSON.parse(evt.data)); } catch { onMessage(evt.data); }
  };
  socket.onclose = () => { socket = null; };
  socket.onerror = () => {};
  return socket;
}

export function sendWebSocket(data: any) {
  if (socket && socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(data));
}


