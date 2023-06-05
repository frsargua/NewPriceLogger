export class LocalStorageMethods {
  static initializeLocalStorage(location: string): void {
    if (!localStorage.getItem(location)) {
      localStorage.setItem(location, JSON.stringify([]));
    }
  }

  static updateLocalStorage(location: string, data: any[]): void {
    const dataFromLocalStorage = this.loadDataFromLocalStorage(location);
    localStorage.setItem(location, JSON.stringify(data));
  }

  static loadDataFromLocalStorage(location: string): any[] {
    const dataFromLocalStorage = localStorage.getItem(location);
    return dataFromLocalStorage !== null
      ? JSON.parse(dataFromLocalStorage)
      : [];
  }
}
