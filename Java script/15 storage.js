// storage.js

// JavaScript Storage: Local Storage and Session Storage

// 1. Local Storage
// Local Storage allows you to store data with no expiration time. 
// Data persists even after the browser is closed and reopened.

// Example: Setting, Getting, and Removing Data in Local Storage
localStorage.setItem('key', 'value'); // Store data
console.log(localStorage.getItem('key')); // Retrieve data
localStorage.removeItem('key'); // Remove data
localStorage.clear(); // Clear all data

// Use Case: Storing user preferences
localStorage.setItem('theme', 'dark');
console.log(localStorage.getItem('theme')); // Output: 'dark'

// 2. Session Storage
// Session Storage stores data for the duration of the page session. 
// Data is cleared when the page or browser tab is closed.

// Example: Setting, Getting, and Removing Data in Session Storage
sessionStorage.setItem('sessionKey', 'sessionValue'); // Store data
console.log(sessionStorage.getItem('sessionKey')); // Retrieve data
sessionStorage.removeItem('sessionKey'); // Remove data
sessionStorage.clear(); // Clear all data

// Use Case: Storing temporary data
sessionStorage.setItem('cart', JSON.stringify({ item: 'Book', quantity: 1 }));
console.log(JSON.parse(sessionStorage.getItem('cart'))); // Output: { item: 'Book', quantity: 1 }

// 3. Differences Between Local Storage and Session Storage
// - Local Storage persists data even after the browser is closed.
// - Session Storage clears data when the tab or browser is closed.

// 4. Limitations of Web Storage
// - Storage size is limited (usually 5-10MB).
// - Only stores strings. Use JSON.stringify() and JSON.parse() for objects.
// - Data is accessible by JavaScript, so sensitive data should not be stored.

// 5. Example: Using Storage for a Simple Counter
const counterKey = 'counter';
let counter = parseInt(localStorage.getItem(counterKey)) || 0;

function incrementCounter() {
    counter++;
    localStorage.setItem(counterKey, counter);
    console.log(`Counter: ${counter}`);
}

incrementCounter(); // Call this function to increment and store the counter

// 6. Conclusion
// Web Storage (Local Storage and Session Storage) provides a simple way to store data on the client side.
// It is useful for persisting user preferences, session data, and temporary information without server-side storage.   
// Always consider security and storage limits when using Web Storage.  

// 7. IndexDB and Cookies

// 7. IndexedDB
// IndexedDB is a low-level API for client-side storage of significant amounts of structured data, including files/blobs.
// It is asynchronous and provides more capabilities compared to Local Storage and Session Storage.

// Example: Using IndexedDB
const request = indexedDB.open('MyDatabase', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('MyStore')) {
        db.createObjectStore('MyStore', { keyPath: 'id' });
    }
};

request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction('MyStore', 'readwrite');
    const store = transaction.objectStore('MyStore');
    store.add({ id: 1, name: 'Item 1' });
    const getRequest = store.get(1);
    getRequest.onsuccess = function () {
        console.log(getRequest.result); // Output: { id: 1, name: 'Item 1' }
    };
};

request.onerror = function () {
    console.error('Error opening IndexedDB');
};

// Use Case: Storing large datasets, offline applications, and complex data structures.

// 8. Cookies
// Cookies are small pieces of data stored on the client side, sent with every HTTP request to the server.
// They are often used for session management, user authentication, and tracking.

// Example: Setting, Getting, and Deleting Cookies
document.cookie = 'username=JohnDoe; path=/; max-age=3600'; // Set a cookie
console.log(document.cookie); // Retrieve all cookies
document.cookie = 'username=; path=/; max-age=0'; // Delete a cookie

// Use Case: Storing session tokens, user preferences, and small amounts of data.

// 9. WebSQL (Deprecated)
// WebSQL is a deprecated API for storing data in a SQL database on the client side.
// It is no longer recommended for use and has been replaced by IndexedDB.

// 10. Service Workers and Cache API
// Service Workers and the Cache API are used for caching resources like HTML, CSS, JavaScript, and images.
// They are commonly used in Progressive Web Apps (PWAs) to enable offline functionality.

// Example: Using Cache API
if ('caches' in window) {
    caches.open('my-cache').then(cache => {
        cache.add('/index.html');
        cache.match('/index.html').then(response => {
            if (response) {
                console.log('Cached response:', response);
            }
        });
    });
}

// Use Case: Caching assets for offline access and improving performance.

// Summary
// - IndexedDB: For large, structured data.
// - Cookies: For small data, sent with HTTP requests.
// - WebSQL: Deprecated, avoid using.
// - Cache API: For caching resources in PWAs.
// Choose the appropriate storage medium based on your application's requirements.


// End of storage.js
