import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RemotestorageService {

  constructor() { }

  /**
 * An array that stores the list of users.
 * 
 * @type {Array}
 */
users: Array<any> = [];

/**
 * An array that stores the information of the currently logged-in user.
 * 
 * @type {Array}
 */
currentUser: Array<any> = [];

/**
 * An array that stores the information of the guest user.
 * 
 * @type {Array}
 */
guestUser: Array<any> = [];

  /**
 * Constant containing the access token for the external Storage API.
 * @type {string}
 */
STORAGE_TOKEN:string = 'WWCFLUK55Y0NZOV62RJWIKDXF031FRQVNX8YOFG5';

/**
 * Constant containing the URL for accessing the external Storage API.
 * @type {string}
 */
STORAGE_URL:string = 'https://remote-storage.developerakademie.org/item';

/**
 * Function to save a value under a specific key in the external Storage API.
 * @param {string} key - The key under which the value will be stored.
 * @param {any} value - The value to be stored.
 * @returns {Promise<object>} - A Promise that resolves to the response data from the API.
 */
async setItem(key:string, value:any) {
    // Create a payload object containing the key, value, and access token.
    const payload = { key, value, token: this.STORAGE_TOKEN };
    
    // Send a POST request to the external Storage API to store the value.
    return fetch(this.STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
};


/**
 * Function to retrieve a value from the external Storage API based on a key.
 * @param {string} key - The key associated with the value to be retrieved.
 * @returns {Promise<any>} - A Promise that resolves to the retrieved value from the API.
 * @throws {string} - Throws an error message if the specified key is not found in the API response.
 */
async getItem(key: string) {
    // Create the URL for the GET request containing the key and access token.
    const url = `${this.STORAGE_URL}?key=${key}&token=${this.STORAGE_TOKEN}`;
    
    // Send a GET request to the external Storage API to retrieve the value.
    return fetch(url)
        .then(res => res.json())
        .then(res => {
            // Check if a value with the specified key was found.
            if (res.data) {
                // If a value is found, return the retrieved value.
                return res.data.value;
            }
            // If no value with the specified key is found, throw an error message.
            throw `Could not find data with key "${key}".`;
        });
};
}
