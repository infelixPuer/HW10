// HashTable class is my implementation of the hashtables
// It uses custom hash function for hashing keys of the elements
// Besides basic functionality: insert, get, delete - I also added dynamic resizing
// If HashTable's loadFactor is too high or too small, then it gets resized in order to improve performance
// As a collision resolving technique I chose separate chaining
export class HashTable {
    #maxLoadFactor = 2;

    constructor() {
        this.bucketCount = 1;
        this.buckets = [];
        this.count = 0;
    }

    // This custom hash function is converting key value to a string, retrieves char codes of that string, adds this to
    // result and then uses modulo operator to get the index of the end result based on the number of current buckets
    hash(key) {
        let strKey = key.toString();
        let result = 0;

        for (let i = 0; i < strKey.length; i++) {
            result = (result + strKey.charCodeAt(i)) % this.bucketCount;
        }

        return result;
    }

    // This function linearly copies the items from old buckets array to the new one
    // It also reuses insert function, that's why we need to subtract from the count property in order to save the
    // original count of the elements
    #resize(newBucketCount) {
        let oldBuckets = this.buckets;
        this.bucketCount = newBucketCount;
        this.buckets = [];

        for (let hash of oldBuckets) {
            this.insert(hash.key, hash.value);
            this.count--;

            if (!hash.next) break;

            let item = hash.next;

            while (true) {
                this.insert(item.key, item.value);
                this.count--;

                if (!item.next) break;

                item = item.next;
            }
        }

    }

    // This function insert a value based on the hash of the key
    // During the insertion the load factor gets calculated
    // If it's too high, then the HashTable gets resized
    // For collision detection this function uses separate chaining method
    // In the best case scenario this method runs with O(1) time complexity
    // In the worst case scenario this method runs with O(n) time complexity
    insert(key, value) {
        const loadFactor = this.count / this.bucketCount;

        if (loadFactor >= this.#maxLoadFactor) this.#resize(this.bucketCount * 2);

        let hashedKey = this.hash(key);

        if (this.buckets[hashedKey] === undefined) {
            this.buckets[hashedKey] = {
                key: key,
                value: value,
                next: null
            };
            this.count++;
            return;
        }

        if (this.buckets[hashedKey].key === key)
            throw new Error(`HashTable already contains ${key} key!`);

        let item = this.buckets[hashedKey];

        while (true) {
            if (item.next === null) break;
            item = item.next;
        }

        item.next = {
            key: key,
            value: value,
            next: null
        };
        this.count++;
    }

    // This method returns an element based on the key
    // In the best case scenario this method runs with O(1) time complexity
    // In the worst case scenario this method runs with O(n) time complexity
    get(key) {
        let hashedKey = this.hash(key);

        let item = this.buckets[hashedKey];

        if (!item) throw new Error(`HashTable doesn't contain a ${key} key!`);

        if (item.key === key) return item.value;

        while (true) {
            if (!item.next) throw new Error(`HashTable doesn't contain a ${key} key!`);

            if (item.next.key === key) return item.next.value;

            item = item.next;
        }
    }

    // This method deletes the element based on the key value
    // During the deletion the HashTable might get resized if the load factor becomes too small
    // In the best case scenario this method runs with O(1) time complexity
    // In the worst case scenario this method runs with O(n) time complexity
    delete(key) {
        const loadFactor = this.count / this.bucketCount;

        if (loadFactor <= this.#maxLoadFactor * 0.25) this.#resize(this.bucketCount * 0.5);

        let hashedKey = this.hash(key);

        let item = this.buckets[hashedKey];

        if (!item) throw new Error(`HashTable doesn't contain a ${key} key!`);

        if (item.key === key) {
            if (!item.next) {
                this.buckets[hashedKey] = undefined;
                this.count--;
                return;
            }

            this.buckets[hashedKey] = item.next;
            this.count--;
            return;
         }

        while (true) {
            if (item.next.key === key) {
                if (!item.next.next)
                    item.next = undefined;
                else
                    item.next = item.next.next;

                this.count--;
                return;
            }

            item = item.next;
        }
    }
}