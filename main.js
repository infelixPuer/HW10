import { HashTable } from "./hashtable.js";

function testInsertion() {
    const hashTable = new HashTable();
    hashTable.insert('key1', 'value1');
    const value = hashTable.get('key1');
    console.assert(value === 'value1', 'Test Insertion Failed');
    console.log('Test Insertion Passed');
}

function testRetrieval() {
    const hashTable = new HashTable();
    hashTable.insert('key2', 'value2');
    const value = hashTable.get('key2');
    console.assert(value === 'value2', 'Test Retrieval Failed');
    console.log('Test Retrieval Passed');
}

function testDeletion() {
    const hashTable = new HashTable();
    hashTable.insert('key3', 'value3');
    hashTable.delete('key3');
    try {
        hashTable.get('key3');
    } catch (error) {
        console.assert(error.message === "HashTable doesn't contain a key3 key!", 'Test Deletion Failed');
        console.log('Test Deletion Passed');
        return;
    }
    console.error('Test Deletion Failed');
}

function testDuplicateKeys() {
    const hashTable = new HashTable();
    hashTable.insert('key4', 'value4');
    try {
        hashTable.insert('key4', 'value4Duplicate');
    } catch (error) {
        console.assert(error.message === 'HashTable already contains key4 key!', 'Test Duplicate Keys Failed');
        console.log('Test Duplicate Keys Passed');
        return;
    }
    console.error('Test Duplicate Keys Failed');
}

function testResizing() {
    const hashTable = new HashTable();
    for (let i = 1; i <= 10; i++) {
        hashTable.insert(`key${i}`, `value${i}`);
    }
    for (let i = 1; i <= 10; i++) {
        const value = hashTable.get(`key${i}`);
        console.assert(value === `value${i}`, `Test Resizing Failed on key${i}`);
    }
    console.log('Test Resizing Passed');
}

function runTests() {
    testInsertion();
    testRetrieval();
    testDeletion();
    testDuplicateKeys();
    testResizing();
}

runTests();
