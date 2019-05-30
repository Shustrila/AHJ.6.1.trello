import Card from './Card';
import State from './State';

class Column {
  constructor(name, listCard) {
    /** @public */
    this.name = name;
    this.listCard = listCard || [];
    this.objectsListCard = [];

    /** @private */
    this.nodeRoot = {};
    this.nodeListTasks = {};
    this.nodeAddBlock = {};
    this.nodeFormAdd = {};
    this._nodeHead = {};
    this._nodeHeadTitle = {};
    this._nodeHeadMenu = {};
    this._nodeButtonAdd = {};
    this._nodeTextarea = {};
    this._nodeFormAddButton = {};
    this._nodeFormClose = {};
    this._nodeWrapperButtonForm = {};
  }

  _createHead() {
    this._nodeHeadTitle = document.createElement('h4');
    this._nodeHeadTitle.className = 'column__head-title';
    this._nodeHeadTitle.innerHTML = this.name;

    this._nodeHeadMenu = document.createElement('div');
    this._nodeHeadMenu.className = 'column__head-menu';

    this._nodeHead = document.createElement('div');
    this._nodeHead.className = 'column__head';
    this._nodeHead.appendChild(this._nodeHeadTitle);
    this._nodeHead.appendChild(this._nodeHeadMenu);
  }

  _createListTasks() {
    this.nodeListTasks = document.createElement('ul');
    this.nodeListTasks.className = 'column__list-tasks';
  }

  _showAddForm(e) {
    e.preventDefault();

    e.target.classList.add('column__add--hidden');
    this.nodeFormAdd.classList.remove('column__add-form--hidden');
  }

  _hiddenAddForm(e) {
    e.preventDefault();

    this.nodeFormAdd.classList.add('column__add-form--hidden');

    this._nodeButtonAdd.classList.remove('column__add--hidden');
    this._nodeButtonAdd.classList.add('column__add--show');
    this._nodeButtonAdd.removeAttribute('style');
  }

  _createAddBlock() {
    this.nodeAddBlock = document.createElement('div');
    this.nodeAddBlock.className = 'column__add-block';

    this._nodeButtonAdd = document.createElement('button');
    this._nodeButtonAdd.innerHTML = '+ Add another card';
    this._nodeButtonAdd.className = 'column__add';
    this._nodeButtonAdd.addEventListener('click', this._showAddForm.bind(this));

    this._nodeTextarea = document.createElement('textarea');
    this._nodeTextarea.placeholder = 'Enter a title for this card...';
    this._nodeTextarea.name = 'textarea';
    this._nodeTextarea.className = 'column__textarea';

    this._nodeFormAddButton = document.createElement('input');
    this._nodeFormAddButton.type = 'submit';
    this._nodeFormAddButton.value = 'Add Card';
    this._nodeFormAddButton.className = 'column__add-form-submit';

    this._nodeFormClose = document.createElement('button');
    this._nodeFormClose.innerHTML = 'X';
    this._nodeFormClose.className = 'column__add-form-close';
    this._nodeFormClose.addEventListener('click', this._hiddenAddForm.bind(this));

    this._nodeWrapperButtonForm = document.createElement('div');
    this._nodeWrapperButtonForm.appendChild(this._nodeFormAddButton);
    this._nodeWrapperButtonForm.appendChild(this._nodeFormClose);

    this.nodeFormAdd = document.createElement('form');
    this.nodeFormAdd.className = 'column__add-form column__add-form--hidden';
    this.nodeFormAdd.action = '/';
    this.nodeFormAdd.addEventListener('submit', this._submit.bind(this));
    this.nodeFormAdd.appendChild(this._nodeTextarea);
    this.nodeFormAdd.appendChild(this._nodeWrapperButtonForm);

    this.nodeAddBlock.appendChild(this._nodeButtonAdd);
    this.nodeAddBlock.appendChild(this.nodeFormAdd);
  }

  /**
     * @private
     * create root element
     *
     * @param tagName {{}|*}
     */

  _createColumn(tagName) {
    this.nodeRoot = document.createElement(tagName);
    this.nodeRoot.className = 'trello__item-column column';

    this.nodeRoot.appendChild(this._nodeHead);
    this.nodeRoot.appendChild(this.nodeListTasks);
    this.nodeRoot.appendChild(this.nodeAddBlock);
  }

  /**
     * @public
     * create column
     *
     * @param tagName {{}|*} - tag
     * @returns {{}|*}
     */

  create(tagName) {
    this._createHead();
    this._createListTasks();
    this._createAddBlock();
    this._createColumn(tagName);

    return this.nodeRoot;
  }

  /**
     * @private
     * add form event submit
     *
     * @param e
     * @returns {Promise<void>}
     */

  async _submit(e) {
    e.preventDefault();

    try {
      const data = await State.load();
      const { textarea } = e.target.elements;
      const classNameError = 'column__textarea--red';

      if (textarea.value.trim() !== '') {
        const id = await State.getMaxCardId();
        const card = new Card(id, textarea.value.trim(), this);
        const createCard = card.create('li', 'column__item-task');

        textarea.classList.remove(classNameError);

        data.listColumns = data.listColumns.map((item) => {
          if (item.name === this.name) {
            item.listCard.push({ id, content: card.content, column: this.name });
          }
          return item;
        });

        this.nodeListTasks.appendChild(createCard);
        e.target.elements.textarea.value = '';

        State.save(data);
      } else {
        textarea.classList.add(classNameError);
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default Column;
