export default class Camera1SignalServer {
  private socket: WebSocket; // Explicitly type the WebSocket instance

  constructor(channel: string) {
    // The channel is a string type
    // this.socket = new WebSocket(`ws://deepminddsvisualss.com/live/?roomId=${channel}`);
    this.socket = new WebSocket(`ws://deepminddsvisualss.com/live/?roomId=${channel}`);

    this.socket.addEventListener('open', () => {
      this.postMessage({ type: 'join-channel', channel });
    });

    this.socket.addEventListener('message', (e: MessageEvent) => {
      const object = JSON.parse(e.data);
      if (object.type === 'connection-established') {
        console.log('Connection established');
      } else if (object.type === 'joined-channel') {
        console.log('Joined channel: ' + object.channel);
      } else {
        this.onmessage({ data: object });
      }
    });
  }

  // onmessage can be overridden and takes an event with a data field of type any
  // By default, it's a no-op method.
  onmessage(e: { data: any }): void {
    // Override this method to handle messages
    console.log('ONMESSAGE');
  }

  // postMessage takes an object and sends it as a stringified JSON message
  postMessage(data: Record<string, any>): void {
    console.log(this.socket.readyState, WebSocket.OPEN, 'CONNECTIONNNNN');
    // if (this.socket.readyState === WebSocket.OPEN) {
    console.log(data, 'data');
    this.socket.send(JSON.stringify(data));
    // }
  }
}
