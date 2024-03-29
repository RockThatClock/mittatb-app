import {v4 as uuid} from 'uuid';
import storage, {StorageModelTypes} from '../storage';
import {FavoriteDeparture, LocationFavorite, UserFavorites} from './types';

export type StoredType<T> = {
  id: string;
} & T;
class FavoriteStore<T = LocationFavorite | FavoriteDeparture> {
  key: StorageModelTypes;

  constructor(key: StorageModelTypes) {
    this.key = key;
  }

  async getFavorites(): Promise<StoredType<T>[]> {
    const userLocations = await storage.get(this.key);
    let data = (userLocations ? JSON.parse(userLocations) : []) as StoredType<
      T
    >[];
    return data;
  }

  async setFavorites(favorites: StoredType<T>[]): Promise<StoredType<T>[]> {
    await storage.set(this.key, JSON.stringify(favorites));
    return favorites;
  }

  async addFavorite(favorite: T): Promise<StoredType<T>[]> {
    let favorites = await this.getFavorites();
    favorites = favorites.concat({...favorite, id: uuid()});
    return await this.setFavorites(favorites);
  }

  async removeFavorite(id: string): Promise<StoredType<T>[]> {
    let favorites = await this.getFavorites();
    favorites = favorites.filter((item) => item.id !== id);
    return await this.setFavorites(favorites);
  }

  async updateFavorite(favorite: StoredType<T>): Promise<StoredType<T>[]> {
    let favorites = await this.getFavorites();
    favorites = favorites.map((item) => {
      if (item.id !== favorite.id) {
        return item;
      }
      return favorite;
    });
    return await this.setFavorites(favorites);
  }
}

export const places = new FavoriteStore<LocationFavorite>(
  'stored_user_locations',
);
export const departures = new FavoriteStore<FavoriteDeparture>(
  '@ATB_user_departures',
);
