# Caching

With the new weakref's, it feels stupid to keep a reference to an cached object, because this way, it will never be
deleted in the memory. Working with TTL's and such feel like a hack and not that practical.

Lets (ab)use the garbage collector for caching. What would be best for caching, is a WeakMap with primitive types. With
the modern stuff of WeakRef's, that's possible.

# Abstract example

```typescript
import {WeakCache} from 'weak-cache-map';

// Just so we have some proper typing, e.g. mongoose has this implementation
type DBModel<T> = { findOne(filter: { _id: string }): Promise<T> }; 

// Imagen some abstract super class that represents a repository for a model
abstract class Repository<T> {

    private cache = new WeakCache<string, T>;

    constructor(private dbModel: DBModel) {

    }
    
    async fetch(id: string) {
        // See if the id's model is still in memory, ifso return it
        const cached = this.cache.get(id);
        if (cached) return cached;

        // get a fresh copy of the database model, and put it in the cache
        const fresh = await this.dbModel.findOne({_id: id});
        if (fresh) this.cache.set(id, fresh);
        return fresh;
    }

    // Silly example it can loop over all weak references
    async getAllModelsInMemory() {
        return Array.from(this.cache.values());
    }

}
```