class State {
  constructor() {
    this.name = 'trello';
    this._storage = localStorage;
  }

  async getMaxCardId() {
    try {
      const ids = [];
      const data = await this.load();

      data.listColumns
        .map(item => item.listCard)
        .forEach((card) => {
          card.forEach(item => ids.push(item.id));
        });

      const maxId = Math.max.apply(null, ids);

      return (maxId !== -Infinity) ? maxId + 1 : 0;
    } catch (e) {
      throw new Error(e);
    }
  }

  load() {
    return new Promise((resolve) => {
      let date = this._storage.getItem(this.name);

      if (date === null) {
        this.save({
          listColumns: [
            { name: 'TODO', listCard: [] },
            { name: 'IN PROGRESS', listCard: [] },
            { name: 'DONE', listCard: [] },
          ],
        });
        date = this._storage.getItem(this.name);
      }

      resolve(JSON.parse(date));
    });
  }

  save(data) {
    const serialize = JSON.stringify(data);

    this._storage.setItem(this.name, serialize);
  }
}

export default new State();
