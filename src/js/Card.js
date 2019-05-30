import State from './State';

class Card {
  constructor(id, content, column) {
    this.id = id;
    this.content = content;

    this._nodeRoot = {};
    this._column = column;
    this._nodeFooter = {};
    this._nodeClose = {};
    this._nodeContent = {};
    this._nodeDetail = {};
  }

  /**
     * @public
     * remove task
     *
     * @returns {Promise<void>}
     */

  async remove() {
    try {
      const data = await State.load();

      const selfColumn = data.listColumns.filter(item => item.name === this._column)[0];
      selfColumn.listCard = selfColumn.listCard.filter(item => item.id !== this.id);
      await State.save(data);
      this._nodeRoot.remove();
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
     * @public
     * create Card
     *
     * @param tagName
     * @param className
     * @returns {{}|*}
     */

  create(tagName, className) {
    this._nodeContent = document.createElement('div');
    this._nodeContent.className = 'column__item-task-content';
    this._nodeContent.innerHTML = this.content;

    this._nodeClose = document.createElement('div');
    this._nodeClose.className = 'column__item-task-close';
    this._nodeClose.innerHTML = 'X';
    this._nodeClose.addEventListener('click', this.remove.bind(this));

    this._nodeFooter = document.createElement('div');
    this._nodeFooter.className = 'column__item-task-footer';
    this._nodeFooter.addEventListener('mousedown', this._grabCard.bind(this));

    this._nodeDetail = document.createElement('div');
    this._nodeDetail.className = 'column__item-task-detail';
    this._nodeDetail.appendChild(this._nodeContent);
    this._nodeDetail.appendChild(this._nodeClose);
    this._nodeDetail.appendChild(this._nodeFooter);

    this._nodeRoot = document.createElement(tagName);
    this._nodeRoot.className = className;
    this._nodeRoot.appendChild(this._nodeDetail);

    return this._nodeRoot;
  }

  /**
     * @private
     * move event card
     *
     * @param e {{}}
     */

  _mousemoveDetail(e) {
    e.preventDefault();

    this._nodeDetail.style.top = `${e.pageY - this._nodeRoot.offsetHeight / 2}px`;
    this._nodeDetail.style.left = `${e.pageX - this._nodeRoot.offsetWidth / 2}px`;
  }

  /**
     * @private
     * up event card
     *
     * @param e {{}}
     */

  _mouseupDetail(e) {
    this._nodeDetail.removeAttribute('style');
    this._nodeDetail.classList.remove('column__item-task-detail--drag');

    this._nodeRoot.removeAttribute('style');
    this._nodeRoot.classList.remove('column__item-task--drag');
  }

  /**
     * @private
     * down event card
     *
     * @param e {{}}
     */

  _grabCard(e) {
    e.preventDefault();

    this._nodeRoot.style.width = `${this._nodeRoot.offsetWidth}px`;
    this._nodeRoot.style.height = `${this._nodeRoot.offsetHeight}px`;
    this._nodeRoot.classList.add('column__item-task--drag');

    this._nodeDetail.style.width = `${this._nodeRoot.offsetWidth}px`;
    this._nodeDetail.style.top = `${e.pageY - this._nodeRoot.offsetHeight / 2}px`;
    this._nodeDetail.style.left = `${e.pageX - this._nodeRoot.offsetWidth / 2}px`;
    this._nodeDetail.style.transform = 'rotate(2deg)';
    this._nodeDetail.classList.add('column__item-task-detail--drag');
    this._nodeDetail.addEventListener('mousemove', this._mousemoveDetail.bind(this));
    this._nodeDetail.addEventListener('mouseup', this._mouseupDetail.bind(this));
  }
}

export default Card;
