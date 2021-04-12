export class SortModel {

  sortOrder: string;
  sortDirection = 'asc';

  static of(defaultSortOrder: string, defaultSortDir?: string) {
    const sortModel: SortModel = new SortModel();
    sortModel.sortOrder = defaultSortOrder;
    if (defaultSortDir) {
      sortModel.sortDirection = defaultSortDir;
    }
    return sortModel;
  }

  sortArrow() {
    return this.sortDirection === 'desc' ? 'down' : 'up';
  }

  public changeSortOrder(newSortOrder) {
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
