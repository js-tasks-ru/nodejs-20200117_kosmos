class Chat {
  constructor() {
    this.clients = [];
  }

  subscribe(resolver) {
    this.clients.push(resolver);
  }

  publish(message) {
    for (let client of this.clients) {
      client(message);
    }

    this.clients = [];
  }
}

module.exports = Chat;
