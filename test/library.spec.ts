import { Library } from '../src/library';

describe('Library', () => {
  let library: Library<number>;

  beforeEach(() => {
    library = new Library<number>();
  });

  describe('addItem', () => {
    it('should add an item to the library', () => {
      library.addItem(1);
      if (library.getItems().length !== 1 || library.getItems()[0] !== 1) {
        throw new Error('Item was not added correctly');
      }
    });
  });

  describe('removeItem', () => {
    it('should remove an item from the library by index', () => {
      library.addItem(1);
      library.addItem(2);
      library.removeItem(0);
      if (library.getItems().length !== 1 || library.getItems()[0] !== 2) {
        throw new Error('Item was not removed correctly');
      }
    });

    it('should not remove an item if the index is out of bounds', () => {
      library.addItem(1);
      library.removeItem(1);
      if (library.getItems().length !== 1 || library.getItems()[0] !== 1) {
        throw new Error('Item should not have been removed');
      }
    });
  });

  describe('findItem', () => {
    it('should find an item based on the callback', () => {
      library.addItem(1);
      library.addItem(2);
      const foundItem = library.findItem((item) => item === 2);
      if (foundItem !== 2) {
        throw new Error('Item was not found correctly');
      }
    });

    it('should return undefined if no item is found', () => {
      library.addItem(1);
      const foundItem = library.findItem((item) => item === 2);
      if (foundItem !== undefined) {
        throw new Error('Found an item when it should have been undefined');
      }
    });
  });

  describe('getItems', () => {
    it('should return all items in the library', () => {
      library.addItem(1);
      library.addItem(2);
      if (JSON.stringify(library.getItems()) !== JSON.stringify([1, 2])) {
        throw new Error('Items returned incorrectly');
      }
    });
  });
});
