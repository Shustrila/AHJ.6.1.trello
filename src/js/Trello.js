import Card from './Card';
import Column from './Column';
import State from './State';

class Trello {
  constructor() {
    /** @public */
    this.listColum = [];

    /** @private */
    this._data = {};

    /** @private */
    this._widget = {};
  }

  /**
     * @private
     * init widget in tag
     *
     * @returns {Promise<void>}
     * @throws error state load
     */

  async _init() {
    this._widget = document.querySelector('[data-widget=trello]');

    try {
      this._data = await State.load();
      await State.save(this._data);
      this.create();
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
     * @public
     * create Trello
     *
     * @this {Trello}
     */

  create() {
    const listColumn = document.createElement('ul');

    listColumn.className = 'trello__list-column';
    this._addColumns(listColumn);
    this._widget.appendChild(listColumn);
  }

  /**
     * @private
     * generate list Columns
     *
     * @this {Trello}
     * @param list {Array}
     */

  _addColumns(list) {
    for (const column of this._data.listColumns) {
      const { name, listCard } = column;
      const col = new Column(name, listCard);

      list.appendChild(col.create('li'));

      if (col.listCard !== []) {
        for (const card of col.listCard) {
          const item = new Card(card.id, card.content, card.column);
          const itemCreate = item.create('li', 'column__item-task');

          col.objectsListCard.push(item);
          col.nodeListTasks.appendChild(itemCreate);
        }
      }

      this.listColum.push(col);
    }
  }
}

export default Trello;
