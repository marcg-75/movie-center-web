export class SortModel {
  sortOrder = '';
  sortDirection = 'asc';

  static of(defaultSortOrder: string, defaultSortDir?: string) {
    const sortModel: SortModel = new SortModel();
    sortModel.sortOrder = defaultSortOrder;
    if (defaultSortDir) {
      sortModel.sortDirection = defaultSortDir;
    }
    return sortModel;
  }

  get sortArrow() {
    return this.sortDirection === 'desc' ? 'down' : 'up';
  }

  public changeSortOrder(newSortOrder: string) {
    if (newSortOrder === this.sortOrder) {
      if (this.sortDirection === 'asc') {
        this.sortDirection = 'desc';
      } else {
        this.sortDirection = 'asc';
      }
    } else {
      this.sortOrder = newSortOrder;
      this.sortDirection = 'asc';
    }
  }
}
